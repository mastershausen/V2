/**
 * Debug-Hilfsfunktionen für die Anwendung
 * 
 * Diese Datei enthält Hilfsfunktionen, die während der Entwicklung nützlich sind,
 * aber nicht für die Produktion bestimmt sind.
 */

import { Platform } from 'react-native';

import { logger } from './logger';

/**
 * Prüft, ob die Anwendung im Entwicklungsmodus läuft
 * @returns {boolean} true wenn im Entwicklungsmodus
 */
export function isDevelopmentMode(): boolean {
  // __DEV__ ist eine globale Variable, die von React Native automatisch gesetzt wird
  return __DEV__;
}

/**
 * Prüft, ob die Anwendung auf einem Simulator oder Emulator läuft
 * @returns {boolean} true wenn auf Simulator/Emulator
 */
export function isRunningOnEmulator(): boolean {
  if (Platform.OS === 'ios') {
    // iOS-Simulator-Erkennung (basierend auf Gerätenamen)
    return Platform.constants.systemName.includes('Simulator');
  }
  
  if (Platform.OS === 'android') {
    // Android-Emulator-Erkennung
    return Platform.constants.Brand === 'google' ||
           Platform.constants.Manufacturer?.includes('Genymotion');
  }
  
  return false;
}

/**
 * Gibt Debug-Informationen über die aktuelle Umgebung aus
 */
export function logDebugInfo(): void {
  logger.debug('Debug-Informationen:', {
    isDev: __DEV__,
    platform: Platform.OS,
    platformVersion: Platform.Version,
    isEmulator: isRunningOnEmulator(),
    constants: Platform.constants
  });
} 