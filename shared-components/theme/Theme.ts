/**
 * Theme Komponenten und Typen
 * 
 * Zentrale Definitions- und Export-Datei für Theme-bezogene Funktionalitäten
 */
import { themeColors } from '@/config/theme';
import { ColorSchemeValue } from '@/hooks/ui/useColorScheme';

// Theme-Objekt-Typ
export type ThemeColors = typeof themeColors.light;

/**
 * Konstanten für Theme-Eigenschaften
 */
export const themeConstants = {
  roundness: {
    small: 4,
    medium: 8,
    large: 16,
    xl: 24,
    round: 9999,
  },
  
  elevation: {
    none: 0,
    small: 2,
    medium: 4,
    large: 8,
    xl: 16,
  }
};

/**
 * Hilfsfunktion zum Abrufen der Farben für ein bestimmtes Farbschema
 * @param colorScheme
 */
export function getThemeColors(colorScheme: ColorSchemeValue): ThemeColors {
  return themeColors[colorScheme] || themeColors.light;
}

/**
 * Typ für Props, die Theme-Overrides unterstützen
 */
export interface ThemedProps {
  lightColor?: string;
  darkColor?: string;
} 