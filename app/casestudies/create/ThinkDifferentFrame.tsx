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
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/config';

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

// Minimum character counts for different fields
const MIN_CHARS = {
  headline: 30,
  initialSituation: 200,
  analysis: 200,
  implementation: 300,
  results: 150
};

/**
 * ThinkDifferentFrame Screen - "Thinking Outside the Box" frame for case studies
 * Form for creating a case study with creative, unexpected solution approach
 */
export default function ThinkDifferentFrameScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { isFirstVisit, isLoading, markAsVisited } = useFirstTimeVisit('thinkDifferentFrame');
  const { t } = useTranslation();
  
  // Form fields
  const [headline, setHeadline] = useState('');
  const [initialSituation, setInitialSituation] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [implementation, setImplementation] = useState('');
  const [results, setResults] = useState('');

  // Context Modal State
  const [contextModalVisible, setContextModalVisible] = useState(false);
  const [contextForOlivia, setContextForOlivia] = useState('');

  // State for validation errors
  const [errors, setErrors] = useState({
    headline: false,
    initialSituation: false,
    analysis: false,
    implementation: false,
    results: false
  });

  // State for form validity
  const [isValid, setIsValid] = useState(false);

  // Update validation when input fields change
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

  // Submit form
  const handleSubmit = () => {
    if (isValid) {
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
      Alert.alert(
        "Incomplete inputs",
        "Please fill all fields with the minimum number of characters."
      );
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

  // KeyboardToolbar Actions
  const toolbarActions: ToolbarAction[] = [
    {
      id: 'context',
      icon: 'information-circle-outline',
      label: t('casestudy.contextModal.title'),
      onPress: handleContextForOlivia,
      accessibilityLabel: t('casestudy.contextModal.title')
    },
    {
      id: 'currency',
      icon: i18n.language === 'de' ? 'logo-euro' : 'logo-usd',
      label: i18n.language === 'de' ? '€' : '$',
      onPress: () => {},
      accessibilityLabel: i18n.language === 'de' ? 'Euro' : 'Dollar'
    },
    {
      id: 'save',
      icon: 'checkmark-circle-outline',
      label: t('casestudy.toolbar.save'),
      onPress: handleSubmit,
      disabled: !isValid,
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
            title="Thinking Outside the Box"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.introContainer}>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Present a creative, unexpected solution approach.
            </Text>
          </View>
          
          {/* Input hints */}
          <View style={styles.infoBoxContainer}>
            {/* First visit InfoBox - only once */}
            {!isLoading && isFirstVisit && (
              <View style={styles.firstTimeInfoContainer}>
                <FirstTimeInfoBox 
                  text="The input fields are only for structure. The text entered will be displayed as a flowing text with structured view later."
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
            "What was implemented or activated?",
            headline,
            setHeadline,
            "e.g. Unusual Tax Optimization through Art Collection",
            MIN_CHARS.headline
          )}

          {renderInputField(
            "Initial Situation",
            "What was there? What was missing? What was not visible?",
            initialSituation,
            setInitialSituation,
            "Describe the original situation and what was not obvious...",
            MIN_CHARS.initialSituation,
            true
          )}

          {renderInputField(
            "Analysis / Idea",
            "How was the potential or solution recognized?",
            analysis,
            setAnalysis,
            "Explain the thinking process and how the creative solution came about...",
            MIN_CHARS.analysis,
            true
          )}

          {renderInputField(
            "Implementation",
            "What was done? Including problems, hurdles, turning points.",
            implementation,
            setImplementation,
            "Describe the implementation with all challenges...",
            MIN_CHARS.implementation,
            true
          )}

          {renderInputField(
            "Result",
            "What is the concrete result?",
            results,
            setResults,
            "Describe the concrete result of the creative solution...",
            MIN_CHARS.results,
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