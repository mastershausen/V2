import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { ui } from '@/config/theme/ui';

interface FilterIconProps {
  /**
   * Gibt an, ob aktive Filter angewendet sind
   */
  hasActiveFilters?: boolean;
  
  /**
   * Callback für Filter-Icon-Klick
   */
  onPress?: () => void;
  
  /**
   * Optional: Gibt an, ob das Icon aktiv ist 
   * (für Konsistenz mit anderen Tab-Komponenten)
   */
  isActive?: boolean;
  
  /**
   * Optional: Zusätzliche Stile für den Container
   */
  style?: ViewStyle;
  
  /**
   * Optional: Größe des Icons
   */
  size?: number;
}

/**
 * FilterIcon-Komponente
 * 
 * Zeigt ein Filter-Icon an mit einem optionalen Indikator für aktive Filter.
 * Kann alleinstehend oder als Teil einer Tabbar/FilterTabs verwendet werden.
 */
export function FilterIcon({
  hasActiveFilters = false,
  onPress,
  isActive = false,
  style,
  size = 18
}: FilterIconProps) {
  const colors = useThemeColor();
  
  // Bestimme die Farbe basierend auf dem aktiven Status
  const iconColor = isActive || hasActiveFilters ? colors.primary : colors.textSecondary;
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        (isActive || hasActiveFilters) && {
          backgroundColor: colors.pastel.primary,
          borderColor: colors.pastel.primaryBorder
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name="options-outline" 
          size={size} 
          color={iconColor} 
        />
        {hasActiveFilters && (
          <View style={styles.filterIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: ui.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'transparent',
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0078FF',
  },
}); 