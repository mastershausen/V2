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
    // Da optional, immer valid - Navigation zur Completion Seite
    console.log('Wizard abgeschlossen! Highlights:', highlights);
    // Hier würde normalerweise zur Completion/Success Seite navigiert werden
    // router.push('/wizard-complete');
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
            Optional - besondere Auszeichnungen, Partner, Testimonials, überraschende Insights, wichtige USPs.
          </WizardQuestionSubtitle>
        </View>

        {/* Hinweis Box */}
        <View style={[styles.hintBox, { 
          backgroundColor: `${colors.primary}08`,
          borderColor: `${colors.primary}20`
        }]}>
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Falls du noch individuelle Highlights oder spezielle Infos hast, die nicht in die anderen Fragen passten – hier deinen USP, Auszeichnungen oder kurze Erfolgsgeschichten eintragen.
          </Text>
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
        title="Abschließen"
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
  hintBox: {
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.l,
  },
  hintText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
}); 