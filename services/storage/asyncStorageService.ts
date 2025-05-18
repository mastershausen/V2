/**
 * AsyncStorage Service
 * 
 * Bietet eine einheitliche Schnittstelle für die Interaktion mit AsyncStorage
 * und implementiert häufig benötigte Operationen.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { isDemoMode } from '@/config/app/env';

// Schlüssel für gespeicherte Daten
export const STORAGE_KEYS = {
  AUTH_USER: '@auth_user',
  AUTH_SESSION: '@auth_session',
  USER_PREFERENCES: '@user_preferences',
  THEME: '@theme',
  LANGUAGE: '@language',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  RECENT_SEARCHES: '@recent_searches',
};

/**
 * Gibt einen modus-spezifischen Schlüssel zurück.
 * Im Demo-Modus wird ein -demo Suffix angehängt, im Real-Modus bleibt der Schlüssel unverändert.
 * @param baseKey Der Basis-Schlüssel
 * @param forceModeSuffix Erzwingt die Verwendung eines Modus-Suffixes, auch wenn kein Demo-Modus aktiv ist
 * @returns Der modus-spezifische Schlüssel
 */
export function getModeSpecificKey(baseKey: string, forceModeSuffix: boolean = false): string {
  if (isDemoMode() || forceModeSuffix) {
    return `${baseKey}-demo`;
  }
  return baseKey;
}

/**
 * AsyncStorageService bietet Hilfsmethoden zum einfachen Speichern und Abrufen von Daten
 */
export class AsyncStorageService {
  /**
   * Wert als String speichern
   * @param key
   * @param value
   * @param useModeSpecificKey Wenn true, wird ein modus-spezifischer Schlüssel verwendet
   */
  static async storeString(key: string, value: string, useModeSpecificKey: boolean = true): Promise<boolean> {
    try {
      const storageKey = useModeSpecificKey ? getModeSpecificKey(key) : key;
      await AsyncStorage.setItem(storageKey, value);
      return true;
    } catch (error) {
      console.error(`Fehler beim Speichern von String (${key}):`, error);
      return false;
    }
  }

  /**
   * String-Wert abrufen
   * @param key
   * @param useModeSpecificKey Wenn true, wird ein modus-spezifischer Schlüssel verwendet
   */
  static async getString(key: string, useModeSpecificKey: boolean = true): Promise<string | null> {
    try {
      const storageKey = useModeSpecificKey ? getModeSpecificKey(key) : key;
      return await AsyncStorage.getItem(storageKey);
    } catch (error) {
      console.error(`Fehler beim Abrufen von String (${key}):`, error);
      return null;
    }
  }

  /**
   * Objekt speichern (wird automatisch zu JSON serialisiert)
   * @param key
   * @param value
   * @param useModeSpecificKey Wenn true, wird ein modus-spezifischer Schlüssel verwendet
   */
  static async storeObject<T>(key: string, value: T, useModeSpecificKey: boolean = true): Promise<boolean> {
    try {
      const storageKey = useModeSpecificKey ? getModeSpecificKey(key) : key;
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(storageKey, jsonValue);
      return true;
    } catch (error) {
      console.error(`Fehler beim Speichern von Objekt (${key}):`, error);
      return false;
    }
  }

  /**
   * Objekt abrufen und deserialisieren
   * @param key
   * @param useModeSpecificKey Wenn true, wird ein modus-spezifischer Schlüssel verwendet
   */
  static async getObject<T>(key: string, useModeSpecificKey: boolean = true): Promise<T | null> {
    try {
      const storageKey = useModeSpecificKey ? getModeSpecificKey(key) : key;
      const jsonValue = await AsyncStorage.getItem(storageKey);
      return jsonValue != null ? JSON.parse(jsonValue) as T : null;
    } catch (error) {
      console.error(`Fehler beim Abrufen von Objekt (${key}):`, error);
      return null;
    }
  }

  /**
   * Wert entfernen
   * @param key
   * @param useModeSpecificKey Wenn true, wird ein modus-spezifischer Schlüssel verwendet
   */
  static async removeItem(key: string, useModeSpecificKey: boolean = true): Promise<boolean> {
    try {
      const storageKey = useModeSpecificKey ? getModeSpecificKey(key) : key;
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error(`Fehler beim Entfernen von Item (${key}):`, error);
      return false;
    }
  }

  /**
   * Mehrere Werte entfernen
   * @param keys
   * @param useModeSpecificKey Wenn true, werden modus-spezifische Schlüssel verwendet
   */
  static async removeItems(keys: string[], useModeSpecificKey: boolean = true): Promise<boolean> {
    try {
      const storageKeys = useModeSpecificKey 
        ? keys.map(key => getModeSpecificKey(key))
        : keys;
      
      await AsyncStorage.multiRemove(storageKeys);
      return true;
    } catch (error) {
      console.error(`Fehler beim Entfernen mehrerer Items:`, error);
      return false;
    }
  }

  /**
   * Alle gespeicherten Werte abrufen
   */
  static async getAllKeys(): Promise<readonly string[] | null> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error(`Fehler beim Abrufen aller Schlüssel:`, error);
      return null;
    }
  }

  /**
   * Speicher vollständig löschen
   * @param modeSpecificOnly Wenn true, werden nur die Daten des aktuellen Modus gelöscht
   */
  static async clearAll(modeSpecificOnly: boolean = false): Promise<boolean> {
    try {
      if (modeSpecificOnly) {
        // Nur die Daten des aktuellen Modus löschen
        const allKeys = await AsyncStorage.getAllKeys();
        const suffix = isDemoMode() ? '-demo' : '';
        const keysToRemove = allKeys.filter(key => key.endsWith(suffix));
        await AsyncStorage.multiRemove(keysToRemove);
      } else {
        // Alles löschen
        await AsyncStorage.clear();
      }
      return true;
    } catch (error) {
      console.error(`Fehler beim Löschen aller Daten:`, error);
      return false;
    }
  }

  /**
   * Löscht alle gespeicherten Daten im Development-Modus
   * Diese Methode sollte im App-Startprozess verwendet werden, um sicherzustellen,
   * dass die Development-App immer mit einem sauberen Zustand startet
   * @returns True bei Erfolg, False bei Fehler
   */
  static async clearDevStorage(): Promise<boolean> {
    // Nur im Development-Modus ausführen
    if (__DEV__) {
      try {
        console.log('Development-Storage wird gelöscht - sauberer App-Start');
        await AsyncStorage.clear();
        return true;
      } catch (error) {
        console.error('Fehler beim Löschen des Development-Storage:', error);
        return false;
      }
    }
    
    // Im Produktionsmodus keine Aktion durchführen
    return true;
  }
} 