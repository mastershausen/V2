import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BottomScreen } from '@/shared-components/navigation/BottomScreen';

export interface CreateContentOption {
  id: string;
  label: string;
  icon: string;
  route: string;
  color?: string;
}

interface CreateContentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const DEFAULT_OPTIONS: CreateContentOption[] = [
  {
    id: 'nugget',
    label: 'Nugget erstellen',
    icon: 'document-text-outline',
    route: '/nuggets/create/createNugget'
  },
  {
    id: 'gig',
    label: 'Gig erstellen',
    icon: 'briefcase-outline',
    route: '/gigs/create/createGig'
  },
  {
    id: 'casestudy',
    label: 'Fallstudie erstellen',
    icon: 'folder-open-outline',
    route: '/casestudies/create/createCaseStudy'
  }
];

/**
 * BottomSheet zum Erstellen verschiedener Inhaltstypen (Nugget, Gig, Fallstudie)
 */
export function CreateContentBottomSheet({ 
  visible, 
  onClose 
}: CreateContentBottomSheetProps) {
  const colors = useThemeColor();

  const handleOptionPress = (option: CreateContentOption) => {
    onClose();
    router.push(option.route);
  };

  return (
    <BottomScreen
      visible={visible}
      onClose={onClose}
      title="Inhalt erstellen"
    >
      <View style={styles.optionsContainer}>
        {DEFAULT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton, 
              { borderColor: colors.divider }
            ]}
            onPress={() => handleOptionPress(option)}
          >
            <View style={[
              styles.iconContainer, 
              { backgroundColor: option.color || colors.pastel.primary }
            ]}>
              <Ionicons 
                name={option.icon as any} 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>
              {option.label}
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={colors.textTertiary} 
              style={styles.chevron}
            />
          </TouchableOpacity>
        ))}
      </View>
    </BottomScreen>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    marginTop: spacing.s,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    marginLeft: spacing.s,
  }
}); 