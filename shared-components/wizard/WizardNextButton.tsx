import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WizardNextButtonProps {
  /**
   * Text des Buttons (standardmäßig "Weiter")
   */
  title?: string;
  /**
   * Callback für Button-Press
   */
  onPress: () => void;
  /**
   * Ob der Button aktiviert ist (basiert meist auf Texteingabe)
   */
  isEnabled: boolean;
  /**
   * Icon-Name (standardmäßig "arrow-forward")
   */
  iconName?: keyof typeof Ionicons.glyphMap;
  /**
   * Position der Tastatur (für korrektes Positioning)
   */
  keyboardHeight?: number;
  /**
   * Benutzerdefinierte Container-Styles
   */
  containerStyle?: object;
  /**
   * Benutzerdefinierte Button-Styles
   */
  buttonStyle?: object;
}

/**
 * WizardNextButton - Wiederverwendbarer Weiter-Button für Wizard-Screens
 * 
 * Ein styled Button mit Icon, der sich automatisch über der Tastatur positioniert
 * und sein Aussehen basierend auf dem Enabled-Status ändert.
 */
export function WizardNextButton({ 
  title = "Weiter",
  onPress,
  isEnabled,
  iconName = "arrow-forward",
  keyboardHeight = 0,
  containerStyle,
  buttonStyle
}: WizardNextButtonProps) {
  const colors = useThemeColor();
  
  return (
    <View 
      style={[
        styles.keyboardToolbar,
        { 
          backgroundColor: colors.backgroundPrimary,
          bottom: keyboardHeight,
          borderTopColor: colors.inputBorder,
        },
        containerStyle
      ]}
    >
      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            backgroundColor: isEnabled ? colors.primary : colors.inputBorder,
          },
          buttonStyle
        ]}
        onPress={onPress}
        disabled={!isEnabled}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.nextButtonText,
          {
            color: isEnabled ? 'white' : colors.textTertiary,
          }
        ]}>
          {title}
        </Text>
        <Ionicons 
          name={iconName} 
          size={20} 
          color={isEnabled ? 'white' : colors.textTertiary}
          style={styles.nextIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16, // spacing.l
    paddingVertical: 8, // spacing.s
    borderTopWidth: 1,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8, // spacing.s
    paddingHorizontal: 16, // spacing.l
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4, // spacing.xs
  },
  nextIcon: {
    marginLeft: 4, // spacing.xs
  },
}); 