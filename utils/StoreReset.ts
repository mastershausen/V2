/**
 * StoreReset - Hilfsfunktionen zum Zurücksetzen von Stores
 * 
 * Diese Klasse bietet Funktionen, um zu prüfen, ob Stores zurückgesetzt werden müssen,
 * und führt die Bereinigung durch.
 */

import { setAppMode } from '@/config/app';
import { sessionService } from '@/features/auth/services';
import { useModeStore } from '@/features/mode/stores';
import { StorageService } from '@/services/StorageService';
import { useNuggetStore } from '@/stores/nuggetStore';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { logger } from '@/utils/simpleLogger';
import { APP_STORAGE_KEYS } from '@/utils/storageKeys';

/**
 * StoreReset - Hilfsfunktionen zum Zurücksetzen von App-Zuständen
 */
export class StoreReset {
  /**
   * Prüft, ob ein Store-Reset beim App-Start durchgeführt werden soll
   * und führt diesen bei Bedarf durch.
   */
  static async checkAndResetStores(): Promise<boolean> {
    try {
      // Prüfe, ob ein Reset angefordert wurde
      const shouldReset = await StorageService.loadData<boolean>(APP_STORAGE_KEYS.RESET_ON_APP_START);
      
      if (shouldReset) {
        logger.warn('Store-Reset wurde angefordert - führe Reset durch');
        
        // Reset durchführen
        await this.resetAllStores();
        
        // Reset-Flag zurücksetzen
        await StorageService.saveData(APP_STORAGE_KEYS.RESET_ON_APP_START, false);
        
        logger.info('Store-Reset erfolgreich durchgeführt');
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Fehler beim Prüfen/Durchführen des Store-Resets:', String(error));
      return false;
    }
  }
  
  /**
   * Setzt alle Stores auf ihre Ausgangswerte zurück und bereinigt den AsyncStorage
   */
  static async resetAllStores(): Promise<void> {
    try {
      console.log('[DEBUG][StoreReset] resetAllStores aufgerufen');
      // 1. AsyncStorage bereinigen
      await StorageService.cleanupStorage();
      
      // 2. Session-Daten zurücksetzen
      await sessionService.logout();
      
      // 3. Zurücksetzen aller Stores
      const userStore = useUserStore.getState();
      userStore.logout(); // Setzt den User-Store zurück
      
      // UI-Store zurücksetzen
      const uiStore = useUIStore.getState();
      uiStore.setColorScheme('light'); // Setze Theme zurück
      
      const nuggetStore = useNuggetStore.getState();
      nuggetStore.initializeStore(); // Initialisiere Nugget-Store neu
      
      // 4. App-Modus zurücksetzen (auf Live)
      const modeStore = useModeStore.getState();
      modeStore.setAppMode('live');
      console.warn('[DEBUG] StoreReset setzt AppMode: live');
      setAppMode('live');
      console.warn('[DEBUG] StoreReset setzt AppMode (config/app): live');
      
      logger.info('Alle Stores wurden zurückgesetzt');
    } catch (error) {
      logger.error('Fehler beim Zurücksetzen der Stores:', String(error));
      throw error;
    }
  }
  
  /**
   * Setzt nur die Auth-bezogenen Daten zurück (für Logout)
   */
  static async resetAuthData(): Promise<void> {
    try {
      // 1. Auth-Daten über den SessionService zurücksetzen
      await sessionService.logout();
      
      // 2. User-Store zurücksetzen
      const userStore = useUserStore.getState();
      userStore.logout(); // Logout-Methode setzt den Store zurück
      
      logger.info('Auth-Daten wurden zurückgesetzt');
    } catch (error) {
      logger.error('Fehler beim Zurücksetzen der Auth-Daten:', String(error));
      throw error;
    }
  }
} 