/**
 * @file features/auth/components/AuthButton.tsx
 * @description Wiederverwendbare Button-Komponente für Authentifizierungs-Screens
 */
import { useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';

export interface AuthButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  primary?: boolean;
  outline?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * AuthButton - Wiederverwendbare Button-Komponente für Authentifizierungs-Aktionen
 * 
 * Zeigt einen Button mit optimierten Styles an, der Ladezustände verwalten kann.
 * Unterstützt primäre und Outline-Styles durch Props.
 * @param props Komponenten-Props
 * @returns JSX.Element
 */
export function AuthButton({
  onPress,
  title,
  isLoading = false,
  disabled = false,
  primary = true,
  outline = false,
  containerStyle,
  textStyle,
}: AuthButtonProps) {
  const colors = useThemeColor();

  // Optimierte Styles mit useMemo
  const computedStyles = useMemo(() => {
    // Basis-Styles basierend auf Variante
    const baseContainerStyle = [
      styles.container,
      containerStyle
    ];
    
    const baseTextStyle = [
      styles.text,
      textStyle
    ];
    
    // Entscheide welcher Stil verwendet wird (primary, outline oder disabled)
    if (disabled || isLoading) {
      return {
        container: [
          ...baseContainerStyle,
          {
            backgroundColor: primary ? '#CCCCCC' : 'transparent',
            borderColor: colors.divider,
            borderWidth: outline ? 1 : 0,
            opacity: 0.7
          }
        ],
        text: [
          ...baseTextStyle,
          {
            color: primary 
              ? '#666666'
              : outline 
                ? '#666666'
                : colors.textSecondary
          }
        ]
      };
    }
    
    return {
      container: [
        ...baseContainerStyle,
        {
          backgroundColor: primary ? colors.primary : 'transparent',
          borderColor: outline ? colors.primary : 'transparent',
          borderWidth: outline ? 1 : 0,
        }
      ],
      text: [
        ...baseTextStyle,
        {
          color: primary 
            ? colors.backgroundPrimary
            : outline 
              ? colors.primary 
              : colors.textPrimary
        }
      ]
    };
  }, [
    colors, 
    primary, 
    outline, 
    disabled, 
    isLoading, 
    containerStyle, 
    textStyle
  ]);
  
  return (
    <TouchableOpacity
      style={computedStyles.container}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={primary ? colors.backgroundPrimary : colors.primary} 
          size="small" 
        />
      ) : (
        <Text style={computedStyles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  text: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold,
  },
}); 