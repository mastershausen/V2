/**
 * ThemedView
 * 
 * Eine erweiterte View-Komponente, die automatisch die richtigen Farben für das aktuelle Theme verwendet.
 */
import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';

import { useElementColor } from '@/hooks/ui/useThemeColor';

import { ThemedProps } from './Theme';



export interface ThemedViewProps extends ViewProps, ThemedProps {
  variant?: 'default' | 'card' | 'secondary' | 'tertiary';
}

/**
 * ThemedView - eine View, die auf das aktuelle Farbschema reagiert
 * @param {object} root0 - Die Komponentenprops
 * @param {StyleProp<ViewStyle>} [root0.style] - Optional, benutzerdefinierte Styles für die View
 * @param {string} [root0.lightColor] - Optional, spezifische Farbe für den Light-Mode
 * @param {string} [root0.darkColor] - Optional, spezifische Farbe für den Dark-Mode
 * @param {string} [root0.variant] - Optional, Variante der View ('default', 'card', 'secondary', 'tertiary')
 * @returns {React.ReactElement} Die gerenderte ThemedView-Komponente
 */
export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'default',
  ...otherProps
}: ThemedViewProps) {
  // Bestimme die verwendete Farbe basierend auf dem Variant und dem aktuellen Farbschema
  let defaultLightColor, defaultDarkColor;
  
  switch (variant) {
    case 'card':
      defaultLightColor = 'white';
      defaultDarkColor = '#1C1D1F';
      break;
    case 'secondary':
      defaultLightColor = '#F8F8F8';
      defaultDarkColor = '#2C2C2E';
      break;
    case 'tertiary':
      defaultLightColor = '#F0F0F0';
      defaultDarkColor = '#3A3A3C';
      break;
    default:
      defaultLightColor = 'white';
      defaultDarkColor = '#151718';
  }
  
  const backgroundColor = useElementColor(
    lightColor || defaultLightColor,
    darkColor || defaultDarkColor
  );
  
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
} 