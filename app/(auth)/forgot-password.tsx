/**
 * Neuer "Passwort vergessen" Screen mit verbessertem Design
 * verwendet den vereinfachten Auth-Flow
 */
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 *
 */
export default function ForgotPasswordScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  // E-Mail-Feld beim Laden der Komponente zurücksetzen
  useEffect(() => {
    // Feld leeren, um vorausgefüllte Daten zu vermeiden
    setEmail('');
  }, []);
  
  // Passwort zurücksetzen Funktion (Simulation)
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Fehler', 'Bitte geben Sie Ihre E-Mail-Adresse ein.');
      return;
    }
    
    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    
    // Tastatur schließen
    Keyboard.dismiss();
    
    setLocalLoading(true);
    
    try {
      // Hier würde die eigentliche Passwort-Zurücksetzen-Logik implementiert werden
      // Für jetzt simulieren wir eine erfolgreiche Anfrage
      // In Zukunft könnte hier die echte Implementierung von AuthContext verwendet werden
      
      setTimeout(() => {
        Alert.alert(
          'E-Mail gesendet', 
          'Falls ein Konto mit dieser E-Mail-Adresse existiert, erhalten Sie eine E-Mail mit weiteren Anweisungen.',
          [
            { 
              text: 'OK', 
              onPress: () => router.replace("/(auth)/login")
            }
          ]
        );
        setLocalLoading(false);
      }, 1500);
      
    } catch (err) {
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      console.error('Password reset error:', err);
      setLocalLoading(false);
    }
  };
  
  // Tastatur schließen, wenn auf leeren Bereich geklickt wird
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
    >
      <StatusBar style="auto" />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Passwort vergessen?
            </Text>
            
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen Ihres Passworts zu erhalten.
            </Text>
            
            {/* Fehleranzeige */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error.message}</Text>
              </View>
            )}
            
            <View style={styles.form}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  borderColor: colors.divider
                }]}
                placeholder="E-Mail"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="done"
                onSubmitEditing={handleResetPassword}
                autoComplete={__DEV__ ? "off" : "email"}
                textContentType={__DEV__ ? "none" : "emailAddress"}
                editable={!localLoading && !isLoading}
              />
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleResetPassword}
                disabled={localLoading || isLoading}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>
                  {localLoading ? 'Wird gesendet...' : 'Link senden'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={[styles.link, { color: colors.primary }]}>
                    Zurück zur Anmeldung
                  </Text>
                </TouchableOpacity>
              </Link>
              
              {/* Demo-Hilfestellung */}
              <TouchableOpacity
                style={[styles.demoButton, { borderColor: colors.primary }]}
                onPress={() => {
                  setEmail('demo@example.com');
                }}
                disabled={localLoading || isLoading}
              >
                <Text style={[styles.demoButtonText, { color: colors.primary }]}>
                  Demo-E-Mail einfügen
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  content: {
    flex: 1,
    padding: spacing.l,
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.m,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  errorText: {
    color: 'red',
    fontSize: typography.fontSize.s,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.m,
    fontSize: typography.fontSize.m,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  buttonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  footer: {
    alignItems: 'center',
  },
  link: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
    marginBottom: spacing.m,
  },
  demoButton: {
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 8,
    marginTop: spacing.m,
  },
  demoButtonText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as any,
  },
}); 