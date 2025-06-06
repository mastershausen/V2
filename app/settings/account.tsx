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
 * All account-specific settings and management functions
 */
export default function AccountSettingsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Handler for navigation to different screens
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };
  
  // Handler for critical account actions
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? All data including saved content will be irreversibly deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Here the account deletion via email confirmation would occur
            Alert.alert(
              'Confirmation Required',
              'We have sent you an email to confirm the account deletion. Please follow the instructions in the email.',
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
        title="Account Settings"
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
        {/* Account & Security */}
        <SettingsSection title="Account & Security">
          <SettingsItem
            label="Change Email"
            icon="mail-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/change-email')}
          />
          <SettingsItem
            label="Change Password"
            icon="lock-closed-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/change-password')}
          />
          <SettingsItem
            label="Push Notifications"
            icon="notifications-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/notifications')}
          />
        </SettingsSection>
        
        {/* Subscription & Payments */}
        <SettingsSection title="Subscription & Payments">
          <SettingsItem
            label="My Subscription & Payments"
            icon="card-outline"
            value="Free Plan"
            showArrow={true}
            onPress={() => handleNavigation('/settings/subscription')}
          />
        </SettingsSection>
        
        {/* Legal */}
        <SettingsSection title="Legal">
          <SettingsItem
            label="Imprint"
            icon="document-text-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/imprint')}
          />
          <SettingsItem
            label="Terms & Conditions"
            icon="clipboard-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/terms')}
          />
          <SettingsItem
            label="Privacy Policy"
            icon="shield-checkmark-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/privacy')}
          />
        </SettingsSection>
        
        {/* Account Management */}
        <SettingsSection title="Account Management">
          <SettingsItem
            label="Delete Account"
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