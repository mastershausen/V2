import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  infoText?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  infoStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
}

/**
 * Wiederverwendbare Formularfeld-Komponente
 * Kombiniert Label, TextInput und optionale Fehleranzeige/Hilfstexte in einem
 * konsistenten Layout. Unterstützt einzeilige Eingabefelder und mehrzeilige Textbereiche.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {string} props.label - Beschriftung des Formularfelds
 * @param {string} [props.error] - Fehlermeldung (wird rot angezeigt)
 * @param {string} [props.infoText] - Zusätzlicher Hinweistext unter dem Label
 * @param {ViewStyle} [props.containerStyle] - Benutzerdefinierte Stile für den Container
 * @param {TextStyle} [props.labelStyle] - Benutzerdefinierte Stile für das Label
 * @param {TextStyle} [props.inputStyle] - Benutzerdefinierte Stile für das Eingabefeld
 * @param {TextStyle} [props.errorStyle] - Benutzerdefinierte Stile für den Fehlertext
 * @param {TextStyle} [props.infoStyle] - Benutzerdefinierte Stile für den Infotext
 * @param {boolean} [props.multiline] - Gibt an, ob mehrere Zeilen erlaubt sind
 * @param {number} [props.numberOfLines] - Anzahl der Zeilen bei mehrzeiliger Eingabe
 * @returns {React.ReactElement} Die gerenderte FormField-Komponente
 */
export function FormField({
  label,
  error,
  infoText,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  infoStyle,
  multiline,
  numberOfLines,
  ...inputProps
}: FormFieldProps) {
  const colors = useThemeColor();
  
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[
        styles.label, 
        { color: colors.textSecondary },
        labelStyle
      ]}>
        {label}
      </Text>
      
      {infoText && (
        <Text style={[
          styles.infoText, 
          { color: colors.textTertiary },
          infoStyle
        ]}>
          {infoText}
        </Text>
      )}
      
      <TextInput
        style={[
          multiline ? styles.textArea : styles.input,
          { 
            backgroundColor: colors.backgroundTertiary,
            color: colors.textPrimary,
            borderColor: error ? colors.error : colors.divider
          },
          inputStyle
        ]}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
        {...inputProps}
      />
      
      {error && (
        <Text style={[
          styles.errorText,
          { color: colors.error },
          errorStyle
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  label: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.xs,
  },
  input: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    borderWidth: 1,
  },
  textArea: {
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderWidth: 1,
    minHeight: 100,
  },
  infoText: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  }
}); 