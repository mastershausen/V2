import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ViewStyle,
  TextStyle 
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FilterIcon } from './FilterIcon';

// Filter-Tab Definition
export interface FilterTabItem {
  id: string;
  label: string;
  isFilterIcon?: boolean;
}

// Props für die FilterTabs-Komponente
interface FilterTabsProps {
  /**
   * Liste der verfügbaren Filter-Tabs
   */
  tabs: FilterTabItem[];
  
  /**
   * ID des aktuell ausgewählten Tabs
   */
  activeTabId: string;
  
  /**
   * Callback für Tab-Änderungen
   */
  onTabChange: (tabId: string) => void;
  
  /**
   * Callback für Filter-Icon-Klick
   */
  onFilterPress?: () => void;
  
  /**
   * Gibt an, ob aktive Filter angewendet sind
   */
  hasActiveFilters?: boolean;
  
  /**
   * Optionale zusätzliche Styles für den Container
   */
  containerStyle?: ViewStyle;
}

/**
 * FilterTabs-Komponente
 * 
 * Zeigt eine horizontale Reihe von Filter-Tabs an, die zum Filtern von Inhalten verwendet werden können.
 * Ähnlich wie Chips oder Pills zur Kategoriefilterung.
 */
export function FilterTabs({ 
  tabs, 
  activeTabId, 
  onTabChange, 
  onFilterPress, 
  hasActiveFilters = false, 
  containerStyle 
}: FilterTabsProps) {
  const colors = useThemeColor();
  
  // Tab-Klick-Handler
  const handleTabPress = (tabId: string, isFilterIcon?: boolean) => {
    if (isFilterIcon && onFilterPress) {
      onFilterPress();
    } else {
      onTabChange(tabId);
    }
  };
  
  // Verwende Pastellfarben aus dem Theme statt harter Codierung
  const pastelPrimary = colors.pastel.primary;
  const pastelBorder = colors.pastel.primaryBorder;
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        containerStyle
      ]}
      style={styles.scrollViewStyle}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId || (tab.isFilterIcon && hasActiveFilters);
        
        // Wenn es sich um ein Filter-Icon handelt, verwende die FilterIcon-Komponente
        if (tab.isFilterIcon) {
          return (
            <FilterIcon
              key={tab.id}
              hasActiveFilters={hasActiveFilters}
              isActive={isActive}
              onPress={() => onFilterPress?.()}
              style={styles.filterIconStyle}
            />
          );
        }
        
        // Style basierend auf aktivem Status mit Pastellfarben
        const tabStyle: ViewStyle = {
          backgroundColor: isActive ? pastelPrimary : 'transparent',
          borderColor: isActive ? pastelBorder : colors.divider,
        };
        
        const textStyle: TextStyle = {
          color: isActive ? colors.primary : colors.textSecondary,
          fontWeight: isActive ? '600' : 'normal',
        };
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, tabStyle]}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, textStyle]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      
      {/* Separates Filter-Icon, falls nicht in Tabs enthalten */}
      {!tabs.some(tab => tab.isFilterIcon) && onFilterPress && (
        <FilterIcon
          hasActiveFilters={hasActiveFilters}
          onPress={onFilterPress}
          style={styles.filterIconStyle}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: ui.borderRadius.pill,
    borderWidth: 1,
    marginRight: spacing.s,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: typography.fontSize.s,
  },
  filterIconStyle: {
    marginLeft: spacing.xs,
    marginRight: spacing.s,
  },
  scrollViewStyle: {
    paddingRight: 60, // Platz für das überlagernde Filter-Icon
  },
}); 