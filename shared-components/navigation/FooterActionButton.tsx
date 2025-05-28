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
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GradientButton } from '@/shared-components/button';
import { buttonGradients } from '@/config/theme/buttons';

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
  useGradient?: boolean;
  gradientColors?: [string, string];
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
  useGradient = false,
  gradientColors = ['#1E6B55', '#165A48'],
}: FooterActionButtonProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  
  // Container Style mit verbessertem Design
  const containerStyle = [
    styles.container, 
    { 
      paddingBottom: insets.bottom + spacing.m,
      backgroundColor: colors.backgroundPrimary,
    },
    style
  ];

  // Die Icon-Komponente und Name korrekt konvertieren
  const getIconName = (): keyof typeof Ionicons.glyphMap | undefined => {
    if (!icon) return undefined;
    if (iconLibrary === 'ionicons') {
      return icon as keyof typeof Ionicons.glyphMap;
    }
    return undefined;
  };

  // Wenn Material Community Icons verwendet werden, rendern wir einen benutzerdefinierten Button
  if (iconLibrary === 'material-community' && icon) {
    return (
      <View style={containerStyle} accessible={true} accessibilityRole="none">
        <TouchableOpacity 
          style={[
            styles.button,
            !useGradient && { 
              backgroundColor: backgroundColor || '#1E6B55',
              opacity: disabled ? 0.5 : 1,
            },
            buttonStyle
          ]}
          onPress={onPress}
          disabled={disabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          activeOpacity={0.8}
        >
          {useGradient ? (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.gradientButton,
                { 
                  opacity: disabled ? 0.5 : 1,
                }
              ]}
            >
              <View style={styles.buttonContent}>
                {iconPosition === 'left' && (
                  <MaterialCommunityIcons 
                    name={icon as MaterialCommunityIconsName} 
                    size={20} 
                    color={textColor || '#FFFFFF'} 
                    style={styles.iconLeft} 
                  />
                )}
                <Text style={[
                  styles.buttonText, 
                  { color: textColor || '#FFFFFF' },
                  textStyle
                ]}>
                  {label}
                </Text>
                {iconPosition === 'right' && (
                  <MaterialCommunityIcons 
                    name={icon as MaterialCommunityIconsName} 
                    size={20} 
                    color={textColor || '#FFFFFF'} 
                    style={styles.iconRight} 
                  />
                )}
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.buttonContent}>
              {iconPosition === 'left' && (
                <MaterialCommunityIcons 
                  name={icon as MaterialCommunityIconsName} 
                  size={20} 
                  color={textColor || '#FFFFFF'} 
                  style={styles.iconLeft} 
                />
              )}
              <Text style={[
                styles.buttonText, 
                { color: textColor || '#FFFFFF' },
                textStyle
              ]}>
                {label}
              </Text>
              {iconPosition === 'right' && (
                <MaterialCommunityIcons 
                  name={icon as MaterialCommunityIconsName} 
                  size={20} 
                  color={textColor || '#FFFFFF'} 
                  style={styles.iconRight} 
                />
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // Für Ionicons und Standard-Buttons verwenden wir GradientButton
  return (
    <View style={containerStyle} accessible={true} accessibilityRole="none">
      <TouchableOpacity 
        style={[
          styles.button,
          !useGradient && { 
            backgroundColor: backgroundColor || '#1E6B55',
            opacity: disabled ? 0.5 : 1,
          },
          buttonStyle
        ]}
        onPress={onPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        activeOpacity={0.8}
      >
        {useGradient ? (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.gradientButton,
              { 
                opacity: disabled ? 0.5 : 1,
              }
            ]}
          >
            <View style={styles.buttonContent}>
              {iconPosition === 'left' && icon && (
                <Ionicons 
                  name={icon as IoniconsName} 
                  size={20} 
                  color={textColor || '#FFFFFF'} 
                  style={styles.iconLeft} 
                />
              )}
              <Text style={[
                styles.buttonText, 
                { color: textColor || '#FFFFFF' },
                textStyle
              ]}>
                {label}
              </Text>
              {iconPosition === 'right' && icon && (
                <Ionicons 
                  name={icon as IoniconsName} 
                  size={20} 
                  color={textColor || '#FFFFFF'} 
                  style={styles.iconRight} 
                />
              )}
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.buttonContent}>
            {iconPosition === 'left' && icon && (
              <Ionicons 
                name={icon as IoniconsName} 
                size={20} 
                color={textColor || '#FFFFFF'} 
                style={styles.iconLeft} 
              />
            )}
            <Text style={[
              styles.buttonText, 
              { color: textColor || '#FFFFFF' },
              textStyle
            ]}>
              {label}
            </Text>
            {iconPosition === 'right' && icon && (
              <Ionicons 
                name={icon as IoniconsName} 
                size={20} 
                color={textColor || '#FFFFFF'} 
                style={styles.iconRight} 
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Konstanten für Styles
const BUTTON_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 16,
    shadowColor: '#1E6B55',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  gradientButton: {
    height: BUTTON_HEIGHT,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: spacing.s,
  },
  iconRight: {
    marginLeft: spacing.s,
  },
}); 