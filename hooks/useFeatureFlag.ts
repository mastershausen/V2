/**
 * Hook für die Verwendung von Feature-Flags in React-Komponenten
 *
 * Dieser Hook bietet eine einfache Möglichkeit, Feature-Flags in Komponenten zu verwenden
 * und reagiert auf Änderungen der Flags während der Laufzeit.
 * @example
 * const isDebugMenuEnabled = useFeatureFlag('DEBUG_MENU');
 * 
 * // Mit Kontext für Tracking
 * const isPremiumEnabled = useFeatureFlag('PREMIUM_FEATURES', { screenName: 'ProfileScreen' });
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

import { FeatureFlags, FeatureFlag } from '@/config/features';

// Schlüsselprefix für AsyncStorage
const FEATURE_FLAG_STORAGE_PREFIX = 'feature_flag_override_';

/**
 * Hook für die Verwendung von Feature-Flags in React-Komponenten
 * @param flagName Name des Feature-Flags
 * @param trackingInfo Optionale Tracking-Informationen
 * @param trackingInfo.screenName
 * @returns Boolean, der angibt, ob das Feature aktiviert ist
 */
export function useFeatureFlag(
  flagName: FeatureFlag,
  trackingInfo?: { screenName?: string }
): boolean {
  // State für den aktuellen Wert des Flags
  const [isEnabled, setIsEnabled] = useState<boolean>(() => 
    FeatureFlags.isEnabled(flagName, trackingInfo)
  );

  // Effekt zum Laden von Überschreibungen aus AsyncStorage
  useEffect(() => {
    let isMounted = true;

    const loadOverrides = async () => {
      try {
        const storageKey = `${FEATURE_FLAG_STORAGE_PREFIX}${flagName}`;
        const storedValue = await AsyncStorage.getItem(storageKey);
        
        // Wenn ein Wert in AsyncStorage vorhanden ist, aktualisiere den State
        if (storedValue !== null && isMounted) {
          const parsedValue = JSON.parse(storedValue);
          if (typeof parsedValue === 'boolean') {
            setIsEnabled(parsedValue);
          }
        }
      } catch (error) {
        console.error(`Fehler beim Laden des Feature-Flag-Status für ${flagName}:`, error);
      }
    };

    loadOverrides();

    return () => {
      isMounted = false;
    };
  }, [flagName]);

  return isEnabled;
} 