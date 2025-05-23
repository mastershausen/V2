import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

// Typ für Ionicons name Property
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
type MaterialCommunityIconsName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface FooterActionButtonProps {
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  icon?: string;
  iconLibrary?: 'ionicons' | 'material-community';
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Footer-Aktionsbutton, der am unteren Bildschirmrand angezeigt wird
 * @param {object} root0 - Die Komponentenprops
 * @param {string} root0.label - Der anzuzeigende Text des Buttons
 * @param {Function} root0.onPress - Callback-Funktion, die beim Klick ausgeführt wird
 * @param {string} [root0.backgroundColor] - Optional, benutzerdefinierte Hintergrundfarbe
 * @param {string} [root0.textColor] - Optional, benutzerdefinierte Textfarbe
 * @param {string} [root0.icon] - Optional, Name des anzuzeigenden Icons
 * @param {string} [root0.iconPosition] - Optional, Position des Icons ('left' oder 'right')
 * @param {boolean} [root0.disabled] - Optional, ob der Button deaktiviert ist
 * @param {StyleProp<ViewStyle>} [root0.style] - Optional, benutzerdefinierte Styles für den Container
 * @param {StyleProp<ViewStyle>} [root0.buttonStyle] - Optional, benutzerdefinierte Styles für den Button
 * @param {StyleProp<TextStyle>} [root0.textStyle] - Optional, benutzerdefinierte Styles für den Text
 * @returns {React.ReactElement} Die gerenderte FooterActionButton-Komponente
 */
export function FooterActionButton({
  label,
  onPress,
  backgroundColor,
  textColor,
  icon,
  iconLibrary = 'ionicons',
  iconPosition = 'left',
  disabled = false,
  style,
  buttonStyle,
  textStyle,
}: FooterActionButtonProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  
  // Dynamische Farben basierend auf Props oder Theme
  const getBgColor = () => {
    if (disabled) return colors.ui.disabledBackground;
    return backgroundColor || colors.ui.buttonBackground;
  };
  
  const getTextColor = () => {
    if (disabled) return colors.ui.disabledText;
    return textColor || colors.ui.buttonText;
  };

  // Kombinierte Styles für Container, Button und Text
  const containerStyles = [
    styles.container, 
    { borderTopColor: colors.divider },
    style
  ];
  
  const buttonStyles = [
    styles.button,
    { 
      backgroundColor: getBgColor(),
      opacity: disabled ? ui.opacity.disabled : ui.opacity.active,
      borderRadius: ui.borderRadius.m,
    },
    buttonStyle
  ];
  
  const textStyles = [
    styles.buttonText, 
    { color: getTextColor() },
    textStyle
  ];
  
  const iconColor = getTextColor();
  const iconSpacing = spacing.xs;

  // Icon-Renderer basierend auf der gewählten Library
  const renderIcon = (position: 'left' | 'right') => {
    if (!icon) return null;
    
    const marginStyle = position === 'left' 
      ? { marginRight: iconSpacing } 
      : { marginLeft: iconSpacing };
    
    if (iconLibrary === 'material-community') {
      return (
        <MaterialCommunityIcons 
          name={icon as MaterialCommunityIconsName} 
          size={ui.icon.medium} 
          color={iconColor} 
          style={[
            position === 'left' ? styles.iconLeft : styles.iconRight, 
            marginStyle
          ]} 
        />
      );
    } else {
      return (
        <Ionicons 
          name={icon as IoniconsName} 
          size={ui.icon.medium} 
          color={iconColor} 
          style={[
            position === 'left' ? styles.iconLeft : styles.iconRight, 
            marginStyle
          ]} 
        />
      );
    }
  };

  return (
    <View style={containerStyles} accessible={true} accessibilityRole="none">
      <TouchableOpacity 
        style={buttonStyles}
        onPress={onPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
      >
        {iconPosition === 'left' && renderIcon('left')}
        
        <Text style={textStyles}>
          {label}
        </Text>
        
        {iconPosition === 'right' && renderIcon('right')}
      </TouchableOpacity>
    </View>
  );
}

// Konstanten für Styles
const BUTTON_HEIGHT = 50;

const styles = StyleSheet.create({
  container: {
    padding: spacing.m,
    borderTopWidth: ui.border.normal,
    backgroundColor: 'transparent',
  },
  button: {
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...ui.shadow.light,
  },
  buttonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'],
  },
  iconLeft: {
    // Margin wird dynamisch angewendet
  },
  iconRight: {
    // Margin wird dynamisch angewendet
  },
}); 