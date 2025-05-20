import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  StyleProp,
  View,
  Dimensions
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

// Bildschirmabmessungen für bessere Positionierung
const { width, height } = Dimensions.get('window');

interface RatingPlusButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

/**
 * Schwebender Plus-Button für das Hinzufügen von Bewertungen
 * Funktioniert auch im Demo-Mode
 */
export function RatingPlusButton({ 
  onPress, 
  style, 
  size = 56
}: RatingPlusButtonProps) {
  const colors = useThemeColor();
  
  // Verwende dunklere Pastellfarben für mehr Kontrast
  const backgroundColor = `${colors.primary}30`; // 30% Opazität für dunkleren Pastell-Look
  const borderColor = `${colors.primary}60`;    // 60% Opazität für dunkleren Rand
  
  // Dynamische Styles basierend auf der Größe
  const buttonStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1.5, // Dickerer Rand für bessere Sichtbarkeit
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    // Verstärkter Schatten für besseren schwebenden Effekt
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    elevation: 6,
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={onPress}
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel="Neue Bewertung hinzufügen"
        accessibilityRole="button"
      >
        <Ionicons 
          name="add" 
          size={size * 0.5} 
          color={colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.m,
    bottom: 15, // Niedriger Wert für Position direkt über der Tab-Bar
    zIndex: 1000,
    elevation: 10,
    width: 56,
    height: 56,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
}); 