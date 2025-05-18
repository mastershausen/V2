/**
 * Zentrale Typendefinitionen für Benutzer
 * 
 * Diese Datei definiert die grundlegenden Benutzertypen für die gesamte Anwendung.
 * Sie vermeidet zyklische Abhängigkeiten, indem sie keine konkreten Implementierungen 
 * importiert, sondern nur Typendefinitionen enthält.
 */

/**
 * Benutzertypen in der Anwendung
 */
export type UserType = 'GUEST' | 'DEMO_USER' | 'REGISTERED_USER';

/**
 * Benutzerrollen in der Anwendung
 */
export type UserRole = 'free' | 'basic' | 'premium' | 'pro' | 'admin';

/**
 * Hierarchie der Benutzerrollen für Berechtigungsprüfungen
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  free: 0,
  basic: 1,
  premium: 2,
  pro: 3,
  admin: 10
};

/**
 * Grundlegendes Benutzerprofil
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  isVerified: boolean;
  joinDate: Date;
  profileImage?: string;
  userType: UserType; // Neues Feld, um den Benutzertyp zu definieren
}

/**
 * Benutzer-Sitzung für die Anwendung
 */
export interface UserSession {
  user: UserProfile | null;
  authToken: string | null;
  authStatus: 'authenticated' | 'unauthenticated' | 'loading';
} 