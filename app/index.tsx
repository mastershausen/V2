/**
 * @file app/index.tsx
 * @description Vereinfachte Startseite für Development Client
 */

import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { logger } from '@/utils/logger';

/**
 * Vereinfachte Index-Komponente
 */
export default function Index() {
  const colors = useThemeColor();

  useEffect(() => {
    logger.info('Index-Screen geladen - navigiere direkt zu Olivia');
    
    // Direkte Navigation zu Olivia Chat
    const timer = setTimeout(() => {
          router.replace('/chats/olivia');
        }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        Solvbox lädt...
      </Text>
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
  },
}); 