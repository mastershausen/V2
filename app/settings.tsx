import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';

export default function SettingsScreen() {
  const colors = useThemeColor();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.ui.headerBackground,
          },
          headerTintColor: colors.ui.headerText,
        }}
      />
      <StatusBar style="auto" />
      <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Hier können Sie Ihre App-Einstellungen verwalten
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 