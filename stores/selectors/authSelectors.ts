/**
 * @file stores/selectors/authSelectors.ts
 * @description Selektoren für den Auth-Store nach dem Goldstandard
 * 
 * Diese Datei enthält alle Selektoren für den Auth-Store, separiert von der
 * State-Definition für bessere Wartbarkeit und Testbarkeit.
 */

import { AuthStatus } from '@/features/auth/types';
import { User } from '@/types/auth';
import { AppMode } from '@/types/common/appMode';

// Typdefinition für den Auth-Store-Zustand
interface AuthState {
  // Status-Felder
  authStatus: AuthStatus;
  isInitialized: boolean;
  isLoading: boolean;
  appMode: AppMode;
  error: string | null;
  
  // Benutzer-Felder
  user: User | null;
}

// Typdefinition für GetFunction
type GetFunction = () => AuthState;

/**
 * Erstellt alle Auth-Store-Selektoren
 * @param get Zustand-Getter-Funktion
 * @returns Objekt mit allen Auth-Store-Selektoren
 */
export const createAuthSelectors = (get: GetFunction) => {
  return {
    /**
     * Prüft, ob der Benutzer authentifiziert ist
     * @returns true, wenn der Benutzer authentifiziert ist, false sonst
     */
    isAuthenticated: (): boolean => {
      return get().authStatus.type === 'authenticated';
    },

    /**
     * Prüft, ob der Benutzer nicht authentifiziert ist
     * @returns true, wenn der Benutzer nicht authentifiziert ist, false sonst
     */
    isUnauthenticated: (): boolean => {
      return get().authStatus.type === 'unauthenticated';
    },

    /**
     * Prüft, ob der Auth-Store geladen wird
     * @returns true, wenn der Auth-Store geladen wird, false sonst
     */
    checkLoading: (): boolean => {
      return get().isLoading || get().authStatus.type === 'loading';
    },

    /**
     * Prüft, ob ein Fehler aufgetreten ist
     * @returns true, wenn ein Fehler aufgetreten ist, false sonst
     */
    hasError: (): boolean => {
      return !!get().error;
    },

    /**
     * Gibt den aktuellen Benutzer zurück
     * @returns Der aktuelle Benutzer oder null, wenn kein Benutzer angemeldet ist
     */
    getUser: (): User | null => {
      return get().user;
    },

    /**
     * Gibt die Benutzer-ID zurück, wenn ein Benutzer angemeldet ist
     * @returns Die Benutzer-ID oder null, wenn kein Benutzer angemeldet ist
     */
    getUserId: (): string | null => {
      return get().user?.id || null;
    },

    /**
     * Gibt die Benutzerrolle zurück, wenn ein Benutzer angemeldet ist
     * @returns Die Benutzerrolle oder null, wenn kein Benutzer angemeldet ist
     */
    getUserRole: (): string | null => {
      return get().user?.role || null;
    },

    /**
     * Prüft, ob der angemeldete Benutzer eine bestimmte Rolle hat
     * @param role Die zu prüfende Rolle
     * @returns true, wenn der Benutzer die angegebene Rolle hat, false sonst
     */
    hasRole: (role: string): boolean => {
      return get().user?.role === role;
    },

    /**
     * Gibt den aktuellen Auth-Status zurück
     * @returns Der aktuelle Auth-Status
     */
    getAuthStatus: (): AuthStatus => {
      return get().authStatus;
    },

    /**
     * Gibt den aktuellen App-Modus zurück
     * @returns Der aktuelle App-Modus
     */
    getAppMode: (): AppMode => {
      return get().appMode;
    },

    /**
     * Prüft, ob der App-Modus Demo ist
     * @returns true, wenn der App-Modus Demo ist, false sonst
     */
    isDemoMode: (): boolean => {
      return get().appMode === 'demo';
    },

    /**
     * Prüft, ob der App-Modus Live ist
     * @returns true, wenn der App-Modus Live ist, false sonst
     */
    isLiveMode: (): boolean => {
      return get().appMode === 'live';
    },

    /**
     * Prüft, ob der App-Modus Development ist
     * @returns true, wenn der App-Modus Development ist, false sonst
     */
    isDevelopmentMode: (): boolean => {
      return get().appMode === 'development';
    },

    /**
     * Gibt den aktuellen Fehler zurück
     * @returns Der aktuelle Fehler oder null, wenn kein Fehler aufgetreten ist
     */
    getError: (): string | null => {
      return get().error;
    },

    /**
     * Gibt ein Objekt mit allen relevanten Auth-Status-Informationen zurück
     * @returns Objekt mit Auth-Status-Informationen
     */
    getAuthInfo: () => {
      const state = get();
      return {
        isAuthenticated: state.authStatus.type === 'authenticated',
        isLoading: state.isLoading || state.authStatus.type === 'loading',
        hasError: !!state.error,
        user: state.user,
        appMode: state.appMode,
        error: state.error,
        authStatus: state.authStatus
      };
    }
  };
}; 