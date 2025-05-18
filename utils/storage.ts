/**
 * Einfache Storage-Hilfsfunktionen ohne Modus-Spezifik
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Konstanten für einheitliche Storage-Schlüssel
export const STORAGE_KEYS = {
  USER_SESSION: 'user_session',
  APP_SETTINGS: 'app_settings',
  SEARCH_HISTORY: 'search_history',
};

/**
 * Löscht alle Daten im AsyncStorage
 * @returns Promise<boolean> True bei Erfolg, False bei Fehler
 */
export async function resetAllStorage(): Promise<boolean> {
  try {
    console.log('==============================================');
    console.log('=== STORAGE-RESET: LÖSCHE ALLE DATEN ========');
    console.log('==============================================');
    
    await AsyncStorage.clear();
    
    console.log('=== ALLE DATEN ERFOLGREICH GELÖSCHT =========');
    console.log('==============================================');
    return true;
  } catch (error) {
    console.error('Fehler beim Zurücksetzen des Speichers:', error);
    return false;
  }
}

/**
 * Speichert ein Objekt im AsyncStorage
 * @param key Speicherschlüssel
 * @param value Zu speichernder Wert
 * @returns Promise<boolean> True bei Erfolg, False bei Fehler
 */
export async function saveObject<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Fehler beim Speichern von ${key}:`, error);
    return false;
  }
}

/**
 * Lädt ein Objekt aus dem AsyncStorage
 * @param key Speicherschlüssel
 * @returns Promise<T | null> Das geladene Objekt oder null bei Fehler
 */
export async function loadObject<T>(key: string): Promise<T | null> {
  try {
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Fehler beim Laden von ${key}:`, error);
    return null;
  }
}

/**
 * Entfernt einen Eintrag aus dem AsyncStorage
 * @param key Speicherschlüssel
 * @returns Promise<boolean> True bei Erfolg, False bei Fehler
 */
export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Fehler beim Entfernen von ${key}:`, error);
    return false;
  }
}

/**
 * Gibt eine Liste aller Schlüssel im AsyncStorage zurück
 * @returns Promise<string[]> Liste aller Schlüssel oder leere Liste bei Fehler
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  } catch (error) {
    console.error('Fehler beim Abrufen aller Schlüssel:', error);
    return [];
  }
} 