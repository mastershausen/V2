/**
 * useColorScheme Hook
 *
 * Erweiterter Hook für das Farbschema der Anwendung.
 * Unterstützt automatisches Farbschema des Geräts oder manuelles Override.
 * @returns Farbschema-Informationen und -Funktionen
 */

import { useState, useEffect } from 'react';
import { useColorScheme as _useColorScheme, StyleSheet } from 'react-native';

import { AsyncStorageService, STORAGE_KEYS } from '@/services/storage/asyncStorageService';

export type ColorScheme = 'light' | 'dark' | 'system';
export type ColorSchemeValue = 'light' | 'dark';

/**
 * Hook zum Abrufen und Setzen des aktuellen Farbschemas
 */
export function useColorScheme(): {
  colorScheme: ColorScheme;
  colorSchemeValue: ColorSchemeValue;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
  isDark: boolean;
  isLight: boolean;
} {
  // Das tatsächliche Farbschema des Geräts (wird nur verwendet, wenn colorScheme === 'system')
  const systemColorScheme = _useColorScheme() as ColorSchemeValue || 'light';
  
  // Das vom Benutzer eingestellte Schema ('light', 'dark' oder 'system')
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('system');
  
  // Lade das gespeicherte Farbschema beim Initialisieren
  useEffect(() => {
    const loadColorScheme = async () => {
      const savedScheme = await AsyncStorageService.getString(STORAGE_KEYS.THEME);
      if (savedScheme && (savedScheme === 'light' || savedScheme === 'dark' || savedScheme === 'system')) {
        setColorSchemeState(savedScheme as ColorScheme);
      }
    };
    
    loadColorScheme();
  }, []);
  
  // Setzt das Farbschema und speichert es
  const setColorScheme = async (scheme: ColorScheme): Promise<void> => {
    setColorSchemeState(scheme);
    await AsyncStorageService.storeString(STORAGE_KEYS.THEME, scheme);
  };
  
  // Das tatsächlich verwendete Farbschema (berücksichtigt die Systemeinstellung)
  const colorSchemeValue: ColorSchemeValue = 
    colorScheme === 'system' ? systemColorScheme : colorScheme;
  
  return {
    colorScheme,            // Das eingestellte Schema ('light', 'dark', 'system')
    colorSchemeValue,       // Das tatsächlich verwendete Schema ('light' oder 'dark')
    setColorScheme,         // Funktion zum Ändern des Schemas
    isDark: colorSchemeValue === 'dark',
    isLight: colorSchemeValue === 'light',
  };
} 