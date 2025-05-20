import { Stack } from 'expo-router';
import React from "react";

/**
 * Layout für Gigs-Screens
 */
export default function GigsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="details"
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 