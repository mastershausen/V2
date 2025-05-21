import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <TouchableOpacity 
      style={[
        styles.mediaNavItem, 
        { 
          borderBottomColor: colors.divider,
          borderLeftWidth: 3,
          borderLeftColor: colors.pastel?.primary || 'rgba(0, 122, 255, 0.3)',
        }
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={t('profileEdit.editHeaderImage')}
    >
      <View style={styles.mediaNavItemContent}>
        <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
        <Text style={[styles.mediaNavItemText, { color: colors.textPrimary }]}>
          {t('profileEdit.editHeaderImage')}
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