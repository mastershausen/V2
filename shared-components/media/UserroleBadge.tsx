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

// Aus der userTypes.ts importieren
export type UserRole = 'free' | 'pro' | 'premium' | 'admin';

interface UserroleBadgeProps {
  userRole?: UserRole;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  size?: 'small' | 'medium' | 'large';
}

type BadgeColorType = {
  gradient?: [string, string]; // Explizit als Tupel mit zwei Strings definieren
  background?: string;
  text: string;
  useGradient: boolean;
};

/**
 * Eine Komponente, die ein Badge für die Nutzerrolle anzeigt.
 * @param root0
 * @param root0.userRole
 * @param root0.position
 * @param root0.size
 */
export function UserroleBadge({
  userRole = 'free',
  position = 'topRight',
  size = 'medium',
}: UserroleBadgeProps) {
  const colors = useThemeColor();

  // Bestimme die Badge-Farben basierend auf der Nutzerrolle
  const getBadgeColors = (): BadgeColorType => {
    switch (userRole) {
      case 'premium':
        return {
          gradient: ['#5E35B1', '#4527A0'], // Dunkelviolett mit Farbverlauf
          text: '#FFFFFF',
          useGradient: true
        };
      case 'pro':
        return {
          gradient: ['#00796B', '#00695C'], // Petrol/Teal mit Farbverlauf
          text: '#FFFFFF',
          useGradient: true
        };
      case 'admin':
        return {
          gradient: ['#D81B60', '#C2185B'], // Dunkleres Rot mit Farbverlauf
          text: '#FFFFFF',
          useGradient: true
        };
      case 'free':
      default:
        return {
          background: colors.backgroundSecondary,
          text: colors.textSecondary,
          useGradient: false
        };
    }
  };

  // Bestimme die Badge-Position
  const getPositionStyle = () => {
    switch (position) {
      case 'topLeft':
        return {
          top: spacing.s,
          left: spacing.s,
        };
      case 'bottomLeft':
        return {
          bottom: spacing.s,
          left: spacing.s,
        };
      case 'bottomRight':
        return {
          bottom: spacing.s,
          right: spacing.s,
        };
      case 'topRight':
      default:
        return {
          top: spacing.s,
          right: spacing.s,
        };
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

  const badgeColors = getBadgeColors();
  const positionStyle = getPositionStyle();
  const sizeStyle = getSizeStyle();

  const containerStyle = {
    ...styles.container,
    ...positionStyle,
    backgroundColor: badgeColors.useGradient ? 'transparent' : badgeColors.background,
  };

  const textStyle: TextStyle = {
    ...styles.text,
    color: badgeColors.text,
    fontSize: sizeStyle.fontSize,
    fontWeight: userRole === 'free' ? 'normal' : 'bold',
  };

  const badgeStyle = {
    paddingVertical: sizeStyle.paddingVertical,
    paddingHorizontal: sizeStyle.paddingHorizontal,
  };

  // Text für die Anzeige formatieren
  const displayText = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  if (badgeColors.useGradient && badgeColors.gradient) {
    return (
      <LinearGradient
        colors={badgeColors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[containerStyle, badgeStyle, styles.gradientContainer]}
      >
        <Text style={textStyle}>{displayText}</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[containerStyle, badgeStyle]}>
      <Text style={textStyle}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: ui.borderRadius.s,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  gradientContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  text: {
    fontFamily: typography.fontFamily.default,
    textAlign: 'center',
  },
});

export default UserroleBadge; 