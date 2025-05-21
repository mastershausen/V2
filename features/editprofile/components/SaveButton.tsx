import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SaveButtonProps {
  onPress: () => void;
  hasChanges: boolean;
}

/**
 * Button zum Speichern von Änderungen
 */
export function SaveButton({ onPress, hasChanges }: SaveButtonProps) {
  const colors = useThemeColor();
  const { t } = useTranslation();

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.saveButton}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={hasChanges ? t('profileEdit.save') : t('profileEdit.noChanges')}
      disabled={!hasChanges}
    >
      <Text style={[
        styles.saveButtonText, 
        { 
          color: hasChanges ? colors.primary : colors.textTertiary,
          fontWeight: hasChanges ? typography.fontWeight.bold : typography.fontWeight.medium,
        }
      ]}>
        {t('common.save')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  saveButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
  },
}); 