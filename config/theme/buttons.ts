/**
 * Einheitliche Button-Styles für die Solvbox App
 * 
 * Definiert die Gradienten, Farben und gemeinsamen Styles für alle Buttons
 */

import { StyleSheet } from 'react-native';
import { spacing } from './spacing';
import { typography } from './typography';
import { ui } from './ui';

// Gradienten für verschiedene Button-Typen
export const buttonGradients = {
  // Primär-Button (Hauptfarbe, Petrol)
  primary: {
    colors: ['#1E6B55', '#15503F'] as readonly [string, string],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Success/Verify Button (Grün)
  success: {
    colors: ['#00A041', '#008F39'] as readonly [string, string],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Attention/CTA Button (Gold/Orange)
  attention: {
    colors: ['#FFD700', '#FFA500'] as readonly [string, string],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Danger/Warning Button (Rot)
  danger: {
    colors: ['#FF5252', '#C62828'] as readonly [string, string],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

// Schatten-Eigenschaften für Buttons
export const buttonShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
};

// Gemeinsame Button-Styles
export const buttonStyles = StyleSheet.create({
  container: {
    borderRadius: ui.borderRadius.m,
    overflow: 'hidden',
    ...buttonShadow,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ui.borderRadius.m,
  },
  text: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
    color: '#FFFFFF',
  },
  icon: {
    marginRight: spacing.s,
    color: '#FFFFFF',
  },
  // Disabled state
  disabledContainer: {
    opacity: ui.opacity.disabled,
  },
}); 