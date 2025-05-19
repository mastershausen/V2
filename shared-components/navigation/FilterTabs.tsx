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

// Filter-Tab Definition
export interface FilterTabItem {
  id: string;
  label: string;
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
export function FilterTabs({ tabs, activeTabId, onTabChange, containerStyle }: FilterTabsProps) {
  const colors = useThemeColor();
  
  // Tab-Klick-Handler
  const handleTabPress = (tabId: string) => {
    onTabChange(tabId);
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
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        
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
}); 