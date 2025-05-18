import { useState, useCallback } from 'react';

import { logger } from '@/utils/logger';

// Standardlogger für den Error-Handler
const errorLogger = logger.create({ prefix: '🚨 ErrorHandler' });

/**
 * Typen von Fehlerbenachrichtigungen
 */
export enum ErrorNotificationType {
  NONE = 'none',
  TOAST = 'toast',
  INLINE = 'inline',
  ALERT = 'alert',
}

/**
 * Konfigurationsoptionen für den Error-Handler
 */
export interface ErrorHandlerOptions {
  /**
   * Ein benutzerdefinierter Logger-Präfix für bereichsspezifisches Logging
   */
  loggerPrefix?: string;
  
  /**
   * Standardtyp für Fehlerbenachrichtigungen
   */
  defaultNotificationType?: ErrorNotificationType;
  
  /**
   * Callback, der ausgeführt wird, wenn ein Fehler auftritt
   */
  onError?: (error: Error) => void;
}

/**
 * Rückgabewerte des useErrorHandler Hooks
 */
export interface ErrorHandlerReturn {
  /**
   * Der aktuelle Fehlerzustand
   */
  error: Error | null;
  
  /**
   * Setzt den Fehlerzustand
   */
  setError: (error: Error | null) => void;
  
  /**
   * Löscht den aktuellen Fehler
   */
  clearError: () => void;
  
  /**
   * Umschließt eine Funktion mit einer try-catch-Logik
   */
  handleError: <T extends any[], R>(
    fn: (...args: T) => Promise<R> | R,
    options?: {
      errorMessage?: string;
      rethrow?: boolean;
      notificationType?: ErrorNotificationType;
    }
  ) => (...args: T) => Promise<R | undefined>;
  
  /**
   * Der Typ der aktuellen Fehlerbenachrichtigung
   */
  notificationType: ErrorNotificationType;
}

/**
 * Ein zentraler Hook für konsistentes Error-Handling in der gesamten Anwendung.
 * Bietet eine einheitliche Schnittstelle für Fehlerbehandlung, -protokollierung und -anzeige.
 * @param options
 * @example
 * // Grundlegende Verwendung
 * const { error, handleError } = useErrorHandler();
 * 
 * // Verwenden mit einer asynchronen Funktion
 * const fetchData = handleError(async () => {
 *   const response = await api.getData();
 *   return response.data;
 * });
 * 
 * // Aufrufen der umschlossenen Funktion
 * useEffect(() => {
 *   fetchData();
 * }, []);
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}): ErrorHandlerReturn {
  const [error, setError] = useState<Error | null>(null);
  const [notificationType, setNotificationType] = useState<ErrorNotificationType>(
    options.defaultNotificationType || ErrorNotificationType.INLINE
  );
  
  // Erstelle einen bereichsspezifischen Logger, wenn ein Präfix angegeben wurde
  const customLogger = options.loggerPrefix 
    ? logger.create({ prefix: options.loggerPrefix }) 
    : errorLogger;
  
  /**
   * Löscht den aktuellen Fehler
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Verarbeitet einen Fehler und führt die entsprechenden Aktionen aus
   */
  const processError = useCallback((
    error: Error,
    customMessage?: string,
    customNotificationType?: ErrorNotificationType
  ) => {
    // Konvertiere unbekannte Fehler in Error-Objekte
    const errorObj = error instanceof Error 
      ? error 
      : new Error(customMessage || 'Ein unbekannter Fehler ist aufgetreten');
    
    // Protokolliere den Fehler
    customLogger.error(customMessage || errorObj.message, errorObj);
    
    // Setze den Fehlerzustand
    setError(errorObj);
    
    // Setze den Benachrichtigungstyp, wenn angegeben
    if (customNotificationType) {
      setNotificationType(customNotificationType);
    }
    
    // Rufe den onError-Callback auf, wenn vorhanden
    if (options.onError) {
      options.onError(errorObj);
    }
    
    return errorObj;
  }, [customLogger, options]);
  
  /**
   * Umschließt eine Funktion mit einer try-catch-Logik
   */
  const handleError = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R> | R,
    handlerOptions?: {
      errorMessage?: string;
      rethrow?: boolean;
      notificationType?: ErrorNotificationType;
    }
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        const result = await fn(...args);
        return result;
      } catch (err) {
        const errorObj = processError(
          err instanceof Error ? err : new Error(String(err)),
          handlerOptions?.errorMessage,
          handlerOptions?.notificationType
        );
        
        // Wenn rethrow aktiviert ist, wirf den Fehler erneut
        if (handlerOptions?.rethrow) {
          throw errorObj;
        }
        
        return undefined;
      }
    };
  }, [processError]);
  
  return {
    error,
    setError,
    clearError,
    handleError,
    notificationType,
  };
} 