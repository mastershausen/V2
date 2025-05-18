/**
 * @file features/settings/store/selectors.ts
 * @description Selektoren für den Settings-Store
 */

import { SettingsState } from './schema';

/**
 * Typ für die Settings-Store-Selektoren
 */
export interface SettingsSelectors {
  // Basis-Selektoren
  getTheme: () => SettingsState['theme'];
  getLanguage: () => string;
  getNotificationsEnabled: () => boolean;
  
  // Datenschutz-Selektoren
  getPrivacySettings: () => SettingsState['privacySettings'];
  getAnalyticsEnabled: () => boolean;
  getMarketingEnabled: () => boolean;
  
  // Navigation-Selektoren
  getRecentScreens: () => string[];
  getLastVisitedScreen: () => string | undefined;
  
  // Erweiterte Einstellungen
  getUserPreference: <T>(key: string, defaultValue?: T) => T | undefined;
  
  // Status-Selektoren
  isLoading: () => boolean;
  hasError: () => boolean;
  getError: () => string | null;
}

/**
 * Store-Get-Funktion Typ
 */
type GetFunction = () => SettingsState;

/**
 * Erstellt die Selektoren für den Settings-Store
 * @param get
 */
export const createSettingsSelectors = (get: GetFunction): SettingsSelectors => ({
  // Basis-Selektoren
  getTheme: () => get().theme,
  getLanguage: () => get().language,
  getNotificationsEnabled: () => get().notifications,
  
  // Datenschutz-Selektoren
  getPrivacySettings: () => get().privacySettings,
  getAnalyticsEnabled: () => get().privacySettings.analytics,
  getMarketingEnabled: () => get().privacySettings.marketing,
  
  // Navigation-Selektoren
  getRecentScreens: () => get().lastScreens,
  getLastVisitedScreen: () => {
    const screens = get().lastScreens;
    return screens.length > 0 ? screens[0] : undefined;
  },
  
  // Erweiterte Einstellungen
  getUserPreference: <T>(key: string, defaultValue?: T): T | undefined => {
    const preferences = get().userPreferences || {};
    return (key in preferences) ? preferences[key] as T : defaultValue;
  },
  
  // Status-Selektoren
  isLoading: () => get().isLoading,
  hasError: () => !!get().error,
  getError: () => get().error
}); 