import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FloatingChatButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
  iconColor?: string;
  /** 
   * Optionaler Faktor für die Transparenz der Hintergrundfarbe (0-1) 
   * Default: 0.8 (entspricht CC in Hex)
   */
  opacity?: number;
}

/**
 * FloatingChatButton
 * 
 * Ein schwebender Button für Chat-Funktionalität, der typischerweise am unteren Rand des Bildschirms positioniert wird.
 */
export function FloatingChatButton({
  onPress,
  style,
  size = 24,
  iconColor = 'white',
  opacity = 0.8
}: FloatingChatButtonProps) {
  const colors = useThemeColor();
  
  // Berechne Hex-Alpha-Wert basierend auf dem Opacity-Parameter
  const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
  const backgroundColor = `${colors.secondary}${alphaHex}`;
  
  // Immer weißes Icon mit leichter Transparenz
  // Hier setzen wir die Farbe fest auf Weiß, unabhängig von der übergebenen iconColor
  const iconColorWithAlpha = 'rgba(255, 255, 255, 0.95)';

  return (
    <TouchableOpacity
      style={[
        styles.chatButton, 
        { 
          backgroundColor,
          borderColor: colors.secondary,
          borderWidth: 1.5
        }, 
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Chat mit dem Solvbox-Assistenten"
    >
      <Ionicons name="chatbubble" size={size} color={iconColorWithAlpha} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 1000, // Stellt sicher, dass der Button über anderen Elementen liegt
  },
}); 