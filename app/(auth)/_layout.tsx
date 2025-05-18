/**
 * @file app/(auth)/_layout.tsx
 * @description Vereinfachtes Layout für Authentifizierungsseiten
 */

import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Vereinfachtes Auth-Layout ohne AuthCheck
 */
export default function AuthLayout() {
  const colors = useThemeColor();
  const backgroundColor = colors.backgroundPrimary;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 