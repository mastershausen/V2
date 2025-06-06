import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  // Handler for navigation to different screens
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };
  
  // Handler for critical account actions
  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.deleteAccount'),
      t('settings.deleteAccountDescription'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('settings.deleteAccountConfirm'), 
          style: 'destructive',
          onPress: () => {
            // Here the account deletion via email confirmation would occur
            Alert.alert(
              'Confirmation Required',
              'We have sent you an email to confirm the account deletion. Please follow the instructions in the email.',
              [{ text: t('common.ok') }]
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
        <SettingsSection title={t('settings.accountSecurity')}>
          <SettingsItem
            label={t('settings.changeEmail.title')}
            icon="mail-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/change-email')}
          />
          <SettingsItem
            label={t('settings.changePassword.title')}
            icon="lock-closed-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/change-password')}
          />
          <SettingsItem
            label={t('settings.pushNotifications')}
            icon="notifications-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/notifications')}
          />
        </SettingsSection>
        
        {/* Subscription & Payments */}
        <SettingsSection title={t('settings.subscription.title')}>
          <SettingsItem
            label={t('settings.subscription.title')}
            icon="card-outline"
            value={t('settings.subscription.freePlan')}
            showArrow={true}
            onPress={() => handleNavigation('/settings/subscription')}
          />
        </SettingsSection>
        
        {/* Legal */}
        <SettingsSection title="Legal">
          <SettingsItem
            label={t('settings.imprint.title')}
            icon="document-text-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/imprint')}
          />
          <SettingsItem
            label={t('settings.terms.title')}
            icon="clipboard-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/terms')}
          />
          <SettingsItem
            label={t('settings.privacy.title')}
            icon="shield-checkmark-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/privacy')}
          />
        </SettingsSection>
        
        {/* Account Management */}
        <SettingsSection title={t('settings.accountManagement')}>
          <SettingsItem
            label={t('settings.deleteAccount')}
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