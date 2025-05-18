/**
 * @file features/auth/config/demo-users.ts
 * @description Demo-Benutzer für die Authentifizierung im Demo-Modus
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
 * Standard-Demo-Benutzer für die Anwendung
 */
export const DEFAULT_DEMO_USER = DEMO_USERS.find(user => user.email === 'alexander@beckerundpartner.de') || DEMO_USERS[0];

/**
 * Überprüft, ob eine E-Mail zu einem Demo-Benutzer gehört
 * @param email Die zu überprüfende E-Mail
 * @returns True, wenn die E-Mail zu einem Demo-Benutzer gehört
 */
export function isDemoUser(email: string): boolean {
  return DEMO_USERS.some(user => user.email === email);
}

/**
 * Holt Demo-Benutzer anhand der E-Mail
 * @param email Die E-Mail des zu findenden Demo-Benutzers
 * @returns Der Demo-Benutzer oder undefined, wenn nicht gefunden
 */
export function getDemoUserByEmail(email: string) {
  return DEMO_USERS.find(user => user.email === email);
}

/**
 * Überprüft die Demo-Anmeldeinformationen
 * @param email Die E-Mail des Benutzers
 * @param password Das Passwort des Benutzers
 * @returns Der Demo-Benutzer bei erfolgreicher Authentifizierung oder null
 */
export function validateDemoCredentials(email: string, password: string) {
  const user = DEMO_USERS.find(
    user => user.email === email && user.password === password
  );
  return user || null;
} 