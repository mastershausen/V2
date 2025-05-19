import { Stack } from 'expo-router';
import React from "react";

/**
 * Layout für Fallstudien-Erstellungsscreens
 */
export default function CaseStudiesCreateLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="createCasestudyList"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createCasestudyDetails"
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 