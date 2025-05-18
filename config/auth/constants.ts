/**
 * @file config/auth/constants.ts
 * @description Zentrale Konfigurationen und Konstanten für das Auth-System
 */

import {UserType} from '@/features/auth/types';
import { UserRole,  } from '@/types/auth';

/**
 * Demo-Benutzer für Testzwecke
 */
export const DEMO_USERS = [
  {
    id: 'demo-1',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'free' as UserRole,
    userType: 'demo' as UserType
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as UserRole,
    userType: 'demo' as UserType
  },
  {
    id: 'demo-user-alexander',
    email: 'alexander@beckerundpartner.de',
    password: 'demo123',
    name: 'Alexander Becker',
    role: 'admin' as UserRole,
    userType: 'demo' as UserType
  }
];

/**
 * Verzögerung für simulierte Netzwerkanfragen im Demo-Modus (in ms)
 */
export const DEMO_NETWORK_DELAY = 1000;

/**
 * Konstanten für Token-Management
 */
export const AUTH_TOKEN = {
  EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 Stunden in Millisekunden
  REFRESH_BEFORE: 60 * 60 * 1000, // 1 Stunde vor Ablauf refreshen
  STORAGE_KEY: 'auth_token'
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
  UNAUTHORIZED: 'Sie sind nicht berechtigt, diese Aktion auszuführen'
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
  AUTO_LOGOUT: 30 * 60 * 1000 // Nach 30 Minuten Inaktivität abmelden
};

/**
 * Standardeinstellungen für neue Benutzer
 */
export const DEFAULT_USER_PREFERENCES = {
  theme: 'system',
  notifications: true,
  language: 'de'
}; 