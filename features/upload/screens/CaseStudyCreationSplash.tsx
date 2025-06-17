import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/useThemeColor';
import EditCasestudyDetailsView from '@/features/chats/components/EditCasestudyDetailsView';

export default function CaseStudyCreationSplash() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showEditCasestudyDetails, setShowEditCasestudyDetails] = useState(false);

  // Mock KI-generierte Fallstudie für Demo - jetzt i18n-kompatibel
  const mockKIFallstudie = {
    id: 'ki-generated-1',
    titel: t('caseStudyCreation.mockCase.title'),
    kurzbeschreibung: t('caseStudyCreation.mockCase.shortDescription'),
    context: t('caseStudyCreation.mockCase.context'),
    action: t('caseStudyCreation.mockCase.action'),
    result: {
      text: t('caseStudyCreation.mockCase.result.text'),
      bulletpoints: [
        t('caseStudyCreation.mockCase.result.bulletpoint1'),
        t('caseStudyCreation.mockCase.result.bulletpoint2'),
        t('caseStudyCreation.mockCase.result.bulletpoint3'),
        t('caseStudyCreation.mockCase.result.bulletpoint4'),
        t('caseStudyCreation.mockCase.result.bulletpoint5')
      ]
    },
    anbieter: {
      name: t('caseStudyCreation.mockCase.provider.name'),
      erfahrung: t('caseStudyCreation.mockCase.provider.experience'),
      erfolgsrate: t('caseStudyCreation.mockCase.provider.successRate'),
      kontakt: {
        email: 'kontakt@techsolutions.de',
        telefon: '+49 30 12345678'
      }
    },
    isVerified: true
  };

  useEffect(() => {
    // Pulsierende Animation starten
    const pulsing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulsing.start();

    // Nach 5 Sekunden KI-generierte Fallstudie anzeigen
    const timer = setTimeout(() => {
      pulsing.stop();
      setShowEditCasestudyDetails(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      pulsing.stop();
    };
  }, [pulseAnim]);

  const handleSaveCasestudy = (editedData: {
    titel: string;
    kurzbeschreibung: string;
    storyText: string;
  }) => {
    console.log('Fallstudie gespeichert:', editedData);
    // Hier könnte eine Save-API-Call oder lokale Speicherung implementiert werden
    setShowEditCasestudyDetails(false);
    // Zurück zur vorherigen Seite navigieren
    router.back();
  };

  const handleCancelEdit = () => {
    setShowEditCasestudyDetails(false);
    // Zurück zur vorherigen Seite navigieren
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <MaterialCommunityIcons 
            name="semantic-web" 
            size={80} 
            color={colors.primary} 
          />
        </Animated.View>
      </View>

      {/* Neue EditCasestudyDetailsView für bearbeitbare KI-generierte Fallstudie */}
      <EditCasestudyDetailsView 
        visible={showEditCasestudyDetails}
        fallstudie={mockKIFallstudie}
        onSave={handleSaveCasestudy}
        onCancel={handleCancelEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 