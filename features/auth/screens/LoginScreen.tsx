/**
 * @file features/auth/screens/LoginScreen.tsx
 * @description Login-Screen mit vollständigem Theme-Support und i18n-Integration
 */
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {View, StyleSheet, Text, TouchableOpacity, Platform, Alert, ActivityIndicator} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { BuildInfoDisplay } from '@/features/build';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { logger } from '@/utils/logger';
import { getStorageService } from '@/utils/service/serviceHelper';


import { AuthContainer } from '../components/AuthContainer';
import { AuthFormField } from '../components/AuthFormField';

// Debug-Flag für die Entwicklung
const DEBUG_MODE = false;

// Styles für die Komponente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  form: {
    marginBottom: spacing.s,
  },
  loginButton: {
    width: '100%',
    paddingVertical: spacing.m,
    borderRadius: 8,
    marginTop: spacing.m,
  },
  loginButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: typography.fontSize.m,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    padding: spacing.xs,
    marginTop: spacing.xxs,
    marginBottom: spacing.s,
  },
  forgotPasswordText: {
    textAlign: 'right',
    fontSize: typography.fontSize.s,
    marginTop: spacing.s,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.m,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.l,
  },
  dividerText: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    paddingHorizontal: spacing.m,
    backgroundColor: '#fff',
    fontSize: typography.fontSize.s,
  },
  googleButton: {
    width: '100%',
    paddingVertical: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    marginRight: spacing.s,
  },
  googleButtonText: {
    marginLeft: spacing.s,
    fontWeight: '500',
    fontSize: typography.fontSize.m,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.l,
  },
  footerText: {
    textAlign: 'center',
    fontSize: typography.fontSize.m,
    marginTop: spacing.xl,
  },
  link: {
    fontWeight: 'bold',
  },
  demoButton: {
    marginTop: spacing.m,
    borderWidth: 1,
    padding: spacing.s,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: typography.fontSize.s,
  },
  devButtonsContainer: {
    marginTop: spacing.s,
  },
  devButton: {
    marginTop: spacing.xs,
    padding: spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  devButtonText: {
    color: 'white',
    fontSize: typography.fontSize.s,
  }
});

/**
 * LoginScreen - Anmeldebildschirm mit Theme-Unterstützung und i18n
 * @returns JSX.Element
 */
