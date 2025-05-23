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
  ideaGoal: 200,
  implementation: 300,
  marketEntry: 200,
  results: 150
};

/**
 * NewStuffFrame Screen - "Creating Something New" frame for case studies
 * Form for creating a case study with innovative concept or new solution
 */
export default function NewStuffFrameScreen() {
  const colors = useThemeColor();
  
  // Form fields
  const [headline, setHeadline] = useState('');
  const [ideaGoal, setIdeaGoal] = useState('');
  const [implementation, setImplementation] = useState('');
  const [marketEntry, setMarketEntry] = useState('');
  const [results, setResults] = useState('');

  // Context Modal State
  const [contextModalVisible, setContextModalVisible] = useState(false);
  const [contextForOlivia, setContextForOlivia] = useState('');

  // State for validation errors
  const [errors, setErrors] = useState({
    headline: false,
    ideaGoal: false,
    implementation: false,
    marketEntry: false,
    results: false
  });

  // State for form validity
  const [isValid, setIsValid] = useState(false);

  // Update validation when input fields change
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
      label: 'Context for Olivia',
      onPress: handleContextForOlivia,
      accessibilityLabel: 'Context for Olivia'
    },
    {
      id: 'save',
      icon: 'checkmark-circle-outline',
      label: 'Save Case Study',
      onPress: handleSubmit,
      disabled: !isValid,
      accessibilityLabel: 'Save Case Study'
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
            title="Creating Something New"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.introContainer}>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Present an innovative concept or a new solution.
            </Text>
          </View>
          
          {/* Info box */}
          <View style={styles.infoBoxContainer}>
            <InfoBox 
              text="The input fields are only for structure. The entered text will be displayed later as a flowing text with structured view."
              backgroundColor={`${colors.primary}10`}
              iconColor={colors.primary}
              textColor={colors.textSecondary}
              iconName="information-circle-outline"
            />
          </View>

          {/* Input fields with consistent style */}
          {renderInputField(
            "Headline",
            "What was concretely realized or launched?",
            headline,
            setHeadline,
            "e.g. Digital Tax Consulting App revolutionizes Industry",
            MIN_CHARS.headline
          )}

          {renderInputField(
            "Idea / Goal",
            "What was the vision or intention?",
            ideaGoal,
            setIdeaGoal,
            "Describe the original vision and the goals of the project...",
            MIN_CHARS.ideaGoal,
            true
          )}

          {renderInputField(
            "Implementation",
            "How did the construction go? What went well, what was difficult?",
            implementation,
            setImplementation,
            "Explain the development process with successes and challenges...",
            MIN_CHARS.implementation,
            true
          )}

          {renderInputField(
            "Market Entry / Rollout",
            "How was everything brought into the world?",
            marketEntry,
            setMarketEntry,
            "Describe the market entry and rollout strategy...",
            MIN_CHARS.marketEntry,
            true
          )}

          {renderInputField(
            "Result",
            "What was the measurable output or effect?",
            results,
            setResults,
            "Describe the specific results and impacts...",
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
}); 