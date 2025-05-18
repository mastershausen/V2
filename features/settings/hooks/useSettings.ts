/**
 * useSettings - Zentraler Hook für Settings-Funktionalität
 * 
 * Dieser Hook kapselt die gesamte Logik für die Einstellungs-Screens und
 * stellt eine einheitliche API für UI-Komponenten bereit.
 * 
 * Verwendet intern den settingsStore, der die persistente Speicherung
 * und Migration der Einstellungen übernimmt.
 */

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useAppNavigation } from '@/constants/routes';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useUserStore } from '@/stores/userStore';

import { createMainSettingsSections, createAccountSecuritySettings, createAccountManagementSettings } from '../config/settings';
import { useSettingsStore } from '../store';
import { AccountActionType, PersistedSettings, SettingsSectionConfig, SettingsSectionType, UseSettingsResult } from '../types';

/**
 * Haupthook für die Settings-Funktionalität
 * Liefert alle benötigten Daten und Funktionen für die Settings-Screens
 * @returns {UseSettingsResult} Daten und Funktionen für die Settings-Screens
 */
export function useSettings(): UseSettingsResult {
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const userStore = useUserStore();
  
  // Typensichere Aliase für UserStore-Funktionen
  const user = userStore.user;
  const logout = userStore.logout as () => Promise<void>;
  const isAuthenticated = userStore.isAuthenticated as () => boolean;
  
  // Settings-Store verwenden
  const settingsStore = useSettingsStore();
  
  // Zugriff auf die Einstellungen aus dem Store
  const settings: PersistedSettings = {
    theme: settingsStore.theme,
    language: settingsStore.language,
    notifications: settingsStore.notifications,
    privacySettings: settingsStore.privacySettings,
    lastScreens: settingsStore.lastScreens,
    userPreferences: settingsStore.userPreferences
  };
  
  // Wrapper für die Aktualisierung der Einstellungen
  const updateSettings = useCallback((updates: Partial<PersistedSettings>) => {
    // Theme aktualisieren
    if (updates.theme) {
      settingsStore.setTheme(updates.theme);
    }
    
    // Sprache aktualisieren
    if (updates.language) {
      settingsStore.setLanguage(updates.language);
    }
    
    // Benachrichtigungen aktualisieren
    if (updates.notifications !== undefined) {
      settingsStore.setNotifications(updates.notifications);
    }
    
    // Datenschutzeinstellungen aktualisieren
    if (updates.privacySettings) {
      settingsStore.updatePrivacySettings(updates.privacySettings);
    }
    
    // Zuletzt besuchte Bildschirme aktualisieren
    if (updates.lastScreens) {
      // Löscht zuerst die alten Bildschirme, um sie zu ersetzen
      settingsStore.clearRecentScreens();
      // Fügt dann die neuen Bildschirme hinzu
      updates.lastScreens.forEach(screen => {
        settingsStore.addRecentScreen(screen);
      });
    }
    
    // Benutzerpräferenzen aktualisieren
    if (updates.userPreferences) {
      Object.entries(updates.userPreferences).forEach(([key, value]) => {
        settingsStore.setUserPreference(key, value);
      });
    }
  }, [settingsStore]);
  
  // Feature-Flag für das Debug-Menü prüfen
  const showDebugMenu = useFeatureFlag('DEBUG_MENU', { screenName: 'SettingsScreen' });
  
  // Handler für Navigation zwischen Screens
  const handleNavigation = useCallback((route: string) => {
    // Aktualisiere die letzten besuchten Screens über den Store
    settingsStore.addRecentScreen(route);
    navigation.navigateTo(route);
  }, [navigation, settingsStore]);
  
  // Logout-Handler
  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);
  
  // Handler für Account-bezogene Aktionen
  const handleAccountAction = useCallback((actionType: AccountActionType) => {
    switch (actionType) {
      case 'changePassword':
        Alert.alert(
          t('settings.changePassword'),
          t('settings.changePasswordDescription'),
          [{ text: t('common.ok') }]
        );
        break;
        
      case 'changeEmail':
        Alert.alert(
          t('settings.changeEmail'),
          t('settings.changeEmailDescription'),
          [{ text: t('common.ok') }]
        );
        break;
        
      case 'privacySecurity':
        Alert.alert(
          t('settings.privacySecurity'),
          t('settings.privacySecurityDescription'),
          [{ text: t('common.ok') }]
        );
        break;
        
      case 'pauseAccount':
        Alert.alert(
          t('settings.pauseAccount'),
          t('settings.pauseAccountDescription'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('settings.pauseAccountConfirm'), style: 'destructive' }
          ]
        );
        break;
        
      case 'deactivateAccount':
        Alert.alert(
          t('settings.deactivateAccount'),
          t('settings.deactivateAccountDescription'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('settings.deactivateAccountConfirm'), style: 'destructive' }
          ]
        );
        break;
        
      case 'deleteAccount':
        Alert.alert(
          t('settings.deleteAccount'),
          t('settings.deleteAccountDescription'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('settings.deleteAccountConfirm'), style: 'destructive' }
          ]
        );
        break;
        
      default:
        // Unbekannte Aktion - sollte nicht vorkommen
    }
  }, [t]);
  
  // Einstellungssektionen für den Hauptbildschirm
  const mainSettingsSections = useMemo(() => {
    const sections = createMainSettingsSections(t, handleNavigation, handleLogout);
    
    // Debug-Sektion nur anzeigen, wenn Feature-Flag aktiviert ist
    if (!showDebugMenu) {
      delete sections.debug;
    }
    
    return sections;
  }, [t, handleNavigation, handleLogout, showDebugMenu]);
  
  // Account-Sicherheitseinstellungen für den Account-Bildschirm
  const accountSecuritySettings = useMemo(() => {
    const userEmail = isAuthenticated() && user ? user.email : undefined;
    return createAccountSecuritySettings(t, handleAccountAction, userEmail);
  }, [t, handleAccountAction, isAuthenticated, user]);
  
  // Account-Verwaltungseinstellungen für den Account-Bildschirm
  const accountManagementSettings = useMemo(() => {
    return createAccountManagementSettings(t, handleAccountAction);
  }, [t, handleAccountAction]);
  
  // Account-Bildschirm-Sektionen
  const accountScreenSections = useMemo(() => ({
    accountSecurity: {
      id: 'accountSecurity' as SettingsSectionType,
      title: t('settings.accountSecurity'),
      items: accountSecuritySettings,
    },
    accountManagement: {
      id: 'accountManagement' as SettingsSectionType,
      title: t('settings.accountManagement'),
      items: accountManagementSettings,
    },
  }), [t, accountSecuritySettings, accountManagementSettings]);
  
  // Alle Settings-Sektionen für die Verwendung im UI
  const settingsSections = useMemo(() => {
    const result: Record<string, SettingsSectionConfig> = {
      ...mainSettingsSections,
      ...accountScreenSections
    };
    
    return result as Record<SettingsSectionType, SettingsSectionConfig>;
  }, [mainSettingsSections, accountScreenSections]);
  
  return {
    // Standard-Rückgaben
    settingsSections,
    showDebugMenu,
    handleLogout,
    handleAccountAction,
    
    // Persistierte Einstellungen über den Store
    settings,
    updateSettings,
  };
} 