export function LoginScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();
  
  // Debug: Aktualisiere die Komponente alle 500ms, wenn Debug-Modus aktiv ist
  useEffect(() => {
    if (DEBUG_MODE) {
      const interval = setInterval(() => {
        console.log('Forciere Re-Render für i18n-Debug...');
        setRefreshKey(old => old + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);
  
  // Auth-Hook für Login-Funktionalität
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();
  
  // Lokaler State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Für erzwungenes Re-Rendering
  
  // Stellt sicher, dass die Übersetzung korrekt geladen ist
  const translations = useMemo(() => {
    return {
      title: "Anmelden",
      subtitle: "Melden Sie sich an, um auf Ihr Konto zuzugreifen",
      email: "E-Mail",
      password: "Passwort",
      forgotPassword: "Passwort vergessen?",
      loginButton: "Anmelden",
      orText: "Oder",
      googleLogin: "Mit Google anmelden",
      noAccount: "Noch kein Konto?",
      createAccount: "Registrieren",
      emailPlaceholder: "Ihre E-Mail-Adresse",
      passwordPlaceholder: "Ihr Passwort",
      error: "Fehler",
      success: "Erfolg",
      demoDataButton: "Demo-Daten einfügen",
      clearStorageButton: "Speicher löschen",
      storageClearedSuccess: "Speicher erfolgreich gelöscht",
      storageClearError: "Fehler beim Löschen des Speichers"
    };
  }, []);
  
  // Memoized Styles
  const dynamicStyles = useMemo(() => ({
    loginButton: {
      ...styles.loginButton,
      backgroundColor: colors.primary,
    },
    loginButtonText: {
      ...styles.loginButtonText,
      color: colors.ui.buttonText,
    },
    forgotPasswordText: {
      ...styles.forgotPasswordText,
      color: colors.primary,
    },
    divider: {
      ...styles.divider,
      backgroundColor: colors.divider,
    },
    dividerText: {
      ...styles.dividerText,
      color: colors.textSecondary,
    },
    googleButton: {
      ...styles.googleButton,
      borderColor: colors.divider,
      backgroundColor: colors.backgroundSecondary,
    },
    googleButtonText: {
      ...styles.googleButtonText,
      color: colors.textPrimary,
    },
    footerText: {
      ...styles.footerText,
      color: colors.textSecondary,
    },
    link: {
      ...styles.link,
      color: colors.primary,
    },
    demoButton: {
      ...styles.demoButton,
      borderColor: colors.primary,
    },
    demoButtonText: {
      ...styles.demoButtonText,
      color: colors.primary,
    },
    devButton: {
      ...styles.devButton,
      backgroundColor: colors.error,
    },
    devButtonText: {
      color: '#FFFFFF',
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      fontSize: 14,
    },
  }), [colors]);
  
  // Handler für Login-Funktion
  const handleLogin = useCallback(async () => {
    if (localLoading) return;
    
    // Fehler beim erneuten Submit löschen
    if (authError) {
      clearError();
    }
    
    if (!email) {
      Alert.alert(translations.error, 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
      return;
    }
    
    if (!password) {
      Alert.alert(translations.error, 'Bitte geben Sie Ihr Passwort ein.');
      return;
    }
    
    setLocalLoading(true);
    
    try {
      logger.debug('Login-Prozess gestartet');
      const success = await login(email, password);
      
      if (success) {
        // Hinweis: Die Mode-Setzung erfolgt jetzt zentral im Auth-Service
        
        // Bereinige temporären Storage
        const storageService = getStorageService();
        await storageService.cleanupStorage();
        
        logger.debug('Navigiere zur Hauptseite');
        router.replace('/(tabs)/home');
      } else {
        setLocalLoading(false);
        logger.debug('Login fehlgeschlagen');
      }
    } catch (err) {
      logger.error("Login-Fehler:", err instanceof Error ? err.message : String(err));
      Alert.alert(translations.error, 'Ein unerwarteter Fehler ist aufgetreten.');
      setLocalLoading(false);
    }
  }, [email, password, localLoading, login, router, authError, clearError, translations]);
  
  // Demo-Daten einfügen
  const fillDemoData = useCallback(() => {
    setEmail('alexander@beckerundpartner.de');
    setPassword('demo123');
  }, []);
  
  // Handler für Google-Login (Demo)
  const handleGoogleLogin = useCallback(async () => {
    if (googleLoading) return;
    
    // Fehler beim erneuten Submit löschen
    if (authError) {
      clearError();
    }
    
    setGoogleLoading(true);
    
    try {
      // Demo-Login ausführen
      const success = await login('alexander@beckerundpartner.de', 'demo123');
      
      if (success) {
        // Hinweis: Die Mode-Setzung erfolgt jetzt zentral im Auth-Service
        
        // Bereinige temporären Storage
        const storageService = getStorageService();
        await storageService.cleanupStorage();
        
        router.replace('/(tabs)/home');
      } else {
        setGoogleLoading(false);
      }
    } catch (error) {
      logger.error('Google login error:', error instanceof Error ? error.message : String(error));
      Alert.alert(
        translations.error, 
        'Bei der Anmeldung mit Google ist ein Fehler aufgetreten'
      );
      setGoogleLoading(false);
    }
  }, [googleLoading, login, router, authError, clearError, translations]);
  
  // Handler für Passwort-Vergessen-Funktion
  const handleForgotPassword = useCallback(() => {
    router.push('/(auth)/forgot-password');
  }, [router]);
  
  // Footer für den Container
  const footer = useMemo(() => (
    <View style={styles.footer}>
      <Text style={dynamicStyles.footerText}>
        {translations.noAccount}{' '}
        <Link href="/(auth)/register" asChild>
          <Text style={dynamicStyles.link}>
            {translations.createAccount}
          </Text>
        </Link>
      </Text>
      
      <TouchableOpacity
        style={dynamicStyles.demoButton}
        onPress={fillDemoData}
        disabled={localLoading || googleLoading}
        accessibilityLabel="Demo-Daten einfügen"
        accessibilityRole="button"
        accessibilityHint="Füllt die Formularfelder mit Testdaten"
      >
        <Text style={dynamicStyles.demoButtonText}>
          {translations.demoDataButton}
        </Text>
      </TouchableOpacity>
      
      {/* Debug-Button im Entwicklungsmodus */}
      {__DEV__ && (
        <View style={styles.devButtonsContainer}>
          <TouchableOpacity
            style={dynamicStyles.devButton}
            onPress={() => {
              const storageService = getStorageService();
              storageService.cleanupStorage();
            }}
            accessibilityLabel="Speicher löschen"
            accessibilityRole="button"
          >
            <Text style={dynamicStyles.devButtonText}>
              {translations.clearStorageButton}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  ), [dynamicStyles, fillDemoData, localLoading, googleLoading, translations]);
  
  // Fehlermeldung
  const errorMessage = authError ? authError.message : undefined;
  
  return (
    <View style={styles.container}>
      <BuildInfoDisplay />
      
      <AuthContainer
        title={translations.title}
        subtitle={translations.subtitle}
        error={errorMessage}
        footer={footer}
      >
        <View style={styles.form}>
          <AuthFormField
            value={email}
            onChangeText={setEmail}
            placeholder={translations.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete={Platform.OS === 'web' ? 'email' : 'email'}
            textContentType="emailAddress"
            accessibilityLabel={translations.email}
          />
          
          <AuthFormField
            value={password}
            onChangeText={setPassword}
            placeholder={translations.passwordPlaceholder}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={Platform.OS === 'web' ? 'current-password' : 'password'}
            textContentType="password"
            accessibilityLabel={translations.password}
          />
          
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            accessibilityLabel={translations.forgotPassword}
            accessibilityRole="button"
          >
            <Text style={dynamicStyles.forgotPasswordText}>
              {translations.forgotPassword}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={dynamicStyles.loginButton}
          onPress={handleLogin}
          disabled={localLoading}
          accessibilityLabel={translations.loginButton}
          accessibilityRole="button"
          accessibilityState={{ disabled: localLoading, busy: localLoading }}
        >
          {localLoading ? (
            <ActivityIndicator color={colors.ui.buttonText} size="small" />
          ) : (
            <Text style={dynamicStyles.loginButtonText}>
              {translations.loginButton}
            </Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={dynamicStyles.divider} />
          <Text style={dynamicStyles.dividerText}>{translations.orText}</Text>
        </View>
        
        <TouchableOpacity
          style={dynamicStyles.googleButton}
          onPress={handleGoogleLogin}
          disabled={googleLoading}
          accessibilityLabel={translations.googleLogin}
          accessibilityRole="button"
          accessibilityState={{ disabled: googleLoading, busy: googleLoading }}
        >
          {googleLoading ? (
            <ActivityIndicator color={colors.textPrimary} size="small" />
          ) : (
            <>
              <FontAwesome
                style={styles.googleIcon}
                name="google"
                size={16}
                color={colors.textPrimary}
              />
              <Text style={dynamicStyles.googleButtonText}>
                {translations.googleLogin}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </AuthContainer>
    </View>
  );
} 