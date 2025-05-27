import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { InfoBox } from '@/shared-components/ui/InfoBox';
import { FirstTimeInfoBox } from '@/shared-components/ui/FirstTimeInfoBox';
import { QualityReminderBox } from '@/shared-components/ui/QualityReminderBox';
import { KeyboardToolbar, ToolbarAction } from '@/shared-components/navigation/KeyboardToolbar';
import { ContextModal } from '@/shared-components/modals/ContextModal';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFirstTimeVisit } from '@/hooks/useFirstTimeVisit';

// Minimum characters for input validation
const MIN_CHARS = {
  headline: 10,
  investmentContext: 50,
  strategyApproach: 50,
  implementation: 50,
  riskManagement: 50,
  roi: 50
};

/**
 * IntelligentInvestmentsFrame Screen - "Intelligent Investments" frame for case studies
 * Form for creating a case study focused on strategic investments with high ROI
 */
export default function IntelligentInvestmentsFrameScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { isFirstVisit, isLoading, markAsVisited } = useFirstTimeVisit('intelligentInvestmentsFrame');
  const { t } = useTranslation();
  
  // Form fields
  const [headline, setHeadline] = useState('');
  const [investmentContext, setInvestmentContext] = useState('');
  const [strategyApproach, setStrategyApproach] = useState('');
  const [implementation, setImplementation] = useState('');
  const [riskManagement, setRiskManagement] = useState('');
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
    investmentContext: false,
    strategyApproach: false,
    implementation: false,
    riskManagement: false,
    roi: false
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
      investmentContext: investmentContext.length < MIN_CHARS.investmentContext,
      strategyApproach: strategyApproach.length < MIN_CHARS.strategyApproach,
      implementation: implementation.length < MIN_CHARS.implementation,
      riskManagement: riskManagement.length < MIN_CHARS.riskManagement,
      roi: roi.length < MIN_CHARS.roi
    };
    
    setErrors(newErrors);
    setIsFormValid(!Object.values(newErrors).some(error => error));
  }, [headline, investmentContext, strategyApproach, implementation, riskManagement, roi]);
  
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
      id: 'save',
      icon: 'checkmark-circle-outline',
      label: 'Save',
      onPress: handleSubmit,
      disabled: !isSaveEnabled,
      accessibilityLabel: t('casestudy.toolbar.save')
    }
  ];

  // Create progress bar for text length
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
            (Minimum {minChars} characters)
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
            title="Intelligent Investments"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.introContainer}>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Showcase strategic investments with significant ROI.
            </Text>
          </View>
          
          {/* Input hints */}
          <View style={styles.infoBoxContainer}>
            {/* First visit InfoBox - only once */}
            {!isLoading && isFirstVisit && (
              <View style={styles.firstTimeInfoContainer}>
                <FirstTimeInfoBox 
                  text={t('ui.firstTimeInfo.inputFieldsStructure')}
                  onUnderstood={markAsVisited}
                  iconName="information-circle-outline"
                />
              </View>
            )}
            
            {/* Quality reminder - always visible */}
            <QualityReminderBox />
          </View>

          {/* Input fields with consistent style */}
          {renderInputField(
            "Headline",
            "Result-oriented headline for your investment case study",
            headline,
            setHeadline,
            "e.g. Strategic IT investment increases efficiency by 47%",
            MIN_CHARS.headline
          )}

          {renderInputField(
            "Investment Context",
            "What was the business context for the investment?",
            investmentContext,
            setInvestmentContext,
            "Describe the initial situation and the reason for investment...",
            MIN_CHARS.investmentContext,
            true
          )}

          {renderInputField(
            "Strategy & Approach",
            "What was the investment strategy and your approach?",
            strategyApproach,
            setStrategyApproach,
            "Explain your strategic considerations and planning...",
            MIN_CHARS.strategyApproach,
            true
          )}

          {renderInputField(
            "Implementation",
            "How was the investment implemented? Include timeline and resources.",
            implementation,
            setImplementation,
            "Describe the implementation process in detail...",
            MIN_CHARS.implementation,
            true
          )}

          {renderInputField(
            "Risk Management",
            "How were risks identified and managed?",
            riskManagement,
            setRiskManagement,
            "Explain risk assessment and mitigation strategies...",
            MIN_CHARS.riskManagement,
            true
          )}

          {renderInputField(
            "Return on Investment",
            "What was the measurable ROI? Include financial metrics.",
            roi,
            setRoi,
            "Detail the financial returns and other benefits realized...",
            MIN_CHARS.roi,
            true
          )}
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