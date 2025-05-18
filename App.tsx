import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
// Weitere Imports...

import { sessionService } from '@/features/auth/services';
import { useModeStore } from '@/features/mode/stores';
import initializeApp from '@/utils/initializeApp';
import { logger } from '@/utils/logger';
import bootstrapServices from '@/utils/service/initServices';
import { getStorageService } from '@/utils/service/serviceHelper';
import { APP_STORAGE_KEYS } from '@/utils/storageKeys';

// ModeStore ist bereits bei Import durch Zustand initialisiert, keine explizite Initialisierung mehr nötig

// Helper-Funktionen für App-Modi
const isLiveMode = () => useModeStore.getState().appMode === 'live';
const isDemoMode = () => useModeStore.getState().appMode === 'demo';

// Monkey-Patching für AsyncStorage Logging
const origSetItem = AsyncStorage.setItem;
AsyncStorage.setItem = async (key, value, ...args) => {
  if (key === 'mode-storage') {
    console.warn('[DEBUG][AsyncStorage.setItem] mode-storage:', value);
  }
  return origSetItem(key, value, ...args);
};
const origGetItem = AsyncStorage.getItem;
AsyncStorage.getItem = async (key, ...args) => {
  const result = await origGetItem(key, ...args);
  if (key === 'mode-storage') {
    console.warn('[DEBUG][AsyncStorage.getItem] mode-storage:', result);
  }
  return result;
};

/**
 * Hauptkomponente der App
 */
export default function App() {
  // App-Startup-Effekt zum Überprüfen des App-Status und Wiederherstellen des Standardzustands
  useEffect(() => {
    const setupApp = async () => {
      logger.info('App wird initialisiert...');
      
      try {
        // Services werden jetzt im Root-Layout initialisiert
        
        // Zentrale App-Initialisierung
        await initializeApp();
        logger.info('Zentrale App-Initialisierung abgeschlossen');

        // Hole Storage Service
        const storageService = getStorageService();

        // Prüfen, ob die App zuvor beendet wurde
        const appWasClosed = await storageService.loadData<boolean>(APP_STORAGE_KEYS.APP_WAS_CLOSED);
        
        if (appWasClosed) {
          logger.info('App wurde zuvor beendet - führe Session-Bereinigung durch');
          // Setze das Flag zurück
          await storageService.saveData(APP_STORAGE_KEYS.APP_WAS_CLOSED, false);
          
          // Beim ersten Start nach App-Schließung führe Logout durch, wenn wir im Live-Modus sind
          if (isLiveMode()) {
            await sessionService.logout();
            logger.info('Session nach App-Neustart zurückgesetzt');
          }
        }
        
        // Prüfen, ob eine gültige Session existiert
        const hasValidLiveSession = await sessionService.hasValidLiveSession();
        
        logger.info(`App-Start: Gültige Live-Session gefunden: ${hasValidLiveSession}`);
        
        // Im Live-Modus: Bereinigung beim App-Neustart prüfen
        if (isLiveMode()) {
          // Standardzustand bei Bedarf wiederherstellen
          const sessionData = await sessionService.loadSession();
          
          if (sessionData) {
            logger.info('Session geladen: ' + sessionData.user.type);
          } else {
            logger.info('Keine gültige Session gefunden, Standardzustand wurde wiederhergestellt');
          }
        }
        
        // Beim App-Start auch prüfen, ob die Demo-Session zurückgesetzt werden soll
        if (isDemoMode()) {
          const shouldResetDemoSession = await storageService.loadData<boolean>(APP_STORAGE_KEYS.RESET_DEMO_SESSION_ON_START);
          
          if (shouldResetDemoSession) {
            logger.info('Demo-Session wird zurückgesetzt...');
            await sessionService.logout();
            await storageService.saveData(APP_STORAGE_KEYS.RESET_DEMO_SESSION_ON_START, false);
          }
        }
      } catch (error) {
        logger.error('Fehler beim Initialisieren der App:', String(error));
      }
    };
    
    // App initialisieren
    setupApp();
    
    // App-Zustandsänderungen überwachen
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App wird geschlossen oder in den Hintergrund verschoben
        if (isLiveMode()) {
          logger.info('App wird beendet: Markiere für Bereinigung beim nächsten Start');
          // Markiere die App als geschlossen für den nächsten Start
          // (nicht await, da wir den Thread nicht blockieren wollen)
          sessionService.clearOnAppExit().catch((error: Error) => 
            logger.error('Fehler beim Markieren der App als geschlossen:', String(error))
          );
        }
      }
    };
    
    // Event-Listener registrieren
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Bereinigen beim Unmount
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Restlicher App-Code...
} 