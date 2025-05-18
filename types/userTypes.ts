/**
 * Benutzertypen für das vereinfachte System
 */

/**
 * Definition der Benutzertypen
 * - GUEST: Kein Benutzer angemeldet
 * - DEMO_USER: Demo-Benutzer (z.B. Alexander Becker)
 * - REGISTERED_USER: Echter registrierter Benutzer
 */
export type UserType = 'GUEST' | 'DEMO_USER' | 'REGISTERED_USER';

/**
 * Benutzerrolle - definiert die Berechtigungen eines Benutzers
 */
export type UserRole = 'guest' | 'free' | 'premium' | 'pro' | 'admin' | 'user';

/**
 * Hierarchie der Benutzerrollen für Berechtigungsprüfungen
 * Höhere Werte bedeuten mehr Berechtigungen
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  free: 10,
  user: 20,
  premium: 30,
  pro: 40,
  admin: 100
};

/**
 * Standardbenutzertypen für die App
 */
export const USER_TYPES = {
  GUEST: 'GUEST' as UserType,
  DEMO_USER: 'DEMO_USER' as UserType,
  REGISTERED_USER: 'REGISTERED_USER' as UserType
};

/**
 * Basisprofil eines Benutzers
 */
export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  role: UserRole;
  isVerified?: boolean;
  joinDate?: Date;
  profileImage?: string;
  userType?: UserType; // Neues Feld für den Benutzertyp
}

/**
 * Authentifizierungsstatus
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * Authentifizierungsdaten für einen Benutzer
 */
export interface AuthData {
  user: UserProfile | null;
  token: string | null;
  authStatus: AuthStatus;
}

/**
 * Vereinfachte Benutzereinstellungen
 */
export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notificationsEnabled?: boolean;
  lastSyncDate?: Date;
}

/**
 * Datenstruktur für die Benutzersitzung
 * Erweitert die Benutzerdaten um Sitzungsinformationen
 */
export interface UserSessionData {
  user: {
    id: string;
    name: string;
    email: string;
    type: UserType;
  };
  authStatus: AuthStatus;
  timestamp: number;
} 