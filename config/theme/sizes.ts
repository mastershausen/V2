/**
 * Größensystem für die Solvbox App
 * 
 * Definiert alle Größen für UI-Elemente, um Konsistenz sicherzustellen
 */

// Importiere Icon-Größen aus ui.ts um Redundanz zu vermeiden
import { ui } from './ui';

export const sizes = {
  // Allgemeine Größen (konsistentes xs-xxl Schema)
  min: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,

  // Spezifische Größen nach Komponenten
  
  // Tabbar-Größen
  tabBar: {
    default: 56,
    compact: 48
  },
  // Für Abwärtskompatibilität (Legacy)
  tabBarCompact: 48,
  
  // Elementgrößen
  elementSize: {
    // Mindestbreiten
    tabMinWidth: 80,
    buttonMinWidth: 120,
    
    // Standardhöhen
    indicatorHeight: 3,
    buttonHeight: 44,
    
    // Icon-Größen - Referenz aus ui.ts verwenden
    icon: ui.icon
  },

  // Container-Padding
  container: {
    padding: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    margin: 16,
  },

  // Formulare
  form: {
    inputHeight: 48,
    labelHeight: 24,
    spacing: 16,
  },

  // Karten
  card: {
    borderRadius: 8,
    padding: 16,
    margin: 8,
  },

  // Avatare und Bilder - Referenz aus ui.ts verwenden
  avatar: ui.avatar
}; 