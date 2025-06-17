import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  View,
  Text,
  Linking,
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
 * Help & Support Settings Screen
 */
export default function SupportSettingsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@solvbox.com?subject=Support Request');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+491234567890');
  };

  const handleChatSupport = () => {
    Alert.alert(t('settings.support.liveChat'), t('settings.support.chatComingSoon'));
  };

  const handleFAQ = () => {
    Alert.alert(t('settings.support.faq'), t('settings.support.faqComingSoon'));
  };

  const handleVideoTutorials = () => {
    Alert.alert(t('settings.support.videoTutorials'), t('settings.support.tutorialsComingSoon'));
  };

  const handleContactUs = () => {
    Linking.openURL('https://solvbox.com/contact');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('settings.support.title')}
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
        <SettingsSection title={t('settings.support.contactSupport')}>
          <SettingsItem
            label={t('settings.support.emailSupport')}
            value="support@solvbox.com"
            icon="mail"
            onPress={handleEmailSupport}
            showArrow={true}
          />
          <SettingsItem
            label={t('settings.support.phoneSupport')}
            value="+49 123 456 7890"
            icon="call"
            onPress={handleCallSupport}
            showArrow={true}
          />
          <SettingsItem
            label={t('settings.support.liveChat')}
            value="Chat with our support team"
            icon="chatbubble"
            onPress={handleChatSupport}
            showArrow={true}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.support.selfHelpResources')}>
          <SettingsItem
            label={t('settings.support.faq')}
            value="Frequently asked questions"
            icon="help-circle"
            onPress={handleFAQ}
            showArrow={true}
          />
          <SettingsItem
            label={t('settings.support.videoTutorials')}
            value="Learn how to use Solvbox"
            icon="play-circle"
            onPress={handleVideoTutorials}
            showArrow={true}
          />
          <SettingsItem
            label={t('settings.support.contactUs')}
            value="Visit our website"
            icon="globe"
            onPress={handleContactUs}
            showArrow={true}
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