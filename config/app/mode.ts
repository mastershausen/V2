/**
 * @file config/app/mode.ts
 * @description App-Modus-Konfiguration
 */

import { AppMode, APP_MODES } from '@/types/common/appMode';

/**
 * Zentrale Konfiguration für den App-Modus
 * 
 * Diese Datei ist die autoritäre Quelle für Modi-bezogene Konfigurationen
 * und Feature-Flags in der gesamten App. Alle Konfigurationen, die sich auf
 * Live- oder Demo-Modi beziehen, sollten hier zentralisiert werden.
 * 
 * Der Live-Modus ist für echte Daten mit Backend-Kommunikation.
 * Der Demo-Modus arbeitet mit simulierten Daten ohne Backend-Verbindung.
 * 
 * Der Unterschied zur build-Konfiguration: Es gibt einen DevBuild, der beide
 * Modi unterstützt, sowie dedizierte LiveBuild- und DemoBuild-Varianten, die
 * jeweils auf einen Modus beschränkt sind.
 */

/**
 * Zentrale Konfigurationskonstanten für alle Modi
 */
export const MODE_CONFIG = {
  // Standardeinstellungen für alle Modi
  DEFAULT: {
    APP_MODE: 'live' as AppMode,
    STORAGE_KEYS: {
      CURRENT_MODE: 'app_mode',
      USER_STATUS: 'user_status',
      LAST_MODE_CHANGE: 'last_mode_change',
      MODE_OVERRIDE: 'mode_override_enabled'
    }
  },
  
  // Features für jeden Modus
  FEATURES: {
    // Demo-Modus Features
    DEMO: {
      CAN_SWITCH_MODES: true,
      USES_MOCK_DATA: true,
      SHOWS_DEBUG_BUTTONS: __DEV__,
      USE_PERSISTENT_STORAGE: true
    },
    
    // Live-Modus Features
    LIVE: {
      CAN_SWITCH_MODES: true,
      USES_MOCK_DATA: false,
      SHOWS_DEBUG_BUTTONS: __DEV__,
      USE_PERSISTENT_STORAGE: true
    },
    
    // Development-Modus (erweiterte Entwicklungsfunktionen)
    DEVELOPMENT: {
      CAN_SWITCH_MODES: true,
      USES_MOCK_DATA: true,
      SHOWS_DEBUG_BUTTONS: true,
      USE_PERSISTENT_STORAGE: false
    }
  },
  
  // Damit ModeValidation und ModeHelpers auf diese Werte zugreifen können
  VALIDATION: {
    ALLOWED_APP_MODES: [APP_MODES.DEMO, APP_MODES.LIVE, APP_MODES.DEVELOPMENT],
    ALLOWED_USER_MODES: ['real', 'demo', 'offline']
  },
  
  DEFAULTS: {
    APP_MODE: APP_MODES.LIVE,
    USER_MODE: 'real',
    IS_DEMO_ACCOUNT: false
  },
  
  // Exportiere die App-Modi für Abwärtskompatibilität
  APP_MODES,
  USER_MODES: {
    REAL: 'real',
    DEMO: 'demo',
    OFFLINE: 'offline'
  }
};

/**
 * Zentrale Typdefinitionen für Modi
 */
/**
 * Mögliche App-Modi
 * - DEVELOPMENT: Entwicklungsmodus mit vollen Debugging-Funktionen
 * - DEMO: Demo-Modus für Präsentationen und Test-Umgebungen
 * - LIVE: Produktionsmodus mit echten Daten
 * @deprecated Bitte importiere AppMode direkt aus '@/features/mode/types'
 */
// export type AppMode = typeof MODE_CONFIG.APP_MODES[keyof typeof MODE_CONFIG.APP_MODES];

/**
 * Mögliche Benutzer-Modi
 * - REAL: Echter Benutzer mit echten Daten
 * - DEMO: Demo-Benutzer mit Beispieldaten
 * - OFFLINE: Offline-Modus ohne Serveranbindung
 */
export type UserMode = typeof MODE_CONFIG.USER_MODES[keyof typeof MODE_CONFIG.USER_MODES];

/**
 * Struktur für den kompletten Mode-Status
 */
export interface ModeState {
  appMode: AppMode;
  userMode: UserMode;
  isDemoAccount: boolean;
}

/**
 * Typen für Mode-Änderungsevents
 */
export interface ModeChangeEvent {
  oldMode: AppMode | UserMode;
  newMode: AppMode | UserMode;
}

/**
 * Fehlerkategorien für Mode-Operationen
 */
export enum ModeErrorType {
  INVALID_MODE = 'INVALID_MODE',
  UNAUTHORIZED_CHANGE = 'UNAUTHORIZED_CHANGE',
  BUILD_MISMATCH = 'BUILD_MISMATCH',
}

