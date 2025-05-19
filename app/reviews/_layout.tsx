import { Stack } from 'expo-router';
import React from "react";

/**
 * Layout für Review-Screens
 */
export default function ReviewsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="createReview"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 