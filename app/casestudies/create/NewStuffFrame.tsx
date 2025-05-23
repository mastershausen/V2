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
import { InfoBox } from '@/shared-components/ui/InfoBox';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mindestzeichenzahlen für die verschiedenen Felder
const MIN_CHARS = {
  headline: 30,
  ideaGoal: 200,
  implementation: 300,
  marketEntry: 200,
  results: 150
};

/**
 * NewStuffFrame Screen - "Neues erschaffen" Frame für Fallstudien
 * Formular zum Erstellen einer Fallstudie mit innovativem Konzept oder neuer Lösung
 */
export default function NewStuffFrameScreen() {
  const colors = useThemeColor();
  
  // Formularfelder
  const [headline, setHeadline] = useState('');
  const [ideaGoal, setIdeaGoal] = useState('');
  const [implementation, setImplementation] = useState('');
  const [marketEntry, setMarketEntry] = useState('');
  const [results, setResults] = useState('');

  // Zustand für die Validierungsfehler
  const [errors, setErrors] = useState({
    headline: false,
    ideaGoal: false,
    implementation: false,
    marketEntry: false,
    results: false
  });

  // Zustand für Formular-Gültigkeit
  const [isValid, setIsValid] = useState(false);

  // Aktualisiere die Validierung, wenn sich die Eingabefelder ändern
  useEffect(() => {
    const newErrors = {
      headline: headline.length < MIN_CHARS.headline,
      ideaGoal: ideaGoal.length < MIN_CHARS.ideaGoal,
      implementation: implementation.length < MIN_CHARS.implementation,
      marketEntry: marketEntry.length < MIN_CHARS.marketEntry,
      results: results.length < MIN_CHARS.results
    };
    
    setErrors(newErrors);
    setIsValid(!Object.values(newErrors).some(error => error));
  }, [headline, ideaGoal, implementation, marketEntry, results]);

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
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${progress * 100}%`,
                backgroundColor: progress >= 1 ? colors.success : colors.primary 
              }
            ]} 
          />
        </View>
        <View style={styles.progressTextContainer}>
          <Text style={[styles.minCharsText, { color: colors.textTertiary }]}>
            (Mindestens {minChars} Zeichen)
          </Text>
        </View>
      </View>
    );
  };

  const renderInputField = (
    label: string,
    description: string,
    value: string,
    setValue: (text: string) => void,
    placeholder: string,
    minChars: number,
    isLarge: boolean = false
  ) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
          {label}
        </Text>
        <Text style={[styles.fieldDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.textInput,
              isLarge && styles.textInputLarge,
              { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary,
              }
            ]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            multiline
            textAlignVertical="top"
          />
          {renderCharacterProgress(value.length, minChars)}
        </View>
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
            title="Neues erschaffen"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
        </View>

        {/* Inhalt */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Einleitung */}
          <View style={styles.introContainer}>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Stelle ein innovatives Konzept oder eine neue Lösung vor.
            </Text>
          </View>
          
          {/* Hinweis zur Eingabe */}
          <View style={styles.infoBoxContainer}>
            <InfoBox 
              text="Die Eingabefelder dienen nur als Struktur. Der eingegebene Text wird später als Fließtext mit strukturierter Ansicht angezeigt."
              backgroundColor={`${colors.primary}10`}
              iconColor={colors.primary}
              textColor={colors.textSecondary}
              iconName="information-circle-outline"
            />
          </View>

          {/* Eingabefelder mit einheitlichem Stil */}
          {renderInputField(
            "Überschrift",
            "Was wurde konkret realisiert oder gelauncht?",
            headline,
            setHeadline,
            "z.B. Digitale Steuerberatung-App revolutioniert Branche",
            MIN_CHARS.headline
          )}

          {renderInputField(
            "Idee / Ziel",
            "Was war die Vision oder Absicht?",
            ideaGoal,
            setIdeaGoal,
            "Beschreibe die ursprüngliche Vision und die Ziele des Projekts...",
            MIN_CHARS.ideaGoal,
            true
          )}

          {renderInputField(
            "Umsetzung",
            "Wie lief der Aufbau? Was lief gut, was war schwierig?",
            implementation,
            setImplementation,
            "Erkläre den Entwicklungsprozess mit Erfolgen und Herausforderungen...",
            MIN_CHARS.implementation,
            true
          )}

          {renderInputField(
            "Markteintritt / Rollout",
            "Wie wurde das Ganze in die Welt gebracht?",
            marketEntry,
            setMarketEntry,
            "Beschreibe die Markteinführung und Rollout-Strategie...",
            MIN_CHARS.marketEntry,
            true
          )}

          {renderInputField(
            "Ergebnis",
            "Was war der messbare Output oder Effekt?",
            results,
            setResults,
            "Beschreibe die konkreten Ergebnisse und Auswirkungen...",
            MIN_CHARS.results,
            true
          )}
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
    marginBottom: spacing.m,
  },
  introText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
  },
  infoBoxContainer: {
    marginBottom: spacing.l,
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
  inputWrapper: {
    marginBottom: 0,
  },
  textInput: {
    borderWidth: 0,
    borderRadius: ui.borderRadius.s,
    paddingTop: spacing.m,
    paddingLeft: spacing.m,
    paddingRight: spacing.m,
    paddingBottom: 20,
    fontSize: typography.fontSize.m,
    minHeight: 40,
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textInputLarge: {
    minHeight: 60,
  },
  progressContainer: {
    marginTop: 0,
    marginBottom: spacing.m,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderBottomLeftRadius: ui.borderRadius.s,
    borderBottomRightRadius: ui.borderRadius.s,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  minCharsText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'left',
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