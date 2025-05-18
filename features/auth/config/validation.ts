/**
 * @file features/auth/config/validation.ts
 * @description Validierungsfunktionen für die Authentifizierung
 */

import { AuthStatus } from '@/features/auth/types';
import { User, UserRole } from '@/types/auth';

import { AUTH_VALIDATION } from './constants';

/**
 * Überprüft, ob eine E-Mail-Adresse gültig ist
 * @param email Die zu überprüfende E-Mail-Adresse
 * @returns Wahr, wenn die E-Mail gültig ist
 */
export function isValidEmail(email: string): boolean {
  return AUTH_VALIDATION.EMAIL.REGEX.test(email);
}

/**
 * Überprüft, ob ein Passwort den Anforderungen entspricht
 * @param password Das zu überprüfende Passwort
 * @returns Wahr, wenn das Passwort gültig ist
 */
export function isValidPassword(password: string): boolean {
  const { MIN_LENGTH, REQUIRE_NUMBER, REQUIRE_SPECIAL_CHAR, REQUIRE_UPPERCASE } = AUTH_VALIDATION.PASSWORD;
  
  if (password.length < MIN_LENGTH) {
    return false;
  }
  
  if (REQUIRE_NUMBER && !/\d/.test(password)) {
    return false;
  }
  
  if (REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }
  
  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    return false;
  }
  
  return true;
}

/**
 * Liefert Fehlermeldungen basierend auf der Passwortvalidierung
 * @param password Das zu überprüfende Passwort
 * @returns Array mit Fehlermeldungen oder leeres Array wenn gültig
 */
export function getPasswordValidationErrors(password: string): string[] {
  const errors: string[] = [];
  const { MIN_LENGTH, REQUIRE_NUMBER, REQUIRE_SPECIAL_CHAR, REQUIRE_UPPERCASE } = AUTH_VALIDATION.PASSWORD;
  
  if (password.length < MIN_LENGTH) {
    errors.push(`Passwort muss mindestens ${MIN_LENGTH} Zeichen lang sein`);
  }
  
  if (REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Passwort muss mindestens eine Zahl enthalten');
  }
  
  if (REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Passwort muss mindestens ein Sonderzeichen enthalten');
  }
  
  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Großbuchstaben enthalten');
  }
  
  return errors;
}

/**
 * Überprüft, ob eine Benutzerrolle gültig ist
 * @param role Die zu überprüfende Rolle
 * @returns Wahr, wenn die Rolle gültig ist
 */
export function isValidUserRole(role: string | undefined): role is UserRole {
  if (!role) return false;
  return ['free', 'premium', 'admin'].includes(role);
}

/**
 * Überprüft, ob ein Benutzerobjekt vollständig ist
 * @param user Das zu überprüfende Benutzerobjekt
 * @returns Wahr, wenn das Objekt ein vollständiger Benutzer ist
 */
export function isCompleteUser(user: Partial<User> | null): user is User {
  return !!user && 
    typeof user.id === 'string' && 
    typeof user.email === 'string' && 
    !!user.role && isValidUserRole(user.role);
}

/**
 * Überprüft, ob ein Auth-Status gültig ist
 * @param status Der zu überprüfende Status
 * @returns Wahr, wenn der Status gültig ist
 */
export function isValidAuthStatus(status: string): status is AuthStatus {
  return ['authenticated', 'unauthenticated', 'loading'].includes(status);
} 