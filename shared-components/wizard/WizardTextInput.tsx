import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WizardTextInputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Der aktuelle Wert des Textfelds
   */
  value: string;
  /**
   * Callback für Textänderungen
   */
  onChangeText: (text: string) => void;
  /**
   * Placeholder-Text
   */
  placeholder?: string;
  /**
   * Ob das Textfeld automatisch fokussiert werden soll
   */
  autoFocus?: boolean;
  /**
   * Anzahl der sichtbaren Zeilen
   */
  numberOfLines?: number;
  /**
   * Benutzerdefinierte Container-Styles
   */
  containerStyle?: object;
  /**
   * Benutzerdefinierte Input-Styles
   */
  inputStyle?: object;
}

/**
 * WizardTextInput - Wiederverwendbares Textfeld für Wizard-Screens
 * 
 * Ein styled TextInput mit automatischer Theme-Anpassung und konsistentem Design.
 * Unterstützt mehrzeilige Eingaben und dynamische Border-Färbung basierend auf dem Inhalt.
 */
export function WizardTextInput({ 
  value, 
  onChangeText, 
  placeholder,
  autoFocus = true,
  numberOfLines = 4,
  containerStyle,
  inputStyle,
  ...textInputProps
}: WizardTextInputProps) {
  const colors = useThemeColor();
  
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: value.trim() ? colors.primary : colors.inputBorder,
            color: colors.textPrimary,
          },
          inputStyle
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        multiline={true}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        autoFocus={autoFocus}
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingBottom: 24, // spacing.xl
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8, // spacing.s
    paddingHorizontal: 16, // spacing.m
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
  },
}); 