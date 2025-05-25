import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface QualityReminderBoxProps {
  /**
   * Zusätzliche Styles für den Container
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Zusätzliche Styles für den Text
   */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * QualityReminderBox Komponente
 * 
 * Zeigt einen permanenten Reminder zur Qualität der Fallstudien-Eingaben an.
 * Motiviert User zu ausführlichen, klaren und präzisen Beschreibungen
 * für bessere Olivia-Matches und damit bessere Leads.
 * 
 * @example
 * ```tsx
 * <QualityReminderBox />
 * ```
 */
export function QualityReminderBox({
  containerStyle,
  textStyle,
}: QualityReminderBoxProps) {
  const colors = useThemeColor();

  return (
    <View style={[
      styles.reminderBox, 
      { 
        backgroundColor: `${colors.primary}10`,
        borderColor: `${colors.primary}30`,
      }, 
      containerStyle
    ]}>
      <Ionicons 
        name="information-circle-outline" 
        size={24} 
        color={colors.primary} 
        style={styles.reminderIcon} 
      />
      <Text style={[
        styles.reminderText, 
        { color: colors.textSecondary }, 
        textStyle
      ]}>
        The more detailed, clear and precise you describe your case study, the better Olivia can find suitable matches. This leads to higher quality leads for you.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reminderBox: {
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  reminderIcon: {
    marginRight: spacing.s,
  },
  reminderText: {
    flex: 1,
    fontSize: typography.fontSize.s,
    lineHeight: 18,
  },
  reminderTitle: {
    fontWeight: typography.fontWeight.semiBold as any,
  },
});

export default QualityReminderBox; 