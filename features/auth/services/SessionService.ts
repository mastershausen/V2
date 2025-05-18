/**
 * SessionService für die Verwaltung von Benutzer-Sessions
 * 
 * Verantwortlich für:
 * - Speichern und Laden von Session-Daten in Demo- und Live-Modus
 * - Verwaltung von Session-Flags und Status
 * - Unterstützung des App-Lebenszyklus (Start/Beenden)
 */

import { 
  AUTH_STORAGE_KEYS, 
  USER_TYPES,
  isDemoMode,
  isLiveMode,
} from '@/features/auth/config';
import { AuthStatus } from '@/features/auth/types';
import { User , UserSessionData,  } from '@/types/auth';
import { UserType } from '@/types/auth/userTypes';
import { logger } from '@/utils/logger';
import { saveObject, loadObject, removeItem } from '@/utils/storage';

// Erstelle einen bereichsspezifischen Logger
const sessionLogger = logger.create({ prefix: '🔑 Session' });

// Standardbenutzer, der für nicht authentifizierte Sessions verwendet wird
export const DEFAULT_USER = {
  id: 'guest',
  name: 'Gast',
  email: '',
  type: USER_TYPES.GUEST as UserType,
};

/**
 * Interface für Session-Operationen
 * 
 * Dieses Interface definiert die Hauptoperationen, die der SessionService 
 * implementieren muss, und erleichtert das Testen mit Mocks.
 */
export interface ISessionService {
  // Session-Management
  saveSession(user: User, authStatus: AuthStatus): Promise<boolean>;
  loadSession(): Promise<UserSessionData | null>;
  logout(): Promise<boolean>;
  
  // Sitzungsstatus-Flags
  hasValidLiveSession(): Promise<boolean>;
  updateValidLiveSessionStatus(isValid: boolean): Promise<void>;
  
  // Lebenszyklus-Management
  clearOnAppExit(): Promise<void>;
  restoreDefaultState(): Promise<UserSessionData>;
}

/**
 * Interface für Session-Speicheroperationen
 * Unterstützt unterschiedliche Implementierungen für Demo/Live
 */
export interface ISessionStorage {
  saveSession(sessionData: UserSessionData): Promise<boolean>;
  loadSession(): Promise<UserSessionData | null>;
  clearSession(): Promise<boolean>;
  isValidSession(session: UserSessionData | null): boolean;
}

/**
 * Demo-Modus Session-Speicher
 * Implementiert vereinfachtes Session-Management für Demo-Szenarien
 */
