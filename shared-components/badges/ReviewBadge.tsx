import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ReviewBadgeProps {
  /**
   * Die anzuzeigende Bewertung (Anzahl der Sterne)
   * @default 5.0
   */
  rating?: number;
  
  /**
   * Die Anzahl der abgegebenen Bewertungen
   * Wenn 0 oder nicht angegeben, wird keine Anzahl angezeigt
   */
  ratingCount?: number;
  
  /**
   * Zusätzliche Stiloptionen
   */
  style?: any;
  
  /**
   * Die Schriftfarbe für den Text innerhalb des Badges
   * Falls nicht angegeben, wird die Standard-Textfarbe verwendet
   */
  textColor?: string;
  
  /**
   * Die Größe des Stern-Icons
   * @default 16
   */
  iconSize?: number;
  
  /**
   * Die Farbe des Stern-Icons
   * @default '#FFD600'
   */
  iconColor?: string;
  
  /**
   * Zeigt die Bewertung mit einer festen Anzahl von Dezimalstellen an
   * @default 1
   */
  decimalPlaces?: number;
}

/**
 * Eine einheitliche Komponente zur Anzeige von Bewertungen
 * Zeigt eine Bewertung als Zahl mit Stern-Icon in einem Badge an
 */
export function ReviewBadge({
  rating = 5.0,
  ratingCount = 0,
  style,
  textColor,
  iconSize = 16,
  iconColor = '#FFD600',
  decimalPlaces = 1
}: ReviewBadgeProps) {
  const colors = useThemeColor();
  
  // Verwende die übergebene Textfarbe oder Standard-Textfarbe
  const textColorToUse = textColor || colors.textSecondary;
  
  return (
    <View style={[styles.container, style]}>
      <Ionicons 
        name="star" 
        size={iconSize} 
        color={iconColor} 
        style={styles.icon} 
      />
      <Text style={[styles.rating, { color: textColorToUse }]}>
        {rating.toFixed(decimalPlaces)}
      </Text>
      {ratingCount > 0 && (
        <Text style={[styles.ratingCount, { color: textColorToUse }]}>
          ({ratingCount})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: ui.borderRadius.s,
  },
  icon: {
    marginRight: 2,
  },
  rating: {
    fontSize: typography.fontSize.s,
    marginLeft: spacing.xxs,
    fontWeight: typography.fontWeight.medium,
  },
  ratingCount: {
    fontSize: typography.fontSize.xs,
    marginLeft: spacing.xxs,
  }
}); 