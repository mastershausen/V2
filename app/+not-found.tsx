import { Link, Stack } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { ThemedText } from '@/shared-components/theme/ThemedText';
import { ThemedView } from '@/shared-components/theme/ThemedView';

/**
 * 404-Fehlerseite für nicht gefundene Routen
 */
export default function NotFoundScreen() {
  const { t } = useTranslation();
  
  return (
    <>
      <Stack.Screen options={{ title: t('errors.oops') }} />
      <ThemedView style={styles.container}>
        <ThemedText 
          variant="title"
          accessible={true}
          accessibilityRole="header"
        >
          {t('errors.screenNotFound')}
        </ThemedText>
        
        <Link href="/" style={styles.link}>
          <ThemedText 
            variant="subtitle"
            accessible={true}
            accessibilityRole="link"
          >
            {t('navigation.goToHome')}
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  link: {
    marginTop: spacing.m,
    paddingVertical: spacing.m,
  },
});
