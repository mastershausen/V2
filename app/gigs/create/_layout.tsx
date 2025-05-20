import { Stack } from 'expo-router';
import React from "react";

/**
 * Layout für den Create-Bereich der Gigs
 * Konfiguriert die Navigation als Modal ohne Header
 */
export default function GigsCreateLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen
        name="createGigList"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createGigDetails"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
} 