/**
 * Aktionen für den apiStore
 */
import { ApiState } from '../types/apiTypes';

// Typen für die Aktionsfunktionen
type SetFunction = (fn: (state: ApiState) => Partial<ApiState>) => void;
type GetFunction = () => ApiState;

// Erstellt die Aktionen für den apiStore
export const createApiActions = (set: SetFunction, get: GetFunction) => ({
  /**
   * Eine neue Anfrage starten
   * @param key
   */
  startRequest: (key: string) => {
    set((state) => ({
      requests: {
        ...state.requests,
        [key]: {
          status: 'loading',
          error: null,
          timestamp: Date.now(),
        },
      },
    }));
  },
  
  /**
   * Eine Anfrage abschließen
   * @param key
   * @param success
   * @param error
   */
  finishRequest: (key: string, success: boolean, error?: string) => {
    set((state) => ({
      requests: {
        ...state.requests,
        [key]: {
          status: success ? 'success' : 'error',
          error: success ? null : error || 'Ein unbekannter Fehler ist aufgetreten',
          timestamp: Date.now(),
        },
      },
    }));
  },
  
  /**
   * Globalen Fehlerstatus setzen
   * @param error
   */
  setGlobalError: (error: string | null) => {
    set(() => ({ globalError: error }));
  },
  
  /**
   * Online-Status setzen
   * @param online
   */
  setIsOnline: (online: boolean) => {
    set(() => ({ isOnline: online }));
  },
  
  /**
   * Eine Anfrage zurücksetzen
   * @param key
   */
  resetRequest: (key: string) => {
    set((state) => {
      const newRequests = { ...state.requests };
      delete newRequests[key];
      return { requests: newRequests };
    });
  },
  
  /**
   * Alle Anfragen zurücksetzen
   */
  clearAllRequests: () => {
    set(() => ({ requests: {} }));
  },
}); 