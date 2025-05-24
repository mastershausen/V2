import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  text = 'Verify Account Now',
  onPress,
  style,
  textStyle,
  showIcon = true,
  iconName = 'checkmark-circle-outline',
  iconSize = 16,
  gradientColors = ['#00A041', '#008F39'] as [string, string],
  disabled = false,
}: VerifyBadgeProps) {
  
  return (
    <TouchableOpacity 
      style={[styles.verifiedBadge, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  verifiedBadge: {
    borderRadius: ui.borderRadius.l,
    marginTop: spacing.m,
    shadowColor: '#008F39',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
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
    borderRadius: ui.borderRadius.l,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
});

export default VerifyBadge; 