/**
 * Typdefinitionen für den appModeStore
 * 
 * Verwaltet den App-Modus und Demo-Modus-Funktionalität
 */


import { AppMode } from '@/features/mode/types';
import { UserStatus } from '@/types/common/appMode';



/**
 * Basiszustand des appModeStores
 * Enthält nur die State-Eigenschaften, keine Aktionen
 */
export interface AppModeState {
  // Zustandsdaten
  userStatus: UserStatus;
  appMode: AppMode;
  isDemoAccount: boolean;
}

/**
 * Vollständiger appModeStore-Typ mit Aktionen und Hilfsfunktionen
 */
export interface AppModeStore extends AppModeState {
  // Haupt-API für Benutzer-Status
  setUserStatus: (newStatus: UserStatus, options?: {
    userId?: string;
    authenticatedModeImageUrl?: string;
    demoModeImageUrl?: string;
  }) => boolean;
  
  // Legacy-API für Demo-Modus (nutzen stattdessen setUserStatus)
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  toggleDemoMode: (userId?: string, authenticatedModeImageUrl?: string, demoModeImageUrl?: string) => boolean;
  loginWithDemoAccount: () => boolean;
  
  // Abfrage des aktuellen Status
  getUserStatus: () => UserStatus;
  
  // App-Modus Funktionen
  setAppMode: (mode: AppMode) => void;
  getAppMode: () => AppMode;
  
  // Hilfsfunktionen
  isDemoMode: () => boolean;
  isAuthenticatedMode: () => boolean;
  isGuestMode: () => boolean;
  isProduction: () => boolean;
  isInDemoContext: () => boolean;
  
  // Demo-Account-Funktionen
  setDemoAccount: (isDemoAccount: boolean) => void;
  
  // Spezialisierte Funktion für Registrierung
  forceAuthenticatedModeAfterRegistration: () => boolean;
} 