/**
 * @file features/mode/hooks/useNetStatus.ts
 * @description Hook für Netzwerkstatus-Verwaltung
 * 
 * Stellt einen Netzwerkstatus-Hook zur Verfügung, der den aktuellen Verbindungsstatus überwacht
 * und entsprechende Statuswerte und Funktionen bereitstellt.
 */

import NetInfoModule, { 
  NetInfoState, 
  NetInfoStateType,
  fetch as netInfoFetch,
  addEventListener 
} from '@react-native-community/netinfo';
import { useEffect, useState, useCallback } from 'react';

import { logger } from '@/utils/logger';

/**
 * Typdefinition für das Ergebnis des useNetStatus-Hooks
 */
export interface NetStatusResult {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
  details: NetInfoState | null;
  checkConnection: () => Promise<NetInfoState>;
}

/**
 * Hook zur Überwachung des Netzwerkstatus
 * @returns {NetStatusResult} Aktueller Netzwerkstatus und Hilfsfunktionen
 */
export function useNetStatus(): NetStatusResult {
  const [netState, setNetState] = useState<NetInfoState>({
    type: NetInfoStateType.unknown,
    isConnected: true,
    isInternetReachable: null,
    details: null
  });

  // Aktuellen Netzwerkstatus prüfen
  const checkConnection = useCallback(async (): Promise<NetInfoState> => {
    try {
      const state = await netInfoFetch();
      setNetState(state);
      return state;
    } catch (error) {
      logger.error('Fehler beim Abrufen des Netzwerkstatus', error instanceof Error ? error.message : String(error));
      return netState;
    }
  }, [netState]);

  // Netzwerkstatus-Änderungen überwachen
  useEffect(() => {
    const unsubscribe = addEventListener((state) => {
      setNetState(state);
      
      if (!state.isConnected) {
        logger.debug('Netzwerkverbindung verloren', {
          type: state.type,
          isConnected: state.isConnected
        });
      } else if (state.isConnected && !netState.isConnected) {
        logger.debug('Netzwerkverbindung wiederhergestellt', {
          type: state.type,
          isConnected: state.isConnected
        });
      }
    });

    // Initialen Status abrufen
    checkConnection();

    // Listener entfernen, wenn Komponente unmounted wird
    return () => {
      unsubscribe();
    };
  }, [netState.isConnected, checkConnection]);

  return {
    isConnected: netState.isConnected ?? true,
    isInternetReachable: netState.isInternetReachable,
    connectionType: netState.type,
    details: netState,
    checkConnection
  };
} 