import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SectionHeaderProps {
  /**
   * Der anzuzeigende Titel
   */
  title: string;
  
  /**
   * Optionale Beschreibung/Untertitel
   */
  subtitle?: string;
  
  /**
   * Optionaler Inhalt auf der rechten Seite
   */
  rightContent?: React.ReactNode;
  
  /**
   * Benutzerdefinierte Styles für den Container
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Benutzerdefinierte Styles für den Titel
   */
  titleStyle?: StyleProp<TextStyle>;
  
  /**
   * Benutzerdefinierte Styles für den Untertitel
   */
  subtitleStyle?: StyleProp<TextStyle>;
}

/**
 * SectionHeader-Komponente
 * 
 * Eine wiederverwendbare Komponente zum Anzeigen von Abschnittsüberschriften in der App.
 * @param root0
 * @param root0.title
 * @param root0.subtitle
 * @param root0.rightContent
 * @param root0.containerStyle
 * @param root0.titleStyle
 * @param root0.subtitleStyle
 */
export function SectionHeader({
  title,
  subtitle,
  rightContent,
  containerStyle,
  titleStyle,
  subtitleStyle
}: SectionHeaderProps) {
  const colors = useThemeColor();
  
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.textContainer}>
        <Text 
          style={[styles.title, { color: colors.textPrimary }, titleStyle]}
          numberOfLines={1}
          accessible={true}
          accessibilityRole="header"
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text 
            style={[styles.subtitle, { color: colors.textSecondary }, subtitleStyle]}
            numberOfLines={2}
            accessible={true}
            accessibilityRole="text"
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightContent && (
        <View style={styles.rightContainer}>
          {rightContent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    marginBottom: spacing.s,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'],
    marginBottom: spacing.xxs,
  },
  subtitle: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.regular as TextStyle['fontWeight'],
  },
  rightContainer: {
    marginLeft: spacing.m,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
}); 