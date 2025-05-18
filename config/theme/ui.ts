/**
 * UI-Konstanten für die Solvbox App
 * 
 * Definiert UI-Elemente wie Border-Radien, Shadows, etc.
 */

// Importiere die spezifischen Schatten aus der shadows.ts
import { shadows } from './shadows';

export const ui = {
  // Border-Radien
  borderRadius: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    xxl: 30,
    pill: 9999,
  },
  
  // Schatten aus shadows.ts verwenden
  shadow: shadows,
  
  // Border-Stärken
  border: {
    thin: 0.5,
    normal: 1,
    thick: 2,
  },
  
  // Opacity
  opacity: {
    disabled: 0.7,
    inactive: 0.5,
    active: 1,
  },
  
  // Media Player Konstanten
  mediaPlayer: {
    playButtonSize: 60,
    sliderHeight: 20,
    controlsPadding: 8,
    speedButtonMinWidth: 30,
    timeTextMinWidth: 28,
  },
  
  // Icon-Größen
  icon: {
    tiny: 12,
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
    xxlarge: 40,
  },
  
  // Andere UI-Konstanten
  avatar: {
    xs: 24,
    s: 32,
    m: 48,
    l: 64,
    xl: 80,
  },
}; 