import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import FallstudieDetail from '@/features/chats/components/FallstudieDetail';

// Mock KI-generierte Fallstudie für Demo
const mockKIFallstudie = {
  id: 'ki-generated-1',
  titel: 'Digitale Transformation im E-Commerce',
  kurzbeschreibung: 'KI-optimierte Lösung zur Steigerung der Conversion Rate durch personalisierte Produktempfehlungen und automatisierte Kundenanalyse.',
  context: 'Ein mittelständisches E-Commerce-Unternehmen im Bereich Mode und Lifestyle kämpfte mit sinkenden Conversion Rates und hohen Warenkorbabbrüchen. Trotz steigendem Website-Traffic konnten die Umsätze nicht proportional gesteigert werden. Das bestehende Empfehlungssystem war veraltet und konnte individuelle Kundenpräferenzen nicht effektiv erfassen.',
  action: 'Implementierung einer KI-basierten Recommendation Engine mit Machine Learning Algorithmen zur Echtzeitanalyse des Nutzerverhaltens. Integration eines personalisierten Dashboard-Systems für Kunden sowie automatisierte E-Mail-Marketing-Kampagnen basierend auf individuellen Kaufmustern und Browsing-Verhalten.',
  result: {
    text: 'Die Implementierung führte zu messbaren Erfolgen innerhalb der ersten 6 Monate nach dem Go-Live.',
    bulletpoints: [
      '43% Steigerung der Conversion Rate',
      '67% Reduktion der Warenkorbabbrüche', 
      '28% Erhöhung des durchschnittlichen Warenkorbwerts',
      '156% ROI innerhalb des ersten Jahres',
      '89% Kundenzufriedenheit bei personalisierten Empfehlungen'
    ]
  },
  anbieter: {
    name: 'TechSolutions GmbH',
    erfahrung: '8+ Jahre E-Commerce Expertise',
    erfolgsrate: '94% Projekterfolg',
    kontakt: {
      email: 'kontakt@techsolutions.de',
      telefon: '+49 30 12345678'
    }
  },
  isVerified: true
};

export default function CaseStudyCreationSplash() {
  const colors = useThemeColor();
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showFallstudieDetail, setShowFallstudieDetail] = useState(false);

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
      setShowFallstudieDetail(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      pulsing.stop();
    };
  }, [pulseAnim]);

  const handleCloseFallstudie = () => {
    setShowFallstudieDetail(false);
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

      {/* KI-generierte Fallstudie Detail Modal */}
      <FallstudieDetail 
        visible={showFallstudieDetail}
        onClose={handleCloseFallstudie}
        fallstudie={mockKIFallstudie}
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