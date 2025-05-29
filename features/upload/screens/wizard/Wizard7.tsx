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
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const { t } = useTranslation();
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [hasFixedBudget, setHasFixedBudget] = useState(true);
  const [budgetDescription, setBudgetDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [showTemporaryInfo, setShowTemporaryInfo] = useState(false);

  // AsyncStorage key für dauerhaftes Merken der Info-Bestätigung
  const INFO_ACKNOWLEDGED_KEY = 'wizard_budget_info_acknowledged';

  useEffect(() => {
    // Prüfen, ob Info bereits bestätigt wurde
    const checkInfoAcknowledged = async () => {
      try {
        const acknowledged = await AsyncStorage.getItem(INFO_ACKNOWLEDGED_KEY);
        if (acknowledged === 'true') {
          setShowInfoBox(false);
        }
      } catch (error) {
        console.log('Fehler beim Laden der Info-Einstellung:', error);
      }
    };

    checkInfoAcknowledged();

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

  // Info dauerhaft bestätigen
  const handleInfoAcknowledged = async () => {
    try {
      await AsyncStorage.setItem(INFO_ACKNOWLEDGED_KEY, 'true');
      setShowInfoBox(false);
    } catch (error) {
      console.log('Fehler beim Speichern der Info-Einstellung:', error);
      setShowInfoBox(false); // Trotzdem verstecken bei Fehler
    }
  };

  // Info temporär anzeigen
  const handleShowTemporaryInfo = () => {
    setShowTemporaryInfo(true);
    // Nach 4 Sekunden automatisch ausblenden
    setTimeout(() => {
      setShowTemporaryInfo(false);
    }, 4000);
  };

  // Info temporär schließen
  const handleCloseTemporaryInfo = () => {
    setShowTemporaryInfo(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (isValid) {
      // Navigation zu Wizard8
      router.push('/wizard8');
      console.log('Budget-Daten:', {
        hasFixedBudget,
        minBudget,
        maxBudget,
        budgetDescription,
        visibility
      });
    }
  };

  // Validierung: Budget UND Sichtbarkeit muss ausgewählt sein
  const isValid = (hasFixedBudget 
    ? (minBudget.trim().length > 0 && maxBudget.trim().length > 0)
    : budgetDescription.trim().length > 0) && visibility !== null;

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
        title={t('wizard7.headerTitle')}
        onBackPress={handleBack}
        showBackButton={true}
        rightContent={!showInfoBox ? (
          <TouchableOpacity 
            onPress={handleShowTemporaryInfo}
            style={styles.headerInfoButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="information-circle-outline" 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        ) : undefined}
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
            {t('wizard7.questionTitle')}
          </WizardQuestionTitle>
        </View>

        {/* Permanente Info-Box - nur beim ersten Mal */}
        {showInfoBox && (
          <View style={[styles.infoBox, { 
            backgroundColor: `${colors.primary}08`,
            borderColor: `${colors.primary}20`
          }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {t('wizard7.infoText')}
              </Text>
              <TouchableOpacity 
                onPress={handleInfoAcknowledged}
                style={[styles.understoodButton, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
              >
                <Text style={styles.understoodButtonText}>{t('wizard7.understoodButton')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Temporäre Info-Box - beim Tap auf Info-Icon */}
        {showTemporaryInfo && (
          <View style={[styles.temporaryInfoBox, { 
            backgroundColor: `${colors.primary}08`,
            borderColor: `${colors.primary}20`
          }]}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} style={styles.infoIcon} />
            <Text style={[styles.temporaryInfoText, { color: colors.textSecondary }]}>
              {t('wizard7.infoText')}
            </Text>
            <TouchableOpacity 
              onPress={handleCloseTemporaryInfo}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Budget Input Section */}
        <View style={styles.budgetSection}>
          {/* Conditional Content: Min/Max Budget ODER Freitextfeld */}
          {hasFixedBudget ? (
            // Min/Max Budget Felder nebeneinander
            <View style={styles.budgetInputs}>
              <View style={styles.budgetRow}>
                <View style={styles.budgetInputHalf}>
                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                    {t('wizard7.minBudgetLabel')}
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
                    placeholder={t('wizard7.minBudgetPlaceholder')}
                    placeholderTextColor={colors.textTertiary}
                    value={minBudget}
                    onChangeText={setMinBudget}
                    keyboardType="numeric"
                    autoFocus={true}
                  />
                </View>

                <View style={styles.budgetInputHalf}>
                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                    {t('wizard7.maxBudgetLabel')}
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
                    placeholder={t('wizard7.maxBudgetPlaceholder')}
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
                {t('wizard7.financingModelLabel')}
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
                placeholder={t('wizard7.financingModelPlaceholder')}
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
              {t('wizard7.noFixedBudgetLabel')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sichtbarkeits-Auswahl */}
        <View style={styles.visibilitySection}>
          
          <View style={styles.visibilityContainer}>
            <TouchableOpacity 
              style={[
                styles.visibilityCard, 
                visibility === 'public' && styles.visibilityCardSelected,
                { 
                  backgroundColor: visibility === 'public' ? colors.primary : colors.backgroundSecondary,
                  borderColor: visibility === 'public' ? colors.primary : colors.inputBorder,
                  shadowColor: colors.primary,
                  shadowOpacity: visibility === 'public' ? 0.2 : 0.1,
                }
              ]}
              onPress={() => setVisibility('public')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="globe-outline" 
                size={20} 
                color={visibility === 'public' ? 'white' : colors.primary} 
                style={styles.visibilityIcon}
              />
              <View style={styles.visibilityTextContainer}>
                <Text style={[
                  styles.visibilityTitle, 
                  { color: visibility === 'public' ? 'white' : colors.textPrimary }
                ]}>
                  {t('wizard7.publicVisibilityTitle')}
                </Text>
                <Text style={[
                  styles.visibilitySubtitle, 
                  { color: visibility === 'public' ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                ]}>
                  {t('wizard7.publicVisibilitySubtitle')}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.visibilityCard, 
                visibility === 'private' && styles.visibilityCardSelected,
                { 
                  backgroundColor: visibility === 'private' ? colors.primary : colors.backgroundSecondary,
                  borderColor: visibility === 'private' ? colors.primary : colors.inputBorder,
                  shadowColor: colors.primary,
                  shadowOpacity: visibility === 'private' ? 0.2 : 0.1,
                }
              ]}
              onPress={() => setVisibility('private')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={visibility === 'private' ? 'white' : colors.primary} 
                style={styles.visibilityIcon}
              />
              <View style={styles.visibilityTextContainer}>
                <Text style={[
                  styles.visibilityTitle, 
                  { color: visibility === 'private' ? 'white' : colors.textPrimary }
                ]}>
                  {t('wizard7.privateVisibilityTitle')}
                </Text>
                <Text style={[
                  styles.visibilitySubtitle, 
                  { color: visibility === 'private' ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                ]}>
                  {t('wizard7.privateVisibilitySubtitle')}
                </Text>
              </View>
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
  headerInfoButton: {
    padding: spacing.xs,
  },
  infoIcon: {
    marginRight: spacing.s,
    marginTop: 1,
  },
  infoBox: {
    flexDirection: 'row',
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: spacing.s,
  },
  infoContent: {
    flex: 1,
    flexDirection: 'column',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.s,
  },
  understoodButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  understoodButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  temporaryInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: spacing.s,
  },
  temporaryInfoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: spacing.xs,
    marginRight: spacing.s,
  },
  closeButton: {
    padding: spacing.xs,
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
    // Entfernt marginTop um auf gleicher Höhe wie Budget-Felder zu sein
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
  visibilityContainer: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  visibilityCard: {
    flex: 1,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 75,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  visibilityCardSelected: {
    transform: [{ translateY: -1 }],
  },
  visibilityIcon: {
    marginBottom: spacing.xs,
  },
  visibilityTextContainer: {
    alignItems: 'center',
  },
  visibilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs / 2,
  },
  visibilitySubtitle: {
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 14,
  },
}); 