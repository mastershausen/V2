import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { TabScreenProps } from '../types';

/**
 * NewsTab
 * 
 * Tab-Komponente für den "News"-Tab (Neuheiten/What's New) im SolvboxAI-Bereich.
 * Zeigt Neuigkeiten und aktuelle Entwicklungen.
 * 
 * @param {TabScreenProps} props - Die Props für die Tab-Komponente
 * @returns {React.ReactElement} Die gerenderte Komponente
 */
export default function NewsTab({ isActive }: TabScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const colors = useThemeColor();
  
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('solvboxai.tabs.news')}</Text>
      <Text style={styles.description}>
        Diese Ansicht zeigt Neuigkeiten und aktuelle Entwicklungen.
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