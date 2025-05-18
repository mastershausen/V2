import { Stack } from 'expo-router';
import React from "react";
import { useTranslation } from 'react-i18next';

/**
 *
 */
export default function SettingsLayout() {
  const { t } = useTranslation();
  
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="account" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="debug" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
} 