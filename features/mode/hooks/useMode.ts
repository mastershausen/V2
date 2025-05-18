/**
 * useMode Hook - Basis-Hook für Mode-Operationen
 * 
 * Bietet eine einfache, wiederverwendbare Schnittstelle für alle Mode-bezogenen
 * Operationen, einschließlich Zustandsmanagement, Modus-Wechsel und Event-Handling.
 * 
 * WICHTIG: Die Mode-Logik wird NUR im DevBuild implementiert. Dabei spiegelt der
 * Demo-Mode den DemoBuild wider und der Live-Mode den LiveBuild.
 */

import { useNetInfo } from '@react-native-community/netinfo';
import {useCallback, useState} from 'react';

// Importe für Typen und Hooks
import { useModeStore } from '@/features/mode/stores';
import { ModeChangeResult } from '@/features/mode/types';
import { AppMode, UserStatus } from '@/types/common/appMode';


/**
 * Rückgabetyp für den useMode-Hook
 */
export interface UseModeResult {
  // Zustandsinformationen
  currentAppMode: AppMode;        // Der aktuelle App-Modus
  appMode: AppMode;               // Alias für currentAppMode (Kompatibilität mit useAppMode)
  userStatus: UserStatus;         // Der aktuelle Benutzerstatus
  isDemoMode: () => boolean;      // Funktion, die prüft, ob der Demo-Modus aktiv ist
  isLiveMode: () => boolean;      // Funktion, die prüft, ob der Live-Modus aktiv ist
  isDemoAccount: boolean;         // Ob ein Demo-Account verwendet wird
  isTransitioning: boolean;       // Alias für isChangingMode (Kompatibilität mit useAppMode)
  isChangingMode: boolean;        // Ob gerade ein Moduswechsel stattfindet
  
  // Modus-Wechsel-Funktionen
  setMode: (mode: AppMode) => Promise<ModeChangeResult>; // Setzt den Modus mit detaillierten Ergebnissen
  setAppMode: (mode: AppMode) => Promise<boolean>;       // Setzt den App-Modus
  toggleAppMode: () => Promise<boolean>;                 // Wechselt zwischen Demo und Live
  switchToDemoMode: () => Promise<ModeChangeResult>;     // Wechselt zum Demo-Modus
  switchToLiveMode: () => Promise<ModeChangeResult>;     // Wechselt zum Live-Modus
  
  // Benutzer-bezogene Funktionen
  setUserStatus: (status: UserStatus) => Promise<boolean>; // Setzt den Benutzerstatus
  setDemoAccount: (isDemoAccount: boolean) => void;      // Setzt den Demo-Account-Status
  
  // Feature-Flags
  canSwitchModes: boolean;        // Ob Modi gewechselt werden können
  usesMockData: boolean;          // Ob Mock-Daten verwendet werden
  showsDebugButtons: boolean;     // Ob Debug-Buttons angezeigt werden
  hasNetworkConnection: boolean;  // Ob eine Netzwerkverbindung besteht (Kompatibilität)
  
  // Fehlerbehandlung
  lastError: string | null;       // Letzter aufgetretener Fehler
  lastErrorType: string | null;   // Typ des letzten Fehlers (Kompatibilität)
  hasError: boolean;              // Ob ein Fehler vorliegt (Kompatibilität)
  resetModeError: () => void;     // Setzt den letzten Fehler zurück
  clearError: () => void;         // Alias für resetModeError (Kompatibilität)
  
  // Hilfsfunktionen
  getModeDisplayName: (mode: AppMode) => string; // Gibt den Anzeigenamen für einen Modus zurück
}

/**
 * Hook für die zentrale Verwaltung aller Mode-bezogenen Operationen
 *
 * Dieser Hook kapselt den Zugriff auf den modeStore und bietet eine
 * einfache, reaktive Schnittstelle für alle Mode-bezogenen Operationen.
 * @returns {UseModeResult} Objekt mit Zustand und Funktionen für Mode-Operationen
 */
