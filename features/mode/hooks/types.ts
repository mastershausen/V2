/**
 * @file features/mode/hooks/types.ts
 * @description Typdefinitionen für die Hooks im Mode-System
 */

import { AppStateStatus } from 'react-native';

import { AppMode, UserStatus } from '@/types/common/appMode';

import { ModeChangeResult, ModeErrorType } from '../types';

/**
 * Rückgabetyp für den useAppMode-Hook
 */
export interface UseAppModeResult {
  // Primitive Zustandswerte
  appMode: AppMode;
  userStatus: UserStatus;
  isDemoAccount: boolean;
  isTransitioning: boolean;
  lastError: string | null;
  lastErrorType: ModeErrorType | null;
  
  // Netzwerk- und App-Status
  hasNetworkConnection: boolean;
  appState: AppStateStatus;
  
  // Abgeleitete Zustandswerte
  isDemoMode: () => boolean;
  isLiveMode: () => boolean;
  isAuthenticated: boolean;
  isDemoUser: boolean;
  isGuest: boolean;
  
  // Feature-Flags
  usesMockData: boolean;
  showsDebugButtons: boolean;
  
  // Berechtigungen
  canSwitchModes: boolean;
  
  // Fehlerstatus
  hasError: boolean;
  isNetworkError: boolean;
  isAuthError: boolean;
  
  // Aktionen zur App-Modus-Verwaltung
  setMode: (mode: AppMode) => Promise<ModeChangeResult>;
  switchToDemoMode: () => Promise<ModeChangeResult>;
  switchToLiveMode: () => Promise<ModeChangeResult>;
  
  // Legacy-Kompatibilität
  setAppMode: (mode: AppMode) => Promise<void>;
  toggleAppMode: () => Promise<void>;
  
  // Aktionen zur Benutzerstatus-Verwaltung
  setUserStatus: (status: UserStatus) => Promise<boolean>;
  setDemoAccount: (isDemoAccount: boolean) => void;
  
  // Fehlerbehandlung
  setError: (error: string, errorType: ModeErrorType) => void;
  clearError: () => void;
  resetError: () => void;  // Alias für verbesserte Namensgebung
  
  // Hilfsfunktionen
  getModeDisplayName: (mode: AppMode) => string;
}

/**
 * Rückgabetyp für den useMode-Hook
 */
export interface UseModeResult {
  // Zustandsinformationen
  currentAppMode: AppMode;        // Der aktuelle App-Modus
  userStatus: UserStatus;         // Der aktuelle Benutzerstatus
  isDemoMode: () => boolean;      // Funktion, die prüft, ob der Demo-Modus aktiv ist
  isLiveMode: () => boolean;      // Funktion, die prüft, ob der Live-Modus aktiv ist
  isDemoAccount: boolean;         // Ob ein Demo-Account verwendet wird
  isChangingMode: boolean;        // Ob gerade ein Moduswechsel stattfindet
  
  // Modus-Wechsel-Funktionen
  setAppMode: (mode: AppMode) => Promise<boolean>;   // Setzt den App-Modus
  toggleAppMode: () => Promise<boolean>;             // Wechselt zwischen Demo und Live
  
  // Benutzer-bezogene Funktionen
  setUserStatus: (status: UserStatus) => Promise<boolean>; // Setzt den Benutzerstatus
  setDemoAccount: (isDemoAccount: boolean) => void;  // Setzt den Demo-Account-Status
  
  // Feature-Flags
  canSwitchModes: boolean;        // Ob Modi gewechselt werden können
  usesMockData: boolean;          // Ob Mock-Daten verwendet werden
  showsDebugButtons: boolean;     // Ob Debug-Buttons angezeigt werden
  
  // Fehlerbehandlung
  lastError: string | null;       // Letzter aufgetretener Fehler
  resetModeError: () => void;     // Setzt den letzten Fehler zurück
} 