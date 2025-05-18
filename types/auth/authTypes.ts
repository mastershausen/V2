/**
 * @file types/auth/authTypes.ts
 * @description Haupttypen für die Auth-Funktionalität und den useAuth Hook
 */

import { AuthRequiredAction, UserSessionData } from './sessionTypes';
import { AuthStatus, AppMode } from './statusTypes';
import { User } from './userTypes';

/**
 * Kontext-Werte für den Auth-Provider
 */
export interface AuthContextValue {
  // Aktuelle Authentifizierungsinformationen
  user: User | null;
  authStatus: AuthStatus;
  
  // App-Modus und Sitzungsinformationen
  appMode: AppMode;
  session: UserSessionData | null;
  
  // Auth-Funktionen
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (userData: RegisterUserData) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  refreshSession: () => Promise<boolean>;
  
  // Demo- und Gast-Funktionen
  createDemoSession: () => Promise<UserSessionData>;
  createGuestSession: () => Promise<UserSessionData>;
  
  // Hilfsfunktionen
  clearErrors: () => void;
  isAuthenticated: () => boolean;
}

/**
 * Ergebnis einer Auth-Operation
 */
export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: string;
  errorCode?: string;
  requiresAction?: AuthRequiredAction;
}

/**
 * Daten für die Benutzerregistrierung
 */
export interface RegisterUserData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
  acceptDataPolicy: boolean;
  marketingConsent?: boolean;
}

/**
 * Optionen für den Auth-Provider
 */
export interface AuthProviderOptions {
  initialAppMode?: AppMode;
  autoLogin?: boolean;
  persistSession?: boolean;
  tokenRefreshInterval?: number;
  onSessionExpired?: () => void;
}

/**
 * Standard Auth-Provider-Optionen
 */
export const DEFAULT_AUTH_PROVIDER_OPTIONS: AuthProviderOptions = {
  initialAppMode: 'live',
  autoLogin: true,
  persistSession: true,
  tokenRefreshInterval: 5 * 60 * 1000, // 5 Minuten
};

/**
 * Type-Guard für das AuthResult
 * @param result Das zu prüfende Ergebnis
 * @returns True, wenn das Ergebnis ein gültiges AuthResult ist
 */
export function isValidAuthResult(result: unknown): result is AuthResult {
  if (!result || typeof result !== 'object') return false;
  
  const authResult = result as AuthResult;
  return (
    typeof authResult.success === 'boolean' &&
    (authResult.user === undefined || authResult.user === null || typeof authResult.user === 'object') &&
    (authResult.error === undefined || typeof authResult.error === 'string')
  );
} 