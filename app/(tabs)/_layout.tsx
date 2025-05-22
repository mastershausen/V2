/**
 * @file app/(tabs)/_layout.tsx
 * @description Haupt-Layout für die Tab-Navigation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { Tabs, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

import { DEMO_USERS } from '@/features/auth/config/demo-users';
import { AppModeToggle } from '@/features/mode/components';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';
import StorageService from '@/services/StorageService';
import { BottomTabIcon } from '@/shared-components/navigation/icons/BottomTabIcon';
import { ProfileTabIcon } from '@/shared-components/navigation/icons/ProfileTabIcon';
import { useUserStore } from '@/stores';
import { logger } from '@/utils/logger';
import { 
  createProfileInitialsFromName, 
  ProfileImageData,
  createProfileImage 
} from '@/utils/profileImageUtils';
import { APP_STORAGE_KEYS } from '@/utils/storageKeys';

/**
 * Hintergrund für die Tab-Bar mit Blur-Effekt für bessere Lesbarkeit
 * @returns Die gerenderte Hintergrund-Komponente
 */
function TabBarBackground() {
  const colorScheme = useColorScheme();
  const colors = useThemeColor();
  
  return colorScheme === 'dark' ? (
    <BlurView
      intensity={80}
      tint="dark"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    />
  ) : (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colors.backgroundPrimary,
      }}
    />
  );
}

/**
 * Hauptkomponente für das Tabs-Layout
 * @returns Das gerenderte Tab-Layout
 */
export default function TabLayout() {
  // Alle Hooks zuerst deklarieren, bevor wir irgendwelche Variablen setzen oder Berechnungen durchführen
  const { t } = useTranslation();
  const colors = useThemeColor();
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();
  const { getCurrentUser } = useUserStore();
  
  // Verwende den modernen useMode-Hook
  const { 
    isDemoMode, 
    userStatus, 
    appMode 
  } = useMode();
  
  // State Hooks
  const [profileData, setProfileData] = useState<ProfileImageData | undefined>(undefined);
  
  // Abgeleitete Werte basierend auf den Hooks
  const demoMode = isDemoMode();
  
  // Demo-Benutzer und aktueller Benutzer
  // @ts-ignore - Ignorieren des Types für getCurrentUser
  const currentUser = useUserStore.getState().getCurrentUser();
  const demoUser = DEMO_USERS[0];
  
  // Hilfsfunktion für Profilbild-Konvertierung
  const getProfileImageData = useCallback((user: { 
    profileImage?: string | ProfileImageData | null; 
    name?: string;
  } | null | undefined): ProfileImageData | undefined => {
    if (!user) return undefined;
    
    if (typeof user.profileImage === 'string' && user.profileImage) {
      // String-URL in ProfileImageData konvertieren
      return createProfileImage(
        user.profileImage,
        user.name ? user.name.substring(0, 2).toUpperCase() : 'UN'
      );
    } else if (typeof user.profileImage === 'object' && user.profileImage) {
      // Bereits ein ProfileImageData-Objekt
      return user.profileImage as ProfileImageData;
    } else if (user.name) {
      // Nur Initialen verwenden
      return createProfileInitialsFromName(user.name);
    }
    
    return undefined;
  }, []);
  
  // Wähle den richtigen Benutzernamen basierend auf dem Modus
  const userName = demoMode
    ? (demoUser?.name || 'Demo User')
    : (currentUser?.name || currentUser?.username || 'User');
  
  // Einzelner useEffect für Profilbild-Initialisierung und Updates
  useEffect(() => {
    // Berechne das aktuelle Profilbild basierend auf dem Modus
    const newProfileImage = demoMode
      ? getProfileImageData(demoUser)
      : getProfileImageData(currentUser);
    
    // Setze das Profilbild
    setProfileData(newProfileImage);
  }, [currentUser, demoUser, demoMode, getProfileImageData]);

  return (
    <>
      {/* App-Modus-Toggle (nur im Development-Build sichtbar) */}
      {__DEV__ && (
        <View style={styles.appModeToggleContainer}>
          <AppModeToggle style={styles.appModeToggle} />
        </View>
      )}
      
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colorScheme === 'light' 
              ? '#FFFFFF' 
              : colors.backgroundPrimary,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
            paddingBottom: 2,
            paddingTop: 2,
            height: 80,
            // Schatten für die TabBar im Light-Mode
            ...(colorScheme === 'light' ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 5,
            } : {})
          },
          tabBarBackground: () => <TabBarBackground />,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="chats"
          options={{
            title: t('tabs.chats'),
            tabBarIcon: ({ color }) => (
              <BottomTabIcon name="chat" color={color} size={26} />
            ),
          }}
        />
        <Tabs.Screen
          name="olivia"
          options={{
            title: "Olivia",
            tabBarIcon: ({ color }) => (
              <BottomTabIcon name="ai" color={color} size={26} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              // Verhindern der Standard-Navigation
              e.preventDefault();
              // Navigiere zum eigenständigen Olivia-Assistenten
              router.navigate('/chats/olivia');
            },
          }}
        />
        <Tabs.Screen
          name="mysolvbox"
          options={{
            title: 'MySolvbox',
            tabBarIcon: ({ color }) => (
              <BottomTabIcon name="folder" color={color} size={26} />
            ),
          }}
        />
        <Tabs.Screen
          name="solvboxai"
          options={{
            title: 'SolvboxAI',
            tabBarIcon: ({ color }) => (
              <BottomTabIcon name="ai" color={color} size={26} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Einstellungen',
            tabBarIcon: ({ color }) => (
              <BottomTabIcon name="settings" color={color} size={26} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

// Stilinformationen für dieses Layout
const styles = StyleSheet.create({
  appModeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 15,
    zIndex: 1000,
    padding: 0,
    backgroundColor: 'transparent',
  },
  appModeToggle: {
    marginVertical: 0,
  }
}); 