/**
 * useDebugSettings - Hook für Debug-Einstellungs-Funktionalität
 * 
 * Dieser Hook kapselt die Debug-spezifische Logik und stellt
 * eine einheitliche API für den DebugSettingsScreen bereit.
 */

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useMode } from '@/features/mode/hooks/useMode';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { UserRole } from '@/stores/types/userTypes';
import { useUserStore } from '@/stores/userStore';
import { UserStatus } from '@/types/common/appMode';

import { useSettingsStore } from '../store';
import { useSettings } from './useSettings';

/**
 * Rückgabetyp des useDebugSettings Hook
 */
export interface UseDebugSettingsResult {
  // Feature-Flags
  showRoleSwitcher: boolean;
  showDebugMenu: boolean;
  
  // App-Modus Informationen
  isDemoMode: () => boolean;
  appMode: string;
  userStatus: UserStatus;
  isDemoAccount: boolean;
  
  // Benutzer-Informationen
  currentRole: string;
  isAuthenticated: boolean;
  userId?: string;
  
  // Funktionen
  handleChangeRole: (newRole: UserRole) => Promise<void>;
  
  // Debug-Einstellungen (neu)
  clearStoredSettings: () => void;
  getCurrentTheme: () => string;
  toggleDebugMode: () => void;
}

function isObjectWithType(val: unknown): val is { type: string } {
  return typeof val === 'object' && val !== null && 'type' in val;
}

/**
 * Hook für Debug-Einstellungs-Funktionalität
 * Liefert alle benötigten Daten und Funktionen für den Debug-Einstellungs-Screen
 * @returns {UseDebugSettingsResult} Daten und Funktionen für den Debug-Einstellungs-Screen
 */
export function useDebugSettings(): UseDebugSettingsResult {
  const { t } = useTranslation();
  
  // Settings-Hook für allgemeine Einstellungsfunktionen verwenden
  const { showDebugMenu } = useSettings();
  
  // Den Settings-Store für erweiterte Debug-Funktionen verwenden
  const settingsStore = useSettingsStore();
  
  // User-Store verwenden für benutzer-bezogene Funktionen
  const userStore = useUserStore();
  const user = userStore.user;
  const isUserAuthenticated = (userStore.isAuthenticated as unknown as () => boolean);
  const changeUserRole = (userStore.changeUserRole as unknown as (role: UserRole) => Promise<boolean>);
  
  // Der neue useMode-Hook liefert alle nötigen Infos zum App-Modus
  const {
    appMode,
    userStatus,
    setAppMode,
    isDemoMode,
    isDemoAccount
  } = useMode();
  
  // Abgeleiteten Authentifizierungsstatus berechnen
  const isAuthenticated = isObjectWithType(userStatus) && userStatus.type === 'authenticated';
  
  // Feature-Flag für den Rollenumschalter prüfen
  const showRoleSwitcher = useFeatureFlag('ROLE_SWITCHER', { screenName: 'DebugSettingsScreen' });
  
  // Rolle ändern
  const handleChangeRole = useCallback(async (newRole: UserRole) => {
    try {
      const success = await changeUserRole(newRole);
      
      if (success) {
        Alert.alert(
          isDemoMode() ? "Demo-Modus" : "Erfolg",
          `Benutzerrolle wurde auf "${newRole}" geändert.${isDemoMode() ? ' Diese Änderung ist nur temporär.' : ''}`,
          [{ text: t('common.ok') }]
        );
      } else {
        throw new Error("Rolle konnte nicht geändert werden");
      }
    } catch (_) {
      // Error-Logging und Fehleranzeige
      Alert.alert(
        "Fehler",
        "Die Benutzerrolle konnte nicht geändert werden. Bitte versuchen Sie es später erneut.",
        [{ text: t('common.ok') }]
      );
    }
  }, [changeUserRole, isDemoMode, t]);
  
  // Debug-Methoden
  const clearStoredSettings = useCallback(() => {
    // Zurücksetzen bestimmter Einstellungen für Debugging
    settingsStore.clearRecentScreens();
    settingsStore.clearUserPreferences();
    
    Alert.alert(
      "Debug-Aktion",
      "Die gespeicherten Einstellungen wurden zurückgesetzt.",
      [{ text: t('common.ok') }]
    );
  }, [settingsStore, t]);
  
  const getCurrentTheme = useCallback(() => {
    return settingsStore.theme;
  }, [settingsStore]);
  
  const toggleDebugMode = useCallback(() => {
    // Setzt ein Debug-Flag in den Benutzereinstellungen
    const current = settingsStore.selectors.getUserPreference('debugMode', false);
    settingsStore.setUserPreference('debugMode', !current);
    
    Alert.alert(
      "Debug-Modus",
      `Debug-Modus ist jetzt ${!current ? 'aktiviert' : 'deaktiviert'}.`,
      [{ text: t('common.ok') }]
    );
  }, [settingsStore, t]);
  
  // Die aktuelle Benutzerrolle aus dem Store verwenden
  const currentRole = useMemo(() => user?.role || 'free', [user]);
  
  return {
    // Feature-Flags
    showRoleSwitcher,
    showDebugMenu,
    
    // App-Modus Informationen
    isDemoMode,
    appMode,
    userStatus,
    isDemoAccount,
    
    // Benutzer-Informationen
    currentRole,
    isAuthenticated: isUserAuthenticated(),
    userId: user?.id,
    
    // Funktionen
    handleChangeRole,
    
    // Debug-Einstellungen (neu)
    clearStoredSettings,
    getCurrentTheme,
    toggleDebugMode
  };
} 