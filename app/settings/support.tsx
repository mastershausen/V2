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

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@solvbox.com?subject=Support Request');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+491234567890');
  };

  const handleChatSupport = () => {
    Alert.alert('Live Chat', 'Live Chat feature coming soon!');
  };

  const handleFAQ = () => {
    // Could navigate to FAQ screen or open web FAQ
    Alert.alert('FAQ', 'FAQ section coming soon!');
  };

  const handleVideoTutorials = () => {
    // Could navigate to tutorials or open video library
    Alert.alert('Video Tutorials', 'Video tutorials coming soon!');
  };

  const handleContactUs = () => {
    Linking.openURL('https://solvbox.com/contact');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Help & Support"
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
        <SettingsSection title="Contact Support">
          <SettingsItem
            label="Email Support"
            value="support@solvbox.com"
            icon="mail"
            onPress={handleEmailSupport}
            showArrow={true}
          />
          <SettingsItem
            label="Phone Support"
            value="+49 123 456 7890"
            icon="call"
            onPress={handleCallSupport}
            showArrow={true}
          />
          <SettingsItem
            label="Live Chat"
            value="Chat with our support team"
            icon="chatbubble"
            onPress={handleChatSupport}
            showArrow={true}
          />
        </SettingsSection>

        <SettingsSection title="Self-Help Resources">
          <SettingsItem
            label="FAQ"
            value="Frequently asked questions"
            icon="help-circle"
            onPress={handleFAQ}
            showArrow={true}
          />
          <SettingsItem
            label="Video Tutorials"
            value="Learn how to use Solvbox"
            icon="play-circle"
            onPress={handleVideoTutorials}
            showArrow={true}
          />
          <SettingsItem
            label="Contact Us"
            value="Visit our website"
            icon="globe"
            onPress={handleContactUs}
            showArrow={true}
          />
        </SettingsSection>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Our support team is available Monday-Friday, 9 AM - 6 PM CET.
            For urgent matters, please call our phone support.
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
  infoContainer: {
    marginTop: spacing.l,
    paddingHorizontal: spacing.m,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
}); 