export class DemoSessionStorage implements ISessionStorage {
  /**
   *
   * @param sessionData
   */
  async saveSession(sessionData: UserSessionData): Promise<boolean> {
    try {
      const success = await saveObject(AUTH_STORAGE_KEYS.DEMO_SESSION, sessionData);
      
      if (success) {
        sessionLogger.debug('Demo-Sitzung gespeichert', {
          userId: sessionData.user.id,
          type: sessionData.user.type,
        });
      }
      
      return success;
    } catch (error) {
      sessionLogger.error('Fehler beim Speichern der Demo-Sitzung', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
  
  /**
   *
   */
  async loadSession(): Promise<UserSessionData | null> {
    try {
      const sessionData = await loadObject<UserSessionData>(AUTH_STORAGE_KEYS.DEMO_SESSION);
      
      if (sessionData) {
        sessionLogger.debug('Demo-Sitzung geladen', { 
          userId: sessionData.user.id,
          type: sessionData.user.type 
        });
        
        return this.isValidSession(sessionData) ? sessionData : null;
      }
      
      return null;
    } catch (error) {
      sessionLogger.error('Fehler beim Laden der Demo-Sitzung', error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  /**
   *
   */
  async clearSession(): Promise<boolean> {
    try {
      await removeItem(AUTH_STORAGE_KEYS.DEMO_SESSION);
      await saveObject(AUTH_STORAGE_KEYS.RESET_DEMO_SESSION_ON_START, true);
      sessionLogger.debug('Demo-Sitzung zurückgesetzt');
      return true;
    } catch (error) {
      sessionLogger.error('Fehler beim Löschen der Demo-Sitzung', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
  
  /**
   *
   * @param session
   */
  isValidSession(session: UserSessionData | null): boolean {
    if (!session) {
      return false;
    }
    
    if (!session.user || !session.user.id || !session.authStatus) {
      sessionLogger.warn('Ungültige Demo-Sitzung: Fehlende Pflichtfelder');
      return false;
    }
    
    return true;
  }
}

/**
 * Live-Modus Session-Speicher
 * Implementiert robustes Session-Management für produktive Szenarien
 */
export class LiveSessionStorage implements ISessionStorage {
  /**
   *
   * @param sessionData
   */
  async saveSession(sessionData: UserSessionData): Promise<boolean> {
    try {
      const success = await saveObject(AUTH_STORAGE_KEYS.LIVE_SESSION, sessionData);
      
      if (success) {
        sessionLogger.debug('Live-Sitzung gespeichert', {
          userId: sessionData.user.id,
          type: sessionData.user.type,
        });
      }
      
      return success;
    } catch (error) {
      sessionLogger.error('Fehler beim Speichern der Live-Sitzung', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
  
  /**
   *
   */
  async loadSession(): Promise<UserSessionData | null> {
    try {
      const sessionData = await loadObject<UserSessionData>(AUTH_STORAGE_KEYS.LIVE_SESSION);
      
      if (sessionData) {
        sessionLogger.debug('Live-Sitzung geladen', {
          userId: sessionData.user.id,
          type: sessionData.user.type,
        });
        
        return this.isValidSession(sessionData) ? sessionData : null;
      }
      
      return null;
    } catch (error) {
      sessionLogger.error('Fehler beim Laden der Live-Sitzung', error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  /**
   *
   */
  async clearSession(): Promise<boolean> {
    try {
      await removeItem(AUTH_STORAGE_KEYS.LIVE_SESSION);
      await saveObject(AUTH_STORAGE_KEYS.RESET_ON_APP_START, true);
      sessionLogger.debug('Live-Sitzung zurückgesetzt');
      return true;
    } catch (error) {
      sessionLogger.error('Fehler beim Löschen der Live-Sitzung', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
  
  /**
   *
   * @param session
   */
  isValidSession(session: UserSessionData | null): boolean {
    if (!session) {
      return false;
    }
    
    if (!session.user || !session.user.id || !session.authStatus) {
      sessionLogger.warn('Ungültige Live-Sitzung: Fehlende Pflichtfelder', { session });
      return false;
    }
    
    // Bei Live-Sitzungen prüfen wir auch das Alter der Sitzung
    const now = Date.now();
    const sessionAge = now - (session.timestamp || 0);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 Tage
    
    if (sessionAge > maxAge) {
      sessionLogger.warn('Ungültige Live-Sitzung: Zu alt', { 
        age: sessionAge, 
        maxAge, 
        user: session.user.id 
      });
      return false;
    }
    
    return true;
  }
}

/**
 * SessionService-Klasse zur Verwaltung von Benutzer-Sessions
 * 
 * Implementiert das ISessionService-Interface und bietet Methoden zum
 * Speichern, Laden und Verwalten von Sessions in verschiedenen App-Modi.
 */
class SessionService implements ISessionService {
  private demoStorage: ISessionStorage;
  private liveStorage: ISessionStorage;
  
  /**
   *
   * @param demoStorage
   * @param liveStorage
   */
  constructor(
    demoStorage: ISessionStorage = new DemoSessionStorage(),
    liveStorage: ISessionStorage = new LiveSessionStorage()
  ) {
    this.demoStorage = demoStorage;
    this.liveStorage = liveStorage;
  }

  /**
   * Ermittelt den aktiven Speicher basierend auf dem aktuellen App-Modus
   * @returns Der aktive Session-Speicher
   * @private
   */
  private getActiveStorage(): ISessionStorage {
    if (isDemoMode()) {
      return this.demoStorage;
    } else if (isLiveMode()) {
      return this.liveStorage;
    } else {
      // Im Entwicklungsmodus verwenden wir bevorzugt den Live-Speicher
      return this.liveStorage;
    }
  }

  /**
   * Speichert eine Benutzersitzung basierend auf dem aktuellen App-Modus
   * @param user - Der Benutzer, für den die Sitzung gespeichert werden soll
   * @param authStatus - Der Authentifizierungsstatus
   * @returns Ein Promise, das zu true aufgelöst wird, wenn das Speichern erfolgreich war
   */
  async saveSession(user: User, authStatus: AuthStatus): Promise<boolean> {
    try {
      const sessionData: UserSessionData = {
        user: {
          id: user.id,
          name: user.name || 'Unbekannt',
          email: user.email,
          type: USER_TYPES.REGISTERED_USER as UserType,
        },
        authStatus,
        timestamp: Date.now(),
      };

      // Je nach App-Modus speichern wir in unterschiedlichen Speichern
      let success = false;
      
      if (isDemoMode()) {
        success = await this.demoStorage.saveSession(sessionData);
      } else if (isLiveMode()) {
        success = await this.liveStorage.saveSession(sessionData);
      } else {
        // Entwicklungsmodus: In beiden Speichern speichern
        const demoSaved = await this.demoStorage.saveSession(sessionData);
        const liveSaved = await this.liveStorage.saveSession(sessionData);
        success = demoSaved && liveSaved;
      }

      if (success) {
        // Wenn der Benutzer angemeldet ist (kein Gast), aktualisieren wir den Session-Status
        if (sessionData.user.type !== USER_TYPES.GUEST) {
          await this.updateValidLiveSessionStatus(true);
        }
      }

      return success;
    } catch (error) {
      sessionLogger.error('Fehler beim Speichern der Sitzung', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Lädt die aktuelle Benutzersitzung basierend auf dem App-Modus
   * @returns Ein Promise, das zu den Sitzungsdaten oder null aufgelöst wird
   */
  async loadSession(): Promise<UserSessionData | null> {
    try {
      // Wähle den richtigen Speicherort basierend auf dem App-Modus
      let sessionData: UserSessionData | null = null;
      
      if (isDemoMode()) {
        sessionData = await this.demoStorage.loadSession();
      } else if (isLiveMode()) {
        // Überprüfen, ob eine gültige Live-Sitzung existiert
        const hasValid = await this.hasValidLiveSession();
        
        if (hasValid) {
          sessionData = await this.liveStorage.loadSession();
        }
      } else {
        // Im Entwicklungsmodus versuchen wir, beide Sitzungen zu laden
        // und bevorzugen die Live-Sitzung, wenn beide existieren
        const liveSession = await this.liveStorage.loadSession();
        const demoSession = await this.demoStorage.loadSession();
        
        sessionData = liveSession || demoSession;
      }

      // Wenn keine Sitzungsdaten gefunden wurden, verwenden wir den Standardzustand
      if (!sessionData) {
        sessionLogger.debug('Keine gültige Sitzung gefunden, verwende Standard');
        return await this.restoreDefaultState();
      }

      return sessionData;
    } catch (error) {
      sessionLogger.error('Fehler beim Laden der Sitzung', error instanceof Error ? error.message : String(error));
      return await this.restoreDefaultState();
    }
  }

  /**
   * Bereinigt die Sitzungsdaten, wenn die App beendet wird
   * @returns Ein Promise, das aufgelöst wird, wenn die Bereinigung abgeschlossen ist
   */
  async clearOnAppExit(): Promise<void> {
    try {
      // Flag setzen, dass die App beendet wurde
      await saveObject(AUTH_STORAGE_KEYS.APP_WAS_CLOSED, true);

      // Nur im Live-Modus beenden wir die Sitzung
      if (isLiveMode()) {
        await this.cleanupInvalidSession();
      }
      
      sessionLogger.debug('Sitzungsdaten beim App-Beenden bereinigt');
    } catch (error) {
      sessionLogger.error('Fehler beim Bereinigen der Sitzungsdaten', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Stellt den Standardzustand der Sitzung wieder her
   * @returns Ein Promise, das zu den Standardsitzungsdaten aufgelöst wird
   */
  async restoreDefaultState(): Promise<UserSessionData> {
    return isDemoMode() ? this.createDemoSession() : this.createGuestSession();
  }

  /**
   * Erstellt eine Standard-Demo-Sitzung
   * @returns Die erstellte Demo-Sitzung
   * @private
   */
  private createDemoSession(): UserSessionData {
    return {
      user: {
        id: DEFAULT_USER.id,
        name: DEFAULT_USER.name,
        email: DEFAULT_USER.email,
        type: USER_TYPES.GUEST as UserType,
      },
      authStatus: { type: 'unauthenticated', reason: 'logout', timestamp: Date.now() } as AuthStatus,
      timestamp: Date.now(),
    };
  }

  /**
   * Erstellt eine Standard-Gast-Sitzung
   * @returns Die erstellte Gast-Sitzung
   * @private
   */
  private createGuestSession(): UserSessionData {
    return {
      user: {
        id: DEFAULT_USER.id,
        name: DEFAULT_USER.name,
        email: DEFAULT_USER.email,
        type: USER_TYPES.GUEST as UserType,
      },
      authStatus: { type: 'unauthenticated', reason: 'logout', timestamp: Date.now() } as AuthStatus,
      timestamp: Date.now(),
    };
  }

  /**
   * Überprüft, ob eine gültige Live-Sitzung existiert
   * @returns Ein Promise, das zu true aufgelöst wird, wenn eine gültige Sitzung existiert
   */
  async hasValidLiveSession(): Promise<boolean> {
    try {
      // Wir verwenden ein Flag, um schnelle Zugriffe ohne vollständige Sitzungsprüfung zu ermöglichen
      const hasValid = await loadObject<boolean>(AUTH_STORAGE_KEYS.HAS_VALID_LIVE_SESSION);
      return hasValid === true;
    } catch (error) {
      sessionLogger.error('Fehler beim Prüfen der Live-Sitzung', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Aktualisiert den Status der Live-Sitzung
   * @param isValid - Gibt an, ob die Live-Sitzung gültig ist
   * @returns Ein Promise, das aufgelöst wird, wenn die Aktualisierung abgeschlossen ist
   */
  async updateValidLiveSessionStatus(isValid: boolean): Promise<void> {
    try {
      await saveObject(AUTH_STORAGE_KEYS.HAS_VALID_LIVE_SESSION, isValid);
      sessionLogger.debug(`Live-Sitzungsstatus aktualisiert: ${isValid ? 'gültig' : 'ungültig'}`);
    } catch (error) {
      sessionLogger.error('Fehler beim Aktualisieren des Live-Sitzungsstatus', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Bereinigt eine ungültige Sitzung
   * Diese Methode wird aufgerufen, wenn festgestellt wird, dass die Sitzung ungültig ist,
   * z. B. wenn sie abgelaufen ist oder der Token widerrufen wurde
   * @private
   */
  private async cleanupInvalidSession(): Promise<void> {
    try {
      // Entferne die Live-Sitzung
      await this.liveStorage.clearSession();
      
      // Aktualisiere den Status
      await this.updateValidLiveSessionStatus(false);
      
      // Setze Flags zurück
      await saveObject(AUTH_STORAGE_KEYS.RESET_ON_APP_START, true);
      
      sessionLogger.info('Ungültige Sitzungsdaten wurden bereinigt');
    } catch (error) {
      sessionLogger.error('Fehler beim Bereinigen ungültiger Sitzungsdaten', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Meldet den Benutzer ab und bereinigt seine Sitzungsdaten
   * @returns Ein Promise, das zu true aufgelöst wird, wenn die Abmeldung erfolgreich war
   */
  async logout(): Promise<boolean> {
    try {
      if (isDemoMode()) {
        // Im Demo-Modus die Demo-Sitzung zurücksetzen
        await this.demoStorage.clearSession();
      } else {
        // Im Live-Modus die Live-Sitzung löschen
        await this.liveStorage.clearSession();
      }
      
      // Allgemeine Flags zurücksetzen
      await this.updateValidLiveSessionStatus(false);
      await saveObject(AUTH_STORAGE_KEYS.RESET_ON_APP_START, true);
      
      sessionLogger.info('Benutzer erfolgreich abgemeldet');
      return true;
    } catch (error) {
      sessionLogger.error('Fehler beim Abmelden des Benutzers', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
}

// Singleton-Instanz exportieren
export const sessionService = new SessionService();

// Exportiere auch die Klasse für Tests und DI
export default SessionService; 