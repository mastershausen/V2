/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { themeColors } from '@/config/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

// Typaliase für Farben
export type CustomColorOptions = {
  light?: string;
  dark?: string;
};

/**
 * Hook zum Abrufen der Theme-Farben basierend auf dem aktuellen Farbschema
 * @returns Alle Theme-Farben für das aktuelle Farbschema
 */
export function useThemeColor(): typeof themeColors.light;

/**
 * Hook zum Abrufen einer spezifischen Farbe basierend auf dem aktuellen Farbschema
 * @param options - Optionale Farben für helles und dunkles Thema
 * @returns Die ausgewählte Farbe basierend auf dem aktuellen Farbschema
 */
export function useThemeColor(options: CustomColorOptions): string;

// Implementierung
/**
 *
 * @param options
 */
export function useThemeColor(options?: CustomColorOptions) {
  const colorScheme = useColorScheme() ?? 'light';
  
  if (options) {
    // Wenn benutzerdefinierte Farben übergeben werden, wähle die passende basierend auf dem Farbschema aus
    return options[colorScheme] || options.light || options.dark || themeColors[colorScheme].primary;
  }
  
  // Ansonsten gib alle Theme-Farben zurück
  return themeColors[colorScheme];
}
