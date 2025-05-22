import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Olivia-Tab-Screen
 */
export default function OliviaScreen() {
  const colors = useThemeColor();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <Text style={{ color: colors.textPrimary }}>Olivia-Assistent</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
}); 