/**
 * @file types/common/appMode.ts
 * @description Zentrale Typendefinitionen für AppMode
 * 
 * Diese Datei enthält die grundlegenden Typen für AppMode und UserStatus,
 * die in der gesamten Anwendung verwendet werden.
 * WICHTIG: Diese Datei darf KEINE Abhängigkeiten zu features/mode oder stores/auth haben.
 */

/**
 * Die grundlegenden Betriebsmodi der App
 * - demo: Simulierte Daten, keine echte Backend-Kommunikation
 * - live: Echte Daten, vollständige Backend-Kommunikation
 * - development: Erweiterter Entwicklungsmodus mit zusätzlichen Debug-Features
 */
export type AppMode = 'demo' | 'live' | 'development';

/**
 * Konstanten für App-Modi zur konsistenten Verwendung
 */
export const APP_MODES = {
  DEMO: 'demo' as AppMode,
  LIVE: 'live' as AppMode,
  DEVELOPMENT: 'development' as AppMode
};

/**
 * Type-Guard zur Validierung eines App-Modus
 * @param {unknown} mode Der zu prüfende App-Modus
 * @returns {boolean} True, wenn der Modus gültig ist
 */
export function isValidAppMode(mode: unknown): mode is AppMode {
  return typeof mode === 'string' && Object.values(APP_MODES).includes(mode as AppMode);
}

/**
 * Die verschiedenen Benutzerstatus-Typen
 * - authenticated: Angemeldeter Benutzer mit gültiger Session
 * - demo: Benutzer arbeitet im Demo-Modus
 * - guest: Nicht angemeldeter Benutzer / Gast
 */
export type UserStatus = { type: 'authenticated' } | { type: 'demo' } | { type: 'guest' };

/**
 * Konstanten für Benutzer-Stati zur konsistenten Verwendung
 */
export const USER_STATUS = {
  AUTHENTICATED: { type: 'authenticated' } as UserStatus,
  DEMO: { type: 'demo' } as UserStatus,
  GUEST: { type: 'guest' } as UserStatus
};

/**
 * Fehlertypen für Mode-Operationen
 */
export type ModeErrorType =
  | 'network_error'      // Netzwerkfehler
  | 'auth_required'      // Authentifizierung benötigt
  | 'server_error'       // Serverfehler
  | 'validation_error'   // Validierungsfehler
  | 'permission_denied'  // Keine Berechtigung für diese Operation
  | 'invalid_state'      // Ungültiger Zustandsübergang
  | 'unknown'            // Unbekannter Fehler
  | 'invalid_mode'       // Ungültiger Modus
  | 'unauthorized_change' // Unberechtigte Modusänderung
  | 'build_mismatch';    // Build-Mismatch

/**
 * Konstanten für Fehlertypen zur konsistenten Verwendung
 */
export const MODE_ERROR_TYPES = {
  INVALID_MODE: 'invalid_mode' as ModeErrorType,
  UNAUTHORIZED_CHANGE: 'unauthorized_change' as ModeErrorType,
  BUILD_MISMATCH: 'build_mismatch' as ModeErrorType,
  NETWORK_ERROR: 'network_error' as ModeErrorType,
  AUTH_REQUIRED: 'auth_required' as ModeErrorType,
  SERVER_ERROR: 'server_error' as ModeErrorType,
  VALIDATION_ERROR: 'validation_error' as ModeErrorType,
  PERMISSION_DENIED: 'permission_denied' as ModeErrorType,
  INVALID_STATE: 'invalid_state' as ModeErrorType,
  UNKNOWN: 'unknown' as ModeErrorType
}; 