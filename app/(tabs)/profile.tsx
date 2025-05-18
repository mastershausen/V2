/**
 * Profile-Tab-Screen
 * 
 * Dieser Screen dient als Container für die ProfileScreen-Komponente
 * aus dem features/profile-Verzeichnis. 
 */
import { Stack } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ProfileScreen from '@/features/profile/screens/ProfileScreen';

/**
 * Tab-Screen für das Benutzerprofil
 */
export default function Profile() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          title: t('shared.profile'),
        }}
      />
      <ProfileScreen />
    </>
  );
} 