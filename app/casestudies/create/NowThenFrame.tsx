import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/config';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { KeyboardToolbar, ToolbarAction } from '@/shared-components/navigation/KeyboardToolbar';
import { ContextModal } from '@/shared-components/modals/ContextModal';
import { InfoBox } from '@/shared-components/ui/InfoBox';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

// Minimum character counts for different fields
const MIN_CHARS = {
  headline: 30,
  initialSituation: 200,
  implementation: 300,
  results: 150
};

/**
 * NowThenFrame Screen - "Before → After" frame for case studies
 * Form for creating a case study with the before-after approach
 */
export default function NowThenFrameScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();
  
  // Form fields
  const [headline, setHeadline] = useState('');
  const [initialSituation, setInitialSituation] = useState('');
  const [implementation, setImplementation] = useState('');
  const [results, setResults] = useState('');
  const [roi, setRoi] = useState('');

  // Context Modal State
  const [contextModalVisible, setContextModalVisible] = useState(false);
  const [contextForOlivia, setContextForOlivia] = useState('');
  
  // Pricing Modal State
  const [pricingModalVisible, setPricingModalVisible] = useState(false);
  const [pricingInfo, setPricingInfo] = useState('');

  // State for validation errors
  const [errors, setErrors] = useState({
    headline: false,
    initialSituation: false,
    implementation: false,
    results: false
  });

  // State for form validity and pricing validation
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPricingValid, setIsPricingValid] = useState(false);
  
  // Combined validation for the Save button
  const isSaveEnabled = isFormValid && isPricingValid;

  // Update validation when input fields change
  useEffect(() => {
    const newErrors = {
      headline: headline.length < MIN_CHARS.headline,
      initialSituation: initialSituation.length < MIN_CHARS.initialSituation,
      implementation: implementation.length < MIN_CHARS.implementation,
      results: results.length < MIN_CHARS.results
    };
    
    setErrors(newErrors);
    setIsFormValid(!Object.values(newErrors).some(error => error));
  }, [headline, initialSituation, implementation, results]);
  
  // Update pricing validation when pricingInfo changes
  useEffect(() => {
    setIsPricingValid(pricingInfo.length > 0);
  }, [pricingInfo]);

  // Submit form
  const handleSubmit = () => {
    if (isSaveEnabled) {
      // Here the data would be saved/sent
      Alert.alert(
        "Success",
        "Your case study has been created successfully!",
        [
          { 
            text: "OK", 
            onPress: () => router.push('/') 
          }
        ]
      );
    } else {
      if (!isPricingValid) {
        Alert.alert(
          "Price information required",
          "Please provide pricing information before saving."
        );
      } else {
        Alert.alert(
          "Incomplete inputs",
          "Please fill all fields with the minimum number of characters."
        );
      }
    }
  };

  // Context for Olivia
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
  
  // Pricing Modal
  const handlePricingOpen = () => {
    setPricingModalVisible(true);
  };
  
  const handlePricingSave = (pricing: string) => {
    setPricingInfo(pricing);
  };
  
  const handlePricingClose = () => {
    setPricingModalVisible(false);
  };

  // KeyboardToolbar Actions
  const toolbarActions: ToolbarAction[] = [
    {
      id: 'context',
      icon: 'information-circle-outline',
      label: 'Context',
      onPress: handleContextForOlivia,
      accessibilityLabel: t('casestudy.contextModal.title')
    },
    {
      id: 'pricing',
      icon: 'logo-usd',
      label: 'Pricing',
      onPress: handlePricingOpen,
      disabled: false,
      selected: isPricingValid,
      accessibilityLabel: 'Pricing options'
    },
    {
      id: 'preview',
      icon: 'eye-outline',
      label: 'Preview',
      onPress: () => {
        // TODO: Generate case study preview with AI
        Alert.alert(
          "Preview wird generiert",
          "Die KI erstellt aus deinen Stichpunkten eine vollständige Fallstudie...",
          [{ text: "OK" }]
        );
      },
      disabled: !isFormValid,
      accessibilityLabel: 'Fallstudie-Preview generieren'
    },
    {
      id: 'save',
      icon: 'bookmark-outline',
      label: 'Speichern',
      onPress: handleSubmit,
      disabled: !isSaveEnabled,
      accessibilityLabel: 'Stichpunkte speichern'
    }
  ];

  const renderInputField = (
    label: string,
    description: string,
    value: string,
    setValue: (text: string) => void,
    placeholder: string,
    isLarge: boolean = false,
    isSeparator: boolean = true
  ) => {
    return (
      <View style={[styles.fieldContainer, isSeparator && styles.separator]}>
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
                borderColor: colors.backgroundTertiary,
              }
            ]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            multiline
            textAlignVertical="top"
          />
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
            title="Before → After"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Quality Reminder InfoBox */}
          <View style={styles.infoBoxContainer}>
            <InfoBox
              text="Stichpunkte reichen! Sammle die wichtigsten Fakten und Zahlen. Unsere KI erstellt daraus eine professionelle Fallstudie."
              iconName="information-circle-outline"
              iconColor={colors.primary}
              backgroundColor={`${colors.primary}10`}
              textColor={colors.textSecondary}
            />
          </View>

          {/* All Input Fields in One Card */}
          <View style={[styles.inputCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.backgroundTertiary }]}>
            {/* Headline */}
            {renderInputField(
              "Headline",
              "Kurzer, ergebnisorientierter Titel",
              headline,
              setHeadline,
              "z.B. Holdingstruktur spart 84.000 € jährlich"
            )}

            {/* Separator */}
            <View style={[styles.separator, { backgroundColor: colors.backgroundTertiary }]} />

            {/* Initial Situation */}
            {renderInputField(
              "Ausgangssituation",
              "Stichpunkte zur Problemstellung",
              initialSituation,
              setInitialSituation,
              "• Problem XY\n• Kosten zu hoch\n• Ineffiziente Prozesse"
            )}

            {/* Separator */}
            <View style={[styles.separator, { backgroundColor: colors.backgroundTertiary }]} />

            {/* Implementation */}
            {renderInputField(
              "Umsetzung",
              "Wichtigste Schritte und Maßnahmen",
              implementation,
              setImplementation,
              "• Schritt 1: ...\n• Herausforderung: ...\n• Lösung: ..."
            )}

            {/* Separator */}
            <View style={[styles.separator, { backgroundColor: colors.backgroundTertiary }]} />

            {/* Results */}
            {renderInputField(
              "Ergebnis",
              "Konkrete Zahlen und Erfolge",
              results,
              setResults,
              "• 84.000 € Ersparnis\n• 30% weniger Aufwand\n• Prozess optimiert"
            )}

            {/* Separator */}
            <View style={[styles.separator, { backgroundColor: colors.backgroundTertiary }]} />

            {/* ROI Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
                Return on Investment (ROI)
                <Text style={[styles.optionalText, { color: colors.textTertiary }]}> (Optional)</Text>
              </Text>
              <Text style={[styles.fieldDescription, { color: colors.textSecondary }]}>
                Finanzielle Kennzahlen und ROI-Daten
              </Text>
              
              {/* InfoBox with conversion tip */}
              <View style={styles.roiInfoContainer}>
                <InfoBox
                  text="Fallstudien mit klarem ROI konvertieren ca. 12x besser"
                  iconName="trending-up-outline"
                  iconColor={colors.primary}
                  backgroundColor={`${colors.primary}15`}
                  textColor={colors.textSecondary}
                />
              </View>
              
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.textInputInCard,
                    { 
                      backgroundColor: colors.backgroundPrimary,
                      color: colors.textPrimary,
                    }
                  ]}
                  value={roi}
                  onChangeText={setRoi}
                  placeholder="• 300% ROI in 18 Monaten\n• 240.000 € jährliche Ersparnis\n• Break-even nach 6 Monaten"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* KeyboardToolbar with KeyboardAvoidingView for keyboard movement */}
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
      
      {/* Pricing Modal */}
      <ContextModal
        visible={pricingModalVisible}
        onClose={handlePricingClose}
        onSave={handlePricingSave}
        initialValue={pricingInfo}
        title={t('casestudy.pricingModal.title')}
        infoTitle={t('casestudy.pricingModal.infoTitle')}
        infoDescription={t('casestudy.pricingModal.infoDescription')}
        infoExamples={t('casestudy.pricingModal.infoExamples')}
        placeholder={t('casestudy.pricingModal.placeholder')}
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
  fieldContainer: {
    marginBottom: 0,
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
    borderWidth: 1,
    borderRadius: ui.borderRadius.s,
    paddingTop: spacing.m,
    paddingLeft: spacing.m,
    paddingRight: spacing.m,
    paddingBottom: spacing.m,
    fontSize: typography.fontSize.m,
    minHeight: 80,
    marginBottom: 0,
  },
  textInputLarge: {
    minHeight: 120,
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
  roiInfoContainer: {
    marginBottom: spacing.m,
  },
  optionalText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular as any,
  },
  infoBoxContainer: {
    marginBottom: spacing.xl,
  },
  inputCard: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    padding: spacing.l,
    marginBottom: spacing.xl,
  },
  separator: {
    height: 1,
    marginVertical: spacing.l,
  },
  textInputInCard: {
    borderWidth: 0,
    borderRadius: ui.borderRadius.s,
    paddingTop: spacing.m,
    paddingLeft: spacing.m,
    paddingRight: spacing.m,
    paddingBottom: spacing.m,
    fontSize: typography.fontSize.m,
    minHeight: 80,
    marginBottom: 0,
  },
}); 