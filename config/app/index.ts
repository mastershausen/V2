/**
 * Zentrale Konfiguration für die Anwendung
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { FeatureFlags } from '@/config/features';
import { switchAppMode } from '@/services/auth';
import { AppMode } from '@/types/common/appMode';
import { modeEvents } from '@/utils/store/storeEvents';

import * as Debug from './debug';
import * as Env from './env';

/**
 * Hilfsfunktion zum Abrufen des aktuellen App-Modus aus dem Storage
 * @returns {Promise<AppMode>} Der gespeicherte App-Modus oder ein Default-Wert
 */
export const getStoredAppMode = async (): Promise<AppMode> => {
  try {
    const storageData = await AsyncStorage.getItem('mode-storage');
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      return parsedData.state?.appMode || 'live';
    }
  } catch (error) {
    console.log('[Config] Fehler beim Abrufen des App-Modus:', error);
  }
  return Env.appMode as AppMode || 'demo';
};

export const config = {
  // Einhaltepunkte für responsive Designs
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280
  },

  // Anwendungsmodus-Konfiguration
  mode: {
    // Initialer Modus, kann durch den Store überschrieben werden
    initialAppMode: Env.appMode as AppMode || 'demo',

    // Hilfsfunktion zum Setzen des Modus bei der App-Initialisierung
    setInitialMode: async (): Promise<void> => {
      const initialMode = config.mode.initialAppMode;
      // Event emittieren statt direkt Store zu manipulieren
      modeEvents.setAppMode(initialMode);
      console.log(`App-Modus initialisiert: ${initialMode}`);
    },
    
    // Exportiere die getStoredAppMode-Funktion, damit sie verwendet werden kann
    getStoredAppMode
  },

  // Feature-Flag-Konfiguration
  features: FeatureFlags,

  // Fehlerbehandlung
  errors: {
    maxRetryAttempts: 3,
    retryDelayMs: 1000
  },

  // Timeout-Einstellungen
  timeouts: {
    apiRequestMs: 10000,
    sessionTimeoutMinutes: 30,
    animationDurationMs: 300
  }
};

/**
 * App-Konfigurationsschnittstelle
 * 
 * Zentrale Stelle zum Verwalten der App-Konfiguration und des App-Modus
 */

// Debug-Funktionen exportieren
export const debug = Debug;

/**
 * App-Modus setzen
 *
 * Diese Funktion setzt den App-Modus mithilfe der zentralen switchAppMode-Funktion
 * und kann beim App-Start oder für Tests verwendet werden.
 * @param mode Der zu setzende App-Modus
 */
export async function setAppMode(mode: AppMode): Promise<void> {
  // Setze App-Modus über die zentrale Funktion
  const result = await switchAppMode(mode);
  
  if (!result.success) {
    console.warn(`App-Modus konnte nicht auf "${mode}" gesetzt werden: ${result.error}`);
    return;
  }
  
  console.log(`App-Modus auf "${mode}" gesetzt.`);
  
  // Im Demo-Modus eine Meldung im Konsolenfenster ausgeben
  if (mode === 'demo') {
    console.log('🚧 Demo-Modus aktiviert! Alle Daten und Aktionen sind simuliert.');
    
    // Feature-Flags-Status anzeigen
    console.log('Feature-Flags für Demo-Modus:');
    console.log(FeatureFlags.getAllFeatureNames());
  }
  // Im Entwicklungsmodus eine Meldung im Konsolenfenster ausgeben
  else if (mode === 'development') {
    console.log('🛠️ Entwicklungsmodus aktiv! Mock-Daten werden verwendet.');
  }
  // Im Live-Modus eine Meldung im Konsolenfenster ausgeben
  else if (mode === 'live') {
    console.log('🚀 Live-Modus aktiv! Live-Daten werden verwendet.');
  }
}

// Umgebungsinformationen exportieren
export const env = {
  isDevelopment: Env.isDevelopmentMode(),
  appMode: Env.appMode,
  config: Env.config
};

// Export aller Modi Konstanten
export const modes = {
  // Kompatibilität mit alten API
  demo: 'demo' as AppMode,
  live: 'live' as AppMode,
  real: 'real' as AppMode
};

// Export für Spezialfälle (Kompatibilität)
export const appMode = Env.appMode; 