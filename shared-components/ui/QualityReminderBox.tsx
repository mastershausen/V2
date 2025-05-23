import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        backgroundColor: `${colors.secondary}08`,
        borderColor: `${colors.secondary}30`,
      }, 
      containerStyle
    ]}>
      <MaterialCommunityIcons 
        name="lightbulb-on" 
        size={20} 
        color={colors.secondary} 
        style={styles.reminderIcon} 
      />
      <View style={styles.reminderTextContainer}>
        <Text style={[
          styles.reminderTitle, 
          { color: colors.secondary }, 
          textStyle
        ]}>
          💡 Tipp für bessere Matches
        </Text>
        <Text style={[
          styles.reminderText, 
          { color: colors.textSecondary }, 
          textStyle
        ]}>
          Je ausführlicher, klarer und präziser Sie Ihre Fallstudie beschreiben, desto 
          besser kann Olivia passende Matches finden. Das führt zu qualitativ hochwertigeren 
          Leads für Sie.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reminderBox: {
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  reminderIcon: {
    marginRight: spacing.s,
    marginTop: 2, // Leichte Ausrichtung mit dem ersten Textzeile
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  reminderText: {
    fontSize: typography.fontSize.xs,
    lineHeight: 16,
  },
});

export default QualityReminderBox; 