import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { SettingsItem } from '@/features/settings/components/SettingsItem';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { SettingItemConfig } from '@/features/settings/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Props für den AccountSettingsScreen
 */
export interface AccountSettingsProps {
  /** Callback zum Schließen des Screens */
  onClose: () => void;
}

/**
 * Account-Einstellungs-Screen
 *
 * Diese Komponente ist jetzt eine reine UI-Komponente, ohne eigene Zustandslogik.
 * Alle Funktionalität wird vom useSettings-Hook bereitgestellt.
 * @param param0 - Komponenteneigenschaften vom Typ AccountSettingsProps
 * @param param0.onClose - Callback-Funktion zum Schließen des Screens
 * @returns Die Account-Einstellungen-Komponente
 */
export default function AccountSettingsScreen({ onClose }: AccountSettingsProps) {
  const colors = useThemeColor();
  const { t } = useTranslation();
  
  // Hole alle benötigten Daten und Funktionen aus dem Hook
  const { settingsSections } = useSettings();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('settings.accountSettings')} 
        onBackPress={onClose}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Konto- und Sicherheitseinstellungen */}
        <SettingsSection title={settingsSections.accountSecurity.title}>
          {settingsSections.accountSecurity.items.map((item: SettingItemConfig) => (
            <SettingsItem
              key={`security-${item.id}`}
              {...item}
            />
          ))}
        </SettingsSection>
        
        {/* Konto-Verwaltung */}
        <SettingsSection title={settingsSections.accountManagement.title}>
          {settingsSections.accountManagement.items.map((item: SettingItemConfig) => (
            <SettingsItem
              key={`management-${item.id}`}
              {...item}
            />
          ))}
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.m,
  },
}); 