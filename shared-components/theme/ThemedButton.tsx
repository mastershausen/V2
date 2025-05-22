import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  ActivityIndicator,
 useColorScheme } from 'react-native';


import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedText } from './ThemedText';

// Typ für Ionicons name Property
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export type ThemedButtonProps = TouchableOpacityProps & {
  label?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  lightColor?: string;
  darkColor?: string;
  textColor?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
};

/**
 * Wiederverwendbare Button-Komponente mit Theme-Unterstützung
 * @param root0
 * @param root0.label
 * @param root0.onPress
 * @param root0.variant
 * @param root0.size
 * @param root0.lightColor
 * @param root0.darkColor
 * @param root0.textColor
 * @param root0.icon
 * @param root0.iconPosition
 * @param root0.isLoading
 * @param root0.style
 * @param root0.textStyle
 * @param root0.children
 * @param root0.disabled
 */
export function ThemedButton({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  lightColor,
  darkColor,
  textColor,
  icon,
  iconPosition = 'left',
  isLoading = false,
  style,
  textStyle,
  children,
  disabled,
  ...rest
}: ThemedButtonProps) {
  const colors = useThemeColor();
  const colorScheme = useColorScheme() ?? 'light';
  
  // Größe des Buttons festlegen
  let buttonHeight: number;
  let buttonPadding: number;
  let fontSize: number;
  let iconSize: number;
  
  switch (size) {
    case 'small':
      buttonHeight = 36;
      buttonPadding = spacing.s;
      fontSize = typography.fontSize.s;
      iconSize = ui.icon.small;
      break;
    case 'large':
      buttonHeight = 54;
      buttonPadding = spacing.l;
      fontSize = typography.fontSize.l;
      iconSize = ui.icon.large;
      break;
    case 'medium':
    default:
      buttonHeight = 44;
      buttonPadding = spacing.m;
      fontSize = typography.fontSize.m;
      iconSize = ui.icon.medium;
      break;
  }
  
  // Hintergrund- und Textfarbe je nach Variante festlegen
  let backgroundColor: string;
  let buttonTextColor: string;
  let borderWidth = 0;
  let borderColor: string | undefined;
  
  // Wenn spezifische Farben übergeben wurden, verwende diese
  if (lightColor || darkColor) {
    backgroundColor = colorScheme === 'dark' ? (darkColor || colors.primary) : (lightColor || colors.primary);
  } else {
    switch (variant) {
      case 'secondary':
        backgroundColor = colors.primary;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderWidth = ui.border.normal;
        borderColor = colors.primary;
        break;
      case 'text':
        backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        backgroundColor = colors.primary;
        break;
    }
  }
  
  // Textfarbe festlegen
  if (textColor) {
    buttonTextColor = textColor;
  } else {
    switch (variant) {
      case 'outline':
      case 'text':
        buttonTextColor = colors.primary;
        break;
      case 'primary':
      case 'secondary':
      default:
        buttonTextColor = '#FFFFFF'; // Weiß für besseren Kontrast auf farbigen Hintergründen
        break;
    }
  }
  
  // Deaktivierter Zustand
  if (disabled) {
    backgroundColor = colors.ui.disabledBackground;
    buttonTextColor = colors.ui.disabledText;
    borderColor = colors.ui.disabledBackground;
  }
  
  // Kombinierte Styles
  const buttonStyles = [
    styles.button,
    {
      backgroundColor,
      height: buttonHeight,
      paddingHorizontal: buttonPadding,
      borderWidth,
      borderColor,
      borderRadius: ui.borderRadius.m,
      opacity: disabled ? ui.opacity.disabled : ui.opacity.active,
    },
    style,
  ];
  
  // Text-Styles
  const labelStyles = [
    styles.label,
    {
      color: buttonTextColor,
      fontSize,
    },
    textStyle,
  ];
  
  // Abstand zwischen Icon und Text
  const iconSpacing = spacing.xs;
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={buttonTextColor} />
      ) : (
        <>
          {children || (
            <>
              {icon && iconPosition === 'left' && (
                <Ionicons
                  name={icon as IoniconsName}
                  size={iconSize}
                  color={buttonTextColor}
                  style={{ marginRight: label ? iconSpacing : 0 }}
                />
              )}
              
              {label && (
                <ThemedText style={labelStyles}>
                  {label}
                </ThemedText>
              )}
              
              {icon && iconPosition === 'right' && (
                <Ionicons
                  name={icon as IoniconsName}
                  size={iconSize}
                  color={buttonTextColor}
                  style={{ marginLeft: label ? iconSpacing : 0 }}
                />
              )}
            </>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...ui.shadow.light,
  },
  label: {
    fontWeight: typography.fontWeight.semiBold as TextStyle['fontWeight'],
  },
}); 