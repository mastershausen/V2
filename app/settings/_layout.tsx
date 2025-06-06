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
      <Stack.Screen 
        name="language" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="support" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="change-email" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="change-password" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="subscription" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="imprint" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="terms" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="privacy" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="appearance" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="feedback" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
} 