/**
 * useModeManager Hook - Spezialisierter Hook für erweiterte Mode-Operationen
 * 
 * Bietet erweiterte Funktionalität für komplexe Use-Cases über den Basis-Hook hinaus,
 * einschließlich erweiterter Modus-Logik, UI-Integration und Performance-Optimierungen.
 * 
 * WICHTIG: Die Mode-Logik wird NUR im DevBuild implementiert. Dabei spiegelt der
 * Demo-Mode den DemoBuild wider und der Live-Mode den LiveBuild.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {AppStateStatus} from 'react-native';


import { useAuth } from '@/hooks/useAuth';
import {AppMode, UserStatus} from '@/types/common/appMode';
import { logger } from '@/utils/logger';

import { useAppState } from './useAppState';
import { useMode } from './useMode';
import { useNetStatus } from './useNetStatus';

// Typdefinition für das Ergebnis eines Moduswechsels
export interface SwitchModeResult {
  success: boolean;
  newMode: AppMode;
  requiresAuth: boolean;
  error?: string;
}

// Vereinfachte Interface-Definitionen
interface SessionService {
  hasValidLiveSession: () => Promise<boolean>;
  resetSession: () => Promise<void>;
}

// Einfacher Mock des Session-Service
const sessionService: SessionService = {
  hasValidLiveSession: async () => true,
  resetSession: async () => {}
};

/**
 * Rückgabetyp für den erweiterten useModeManager-Hook
 */
export interface UseModeManagerResult {
  // Basis-Zustände (von useMode)
  currentAppMode: AppMode;
  userStatus: UserStatus;
  isDemoMode: () => boolean;
  isLiveMode: () => boolean;
  isDemoAccount: boolean;
  isChangingMode: boolean;
  
  // Erweiterte Zustandsinformationen
  isSessionValid: boolean;
  isLoggingIn: boolean;
  needsReauthentication: boolean;
  canSwitchToDemoMode: boolean;
  canSwitchToLiveMode: boolean;
  hasNetworkConnection: boolean;
  appState: AppStateStatus;
  
  // Erweiterte Modus-Wechsel-Funktionen
  switchToDemoMode: () => Promise<SwitchModeResult>;
  switchToLiveMode: () => Promise<SwitchModeResult>;
  switchToMode: (targetMode: AppMode) => Promise<SwitchModeResult>;
  
  // Erweiterte Session-Funktionen
  checkLiveSession: () => Promise<boolean>;
  resetSession: () => Promise<void>;
  
  // UI-Feedback-Funktionen
  showModeChangeMessage: (newMode: AppMode) => void;
  clearModeChangeMessage: () => void;
  getModeDisplayName: (mode: AppMode) => string;
  
  // Fehlerbehandlung
  lastError: string | null;
  resetModeError: () => void;
  
  // Performance-Optimierungen
  deferAction: <T>(action: () => Promise<T>) => Promise<T>;
}

/**
 * Hook für erweitertes Management des App-Modus mit zusätzlichen Funktionen
 *
 * Baut auf dem Basis-Mode-Hook auf und bietet zusätzliche Funktionalität für
 * komplexere Anwendungsfälle, einschließlich erweiterter Modus-Logik,
 * UI-Integration und Performance-Optimierungen.
 * @returns {UseModeManagerResult} Erweiterte Funktionen für Mode-Management
 */
