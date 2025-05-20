import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  Easing,
  cancelAnimation,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/useThemeColor';

interface CustomSplashScreenProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

/**
 * Ein benutzerdefinierter SplashScreen mit einem Logo und einem Ladebalken
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Ob der SplashScreen sichtbar sein soll
 * @param {Function} props.onAnimationComplete - Callback, der aufgerufen wird, wenn die Animation abgeschlossen ist
 */
export function CustomSplashScreen({ 
  isVisible, 
  onAnimationComplete 
}: CustomSplashScreenProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  
  // Animierte Werte
  const opacity = useSharedValue(isVisible ? 1 : 0);
  const loadingBarWidth = useSharedValue(0);
  
  // Animation starten, wenn der Splashscreen sichtbar ist
  useEffect(() => {
    if (isVisible) {
      // Opacity-Animation (Fade-In)
      opacity.value = withTiming(1, { duration: 200 });
      
      // Loading-Bar-Animation (von 0 bis 100%)
      loadingBarWidth.value = 0;
      loadingBarWidth.value = withTiming(width, { 
        duration: 2000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1.0)
      }, (finished) => {
        if (finished && onAnimationComplete) {
          // Fade-Out wenn die Ladeanimation abgeschlossen ist
          opacity.value = withTiming(0, { 
            duration: 200 
          }, () => {
            // Verwende runOnJS für den Callback, um den UI-Thread nicht zu blockieren
            if (onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
        }
      });
    } else {
      // Wenn nicht sichtbar, Animation abbrechen und ausblenden
      cancelAnimation(loadingBarWidth);
      opacity.value = withTiming(0, { duration: 200 });
    }
    
    // Cleanup bei Unmount
    return () => {
      cancelAnimation(opacity);
      cancelAnimation(loadingBarWidth);
    };
  }, [isVisible, opacity, loadingBarWidth, width, onAnimationComplete]);
  
  // Animierte Styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value === 0 ? 'none' : 'flex',
  }));
  
  const loadingBarStyle = useAnimatedStyle(() => ({
    width: loadingBarWidth.value,
  }));
  
  if (!isVisible && opacity.value === 0) {
    return null;
  }
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        containerStyle,
        { 
          backgroundColor: colors.backgroundPrimary,
          paddingTop: insets.top,
          paddingBottom: insets.bottom
        }
      ]}
    >
      <View style={styles.contentContainer}>
        <Image 
          source={require('@/assets/small rounded Icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={[styles.loadingBarContainer, { backgroundColor: `${colors.primary}20` }]}>
          <Animated.View 
            style={[
              styles.loadingBar,
              loadingBarStyle,
              { backgroundColor: colors.primary }
            ]} 
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  loadingBarContainer: {
    width: '60%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
  }
}); 