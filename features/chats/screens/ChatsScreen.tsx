import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ChatsScreenProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Chat-Screen der Anwendung
 * @param root0
 * @param root0.style
 * @param root0.textStyle
 */
export default function ChatsScreen({ style, textStyle }: ChatsScreenProps) {
  const colors = useThemeColor();

  // Kombinierte Styles
  const containerStyles = [
    styles.container,
    { backgroundColor: colors.backgroundPrimary },
    style
  ];

  const textStyles = [
    styles.text, 
    { color: colors.textPrimary },
    textStyle
  ];

  return (
    <View 
      style={containerStyles}
      accessible={true}
    >
      <Text 
        style={textStyles}
        accessible={true}
        accessibilityRole="header"
      >
        Chats
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  text: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold as any,
  },
}); 