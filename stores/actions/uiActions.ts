/**
 * Aktionen für den uiStore
 */
import { UIState, ThemeMode } from '../types/uiTypes';

// Typen für die Aktionsfunktionen
type SetFunction = (fn: (state: UIState) => Partial<UIState>) => void;
type GetFunction = () => UIState & { currentTheme: () => 'light' | 'dark' };

// Erstellt die Aktionen für den uiStore
export const createUIActions = (set: SetFunction, get: GetFunction) => ({
  /**
   * Theme-Modus setzen
   * @param mode
   */
  setThemeMode: (mode: ThemeMode) => set(() => ({ themeMode: mode })),
  
  /**
   * Theme umschalten (light -> dark -> system -> light)
   */
  toggleTheme: () => {
    const { themeMode } = get();
    
    if (themeMode === 'light') {
      set(() => ({ themeMode: 'dark' }));
    } else if (themeMode === 'dark') {
      set(() => ({ themeMode: 'system' }));
    } else {
      set(() => ({ themeMode: 'light' }));
    }
  },
  
  /**
   * Farbschema direkt setzen (wird für Store-Reset benötigt)
   * @param scheme 'light' | 'dark'
   */
  setColorScheme: (scheme: 'light' | 'dark') => {
    set(() => ({ themeMode: scheme }));
  },
  
  /**
   * Menü ein-/ausklappen
   */
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  
  /**
   * Lade-Status setzen
   * @param loading
   */
  setIsLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
}); 