export function useModeManager(): UseModeManagerResult {
  // Basis-Mode-Hook
  const modeHook = useMode();
  
  // Weitere Hooks - WICHTIG: alle Hooks müssen vor irgendwelchen bedingten Anweisungen kommen
  const { isAuthenticated } = useAuth();
  const { isConnected } = useNetStatus();
  const { appState } = useAppState();
  
  // Refs für Performance-Optimierungen
  const pendingActionsRef = useRef<Array<() => void>>([]);
  const isProcessingRef = useRef<boolean>(false);
  
  // Abgeleitete Zustände für UI-Feedback
  const canSwitchToDemoMode = useMemo(() => {
    return modeHook.canSwitchModes && 
           !modeHook.isChangingMode && 
           !modeHook.isDemoMode() && 
           isConnected;
  }, [modeHook, isConnected]);
  
  const canSwitchToLiveMode = useMemo(() => {
    return modeHook.canSwitchModes && 
           !modeHook.isChangingMode && 
           !modeHook.isLiveMode() && 
           isConnected;
  }, [modeHook, isConnected]);
  
  /**
   * Prüft, ob eine gültige Live-Session existiert
   * @returns {Promise<boolean>} true wenn eine gültige Session existiert
   */
  const checkLiveSession = useCallback(async (): Promise<boolean> => {
    // Wenn nicht im Live-Modus, gibt es keine gültige Live-Session
    if (!modeHook.isLiveMode()) {
      return false;
    }
    
    // Wenn authentifiziert über Store, sofort true zurückgeben
    if (isAuthenticated) {
      return true;
    }
    
    // AsyncStorage-Flag als Fallback prüfen
    try {
      const isRegistered = await AsyncStorage.getItem('auth_registered');
      return isRegistered === 'true';
    } catch (error) {
      logger.error('Fehler beim Prüfen des Registrierungsstatus', 
        error instanceof Error ? error.message : String(error));
      return false;
    }
  }, [modeHook, isAuthenticated]);
  
  /**
   * Session zurücksetzen (z.B. bei Logout)
   */
  const resetSession = useCallback(async (): Promise<void> => {
    try {
      await sessionService.resetSession();
    } catch (error: unknown) {
      logger.error('Fehler beim Zurücksetzen der Session', {
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }, []);
  
  /**
   * Zeigt eine Nachricht über den Moduswechsel an
   * @param {AppMode} newMode - Der neue Modus
   */
  const showModeChangeMessage = useCallback((newMode: AppMode): void => {
    // Hinweis: Hier kann die Implementierung für spezifisches UI-Feedback ergänzt werden
    logger.info(`ModeManager: Modus gewechselt zu ${newMode}`);
  }, []);
  
  /**
   * Löscht die Nachricht über den Moduswechsel
   */
  const clearModeChangeMessage = useCallback((): void => {
    // Hinweis: Hier kann die Implementierung für spezifisches UI-Feedback ergänzt werden
  }, []);
  
  /**
   * Gibt einen benutzerfreundlichen Namen für einen Modus zurück
   * @param {AppMode} mode - Der Modus
   * @returns {string} Der Anzeigename
   */
  const getModeDisplayName = useCallback((mode: AppMode): string => {
    switch (mode) {
      case 'demo':
        return 'Demo-Modus';
      case 'live':
        return 'Live-Modus';
      case 'development':
        return 'Entwicklungsmodus';
      default:
        return 'Unbekannter Modus';
    }
  }, []);
  
  /**
   * Führt einen Moduswechsel durch mit erweiterten Prüfungen und Fehlerbehandlung
   * @param {AppMode} targetMode - Der Ziel-Modus
   * @returns {Promise<SwitchModeResult>} Detailliertes Ergebnis des Moduswechsels
   */
  const switchToMode = useCallback(async (targetMode: AppMode): Promise<SwitchModeResult> => {
    logger.info(`[DEBUG] switchToMode aufgerufen mit targetMode=${targetMode}`);
    logger.info(`ModeManager: Wechsel zu ${targetMode}-Modus angefordert`);
    logger.info(`Aktuelle Modi: isDemo=${modeHook.isDemoMode()}, currentMode=${modeHook.currentAppMode}`);

    // Ergebnisobjekt für Fehlerfälle vorbereiten
    const errorResult = (error: string): SwitchModeResult => ({
      success: false,
      newMode: modeHook.currentAppMode,
      requiresAuth: false,
      error
    });

    try {
      // Netzwerkverbindung prüfen
      if (!isConnected && targetMode === 'live') {
        logger.warn('ModeManager: Moduswechsel zu Live ohne Netzwerkverbindung nicht möglich');
        return errorResult('Keine Netzwerkverbindung verfügbar');
      }
  
      // Prüfe Authentifizierung über Store UND AsyncStorage-Flag
      if (targetMode === 'live' && !isAuthenticated) {
        try {
          // Zusätzlich AsyncStorage-Flag prüfen
          const isRegistered = await AsyncStorage.getItem('auth_registered');
          logger.info(`Registrierungsstatus aus AsyncStorage: ${isRegistered}`);
          
          if (isRegistered === 'true') {
            try {
              // Wenn registriert, Moduswechsel trotzdem erlauben
              logger.info('Nutzer ist registriert, versuche Moduswechsel zu Live...');
              const success = await modeHook.setAppMode(targetMode);
              
              if (success) {
                logger.info('Moduswechsel erfolgreich durchgeführt');
                showModeChangeMessage(targetMode);
                return {
                  success: true,
                  newMode: targetMode,
                  requiresAuth: false
                };
              } else {
                logger.error(`Moduswechsel fehlgeschlagen: ${modeHook.lastError || 'Unbekannter Fehler'}`);
              }
            } catch (setAppModeError) {
              logger.error('Fehler beim Setzen des App-Modus:', 
                setAppModeError instanceof Error ? setAppModeError.message : String(setAppModeError));
            }
          }
        } catch (storageError) {
          logger.error('Fehler beim Prüfen des Registrierungsstatus', 
            storageError instanceof Error ? storageError.message : String(storageError));
        }
        
        // Wenn nicht authentifiziert und nicht registriert, einfach Fehler zurückgeben
        logger.info('ModeManager: Authentifizierung für Live-Modus erforderlich');
        return errorResult('Authentifizierung erforderlich');
      }
  
      // Moduswechsel durchführen
      try {
        logger.info(`Versuche Moduswechsel zu ${targetMode}...`);
        const success = await modeHook.setAppMode(targetMode);
        
        if (success) {
          logger.info(`Moduswechsel zu ${targetMode} erfolgreich durchgeführt`);
          showModeChangeMessage(targetMode);
          return {
            success: true,
            newMode: targetMode,
            requiresAuth: false
          };
        } else {
          const errorMessage = modeHook.lastError || 'Unbekannter Fehler beim Moduswechsel';
          logger.error(`Moduswechsel fehlgeschlagen: ${errorMessage}`);
          return errorResult(errorMessage);
        }
      } catch (changeError) {
        logger.error(`Fehler beim Wechsel zum ${targetMode}-Modus`, {
          error: changeError instanceof Error ? changeError.message : String(changeError)
        });
        return errorResult(changeError instanceof Error ? changeError.message : String(changeError));
      }
    } catch (outerError) {
      // Fange alle unerwarteten Fehler ab
      logger.error('Unerwarteter Fehler beim Moduswechsel:', 
        outerError instanceof Error ? outerError.message : String(outerError));
      return errorResult('Unerwarteter Fehler beim Moduswechsel');
    }
  }, [modeHook, isConnected, isAuthenticated, showModeChangeMessage]);
  
  /**
   * Wechselt speziell in den Demo-Modus
   */
  const switchToDemoMode = useCallback((): Promise<SwitchModeResult> => {
    return switchToMode('demo');
  }, [switchToMode]);
  
  /**
   * Wechselt speziell in den Live-Modus
   */
  const switchToLiveMode = useCallback((): Promise<SwitchModeResult> => {
    return switchToMode('live');
  }, [switchToMode]);
  
  /**
   * Verzögert eine Aktion bis zum nächsten Idle-Zeitpunkt für bessere Performance
   * @template T - Der Rückgabetyp der Aktion
   * @param {() => Promise<T>} action - Die auszuführende Aktion
   * @returns {Promise<T>} Das Ergebnis der Aktion
   */
  const deferAction = useCallback(async <T>(action: () => Promise<T>): Promise<T> => {
    if (isProcessingRef.current) {
      // Wenn bereits Aktionen verarbeitet werden, in Warteschlange einreihen
      return new Promise<T>((resolve, reject) => {
        pendingActionsRef.current.push(async () => {
          try {
            const result = await action();
            resolve(result);
          } catch (error: unknown) {
            reject(error);
          }
        });
      });
    }
    
    try {
      // Markiere als in Verarbeitung
      isProcessingRef.current = true;
      
      // Führe Aktion direkt aus
      return await action();
    } finally {
      // Verarbeite ausstehende Aktionen
      const pending = [...pendingActionsRef.current];
      pendingActionsRef.current = [];
      isProcessingRef.current = false;
      
      // Verarbeite nachfolgende Aktionen asynchron
      if (pending.length > 0) {
        setTimeout(() => {
          pending.forEach(action => action());
        }, 0);
      }
    }
  }, []);
  
  // Vereinfachter Effekt zur Prüfung der Session
  useEffect(() => {
    // Prüfe Session, wenn App aktiv wird oder der Mode wechselt
    if (appState === 'active' && modeHook.isLiveMode()) {
      checkLiveSession().catch(error => {
        logger.error('Fehler bei Session-Prüfung', {
          error: error instanceof Error ? error.message : String(error)
        });
      });
    }
  }, [appState, modeHook.isLiveMode, checkLiveSession, modeHook]);
  
  // Das vollständige Ergebnisobjekt zurückgeben
  return useMemo(() => ({
    // Basis-Zustände vom useMode-Hook
    currentAppMode: modeHook.currentAppMode,
    userStatus: modeHook.userStatus,
    isDemoMode: () => modeHook.isDemoMode(),
    isLiveMode: () => modeHook.isLiveMode(),
    isDemoAccount: modeHook.isDemoAccount,
    isChangingMode: modeHook.isChangingMode,
    
    // Erweiterte Zustandsinformationen
    isSessionValid: false,
    isLoggingIn: false, // Konstanter Wert, da wir den State nicht verwenden
    needsReauthentication: false, // Vereinfacht: immer false
    canSwitchToDemoMode,
    canSwitchToLiveMode,
    hasNetworkConnection: isConnected,
    appState,
    
    // Erweiterte Modus-Wechsel-Funktionen
    switchToDemoMode,
    switchToLiveMode,
    switchToMode,
    
    // Erweiterte Session-Funktionen
    checkLiveSession,
    resetSession,
    
    // UI-Feedback-Funktionen
    showModeChangeMessage,
    clearModeChangeMessage,
    getModeDisplayName,
    
    // Fehlerbehandlung
    lastError: modeHook.lastError,
    resetModeError: modeHook.resetModeError,
    
    // Performance-Optimierungen
    deferAction
  }), [
    modeHook, 
    isConnected, 
    appState, 
    canSwitchToDemoMode, 
    canSwitchToLiveMode,
    switchToDemoMode,
    switchToLiveMode,
    switchToMode,
    checkLiveSession,
    resetSession,
    showModeChangeMessage, 
    clearModeChangeMessage, 
    getModeDisplayName, 
    deferAction
  ]);
} 