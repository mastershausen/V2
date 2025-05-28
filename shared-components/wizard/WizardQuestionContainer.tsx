import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WizardQuestionTitle } from './WizardQuestionTitle';
import { WizardQuestionSubtitle } from './WizardQuestionSubtitle';

interface WizardQuestionContainerProps {
  /**
   * Hauptüberschrift der Frage
   */
  title: string;
  /**
   * Unterüberschrift/Beschreibung der Frage
   */
  subtitle: string;
  /**
   * Benutzerdefinierte Container-Styles
   */
  containerStyle?: object;
  /**
   * Benutzerdefinierte Title-Styles
   */
  titleStyle?: object;
  /**
   * Benutzerdefinierte Subtitle-Styles
   */
  subtitleStyle?: object;
}

/**
 * WizardQuestionContainer - Container für Frage-Überschrift und -Untertitel
 * 
 * Kombiniert Title und Subtitle in einem semantisch korrekten Container
 * mit konsistentem Spacing.
 */
export function WizardQuestionContainer({ 
  title, 
  subtitle, 
  containerStyle,
  titleStyle,
  subtitleStyle
}: WizardQuestionContainerProps) {
  return (
    <View style={[styles.questionContainer, containerStyle]}>
      <WizardQuestionTitle style={titleStyle}>
        {title}
      </WizardQuestionTitle>
      <WizardQuestionSubtitle style={subtitleStyle}>
        {subtitle}
      </WizardQuestionSubtitle>
    </View>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    paddingBottom: 16, // spacing.l
  },
}); 