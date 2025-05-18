import React, { memo, useMemo } from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, StyleProp } from 'react-native';

import { spacing } from '@/config/theme/spacing';

import { ThemeColors } from '../types';
import { SuggestionChip } from './SuggestionChip';
import { SearchSuggestion } from '../types/search';

/**
 * Props für die SuggestionList-Komponente
 */
export interface SuggestionListProps {
  /**
   * Array von Suchvorschlägen, die angezeigt werden sollen
   */
  suggestions: SearchSuggestion[];
  
  /**
   * Callback-Funktion, die beim Klicken auf einen Vorschlag ausgeführt wird
   */
  onSuggestionPress: (suggestion: SearchSuggestion) => void;
  
  /**
   * Theme-Farben für die Darstellung
   */
  colors: ThemeColors;
  
  /**
   * Gibt an, ob die Vorschläge horizontal scrollbar sein sollen
   * @default false
   */
  horizontal?: boolean;
  
  /**
   * Zusätzliche Stile für den Container
   * @default undefined
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Anzahl der maximal anzuzeigenden Elemente
   * @default undefined (alle anzeigen)
   */
  maxItems?: number;
  
  /**
   * Stile für die individuelle Chip-Container
   * @default undefined
   */
  chipContainerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Verhalten bei leerer Liste
   * @default null (nichts anzeigen)
   */
  emptyListComponent?: React.ReactNode;
}

/**
 * Stellt eine Liste von Suchvorschlägen als Chips dar.
 * Diese Komponente ist memoized für bessere Performance.
 * 
 * @param {SuggestionListProps} props - Die Komponenten-Props
 * @returns {React.ReactElement | null} Eine Liste von SuggestionChips oder null, wenn keine Vorschläge vorhanden sind
 * 
 * @example
 * <SuggestionList
 *   suggestions={suggestions}
 *   onSuggestionPress={handleSuggestionPress}
 *   colors={colors}
 *   horizontal={true}
 * />
 */
function SuggestionListBase({
  suggestions,
  onSuggestionPress,
  colors,
  horizontal = false,
  containerStyle,
  maxItems,
  chipContainerStyle,
  emptyListComponent = null
}: SuggestionListProps) {
  // Verarbeite die Vorschläge und begrenze sie, wenn nötig
  const displayedSuggestions = useMemo(() => {
    if (maxItems && maxItems > 0) {
      return suggestions.slice(0, maxItems);
    }
    return suggestions;
  }, [suggestions, maxItems]);

  // Erstelle memoized Styles für den Container
  const containerStyles = useMemo(() => [
    styles.container,
    containerStyle
  ], [containerStyle]);

  // Erstelle memoized Styles für den Chip-Container
  const chipContainerStyles = useMemo(() => [
    styles.chipContainer,
    chipContainerStyle
  ], [chipContainerStyle]);

  // Rendern der Liste nur, wenn Vorschläge vorhanden sind
  if (!displayedSuggestions.length) {
    return emptyListComponent ? <>{emptyListComponent}</> : null;
  }

  // Render-Funktion für einzelne Suggestion-Chips
  const renderSuggestionItem = (suggestion: SearchSuggestion) => (
    <View key={suggestion.id} style={chipContainerStyles}>
      <SuggestionChip
        label={suggestion.label}
        icon={suggestion.icon}
        onPress={() => onSuggestionPress(suggestion)}
        colors={colors}
      />
    </View>
  );

  return (
    <View style={containerStyles}>
      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {displayedSuggestions.map(renderSuggestionItem)}
        </ScrollView>
      ) : (
        <View style={styles.verticalContainer}>
          {displayedSuggestions.map(renderSuggestionItem)}
        </View>
      )}
    </View>
  );
}

/**
 * Styles für die SuggestionList-Komponente
 */
const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  scrollViewContent: {
    paddingHorizontal: spacing.s,
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: spacing.s,
  },
  verticalContainer: {
    flexDirection: 'column',
    paddingHorizontal: spacing.s,
    alignItems: 'center',
  },
  chipContainer: {
    marginBottom: spacing.s,
    marginHorizontal: spacing.xs,
  }
});

/**
 * Memoized SuggestionList-Komponente für optimierte Performance
 */
export const SuggestionList = memo(SuggestionListBase); 