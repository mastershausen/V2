import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';
import { 
  WizardProgressBar, 
  WizardQuestionContainer, 
  WizardTextInput, 
  WizardNextButton 
} from '@/shared-components/wizard';

interface Wizard3Props {
  onOpenSidebar?: () => void;
}

export default function Wizard3({ onOpenSidebar }: Wizard3Props) {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();
  const [answer, setAnswer] = useState('');
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
    if (answer.trim()) {
      // Navigation zu Wizard4
      router.push('/wizard4');
    }
  };

  const isValid = answer.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('wizard3.headerTitle')}
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
        <WizardProgressBar currentStep={3} totalSteps={8} />

        {/* Question Section */}
        <WizardQuestionContainer
          title={t('wizard3.questionTitle')}
          subtitle={t('wizard3.questionSubtitle')}
        />

        {/* Input Section */}
        <WizardTextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder={t('wizard3.placeholder')}
          numberOfLines={4}
          autoFocus={true}
        />
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
}); 