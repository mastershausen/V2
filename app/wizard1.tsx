import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';

export default function Wizard1Page() {
  const colors = useThemeColor();
  const router = useRouter();
  const [answer, setAnswer] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (answer.trim()) {
      // Hier würde die Antwort gespeichert und zu Wizard2 navigiert werden
      console.log('Antwort:', answer);
      // router.push('/wizard2'); // Später wenn Wizard2 existiert
    }
  };

  const isValid = answer.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Neue Fallstudie"
        onBackPress={handleBack}
        showBackButton={true}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBackground, { backgroundColor: colors.inputBorder }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: '12.5%' }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              1 von 8 Fragen
            </Text>
          </View>

          {/* Question Section */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionTitle, { color: colors.textPrimary }]}>
              Worum geht es in deiner Fallstudie?
            </Text>
            <Text style={[styles.questionSubtitle, { color: colors.textSecondary }]}>
              Beschreibe kurz das Hauptthema oder Problem, das du gelöst hast.
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: answer.trim() ? colors.primary : colors.inputBorder,
                  color: colors.textPrimary,
                }
              ]}
              placeholder="z.B. Optimierung der Kundenakquise durch digitale Strategien..."
              placeholderTextColor={colors.textTertiary}
              value={answer}
              onChangeText={setAnswer}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus={true}
            />
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: isValid ? colors.primary : colors.inputBorder,
              }
            ]}
            onPress={handleNext}
            disabled={!isValid}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.nextButtonText,
              {
                color: isValid ? 'white' : colors.textTertiary,
              }
            ]}>
              Weiter
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={isValid ? 'white' : colors.textTertiary}
              style={styles.nextIcon}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: spacing.xl,
  },
  progressContainer: {
    paddingBottom: spacing.l,
  },
  progressBackground: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.s,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  questionContainer: {
    paddingBottom: spacing.l,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.m,
    lineHeight: 32,
  },
  questionSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    paddingBottom: spacing.xl,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.l,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
  },
  bottomContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.s,
    paddingTop: spacing.s,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  nextIcon: {
    marginLeft: spacing.xs,
  },
}); 