import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  StyleProp,
} from 'react-native';

import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SettingsIconProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
  color?: string;
}

/**
 * Zahnrad-Icon, das als Button fungiert und zum Einstellungen-Screen führt
 * Nur im Live-Mode sichtbar
 * @param {Function} [onPress] - Benutzerdefinierte Callback-Funktion für den Button-Press
 * @param {StyleProp<ViewStyle>} [style] - Zusätzliche Stile für das Icon
 * @param {number} [size] - Größe des Icons (optional, Default: 24)
 * @param {string} [color] - Farbe des Icons (optional, verwendet standardmäßig die primäre Textfarbe)
 * @returns {React.ReactElement} Die gerenderte SettingsIcon-Komponente oder null im Demo-Modus
 */
export function SettingsIcon({ 
  onPress, 
  style, 
  size = 24,
  color,
}: SettingsIconProps) {
  const colors = useThemeColor();
  const router = useRouter();
  const { isDemoMode } = useMode();
  
  // Im Demo-Modus zeigen wir das Settings-Icon nicht an
  if (isDemoMode()) {
    return null;
  }
  
  // Standard-Callback für onPress, wenn nicht anders angegeben
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Standard: Navigiere zum Einstellungen-Screen
      router.push('/settings');
    }
  };
  
  // Verwende die übergebene Farbe oder die Standard-Textfarbe aus dem Theme
  const iconColor = color || colors.textPrimary;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel="Einstellungen"
      accessibilityRole="button"
    >
      <Ionicons 
        name="settings-outline" 
        size={size} 
        color={iconColor} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8, // Bietet eine größere Touchable-Fläche
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 