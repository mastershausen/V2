import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FirstTimeInfoBoxProps {
  /**
   * Text, der in der InfoBox angezeigt wird
   */
  text: string;
  /**
   * Callback, der aufgerufen wird, wenn der "Verstanden" Button gedrückt wird
   */
  onUnderstood: () => void;
  /**
   * Name des Icons aus der Ionicons-Bibliothek
   * @default "information-circle-outline"
   */
  iconName?: keyof typeof Ionicons.glyphMap;
  /**
   * Zusätzliche Styles für den Container
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Zusätzliche Styles für den Text
   */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * FirstTimeInfoBox Komponente
 * 
 * Zeigt eine InfoBox mit einem "Verstanden" Button an, die nur beim ersten Besuch
 * eines Screens angezeigt wird. Nach dem Klick auf "Verstanden" wird die Box
 * nicht mehr angezeigt.
 * 
 * @example
 * ```tsx
 * <FirstTimeInfoBox 
 *   text="Die Eingabefelder dienen nur als Struktur..."
 *   onUnderstood={markAsVisited}
 * />
 * ```
 */
export function FirstTimeInfoBox({
  text,
  onUnderstood,
  iconName = "information-circle-outline",
  containerStyle,
  textStyle,
}: FirstTimeInfoBoxProps) {
  const colors = useThemeColor();
  const { t } = useTranslation();

  return (
    <View style={[
      styles.infoBox, 
      { 
        backgroundColor: `${colors.primary}10`,
        borderColor: `${colors.primary}30`,
      }, 
      containerStyle
    ]}>
      <View style={styles.contentContainer}>
        <View style={styles.iconTextContainer}>
          <Ionicons 
            name={iconName} 
            size={24} 
            color={colors.primary} 
            style={styles.infoIcon} 
          />
          <Text style={[
            styles.infoText, 
            { color: colors.textSecondary }, 
            textStyle
          ]}>
            {text}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.understoodButton, { backgroundColor: colors.primary }]}
          onPress={onUnderstood}
          activeOpacity={0.8}
        >
          <Text style={[styles.understoodButtonText, { color: 'white' }]}>
            {t('ui.firstTimeInfo.understood')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    borderWidth: 1,
  },
  contentContainer: {
    flex: 1,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  infoIcon: {
    marginRight: spacing.s,
    marginTop: 1, // Kleine Anpassung für bessere Ausrichtung
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.s,
    lineHeight: 18,
  },
  understoodButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: ui.borderRadius.s,
  },
  understoodButtonText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as any,
  },
});

export default FirstTimeInfoBox; 