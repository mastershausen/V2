import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import OliviaChatScreen from '@/features/chats/screens/OliviaChatScreen';

/**
 * Olivia Chat
 * 
 * Diese Seite zeigt den Chat mit Olivia an,
 * der eine eigenständige Komponente ist, ohne BottomTabbar.
 */
export default function OliviaRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <OliviaChatScreen />
    </>
  );
} 