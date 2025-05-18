/**
 * Theme Hooks für die Solvbox App
 * 
 * Zentrale Hooks für den Zugriff auf Theme-Farben und -Einstellungen
 */

import { themeColors } from '@/config/theme';

import { useColorScheme } from './useColorScheme';

/**
 * Hook zum Abrufen der Theme-Farben basierend auf dem aktuellen Farbschema
 * @returns {object} Das vollständige Theme-Farbobjekt für das aktuelle Farbschema
 */
export function useThemeColor() {
  const { colorSchemeValue } = useColorScheme();
  return themeColors[colorSchemeValue];
}

/**
 * Hook für das Abrufen bestimmter Farben für ein bestimmtes Element
 * @param {string} lightColor - Farbe für den Light-Modus (optional)
 * @param {string} darkColor - Farbe für den Dark-Modus (optional)
 * @returns {string} Die passende Farbe basierend auf dem aktuellen Farbschema
 */
export function useElementColor(
  lightColor?: string,
  darkColor?: string
) {
  const { colorSchemeValue } = useColorScheme();
  const theme = themeColors[colorSchemeValue];
  
  if (colorSchemeValue === 'dark') {
    return darkColor || lightColor || theme.backgroundPrimary;
  } else {
    return lightColor || darkColor || theme.backgroundPrimary;
  }
}

/**
 * Hook für Text-Farben, verwendet primäre/sekundäre Textfarben als Fallback
 * @param {string} lightColor - Farbe für den Light-Modus (optional)
 * @param {string} darkColor - Farbe für den Dark-Modus (optional)
 * @param {boolean} secondary - Ob die sekundäre Textfarbe verwendet werden soll (optional)
 * @returns {string} Die passende Textfarbe basierend auf dem aktuellen Farbschema
 */
export function useTextColor(
  lightColor?: string,
  darkColor?: string,
  secondary?: boolean
) {
  const { colorSchemeValue } = useColorScheme();
  const theme = themeColors[colorSchemeValue];
  
  if (colorSchemeValue === 'dark') {
    return darkColor || lightColor || (secondary ? theme.textSecondary : theme.textPrimary);
  } else {
    return lightColor || darkColor || (secondary ? theme.textSecondary : theme.textPrimary);
  }
} 