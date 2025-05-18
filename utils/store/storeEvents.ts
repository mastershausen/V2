/**
 * @file utils/store/storeEvents.ts
 * @description Zentraler Event-Emitter für Store-Änderungen
 * 
 * Diese Datei implementiert ein Observer-Pattern für die Kommunikation
 * zwischen Services und Stores, um zyklische Abhängigkeiten zu vermeiden.
 */

import EventEmitterLib from 'eventemitter3';

import { User } from '@/types/auth';
import { AppMode, UserStatus } from '@/types/common/appMode';
import { UserProfile } from '@/types/userTypes';

/**
 * Event-Typen für Store-Änderungen
 */
export enum StoreEventType {
  // Mode-bezogene Events
  APP_MODE_CHANGED = 'app-mode-changed',
  USER_STATUS_CHANGED = 'user-status-changed',
  
  // Auth-bezogene Events
  USER_LOGGED_IN = 'user-logged-in',
  USER_LOGGED_OUT = 'user-logged-out',
  AUTH_ERROR = 'auth-error',
  
  // Benutzer-bezogene Events
  USER_STATE_CHANGED = 'user-state-changed'
}

/**
 * Typen für Event-Payloads
 */
export interface StoreEventPayloads {
  [StoreEventType.APP_MODE_CHANGED]: { mode: AppMode };
  [StoreEventType.USER_STATUS_CHANGED]: { status: UserStatus };
  [StoreEventType.USER_LOGGED_IN]: { user: User };
  [StoreEventType.USER_LOGGED_OUT]: void;
  [StoreEventType.AUTH_ERROR]: { error: string };
  [StoreEventType.USER_STATE_CHANGED]: { 
    user: UserProfile | null;
    userId: string | null;
  };
}

/**
 * Typ für Event-Listener
 */
export type StoreEventListener<T extends StoreEventType> = (payload: StoreEventPayloads[T]) => void;

/**
 * Singleon-Event-Emitter für Store-Kommunikation
 */
class StoreEventBus {
  private emitter = new EventEmitterLib();
  private lastValues = new Map<StoreEventType, unknown>();
  
  /**
   * Registriert einen Event-Listener
   * @param {StoreEventType} eventType - Der Event-Typ
   * @param {Function} listener - Der Event-Listener
   */
  on<T extends StoreEventType>(eventType: T, listener: StoreEventListener<T>): void {
    this.emitter.on(eventType, listener);
    
    // Gib dem neuen Listener sofort den letzten bekannten Wert, falls vorhanden
    const lastValue = this.lastValues.get(eventType) as StoreEventPayloads[T] | undefined;
    if (lastValue !== undefined) {
      listener(lastValue);
    }
  }
  
  /**
   * Entfernt einen Event-Listener
   * @param {StoreEventType} eventType - Der Event-Typ
   * @param {Function} listener - Der Event-Listener
   */
  off<T extends StoreEventType>(eventType: T, listener: StoreEventListener<T>): void {
    this.emitter.off(eventType, listener);
  }
  
  /**
   * Löst ein Event aus
   * @param {StoreEventType} eventType - Der Event-Typ
   * @param {object} payload - Die Event-Daten
   */
  emit<T extends StoreEventType>(eventType: T, payload: StoreEventPayloads[T]): void {
    // Speichere den letzten Wert
    this.lastValues.set(eventType, payload);
    this.emitter.emit(eventType, payload);
  }
  
  /**
   * Gibt den letzten bekannten Wert für einen Event-Typ zurück
   * @param {StoreEventType} eventType - Der Event-Typ
   * @returns {StoreEventPayloads[T] | undefined} Der letzte bekannte Wert oder undefined wenn keiner vorhanden ist
   */
  getLastKnownValue<T extends StoreEventType>(eventType: T): StoreEventPayloads[T] | undefined {
    return this.lastValues.get(eventType) as StoreEventPayloads[T] | undefined;
  }
}

/**
 * Singleton-Instanz des Event-Busses
 */
export const storeEvents = new StoreEventBus();

/**
 * Mode-spezifische Helfer-Funktionen
 */
export const modeEvents = {
  /**
   * Setzt den App-Modus
   * @param {AppMode} mode - Der neue App-Modus
   */
  setAppMode(mode: AppMode): void {
    storeEvents.emit(StoreEventType.APP_MODE_CHANGED, { mode });
  },
  
  /**
   * Setzt den Benutzer-Status
   * @param {UserStatus} status - Der neue Benutzer-Status
   */
  setUserStatus(status: UserStatus): void {
    storeEvents.emit(StoreEventType.USER_STATUS_CHANGED, { status });
  }
};

/**
 * Auth-spezifische Helfer-Funktionen
 */
export const authEvents = {
  /**
   * Meldet einen Benutzer an
   * @param {User} user - Der angemeldete Benutzer
   */
  login(user: User): void {
    storeEvents.emit(StoreEventType.USER_LOGGED_IN, { user });
  },
  
  /**
   * Meldet einen Benutzer ab
   */
  logout(): void {
    storeEvents.emit(StoreEventType.USER_LOGGED_OUT, undefined);
  },
  
  /**
   * Setzt einen Auth-Fehler
   * @param {string} error - Die Fehlermeldung
   */
  setError(error: string): void {
    storeEvents.emit(StoreEventType.AUTH_ERROR, { error });
  }
};

/**
 * Benutzer-spezifische Helfer-Funktionen
 */
export const userEvents = {
  /**
   * Benachrichtigt über Änderungen am Benutzerzustand
   * @param {UserProfile | null} user - Das aktuelle Benutzerprofil
   */
  userStateChanged(user: UserProfile | null): void {
    storeEvents.emit(StoreEventType.USER_STATE_CHANGED, { 
      user, 
      userId: user?.id || null 
    });
  }
}; 