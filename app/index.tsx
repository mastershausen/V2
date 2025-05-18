/**
 * @file app/index.tsx
 * @description Vereinfachte Startseite, die nach einiger Zeit zum Login navigiert
 */

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { logger } from '@/utils/logger';

/**
 *
 */
export default function Index() {
  const colors = useThemeColor();
  const [isNavigating, setIsNavigating] = useState(false);

  // Verbesserte Verzögerung und Navigation zum Login mit Logging
  useEffect(() => {
    logger.info('Startbildschirm wird angezeigt - warte vor Navigation zum Login...');
    
    const timer = setTimeout(() => {
      try {
        logger.info('Navigiere zum Login-Bildschirm...');
        setIsNavigating(true);
        
        // Versuche mit einer kurzen Verzögerung, um sicherzustellen,
        // dass alle Zustandsänderungen durchgeführt wurden
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 100);
      } catch (error) {
        logger.error('Fehler bei der Navigation zum Login:', 
          error instanceof Error ? error.message : String(error)
        );
      }
    }, 3000); // Längere Verzögerung für besseres Timing
    
    return () => {
      clearTimeout(timer);
      logger.info('Startbildschirm-Timer bereinigt');
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        Solvbox wird geladen...
      </Text>
      <ActivityIndicator 
        size="large" 
        color={colors.primary} 
        style={styles.loader} 
      />
      {isNavigating && (
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          Navigiere zum Login...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  subtext: {
    fontSize: 14,
    marginTop: 20,
    opacity: 0.7,
  },
  loader: {
    marginVertical: 20,
  }
}); 