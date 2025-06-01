import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';

interface CasestudyListCardProps {
  /**
   * Titel der Case Study
   */
  title: string;
  
  /**
   * Beschreibung/Kurzbeschreibung der Case Study
   */
  description: string;
  
  /**
   * Optional: Ergebnis der Case Study (wird in grünem Highlight angezeigt)
   */
  result?: string;
  
  /**
   * Optional: Prefix für das Ergebnis (default: "Result:")
   */
  resultPrefix?: string;
  
  /**
   * Callback wenn Info-Button gedrückt wird
   */
  onInfoPress?: () => void;
  
  /**
   * Optional: Index/Nummer anzeigen (z.B. "Case Study 1:")
   */
  index?: number;
  
  /**
   * Optional: Prefix Text (default: "Case Study")
   */
  indexPrefix?: string;
  
  /**
   * Optional: Zusätzliche Styles für den Container
   */
  style?: ViewStyle;
  
  /**
   * Optional: Zusätzliche Styles für den Titel
   */
  titleStyle?: TextStyle;
  
  /**
   * Optional: Zusätzliche Styles für die Beschreibung
   */
  descriptionStyle?: TextStyle;
  
  /**
   * Optional: Zusätzliche Styles für das Ergebnis
   */
  resultStyle?: TextStyle;
}

/**
 * CasestudyListCard Component
 * 
 * Wiederverwendbare Card-Komponente für Case Studies mit grünem Border,
 * Titel, Beschreibung und Info-Button.
 */
export function CasestudyListCard({
  title,
  description,
  result,
  resultPrefix = 'Result:',
  onInfoPress,
  index,
  indexPrefix = 'Case Study',
  style,
  titleStyle,
  descriptionStyle,
  resultStyle,
}: CasestudyListCardProps) {
  const colors = useThemeColor();

  const displayTitle = index 
    ? `${indexPrefix} ${index}: ${title}`
    : title;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[
          styles.title, 
          { color: colors.textPrimary },
          titleStyle
        ]}>
          {displayTitle}
        </Text>
        {onInfoPress && (
          <TouchableOpacity 
            style={[styles.infoButton, { 
              backgroundColor: `${colors.primary}33`, // 20% opacity
              borderColor: colors.primary 
            }]}
            onPress={onInfoPress}
          >
            <Text style={[styles.infoButtonText, { color: colors.primary }]}>
              i
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={[
        styles.description, 
        { color: colors.textPrimary },
        descriptionStyle
      ]}>
        {description}
      </Text>
      {result && (
        <View style={styles.resultContainer}>
          <Text style={[
            styles.result,
            { color: colors.primary },
            resultStyle
          ]}>
            {resultPrefix} {result}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.s,
    backgroundColor: 'rgba(30, 107, 85, 0.03)',
    borderLeftWidth: 3,
    borderLeftColor: '#1E6B55',
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontWeight: typography.fontWeight.semiBold as any,
    fontSize: typography.fontSize.m,
    flex: 1,
    lineHeight: 20,
  },
  description: {
    fontSize: typography.fontSize.s,
    opacity: 0.8,
    lineHeight: 20,
  },
  infoButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.s,
  },
  infoButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold as any,
  },
  resultContainer: {
    marginTop: spacing.s,
    backgroundColor: 'rgba(30, 107, 85, 0.1)',
    borderRadius: ui.borderRadius.s,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  result: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
  },
}); 