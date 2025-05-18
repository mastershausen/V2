/**
 * Typdefinitionen für das Settings-Feature
 */

import { Ionicons } from '@expo/vector-icons';

/**
 * Einstellungselemente für verschiedene Bereiche
 */
export type SettingsSectionType = 
  | 'general'
  | 'account'
  | 'debug'
  | 'accountSecurity'
  | 'accountManagement';

/**
 * Konfiguration für ein Einstellungselement
 */
export interface SettingItemConfig {
  id: string;
  label: string;
  icon: typeof Ionicons.name;
  showArrow?: boolean;
  value?: string;
  testID?: string;
  onPress: () => void;
}

/**
 * Konfiguration für eine Einstellungssektion
 */
export interface SettingsSectionConfig {
  id: SettingsSectionType;
  title: string;
  icon?: string;
  items: SettingItemConfig[];
}

/**
 * Konto-Aktions-Typen
 */
export type AccountActionType =
  | 'changePassword'
  | 'changeEmail'
  | 'privacySecurity'
  | 'pauseAccount'
  | 'deactivateAccount'
  | 'deleteAccount';

/**
 * Persistierte Einstellungen
 */
export interface PersistedSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  privacySettings: {
    analytics: boolean;
    marketing: boolean;
  };
  lastScreens: string[];
  userPreferences: Record<string, any>;
}

/**
 * Rückgabetyp des useSettings Hook
 */
export interface UseSettingsResult {
  // Einstellungskonfigurationen
  settingsSections: Record<SettingsSectionType, SettingsSectionConfig>;
  showDebugMenu: boolean;
  
  // Aktionen
  handleLogout: () => Promise<void>;
  handleAccountAction: (actionType: AccountActionType) => void;
  
  // Persistierte Einstellungen
  settings: PersistedSettings;
  updateSettings: (updates: Partial<PersistedSettings>) => void;
} 