/**
 * @file stores/actions/authActions.ts
 * @description Aktionen für den Auth-Store nach dem Goldstandard
 * 
 * Diese Datei enthält alle Aktionen für den Auth-Store, separiert von der 
 * State-Definition für bessere Wartbarkeit und Testbarkeit.
 */

import { AUTH_ERROR_MESSAGES } from '@/features/auth/config';
import { isDemoMode } from '@/features/auth/config/modes';
import { sessionService } from '@/features/auth/services';
import { AuthStatus } from '@/features/auth/types';
import { User } from '@/types/auth';
import { AppMode, isValidAppMode } from '@/types/common/appMode';
import { logger } from '@/utils/logger';

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

// Typdefinitionen für Parameter
type SetFunction = (
  state: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)
) => void;

type GetFunction = () => AuthState;

/**
 * Erstellt alle Auth-Store-Aktionen
 * @param set Zustand-Setter-Funktion
 * @param get Zustand-Getter-Funktion
 * @returns Objekt mit allen Auth-Store-Aktionen
 */
export const createAuthActions = (
  set: SetFunction,
  get: GetFunction
) => {
  return {
    /**
     * Setzt einen Benutzer als eingeloggt im Store
     * @param user Der einzulogende Benutzer
     * @returns Promise mit dem Ergebnis als boolean
     */
    login: async (user: User): Promise<boolean> => {
      set({ isLoading: true, error: null });
      try {
        if (isDemoMode()) {
          // Demo-Login: Setze Demo-Status
          set({
            user,
            authStatus: { type: 'unauthenticated', reason: 'demo', timestamp: Date.now() },
            isLoading: false
          });
          logger.info('Demo-User angemeldet', { userId: user.id });
          return true;
        }
        // Live-Login wie gehabt
        const success = await sessionService.saveSession(user, { type: 'authenticated', userId: user.id, timestamp: Date.now() });
        if (success) {
          set({ 
            user, 
            authStatus: { type: 'authenticated', userId: user.id, timestamp: Date.now() }, 
            isLoading: false 
          });
          logger.info('Benutzer erfolgreich angemeldet', { userId: user.id });
          return true;
        } else {
          set({ 
            error: AUTH_ERROR_MESSAGES.SESSION_SAVE_FAILED, 
            isLoading: false, 
            authStatus: { type: 'unauthenticated', reason: 'logout', timestamp: Date.now() } 
          });
          logger.error('Anmeldung fehlgeschlagen: Sitzung konnte nicht gespeichert werden');
          return false;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Login-Fehler:', errorMessage);
        set({ 
          error: errorMessage, 
          isLoading: false, 
          authStatus: { type: 'unauthenticated', reason: 'logout', timestamp: Date.now() } 
        });
        return false;
      }
    },

    /**
     * Meldet den aktuellen Benutzer ab
     * @returns Promise mit dem Ergebnis als boolean
     */
    logout: async (): Promise<boolean> => {
      try {
        // Benutze SessionService für das Logout
        const success = await sessionService.logout();
        
        if (success) {
          // Lokalen Zustand löschen
          set({ 
            user: null, 
            authStatus: { type: 'unauthenticated', reason: 'logout', timestamp: Date.now() },
            error: null
          });
          logger.info('Benutzer erfolgreich abgemeldet');
          return true;
        } else {
          set({ error: AUTH_ERROR_MESSAGES.SESSION_LOAD_FAILED });
          logger.error('Abmeldung fehlgeschlagen: Sitzung konnte nicht gelöscht werden');
          return false;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Logout-Fehler:', errorMessage);
        set({ error: errorMessage });
        return false;
      }
    },

    /**
     * Setzt den Auth-Status
     * @param status Der zu setzende Auth-Status
     */
    setAuthStatus: (status: AuthStatus): void => {
      set({ authStatus: status });
      logger.debug('Auth-Status geändert:', status);
    },

    /**
     * Setzt eine Fehlermeldung im Store
     * @param error Die zu setzende Fehlermeldung oder null zum Löschen
     */
    setError: (error: string | null): void => {
      set({ error });
      if (error) {
        logger.error('Auth-Fehler gesetzt:', error);
      } else {
        logger.debug('Auth-Fehler zurückgesetzt');
      }
    },

    /**
     * Löscht den aktuellen Fehler im Store
     */
    clearError: (): void => {
      set({ error: null });
      logger.debug('Auth-Fehler gelöscht');
    },

    /**
     * Setzt den App-Modus
     * @param mode Der zu setzende App-Modus
     * @returns true, wenn der Modus gültig ist und gesetzt wurde, sonst false
     */
    setAppMode: (mode: AppMode): boolean => {
      if (!isValidAppMode(mode)) {
        logger.error('Ungültiger App-Modus:', mode);
        return false;
      }
      
      const currentMode = get().appMode;
      if (currentMode === mode) {
        logger.debug('App-Modus unverändert:', mode);
        return true;
      }
      
      set({ appMode: mode });
      logger.info('App-Modus geändert:', { from: currentMode, to: mode });
      return true;
    },

    /**
     * Setzt den Lade-Status
     * @param isLoading Der zu setzende Lade-Status
     */
    setLoading: (isLoading: boolean): void => {
      set({ isLoading });
      logger.debug('Lade-Status geändert:', isLoading);
    },

    /**
     * Initialisiert den Auth-Store durch Laden der Sitzung
     */
    initialize: async (): Promise<void> => {
      set({ isLoading: true, authStatus: { type: 'loading', timestamp: Date.now() } });
      try {
        // Lade Sitzung aus dem SessionService
        const sessionData = await sessionService.loadSession();
        
        if (sessionData && sessionData.user && sessionData.authStatus && sessionData.authStatus.type === 'authenticated') {
          // Sitzungsdaten in den Store übernehmen
          set({ 
            user: sessionData.user as unknown as User, 
            authStatus: { type: 'authenticated', userId: sessionData.user.id, timestamp: Date.now() }, 
            isLoading: false, 
            isInitialized: true 
          });
          logger.info('Auth-Store initialisiert mit authentifiziertem Benutzer', {
            userId: sessionData.user.id
          });
        } else {
          // Keine gültige Session, als unauthentifiziert markieren
          set({ 
            user: null, 
            authStatus: { type: 'unauthenticated', reason: 'logout', timestamp: Date.now() }, 
            isLoading: false, 
            isInitialized: true 
          });
          logger.info('Auth-Store initialisiert ohne gültige Sitzung');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Fehler bei der Initialisierung des Auth-Stores:', errorMessage);
        set({ 
          error: errorMessage, 
          isLoading: false, 
          authStatus: { type: 'unauthenticated', reason: 'logout', timestamp: Date.now() }, 
          isInitialized: true 
        });
      }
    }
  };
}; 