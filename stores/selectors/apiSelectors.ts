/**
 * Selektoren für den apiStore
 */
import { ApiState, RequestStatus } from '../types/apiTypes';

// Typen für die Selektorfunktionen
type GetFunction = () => ApiState;

// Erstellt die Selektoren für den apiStore
export const createApiSelectors = (get: GetFunction) => ({
  /**
   * Status einer Anfrage abrufen
   * @param key
   */
  getRequestStatus: (key: string): RequestStatus => {
    return get().requests[key]?.status || 'idle';
  },
  
  /**
   * Prüfen, ob eine Anfrage lädt
   * @param key
   */
  isLoading: (key: string): boolean => {
    const getRequestStatus = createApiSelectors(get).getRequestStatus;
    return getRequestStatus(key) === 'loading';
  },
  
  /**
   * Prüfen, ob eine Anfrage einen Fehler hat
   * @param key
   */
  hasError: (key: string): boolean => {
    const getRequestStatus = createApiSelectors(get).getRequestStatus;
    return getRequestStatus(key) === 'error';
  },
  
  /**
   * Fehlermeldung einer Anfrage abrufen
   * @param key
   */
  getError: (key: string): string | null => {
    return get().requests[key]?.error || null;
  },
}); 