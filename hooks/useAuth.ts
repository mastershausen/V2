/**
 * @file hooks/useAuth.ts
 * @description Zentraler Auth-Hook basierend auf dem Goldstandard
 * 
 * Dieser Hook kapselt alle Authentifizierungsfunktionen und -zustände
 * und stellt eine einheitliche API nach dem Vorbild von useMySolvbox zur Verfügung.
 * Die Implementierung basiert auf dem bestehenden AuthContext-Muster,
 * ist aber modular aufgebaut und nutzt Basis-Hooks.
 */

import { useCallback, useMemo } from 'react';


import { AuthStatus } from '@/features/auth/types';
import { useErrorHandler, ErrorNotificationType } from '@/hooks/useErrorHandler';
import { login as serviceLogin, logout as serviceLogout, register as serviceRegister, switchAppMode as serviceSwitchAppMode } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types/auth';
import { AppMode } from '@/types/common/appMode';

export interface UseAuthResult {
  // Zustandsdaten
  user: User | null;
  authStatus: AuthStatus;
  appMode: AppMode;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;

  // Aktionen
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (email: string, password: string, name?: string, skipEmailCheck?: boolean) => Promise<boolean>;
  switchAppMode: (mode: AppMode) => Promise<boolean>;
  clearError: () => void;
}

/**
 * useAuth - Zentraler Hook für alle Authentifizierungsfunktionalitäten
 *
 * Implementiert nach dem Goldstandard mit klarer Trennung von UI und Logik,
 * stabilen Referenzen durch useCallback/useMemo und typsicherer API.
 * Fehlerbehandlung wird mit useErrorHandler standardisiert.
 * @returns {UseAuthResult} Eine einheitliche API für alle Auth-Operationen
 */
export function useAuth(): UseAuthResult {
  // Auth-Store und Zustandsdaten
  const store = useAuthStore();
  
  // Fehlerbehandlung über den useErrorHandler-Basis-Hook
  const { error, handleError, clearError, setError } = useErrorHandler({
    loggerPrefix: '🔐 Auth',
    defaultNotificationType: ErrorNotificationType.TOAST
  });

  // Selektoren für Store-Daten mit Memoization für stabile Referenzen
  const selectors = useMemo(() => {
    // AuthStatus ist jetzt ein String-Literal-Typ
    const authStatusType = store.authStatus;
    return {
      user: store.user,
      authStatus: store.authStatus,
      appMode: store.appMode,
      storeError: store.error,
      isAuthenticated: authStatusType === 'authenticated',
      isLoading: authStatusType === 'loading'
    };
  }, [store.user, store.authStatus, store.appMode, store.error]);

  // Login-Funktion mit Fehlerbehandlung
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Wrapper-Funktion für handleError
    const handleLogin = handleError<[], boolean>(async () => {
      // Service-Funktion aufrufen
      const result = await serviceLogin(email, password);
      
      // Bei Fehler den Fehler im Hook-Zustand speichern
      if (!result.success && result.error) {
        setError(new Error(result.error));
        return false;
      }
      
      return result.success;
    }, {
      errorMessage: 'Anmeldung fehlgeschlagen',
      notificationType: ErrorNotificationType.TOAST
    });
    
    // Stellen sicher, dass immer ein Boolean zurückgegeben wird
    const result = await handleLogin();
    return result === undefined ? false : result;
  }, [handleError, setError]);

  // Logout-Funktion mit Fehlerbehandlung
  const logout = useCallback(async (): Promise<boolean> => {
    // Wrapper-Funktion für handleError
    const handleLogout = handleError<[], boolean>(async () => {
      // Service-Funktion aufrufen
      const result = await serviceLogout();
      
      // Bei Fehler den Fehler im Hook-Zustand speichern
      if (!result.success && result.error) {
        setError(new Error(result.error));
        return false;
      }
      
      return result.success;
    }, {
      errorMessage: 'Abmeldung fehlgeschlagen',
      notificationType: ErrorNotificationType.TOAST
    });
    
    // Stellen sicher, dass immer ein Boolean zurückgegeben wird
    const result = await handleLogout();
    return result === undefined ? false : result;
  }, [handleError, setError]);

  // Register-Funktion mit Fehlerbehandlung
  const register = useCallback(async (
    email: string,
    password: string,
    name?: string,
    skipEmailCheck: boolean = false
  ): Promise<boolean> => {
    // Wrapper-Funktion für handleError
    const handleRegister = handleError<[], boolean>(async () => {
      // Service-Funktion aufrufen
      const result = await serviceRegister(email, password, name, skipEmailCheck);
      
      // Bei Fehler den Fehler im Hook-Zustand speichern
      if (!result.success && result.error) {
        setError(new Error(result.error));
        return false;
      }
      
      return result.success;
    }, {
      errorMessage: 'Registrierung fehlgeschlagen',
      notificationType: ErrorNotificationType.TOAST
    });
    
    // Stellen sicher, dass immer ein Boolean zurückgegeben wird
    const result = await handleRegister();
    return result === undefined ? false : result;
  }, [handleError, setError]);

  // App-Modus wechseln
  const switchAppMode = useCallback(async (mode: AppMode): Promise<boolean> => {
    // Wrapper-Funktion für handleError
    const handleSwitchMode = handleError<[], boolean>(async () => {
      // Service-Funktion aufrufen
      const result = await serviceSwitchAppMode(mode);
      
      // Bei Fehler den Fehler im Hook-Zustand speichern
      if (!result.success && result.error) {
        setError(new Error(result.error));
        return false;
      }
      
      return result.success;
    }, {
      errorMessage: `Wechsel zum ${mode}-Modus fehlgeschlagen`,
      notificationType: ErrorNotificationType.TOAST
    });
    
    // Stellen sicher, dass immer ein Boolean zurückgegeben wird
    const result = await handleSwitchMode();
    return result === undefined ? false : result;
  }, [handleError, setError]);

  // Vollständiges Ergebnis mit optimierter API zurückgeben
  return useMemo(() => ({
    // Zustandsdaten
    user: selectors.user,
    authStatus: selectors.authStatus,
    appMode: selectors.appMode,
    isAuthenticated: selectors.isAuthenticated,
    isLoading: selectors.isLoading,
    error,
    
    // Aktionen
    login,
    logout,
    register,
    switchAppMode,
    clearError,
  }), [
    selectors.user,
    selectors.authStatus,
    selectors.appMode,
    selectors.isAuthenticated,
    selectors.isLoading,
    error,
    login,
    logout,
    register,
    switchAppMode,
    clearError
  ]);
} 