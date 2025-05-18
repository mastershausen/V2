/**
 * Theme-basierte StyleSheet-Factory
 * 
 * Diese Factory ermöglicht es, Styles auf Basis von Theme-Farben zu erstellen,
 * ohne dass die Styles bei jedem Rendern neu erstellt werden müssen.
 * 
 * Vorteile:
 * - Bessere Performance durch Vermeidung von unnötigen StyleSheet-Erstellungen
 * - Saubere Trennung von Styling-Logik und Komponenten-Logik
 * - Wiederverwendbarkeit der Theme-Logik in der gesamten App
 */

import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

import { themeColors } from '@/config/theme';

// Typdeklaration für die Styling-Funktion
export type StyleCreator<T> = (colors: typeof themeColors.light) => T;

// Typdeklaration für einen Style-Objekt
export type ThemedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

// Cache für die erstellten StyleSheet-Instanzen
const styleCache = new Map<string, any>();

/**
 * Erstellt ein Theme-basiertes StyleSheet, das bei Änderungen des Farbschemas automatisch aktualisiert wird
 * @param styleCreator Funktion, die Styles auf Basis der Theme-Farben erstellt
 * @param colorScheme Das aktuelle Farbschema ('light' oder 'dark')
 * @returns Ein StyleSheet basierend auf dem aktuellen Farbschema
 */
export function createThemedStyles<T extends ThemedStyles>(
  styleCreator: StyleCreator<T>,
  colorScheme: 'light' | 'dark' = 'light'
): T {
  // Eindeutigen Schlüssel für das StyleSheet erstellen
  const key = `${styleCreator.toString()}_${colorScheme}`;
  
  // Prüfen, ob das StyleSheet bereits im Cache existiert
  if (!styleCache.has(key)) {
    // Theme-Farben für das aktuelle Farbschema abrufen
    const colors = themeColors[colorScheme];
    
    // StyleSheet erstellen und im Cache speichern
    const styles = styleCreator(colors);
    const compiledStyles = StyleSheet.create(styles);
    styleCache.set(key, compiledStyles);
  }
  
  // StyleSheet aus dem Cache zurückgeben
  return styleCache.get(key);
}

/**
 * Hook für die Verwendung mit dem useThemeColor-Hook
 * @param styleCreator Funktion, die Styles auf Basis der Theme-Farben erstellt
 * @param colors Theme-Farben vom useThemeColor-Hook
 * @returns Ein StyleSheet mit den erstellten Styles
 */
export function useThemedStyles<T extends ThemedStyles>(
  styleCreator: StyleCreator<T>,
  colors: typeof themeColors.light
): T {
  // Eindeutigen Schlüssel für das StyleSheet erstellen
  const key = styleCreator.toString();
  
  // Prüfen, ob das StyleSheet bereits im Cache existiert
  if (!styleCache.has(key)) {
    // StyleSheet erstellen und im Cache speichern
    const styles = styleCreator(colors);
    const compiledStyles = StyleSheet.create(styles);
    styleCache.set(key, compiledStyles);
  }
  
  // StyleSheet aus dem Cache zurückgeben
  return styleCache.get(key);
} 