import { Stack } from 'expo-router';
import React from "react";

/**
 * Layout für den gemeinsamen Create-Bereich
 * Enthält Routen, die für verschiedene Inhaltstypen geteilt werden
 */
export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="metadata"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 