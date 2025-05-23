/**
 * Einstellungen-Tab-Screen
 * 
 * Dieser Screen dient als Container für die Einstellungen-Funktionalität.
 */
import { Stack } from 'expo-router';
import React from 'react';

import SettingsScreen from '@/features/settings/screens/SettingsScreen';

/**
 * Tab-Screen für die Einstellungen
 */
export default function Settings() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false, // Header wird vom SettingsScreen selbst gehandhabt
        }}
      />
      <SettingsScreen />
    </>
  );
} 