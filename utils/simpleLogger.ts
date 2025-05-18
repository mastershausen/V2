/**
 * SimpleLogger-Utility für einheitliches Logging in der App
 */

// Typen für die Logger-Parameter
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogParam = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined 
  | Record<string, unknown> 
  | unknown[] 
  | Error;

/**
 * Einfacher Logger für einheitliches Logging
 */
export const logger = {
  /**
   * Gibt eine Debug-Nachricht aus (nur im Entwicklungsmodus)
   * @param message Die Nachricht
   * @param params Zusätzliche Parameter
   */
  debug(message: string, ...params: LogParam[]): void {
    if (__DEV__) {
      console.debug(`[DEBUG] ${message}`, ...params);
    }
  },

  /**
   * Gibt eine Info-Nachricht aus
   * @param message Die Nachricht
   * @param params Zusätzliche Parameter
   */
  info(message: string, ...params: LogParam[]): void {
    if (__DEV__) {
      console.info(`[INFO] ${message}`, ...params);
    }
  },

  /**
   * Gibt eine Warnung aus
   * @param message Die Nachricht
   * @param params Zusätzliche Parameter
   */
  warn(message: string, ...params: LogParam[]): void {
    console.warn(`[WARN] ${message}`, ...params);
  },

  /**
   * Gibt eine Fehlermeldung aus
   * @param message Die Nachricht
   * @param params Zusätzliche Parameter
   */
  error(message: string, ...params: LogParam[]): void {
    console.error(`[ERROR] ${message}`, ...params);
  }
}; 