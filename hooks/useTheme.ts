/**
 * useTheme Hook
 * 
 * Bietet Zugriff auf das aktuelle Theme und seine Komponenten (Farben, Abstände, etc.).
 * Handhabt das Umschalten zwischen Hell- und Dunkel-Modus.
 */
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { themeColors } from '../config/theme/colors';
import { spacing } from '../config/theme/spacing';
import { typography } from '../config/theme/typography';

// Die Farben für den Hell-Modus
const lightColors = themeColors.light;

// Dunkel-Modus Farben
const darkColors = themeColors.dark;

/**
 * Exportierter Hook, der das Theme zurückgibt
 */
export function useTheme() {
  const colorScheme = useColorScheme();
  
  // Auswahl der Farben basierend auf dem aktuellen Theme
  const colors = useMemo(() => {
    return colorScheme === 'dark' ? darkColors : lightColors;
  }, [colorScheme]);
  
  // Das komplette Theme-Objekt
  const theme = useMemo(() => ({
    colors,
    spacing,
    typography,
    isDark: colorScheme === 'dark'
  }), [colors, colorScheme]);
  
  return theme;
}

// Exportiere Typen für das Theme
export type ThemeColors = typeof themeColors.light;
export type ThemeSpacing = typeof spacing;
export type ThemeTypography = typeof typography;
export type Theme = ReturnType<typeof useTheme>; 