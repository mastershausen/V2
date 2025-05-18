import React, { memo, useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { spacing, borderRadius } from '@/config/theme';

import { ThemeColors } from '../types';

/**
 * Props für die SuggestionChip-Komponente
 */
interface SuggestionChipProps {
  /**
   * Text, der im Chip angezeigt wird
   */
  label: string;
  
  /**
   * Optional: Icon, das links vom Text angezeigt werden soll
   */
  icon?: string;
  
  /**
   * Callback-Funktion, die beim Klick auf den Chip ausgeführt wird
   */
  onPress: () => void;
  
  /**
   * Theme-Farben für die Darstellung
   */
  colors: ThemeColors;
  
  /**
   * Zusätzliche Styles für den Container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Zusätzliche Styles für den Text
   */
  textStyle?: StyleProp<TextStyle>;
  
  /**
   * Gibt an, ob der Chip deaktiviert sein soll
   * @default false
   */
  disabled?: boolean;
}

/**
 * SuggestionChip-Komponente
 * 
 * Diese Komponente stellt einen interaktiven Chip für Suchvorschläge dar.
 * Die Chips können mit Text und optional einem Icon angezeigt werden und
 * reagieren auf Benutzerinteraktionen mit visuellen Effekten.
 * 
 * Die Komponente ist vollständig an das Theming-System angepasst und
 * verwendet die übergebenen Farben für ihre Darstellung.
 * 
 * @param {SuggestionChipProps} props - Props für die Komponente
 * @returns {React.ReactElement} Die gerenderte SuggestionChip-Komponente
 * 
 * @example
 * <SuggestionChip
 *   label="React Native"
 *   icon="code"
 *   onPress={() => handleSuggestion("React Native")}
 *   colors={themeColors}
 * />
 */
function SuggestionChipBase({
  label,
  icon,
  onPress,
  colors,
  style,
  textStyle,
  disabled = false
}: SuggestionChipProps) {
  // Erstelle memoized Styles aus den Theme-Farben
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  // Kombinierte Styles für Container und Text
  const containerStyle = [styles.container, style];
  const labelStyle = [styles.label, textStyle];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FontAwesome 
          name={(icon as any) || 'question-circle'} 
          size={15} 
          color="#3B82F6" 
          style={styles.icon} 
        />
      </View>
      <Text style={labelStyle} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Erstellt Styles für die SuggestionChip-Komponente basierend auf den Theme-Farben
 * 
 * @param {ThemeColors} colors - Die Theme-Farben für die Styles
 * @returns {StyleSheet.NamedStyles<any>} Die generierten Styles
 */
const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.l,
    marginRight: spacing.xs,
    marginBottom: spacing.s,
    maxWidth: 200,
    minWidth: 60,
    height: 34,
    justifyContent: 'flex-start',
    // Moderner, subtiler Schatten
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(229, 231, 235, 0.8)',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '400',
    marginLeft: spacing.xs,
  },
  iconContainer: {
    marginRight: spacing.xxs,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginTop: 0,
  }
});

/**
 * Memoized SuggestionChip-Komponente für optimierte Rendering-Performance
 * Verhindert unnötige Re-Renderings, wenn sich die Props nicht ändern
 */
export const SuggestionChip = memo(SuggestionChipBase);