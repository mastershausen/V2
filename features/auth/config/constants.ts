/**
 * @file features/auth/config/constants.ts
 * @description Zentrale Konfigurationen und Konstanten für das Auth-System
 */

import {AUTH_REQUIRED_ACTIONS} from '@/features/auth/types';

/**
 * Auth-Modi für Zugriff auf verschiedene Datenquellen
 */
export enum AuthMode {
  DEMO = 'demo',
  LIVE = 'live',
  DEVELOPMENT = 'development'
}

/**
 * Storage-Schlüssel für Auth-bezogene Daten
 */
export const AUTH_STORAGE_KEYS = {
  DEMO_SESSION: 'app:auth:demo',
  LIVE_SESSION: 'app:auth:live',
  AUTH_DATA: 'app:auth:data',
  USER_SETTINGS: 'app:user:settings',
  USER_PREFERENCES: 'app:user:prefs',
  USER_PROFILE: 'app:user:profile',
  HAS_VALID_LIVE_SESSION: 'app:session:has_valid_live',
  RESET_DEMO_SESSION_ON_START: 'app:session:reset_demo',
  RESET_ON_APP_START: 'app:session:reset_on_start',
  APP_WAS_CLOSED: 'app:state:closed'
};

/**
 * Benutzertypen für das Auth-System
 */
export const USER_TYPES = {
  GUEST: 'GUEST',
  DEMO_USER: 'DEMO_USER',
  REGISTERED_USER: 'REGISTERED_USER'
};

/**
 * Fehlermeldungen für Auth-Operationen
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Ungültige E-Mail oder Passwort',
  EMAIL_EXISTS: 'Diese E-Mail-Adresse wird bereits verwendet',
  WEAK_PASSWORD: 'Das Passwort ist zu schwach',
  NETWORK_ERROR: 'Netzwerkfehler bei der Authentifizierung',
  SESSION_EXPIRED: 'Ihre Sitzung ist abgelaufen, bitte melden Sie sich erneut an',
  UNAUTHORIZED: 'Sie sind nicht berechtigt, diese Aktion auszuführen',
  SESSION_LOAD_FAILED: 'Fehler beim Laden der Sitzung',
  SESSION_SAVE_FAILED: 'Fehler beim Speichern der Sitzung'
};

/**
 * Validierungsregeln für Formulare
 */
export const AUTH_VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6,
    REQUIRE_SPECIAL_CHAR: false,
    REQUIRE_NUMBER: true,
    REQUIRE_UPPERCASE: false
  },
  EMAIL: {
    REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  }
};

/**
 * Zeitkonstanten für Auth-bezogene Operationen
 */
export const AUTH_TIMEOUTS = {
  SESSION_CHECK: 60 * 1000, // Alle 60 Sekunden Sitzung prüfen
  AUTO_LOGOUT: 30 * 60 * 1000, // Nach 30 Minuten Inaktivität abmelden
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 Stunden
  TOKEN_REFRESH_BEFORE: 60 * 60 * 1000 // 1 Stunde vor Ablauf
};

/**
 * Konstanten für Token-Management
 */
export const AUTH_TOKEN = {
  EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 Stunden in Millisekunden
  REFRESH_BEFORE: 60 * 60 * 1000, // 1 Stunde vor Ablauf refreshen
  STORAGE_KEY: 'auth_token'
};

/**
 * Erforderliche Auth-Aktionen
 */
export { AUTH_REQUIRED_ACTIONS };

/**
 * Standardeinstellungen für neue Benutzer
 */
export const DEFAULT_USER_PREFERENCES = {
  theme: 'system',
  notifications: true,
  language: 'de'
}; 