import { Stack } from 'expo-router';
import React from "react";

/**
 *
 */
export default function GigsCreateLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="createGigList"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 