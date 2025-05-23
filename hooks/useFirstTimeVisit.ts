import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_VISIT_PREFIX = 'first_visit_';

/**
 * Hook zum Verfolgen von ersten Besuchen bestimmter Screens
 * @param screenKey Eindeutiger Schlüssel für den Screen (z.B. 'nowThenFrame')
 * @returns Object mit isFirstVisit boolean und markAsVisited Funktion
 */
export function useFirstTimeVisit(screenKey: string) {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = `${FIRST_VISIT_PREFIX}${screenKey}`;

  useEffect(() => {
    checkFirstVisit();
  }, [screenKey]);

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem(storageKey);
      setIsFirstVisit(hasVisited === null);
    } catch (error) {
      console.error('Fehler beim Prüfen des ersten Besuchs:', error);
      // Bei Fehler als ersten Besuch behandeln
      setIsFirstVisit(true);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsVisited = async () => {
    try {
      await AsyncStorage.setItem(storageKey, 'visited');
      setIsFirstVisit(false);
    } catch (error) {
      console.error('Fehler beim Markieren als besucht:', error);
    }
  };

  return {
    isFirstVisit,
    isLoading,
    markAsVisited
  };
} 