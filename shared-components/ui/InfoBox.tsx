import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';

interface InfoBoxProps {
  /**
   * Text, der in der InfoBox angezeigt wird
   */
  text: string;
  /**
   * Name des Icons aus der Ionicons-Bibliothek
   * @default "information-circle-outline"
   */
  iconName?: keyof typeof Ionicons.glyphMap;
  /**
   * Farbe des Icons
   * @default colors.primary
   */
  iconColor?: string;
  /**
   * Größe des Icons
   * @default 24
   */
  iconSize?: number;
  /**
   * Hintergrundfarbe der InfoBox
   * @default `${colors.primary}10`
   */
  backgroundColor?: string;
  /**
   * Textfarbe
   * @default colors.textSecondary
   */
  textColor?: string;
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
 * InfoBox Komponente
 * 
 * Zeigt eine Informationsbox mit einem Icon und Text an.
 * Wird verwendet, um Benutzer über wichtige Informationen zu informieren.
 * 
 * @example
 * ```tsx
 * <InfoBox 
 *   text="Die Wahl des richtigen Frames hilft dabei, deine Fallstudie strukturiert und überzeugend zu präsentieren."
 *   backgroundColor={`${colors.primary}10`}
 *   textColor={colors.textSecondary}
 * />
 * ```
 */
export function InfoBox({
  text,
  iconName = "information-circle-outline",
  iconColor,
  iconSize = 24,
  backgroundColor,
  textColor,
  containerStyle,
  textStyle,
}: InfoBoxProps) {
  return (
    <View style={[styles.infoBox, { backgroundColor }, containerStyle]}>
      <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.infoIcon} />
      <Text style={[styles.infoText, { color: textColor }, textStyle]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: spacing.s,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.s,
    lineHeight: 18,
  },
});

export default InfoBox; 