import { Stack } from 'expo-router';
import React from "react";

/**
 * Layout für die Fallstudien-Sektion
 */
export default function CasestudiesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create/createCasestudyList"
        options={{
          presentation: 'modal',
          headerShown: false,
          title: '',
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="create/createCasestudyDetails"
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 