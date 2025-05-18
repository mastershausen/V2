/**
 * Debug-Konfiguration
 * 
 * Funktionen und Einstellungen, die nur im Entwicklungsumfeld verfügbar sind.
 * Diese Datei enthält Funktionen zur Steuerung des App-Modus im Entwicklungsumfeld,
 * einschließlich der Möglichkeit, den durch APP_ENV vorgegebenen Modus zu überschreiben.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppMode } from '@/features/mode/types';

import { isDevelopmentMode, _setOverriddenAppMode } from './env';

// Storage-Key für die Debug-Einstellungen
const DEBUG_MODE_STORAGE_KEY = 'debug-settings-app-mode-override';

// Web-spezifischer Storage-Key
const WEB_DEBUG_MODE_STORAGE_KEY = 'debug_app_mode_override';

// Typen für den Override-Modus
export type AppModeOverride = {
  enabled: boolean;
  mode: AppMode;
};

// Standardwerte für den Override-Modus
const DEFAULT_OVERRIDE: AppModeOverride = {
  enabled: false,
  mode: 'live',
};

/**
 * Aktuelle Debug-Einstellungen
 */
let currentOverrideSettings: AppModeOverride = { ...DEFAULT_OVERRIDE };

/**
 * Callbacks, die aufgerufen werden, wenn sich der Override-Modus ändert
 */
const overrideModeChangeCallbacks: ((override: AppModeOverride) => void)[] = [];

/**
 * Prüft, ob die Anwendung im Browser-Kontext läuft
 * @returns true, wenn die Anwendung im Browser läuft, sonst false
 */
export function isRunningInBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Lädt die Debug-Einstellungen aus dem Storage (AsyncStorage oder localStorage)
 */
export async function loadDebugSettings(): Promise<AppModeOverride> {
  try {
    // Nur im Entwicklungsumfeld laden
    if (!isDevelopmentMode()) {
      return DEFAULT_OVERRIDE;
    }
    
    // Im Browser-Kontext localStorage verwenden
    if (isRunningInBrowser()) {
      const webSettings = localStorage.getItem(WEB_DEBUG_MODE_STORAGE_KEY);
      
      if (webSettings) {
        if (webSettings === 'demo' || webSettings === 'live') {
          currentOverrideSettings = {
            enabled: true,
            mode: webSettings as AppMode
          };
          
          // Wenn aktiviert, setze den Override-Modus in der env
          _setOverriddenAppMode(webSettings as AppMode);
          
          return currentOverrideSettings;
        } else if (webSettings === 'null') {
          // Falls der Wert explizit auf 'null' gesetzt wurde, Override deaktivieren
          currentOverrideSettings = { ...DEFAULT_OVERRIDE, enabled: false };
          _setOverriddenAppMode(null);
          return currentOverrideSettings;
        }
      }
      
      // Wenn kein Setting gefunden wurde, Standardwerte zurückgeben
      return DEFAULT_OVERRIDE;
    }
    
    // In React Native AsyncStorage verwenden
    const settings = await AsyncStorage.getItem(DEBUG_MODE_STORAGE_KEY);
    
    if (settings) {
      const parsed = JSON.parse(settings) as AppModeOverride;
      currentOverrideSettings = parsed;
      
      // Wenn aktiviert, setze den Override-Modus in der env
      if (parsed.enabled) {
        _setOverriddenAppMode(parsed.mode);
      } else {
        _setOverriddenAppMode(null);
      }
      
      return parsed;
    }
  } catch (error) {
    console.error('Fehler beim Laden der Debug-Einstellungen:', error);
  }
  
  return DEFAULT_OVERRIDE;
}

/**
 * Speichert die Debug-Einstellungen im Storage (AsyncStorage oder localStorage)
 * @param settings
 */
