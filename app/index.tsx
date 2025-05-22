/**
 * @file app/index.tsx
 * @description Vereinfachte Startseite, die direkt zur App navigiert (Auth-Flow deaktiviert)
 */

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { logger } from '@/utils/logger';

/**
 *
 */
export default function Index() {
  const colors = useThemeColor();
  const [isNavigating, setIsNavigating] = useState(false);

  // Verbesserte Verzögerung und direktes Weiterleiten zur Haupt-App (Auth übersprungen)
  useEffect(() => {
    logger.info('Startbildschirm wird angezeigt - warte vor Navigation zur App...');
    
    // DEBUG: Zeige Hinweis, dass wir den Startbildschirm sehen
    if (__DEV__) {
      Alert.alert('Debug', 'Startbildschirm wird angezeigt. Wir navigieren in Kürze zur Haupt-App.');
    }
    
    const timer = setTimeout(() => {
      try {
        logger.info('Navigiere direkt zur App...');
        setIsNavigating(true);
        
        // Versuche mit einer kurzen Verzögerung, um sicherzustellen,
        // dass alle Zustandsänderungen durchgeführt wurden
        setTimeout(() => {
          // Direkt zur Olivia-Seite navigieren
          router.replace('/chats/olivia');
          
          // DEBUG: Zeige Hinweis nach der Navigation
          if (__DEV__) {
            setTimeout(() => {
              Alert.alert('Debug', 'Navigation zur Olivia wurde ausgelöst. Sind wir angekommen?');
            }, 500);
          }
        }, 100);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error('Fehler bei der Navigation zur App:', errorMsg);
        
        // DEBUG: Zeige Fehler an
        if (__DEV__) {
          Alert.alert('Navigationsfehler', `Fehler beim Navigieren zur App: ${errorMsg}`);
        }
      }
    }, 1500); // Kürzere Verzögerung für schnelleres Testen
    
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
          App wird gestartet...
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