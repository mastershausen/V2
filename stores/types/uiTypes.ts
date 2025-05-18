/**
 * Typdefinitionen für den uiStore
 */

/**
 * Verfügbare Themes
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Basis-Zustand für den UI-Store
 * Enthält nur die State-Eigenschaften, keine Aktionen
 */
export interface UIState {
  // Zustandsdaten
  themeMode: ThemeMode;
  isMenuOpen: boolean;
  isLoading: boolean;
}

/**
 * Vollständiger uiStore-Typ mit allen Funktionen
 */
export interface UIStore extends UIState {
  // Berechnete Eigenschaften
  currentTheme: () => 'light' | 'dark';
  
  // Aktionen
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
  toggleMenu: () => void;
  setIsLoading: (loading: boolean) => void;
} 