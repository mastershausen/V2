import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mindestzeichenzahlen für die verschiedenen Felder
const MIN_CHARS = {
  headline: 30,
  initialSituation: 200,
  implementation: 300,
  results: 150
};

/**
 * NowThenFrame Screen - "Vorher → Nachher" Frame für Fallstudien
 * Formular zum Erstellen einer Fallstudie mit dem Vorher-Nachher-Ansatz
 */
export default function NowThenFrameScreen() {
  const colors = useThemeColor();
  
  // Formularfelder
  const [headline, setHeadline] = useState('');
  const [initialSituation, setInitialSituation] = useState('');
  const [implementation, setImplementation] = useState('');
  const [results, setResults] = useState('');

  // Zustand für die Validierungsfehler
  const [errors, setErrors] = useState({
    headline: false,
    initialSituation: false,
    implementation: false,
    results: false
  });

  // Zustand für Formular-Gültigkeit
  const [isValid, setIsValid] = useState(false);

  // Aktualisiere die Validierung, wenn sich die Eingabefelder ändern
  useEffect(() => {
    const newErrors = {
      headline: headline.length < MIN_CHARS.headline,
      initialSituation: initialSituation.length < MIN_CHARS.initialSituation,
      implementation: implementation.length < MIN_CHARS.implementation,
      results: results.length < MIN_CHARS.results
    };
    
    setErrors(newErrors);
    setIsValid(!Object.values(newErrors).some(error => error));
  }, [headline, initialSituation, implementation, results]);

  // Formular absenden
  const handleSubmit = () => {
    if (isValid) {
      // Hier würden die Daten gespeichert/gesendet werden
      Alert.alert(
        "Erfolgreich",
        "Deine Fallstudie wurde erfolgreich erstellt!",
        [
          { 
            text: "OK", 
            onPress: () => router.push('/') 
          }
        ]
      );
    } else {
      Alert.alert(
        "Unvollständige Eingaben",
        "Bitte fülle alle Felder mit der Mindestanzahl an Zeichen aus."
      );
    }
  };

  // Erstelle Fortschrittsbalken für die Textlänge
  const renderCharacterProgress = (currentLength: number, minChars: number) => {
    const progress = Math.min(currentLength / minChars, 1);
    
    return (
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${progress * 100}%`,
              backgroundColor: progress >= 1 ? colors.success : colors.primary 
            }
          ]} 
        />
        <Text style={[styles.progressText, { color: colors.textTertiary }]}>
          {currentLength}/{minChars} Zeichen
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen 
          options={{ 
            headerShown: false,
          }} 
        />
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <HeaderNavigation
            title="Vorher → Nachher"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
        </View>

        {/* Inhalt */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Einleitung */}
          <View style={styles.introContainer}>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Zeige eine klare Transformation mit messbaren Ergebnissen.
            </Text>
          </View>

          {/* Überschrift */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Überschrift
            </Text>
            <Text style={[styles.fieldDescription, { color: colors.textSecondary }]}>
              Ergebnisorientierte Headline für deine Fallstudie
            </Text>
            <TextInput
              style={[
                styles.textInput,
                errors.headline && styles.errorInput,
                { 
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  borderColor: errors.headline ? colors.error : colors.divider
                }
              ]}
              value={headline}
              onChangeText={setHeadline}
              placeholder="z.B. Holdingstruktur spart 84.000 € jährlich"
              placeholderTextColor={colors.textTertiary}
              multiline
              textAlignVertical="top"
            />
            {renderCharacterProgress(headline.length, MIN_CHARS.headline)}
          </View>

          {/* Ausgangssituation */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Ausgangssituation
            </Text>
            <Text style={[styles.fieldDescription, { color: colors.textSecondary }]}>
              Was war das Problem oder der Zustand davor?
            </Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textInputLarge,
                errors.initialSituation && styles.errorInput,
                { 
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  borderColor: errors.initialSituation ? colors.error : colors.divider
                }
              ]}
              value={initialSituation}
              onChangeText={setInitialSituation}
              placeholder="Beschreibe die Ausgangssituation ausführlich..."
              placeholderTextColor={colors.textTertiary}
              multiline
              textAlignVertical="top"
            />
            {renderCharacterProgress(initialSituation.length, MIN_CHARS.initialSituation)}
          </View>

          {/* Umsetzung */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Umsetzung
            </Text>
            <Text style={[styles.fieldDescription, { color: colors.textSecondary }]}>
              Was wurde gemacht? Schwierigkeiten und Widrigkeiten gehören hier ebenfalls rein.
            </Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textInputLarge,
                errors.implementation && styles.errorInput,
                { 
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  borderColor: errors.implementation ? colors.error : colors.divider
                }
              ]}
              value={implementation}
              onChangeText={setImplementation}
              placeholder="Beschreibe die Umsetzung im Detail..."
              placeholderTextColor={colors.textTertiary}
              multiline
              textAlignVertical="top"
            />
            {renderCharacterProgress(implementation.length, MIN_CHARS.implementation)}
          </View>

          {/* Ergebnis */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
              Ergebnis
            </Text>
            <Text style={[styles.fieldDescription, { color: colors.textSecondary }]}>
              Was kam dabei raus? Zahlen, Wirkung, Veränderung
            </Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textInputLarge,
                errors.results && styles.errorInput,
                { 
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  borderColor: errors.results ? colors.error : colors.divider
                }
              ]}
              value={results}
              onChangeText={setResults}
              placeholder="Beschreibe die erzielten Ergebnisse..."
              placeholderTextColor={colors.textTertiary}
              multiline
              textAlignVertical="top"
            />
            {renderCharacterProgress(results.length, MIN_CHARS.results)}
          </View>
        </ScrollView>

        {/* Footer mit Speichern-Button */}
        <View style={[styles.footer, { borderTopColor: colors.divider }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { opacity: isValid ? 1 : 0.6 }
            ]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <LinearGradient
              colors={[colors.primary, colors.primary]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Fallstudie speichern</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? spacing.m : spacing.xl,
    paddingBottom: spacing.xs,
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.m,
    paddingBottom: spacing.xxl,
  },
  introContainer: {
    marginBottom: spacing.l,
  },
  introText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
  },
  fieldContainer: {
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xs,
  },
  fieldDescription: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.s,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.s,
    padding: spacing.m,
    paddingTop: spacing.m,
    fontSize: typography.fontSize.m,
    minHeight: 60,
  },
  textInputLarge: {
    minHeight: 120,
  },
  errorInput: {
    borderWidth: 2,
  },
  progressContainer: {
    marginTop: spacing.xs,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.s,
    textAlign: 'right',
  },
  footer: {
    padding: spacing.m,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitButton: {
    borderRadius: ui.borderRadius.m,
    overflow: 'hidden',
    height: 50,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  buttonIcon: {
    marginLeft: spacing.xs,
  },
}); 