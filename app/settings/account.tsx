import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';

import { spacing } from '@/config/theme/spacing';
import { SettingsItem } from '@/features/settings/components/SettingsItem';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Account Settings Screen
 * Alle account-spezifischen Einstellungen und Verwaltungsfunktionen
 */
export default function AccountSettingsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Handler für Navigation zu verschiedenen Screens
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };
  
  // Handler für kritische Account-Aktionen
  const handleDeleteAccount = () => {
    Alert.alert(
      'Account löschen',
      'Sind Sie sicher, dass Sie Ihren Account endgültig löschen möchten? Alle Daten inklusive gespeicherter Inhalte werden unwiderruflich gelöscht.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Löschen', 
          style: 'destructive',
          onPress: () => {
            // Hier würde die Account-Löschung über E-Mail-Bestätigung erfolgen
            Alert.alert(
              'Bestätigung erforderlich',
              'Wir haben Ihnen eine E-Mail zur Bestätigung der Account-Löschung gesendet. Bitte folgen Sie den Anweisungen in der E-Mail.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Account-Einstellungen"
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
        {/* Account & Sicherheit */}
        <SettingsSection title="Account & Sicherheit">
          <SettingsItem
            label="E-Mail ändern"
            icon="mail-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/change-email')}
          />
          <SettingsItem
            label="Passwort ändern"
            icon="lock-closed-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/change-password')}
          />
          <SettingsItem
            label="Push-Benachrichtigungen"
            icon="notifications-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/notifications')}
          />
        </SettingsSection>
        
        {/* Abo & Zahlungen */}
        <SettingsSection title="Abo & Zahlungen">
          <SettingsItem
            label="Mein Abo & Zahlungen"
            icon="card-outline"
            value="Free Plan"
            showArrow={true}
            onPress={() => handleNavigation('/settings/subscription')}
          />
        </SettingsSection>
        
        {/* Rechtliches */}
        <SettingsSection title="Rechtliches">
          <SettingsItem
            label="Impressum"
            icon="document-text-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/imprint')}
          />
          <SettingsItem
            label="AGB"
            icon="clipboard-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/terms')}
          />
          <SettingsItem
            label="Datenschutz"
            icon="shield-checkmark-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/privacy')}
          />
          <SettingsItem
            label="Über Solvbox"
            icon="information-circle-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/about')}
          />
        </SettingsSection>
        
        {/* Account-Verwaltung */}
        <SettingsSection title="Account-Verwaltung">
          <SettingsItem
            label="Account löschen"
            icon="trash-outline"
            showArrow={true}
            onPress={handleDeleteAccount}
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