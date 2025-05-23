import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Text, 
  TouchableOpacity, 
  View,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { SettingsItem } from '@/features/settings/components/SettingsItem';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Hauptkomponente für alle Einstellungen
 */
export default function SettingsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Handler für Navigation zu verschiedenen Screens
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };
  
  // Logout Handler
  const handleLogout = () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Abmelden', 
          style: 'destructive',
          onPress: () => {
            // Hier würde die Logout-Logik kommen
            console.log('User logged out');
            router.replace('/auth/login' as any);
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Einstellungen"
        showBackButton={false}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerContainer}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Allgemein */}
        <SettingsSection title="Allgemein">
          <SettingsItem
            label="Erscheinungsbild"
            icon="color-palette-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/appearance')}
          />
          <SettingsItem
            label="Sprache"
            icon="language-outline"
            value="Deutsch"
            showArrow={true}
            onPress={() => handleNavigation('/settings/language')}
          />
          <SettingsItem
            label="Tutorial"
            icon="play-circle-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/tutorial')}
          />
          <SettingsItem
            label="Gespeichert / Favoriten"
            icon="bookmark-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/saved')}
          />
          <SettingsItem
            label="Hilfe & Support"
            icon="help-circle-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/support')}
          />
          <SettingsItem
            label="Feedback"
            icon="chatbubble-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/feedback')}
          />
        </SettingsSection>
        
        {/* Account */}
        <SettingsSection title="Account">
          <SettingsItem
            label="Account-Einstellungen"
            icon="settings-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/account')}
          />
          <SettingsItem
            label="Abmelden"
            icon="log-out-outline"
            showArrow={false}
            onPress={handleLogout}
          />
        </SettingsSection>
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
}); 