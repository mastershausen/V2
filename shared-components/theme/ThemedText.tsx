/**
 * ThemedText
 * 
 * Eine erweiterte Text-Komponente, die automatisch die richtigen Farben und Stile für das aktuelle Theme verwendet.
 */
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';


import { typography } from '@/config/theme';
import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedProps } from './Theme';

// Font weight Typ-Definition, die ReactNative unterstützt
type FontWeight = TextStyle['fontWeight'];

/**
 * Erweiterte Eigenschaften für ThemedText-Komponente
 */
export interface ThemedTextProps extends TextProps, ThemedProps {
  variant?: 'body' | 'title' | 'subtitle' | 'caption' | 'button';
  secondary?: boolean;
  weight?: 'normal' | 'bold' | 'semibold' | 'light';
}

/**
 * Hook zur Bestimmung der Textfarbe basierend auf dem aktuellen Theme
 * @param lightColor - Optional, spezifische Farbe für den Light-Mode
 * @param darkColor - Optional, spezifische Farbe für den Dark-Mode
 * @param isSecondary - Ob der sekundäre Textstil verwendet werden soll
 * @returns Textfarbe als String
 */
function useTextColor(lightColor?: string, darkColor?: string, isSecondary = false): string {
  // Holen wir uns zuerst die Standard-Farben
  const colors = useThemeColor();
  
  // Wenn benutzerdefinierte Farben angegeben sind, verwende diese
  if (lightColor || darkColor) {
    const colorScheme = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
        
    // Wähle die passende benutzerdefinierte Farbe oder einen Fallback
    return colorScheme === 'dark' && darkColor 
      ? darkColor 
      : lightColor || colors.textPrimary;
  }
  
  // Standard-Farbelogik für primäre und sekundäre Textfarben
  return isSecondary ? colors.textSecondary : colors.textPrimary;
}

/**
 * ThemedText - eine Text-Komponente, die auf das aktuelle Farbschema reagiert
 * @param root0
 * @param root0.style
 * @param root0.lightColor
 * @param root0.darkColor
 * @param root0.secondary
 * @param root0.variant
 * @param root0.weight
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  secondary = false,
  variant = 'body',
  weight = 'normal',
  ...otherProps
}: ThemedTextProps) {
  // Bestimme die Textfarbe basierend auf dem aktuellen Farbschema
  const color = useTextColor(lightColor, darkColor, secondary);
  
  // Bestimme die Schriftgröße und -gewicht basierend auf der Variante
  let fontSize = typography.fontSize.m;
  let fontWeight: FontWeight = typography.fontWeight.regular as FontWeight;
  
  // Varianten-Einstellungen
  switch (variant) {
    case 'title':
      fontSize = typography.fontSize.title;
      fontWeight = typography.fontWeight.bold as FontWeight;
      break;
    case 'subtitle':
      fontSize = typography.fontSize.l;
      fontWeight = typography.fontWeight.medium as FontWeight;
      break;
    case 'caption':
      fontSize = typography.fontSize.s;
      break;
    case 'button':
      fontSize = typography.fontSize.m;
      fontWeight = typography.fontWeight.medium as FontWeight;
      break;
  }
  
  // Gewicht-Einstellungen
  switch (weight) {
    case 'bold':
      fontWeight = typography.fontWeight.bold as FontWeight;
      break;
    case 'semibold':
      fontWeight = typography.fontWeight.semiBold as FontWeight;
      break;
    case 'light':
      fontWeight = typography.fontWeight.regular as FontWeight; // 'light' nicht verfügbar, fallback zu regular
      break;
  }
  
  return (
    <Text
      style={[
        { color, fontSize, fontWeight, fontFamily: typography.fontFamily.default },
        style
      ]}
      {...otherProps}
    />
  );
} 