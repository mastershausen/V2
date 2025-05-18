import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus, View, Text } from 'react-native';

import { appMode } from '@/config/app';
import { logger } from '@/utils/logger';

import { useApiStore } from './apiStore';
import { useModeStore } from './modeStore';
import { useUserStore } from './userStore';


interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * StoreProvider ist für die globale Store-Initialisierung und -Verwaltung verantwortlich.
 * Er überwacht den Netzwerkstatus, den App-Zustand und führt andere globale Store-bezogene Aufgaben aus.
 * @param root0
 * @param root0.children
 */
export function StoreProvider({ children }: StoreProviderProps) {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const { setIsOnline } = useApiStore();
  const { refreshToken, isAuthenticated } = useUserStore();
  const { setAppMode } = useModeStore();

  // Netzwerkstatus überwachen
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      // Online-Status im API Store setzen
      setIsOnline(state.isConnected ?? true);
      
      // Bei Offline-Wechsel prüfen, ob Demo-Modus aktiviert werden soll
      if (!(state.isConnected ?? true)) {
        console.log('Netzwerk nicht verfügbar. Offline-Funktionalität wird verwendet.');
      }
    });

    // Initialen Netzwerkstatus abrufen
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, [setIsOnline]);

  // App-Zustand überwachen für Token-Aktualisierungen
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isAuthenticated()) {
        // Token aktualisieren, wenn App in den Vordergrund kommt
        await refreshToken();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [refreshToken, isAuthenticated]);

  // Stores initialisieren
  useEffect(() => {
    const initializeStores = async () => {
      // App-Modus wird jetzt nicht mehr beim Start gesetzt
      // So wird der Modus nur bei Login und Registrierung explizit gesetzt
      // setAppMode(appMode);
      
      // Store-Initialisierung abgeschlossen
      setIsStoreReady(true);
    };

    initializeStores();
  }, [setAppMode]);

  if (!isStoreReady) {
    // Du könntest hier einen Ladeindikator anzeigen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Lädt...</Text>
      </View>
    );
  }

  return <>{children}</>;
} 