/**
 * Validierungsfunktionen für alle Mode-Operationen
 */
export const ModeValidation = {
  /**
   * Prüft, ob ein App-Modus gültig ist
   * @param {string} mode - Der zu prüfende App-Modus
   * @returns {boolean} true wenn der Modus gültig ist, sonst false
   */
  isValidAppMode(mode: string): mode is AppMode {
    return MODE_CONFIG.VALIDATION.ALLOWED_APP_MODES.includes(mode as AppMode);
  },

  /**
   * Prüft, ob ein Benutzer-Modus gültig ist
   * @param {string} mode - Der zu prüfende Benutzer-Modus
   * @returns {boolean} true wenn der Modus gültig ist, sonst false
   */
  isValidUserMode(mode: string): mode is UserMode {
    return MODE_CONFIG.VALIDATION.ALLOWED_USER_MODES.includes(mode as UserMode);
  },

  /**
   * Prüft, ob ein Modus-Wechsel erlaubt ist
   * @param {AppMode} currentMode - Der aktuelle Modus
   * @param {AppMode} targetMode - Der Ziel-Modus
   * @returns {boolean} true wenn der Wechsel erlaubt ist, sonst false
   */
  isModeTransitionAllowed(currentMode: AppMode, targetMode: AppMode): boolean {
    // Im Development-Modus sind alle Wechsel erlaubt
    if (currentMode === APP_MODES.DEVELOPMENT) {
      return true;
    }

    // Im Demo-Modus nur Wechsel zu Live erlaubt
    if (currentMode === APP_MODES.DEMO) {
      return targetMode === APP_MODES.LIVE;
    }

    // Im Live-Modus ist Wechsel zum Demo-Modus erlaubt (für DevBuild)
    if (currentMode === APP_MODES.LIVE) {
      return targetMode === APP_MODES.DEMO;
    }

    // Alle anderen Wechsel sind nicht erlaubt
    return false;
  },

  /**
   * Prüft, ob ein Modus für einen bestimmten Build-Typ gültig ist
   * @param {AppMode} mode - Der zu prüfende Modus
   * @param {boolean} isDevBuild - Ob es sich um einen Development-Build handelt
   * @returns {boolean} true wenn der Modus für den Build-Typ gültig ist
   */
  isValidModeForBuild(mode: AppMode, isDevBuild: boolean): boolean {
    // Im Development-Build sind alle Modi erlaubt
    if (isDevBuild || __DEV__) {
      return true;
    }
    
    // Im Demo-Build ist nur der Demo-Modus erlaubt
    if (mode === APP_MODES.DEMO) {
      return true;
    }
    
    // Im Live-Build ist nur der Live-Modus erlaubt
    return mode === APP_MODES.LIVE;
  },
} as const;

/**
 * Hilfsfunktionen für häufige Mode-bezogene Operationen
 */
export const ModeHelpers = {
  /**
   * Prüft, ob die App im Entwicklungsmodus läuft
   * @param {AppMode} mode - Der zu prüfende App-Modus
   * @returns {boolean} true wenn die App im Entwicklungsmodus läuft
   */
  isDevelopmentMode(mode: AppMode): boolean {
    return mode === APP_MODES.DEVELOPMENT;
  },

  /**
   * Prüft, ob die App im Demo-Modus läuft
   * @param {AppMode} mode - Der zu prüfende App-Modus
   * @returns {boolean} true wenn die App im Demo-Modus läuft
   */
  isDemoMode(mode: AppMode): boolean {
    return mode === APP_MODES.DEMO;
  },

  /**
   * Prüft, ob die App im Live-Modus läuft
   * @param {AppMode} mode - Der zu prüfende App-Modus
   * @returns {boolean} true wenn die App im Live-Modus läuft
   */
  isLiveMode(mode: AppMode): boolean {
    return mode === APP_MODES.LIVE;
  },

  /**
   * Erstellt den initialen Mode-Status basierend auf dem Build-Typ
   * @param {boolean} isDevBuild - Ob es sich um einen Development-Build handelt
   * @returns {ModeState} Der initialisierte Mode-Status
   */
  createInitialModeState(isDevBuild: boolean): ModeState {
    // Im Development-Build: Standardwerte verwenden
    if (isDevBuild || __DEV__) {
      return {
        appMode: MODE_CONFIG.DEFAULTS.APP_MODE,
        userMode: MODE_CONFIG.DEFAULTS.USER_MODE,
        isDemoAccount: MODE_CONFIG.DEFAULTS.IS_DEMO_ACCOUNT,
      };
    }

    // Für alle anderen Builds gibt es feste Defaults
    return {
      appMode: APP_MODES.LIVE,
      userMode: MODE_CONFIG.USER_MODES.REAL,
      isDemoAccount: false,
    };
  },
} as const; 