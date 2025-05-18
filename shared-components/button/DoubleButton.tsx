import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

// Typ für Ionicons name-Property
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface DoubleButtonProps {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryPress: (() => void) | undefined;
  onSecondaryPress: (() => void) | undefined;
  primaryIcon?: string;
  secondaryIcon?: string;
  containerStyle?: StyleProp<ViewStyle>;
  primaryButtonStyle?: StyleProp<ViewStyle>;
  secondaryButtonStyle?: StyleProp<ViewStyle>;
  primaryTextStyle?: StyleProp<TextStyle>;
  secondaryTextStyle?: StyleProp<TextStyle>;
  primaryAccessibilityLabel?: string;
  secondaryAccessibilityLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
  disabled?: boolean;
}

/**
 * Eine Komponente, die zwei Buttons nebeneinander anzeigt, ideal für Haupt- und Nebenaktionen.
 * @param root0
 * @param root0.primaryLabel
 * @param root0.secondaryLabel
 * @param root0.onPrimaryPress
 * @param root0.onSecondaryPress
 * @param root0.primaryIcon
 * @param root0.secondaryIcon
 * @param root0.containerStyle
 * @param root0.primaryButtonStyle
 * @param root0.secondaryButtonStyle
 * @param root0.primaryTextStyle
 * @param root0.secondaryTextStyle
 * @param root0.primaryAccessibilityLabel
 * @param root0.secondaryAccessibilityLabel
 * @param root0.primaryColor
 * @param root0.secondaryColor
 * @param root0.disabled
 */
export function DoubleButton({
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
  primaryIcon,
  secondaryIcon,
  containerStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  primaryTextStyle,
  secondaryTextStyle,
  primaryAccessibilityLabel,
  secondaryAccessibilityLabel,
  primaryColor,
  secondaryColor,
  disabled = false
}: DoubleButtonProps) {
  const colors = useThemeColor();

  // Kombinierte Styles
  const containerStyles = [
    styles.container,
    containerStyle
  ];

  const primaryButtonStyles = [
    styles.button,
    styles.primaryButton,
    { backgroundColor: primaryColor || colors.ui.buttonBackground },
    disabled && { opacity: 0.5 },
    primaryButtonStyle
  ];

  const secondaryButtonStyles = [
    styles.button,
    styles.secondaryButton,
    { 
      borderColor: secondaryColor || colors.primary,
      borderWidth: ui.border.normal,
    },
    disabled && { opacity: 0.5 },
    secondaryButtonStyle
  ];

  const primaryTextStyles = [
    styles.buttonText,
    { color: colors.ui.buttonText },
    primaryTextStyle
  ];

  const secondaryTextStyles = [
    styles.buttonText,
    { color: secondaryColor || colors.primary },
    secondaryTextStyle
  ];

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    }
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    }
  };

  return (
    <View style={containerStyles}>
      {/* Primärer Button */}
      <TouchableOpacity
        style={primaryButtonStyles}
        onPress={handlePrimaryPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={primaryAccessibilityLabel || primaryLabel}
      >
        {primaryIcon && (
          <Ionicons
            name={primaryIcon as IoniconsName}
            size={18}
            color={colors.ui.buttonText}
            style={{ marginRight: spacing.xs }}
          />
        )}
        <Text style={primaryTextStyles}>
          {primaryLabel}
        </Text>
      </TouchableOpacity>

      {/* Sekundärer Button */}
      <TouchableOpacity
        style={secondaryButtonStyles}
        onPress={handleSecondaryPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={secondaryAccessibilityLabel || secondaryLabel}
      >
        {secondaryIcon && (
          <Ionicons
            name={secondaryIcon as IoniconsName}
            size={18}
            color={secondaryColor || colors.primary}
            style={{ marginRight: spacing.xs }}
          />
        )}
        <Text style={secondaryTextStyles}>
          {secondaryLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  button: {
    borderRadius: ui.borderRadius.m,
    paddingVertical: spacing.s - 2,
    paddingHorizontal: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    ...ui.shadow.light,
    height: 38,
  },
  primaryButton: {
    marginRight: spacing.m,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as TextStyle['fontWeight'],
  }
}); 