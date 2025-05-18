/**
 * @file features/auth/components/AuthContainer.tsx
 * @description Container-Komponente für alle Auth-Screens mit einheitlichem Layout und vollständigem Theme-Support
 */
import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';

export interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  error?: string;
  footer?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

/**
 * AuthContainer - Container-Komponente für Auth-Screens mit vollständigem Theme-Support
 * 
 * Stellt ein einheitliches Layout für alle Auth-Screens bereit mit
 * Keyboard-Vermeidung, Scrolling und standardisiertem Header.
 * @param props Komponenten-Props
 * @returns JSX.Element
 */
export function AuthContainer({
  children,
  title,
  subtitle,
  error,
  footer,
  contentContainerStyle,
  titleStyle,
  subtitleStyle,
}: AuthContainerProps) {
  const colors = useThemeColor();
  
  // Memoized styles mit Theme-Farben
  const dynamicStyles = useMemo(() => ({
    container: {
      ...styles.container,
      backgroundColor: colors.backgroundPrimary,
    },
    title: [
      styles.title,
      { color: colors.textPrimary },
      titleStyle
    ],
    subtitle: [
      styles.subtitle,
      { color: colors.textSecondary },
      subtitleStyle
    ],
    content: [
      styles.content,
      contentContainerStyle
    ],
    errorContainer: {
      ...styles.errorContainer,
      backgroundColor: `${colors.error}20`, // 20% Transparenz
    },
    errorText: {
      ...styles.errorText,
      color: colors.error,
    },
    footer: styles.footer,
  }), [colors, titleStyle, subtitleStyle, contentContainerStyle]);

  // Handler zum Ausblenden der Tastatur
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  
  // StatusBar-Stil basierend auf dem Farbschema
  const statusBarStyle = useMemo(() => {
    return colors.backgroundPrimary === '#FFFFFF' ? 'dark' : 'light';
  }, [colors.backgroundPrimary]);
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={dynamicStyles.container}
      accessibilityRole="none"
    >
      <StatusBar style={statusBarStyle} />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={dynamicStyles.content}>
            <Text 
              style={dynamicStyles.title}
              accessibilityRole="header"
            >
              {title}
            </Text>
            
            {subtitle && (
              <Text 
                style={dynamicStyles.subtitle}
                accessibilityRole="text"
              >
                {subtitle}
              </Text>
            )}
            
            {error && (
              <View 
                style={dynamicStyles.errorContainer}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                <Text style={dynamicStyles.errorText}>{error}</Text>
              </View>
            )}
            
            {children}
            
            {footer && (
              <View style={dynamicStyles.footer}>
                {footer}
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Statische Stile ohne Farben
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? spacing.xxl + spacing.xl : spacing.xl, // 60px oder 40px
  },
  content: {
    flex: 1,
    padding: spacing.l,
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.m,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorContainer: {
    padding: spacing.m,
    borderRadius: spacing.s,
    marginBottom: spacing.m,
  },
  errorText: {
    fontSize: typography.fontSize.m,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
}); 