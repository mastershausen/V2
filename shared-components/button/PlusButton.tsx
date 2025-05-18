import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  StyleProp,
  View
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { ui } from '@/config/theme/ui';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PlusButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
  bottomOffset?: number;
}

/**
 * Schwebender Plus-Button für das Hochladen von Inhalten
 * Nur im Live-Mode sichtbar
 * @param onPress.onPress
 * @param onPress - Callback-Funktion für den Button-Press
 * @param style - Zusätzliche Styles für den Button
 * @param size - Größe des Buttons (optional)
 * @param bottomOffset - Abstand von unten (optional)
 * @param onPress.style
 * @param onPress.size
 * @param onPress.bottomOffset
 */
export function PlusButton({ 
  onPress, 
  style, 
  size = 56,
  bottomOffset = 16 // Standard-Abstand über der TabBar auf 16px reduziert
}: PlusButtonProps) {
  const colors = useThemeColor();
  const { isDemoMode } = useMode();
  
  // Wenn wir im Demo-Modus sind, zeigen wir den Button nicht an
  if (isDemoMode()) {
    return null;
  }
  
  // Dynamische Styles basierend auf der Größe
  const buttonStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.primary,
    // Schatten für den schwebenden Effekt
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <View style={[styles.container, { bottom: bottomOffset }, style]}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={onPress}
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel="Neuen Inhalt hinzufügen"
        accessibilityRole="button"
      >
        <Ionicons 
          name="add" 
          size={size * 0.5} 
          color={colors.backgroundPrimary} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.m,
    alignSelf: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 