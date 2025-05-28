import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import ChatsScreen from '@/features/chats/screens/ChatsScreen';

/**
 * Chats Route
 * 
 * Diese Seite zeigt den Chats-Screen an,
 * der alle Chats und Kontakte enthält.
 */
export default function ChatsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <StatusBar style="dark" />
      <ChatsScreen />
    </>
  );
} 