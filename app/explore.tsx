import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import ExploreScreen from '@/features/mysolvbox/screens/Explore';

/**
 * Explore Route
 * 
 * Diese Seite zeigt den Explore-Screen an,
 * der alle "I want..." Optionen und Filter enthält.
 */
export default function ExploreRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <StatusBar style="dark" />
      <ExploreScreen />
    </>
  );
} 