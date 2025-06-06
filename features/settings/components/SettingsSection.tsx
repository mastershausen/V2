import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SettingsSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

/**
 * Eine Komponente, die eine Gruppe von Einstellungen darstellt
 * @param root0
 * @param root0.title
 * @param root0.icon
 * @param root0.children
 */
export function SettingsSection({ title, icon, children }: SettingsSectionProps) {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={colors.textSecondary} 
            style={styles.icon}
          />
        )}
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          {title.toUpperCase()}
        </Text>
      </View>
      
      <View style={[styles.content, { backgroundColor: colors.backgroundSecondary }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.l,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    marginBottom: spacing.xs,
  },
  icon: {
    marginRight: spacing.s,
  },
  title: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold as any,
    letterSpacing: 0.5,
  },
  content: {
    borderRadius: 8,
    overflow: 'hidden',
  },
}); 