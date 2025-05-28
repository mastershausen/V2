import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WizardProgressBarProps {
  /**
   * Aktueller Schritt (1-8)
   */
  currentStep: number;
  /**
   * Gesamtanzahl der Schritte (standardmäßig 8)
   */
  totalSteps?: number;
  /**
   * Benutzerdefinierte Container-Styles
   */
  containerStyle?: object;
}

/**
 * WizardProgressBar - Wiederverwendbarer Fortschrittsbalken für Wizard-Screens
 * 
 * Zeigt den aktuellen Fortschritt in einem mehrstufigen Prozess an.
 * Der Balken passt sich automatisch an die Anzahl der Schritte an.
 */
export function WizardProgressBar({ 
  currentStep, 
  totalSteps = 8, 
  containerStyle 
}: WizardProgressBarProps) {
  const colors = useThemeColor();
  
  // Berechne den Fortschritt als Prozentsatz
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <View style={[styles.progressContainer, containerStyle]}>
      <View style={[styles.progressBackground, { backgroundColor: colors.inputBorder }]}>
        <View style={[
          styles.progressFill, 
          { 
            backgroundColor: colors.primary, 
            width: `${progressPercentage}%` 
          }
        ]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingBottom: 16, // spacing.l
  },
  progressBackground: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8, // spacing.s
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
}); 