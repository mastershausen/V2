import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';

export default function CaseStudyCreationSplash() {
  const colors = useThemeColor();
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    // Nach 5 Sekunden zum FallstudienDetails-Modal weiterleiten
    const timer = setTimeout(() => {
      pulsing.stop();
      // Navigation zum FallstudienDetails-Modal
      router.push('/(modal)/fallstudien-details');
    }, 5000);

    return () => {
      clearTimeout(timer);
      pulsing.stop();
    };
  }, [pulseAnim, router]);

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