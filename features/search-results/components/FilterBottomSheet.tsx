import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { BottomScreen } from '@/shared-components/navigation/BottomScreen';
import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { borderRadius } from '@/config/theme';

export interface FilterOption {
  id: string;
  label: string;
  isActive: boolean;
}

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (activeFilters: FilterOption[]) => void;
  initialFilters?: FilterOption[];
  radiusOptions?: number[];
  selectedRadius?: number;
  onRadiusChange?: (radius: number) => void;
  isNationwide?: boolean;
  onNationwideChange?: (isNationwide: boolean) => void;
}

/**
 * FilterBottomSheet
 * 
 * Ein Bottom Sheet zum Filtern der Suchergebnisse. Ermöglicht die Auswahl verschiedener
 * Filterkriterien wie Kategorie, Entfernung etc.
 */
export function FilterBottomSheet({
  visible,
  onClose,
  onApplyFilters,
  initialFilters = [],
  radiusOptions = [5, 10, 25, 50, 100, 250],
  selectedRadius = 25,
  onRadiusChange,
  isNationwide = false,
  onNationwideChange
}: FilterBottomSheetProps) {
  const colors = useThemeColor();
  const [filters, setFilters] = useState<FilterOption[]>(initialFilters);
  const [radius, setRadius] = useState<number>(selectedRadius);
  const [nationwide, setNationwide] = useState<boolean>(isNationwide);

  // Filter toggle handler
  const handleFilterToggle = (filterId: string) => {
    const updatedFilters = filters.map(filter => 
      filter.id === filterId 
        ? { ...filter, isActive: !filter.isActive } 
        : filter
    );
    setFilters(updatedFilters);
  };

  // Radius selection handler
  const handleRadiusChange = (value: number) => {
    // Wenn bundesweit aktiviert ist, deaktivieren wir es
    if (nationwide) {
      setNationwide(false);
      onNationwideChange?.(false);
    }

    const roundedValue = Math.round(value);
    setRadius(roundedValue);
    onRadiusChange?.(roundedValue);
  };

  // Bundesweit toggle handler
  const handleNationwideToggle = () => {
    const newValue = !nationwide;
    setNationwide(newValue);
    onNationwideChange?.(newValue);
  };

  // Filter anwenden
  const handleApplyFilters = () => {
    onApplyFilters(filters.filter(f => f.isActive));
    onClose();
  };

  // Filter zurücksetzen
  const handleResetFilters = () => {
    const resetFilters = filters.map(filter => ({ ...filter, isActive: false }));
    setFilters(resetFilters);
    setRadius(25); // Zurück zum Standardradius
    setNationwide(false); // Bundesweit zurücksetzen
    onRadiusChange?.(25);
    onNationwideChange?.(false);
  };

  return (
    <BottomScreen 
      visible={visible} 
      onClose={onClose}
      title="Filter"
      showHeaderLine={true}
    >
      <View style={styles.container}>
        {/* Filter Kategorien */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Kategorien
          </Text>
          <View style={styles.optionsContainer}>
            {filters.map(filter => (
              <View key={filter.id} style={styles.filterOption}>
                <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>
                  {filter.label}
                </Text>
                <Switch
                  value={filter.isActive}
                  onValueChange={() => handleFilterToggle(filter.id)}
                  trackColor={{ false: colors.divider, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Entfernungsfilter mit Slider */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Maximale Entfernung
          </Text>
          
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={250}
              step={5}
              value={radius}
              onValueChange={handleRadiusChange}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.divider}
              thumbTintColor={colors.primary}
              disabled={nationwide}
            />
            <View style={styles.sliderLabelsContainer}>
              <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>5 km</Text>
              <Text style={[styles.sliderValue, { color: colors.textPrimary }]}>
                {radius} km
              </Text>
              <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>250 km</Text>
            </View>
          </View>

          {/* Bundesweit Option */}
          <Pressable 
            style={styles.nationwideContainer}
            onPress={handleNationwideToggle}
          >
            <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>
              Bundesweit
            </Text>
            <Switch
              value={nationwide}
              onValueChange={handleNationwideToggle}
              trackColor={{ false: colors.divider, true: colors.primary }}
              thumbColor="#fff"
            />
          </Pressable>
        </View>

        {/* Dummy Pricing Filter */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Preis
          </Text>
          <View style={styles.optionsContainer}>
            <View style={styles.filterOption}>
              <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>
                Kostenlos
              </Text>
              <Switch
                value={false}
                trackColor={{ false: colors.divider, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.filterOption}>
              <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>
                Premium
              </Text>
              <Switch
                value={false}
                trackColor={{ false: colors.divider, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Aktions-Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.resetButton,
              { borderColor: colors.divider }
            ]}
            onPress={handleResetFilters}
          >
            <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
              Zurücksetzen
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.applyButton,
              { backgroundColor: colors.primary }
            ]}
            onPress={handleApplyFilters}
          >
            <Text style={[styles.buttonText, styles.applyButtonText]}>
              Filter anwenden
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.l,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing.s,
  },
  optionsContainer: {
    borderRadius: borderRadius.m,
    overflow: 'hidden',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  filterLabel: {
    fontSize: typography.fontSize.m,
  },
  sliderContainer: {
    marginTop: spacing.s,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginTop: -spacing.xs,
  },
  sliderLabel: {
    fontSize: typography.fontSize.s,
  },
  sliderValue: {
    fontSize: typography.fontSize.m,
    fontWeight: '500',
  },
  nationwideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: borderRadius.m,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.l,
  },
  actionButton: {
    borderRadius: borderRadius.m,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '45%',
  },
  resetButton: {
    borderWidth: 1,
  },
  applyButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: typography.fontSize.m,
    fontWeight: '500',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: typography.fontWeight.semiBold,
  },
}); 