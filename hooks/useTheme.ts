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
const darkColors = {
  // Primärfarben
  primary: '#6F8FFF',
  secondary: '#9C27B0',
  
  // Hintergrundfarben
  background: '#121212',
  card: '#1E1E1E',
  
  // Textfarben
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#757575',
  
  // Funktionale Farben
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Interface-Elemente
  divider: '#383838',
  disabled: '#5E5E5E',
  border: '#383838',
};

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
export type ThemeColors = typeof lightColors;
export type ThemeSpacing = typeof spacing;
export type ThemeTypography = typeof typography;
export type Theme = ReturnType<typeof useTheme>; 