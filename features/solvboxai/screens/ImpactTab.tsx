import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { TabScreenProps } from '../types';

/**
 * ImpactTab
 * 
 * Tab-Komponente für den "Impact"-Tab (Ergebnisse/Proven Impact) im SolvboxAI-Bereich.
 * Zeigt die Auswirkungen und Erfolgsergebnisse.
 * 
 * @param {TabScreenProps} props - Die Props für die Tab-Komponente
 * @returns {React.ReactElement} Die gerenderte Komponente
 */
export default function ImpactTab({ isActive }: TabScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const colors = useThemeColor();
  
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('solvboxai.tabs.impact')}</Text>
      <Text style={styles.description}>
        Diese Ansicht zeigt die Auswirkungen und Erfolgsergebnisse.
      </Text>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  description: {
    fontSize: typography.fontSize.m,
    color: colors.textSecondary,
    marginBottom: spacing.l,
  }
}); 