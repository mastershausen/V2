import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CategoryFilterProps {
  /**
   * Die verfügbaren Kategorien
   */
  categories: string[];
  
  /**
   * Die aktuell ausgewählte Kategorie
   */
  selectedCategory: string | null;
  
  /**
   * Callback für Änderungen der ausgewählten Kategorie
   */
  onCategoryChange: (category: string | null) => void;
  
  /**
   * Label für "Alle"-Option (Standard: "Alle")
   */
  allLabel?: string;
}

/**
 * Filter-Komponente zur Auswahl von Kategorien
 * 
 * Diese Komponente zeigt horizontale Buttons für Kategoriefilter an
 * mit einer "Alle"-Option, um den Filter zurückzusetzen.
 * @param root0
 * @param root0.categories
 * @param root0.selectedCategory
 * @param root0.onCategoryChange
 * @param root0.allLabel
 */
export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  allLabel = "Alle"
}: CategoryFilterProps): React.ReactElement {
  const colors = useThemeColor();
  
  // Handler für die "Alle"-Option
  const handleAllPress = () => {
    onCategoryChange(null);
  };
  
  // Handler für Kategorie-Auswahl
  const handleCategoryPress = (category: string) => {
    onCategoryChange(category);
  };
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* "Alle" Button */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          { borderColor: colors.cardBorder },
          !selectedCategory && styles.selectedButton
        ]}
        onPress={handleAllPress}
      >
        <Text
          style={[
            styles.buttonText,
            { color: colors.textPrimary },
            !selectedCategory && { color: colors.primary }
          ]}
        >
          {allLabel}
        </Text>
      </TouchableOpacity>
      
      {/* Kategorie-Buttons */}
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterButton,
            { borderColor: colors.cardBorder },
            selectedCategory === category && styles.selectedButton
          ]}
          onPress={() => handleCategoryPress(category)}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.textPrimary },
              selectedCategory === category && { color: colors.primary }
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.xs
  },
  filterButton: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: ui.borderRadius.m,
    borderWidth: 1,
    marginHorizontal: spacing.xs
  },
  selectedButton: {
    backgroundColor: 'rgba(0, 0, 255, 0.05)'
  },
  buttonText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as '500'
  }
}); 