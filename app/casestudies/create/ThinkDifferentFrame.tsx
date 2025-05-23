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
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { KeyboardToolbar, ToolbarAction } from '@/shared-components/navigation/KeyboardToolbar';
import { ContextModal } from '@/shared-components/modals/ContextModal';
import { FirstTimeInfoBox } from '@/shared-components/ui/FirstTimeInfoBox';
import { QualityReminderBox } from '@/shared-components/ui/QualityReminderBox';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFirstTimeVisit } from '@/hooks/useFirstTimeVisit';

// Mindestzeichenzahlen für die verschiedenen Felder
const MIN_CHARS = {
  headline: 30,
  initialSituation: 200,
  analysis: 200,
  implementation: 300,
  results: 150
};

/**
 * ThinkDifferentFrame Screen - "Um die Ecke gedacht" Frame für Fallstudien
 * Formular zum Erstellen einer Fallstudie mit kreativem, unerwartetem Lösungsansatz
 */
export default function ThinkDifferentFrameScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { isFirstVisit, isLoading, markAsVisited } = useFirstTimeVisit('thinkDifferentFrame');
  
  // Formularfelder
  const [headline, setHeadline] = useState('');
  const [initialSituation, setInitialSituation] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [implementation, setImplementation] = useState('');
  const [results, setResults] = useState('');

  // Context Modal State
  const [contextModalVisible, setContextModalVisible] = useState(false);
  const [contextForOlivia, setContextForOlivia] = useState('');

  // Zustand für die Validierungsfehler
  const [errors, setErrors] = useState({
    headline: false,
    initialSituation: false,
    analysis: false,
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
      analysis: analysis.length < MIN_CHARS.analysis,
      implementation: implementation.length < MIN_CHARS.implementation,
      results: results.length < MIN_CHARS.results
    };
    
    setErrors(newErrors);
    setIsValid(!Object.values(newErrors).some(error => error));
  }, [headline, initialSituation, analysis, implementation, results]);

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

  // Kontext für Olivia
  const handleContextForOlivia = () => {
    setContextModalVisible(true);
  };

  // Context Modal Handlers
  const handleContextSave = (context: string) => {
    setContextForOlivia(context);
  };

  const handleContextClose = () => {
    setContextModalVisible(false);
  };

  // KeyboardToolbar Actions
  const toolbarActions: ToolbarAction[] = [
    {
      id: 'context',
      icon: 'information-circle-outline',
      label: 'Kontext für Olivia',
      onPress: handleContextForOlivia,
      accessibilityLabel: 'Kontext für Olivia'
    },
    {
      id: 'save',
      icon: 'checkmark-circle-outline',
      label: 'Fallstudie speichern',
      onPress: handleSubmit,
      disabled: !isValid,
      accessibilityLabel: 'Fallstudie speichern'
    }
  ];

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
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen 
          options={{ 
            headerShown: false,
          }} 
        />
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <HeaderNavigation
            title="Um die Ecke gedacht"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
        </View>

        {/* Inhalt */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Einleitung */}
          <View style={styles.introContainer}>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Präsentiere einen kreativen, unerwarteten Lösungsansatz.
            </Text>
          </View>
          
          {/* Hinweise zur Eingabe */}
          <View style={styles.infoBoxContainer}>
            {/* Erste-Besuch InfoBox - nur einmalig */}
            {!isLoading && isFirstVisit && (
              <View style={styles.firstTimeInfoContainer}>
                <FirstTimeInfoBox 
                  text="Die Eingabefelder dienen nur als Struktur. Der eingegebene Text wird später als Fließtext mit strukturierter Ansicht angezeigt."
                  onUnderstood={markAsVisited}
                  iconName="information-circle-outline"
                />
              </View>
            )}
            
            {/* Qualitäts-Reminder - immer sichtbar */}
            <QualityReminderBox />
          </View>

          {/* Eingabefelder mit einheitlichem Stil */}
          {renderInputField(
            "Überschrift",
            "Was wurde umgesetzt oder aktiviert?",
            headline,
            setHeadline,
            "z.B. Ungewöhnliche Steueroptimierung durch Kunstsammlung",
            MIN_CHARS.headline
          )}

          {renderInputField(
            "Ausgangssituation",
            "Was war da? Was fehlte? Was war nicht sichtbar?",
            initialSituation,
            setInitialSituation,
            "Beschreibe die ursprüngliche Situation und was nicht offensichtlich war...",
            MIN_CHARS.initialSituation,
            true
          )}

          {renderInputField(
            "Analyse / Idee",
            "Wie wurde das Potenzial oder die Lösung erkannt?",
            analysis,
            setAnalysis,
            "Erkläre den Denkprozess und wie die kreative Lösung entstanden ist...",
            MIN_CHARS.analysis,
            true
          )}

          {renderInputField(
            "Umsetzung",
            "Was wurde gemacht? Inklusive Probleme, Hürden, Wendepunkte.",
            implementation,
            setImplementation,
            "Beschreibe die Umsetzung mit allen Herausforderungen...",
            MIN_CHARS.implementation,
            true
          )}

          {renderInputField(
            "Ergebnis",
            "Was ist das konkrete Resultat?",
            results,
            setResults,
            "Beschreibe das konkrete Ergebnis der kreativen Lösung...",
            MIN_CHARS.results,
            true
          )}
        </ScrollView>
      </SafeAreaView>

      {/* KeyboardToolbar mit KeyboardAvoidingView für Tastatur-Bewegung */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <KeyboardToolbar 
          actions={toolbarActions}
          style={styles.keyboardToolbar}
        />
      </KeyboardAvoidingView>

      {/* Context Modal */}
      <ContextModal
        visible={contextModalVisible}
        onClose={handleContextClose}
        onSave={handleContextSave}
        initialValue={contextForOlivia}
      />
    </View>
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
  keyboardToolbar: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
  },
  firstTimeInfoContainer: {
    marginBottom: spacing.m,
  },
}); 