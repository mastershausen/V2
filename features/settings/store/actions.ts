/**
 * @file features/settings/store/actions.ts
 * @description Aktionen für den Settings-Store
 */

import { SettingsState } from './schema';

/**
 * Store-Set-Funktion Typ
 */
type SetFunction = (
  state: Partial<SettingsState> | ((state: SettingsState) => Partial<SettingsState>)
) => void;

/**
 * Store-Get-Funktion Typ
 */
type GetFunction = () => SettingsState;

/**
 * Typ für die Settings-Store-Aktionen
 */
export interface SettingsActions {
  // Darstellungsaktionen
  setTheme: (theme: SettingsState['theme']) => void;
  setLanguage: (language: string) => void;
  
  // Benachrichtigungsaktionen
  setNotifications: (enabled: boolean) => void;
  toggleNotifications: () => void;
  
  // Datenschutzaktionen
  setAnalytics: (enabled: boolean) => void;
  setMarketing: (enabled: boolean) => void;
  updatePrivacySettings: (settings: Partial<SettingsState['privacySettings']>) => void;
  
  // Navigationsaktionen
  addRecentScreen: (screenRoute: string) => void;
  clearRecentScreens: () => void;
  
  // Erweiterte Einstellungsaktionen
  setUserPreference: <T>(key: string, value: T) => void;
  clearUserPreferences: () => void;
  
  // Statusaktionen
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Erstellt die Aktionen für den Settings-Store
 * @param set
 * @param get
 */
export const createSettingsActions = (set: SetFunction, get: GetFunction): SettingsActions => ({
  // Darstellungsaktionen
  setTheme: (theme) => {
    set({ theme });
  },
  
  setLanguage: (language) => {
    set({ language });
  },
  
  // Benachrichtigungsaktionen
  setNotifications: (enabled) => {
    set({ notifications: enabled });
  },
  
  toggleNotifications: () => {
    set((state) => ({
      notifications: !state.notifications
    }));
  },
  
  // Datenschutzaktionen
  setAnalytics: (enabled) => {
    set((state) => ({
      privacySettings: {
        ...state.privacySettings,
        analytics: enabled
      }
    }));
  },
  
  setMarketing: (enabled) => {
    set((state) => ({
      privacySettings: {
        ...state.privacySettings,
        marketing: enabled
      }
    }));
  },
  
  updatePrivacySettings: (settings) => {
    set((state) => ({
      privacySettings: {
        ...state.privacySettings,
        ...settings
      }
    }));
  },
  
  // Navigationsaktionen
  addRecentScreen: (screenRoute) => {
    set((state) => {
      const currentScreens = state.lastScreens || [];
      const newScreens = [
        screenRoute,
        ...currentScreens.filter(route => route !== screenRoute)
      ].slice(0, 5); // Maximal 5 Bildschirme speichern
      
      return { lastScreens: newScreens };
    });
  },
  
  clearRecentScreens: () => {
    set({ lastScreens: [] });
  },
  
  // Erweiterte Einstellungsaktionen
  setUserPreference: (key, value) => {
    set((state) => ({
      userPreferences: {
        ...state.userPreferences,
        [key]: value
      }
    }));
  },
  
  clearUserPreferences: () => {
    set({ userPreferences: {} });
  },
  
  // Statusaktionen
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  
  setError: (error) => {
    set({ error });
  },
  
  clearError: () => {
    set({ error: null });
  }
}); 