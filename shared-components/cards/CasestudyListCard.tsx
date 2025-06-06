import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, Platform } from 'react-native';

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
   * Optional: Kompakter Summary-Text für compact-Variante
   */
  compactSummary?: string;
  
  /**
   * Variante der Card (default: "default", compact: ultra-kompakte Version)
   */
  variant?: 'default' | 'compact';
  
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
  compactSummary,
  variant = 'default',
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

  // Kompakte Variante - nur Summary + Info Button
  if (variant === 'compact') {
    const summaryText = compactSummary || description;
    
    return (
      <View style={[styles.container, styles.compactContainer, style]}>
        <View style={styles.compactHeader}>
          <Text style={[
            styles.compactFlowText, 
            { color: colors.textPrimary },
            descriptionStyle
          ]}>
            {summaryText}
          </Text>
          {onInfoPress && (
            <TouchableOpacity 
              style={[styles.infoButton, styles.compactInfoButton, { 
                backgroundColor: `${colors.primary}33`,
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
      </View>
    );
  }

  // Standard Variante (bisheriges Verhalten)
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
    marginBottom: spacing.m,
    backgroundColor: '#FAFBFC',
    borderLeftWidth: 3,
    borderLeftColor: '#1E6B55',
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#1E6B55',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 1,
      },
    }),
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
    backgroundColor: 'rgba(30, 107, 85, 0.08)',
    borderRadius: ui.borderRadius.s,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    shadowColor: '#1E6B55',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  result: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  compactContainer: {
    padding: spacing.s,
    marginBottom: spacing.xs,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactFlowText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
    flex: 1,
  },
  compactInfoButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.s,
  },
}); 