export async function saveDebugSettings(settings: AppModeOverride): Promise<void> {
  try {
    // Nur im Entwicklungsumfeld speichern
    if (!isDevelopmentMode()) {
      return;
    }
    
    // Aktuelle Einstellungen aktualisieren
    currentOverrideSettings = settings;
    
    // Override-Modus in der env setzen
    if (settings.enabled) {
      _setOverriddenAppMode(settings.mode);
    } else {
      _setOverriddenAppMode(null);
    }
    
    // Im Browser-Kontext localStorage verwenden
    if (isRunningInBrowser()) {
      if (settings.enabled) {
        localStorage.setItem(WEB_DEBUG_MODE_STORAGE_KEY, settings.mode);
      } else {
        localStorage.removeItem(WEB_DEBUG_MODE_STORAGE_KEY);
      }
    } else {
      // In React Native AsyncStorage verwenden
      await AsyncStorage.setItem(DEBUG_MODE_STORAGE_KEY, JSON.stringify(settings));
    }
    
    // Callbacks aufrufen
    overrideModeChangeCallbacks.forEach(callback => callback(settings));
  } catch (error) {
    console.error('Fehler beim Speichern der Debug-Einstellungen:', error);
  }
}

/**
 * Setzt den Override-Modus
 * @param mode Der gewünschte App-Modus
 * @param enabled Ob der Override aktiviert sein soll
 */
export async function setAppModeOverride(mode: AppMode, enabled: boolean): Promise<void> {
  await saveDebugSettings({
    enabled,
    mode,
  });
}

/**
 * Aktiviert den Demo-Modus im Override
 */
export async function enableDemoModeOverride(): Promise<void> {
  await setAppModeOverride('demo', true);
}

/**
 * Aktiviert den Live-Modus im Override
 */
export async function enableLiveModeOverride(): Promise<void> {
  await setAppModeOverride('live', true);
}

/**
 * Deaktiviert den Override-Modus
 */
export async function disableAppModeOverride(): Promise<void> {
  await setAppModeOverride(DEFAULT_OVERRIDE.mode, false);
}

/**
 * Gibt die aktuellen Debug-Einstellungen zurück
 */
export function getAppModeOverride(): AppModeOverride {
  return currentOverrideSettings;
}

/**
 * Prüft, ob der Override-Modus aktiviert ist
 */
export function isAppModeOverrideEnabled(): boolean {
  // Im Development-Build erweiterte Prüfung
  if (__DEV__) {
    // Im Browser-Kontext den lokalem Zustand verwenden
    if (isRunningInBrowser()) {
      const webSettings = localStorage.getItem(WEB_DEBUG_MODE_STORAGE_KEY);
      return webSettings === 'demo' || webSettings === 'live';
    }
    
    // Sonst den gespeicherten Zustand verwenden
    return currentOverrideSettings.enabled;
  }
  
  // In Produktionsbuilds immer false
  return false;
}

/**
 * Gibt den Override-Modus zurück, falls aktiviert
 */
export function getOverriddenAppMode(): AppMode | null {
  // Nur im Development-Build
  if (__DEV__) {
    // Im Browser-Kontext lokalen Cache verwenden
    if (isRunningInBrowser()) {
      const webSettings = localStorage.getItem(WEB_DEBUG_MODE_STORAGE_KEY);
      if (webSettings === 'demo' || webSettings === 'live') {
        return webSettings as AppMode;
      }
      return null;
    }
    
    // Sonst den gespeicherten Zustand verwenden
    if (currentOverrideSettings.enabled) {
      return currentOverrideSettings.mode;
    }
  }
  
  return null;
}

/**
 * Registriert einen Callback, der aufgerufen wird, wenn sich der Override-Modus ändert
 * @param callback
 * @returns Eine Funktion zum Entfernen des Callbacks
 */
export function onOverrideModeChange(callback: (override: AppModeOverride) => void): () => void {
  overrideModeChangeCallbacks.push(callback);
  
  return () => {
    const index = overrideModeChangeCallbacks.indexOf(callback);
    if (index !== -1) {
      overrideModeChangeCallbacks.splice(index, 1);
    }
  };
}

// Initialisieren der Debug-Einstellungen beim Import
loadDebugSettings().then(() => {
  if (isDevelopmentMode()) {
    const overrideActive = isAppModeOverrideEnabled();
    if (overrideActive) {
      console.log(`[DEBUG] App-Modus-Override aktiv: ${getOverriddenAppMode()}`);
    }
  }
}); 