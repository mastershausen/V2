import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';
import { 
  WizardProgressBar, 
  WizardQuestionTitle,
  WizardNextButton 
} from '@/shared-components/wizard';

interface Wizard7Props {
  onOpenSidebar?: () => void;
}

export default function Wizard7({ onOpenSidebar }: Wizard7Props) {
  const colors = useThemeColor();
  const router = useRouter();
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [hasFixedBudget, setHasFixedBudget] = useState(true);
  const [budgetDescription, setBudgetDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (isValid) {
      // Navigation zu Wizard8 (später implementieren)
      console.log('Budget-Daten:', {
        hasFixedBudget,
        minBudget,
        maxBudget,
        budgetDescription,
        isPublic
      });
    }
  };

  // Validierung: Entweder Min/Max Budget ODER Budgetbeschreibung muss ausgefüllt sein
  const isValid = hasFixedBudget 
    ? (minBudget.trim().length > 0 && maxBudget.trim().length > 0)
    : budgetDescription.trim().length > 0;

  const toggleFixedBudget = () => {
    setHasFixedBudget(!hasFixedBudget);
    // Reset values when switching
    if (hasFixedBudget) {
      setMinBudget('');
      setMaxBudget('');
    } else {
      setBudgetDescription('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="7 von 8 Fragen"
        onBackPress={handleBack}
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: keyboardHeight > 0 ? 60 : spacing.l }
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Progress Bar */}
        <WizardProgressBar currentStep={7} totalSteps={8} />

        {/* Question Section */}
        <View style={styles.questionContainer}>
          <WizardQuestionTitle>
            Welches Budgetvolumen hatte dieses Projekt?
          </WizardQuestionTitle>
          
          {/* Infotext */}
          <View style={[styles.infoBox, { 
            backgroundColor: `${colors.primary}08`,
            borderColor: `${colors.primary}20`
          }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Je genauer dein Budgetrahmen (Min.–Max. oder Modellbeschreibung), desto präzisere Leads bringt dir Olivia.
            </Text>
          </View>
        </View>

        {/* Budget Input Section */}
        <View style={styles.budgetSection}>
          {/* Conditional Content: Min/Max Budget ODER Freitextfeld */}
          {hasFixedBudget ? (
            // Min/Max Budget Felder nebeneinander
            <View style={styles.budgetInputs}>
              <View style={styles.budgetRow}>
                <View style={styles.budgetInputHalf}>
                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                    Min. Budget (€) *
                  </Text>
                  <TextInput
                    style={[
                      styles.budgetInput,
                      {
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: minBudget.trim() ? colors.primary : colors.inputBorder,
                        color: colors.textPrimary,
                      }
                    ]}
                    placeholder="z.B. 5.000"
                    placeholderTextColor={colors.textTertiary}
                    value={minBudget}
                    onChangeText={setMinBudget}
                    keyboardType="numeric"
                    autoFocus={true}
                  />
                </View>

                <View style={styles.budgetInputHalf}>
                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                    Max. Budget (€) *
                  </Text>
                  <TextInput
                    style={[
                      styles.budgetInput,
                      {
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: maxBudget.trim() ? colors.primary : colors.inputBorder,
                        color: colors.textPrimary,
                      }
                    ]}
                    placeholder="z.B. 25.000"
                    placeholderTextColor={colors.textTertiary}
                    value={maxBudget}
                    onChangeText={setMaxBudget}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ) : (
            // Freitextfeld für Finanzierungsmodell
            <View style={styles.descriptionContainer}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                Finanzierungsmodell / Erläuterung *
              </Text>
              <TextInput
                style={[
                  styles.descriptionInput,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: budgetDescription.trim() ? colors.primary : colors.inputBorder,
                    color: colors.textPrimary,
                  }
                ]}
                placeholder="z.B. Performance-basierte Vergütung, Equity-Deal, Pauschalpreis nach Meilenstein..."
                placeholderTextColor={colors.textTertiary}
                value={budgetDescription}
                onChangeText={setBudgetDescription}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                autoFocus={true}
              />
            </View>
          )}

          {/* Checkbox für fixen Budgetrahmen */}
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={toggleFixedBudget}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox, 
              { 
                borderColor: colors.inputBorder,
                backgroundColor: !hasFixedBudget ? colors.primary : 'transparent'
              }
            ]}>
              {!hasFixedBudget && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.textPrimary }]}>
              Kein fixer Budgetrahmen
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sichtbarkeits-Auswahl */}
        <View style={styles.visibilitySection}>
          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
            Sichtbarkeit
          </Text>
          
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[
                styles.toggleOption, 
                isPublic && styles.toggleOptionActive,
                { 
                  backgroundColor: isPublic ? colors.primary : colors.backgroundSecondary,
                  borderColor: colors.inputBorder 
                }
              ]}
              onPress={() => setIsPublic(true)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.toggleText, 
                { color: isPublic ? 'white' : colors.textPrimary }
              ]}>
                Öffentlich anzeigen
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.toggleOption, 
                !isPublic && styles.toggleOptionActive,
                { 
                  backgroundColor: !isPublic ? colors.primary : colors.backgroundSecondary,
                  borderColor: colors.inputBorder 
                }
              ]}
              onPress={() => setIsPublic(false)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.toggleText, 
                { color: !isPublic ? 'white' : colors.textPrimary }
              ]}>
                Nur für Olivia (intern)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      <WizardNextButton
        onPress={handleNext}
        isEnabled={isValid}
        keyboardHeight={keyboardHeight}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
  },
  questionContainer: {
    paddingBottom: spacing.l,
  },
  infoBox: {
    flexDirection: 'row',
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: spacing.s,
  },
  infoIcon: {
    marginRight: spacing.s,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  budgetSection: {
    paddingBottom: spacing.l,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  budgetInputs: {
    gap: spacing.m,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  budgetInputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  budgetInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    fontSize: 16,
    height: 48,
  },
  descriptionContainer: {
    marginTop: spacing.s,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
  },
  visibilitySection: {
    paddingBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.m,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  toggleOptionActive: {
    // Styling wird via backgroundColor gemacht
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 