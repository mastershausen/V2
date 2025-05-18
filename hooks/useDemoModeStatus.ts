/**
 * useDemoModeStatus Hook
 *
 * Dieser Hook bietet eine vereinfachte Schnittstelle zur Verwaltung des Demo-Modus
 * und trennt klar zwischen Modusumschaltung und Authentifizierungsstatus.
 *
 * Hauptfunktionalitäten:
 * - Prüfung des aktuellen Demo-Modus
 * - Sichere Umschaltung zwischen Demo- und Echtbetrieb
 * - Klare Trennung zwischen Anmeldestatus und Modus
 * - Typensichere Schnittstelle
 * @returns Ein Objekt mit Funktionen und Status für die Verwaltung des Demo-Modus
 */

import { useCallback, useEffect, useState } from 'react';

import { isDemoMode, isLiveMode } from '@/features/auth/config/modes';
import { useModeStore, modeEventEmitter } from '@/features/mode/stores';
import { ModeEvents } from '@/features/mode/types';
import { switchAppMode } from '@/services/auth';
import { logger } from '@/utils/logger';
import { getBuildService } from '@/utils/service/serviceHelper';

type DemoModeState = {
  // Zustand
  isDemoMode: boolean;         // Ob die App im Demo-Modus läuft
  isDemoAccount: boolean;      // Ob ein Demo-Account aktiv ist
  canToggleMode: boolean;      // Ob der Modus umgeschaltet werden kann
  
  // Aktionen
  enableDemoMode: () => boolean;   // Aktiviert den Demo-Modus (wenn möglich)
  disableDemoMode: () => boolean;  // Deaktiviert den Demo-Modus (wenn aktiv)
  loginWithDemoAccount: () => void; // Anmeldung mit dem Demo-Account
};

/**
 * Hook zur Verwaltung des Demo-Modus-Status
 *
 * Bietet eine saubere, reaktive Schnittstelle zur Verwaltung des Demo-Modus
 * basierend auf dem zentralen useModeStore.
 * @returns Ein Objekt mit Funktionen und Status für die Demo-Modus-Verwaltung
 */
export function useDemoModeStatus(): DemoModeState {
  // Zugriff auf den ModeStore
  const { isDemoAccount, setDemoAccount } = useModeStore();
  
  // Status-Management - Verwende die Helper-Funktion statt direkten Vergleich
  const [localIsDemoMode, setLocalIsDemoMode] = useState(() => isDemoMode());
  
  // Prüfen, ob der Modus umgeschaltet werden kann - nur in DevBuild möglich
  const canToggleMode = getBuildService().isDevBuild();

  // Handler für Modus-Änderungen
  const handleModeChange = useCallback(() => {
    setLocalIsDemoMode(isDemoMode());
  }, []);

  // Registriert Listener für Modus-Änderungen
  useEffect(() => {
    // Event-Listener für App-Modus-Änderungen
    const handleAppModeChanged = () => {
      handleModeChange();
    };

    // Event-Listener registrieren
    modeEventEmitter.on(ModeEvents.APP_MODE_CHANGED, handleAppModeChanged);

    // Bereinigungsfunktion
    return () => {
      modeEventEmitter.removeListener(ModeEvents.APP_MODE_CHANGED, handleAppModeChanged);
    };
  }, [handleModeChange]);

  // Demo-Modus aktivieren
  const enableDemoMode = useCallback((): boolean => {
    try {
      // Prüfe, ob wir bereits im Demo-Modus sind
      if (isDemoMode()) {
        logger.info('App befindet sich bereits im Demo-Modus');
        return true;
      }
      
      // Verwendung der auth switchAppMode-Funktion, die Buildtyp berücksichtigt
      switchAppMode('demo');
      return true;
    } catch (error) {
      logger.error('Fehler beim Aktivieren des Demo-Modus:', String(error));
      return false;
    }
  }, []);

  // Demo-Modus deaktivieren
  const disableDemoMode = useCallback((): boolean => {
    try {
      // Prüfe, ob wir bereits im Live-Modus sind
      if (isLiveMode()) {
        logger.info('App befindet sich bereits im Live-Modus');
        return true;
      }
      
      // Verwendung der auth switchAppMode-Funktion, die Buildtyp berücksichtigt
      switchAppMode('live');
      return true;
    } catch (error) {
      logger.error('Fehler beim Deaktivieren des Demo-Modus:', String(error));
      return false;
    }
  }, []);

  // Mit Demo-Account anmelden
  const loginWithDemoAccount = useCallback((): void => {
    setDemoAccount(true);
  }, [setDemoAccount]);

  // Das vollständige Objekt zurückgeben
  return {
    isDemoMode: localIsDemoMode,
    isDemoAccount,
    canToggleMode,
    enableDemoMode,
    disableDemoMode,
    loginWithDemoAccount
  };
} 