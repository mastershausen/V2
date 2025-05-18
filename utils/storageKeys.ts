/**
 * Einheitliche Storage-Schlüssel für die Anwendung
 * 
 * Diese Datei definiert alle Storage-Schlüssel, die in der Anwendung verwendet werden.
 * Alte Schlüssel werden für die Migrationsphase beibehalten.
 */

/**
 * Neue, vereinheitlichte Storage-Schlüssel
 */
export const APP_STORAGE_KEYS = {
  // Authentifizierung und Benutzer
  AUTH_DATA: 'app:auth:data',          // Authentifizierungsdaten (user, token)
  DEMO_SESSION: 'app:auth:demo',       // Demo-Modus Sitzungsdaten
  LIVE_SESSION: 'app:auth:live',       // Live-Modus Sitzungsdaten
  USER_SETTINGS: 'app:user:settings',  // Benutzereinstellungen
  USER_PREFERENCES: 'app:user:prefs',  // Benutzereinstellungen (Farben, Thema, etc.)
  USER_PROFILE: 'app:user:profile',    // Benutzerprofildaten (als Cache)
  
  // App-Einstellungen
  APP_SETTINGS: 'app:settings',        // Allgemeine App-Einstellungen
  NAVIGATION: 'app:nav:last_path',     // Letzter Navigationspfad
  APP_WAS_CLOSED: 'app:state:closed',  // Flag ob die App beendet wurde
  
  // Session-Management
  APP_HAS_VALID_LIVE_SESSION: 'app:session:has_valid_live',  // Flag für gültige Live-Session
  RESET_DEMO_SESSION_ON_START: 'app:session:reset_demo',     // Flag für Demo-Session-Reset
  RESET_ON_APP_START: 'app:session:reset_on_start',         // Flag für Store-Reset beim App-Start
  
  // Funktionale Daten
  SEARCH_HISTORY: 'app:search:history',// Suchverlauf
};

/**
 * Alte Storage-Schlüssel (für Kompatibilität und Migration)
 */
export const LEGACY_STORAGE_KEYS = {
  // Authentifizierung im Live-Modus
  LIVE_MODE_AUTH_DATA: 'LIVE_MODE_AUTH_DATA',
  
  // Letzte bekannte Bildschirmposition
  LAST_SCREEN_PATH: 'LAST_SCREEN_PATH',
  
  // Debug-Schlüssel
  DEBUG_MODE_STORAGE_KEY: 'debug-settings-app-mode-override',
  WEB_DEBUG_MODE_STORAGE_KEY: 'debug_app_mode_override',
  
  // Veraltetes Flag für Live-Auth-Abschluss (durch userStatus im neuen System ersetzt)
  HAS_COMPLETED_LIVE_AUTH: 'app:completed_live_auth',
};

/**
 * Mapping für die Migration von alten zu neuen Schlüsseln
 */
export const MIGRATION_KEY_MAP: Record<string, string> = {
  // Altes Schlüssel -> Neue Schlüssel
  [LEGACY_STORAGE_KEYS.LIVE_MODE_AUTH_DATA]: APP_STORAGE_KEYS.LIVE_SESSION,
  [LEGACY_STORAGE_KEYS.LAST_SCREEN_PATH]: APP_STORAGE_KEYS.NAVIGATION,
}; 