/**
 * Analytics Service
 * 
 * Zentrale Implementierung für Analytics-Tracking mit Supabase Integration.
 * Sammelt und versendet Nutzungsdaten und Ereignisse, gemäß den Datenschutzeinstellungen.
 * 
 * Dieser Service stellt eine umfassende Lösung für das App-weite Event-Tracking bereit:
 * - Sammelt und puffert Events in einer Queue für effiziente Übertragung
 * - Verwaltet Sessions und Benutzer-Identifikation
 * - Implementiert Datenschutz-Kontrollen gemäß den App-Einstellungen
 * - Unterstützt batch-basierte Übertragung an ein Backend (Supabase)
 * - Bietet erweiterte Fehlerbehandlung und Logging
 * 
 * Der Service ist als Singleton konzipiert und wird beim App-Start
 * initialisiert, um eine konsistente Tracking-Umgebung zu gewährleisten.
 * 
 * Verwendung:
 * ```
 * // Event tracken
 * analyticsService.trackEvent('button_clicked', { buttonId: 'login' });
 * 
 * // Manuelles Flushen (normalerweise nicht nötig, da automatisch)
 * analyticsService.flushEvents();
 * ```
 */

import { Platform } from 'react-native';
// Entferne uuid-Import
// import { v4 as uuidv4 } from 'uuid';

import { config } from '@/config/app/env';
import { logger } from '@/utils/logger';
import { StoreEventType, storeEvents, StoreEventPayloads } from '@/utils/store/storeEvents';

/**
 * Generiert eine UUID v4 ohne Abhängigkeit von crypto.getRandomValues()
 *
 * Diese Hilfsfunktion erstellt eine zufällige UUID mit Math.random()
 * statt der Web Crypto API, um Kompatibilitätsprobleme auf React Native zu vermeiden.
 * @returns {string} UUID v4 formatierte Zeichenfolge
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Konstanten
const MAX_BATCH_SIZE = 20;
const FLUSH_INTERVAL = 60000; // 1 Minute

/**
 * Typ für Event-Parameter
 */
type EventParams = Record<string, string | number | boolean | null | undefined>;

// Typen
/**
 * Interface für ein einzelnes Analytics-Event
 * 
 * Definiert die Struktur der Ereignisdaten, wie sie in der Queue
 * gespeichert und schließlich an das Backend übermittelt werden.
 */
interface AnalyticsEvent {
  /**
   * Eindeutige ID des Events für die Vermeidung von Duplikaten
   */
  id: string;
  
  /**
   * Name des Events (z.B. 'search_performed', 'user_login')
   */
  event_name: string;
  
  /**
   * Parameter des Events als JSON-Objekt mit zusätzlichen Informationen
   */
  event_params: EventParams;
  
  /**
   * ISO-Datums-String, wann das Event ausgelöst wurde
   */
  timestamp: string;
  
  /**
   * Session-ID zur Gruppierung zusammenhängender Events
   */
  session_id: string;
  
  /**
   * Benutzer-ID, falls der Benutzer angemeldet ist
   */
  user_id?: string;
  
  /**
   * Plattform (iOS/Android)
   */
  platform: string;
  
  /**
   * App-Version für Versions-spezifische Analysen
   */
  app_version: string;
}

// Cache für die aktuelle Benutzer-ID
let currentUserId: string | null = null;

// Queue für das Sammeln von Events vor dem Senden
let eventQueue: AnalyticsEvent[] = [];
let sessionId: string | null = null;
let flushTimeout: NodeJS.Timeout | null = null;

// Referenz zum Event-Listener für die Benutzerstatusaktualisierung
let userStateListener: ((payload: StoreEventPayloads[StoreEventType.USER_STATE_CHANGED]) => void) | null = null;

/**
 * Initialisiert den Analytics-Service
 *
 * Diese Methode sollte beim Start der App aufgerufen werden. Sie erstellt eine
 * neue Session-ID und startet den Timer für das automatische Flushen der Event-Queue.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist
 * @example
 * // In der App-Initialisierungslogik
 * useEffect(() => {
 *   analyticsService.initAnalytics();
 *   return () => analyticsService.shutdownAnalytics();
 * }, []);
 */
