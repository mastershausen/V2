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

interface Wizard5Props {
  onOpenSidebar?: () => void;
}

export default function Wizard5({ onOpenSidebar }: Wizard5Props) {
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
      // Navigation zu Wizard6
      router.push('/wizard6');
    }
  };

  const isValid = answer.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('wizard5.headerTitle')}
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
        <WizardProgressBar currentStep={5} totalSteps={8} />

        {/* Question Section */}
        <WizardQuestionContainer
          title={t('wizard5.questionTitle')}
          subtitle={t('wizard5.questionSubtitle')}
        />

        {/* Input Section */}
        <WizardTextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder={t('wizard5.placeholder')}
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