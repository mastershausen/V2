import { Stack } from 'expo-router';
import React from "react";

/**
 *
 */
export default function NuggetsCreateLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="createNugget"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 