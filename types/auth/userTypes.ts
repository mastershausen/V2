import { UserType } from '@/features/auth/types';
/**
 * @file types/auth/userTypes.ts
 * @description Zentrale Definition für Benutzertypen und -rollen im Auth-System
 */

/**
 * Verfügbare Benutzerrollen im System mit strikten Literal-Typen
 * für erhöhte Typsicherheit und bessere Autovervollständigung
 */
export type UserRole = 'free' | 'premium' | 'pro' | 'admin';

/**
 * Liste aller verfügbaren Benutzerrollen als Konstanten
 * für eine konsistente Verwendung und einfache Typsicherheit
 */
export const USER_ROLES = {
  FREE: 'free' as UserRole,
  PREMIUM: 'premium' as UserRole,
  PRO: 'pro' as UserRole,
  ADMIN: 'admin' as UserRole
};

/**
 * Hierarchie der Benutzerrollen für Berechtigungsprüfungen
 * Höhere Werte bedeuten mehr Berechtigungen
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'free': 10,
  'premium': 20,
  'pro': 30,
  'admin': 100
};

/**
 * Verfügbare Benutzertypen im System
 * Unterscheidung zwischen verschiedenen Benutzerquellen/Anmeldearten
 */
export type UserType = 'GUEST' | 'DEMO_USER' | 'REGISTERED_USER';

/**
 * Konstanten für Benutzertypen zur konsistenten Verwendung im gesamten System
 */
export const USER_TYPES = {
  GUEST: 'GUEST' as UserType,
  DEMO_USER: 'DEMO_USER' as UserType,
  REGISTERED_USER: 'REGISTERED_USER' as UserType
};

/**
 * Benutzerpräferenzen für personalisierte Erfahrung
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
  [key: string]: unknown; // Erlaubt zusätzliche Einstellungen mit Typsicherheit
}

/**
 * Erweiterte Benutzerstruktur mit strikter Typisierung aller Attribute
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  type: UserType;
  avatarUrl?: string;
  createdAt?: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

/**
 * Vereinfachtes Benutzerprofil für UI-Anzeige und Store-Speicherung
 */
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  type: UserType;
  profileImage?: string;
  isVerified?: boolean;
}

/**
 * Type-Guard zur Validierung einer UserRole
 * @param role Die zu prüfende Rolle
 * @returns True, wenn die Rolle gültig ist
 */
export function isValidUserRole(role: unknown): role is UserRole {
  return typeof role === 'string' && Object.values(USER_ROLES).includes(role as UserRole);
}

/**
 * Type-Guard zur Validierung eines UserType
 * @param type Der zu prüfende Benutzertyp
 * @returns True, wenn der Benutzertyp gültig ist
 */
export function isValidUserType(type: unknown): type is UserType {
  return typeof type === 'string' && Object.values(USER_TYPES).includes(type as UserType);
}

/**
 * Type-Guard zur Validierung eines vollständigen Benutzerobjekts
 * @param user Das zu prüfende Benutzerobjekt
 * @returns True, wenn das Objekt ein gültiger Benutzer ist
 */
export function isValidUser(user: unknown): user is User {
  if (!user || typeof user !== 'object') return false;
  
  const userObj = user as Partial<User>;
  return (
    typeof userObj.id === 'string' && 
    typeof userObj.email === 'string' && 
    isValidUserRole(userObj.role) &&
    isValidUserType(userObj.type)
  );
}

/**
 * Prüft, ob ein Benutzer mindestens eine bestimmte Rolle hat
 * @param userRole Die zu prüfende Benutzerrolle
 * @param requiredRole Die erforderliche Mindestrolle
 * @returns True, wenn der Benutzer mindestens die erforderliche Rolle hat
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
} 