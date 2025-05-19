import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '@/config/theme/spacing';

interface ProfileTabListContainerProps {
  children: React.ReactNode;
  style?: object;
}

export function ProfileTabListContainer({ children, style }: ProfileTabListContainerProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
    width: '100%',
  },
}); 