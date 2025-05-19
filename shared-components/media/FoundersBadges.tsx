import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Platform,
  TextStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

// Typ für das Founder-Badge (kein Pioneer mehr)
export type FounderType = 'founder';

interface FoundersBadgeProps {
  founderType?: FounderType;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'none';
  size?: 'small' | 'medium' | 'large';
}

type BadgeColorType = {
  gradient: [string, string];
  text: string;
};

/**
 * Eine Komponente, die ein Badge für Gründer anzeigt.
 * @param root0
 * @param root0.founderType
 * @param root0.position
 * @param root0.size
 */
export function FoundersBadge({
  founderType = 'founder',
  position = 'none',
  size = 'medium',
}: FoundersBadgeProps) {
  const colors = useThemeColor();

  // Für ein elegantes Schwarz-Silber-Badge mit mehr Kontrast
  const badgeColors: BadgeColorType = {
    gradient: ['#686868', '#1A1A1A'],
    text: '#F5F5F5', // Helleres Silber-Weiß für bessere Lesbarkeit
  };

  // Bestimme die Badge-Position (nur wenn position nicht 'none' ist)
  const getPositionStyle = () => {
    if (position === 'none') {
      return {};
    }
    
    switch (position) {
      case 'topLeft':
        return {
          position: 'absolute' as const,
          top: spacing.s,
          left: spacing.s,
        };
      case 'bottomLeft':
        return {
          position: 'absolute' as const,
          bottom: spacing.s,
          left: spacing.s,
        };
      case 'bottomRight':
        return {
          position: 'absolute' as const,
          bottom: spacing.s,
          right: spacing.s,
        };
      case 'topRight':
        return {
          position: 'absolute' as const,
          top: spacing.s,
          right: spacing.s,
        };
      default:
        return {};
    }
  };

  // Bestimme die Badge-Größe
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.s,
          fontSize: typography.fontSize.xs,
        };
      case 'large':
        return {
          paddingVertical: spacing.s,
          paddingHorizontal: spacing.m,
          fontSize: typography.fontSize.l,
        };
      case 'medium':
      default:
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.s,
          fontSize: typography.fontSize.s,
        };
    }
  };

  const positionStyle = getPositionStyle();
  const sizeStyle = getSizeStyle();

  const containerStyle = {
    ...styles.container,
    ...(position !== 'none' ? positionStyle : {}),
  };

  const textStyle: TextStyle = {
    ...styles.text,
    color: badgeColors.text,
    fontSize: sizeStyle.fontSize,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1, // Leichter Textschatten für einen edleren Look
  };

  const badgeStyle = {
    paddingVertical: sizeStyle.paddingVertical,
    paddingHorizontal: sizeStyle.paddingHorizontal,
    // Silbriger Rand für mehr Eleganz
    borderWidth: 1,
    borderColor: 'rgba(240, 240, 240, 0.4)',
  };

  return (
    <LinearGradient
      colors={badgeColors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[containerStyle, badgeStyle, styles.gradientContainer]}
    >
      <Text style={textStyle}>Founder</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: ui.borderRadius.s,
    borderWidth: 0,  // Setzt den Standardrand auf 0, da wir im badgeStyle einen speziellen Rand setzen
  },
  gradientContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.7, // Stärkerer Schatten für mehr Tiefe
        shadowRadius: 4,    // Größerer Schattenradius für weicheren Übergang
      },
      android: {
        elevation: 4,
      },
    }),
  },
  text: {
    fontFamily: typography.fontFamily.default,
    textAlign: 'center',
    letterSpacing: 1.2, // Mehr Abstand zwischen Buchstaben für edleren Look
    fontWeight: 'bold', // Fettdruck für bessere Lesbarkeit auf dunklem Hintergrund
  },
});

export default FoundersBadge; 