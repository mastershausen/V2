/**
 * StorageService - Vereinfachte, einheitliche Schnittstelle für AsyncStorage
 * 
 * Dieser Service bietet eine vereinfachte Schnittstelle für AsyncStorage-Operationen
 * und unterstützt die Migration von alten zu neuen Schlüsseln.
 * Implementiert das IService-Interface für die ServiceRegistry.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {AuthData} from '@/types/userTypes';
import { logger } from '@/utils/logger';
import { IService } from '@/utils/service/serviceRegistry';
import { APP_STORAGE_KEYS, LEGACY_STORAGE_KEYS, MIGRATION_KEY_MAP } from '@/utils/storageKeys';

/**
 * StorageService - Vereinfachter Zugriff auf AsyncStorage mit Migration
 * Implementiert das IService-Interface für die ServiceRegistry.
 */
class StorageService implements IService {
  /**
   * Initialisierung des Storage-Service
   */
  async init(): Promise<void> {
    logger.debug('[StorageService] Initialisiert');
    await this.migrateAllData();
  }

  /**
   * Ressourcen freigeben
   */
  async dispose(): Promise<void> {
    logger.debug('[StorageService] Ressourcen freigegeben');
  }

  /**
   * Speichert einen Wert im AsyncStorage
   * @param {string} key - Storage-Schlüssel
   * @param {any} value - Zu speichernder Wert
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   * @template T - Typ des zu speichernden Werts
   */
  async saveData<T>(key: string, value: T): Promise<boolean> {
    try {
      if (!key) {
        logger.error('[StorageService] Kein Schlüssel angegeben für saveData');
        return false;
      }
      
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      // Verwende einheitliche Fehlerprotokollierung
      logger.error(`[StorageService] Fehler beim Speichern (${key}):`, String(error));
      return false;
    }
  }

  /**
   * Lädt einen Wert aus dem AsyncStorage
   * @param {string} key - Storage-Schlüssel
   * @returns {Promise<T | null>} - Der geladene Wert oder null bei Fehler
   * @template T - Typ des zu ladenden Werts
   */
  async loadData<T>(key: string): Promise<T | null> {
    try {
      if (!key) {
        logger.error('[StorageService] Kein Schlüssel angegeben für loadData');
        return null;
      }
      
      const jsonValue = await AsyncStorage.getItem(key);
      
      if (jsonValue === null) {
        return null;
      }
      
      try {
        return JSON.parse(jsonValue);
      } catch (parseError) {
        logger.error(`[StorageService] JSON-Parsing-Fehler für Schlüssel ${key}:`, String(parseError));
        return null;
      }
    } catch (error) {
      logger.error(`[StorageService] Fehler beim Laden (${key}):`, String(error));
      
      // Bei einem AsyncStorage-Fehler versuchen wir, eine saubere Fehlerbehandlung zu gewährleisten
      try {
        return null;
      } catch (secondaryError) {
        logger.error('[StorageService] Sekundärer Fehler:', String(secondaryError));
        return null;
      }
    }
  }

  /**
   * Speichert Authentifizierungsdaten (unabhängig vom Modus)
   * @param {AuthData} authData - Authentifizierungsdaten
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   */
  async saveAuthData(authData: AuthData): Promise<boolean> {
    try {
      return await this.saveData(APP_STORAGE_KEYS.AUTH_DATA, authData);
    } catch (error) {
      logger.error('[StorageService] Fehler beim Speichern der Auth-Daten:', String(error));
      return false;
    }
  }

  /**
   * Lädt Authentifizierungsdaten
   * @returns {Promise<AuthData | null>} - Die Authentifizierungsdaten oder null
   */
  async loadAuthData(): Promise<AuthData | null> {
    try {
      // Zuerst versuchen, die Daten vom neuen Schlüssel zu laden
      const newData = await this.loadData<AuthData>(APP_STORAGE_KEYS.AUTH_DATA);
      
      if (newData) {
        return newData;
      }

      // Wenn keine neuen Daten gefunden wurden, versuchen, alte Daten zu laden und zu migrieren
      const legacyData = await this.loadData<AuthData>(LEGACY_STORAGE_KEYS.LIVE_MODE_AUTH_DATA);
      
      if (legacyData) {
        // Legacy-Daten gefunden, migrieren
        await this.saveAuthData(legacyData);
        logger.info('[StorageService] Legacy-Authentifizierungsdaten migriert');
        
        return legacyData;
      }
      
      return null;
    } catch (error) {
      logger.error('[StorageService] Fehler beim Laden der Auth-Daten:', String(error));
      return null;
    }
  }

  /**
   * Speichert Benutzereinstellungen
   * @param {Record<string, unknown>} settings - Benutzereinstellungen
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   */
  async saveUserSettings(settings: Record<string, unknown>): Promise<boolean> {
    try {
      return await this.saveData(APP_STORAGE_KEYS.USER_SETTINGS, settings);
    } catch (error) {
      logger.error('[StorageService] Fehler beim Speichern der Benutzereinstellungen:', String(error));
      return false;
    }
  }

  /**
   * Lädt Benutzereinstellungen
   * @returns {Promise<Record<string, unknown> | null>} - Die Benutzereinstellungen oder null
   */
  async loadUserSettings(): Promise<Record<string, unknown> | null> {
    try {
      return await this.loadData(APP_STORAGE_KEYS.USER_SETTINGS);
    } catch (error) {
      logger.error('[StorageService] Fehler beim Laden der Benutzereinstellungen:', String(error));
      return null;
    }
  }

