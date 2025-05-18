import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Platform 
} from 'react-native';

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
  const getBadgeColors = () => {
    switch (userRole) {
      case 'premium':
        return {
          background: '#FFD700',
          text: '#000000'
        };
      case 'pro':
        return {
          background: '#007AFF',
          text: '#FFFFFF'
        };
      case 'admin':
        return {
          background: '#FF2D55',
          text: '#FFFFFF'
        };
      case 'free':
      default:
        return {
          background: colors.backgroundSecondary,
          text: colors.textSecondary
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
    backgroundColor: badgeColors.background,
  };

  const textStyle = {
    ...styles.text,
    color: badgeColors.text,
    fontSize: sizeStyle.fontSize,
  };

  const badgeStyle = {
    paddingVertical: sizeStyle.paddingVertical,
    paddingHorizontal: sizeStyle.paddingHorizontal,
  };

  // Text für die Anzeige formatieren
  const displayText = userRole.charAt(0).toUpperCase() + userRole.slice(1);

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
  text: {
    fontFamily: typography.fontFamily.default,
    textAlign: 'center',
  },
});

export default UserroleBadge; 