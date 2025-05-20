import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DateBadgeProps {
  /**
   * Das anzuzeigende Datum als String
   */
  date: string;
  
  /**
   * Optionaler Präfix-Text vor dem Datum (z.B. "Veröffentlicht am")
   */
  prefix?: string;

  /**
   * Optionale Breite des Badges
   */
  width?: number | 'auto';
}

/**
 * Eine wiederverwendbare Komponente für die Anzeige eines Datums in einem Badge-Format mit Kalender-Icon
 */
export function DateBadge({ date, prefix, width }: DateBadgeProps) {
  const colors = useThemeColor();
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.backgroundSecondary,
        width: width || 'auto'
      }
    ]}>
      <Ionicons 
        name="calendar-outline" 
        size={14} 
        color={colors.textTertiary}
        style={styles.icon}
      />
      <Text 
        style={[
          styles.text, 
          { color: colors.textTertiary }
        ]}
        numberOfLines={1}
      >
        {prefix ? `${prefix} ${date}` : date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: ui.borderRadius.s,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontSize: typography.fontSize.xs,
  }
}); 