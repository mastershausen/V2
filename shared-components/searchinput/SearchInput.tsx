import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle, TouchableOpacity, ActivityIndicator } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

type ShadowLevel = 'none' | 'light' | 'medium' | 'strong';

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  placeholderColor?: string;
  cursorColor?: string;
  selectionColor?: string;
  clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
  shadowLevel?: ShadowLevel;
  isLoading?: boolean;
}

/**
 * Suchfeld-Komponente mit Suchicon und Lösch-Button
 * Eine wiederverwendbare Eingabekomponente für Suchfelder mit anpassbaren Stilen und Verhalten.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {string} props.value - Der aktuelle Wert des Suchfelds
 * @param {Function} props.onChangeText - Callback-Funktion, die bei Texteingabe aufgerufen wird
 * @param {Function} [props.onSubmitEditing] - Callback-Funktion, die beim Abschließen der Eingabe aufgerufen wird
 * @param {Function} [props.onFocus] - Callback-Funktion, die beim Fokussieren des Eingabefelds aufgerufen wird
 * @param {Function} [props.onBlur] - Callback-Funktion, die beim Verlieren des Fokus aufgerufen wird
 * @param {string} [props.placeholder] - Platzhaltertext für das Suchfeld
 * @param {('done'|'go'|'next'|'search'|'send')} [props.returnKeyType] - Typ der Eingabetaste
 * @param {boolean} [props.autoFocus] - Ob das Eingabefeld automatisch fokussiert werden soll
 * @param {StyleProp<ViewStyle>} [props.containerStyle] - Benutzerdefinierte Stile für den Container
 * @param {StyleProp<TextStyle>} [props.inputStyle] - Benutzerdefinierte Stile für das Eingabefeld
 * @param {string} [props.placeholderColor] - Farbe des Platzhaltertexts
 * @param {string} [props.cursorColor] - Farbe des Cursors
 * @param {string} [props.selectionColor] - Farbe der Textauswahl
 * @param {('never'|'while-editing'|'unless-editing'|'always')} [props.clearButtonMode] - Anzeigemodus für den Lösch-Button
 * @param {('none'|'light'|'medium'|'strong')} [props.shadowLevel] - Intensität des Schattens
 * @param {boolean} [props.isLoading] - Gibt an, ob die Suche gerade lädt
 * @returns {React.ReactElement} Die gerenderte SearchInput-Komponente
 */
export function SearchInput({
  value,
  onChangeText,
  onSubmitEditing,
  onFocus,
  onBlur,
  placeholder = 'Suchen...',
  returnKeyType = 'search',
  autoFocus = false,
  containerStyle,
  inputStyle,
  placeholderColor,
  cursorColor,
  selectionColor,
  clearButtonMode = 'while-editing',
  shadowLevel = 'medium',
  isLoading = false,
  ...restProps
}: SearchInputProps) {
  const colors = useThemeColor();
  const [isFocused, setIsFocused] = useState(false);

  // Event-Handler für Fokus/Blur
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  // Bestimmen, ob wir eine kompakte Version verwenden
  // Wenn InputStyle eine Höhe hat, passen wir das IconContainer entsprechend an
  const customHeight = 
    inputStyle && 
    typeof inputStyle === 'object' && 
    'height' in inputStyle && 
    typeof inputStyle.height === 'number' 
      ? inputStyle.height 
      : SEARCH_INPUT_HEIGHT;

  // Schatten basierend auf shadowLevel bestimmen
  const getShadowStyle = () => {
    switch(shadowLevel) {
      case 'none':
        return {};
      case 'light':
        return ui.shadow.light;
      case 'strong':
        return ui.shadow.strong;
      case 'medium':
      default:
        return ui.shadow.medium;
    }
  };

  // Kombinierte Styles
  const containerStyles = [
    styles.searchContainer,
    containerStyle
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    {
      backgroundColor: colors.inputBackground,
      borderColor: isFocused ? colors.primary : colors.inputBorder,
      height: customHeight, // Dynamische Höhenanpassung
      ...getShadowStyle(), // Dynamischer Schatten basierend auf shadowLevel
    }
  ];

  const inputStyles = [
    styles.searchInput,
    {
      color: colors.inputText,
      height: customHeight - 2, // Leicht angepasst für den Border
    },
    inputStyle
  ];

  // Icon-Größe basierend auf der Eingabehöhe anpassen
  const iconSize = customHeight < 45 ? 18 : 22;
  const clearIconSize = customHeight < 45 ? 16 : 18;

  return (
    <View style={containerStyles}>
      <View style={inputContainerStyles}>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={colors.primary}
            style={styles.searchIcon}
          />
        ) : (
          <Ionicons 
            name="search" 
            size={iconSize}
            color={isFocused ? colors.primary : colors.textSecondary} 
            style={styles.searchIcon}
          />
        )}
        <TextInput
          style={inputStyles}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          returnKeyType={returnKeyType}
          returnKeyLabel="Fertig"
          onSubmitEditing={onSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessible={true}
          accessibilityLabel={placeholder}
          accessibilityHint="Geben Sie Suchbegriffe ein"
          accessibilityRole="search"
          editable={!isLoading}
        />
        {value.length > 0 && !isLoading && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => onChangeText('')}
            accessibilityLabel="Sucheingabe löschen"
          >
            <Ionicons name="close-circle" size={clearIconSize} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Konstanten für Styles
const SEARCH_INPUT_HEIGHT = 56; // Standardhöhe

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SEARCH_INPUT_HEIGHT,
    borderRadius: ui.borderRadius.l,
    borderWidth: ui.border.normal,
    paddingHorizontal: spacing.m,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    height: SEARCH_INPUT_HEIGHT - 2,
    fontSize: typography.fontSize.m + 2, // Größere Schrift
    fontWeight: '400',
  },
  clearButton: {
    padding: spacing.xs,
  },
}); 