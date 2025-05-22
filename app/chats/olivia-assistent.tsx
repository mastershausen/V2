import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import OliviaChatScreen from '@/features/chats/screens/OliviaChatScreen';

/**
 * Olivia-Assistent Chat
 * 
 * Diese Seite zeigt den Chat mit dem Olivia-Assistenten an,
 * der eine eigenständige Komponente ist, ohne BottomTabbar.
 */
export default function OliviaAssistentRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <OliviaChatScreen />
    </>
  );
} 