/**
 * @file features/mode/types/index.ts
 * @description Kern-Typdefinitionen für das vereinfachte Mode-System
 */

import { 
  AppMode, 
  APP_MODES, 
  isValidAppMode, 
  UserStatus, 
  USER_STATUS, 
  ModeErrorType, 
  MODE_ERROR_TYPES 
} from '@/types/common/appMode';

// Re-exportieren der gemeinsamen Typen für Abwärtskompatibilität
export { 
  AppMode, 
  APP_MODES, 
  isValidAppMode, 
  UserStatus, 
  USER_STATUS, 
  ModeErrorType, 
  MODE_ERROR_TYPES 
};

/**
 * Rückgabetyp für eine Modus-Änderungsoperation
 */
export interface ModeChangeResult {
  success: boolean;         // Ob die Operation erfolgreich war
  currentMode: AppMode;     // Der aktuelle Modus nach der Operation
  requiresAuth: boolean;    // Ob Authentifizierung benötigt wird
  error?: string;           // Optionale Fehlermeldung
  errorType?: ModeErrorType; // Optionaler Fehlertyp
}

/**
 * Events, die vom Mode-System emittiert werden
 */
export enum ModeEvents {
  APP_MODE_CHANGED = 'appModeChanged',
  USER_STATUS_CHANGED = 'userStatusChanged',
  MODE_ERROR = 'modeError'
}

/**
 * Event-Payload für Mode-Änderungsereignisse
 */
export interface ModeChangeEventPayload<T> {
  oldValue: T;
  newValue: T;
}

/**
 * Event-Payload für Demo-Account-Änderungen
 */
export interface DemoAccountChangeEventPayload {
  oldValue: boolean;
  newValue: boolean;
}

/**
 * Benutzerdefinierter Fehler für Mode-Operationen
 */
export class ModeError extends Error {
  /**
   * @param {ModeErrorType} type Der Typ des Fehlers
   * @param {string} message Die Fehlermeldung
   * @param {unknown} details Optionale Details zum Fehler
   */
  constructor(
    public type: ModeErrorType,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ModeError';
  }
} 