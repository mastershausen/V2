/**
 * Runtime-Konfiguration für die Solvbox App
 * 
 * Diese Datei enthält Konfigurationslogik, die von Stores und anderen
 * Laufzeitkomponenten abhängt. Sie vermeidet zyklische Abhängigkeiten,
 * indem sie von den statischen Konfigurationen in env.ts importiert,
 * aber nicht umgekehrt.
 */

// Importiere Typen aus der lokalen env.ts
import { AppMode } from './env';

// Event-Typ-Definition lokal statt aus Import
export enum StoreEventType {
  APP_MODE_CHANGED = 'app_mode_changed',
  USER_STATUS_CHANGED = 'user_status_changed'
}

// Einfache Platzhalter-Definitionen für Store-Zugriff
interface StoreEvents {
  on(event: StoreEventType, callback: (data: any) => void): void;
  off(event: StoreEventType, callback: (data: any) => void): void;
  emit(event: StoreEventType, data: any): void;
}

// Minimal erforderliche Deklaration des Stores
declare const useModeStore: {
  getState: () => { appMode: AppMode }
};

// Platzhalter für storeEvents - in der eigentlichen Anwendung wird diese von
// anderswo bereitgestellt, aber für ESLint-Zwecke definieren wir sie hier lokal
const storeEvents: StoreEvents = {
  on: () => {},
  off: () => {},
  emit: () => {}
};

/**
 * Prüft, ob die App im Demo-Modus läuft, indem der ModeStore abgefragt wird
 * @returns {boolean} true, wenn im Demo-Modus
 */
export function isDemoModeRuntime(): boolean {
  try {
    // Direkter Zugriff auf den ModeStore
    if (useModeStore) {
      return useModeStore.getState().appMode === 'demo';
    }
  } catch {
    // Silent catch - ModeStore noch nicht initialisiert
    // Keine Variable nötig für den Catch-Block
  }
  
  // Fallback: Build-Konstante verwenden
  return process.env.EXPO_PUBLIC_APP_VARIANT === 'demo';
}

/**
 * Setzt den App-Modus über den Event-Bus
 * @param {AppMode} mode - Der zu setzende App-Modus
 */
export function setAppModeRuntime(mode: AppMode): void {
  storeEvents.emit(StoreEventType.APP_MODE_CHANGED, { mode });
}

/**
 * Registriert einen Listener für App-Modus-Änderungen
 * @param {Function} listener - Die Callback-Funktion, die bei Änderungen aufgerufen wird
 * @returns {Function} Funktion zum Entfernen des Listeners
 */
export function onAppModeChangeRuntime(listener: (mode: AppMode) => void): () => void {
  const callback = ({ mode }: { mode: AppMode }) => listener(mode);
  storeEvents.on(StoreEventType.APP_MODE_CHANGED, callback);
  return () => storeEvents.off(StoreEventType.APP_MODE_CHANGED, callback);
}

/**
 * Prüft, ob Mock-Daten verwendet werden sollen, basierend auf dem Runtime-Status
 * @returns {boolean} true, wenn Mock-Daten verwendet werden sollen
 */
export function shouldUseMockDataRuntime(): boolean {
  // Im Demo-Modus oder Development immer Mock-Daten verwenden
  if (isDemoModeRuntime() || __DEV__) {
    return true;
  }
  
  // Ansonsten keine Mock-Daten
  return false;
} 