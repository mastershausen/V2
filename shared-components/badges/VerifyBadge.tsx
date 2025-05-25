import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';

interface VerifyBadgeProps {
  /**
   * Text to display in the badge
   */
  text?: string;
  /**
   * Function to call when badge is pressed
   */
  onPress?: () => void;
  /**
   * Custom style for the badge container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom style for the text
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Show the verification icon
   */
  showIcon?: boolean;
  /**
   * Icon name to display
   */
  iconName?: keyof typeof Ionicons.glyphMap;
  /**
   * Icon size
   */
  iconSize?: number;
  /**
   * Gradient colors for the badge
   */
  gradientColors?: [string, string];
  /**
   * Whether the badge is disabled
   */
  disabled?: boolean;
}

/**
 * VerifyBadge Component
 * 
 * A premium verification badge with gradient background and floating effect.
 * Designed to inspire trust and encourage verification actions.
 * 
 * @example
 * ```tsx
 * <VerifyBadge 
 *   text="Verify Account Now"
 *   onPress={() => console.log('Verify pressed')}
 * />
 * ```
 */
export function VerifyBadge({
  text,
  onPress,
  style,
  textStyle,
  showIcon = true,
  iconName = 'checkmark-circle-outline',
  iconSize = 16,
  gradientColors = ['#00A041', '#008F39'] as [string, string],
  disabled = false,
}: VerifyBadgeProps) {
  const { t } = useTranslation();
  
  const badgeText = text || t('verification.badge.text');
  
  // Erweiterte Gradient-Farben für 3D-Effekt
  const enhanced3DColors: readonly [string, string, string, string] = [
    '#00B84A', // Helleres Grün oben
    gradientColors[0], // Original Grün
    gradientColors[1], // Dunkleres Grün
    '#006B2F', // Noch dunkleres Grün unten
  ];
  
  return (
    <TouchableOpacity 
      style={[styles.verifiedBadge, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={enhanced3DColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.verifiedGradient}
      >
        {showIcon && (
          <Ionicons 
            name={iconName} 
            size={iconSize} 
            color="#FFFFFF" 
            style={styles.verifiedIcon} 
          />
        )}
        <Text style={[styles.verifiedText, textStyle]}>
          {badgeText}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  verifiedBadge: {
    borderRadius: ui.borderRadius.m,
    marginTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },
  verifiedIcon: {
    marginRight: spacing.xs,
  },
  verifiedText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
    color: '#FFFFFF',
  },
  verifiedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ui.borderRadius.m,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
});

export default VerifyBadge; 