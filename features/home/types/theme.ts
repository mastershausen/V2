/**
 * Typdefinitionen für Theme und Styling im Home-Feature
 * 
 * Stellt spezifische Typen bereit, die für das Styling der
 * HomeScreen-Komponenten verwendet werden.
 */

import { themeColors } from '@/config/theme';
import { ThemeColors } from '.';

/**
 * HomeScreenColors verwendet den zentralen ThemeColors-Typ,
 * um eine konsistente Verwendung des Theming-Systems zu gewährleisten
 */
export type HomeScreenColors = ThemeColors;

/**
 * Utility-Funktion zum Validieren der Farben für HomeScreen
 * Stellt sicher, dass alle notwendigen Farben vorhanden sind
 */
export function validateHomeColors(colors: unknown): colors is HomeScreenColors {
  if (!colors || typeof colors !== 'object') return false;
  
  // Wesentliche Farbfelder für minimale Funktionalität
  const requiredRootKeys = [
    'backgroundPrimary',
    'textPrimary',
    'textSecondary',
    'primary'
  ];
  
  const colorsObj = colors as Partial<HomeScreenColors>;
  
  // Prüfe, ob die wesentlichen Felder vorhanden sind
  const hasRequiredColors = requiredRootKeys.every(key => 
    typeof colorsObj[key as keyof HomeScreenColors] === 'string'
  );
  
  // Prüfe, ob UI und Overlay Objekte vorhanden sind
  const hasUIObject = 
    !!colorsObj.ui && 
    typeof colorsObj.ui === 'object' &&
    'buttonBackground' in colorsObj.ui;
    
  const hasOverlayObject = 
    !!colorsObj.overlay && 
    typeof colorsObj.overlay === 'object';
    
  return hasRequiredColors && hasUIObject && hasOverlayObject;
}

/**
 * Gibt ein typensicheres HomeScreenColors-Objekt zurück,
 * entweder aus dem übergebenen Objekt oder als Fallback
 */
export function getHomeColors(colors: unknown): HomeScreenColors {
  // Wenn die Übergebenen Farben validiert werden können, nutze sie direkt
  if (validateHomeColors(colors)) {
    return colors as HomeScreenColors;
  }
  
  // Prüfe, ob es sich um ein partielles ThemeColors-Objekt handelt
  const colorsObj = colors as Partial<HomeScreenColors>;
  if (colorsObj && 
      typeof colorsObj === 'object' && 
      'backgroundPrimary' in colorsObj &&
      'textPrimary' in colorsObj &&
      colorsObj.ui && 
      colorsObj.overlay) {
    
    // Falls ja, ergänze fehlende Properties mit Light Theme Werten
    return {
      ...themeColors.light,
      ...colorsObj
    } as HomeScreenColors;
  }
  
  // Fallback zu Light Theme
  return themeColors.light;
} 