  /**
   * Speichert den letzten Navigationspfad
   * @param {string} path - Der zu speichernde Pfad
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   */
  async saveNavigationPath(path: string): Promise<boolean> {
    try {
      // Speichere im neuen Format
      const success = await this.saveData(APP_STORAGE_KEYS.NAVIGATION, path);
      
      // Für Kompatibilität auch im alten Format speichern
      try {
        await AsyncStorage.setItem(LEGACY_STORAGE_KEYS.LAST_SCREEN_PATH, path);
      } catch (error) {
        logger.error('[StorageService] Fehler beim Speichern des Legacy-Pfads:', String(error));
      }
      
      return success;
    } catch (error) {
      logger.error('[StorageService] Fehler beim Speichern des Navigationspfads:', String(error));
      return false;
    }
  }

  /**
   * Lädt den letzten Navigationspfad
   * @returns {Promise<string | null>} - Der gespeicherte Pfad oder null
   */
  async loadNavigationPath(): Promise<string | null> {
    try {
      // Zuerst versuchen, die Daten vom neuen Schlüssel zu laden
      const newPath = await this.loadData<string>(APP_STORAGE_KEYS.NAVIGATION);
      
      if (newPath) {
        return newPath;
      }

      // Wenn kein neuer Pfad gefunden wurde, versuchen, alten Pfad zu laden
      try {
        const legacyPath = await AsyncStorage.getItem(LEGACY_STORAGE_KEYS.LAST_SCREEN_PATH);
        
        if (legacyPath) {
          // Legacy-Pfad gefunden, migrieren
          await this.saveNavigationPath(legacyPath);
          logger.info('[StorageService] Legacy-Navigationspfad migriert');
          
          return legacyPath;
        }
      } catch (error) {
        logger.error('[StorageService] Fehler beim Laden des Legacy-Pfads:', String(error));
      }
      
      return null;
    } catch (error) {
      logger.error('[StorageService] Fehler beim Laden des Navigationspfads:', String(error));
      return null;
    }
  }

  /**
   * Entfernt ein Element aus dem AsyncStorage
   * @param {string} key - Der zu entfernende Schlüssel
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      if (!key) {
        logger.error('[StorageService] Kein Schlüssel angegeben für removeItem');
        return false;
      }
      
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error(`[StorageService] Fehler beim Entfernen (${key}):`, String(error));
      return false;
    }
  }

  /**
   * Löscht Authentifizierungsdaten (Logout)
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   */
  async clearAuthData(): Promise<boolean> {
    try {
      // Neue Authentifizierungsdaten löschen
      await AsyncStorage.removeItem(APP_STORAGE_KEYS.AUTH_DATA);
      
      // Für Kompatibilität auch alte Daten löschen
      await AsyncStorage.removeItem(LEGACY_STORAGE_KEYS.LIVE_MODE_AUTH_DATA);
      
      return true;
    } catch (error) {
      logger.error('[StorageService] Fehler beim Löschen der Authentifizierungsdaten:', String(error));
      return false;
    }
  }

  /**
   * Löscht alle Daten im AsyncStorage
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   */
  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      logger.info('[StorageService] Alle Daten gelöscht');
      return true;
    } catch (error) {
      logger.error('[StorageService] Fehler beim Löschen aller Daten:', String(error));
      return false;
    }
  }

  /**
   * Bereinigt veraltete oder temporäre Daten
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   */
  async cleanupStorage(): Promise<boolean> {
    try {
      // Entferne alle temporären Daten
      const keys = await AsyncStorage.getAllKeys();
      const tempKeys = keys.filter(key => key.includes('temp_') || key.includes('_tmp') || key.includes('_cache'));
      
      if (tempKeys.length > 0) {
        await AsyncStorage.multiRemove(tempKeys);
        logger.info(`[StorageService] ${tempKeys.length} temporäre Schlüssel gelöscht`);
      }
      
      return true;
    } catch (error) {
      logger.error('[StorageService] Fehler bei der Speicherbereinigung:', String(error));
      return false;
    }
  }

  /**
   * Migriert alle Daten von alten zu neuen Schlüsseln
   * @returns {Promise<boolean>} - Ob die Operation erfolgreich war
   */
  async migrateAllData(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let migrationCount = 0;
      
      for (const oldKey of Object.keys(MIGRATION_KEY_MAP)) {
        if (keys.includes(oldKey)) {
          const newKey = MIGRATION_KEY_MAP[oldKey as keyof typeof MIGRATION_KEY_MAP];
          
          try {
            const data = await AsyncStorage.getItem(oldKey);
            
            if (data !== null) {
              await AsyncStorage.setItem(newKey, data);
              // Alte Daten nicht sofort löschen, um Datenverluste zu vermeiden
              // await AsyncStorage.removeItem(oldKey);
              migrationCount++;
            }
          } catch (error) {
            logger.error(`[StorageService] Fehler bei der Migration von ${oldKey}:`, String(error));
            // Fehler bei einzelnen Schlüsseln nicht den gesamten Prozess stoppen lassen
            continue;
          }
        }
      }
      
      if (migrationCount > 0) {
        logger.info(`[StorageService] ${migrationCount} Schlüssel erfolgreich migriert`);
      }
      
      return true;
    } catch (error) {
      logger.error('[StorageService] Fehler bei der Datenmigration:', String(error));
      return false;
    }
  }
}

export default StorageService; 