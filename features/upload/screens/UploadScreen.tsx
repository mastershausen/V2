import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

interface UploadScreenProps {
  onOpenSidebar?: () => void;
}

export default function UploadScreen({ onOpenSidebar }: UploadScreenProps) {
  const colors = useThemeColor();
  const router = useRouter();

  const handleCreateCaseStudy = () => {
    // Navigation zu Wizard1
    router.push('/wizard1');
  };

  const handleBackPress = () => {
    if (onOpenSidebar) {
      onOpenSidebar();
    } else {
      router.push('/');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header Navigation */}
      <HeaderNavigation 
        title="Create Case Study"
        onBackPress={handleBackPress}
        showBackButton={true}
      />
      
      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.ctaContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleCreateCaseStudy}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2A8A6B', '#1E6B55', '#164A42']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Ionicons 
                  name="add" 
                  size={48} 
                  color="white" 
                  style={styles.iconShadow}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    // Echter 3D-Schatten
    shadowColor: '#164A42',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    // Android Shadow
    elevation: 15,
    // Transform für 3D-Effekt
    transform: [{ translateY: -2 }],
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
  },
  iconShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
}); 