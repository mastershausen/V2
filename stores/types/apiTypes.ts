/**
 * Typdefinitionen für den apiStore
 */

/**
 * API-Status-Typen
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Schnittstelle für Request-Tracking
 */
export interface RequestTracker {
  [key: string]: {
    status: RequestStatus;
    error: string | null;
    timestamp: number;
  };
}

/**
 * Basis-Zustand für den API-Store
 * Enthält nur die State-Eigenschaften, keine Aktionen
 */
export interface ApiState {
  // Zustandsdaten
  requests: RequestTracker;
  globalError: string | null;
  isOnline: boolean;
}

/**
 * Vollständiger apiStore-Typ mit allen Funktionen
 */
export interface ApiStore extends ApiState {
  // Aktionen
  startRequest: (key: string) => void;
  finishRequest: (key: string, success: boolean, error?: string) => void;
  setGlobalError: (error: string | null) => void;
  setIsOnline: (online: boolean) => void;
  resetRequest: (key: string) => void;
  clearAllRequests: () => void;
  
  // Hilfsfunktionen
  getRequestStatus: (key: string) => RequestStatus;
  isLoading: (key: string) => boolean;
  hasError: (key: string) => boolean;
  getError: (key: string) => string | null;
} 