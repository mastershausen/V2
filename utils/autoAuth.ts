/**
 * @file utils/autoAuth.ts
 * @description Hilfsfunktion, um den Auth-Store mit einem simulierten Benutzer zu initialisieren.
 * Wird für Testzwecke verwendet, um den Auth-Flow zu überspringen.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';
import { DEMO_USERS } from '@/features/auth/config/demo-users';
import { User, USER_TYPES } from '@/types/auth/userTypes';
import { storeEvents, StoreEventType } from '@/utils/store/storeEvents';

/**
 * Setzt den Benutzer als authentifiziert und speichert die Sitzung.
 * Diese Funktion sollte beim App-Start aufgerufen werden, um den Auth-Flow zu überspringen.
 */
export async function setupAutoAuth(): Promise<void> {
  try {
    logger.info('[AutoAuth] Initialisiere automatische Authentifizierung...');
    
    // Verwende den ersten Demo-Benutzer als simulierten Benutzer
    const demoUser = DEMO_USERS[0];
    
    if (!demoUser) {
      logger.error('[AutoAuth] Kein Demo-Benutzer gefunden!');
      return;
    }
    
    // Password vom Benutzer entfernen und Daten an User-Typ anpassen
    const { password: _, userType, ...rest } = demoUser;
    
    // User-Objekt erstellen, das dem erwarteten Typ entspricht
    const user: User = {
      ...rest,
      type: USER_TYPES.DEMO_USER
    };
    
    // Auth-Store mit dem simulierten Benutzer aktualisieren
    const authStore = useAuthStore.getState();
    authStore.login(user);
    
    // Über den Store-Event-Mechanismus auch andere Teile der App informieren
    storeEvents.emit(StoreEventType.USER_LOGGED_IN, { user });
    
    // Auth-Status in AsyncStorage speichern für persistente "Anmeldung"
    await AsyncStorage.setItem('auth_registered', 'true');
    await AsyncStorage.setItem('mode-storage', JSON.stringify({ 
      state: { 
        appMode: 'demo', 
        userStatus: { type: 'authenticated' }, 
        isDemoAccount: true 
      } 
    }));
    
    logger.info('[AutoAuth] Automatische Authentifizierung erfolgreich!');
  } catch (error) {
    logger.error('[AutoAuth] Fehler bei der automatischen Authentifizierung:', 
      error instanceof Error ? error.message : String(error)
    );
  }
} 