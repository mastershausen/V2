import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { themeColors } from '@/config/theme/colors';
import { spacing } from '@/config/theme/spacing';
import { ui } from '@/config/theme/ui';
import { BaseTabScreen } from '@/shared-components/container/BaseTabScreen';

// Hole die Farben aus dem Theme (helle Version als Standard)
const colors = themeColors.light;

/**
 * Props für die SaveTabErrorFallback-Komponente
 */
interface SaveTabErrorFallbackProps {
  /**
   * Die Fehlermeldung, die angezeigt werden soll
   */
  message?: string;
}

/**
 * Standardfehlermeldung
 */
const DEFAULT_ERROR_MESSAGE = 'Beim Laden der Kostenoptimierungen ist ein Fehler aufgetreten. Bitte versuche es später erneut.';

/**
 * Fehlerfallback-Komponente für den SaveTab
 * 
 * Zeigt eine benutzerfreundliche Fehlermeldung an, wenn im SaveTab ein Fehler auftritt.
 * @param root0
 * @param root0.message
 */
export function SaveTabErrorFallback({ 
  message = DEFAULT_ERROR_MESSAGE 
}: SaveTabErrorFallbackProps): React.ReactElement {
  return (
    <BaseTabScreen>
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
      </View>
    </BaseTabScreen>
  );
}

/**
 * Styles für die SaveTabErrorFallback-Komponente
 */
const styles = StyleSheet.create({
  container: {
    padding: spacing.m,
    width: '100%',
  },
  errorBox: {
    backgroundColor: colors.error + '15', // 15% Opazität für den Hintergrund
    borderRadius: ui.borderRadius.s,
    padding: spacing.m,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
  },
}); 