export function useMode(): UseModeResult {
  // Zugriff auf den zentralen modeStore
  const modeStore = useModeStore();
  
  // Netzwerkstatus überwachen (für Kompatibilität mit useAppMode)
  const netInfo = useNetInfo();
  const hasNetworkConnection = netInfo.isConnected === true;
  
  // Lokaler Status für Übergänge
  const [isChangingMode, setIsChangingMode] = useState(false);
  
  // Hole die Eigenschaften aus dem modeStore
  // Im aktuellen Store sind diese als appMode und userStatus benannt
  const {
    appMode: storeAppMode,
    userStatus: storeUserStatus,
    setAppMode: storeSetAppMode,
    toggleAppMode: storeToggleAppMode,
    isDemoAccount,
    setUserStatus: storeSetUserStatus,
    setDemoAccount: storeSetDemoAccount,
    lastError: storeLastError,
    lastErrorType: storeLastErrorType,
    clearError: storeClearError
  } = modeStore;
  
  // Abgeleitete Werte für die Kompatibilität
  const currentAppMode = storeAppMode;
  
  // Implementierung von setMode mit ModeChangeResult (ähnlich useAppMode)
  const setMode = useCallback(async (mode: AppMode): Promise<ModeChangeResult> => {
    try {
      setIsChangingMode(true);
      
      // Prüfe, ob Modus-Wechsel unter aktuellen Bedingungen möglich ist
      if (mode === 'live' && !hasNetworkConnection) {
        setIsChangingMode(false);
        return {
          success: false,
          currentMode: currentAppMode,
          requiresAuth: true,
          error: 'Keine Netzwerkverbindung für Live-Modus verfügbar',
          errorType: 'network_error'
        };
      }

      // Live-Modus erfordert Authentifizierung
      const requiresAuth = mode === 'live' && storeUserStatus !== 'authenticated';

      // Führe Modus-Wechsel durch
      await storeSetAppMode(mode);
      
      setIsChangingMode(false);
      return {
        success: true,
        currentMode: mode,
        requiresAuth
      };
    } catch (error) {
      setIsChangingMode(false);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Unbekannter Fehler beim Wechsel zu ${mode}-Modus`;
      
      return {
        success: false,
        currentMode: currentAppMode,
        requiresAuth: mode === 'live',
        error: errorMessage,
        errorType: 'invalid_state'
      };
    }
  }, [currentAppMode, storeUserStatus, hasNetworkConnection, storeSetAppMode]);
  
  // Hilfsfunktionen für Moduswechsel
  const switchToDemoMode = useCallback(() => setMode('demo'), [setMode]);
  const switchToLiveMode = useCallback(() => setMode('live'), [setMode]);
  
  // Wrapper für setAppMode
  const setAppMode = useCallback(async (mode: AppMode): Promise<boolean> => {
    try {
      await storeSetAppMode(mode);
      return true;
    } catch (_) {
      return false;
    }
  }, [storeSetAppMode]);
  
  // Wrapper für toggleAppMode
  const toggleAppMode = useCallback(async (): Promise<boolean> => {
    try {
      await storeToggleAppMode();
      return true;
    } catch (_) {
      return false;
    }
  }, [storeToggleAppMode]);
  
  // Wrapper für setUserStatus
  const setUserStatus = useCallback(async (status: UserStatus): Promise<boolean> => {
    try {
      await storeSetUserStatus(status);
      return true;
    } catch (_) {
      return false;
    }
  }, [storeSetUserStatus]);
  
  // Hilfsfunktion für Modusnamen
  const getModeDisplayName = useCallback((mode: AppMode): string => {
    switch (mode) {
      case 'demo':
        return 'Demo-Modus';
      case 'live':
        return 'Live-Modus';
      default:
        return 'Unbekannter Modus';
    }
  }, []);
  
  // Erstelle das Ergebnisobjekt mit allen Zuständen und Funktionen,
  // abgeleitet von den verfügbaren Eigenschaften
  return {
    // Zustandsinformationen
    currentAppMode,
    appMode: storeAppMode, // Direkter Zugriff auf den Store-Wert
    userStatus: storeUserStatus, // Direkter Zugriff auf den Store-Wert
    isDemoMode: function() { 
      // Direkt vom App-Modus ableiten
      return currentAppMode === 'demo';
    },
    isLiveMode: function() { 
      // Direkt vom App-Modus ableiten
      return currentAppMode === 'live';
    },
    isDemoAccount: isDemoAccount || false,
    isChangingMode,
    isTransitioning: isChangingMode, // Alias für Kompatibilität
    
    // Modus-Wechsel-Funktionen
    setMode,
    setAppMode,
    toggleAppMode,
    switchToDemoMode,
    switchToLiveMode,
    
    // Benutzer-bezogene Funktionen
    setUserStatus,
    setDemoAccount: storeSetDemoAccount || (() => {}),
    
    // Feature-Flags
    canSwitchModes: true,
    usesMockData: currentAppMode === 'demo',
    showsDebugButtons: __DEV__,
    hasNetworkConnection, // Für Kompatibilität
    
    // Fehlerbehandlung
    lastError: storeLastError || null,
    lastErrorType: storeLastErrorType || null,
    hasError: !!storeLastError,
    resetModeError: storeClearError || (() => {}),
    clearError: storeClearError || (() => {}),
    
    // Hilfsfunktionen
    getModeDisplayName
  };
} 