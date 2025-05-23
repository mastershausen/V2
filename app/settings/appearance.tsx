import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  View,
  Text 
} from 'react-native';
import { useRouter } from 'expo-router';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { SettingsItem } from '@/features/settings/components/SettingsItem';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

type ThemeMode = 'system' | 'light' | 'dark';

/**
 * Erscheinungsbild-Einstellungen Screen
 * Theme-Auswahl: Light, Dark, System
 */
export default function AppearanceScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // State für Theme-Auswahl
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('system');
  
  // Handler für Theme-Wechsel
  const handleThemeChange = (theme: ThemeMode) => {
    setSelectedTheme(theme);
    // Hier würde die Theme-Änderung gespeichert und angewendet werden
    console.log('Theme geändert zu:', theme);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Erscheinungsbild"
        showBackButton={true}
        onBackPress={() => router.back()}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerContainer}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme-Auswahl */}
        <SettingsSection title="Design">
          <View style={styles.themeContainer}>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Wählen Sie das gewünschte Erscheinungsbild für die App.
            </Text>
          </View>
          
          <SettingsItem
            label="Systemstandard"
            icon="phone-portrait-outline"
            isSwitch={false}
            onPress={() => handleThemeChange('system')}
            value={selectedTheme === 'system' ? '✓' : ''}
          />
          <SettingsItem
            label="Hell"
            icon="sunny-outline"
            isSwitch={false}
            onPress={() => handleThemeChange('light')}
            value={selectedTheme === 'light' ? '✓' : ''}
          />
          <SettingsItem
            label="Dunkel"
            icon="moon-outline"
            isSwitch={false}
            onPress={() => handleThemeChange('dark')}
            value={selectedTheme === 'dark' ? '✓' : ''}
          />
        </SettingsSection>
        
        {/* Zusätzliche Informationen */}
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.textTertiary }]}>
            Bei "Systemstandard" folgt die App automatisch den Einstellungen Ihres Geräts.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 56,
    paddingTop: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.m,
  },
  themeContainer: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
  },
  sectionDescription: {
    fontSize: typography.fontSize.s,
    lineHeight: 20,
    marginBottom: spacing.m,
  },
  infoContainer: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.l,
  },
  infoText: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    textAlign: 'center',
  },
}); 