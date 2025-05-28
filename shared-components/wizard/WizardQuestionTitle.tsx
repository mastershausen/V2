import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WizardQuestionTitleProps {
  /**
   * Der Text der Überschrift
   */
  children: string;
  /**
   * Benutzerdefinierte Text-Styles
   */
  style?: object;
}

/**
 * WizardQuestionTitle - Wiederverwendbare Hauptüberschrift für Wizard-Fragen
 * 
 * Zeigt den Titel einer Wizard-Frage mit konsistentem Styling an.
 * Passt sich automatisch an das aktuelle Theme an.
 */
export function WizardQuestionTitle({ children, style }: WizardQuestionTitleProps) {
  const colors = useThemeColor();
  
  return (
    <Text style={[
      styles.questionTitle, 
      { color: colors.textPrimary }, 
      style
    ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16, // spacing.m
    lineHeight: 32,
  },
}); 