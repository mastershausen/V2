import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Keyboard,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';
import { 
  WizardProgressBar, 
  WizardQuestionTitle,
  WizardQuestionSubtitle,
  WizardTextInput,
  WizardNextButton 
} from '@/shared-components/wizard';

interface Wizard8Props {
  onOpenSidebar?: () => void;
}

export default function Wizard8({ onOpenSidebar }: Wizard8Props) {
  const colors = useThemeColor();
  const router = useRouter();
  const [highlights, setHighlights] = useState('');
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
    // Navigation zum Splashscreen
    router.push('/case-study-creation');
    console.log('Wizard abgeschlossen! Highlights:', highlights);
  };

  // Da optional, ist immer valid
  const isValid = true;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="8 von 8 Fragen"
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
        <WizardProgressBar currentStep={8} totalSteps={8} />

        {/* Question Section */}
        <View style={styles.questionContainer}>
          <WizardQuestionTitle>
            Gibt es noch etwas, das du hervorheben möchtest?
          </WizardQuestionTitle>
          
          <WizardQuestionSubtitle>
            Optional - Auszeichnungen, Partner, Testimonials, besondere Insights oder andere Highlights, die noch nicht erwähnt wurden. Je mehr Details, desto aussagekräftiger wird deine Fallstudie!
          </WizardQuestionSubtitle>
        </View>

        {/* Input Section */}
        <WizardTextInput
          value={highlights}
          onChangeText={setHighlights}
          placeholder="z.B. Auszeichnung als 'Innovativste Lösung 2023', Partnerschaft mit Google, 98% Kundenzufriedenheit..."
          numberOfLines={4}
          autoFocus={true}
        />
      </ScrollView>

      {/* Next Button */}
      <WizardNextButton
        onPress={handleNext}
        isEnabled={isValid}
        keyboardHeight={keyboardHeight}
        title="Fallstudie erstellen"
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
}); 