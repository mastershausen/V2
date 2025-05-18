/**
 * @file features/auth/components/AuthFormField.tsx
 * @description Wiederverwendbare Formularfeld-Komponente für Authentifizierungs-Screens mit vollständigem Theme-Support
 */
import { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';

export interface AuthFormFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  showErrors?: boolean;
}

/**
 * AuthFormField - Wiederverwendbare Formularfeld-Komponente für die Authentifizierung
 * 
 * Verwendet useMemo für optimierte Styles und zeigt ein standardisiertes Layout für alle
 * Authentifizierungs-Eingabefelder mit Labels und Fehleranzeige.
 * @param props Komponenten-Props, erweitert die standard TextInput-Props
 * @returns JSX.Element
 */
export function AuthFormField({
  label,
  error,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  showErrors = true,
  ...inputProps
}: AuthFormFieldProps) {
  const colors = useThemeColor();
  
  // Dynamische Theme-bezogene Styles mit useMemo
  const dynamicStyles = useMemo(() => ({
    container: [
      styles.container,
      containerStyle
    ],
    inputContainer: [
      styles.inputContainer,
      {
        borderColor: error ? colors.error : colors.divider,
        backgroundColor: colors.backgroundSecondary
      },
      inputContainerStyle
    ],
    input: [
      styles.input,
      {
        color: colors.textPrimary,
      },
      inputStyle
    ],
    label: [
      styles.label,
      {
        color: colors.textSecondary
      },
      labelStyle
    ],
    error: [
      styles.error,
      {
        color: colors.error
      },
      errorStyle
    ]
  }), [colors, error, containerStyle, inputContainerStyle, inputStyle, labelStyle, errorStyle]);
  
  // Memoizierte Platzhalterfarbe
  const placeholderColor = useMemo(() => colors.textTertiary, [colors.textTertiary]);
  
  // Optimierter Render der Fehleranzeige
  const renderError = useCallback(() => {
    if (showErrors && error) {
      return (
        <Text 
          style={dynamicStyles.error}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      );
    }
    return null;
  }, [showErrors, error, dynamicStyles.error]);
  
  return (
    <View 
      style={dynamicStyles.container}
      accessibilityRole="none"
    >
      {label ? (
        <Text 
          style={dynamicStyles.label}
          accessibilityRole="text"
        >
          {label}
        </Text>
      ) : null}
      <View style={dynamicStyles.inputContainer}>
        <TextInput
          style={dynamicStyles.input}
          placeholderTextColor={placeholderColor}
          accessibilityRole="text"
          importantForAccessibility="yes"
          {...inputProps}
        />
      </View>
      {renderError()}
    </View>
  );
}

// Statische Stile ohne Farben
const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: spacing.s,
  },
  input: {
    height: spacing.xxl + 2, // 50px
    paddingHorizontal: spacing.m,
    fontSize: typography.fontSize.m,
  },
  label: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.xs,
  },
  error: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
}); 