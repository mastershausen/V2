import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';

interface HeaderMediaSelectorProps {
  onPress: () => void;
}

/**
 * Komponente zum Navigieren zur Header-Medien-Auswahl
 */
export function HeaderMediaSelector({ onPress }: HeaderMediaSelectorProps) {
  const colors = useThemeColor();

  return (
    <TouchableOpacity 
      style={[styles.mediaNavItem, { borderBottomColor: colors.divider }]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Header-Bild bearbeiten"
    >
      <View style={styles.mediaNavItemContent}>
        <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
        <Text style={[styles.mediaNavItemText, { color: colors.textPrimary }]}>
          Header-Bild bearbeiten
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mediaNavItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    borderBottomWidth: 1,
    marginBottom: spacing.m,
  },
  mediaNavItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaNavItemText: {
    fontSize: typography.fontSize.m,
    marginLeft: spacing.m,
  },
}); 