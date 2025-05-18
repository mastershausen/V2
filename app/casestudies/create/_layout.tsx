import { Stack } from 'expo-router';
import React from "react";

/**
 *
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
    </Stack>
  );
} 