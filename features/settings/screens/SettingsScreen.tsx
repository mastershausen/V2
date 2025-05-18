import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { SettingsItem } from '@/features/settings/components/SettingsItem';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Hauptkomponente für alle Einstellungen
 * @returns Die Einstellungen-Komponente
 */
export default function SettingsScreen() {
  const colors = useThemeColor();
  
  // Settings-Hook für Daten und Funktionen
  const { settingsSections, showDebugMenu } = useSettings();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Einstellungen"
        showBackButton={false}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Allgemeine Einstellungen */}
        <SettingsSection title={settingsSections.general.title}>
          {settingsSections.general.items.map((item) => (
            <SettingsItem
              key={`general-${item.id}`}
              {...item}
            />
          ))}
        </SettingsSection>
        
        {/* Debug-Menü - nur anzeigen wenn aktiviert */}
        {showDebugMenu && (
          <SettingsSection title={settingsSections.debug.title} icon={settingsSections.debug.icon}>
            {settingsSections.debug.items.map((item) => (
              <SettingsItem
                key={`debug-${item.id}`}
                {...item}
              />
            ))}
          </SettingsSection>
        )}
        
        {/* Account-Einstellungen */}
        <SettingsSection title={settingsSections.account.title}>
          {settingsSections.account.items.map((item) => (
            <SettingsItem
              key={`account-${item.id}`}
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