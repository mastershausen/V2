import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WizardQuestionSubtitleProps {
  /**
   * Der Text der Unterüberschrift
   */
  children: string;
  /**
   * Benutzerdefinierte Text-Styles
   */
  style?: object;
}

/**
 * WizardQuestionSubtitle - Wiederverwendbare Unterüberschrift für Wizard-Fragen
 * 
 * Zeigt ergänzende Informationen oder Hinweise zu einer Wizard-Frage an.
 * Passt sich automatisch an das aktuelle Theme an.
 */
export function WizardQuestionSubtitle({ children, style }: WizardQuestionSubtitleProps) {
  const colors = useThemeColor();
  
  return (
    <Text style={[
      styles.questionSubtitle, 
      { color: colors.textSecondary }, 
      style
    ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  questionSubtitle: {
    fontSize: 14,
    lineHeight: 24,
  },
}); 