import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

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

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.saveButton}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={hasChanges ? "Speichern" : "Keine Änderungen"}
      disabled={!hasChanges}
    >
      <Text style={[
        styles.saveButtonText, 
        { color: hasChanges ? colors.primary : colors.textTertiary }
      ]}>
        Speichern
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