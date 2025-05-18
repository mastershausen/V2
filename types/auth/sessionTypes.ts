/**
 * @file types/auth/sessionTypes.ts
 * @description Typen für Session-Management und Auth-Daten
 */

import { AuthStatus } from './statusTypes';
import { User, UserType } from './userTypes';

/**
 * Datenstruktur für die Benutzersitzung
 * Enthält alle notwendigen Informationen für eine aktive Session
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
  expiresAt?: number;
  device?: SessionDeviceInfo;
}

/**
 * Geräteinformationen für eine Session
 */
export interface SessionDeviceInfo {
  id?: string;
  platform?: 'ios' | 'android' | 'web';
  deviceName?: string;
  lastActive?: number;
}

/**
 * Authentifizierungsdaten für einen Benutzer
 * Verwendet für die Kommunikation mit dem Auth-System
 */
export interface AuthData {
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;
  refreshToken?: string;
  expiresAt?: number;
}

/**
 * Basis-Antwortstruktur für Auth-Operationen
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
  requiresAction?: AuthRequiredAction;
}

/**
 * Aktionen, die nach einer Auth-Operation erforderlich sein könnten
 */
export type AuthRequiredAction = 
  | 'verify-email'
  | 'reset-password' 
  | 'two-factor-auth'
  | 'complete-profile';

/**
 * Konstanten für Auth-Aktionen
 */
export const AUTH_REQUIRED_ACTIONS = {
  VERIFY_EMAIL: 'verify-email' as AuthRequiredAction,
  RESET_PASSWORD: 'reset-password' as AuthRequiredAction,
  TWO_FACTOR_AUTH: 'two-factor-auth' as AuthRequiredAction,
  COMPLETE_PROFILE: 'complete-profile' as AuthRequiredAction
};

/**
 * Type-Guard zur Validierung einer AuthRequiredAction
 * @param action Die zu prüfende Aktion
 * @returns True, wenn die Aktion gültig ist
 */
export function isValidAuthRequiredAction(action: unknown): action is AuthRequiredAction {
  return typeof action === 'string' && 
    Object.values(AUTH_REQUIRED_ACTIONS).includes(action as AuthRequiredAction);
}

/**
 * Prüft, ob eine Session gültig ist
 * @param session Die zu prüfende Session
 * @returns True, wenn die Session gültig ist und alle erforderlichen Felder enthält
 */
export function isValidSession(session: UserSessionData | null): boolean {
  if (!session) return false;
  
  return (
    !!session.user &&
    typeof session.user.id === 'string' &&
    typeof session.user.email === 'string' &&
    typeof session.authStatus === 'object' &&
    typeof session.authStatus.type === 'string' &&
    typeof session.timestamp === 'number'
  );
}

/**
 * Prüft, ob eine Session abgelaufen ist
 * @param session Die zu prüfende Session
 * @returns True, wenn die Session abgelaufen ist oder kein Ablaufdatum hat
 */
export function isSessionExpired(session: UserSessionData | null): boolean {
  if (!session || !isValidSession(session)) return true;
  
  // Wenn kein Ablaufdatum gesetzt ist, verwenden wir einen Standardwert von 24 Stunden
  const expiresAt = session.expiresAt || (session.timestamp + 24 * 60 * 60 * 1000);
  return Date.now() > expiresAt;
} 