/**
 * @file features/auth/types/index.ts
 * @description Kern-Typdefinitionen für das Auth-System
 * 
 * Diese Datei enthält alle zentralen Typdefinitionen für das Auth-System.
 * Alle anderen Module sollten diese Typen importieren, um Konsistenz zu gewährleisten.
 */

import { z } from 'zod';

/**
 * Verfügbare Benutzerrollen
 */
export type UserRole = 'free' | 'pro' | 'premium' | 'admin';

/**
 * Konstanten für Benutzerrollen zur konsistenten Verwendung
 */
export const USER_ROLES = {
  FREE: 'free' as UserRole,
  PRO: 'pro' as UserRole,
  PREMIUM: 'premium' as UserRole,
  ADMIN: 'admin' as UserRole
};

/**
 * Hierarchie der Rollen für Berechtigungsprüfungen
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'free': 0,
  'pro': 1,
  'premium': 2,
  'admin': 3
};

/**
 * Benutzertypen
 */
export type UserType = 'GUEST' | 'DEMO_USER' | 'REGISTERED_USER';

/**
 * Konstanten für Benutzertypen zur konsistenten Verwendung
 */
export const USER_TYPES = {
  GUEST: 'GUEST' as UserType,
  DEMO_USER: 'DEMO_USER' as UserType,
  REGISTERED_USER: 'REGISTERED_USER' as UserType
};

/**
 * Aktionen, die Authentifizierung erfordern
 */
export type AuthRequiredAction = 
  | 'login' 
  | 'register' 
  | 'profile' 
  | 'settings'
  | 'verify-email'
  | 'reset-password'
  | 'two-factor-auth'
  | 'complete-profile';

/**
 * Konstanten für Auth-Aktionen zur konsistenten Verwendung
 */
export const AUTH_REQUIRED_ACTIONS = {
  LOGIN: 'login' as AuthRequiredAction,
  REGISTER: 'register' as AuthRequiredAction,
  PROFILE: 'profile' as AuthRequiredAction,
  SETTINGS: 'settings' as AuthRequiredAction,
  VERIFY_EMAIL: 'verify-email' as AuthRequiredAction,
  RESET_PASSWORD: 'reset-password' as AuthRequiredAction,
  TWO_FACTOR_AUTH: 'two-factor-auth' as AuthRequiredAction,
  COMPLETE_PROFILE: 'complete-profile' as AuthRequiredAction
};

/**
 * Authentifizierter Benutzer
 */
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  type: UserType;
  profileImage?: string | null;
  headerImage?: string | null;
  companyName?: string;
  headline?: string;
  website?: string;
  description?: string;
  location?: string;
  industry?: string;
  isVerified: boolean;
  joinDate: Date;
  rating?: number;
}

/**
 * Authentifizierungsantwort vom Server
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expires?: number;
}

/**
 * Fehlermeldungen bei Authentifizierung
 */
export type AuthErrorType = 
  | 'invalid_credentials'
  | 'user_exists'
  | 'network_error'
  | 'server_error'
  | 'validation_error'
  | 'session_expired'
  | 'unauthorized'
  | 'token_expired'
  | 'unknown';

/**
 * Konstanten für Auth-Fehlertypen zur konsistenten Verwendung
 */
export const AUTH_ERROR_TYPES = {
  INVALID_CREDENTIALS: 'invalid_credentials' as AuthErrorType,
  USER_EXISTS: 'user_exists' as AuthErrorType,
  NETWORK_ERROR: 'network_error' as AuthErrorType,
  SERVER_ERROR: 'server_error' as AuthErrorType,
  VALIDATION_ERROR: 'validation_error' as AuthErrorType,
  SESSION_EXPIRED: 'session_expired' as AuthErrorType,
  UNAUTHORIZED: 'unauthorized' as AuthErrorType,
  TOKEN_EXPIRED: 'token_expired' as AuthErrorType,
  UNKNOWN: 'unknown' as AuthErrorType
};

/**
 * AuthStatus: Authentifizierungszustand des Nutzers
 */

export interface AuthenticatedStatus {
  type: 'authenticated';
  userId: string;
  timestamp: number;
}

export interface UnauthenticatedStatus {
  type: 'unauthenticated';
  reason?: 'logout' | 'expired' | 'initial' | 'demo';
  timestamp: number;
}

export interface LoadingStatus {
  type: 'loading';
  timestamp: number;
}

export type AuthStatus = AuthenticatedStatus | UnauthenticatedStatus | LoadingStatus;

/**
 * AuthStatus-Schema für Zod-Validierung
 */
export const authStatusSchema = z.union([
  z.object({
    type: z.literal('authenticated'),
    userId: z.string(),
    timestamp: z.number()
  }),
  z.object({
    type: z.literal('unauthenticated'),
    reason: z.enum(['logout', 'expired', 'initial', 'demo']).optional(),
    timestamp: z.number()
  }),
  z.object({
    type: z.literal('loading'),
    timestamp: z.number()
  })
]); 