/**
 * Selektoren für den uiStore
 */
import { Appearance } from 'react-native';

import { UIState } from '../types/uiTypes';

// Typen für die Selektorfunktionen
type GetFunction = () => UIState;

// Erstellt die Selektoren für den uiStore
export const createUISelectors = (get: GetFunction) => ({
  /**
   * Aktuelles Theme basierend auf themeMode und Systemeinstellungen
   */
  currentTheme: (): 'light' | 'dark' => {
    try {
      const state = get();
      const themeMode = state?.themeMode || 'system';
      
      if (themeMode === 'system') {
        return Appearance.getColorScheme() || 'light';
      }
      
      return themeMode;
    } catch (error) {
      console.error('Error in currentTheme selector:', error);
      return 'light'; // Fallback für Fehlerfall
    }
  }
}); 