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
 * Main component for all settings
 */
export default function SettingsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Handler for navigation to different screens
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };
  
  // Logout Handler
  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Do you really want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log out', 
          style: 'destructive',
          onPress: () => {
            // Here the logout logic would come
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
        title="Settings"
        showBackButton={false}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerContainer}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* General */}
        <SettingsSection title="General">
          <SettingsItem
            label="Appearance"
            icon="color-palette-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/appearance')}
          />
          <SettingsItem
            label="Language"
            icon="language-outline"
            value="English"
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
            label="Saved / Favorites"
            icon="bookmark-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/saved')}
          />
          <SettingsItem
            label="Help & Support"
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
            label="Account Settings"
            icon="settings-outline"
            showArrow={true}
            onPress={() => handleNavigation('/settings/account')}
          />
          <SettingsItem
            label="Log out"
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