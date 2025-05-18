/**
 * @file features/auth/components/AppStateHandler.tsx
 * @description Überwacht den App-Zustand und setzt Flags entsprechend
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { AUTH_STORAGE_KEYS } from '@/features/auth/config';
import { sessionService } from '@/features/auth/services';
import { useAuthStore } from '@/stores/authStore';
import { saveObject } from '@/utils/storage';
import { logger } from '@/utils/logger';

/**
 * AppStateHandler-Komponente
 * Überwacht den App-Zustand und führt Aktionen aus, wenn die App in den Hintergrund wechselt
 * Setzt das APP_WAS_CLOSED-Flag, wenn die App in den Hintergrund wechselt
 */
export function AppStateHandler() {
  // Referenz für den letzten App-Zustand
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  // Timer-Referenz für das Zurücksetzen des Status
  const backgroundTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Zugriff auf den Auth-Store
  const { user, authStatus, logout } = useAuthStore();
  
  // App-Zustand überwachen
  useEffect(() => {
    // Funktion zur Behandlung von App-Zustandsänderungen
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;
      
      logger.debug(`App-Zustand ändert sich: ${previousAppState} -> ${nextAppState}`);
      
      // Wenn die App in den Hintergrund wechselt
      if (
        (previousAppState === 'active' && (nextAppState === 'background' || nextAppState === 'inactive'))
      ) {
        logger.debug('🔄 App wechselt in den Hintergrund');
        
        // Sofort das APP_WAS_CLOSED-Flag setzen
        await saveObject(AUTH_STORAGE_KEYS.APP_WAS_CLOSED, true);
        
        // Bereinigen Sie die Sitzung über den SessionService
        await sessionService.clearOnAppExit();
        
        // Setzen Sie einen Timer für den Fall, dass die App für längere Zeit im Hintergrund ist
        // Dies hilft bei iOS, wo die App möglicherweise im Hintergrund bleibt, aber nicht aktiv ist
        if (backgroundTimerRef.current) {
          clearTimeout(backgroundTimerRef.current);
        }
        
        // Nach 5 Minuten im Hintergrund den Status zurücksetzen
        backgroundTimerRef.current = setTimeout(() => {
          // Wenn die App für längere Zeit im Hintergrund war, den Status zurücksetzen
          saveObject(AUTH_STORAGE_KEYS.RESET_ON_APP_START, true);
          logger.debug('⏱️ Hintergrund-Timeout: RESET_ON_APP_START gesetzt');
        }, 5 * 60 * 1000); // 5 Minuten
        
        logger.debug('✅ App-Exit-Bereinigung abgeschlossen');
      } 
      // Wenn die App wieder in den Vordergrund kommt
      else if (nextAppState === 'active' && previousAppState !== 'active') {
        logger.debug('🔄 App ist wieder aktiv');
        
        // Timer löschen, wenn die App wieder aktiv wird
        if (backgroundTimerRef.current) {
          clearTimeout(backgroundTimerRef.current);
          backgroundTimerRef.current = null;
        }
        
        // Überprüfen, ob RESET_ON_APP_START gesetzt ist
        if (user && authStatus === 'authenticated') {
          // Wir sollten den SessionService explizit aufrufen, um die Sitzung zu validieren
          const isValid = await sessionService.hasValidLiveSession();
          
          if (!isValid) {
            // Wenn die Sitzung nicht mehr gültig ist, abmelden
            logger.debug('🔑 Ungültige Sitzung erkannt, Benutzer wird abgemeldet');
            logout();
          }
        }
      }
    };

    // Event-Listener für App-Zustandsänderungen registrieren
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Bereinigung beim Unmount
    return () => {
      // Event-Listener entfernen
      subscription.remove();
      
      // Timer löschen, wenn vorhanden
      if (backgroundTimerRef.current) {
        clearTimeout(backgroundTimerRef.current);
        backgroundTimerRef.current = null;
      }
    };
  }, [user, authStatus, logout]); // Abhängigkeiten hinzufügen

  // Diese Komponente rendert nichts und ist nur für die Logik zuständig
  return null;
}

export default AppStateHandler; 