export const initAnalytics = async (): Promise<void> => {
  try {
    // Session-ID generieren oder aus dem lokalen Speicher laden
    sessionId = generateUUID();
    
    // Event-Listener für Benutzeränderungen registrieren
    userStateListener = (payload) => {
      currentUserId = payload.userId;
      logger.debug('[Analytics] Benutzer-ID aktualisiert:', currentUserId);
    };
    
    storeEvents.on(StoreEventType.USER_STATE_CHANGED, userStateListener);
    
    // Flush-Timeout starten
    startFlushTimer();
    
    logger.info('[Analytics] Initialisiert mit Session ID:', sessionId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[Analytics] Fehler bei der Initialisierung:', errorMessage);
  }
};

/**
 * Erfasst ein Event und fügt es zur Queue hinzu
 *
 * Diese Methode ist der Haupteinstiegspunkt für das Tracking von Events in der App.
 * Sie fügt das Event zur Queue hinzufügen und löst ggf. ein automatisches Flushen aus,
 * wenn die Queue-Größe den Grenzwert erreicht.
 * @param {string} eventName Name des Events
 * @param {EventParams} eventParams Parameter des Events
 * @returns {Promise<boolean>} True, wenn das Tracking erfolgreich war
 * @example
 * // Einfaches Event tracken
 * analyticsService.trackEvent('page_view', { pageName: 'Home' });
 * 
 * // Event mit komplexeren Parametern
 * analyticsService.trackEvent('form_submit', {
 *   formId: 'contact',
 *   timeToComplete: 45,
 *   fieldCount: 5,
 *   isValid: true
 * });
 */
export const trackEvent = async (
  eventName: string,
  eventParams: EventParams = {}
): Promise<boolean> => {
  try {
    // Prüfen, ob Analytics aktiviert ist
    if (!config.enableAnalytics) {
      if (__DEV__) {
        logger.debug(`[Analytics] Event nicht getrackt (deaktiviert): ${eventName}`, eventParams);
      }
      return false;
    }
    
    const event: AnalyticsEvent = {
      id: generateUUID(),
      event_name: eventName,
      event_params: eventParams,
      timestamp: new Date().toISOString(),
      session_id: sessionId || 'unknown-session',
      user_id: currentUserId || undefined,
      platform: Platform.OS,
      app_version: '1.0.0', // TODO: Aus ExpoConfig holen
    };
    
    // Event zur Queue hinzufügen
    eventQueue.push(event);
    
    // Log im Entwicklungsmodus
    if (__DEV__) {
      logger.debug(`[Analytics] Event zur Queue hinzugefügt: ${eventName}`, {
        event_params: eventParams,
        queue_size: eventQueue.length,
      });
    }
    
    // Queue flushen, wenn sie voll ist
    if (eventQueue.length >= MAX_BATCH_SIZE) {
      await flushEvents();
    }
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[Analytics] Fehler beim Tracking:', errorMessage);
    return false;
  }
};

/**
 * Sendet alle Events in der Queue an Supabase
 *
 * Diese Methode überträgt die gesammelten Events an das Backend-System.
 * In der Entwicklungsphase werden die Events nur geloggt und nicht tatsächlich gesendet.
 * In der Produktionsphase werden sie in einem Batch an Supabase übermittelt.
 *
 * In der aktuellen MVP-Phase ist die tatsächliche Übermittlung an Supabase
 * noch nicht implementiert und wird für eine spätere Version vorbereitet.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn das Flushen abgeschlossen ist
 * @example
 * // Manuelles Flushen der Event-Queue
 * await analyticsService.flushEvents();
 */
export const flushEvents = async (): Promise<void> => {
  try {
    if (eventQueue.length === 0) {
      return;
    }
    
    if (__DEV__) {
      logger.debug(`[Analytics] ${eventQueue.length} Events zum Senden bereit`);
      logger.debug('[Analytics] Events:', JSON.stringify(eventQueue.slice(0, 3)));
      
      // In der Entwicklung nur loggen, nicht senden
      eventQueue = [];
      return;
    }
    
    // Kopie der Queue erstellen und leeren
    const events = [...eventQueue];
    eventQueue = [];
    
    // TODO: Wenn Supabase eingerichtet ist, Events senden
    // Implementierung für spätere Supabase-Integration
    logger.info(`[Analytics] ${events.length} Events simuliert gesendet (Supabase noch nicht implementiert)`);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[Analytics] Fehler beim Flushen der Events:', errorMessage);
  }
};

/**
 * Startet den Timer zum regelmäßigen Flushen der Events
 *
 * Diese private Methode stellt sicher, dass Events in regelmäßigen Abständen
 * an das Backend übermittelt werden, auch wenn die Queue nicht voll wird.
 * @private
 */
const startFlushTimer = (): void => {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
  }
  
  flushTimeout = setInterval(async () => {
    await flushEvents();
  }, FLUSH_INTERVAL);
};

/**
 * Beendet den Analytics-Service und sendet verbleibende Events
 *
 * Diese Methode sollte beim Herunterfahren der App aufgerufen werden,
 * um sicherzustellen, dass alle gesammelten Events übermittelt werden.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn das Herunterfahren abgeschlossen ist
 * @example
 * // In der App-Cleanup-Logik
 * useEffect(() => {
 *   // Initialisierung
 *   return () => analyticsService.shutdownAnalytics();
 * }, []);
 */
export const shutdownAnalytics = async (): Promise<void> => {
  try {
    // Timer stoppen
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }
    
    // Event-Listener entfernen, wenn er existiert
    if (userStateListener) {
      storeEvents.off(StoreEventType.USER_STATE_CHANGED, userStateListener);
      userStateListener = null;
    }
    
    // Verbleibende Events flushen
    await flushEvents();
    
    logger.info('[Analytics] Service heruntergefahren');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[Analytics] Fehler beim Herunterfahren:', errorMessage);
  }
};

/**
 * Objekt mit allen Analytics-Funktionen für Export
 */
export const analyticsService = {
  initAnalytics,
  trackEvent,
  flushEvents,
  shutdownAnalytics,
}; 