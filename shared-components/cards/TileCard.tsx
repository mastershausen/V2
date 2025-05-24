import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StyleProp, ViewStyle, TextStyle, Platform } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TileCardProps {
  id: number;
  title: string;
  onPress: (id: number) => void;
  tileSpacing?: number;
  tilesPerRow?: number;
  horizontalPadding?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Eine responsive Kachel-Komponente für Grid-Layouts
 * @param root0
 * @param root0.id
 * @param root0.title
 * @param root0.onPress
 * @param root0.tileSpacing
 * @param root0.tilesPerRow
 * @param root0.horizontalPadding
 * @param root0.style
 * @param root0.contentStyle
 * @param root0.textStyle
 */
export function TileCard({ 
  id,
  title, 
  onPress,
  tileSpacing = spacing.m,
  tilesPerRow = 3,
  horizontalPadding,
  style,
  contentStyle,
  textStyle,
}: TileCardProps) {
  const colors = useThemeColor();
  
  // Responsive Berechnungen
  const screenWidth = Dimensions.get('window').width;
  const TILE_SPACING = tileSpacing;
  const HORIZONTAL_PADDING = horizontalPadding ?? TILE_SPACING;
  
  // Korrigierte Berechnung für die verfügbare Breite und Kachelgrößen
  const availableWidth = screenWidth - (2 * HORIZONTAL_PADDING);
  const totalSpacingWidth = (tilesPerRow - 1) * TILE_SPACING;
  const tileWidth = Math.floor((availableWidth - totalSpacingWidth) / tilesPerRow);

  // Schriftgrößenberechnung
  const baseFontSize = tileWidth * 0.12;
  const minFontSize = typography.fontSize.xs;
  const maxFontSize = typography.fontSize.l;
  const fontSize = Math.min(maxFontSize, Math.max(minFontSize, Math.floor(baseFontSize)));

  // Berechne das Padding basierend auf der Kachelgröße
  const contentPadding = Math.max(
    spacing.s,
    Math.floor(tileWidth * 0.08) // Erhöht von 0.05 auf 0.08
  );

  // Unified Shadow Styles für beide Plattformen
  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8, // Fallback für ältere Android-Versionen
  };

  // Kombinierte Styles
  const tileStyles = [
    styles.tile, 
    shadowStyle,
    {
      width: '100%' as any,
      aspectRatio: 1,
      marginHorizontal: 0,
      marginBottom: 0,
      backgroundColor: colors.backgroundSecondary,
      borderColor: 'rgba(0,0,0,0.12)',
      borderWidth: 0.8,
      transform: [{ translateY: -5 }],
      borderRadius: ui.borderRadius.xl,
    },
    style
  ];

  const contentStyles = [
    styles.tileContent,
    {
      padding: contentPadding,
      borderRadius: ui.borderRadius.xl,
    },
    contentStyle
  ];

  const textStyles = [
    styles.tileText,
    { 
      color: colors.textPrimary,
      fontSize: fontSize,
      lineHeight: fontSize * 1.5,
      fontWeight: typography.fontWeight.medium as TextStyle['fontWeight'],
    },
    textStyle
  ];

  return (
    <TouchableOpacity 
      style={tileStyles}
      onPress={() => onPress(id)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={contentStyles}>
        <Text 
          style={textStyles}
          numberOfLines={4}
          adjustsFontSizeToFit={false}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: ui.border.thin,
    overflow: 'visible', // Wichtig für iOS Schatten
  },
  tileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white', // Expliziter weißer Hintergrund
  },
  tileText: {
    textAlign: 'center',
    width: '100%',
    flexShrink: 1,
    flexWrap: 'wrap',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 