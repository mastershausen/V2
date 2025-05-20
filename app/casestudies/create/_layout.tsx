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
          presentation: 'fullScreenModal',
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="createCasestudyDetails"
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="metadata"
        options={{
          presentation: 'card',
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
} 