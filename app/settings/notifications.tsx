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

/**
 * Push-Benachrichtigungen Screen
 * Verwaltung aller Benachrichtigungseinstellungen
 */
export default function NotificationsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // State für verschiedene Benachrichtigungstypen
  const [notifications, setNotifications] = useState({
    master: true,
    updates: true,
    newCases: false,
    reminders: true,
    matches: true,
    messages: true,
  });
  
  // Handler für Benachrichtigungs-Toggle
  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Push-Benachrichtigungen"
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
        {/* Master-Schalter */}
        <SettingsSection title="Allgemein">
          <View style={styles.masterContainer}>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Alle Push-Benachrichtigungen ein- oder ausschalten.
            </Text>
          </View>
          
          <SettingsItem
            label="Push-Benachrichtigungen"
            icon="notifications-outline"
            isSwitch={true}
            switchValue={notifications.master}
            onSwitchChange={() => handleToggle('master')}
          />
        </SettingsSection>
        
        {/* Kategorien - nur wenn Master aktiviert */}
        {notifications.master && (
          <>
            <SettingsSection title="App-Updates">
              <SettingsItem
                label="Updates & Neuigkeiten"
                icon="refresh-outline"
                isSwitch={true}
                switchValue={notifications.updates}
                onSwitchChange={() => handleToggle('updates')}
              />
            </SettingsSection>
            
            <SettingsSection title="Inhalte">
              <SettingsItem
                label="Neue Fallstudien"
                icon="document-text-outline"
                isSwitch={true}
                switchValue={notifications.newCases}
                onSwitchChange={() => handleToggle('newCases')}
              />
              <SettingsItem
                label="Passende Matches"
                icon="people-outline"
                isSwitch={true}
                switchValue={notifications.matches}
                onSwitchChange={() => handleToggle('matches')}
              />
            </SettingsSection>
            
            <SettingsSection title="Erinnerungen">
              <SettingsItem
                label="Aktivitäts-Reminder"
                icon="time-outline"
                isSwitch={true}
                switchValue={notifications.reminders}
                onSwitchChange={() => handleToggle('reminders')}
              />
              <SettingsItem
                label="Nachrichten & Chats"
                icon="chatbubble-outline"
                isSwitch={true}
                switchValue={notifications.messages}
                onSwitchChange={() => handleToggle('messages')}
              />
            </SettingsSection>
          </>
        )}
        
        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.textTertiary }]}>
            Sie können Benachrichtigungen auch in den Systemeinstellungen Ihres Geräts verwalten.
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
  masterContainer: {
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
    paddingTop: spacing.xl,
  },
  infoText: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    textAlign: 'center',
  },
}); 