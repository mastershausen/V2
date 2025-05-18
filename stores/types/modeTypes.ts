/**
 * Typdefinitionen für den modeStore
 * 
 * Zentrale Definitionen für alle Typen, die mit dem App-Modus zusammenhängen
 */

import { 
  AppMode, 
  UserStatus,
  ModeEvents, 
  ModeErrorType,
  DemoAccountChangeEventPayload,
  ModeChangeEventPayload
} from '@/features/mode/types';

// Re-export wichtiger Typen für Konsistenz
export { 
  AppMode, 
  UserStatus, 
  ModeEvents, 
  ModeErrorType,
  DemoAccountChangeEventPayload,
  ModeChangeEventPayload 
};

/**
 * Zustandstyp für den Mode Store
 */
export interface ModeState {
  // Grundzustände
  currentAppMode: AppMode;
  currentUserStatus: UserStatus;
  isDemoAccount: boolean;
  
  // Status-Flags
  isChangingMode: boolean;
  lastError: string | null;
  
  // Status-Tracking
  lastModeChange: string | null;
}

/**
 * Aktionen des Mode Store
 */
export interface ModeActions {
  // Hauptaktionen für App-Modus
  setAppMode: (mode: AppMode) => Promise<boolean>;
  toggleAppMode: () => Promise<boolean>;
  
  // Benutzer-Modus-Aktionen
  setUserStatus: (status: UserStatus) => Promise<boolean>;
  
  // Demo-Account-Aktionen
  setDemoAccount: (isDemoAccount: boolean) => void;
  
  // Hilfsfunktionen
  initializeStore: () => void;
  resetModeError: () => void;
}

/**
 * Abgeleitete Werte (Selektoren)
 */
export interface ModeSelectors {
  // Modus-Prüfungen
  isDemoMode: () => boolean;
  isLiveMode: () => boolean;
  isDevelopmentMode: () => boolean;
  
  // Feature-Flags basierend auf Modus
  canSwitchModes: () => boolean;
  usesMockData: () => boolean;
  showsDebugButtons: () => boolean;
}

/**
 * Vollständiger Mode Store mit Zustand, Aktionen und Selektoren
 */
export type ModeStore = ModeState & ModeActions & ModeSelectors; 