/**
 * Logger-Utility für die Anwendung
 * 
 * Stellt Methoden für einheitliches Logging bereit und
 * unterdrückt Logs im Produktionsmodus für bessere Performance.
 */
import { isLiveMode } from '@/features/auth/config/modes';

interface LoggerOptions {
  // Ob Logs im Produktionsmodus angezeigt werden sollen
  showInProduction?: boolean;
  // Präfix, der allen Logs vorangestellt wird
  prefix?: string;
}

/**
 * Typen für Log-Parameter, die mehr Klarheit bieten als 'unknown[]'
 */
type LogParam = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined 
  | Error 
  | object 
  | Array<unknown>;

const defaultOptions: LoggerOptions = {
  showInProduction: false,
  prefix: '🔧 Solvbox'
};

/**
 * Logger-Klasse für einheitliches Logging in der Anwendung
 * Unterstützt verschiedene Log-Level und kann im Produktionsmodus
 * automatisch deaktiviert werden.
 */
class LoggerClass {
  private options: LoggerOptions;

  constructor(options: LoggerOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Prüft, ob das Logging aktiviert sein sollte
   * @returns {boolean} Ob logging aktiv sein sollte
   */
  private shouldLog(): boolean {
    // Im Produktionsmodus nicht loggen, außer es ist explizit erlaubt
    if (isLiveMode() && !this.options.showInProduction) {
      return false;
    }
    return true;
  }

  /**
   * Formatiert die Nachricht mit dem konfigurierten Präfix
   * @param {string} message Die zu formatierende Nachricht
   * @returns {string} Formatierte Nachricht
   */
  private formatMessage(message: string): string {
    return this.options.prefix ? `${this.options.prefix} | ${message}` : message;
  }

  /**
   * Loggt eine Debug-Nachricht
   * @param {string} message Die Nachricht
   * @param {LogParam[]} args Zusätzliche Argumente
   */
  debug(message: string, ...args: LogParam[]): void {
    if (this.shouldLog()) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage(message), ...args);
    }
  }

  /**
   * Loggt eine Info-Nachricht
   * @param {string} message Die Nachricht
   * @param {LogParam[]} args Zusätzliche Argumente
   */
  info(message: string, ...args: LogParam[]): void {
    if (this.shouldLog()) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage(message), ...args);
    }
  }

  /**
   * Loggt eine Warnung
   * @param {string} message Die Warnung
   * @param {LogParam[]} args Zusätzliche Argumente
   */
  warn(message: string, ...args: LogParam[]): void {
    if (this.shouldLog()) {
      // eslint-disable-next-line no-console
      console.warn(this.formatMessage(message), ...args);
    }
  }

  /**
   * Loggt einen Fehler
   * @param {string} message Die Fehlermeldung
   * @param {LogParam[]} args Zusätzliche Argumente
   */
  error(message: string, ...args: LogParam[]): void {
    if (this.shouldLog()) {
      // eslint-disable-next-line no-console
      console.error(this.formatMessage(message), ...args);
    }
  }

  /**
   * Erstellt einen neuen Logger mit benutzerdefinierten Optionen
   * @param {LoggerOptions} options Logger-Optionen
   * @returns {LoggerClass} Neuer Logger
   */
  create(options: LoggerOptions): LoggerClass {
    return new LoggerClass({
      ...this.options,
      ...options
    });
  }
}

// Exportiere eine Singleton-Instanz
export const logger = new LoggerClass();

/**
 * Erstellt einen benutzerdefinierten Logger mit eigenen Optionen
 *
 * Nützlich für modulspezifische Logger mit eigenem Präfix oder
 * besonderen Produktions-Einstellungen.
 * @param {LoggerOptions} options - Konfigurationsoptionen für den neuen Logger
 * @param {boolean} [options.showInProduction] - Ob Logs auch im Produktionsmodus angezeigt werden sollen
 * @param {string} [options.prefix] - Präfix für alle Log-Ausgaben
 * @returns {LoggerClass} Eine neue Logger-Instanz mit den angegebenen Optionen
 */
export function createLogger(options: LoggerOptions): LoggerClass {
  return logger.create(options);
} 