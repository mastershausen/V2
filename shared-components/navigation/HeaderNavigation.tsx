import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
 useColorScheme } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useAppNavigation } from '@/constants/routes';
import { useThemeColor } from '@/hooks/useThemeColor';


interface HeaderNavigationProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showLogo?: boolean;
  rightContent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  backButtonContainerStyle?: StyleProp<ViewStyle>;
  backButtonIconStyle?: StyleProp<TextStyle>;
  logoStyle?: StyleProp<ViewStyle>;
  rightContentContainerStyle?: StyleProp<ViewStyle>;
}

// Konstanten für Styles und Hilfsfunktionen
const BACK_BUTTON_SIZE = 32; // Verkleinert von 36 auf 32
const BACK_BUTTON_RADIUS = BACK_BUTTON_SIZE / 2;
const HEADER_HEIGHT = 48; // Reduziert von 56 auf 48

/**
 * Komponente für die obere Navigationsleiste
 * @param root0
 * @param root0.title
 * @param root0.showBackButton
 * @param root0.onBackPress
 * @param root0.showLogo
 * @param root0.rightContent
 * @param root0.containerStyle
 * @param root0.titleStyle
 * @param root0.backButtonContainerStyle
 * @param root0.backButtonIconStyle
 * @param root0.logoStyle
 * @param root0.rightContentContainerStyle
 */
export function HeaderNavigation({
  title,
  showBackButton = true,
  onBackPress,
  showLogo = false,
  rightContent,
  containerStyle,
  titleStyle,
  backButtonContainerStyle,
  backButtonIconStyle,
  logoStyle,
  rightContentContainerStyle
}: HeaderNavigationProps) {
  const colors = useThemeColor();
  const colorScheme = useColorScheme();
  const navigation = useAppNavigation();
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      // Verwende den Expo Router für die Navigation zurück
      router.back();
    }
  };

  // Dynamische Styles
  const bgColor = colors.ui.headerBackground;
  const textColor = colors.ui.headerText;
  const iconColor = textColor;
  const backButtonBgColor = colors.overlay.light;

  // Kombinierte Styles
  const headerStyles = [
    styles.header, 
    { backgroundColor: bgColor },
    containerStyle
  ];
  
  const backButtonStyles = [
    styles.backButton, 
    { backgroundColor: backButtonBgColor },
    backButtonContainerStyle
  ];
  
  const headerTitleStyles = [
    styles.headerTitle, 
    { color: textColor },
    titleStyle
  ];

  return (
    <View 
      style={headerStyles}
      accessible={true}
      accessibilityRole="header"
    >
      <View style={styles.leftSideContainer}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.backButtonContainer}
            onPress={handleBackPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Zurück"
            accessibilityHint="Navigiert zurück zur vorherigen Seite"
          >
            <Ionicons 
              name="chevron-back" 
              size={ui.icon.large} 
              color={iconColor} 
            />
          </TouchableOpacity>
        ) : <View style={styles.placeholderButton} />}
      </View>
      
      <View style={styles.titleContainer}>
        <Text 
          style={headerTitleStyles}
          accessible={true}
          accessibilityRole="header"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      
      <View style={styles.rightSideContainer}>
        {rightContent ? (
          <View style={rightContentContainerStyle}>
            {rightContent}
          </View>
        ) : <View style={styles.placeholderButton} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    paddingTop: Platform.OS === 'android' ? spacing.l + spacing.xs : spacing.xs,
    position: 'relative',
  },
  placeholderButton: {
    width: BACK_BUTTON_SIZE,
  },
  leftSideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: BACK_BUTTON_SIZE + spacing.s * 2,
    paddingLeft: spacing.s,
    zIndex: 1,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'],
    textAlign: 'center',
  },
  rightSideContainer: {
    width: 'auto',
    minWidth: BACK_BUTTON_SIZE + spacing.s * 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: spacing.m,
    zIndex: 1,
  },
  backButtonContainer: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: BACK_BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'],
    textAlign: 'center',
  },
}); 