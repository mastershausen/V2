/**
 * Konfiguration für Settings-Feature
 * 
 * Zentrale Konfigurationsdatei für alle Einstellungen
 * Ermöglicht einfaches Hinzufügen und Verwalten von Einstellungen
 */

import { TFunction } from 'i18next';

import Routes from '@/constants/routes';

import { AccountActionType, SettingItemConfig, SettingsSectionConfig } from '../types';

/**
 * Erzeugt die Konfiguration für die allgemeinen Einstellungen
 * @param t - Übersetzungsfunktion
 * @param navigationHandler - Funktion zur Navigation
 * @returns Array von Einstellungselementen
 */
export const createGeneralSettings = (
  t: TFunction, 
  navigationHandler: (route: string) => void
): SettingItemConfig[] => [
  {
    id: 'tutorial',
    label: t('settings.tutorial'),
    icon: 'book-outline',
    showArrow: true,
    onPress: () => {}
  },
  {
    id: 'savedContent',
    label: t('settings.savedContent'),
    icon: 'bookmark-outline',
    showArrow: true,
    onPress: () => {}
  },
  {
    id: 'support',
    label: t('settings.support'),
    icon: 'help-circle-outline',
    showArrow: true,
    onPress: () => {}
  },
  {
    id: 'feedback',
    label: t('settings.feedback'),
    icon: 'chatbox-outline',
    showArrow: true,
    onPress: () => {}
  },
  {
    id: 'membership',
    label: t('settings.membership'),
    icon: 'people-outline',
    showArrow: true,
    onPress: () => {}
  },
  {
    id: 'payment',
    label: t('settings.payment'),
    icon: 'card-outline',
    showArrow: true,
    onPress: () => {}
  },
  {
    id: 'accountSettings',
    label: t('settings.accountSettings'),
    icon: 'settings-outline',
    showArrow: true,
    onPress: () => navigationHandler(Routes.SETTINGS.ACCOUNT)
  }
];

/**
 * Erzeugt die Konfiguration für die Debug-Einstellungen
 * @param navigationHandler - Funktion zur Navigation
 * @returns Array von Einstellungselementen
 */
export const createDebugSettings = (
  navigationHandler: (route: string) => void
): SettingItemConfig[] => [
  {
    id: 'debug',
    label: "Debug-Einstellungen",
    icon: "construct-outline",
    showArrow: true,
    onPress: () => navigationHandler(Routes.SETTINGS.DEBUG)
  }
];

/**
 * Erzeugt die Konfiguration für die Account-Einstellungen
 * @param t - Übersetzungsfunktion
 * @param logoutHandler - Funktion zum Ausloggen
 * @returns Array von Einstellungselementen
 */
export const createAccountSettings = (
  t: TFunction,
  logoutHandler: () => Promise<void>
): SettingItemConfig[] => [
  {
    id: 'logout',
    label: t('settings.logout'),
    icon: "log-out-outline",
    onPress: logoutHandler,
    testID: "logout-button"
  }
];

/**
 * Erzeugt die Konfiguration für die Account-Sicherheitseinstellungen
 * @param t - Übersetzungsfunktion
 * @param actionHandler - Funktion für Account-Aktionen
 * @param userEmail - E-Mail des Benutzers
 * @returns Array von Einstellungselementen
 */
export const createAccountSecuritySettings = (
  t: TFunction,
  actionHandler: (action: AccountActionType) => void,
  userEmail?: string
): SettingItemConfig[] => [
  {
    id: 'changePassword',
    label: t('settings.changePassword'),
    icon: "lock-closed-outline",
    showArrow: true,
    onPress: () => actionHandler('changePassword')
  },
  {
    id: 'changeEmail',
    label: t('settings.changeEmail'),
    icon: "mail-outline",
    value: userEmail || '',
    showArrow: true,
    onPress: () => actionHandler('changeEmail')
  },
  {
    id: 'privacySecurity',
    label: t('settings.privacySecurity'),
    icon: "shield-outline",
    showArrow: true,
    onPress: () => actionHandler('privacySecurity')
  }
];

/**
 * Erzeugt die Konfiguration für die Account-Verwaltungseinstellungen
 * @param t - Übersetzungsfunktion
 * @param actionHandler - Funktion für Account-Aktionen
 * @returns Array von Einstellungselementen
 */
export const createAccountManagementSettings = (
  t: TFunction,
  actionHandler: (action: AccountActionType) => void
): SettingItemConfig[] => [
  {
    id: 'pauseAccount',
    label: t('settings.pauseAccount'),
    icon: "pause-circle-outline",
    showArrow: true,
    onPress: () => actionHandler('pauseAccount')
  },
  {
    id: 'deactivateAccount',
    label: t('settings.deactivateAccount'),
    icon: "person-remove-outline",
    showArrow: true,
    onPress: () => actionHandler('deactivateAccount')
  },
  {
    id: 'deleteAccount',
    label: t('settings.deleteAccount'),
    icon: "trash-outline",
    showArrow: true,
    onPress: () => actionHandler('deleteAccount')
  }
];

/**
 * Erzeugt alle Sektionskonfigurationen für den Haupteinstellungsbildschirm
 * @param t - Übersetzungsfunktion
 * @param navigationHandler - Funktion zur Navigation
 * @param logoutHandler - Funktion zum Ausloggen
 * @returns Record von Sektionskonfigurationen
 */
export const createMainSettingsSections = (
  t: TFunction,
  navigationHandler: (route: string) => void,
  logoutHandler: () => Promise<void>
): Record<string, SettingsSectionConfig> => ({
  general: {
    id: 'general',
    title: t('settings.general'),
    items: createGeneralSettings(t, navigationHandler)
  },
  debug: {
    id: 'debug',
    title: 'Debug',
    icon: 'bug-outline',
    items: createDebugSettings(navigationHandler)
  },
  account: {
    id: 'account',
    title: t('settings.account'),
    items: createAccountSettings(t, logoutHandler)
  }
}); 