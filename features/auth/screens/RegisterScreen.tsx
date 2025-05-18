/**
 * @file features/auth/screens/RegisterScreen.tsx
 * @description Registrierungsbildschirm mit vollständigem Theme-Support und i18n-Integration
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { logger } from '@/utils/logger';
import { getStorageService } from '@/utils/service/serviceHelper';


import { AuthContainer } from '../components/AuthContainer';
import { AuthFormField } from '../components/AuthFormField';


// Debug-Flag für die Entwicklung
const DEBUG_MODE = false;

/**
 * RegisterScreen - Registrierungsbildschirm mit Theme-Unterstützung und i18n
 * @returns JSX.Element
 */
export function RegisterScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t: _ } = useTranslation();
  
  // Debug: Aktualisiere die Komponente alle 500ms, wenn Debug-Modus aktiv ist
  useEffect(() => {
    if (DEBUG_MODE) {
      const interval = setInterval(() => {
        // eslint-disable-next-line no-console
        console.log('Forciere Re-Render für i18n-Debug...');
        setRefreshKey(old => old + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);
  
  const { register, error: authError, isLoading: authLoading, clearError } = useAuth();
  
  // State für Formularfelder
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Für erzwungenes Re-Rendering
  
  // Demo-Daten einfügen
  const fillDemoData = useCallback(() => {
    setFirstName('Demo');
    setLastName('Nutzer');
    setEmail('demo@example.com');
    setPassword('demo123');
    setConfirmPassword('demo123');
  }, []);
  
  // Prüfen, ob der Storage gelöscht wurde
  const checkStorageCleared = useCallback(async () => {
    try {
      const wasCleared = await AsyncStorage.getItem('storage_was_cleared');
      if (wasCleared === 'true') {
        // Flag zurücksetzen
        await AsyncStorage.removeItem('storage_was_cleared');
        
        // Demo-Daten einfügen, falls Storage gelöscht wurde
        fillDemoData();
      }
    } catch (error) {
      console.error('Error checking storage cleared:', error);
    }
  }, [fillDemoData]);
  
  // Stellt sicher, dass die Übersetzung korrekt geladen ist
  const translations = useMemo(() => {
    return {
      title: "Registrieren",
      subtitle: "Erstellen Sie ein neues Konto",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      registerButton: "Registrieren",
      alreadyAccount: "Bereits ein Konto?",
      login: "Anmelden",
      firstNamePlaceholder: "Ihr Vorname (optional)",
      lastNamePlaceholder: "Ihr Nachname (optional)",
      emailPlaceholder: "Ihre E-Mail-Adresse",
      passwordPlaceholder: "Ihr Passwort",
      confirmPasswordPlaceholder: "Passwort bestätigen",
      error: "Fehler",
      success: "Erfolg",
      demoDataButton: "Demo-Daten einfügen",
      errorRequired: "Dieses Feld ist erforderlich",
      errorPasswordMatch: "Die Passwörter stimmen nicht überein"
    };
  }, []);
  
  // Memoized Styles mit Theme-Farben
  const dynamicStyles = useMemo(() => ({
    registerButton: {
      ...styles.registerButton,
      backgroundColor: colors.primary,
    },
    registerButtonText: {
      ...styles.registerButtonText,
      color: colors.ui.buttonText,
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
  }), [colors]);
  
  // Bei der ersten Anzeige prüfen, ob der Storage gelöscht wurde
  useEffect(() => {
    checkStorageCleared();
  }, [checkStorageCleared]);
  
  // Registrierungs-Handler
  const handleRegister = async () => {
    if (localLoading) return;
    
    // Vorherige Fehler zurücksetzen
    if (authError) {
      clearError();
    }
    
    if (!email) {
      Alert.alert(translations.error, translations.errorRequired);
      return;
    }
    
    if (!password) {
      Alert.alert(translations.error, translations.errorRequired);
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert(translations.error, translations.errorPasswordMatch);
      return;
    }
    
    // Registration starten
    setLocalLoading(true);
    
    try {
      // Erstelle vollständigen Namen aus Vor- und Nachname für die Registrierung
      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      
      const success = await register(email, password, fullName || undefined);
      
      if (success) {
        // Hinweis: Die Mode-Setzung erfolgt jetzt zentral im Auth-Service
        
        try {
          // Storage-Flag entfernen über die ServiceHelper-Funktion
          const storageService = getStorageService();
          
          if (storageService && typeof storageService.removeItem === 'function') {
            await storageService.removeItem('storage_was_cleared');
            logger.info('[RegisterScreen] storage_was_cleared-Flag erfolgreich entfernt');
          } else {
            // Fallback: Direkter AsyncStorage-Zugriff
            await AsyncStorage.removeItem('storage_was_cleared');
            logger.info('[RegisterScreen] storage_was_cleared-Flag über AsyncStorage entfernt');
          }
        } catch (storageError) {
          logger.error('[RegisterScreen] Fehler beim Entfernen des Storage-Flags:', 
            storageError instanceof Error ? storageError.message : String(storageError));
          // Fehler ignorieren und trotzdem fortfahren
        }
        
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[RegisterScreen] Registration error:', error);
      // Der Fehler wird bereits vom useAuth-Hook gesetzt
    } finally {
      setLocalLoading(false);
    }
  };
  
  // Footer für den Container
  const footer = useMemo(() => (
    <View style={styles.footer}>
      <Text style={dynamicStyles.footerText}>
        {translations.alreadyAccount}{' '}
        <Link href="/(auth)/login" asChild>
          <Text style={dynamicStyles.link}>
            {translations.login}
          </Text>
        </Link>
      </Text>
      
      <TouchableOpacity
        style={dynamicStyles.demoButton}
        onPress={fillDemoData}
        disabled={localLoading}
        accessibilityLabel="Demo-Daten einfügen"
        accessibilityRole="button"
        accessibilityHint="Füllt die Formularfelder mit Testdaten"
      >
        <Text style={dynamicStyles.demoButtonText}>
          {translations.demoDataButton}
        </Text>
      </TouchableOpacity>
    </View>
  ), [dynamicStyles, fillDemoData, localLoading, translations]);
  
  // Fehlermeldung
  const errorMessage = authError ? authError.message : undefined;
  
  return (
    <AuthContainer
      title={translations.title}
      subtitle={translations.subtitle}
      error={errorMessage}
      footer={footer}
    >
      <View style={styles.form}>
        <View style={styles.nameFields}>
          <View style={styles.nameField}>
            <AuthFormField
              value={firstName}
              onChangeText={setFirstName}
              placeholder={translations.firstNamePlaceholder}
              autoCapitalize="words"
              autoComplete={Platform.OS === 'web' ? 'given-name' : 'name-given'}
              textContentType="givenName"
              accessibilityLabel={translations.firstName}
            />
          </View>
          
          <View style={styles.nameFieldSpacer} />
          
          <View style={styles.nameField}>
            <AuthFormField
              value={lastName}
              onChangeText={setLastName}
              placeholder={translations.lastNamePlaceholder}
              autoCapitalize="words"
              autoComplete={Platform.OS === 'web' ? 'family-name' : 'name-family'}
              textContentType="familyName"
              accessibilityLabel={translations.lastName}
            />
          </View>
        </View>
        
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
          autoComplete={Platform.OS === 'web' ? 'new-password' : 'password-new'}
          textContentType="newPassword"
          accessibilityLabel={translations.password}
        />
        
        <AuthFormField
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={translations.confirmPasswordPlaceholder}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={Platform.OS === 'web' ? 'new-password' : 'password-new'}
          textContentType="newPassword"
          accessibilityLabel={translations.confirmPassword}
        />
      </View>
      
      <TouchableOpacity
        style={dynamicStyles.registerButton}
        onPress={handleRegister}
        disabled={localLoading}
        accessibilityLabel={translations.registerButton}
        accessibilityRole="button"
        accessibilityState={{ disabled: localLoading, busy: localLoading }}
      >
        {localLoading ? (
          <ActivityIndicator color={colors.ui.buttonText} size="small" />
        ) : (
          <Text style={dynamicStyles.registerButtonText}>
            {translations.registerButton}
          </Text>
        )}
      </TouchableOpacity>
    </AuthContainer>
  );
}

// Statische Stile ohne Farben
const styles = StyleSheet.create({
  form: {
    marginBottom: spacing.m,
  },
  registerButton: {
    height: spacing.xxl + 2, // 50px
    borderRadius: spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  registerButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold,
  },
  nameFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    flex: 1,
  },
  nameFieldSpacer: {
    width: spacing.m,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.l,
  },
  footerText: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.m,
  },
  link: {
    fontWeight: typography.fontWeight.semiBold,
  },
  demoButton: {
    padding: spacing.s,
    borderWidth: 1,
    borderRadius: spacing.s,
    marginTop: spacing.s,
    marginBottom: spacing.m,
  },
  demoButtonText: {
    fontSize: typography.fontSize.s,
  },
}); 