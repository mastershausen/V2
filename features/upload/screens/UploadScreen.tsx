import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';

interface UploadScreenProps {
  onOpenSidebar?: () => void;
}

export default function UploadScreen({ onOpenSidebar }: UploadScreenProps) {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Animationen
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Subtile Pulsation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  const handleBackPress = () => {
    if (onOpenSidebar) {
      onOpenSidebar();
    } else {
      router.push('/');
    }
  };

  const handleCreateCaseStudy = () => {
    // Hier wird später der Wizard gestartet
    console.log('🚀 Case Study Wizard starten');
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header Navigation */}
      <HeaderNavigation 
        title="Create Case Study"
        onBackPress={handleBackPress}
        showBackButton={true}
      />
      
      {/* Content */}
      <View style={styles.content}>
        {/* 3D CTA Button */}
        <View style={styles.ctaContainer}>
          {/* Main Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [
                  { scale: Animated.multiply(scaleAnim, pulseAnim) }
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleCreateCaseStudy}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <LinearGradient
                colors={['#2A8A6B', '#1E6B55', '#164A42']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {/* Inner Highlight */}
                <View style={styles.innerHighlight} />
                
                {/* Plus Icon */}
                <Ionicons 
                  name="add" 
                  size={48} 
                  color="white" 
                  style={styles.plusIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Subtitle */}
          <Text style={[styles.ctaText, { color: colors.textSecondary }]}>
            Neue Case Study erstellen
          </Text>
        </View>
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
  ctaContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'relative',
  },
  ctaButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: spacing.l,
    // iOS Shadow
    shadowColor: '#1E6B55',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // Android Shadow
    elevation: 12,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerHighlight: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    height: 25,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  plusIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.s,
  },
}); 