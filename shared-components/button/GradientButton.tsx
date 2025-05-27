import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { buttonGradients, buttonStyles } from '@/config/theme/buttons';

type ButtonVariant = 'primary' | 'success' | 'attention' | 'danger';

interface GradientButtonProps extends TouchableOpacityProps {
  /**
   * Button text
   */
  label: string;
  /**
   * Button variant
   */
  variant?: ButtonVariant;
  /**
   * Icon name from Ionicons
   */
  icon?: keyof typeof Ionicons.glyphMap;
  /**
   * Icon size
   */
  iconSize?: number;
  /**
   * Custom styles for container
   */
  containerStyle?: ViewStyle;
  /**
   * Custom styles for gradient
   */
  gradientStyle?: ViewStyle;
  /**
   * Custom styles for text
   */
  textStyle?: TextStyle;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Custom gradient colors
   */
  gradientColors?: readonly [string, string];
}

/**
 * GradientButton - Einheitlicher Button mit Gradient-Hintergrund
 *
 * Verwendet die zentralen Button-Styles und unterstützt verschiedene Varianten
 * mit einheitlichem Erscheinungsbild
 *
 * @example
 * ```tsx
 * <GradientButton
 *   label="Verify Account"
 *   variant="success"
 *   icon="checkmark-circle-outline"
 *   onPress={() => console.log('Button pressed')}
 * />
 * ```
 */
export function GradientButton({
  label,
  variant = 'primary',
  icon,
  iconSize = 18,
  containerStyle,
  gradientStyle,
  textStyle,
  disabled = false,
  gradientColors,
  onPress,
  ...rest
}: GradientButtonProps) {
  // Bestimme den zu verwendenden Gradienten
  const gradient = gradientColors 
    ? { colors: gradientColors, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }
    : buttonGradients[variant];

  return (
    <TouchableOpacity
      style={[
        buttonStyles.container,
        disabled && buttonStyles.disabledContainer,
        containerStyle,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      {...rest}
    >
      <LinearGradient
        colors={gradient.colors as readonly [string, string]}
        start={gradient.start}
        end={gradient.end}
        style={[buttonStyles.gradient, gradientStyle]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={iconSize}
            color="#FFFFFF"
            style={buttonStyles.icon}
          />
        )}
        <Text style={[buttonStyles.text, textStyle]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default GradientButton; 