import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import { ui } from '@/config/theme/ui';

interface BottomTabIconProps {
  name: 'home' | 'folder' | 'chat' | 'ai' | 'settings' | 'search' | 'upload';
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Mapping der Tab-Namen zu Ionicons-Namen
 * @param name
 */
const getIconName = (name: BottomTabIconProps['name']): keyof typeof Ionicons.glyphMap => {
  switch (name) {
    case 'home':
      return 'home';
    case 'folder':
      return 'folder';
    case 'chat':
      return 'chatbubble';
    case 'ai':
      return 'flash'; // Fallback für Ionicons
    case 'settings':
      return 'settings';
    case 'search':
      return 'search';
    case 'upload':
      return 'add-circle';
    default:
      return 'help-circle';
  }
};

/**
 * Icon-Komponente für die untere Tab-Navigation
 * @param root0
 * @param root0.name
 * @param root0.color
 * @param root0.size
 * @param root0.style
 */
export function BottomTabIcon({ 
  name, 
  color, 
  size = ui.icon.large,
  style
}: BottomTabIconProps) {
  const iconName = getIconName(name);
  
  // Spezieller Fall für AI-Icon, verwende MaterialCommunityIcons
  // Verwende "semantic-web"-Icon, um Vernetzung und Kommunikation darzustellen
  if (name === 'ai') {
    return (
      <View style={style} accessible={true} accessibilityRole="image" accessibilityLabel={name}>
        <MaterialCommunityIcons 
          name="semantic-web" 
          color={color}
          size={size}
        />
      </View>
    );
  }
  
  // Standard-Fall: Ionicons verwenden
  return (
    <View style={style} accessible={true} accessibilityRole="image" accessibilityLabel={name}>
      <Ionicons 
        name={iconName} 
        color={color}
        size={size}
      />
    </View>
  );
} 