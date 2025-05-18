/**
 * Env-Helper
 * 
 * Enthält Hilfsfunktionen für die Umgebungskonfiguration,
 * die ohne Abhängigkeiten zu Stores oder anderen Laufzeitkomponenten arbeiten können.
 * Diese Datei darf NUR statische Konfigurationen enthalten und keine Stores importieren.
 */

import { AppMode } from './env';

// App-Modi als Konstanten für bessere Lesbarkeit
export const APP_MODES = {
  DEVELOPMENT: 'development' as AppMode,
  DEMO: 'demo' as AppMode,
  PRODUCTION: 'live' as AppMode,
};

/**
 * Prüft, ob die App im Demo-Modus läuft, nur basierend auf statischen Werten
 * Diese Version vermeidet jegliche Store-Abhängigkeiten, um zirkuläre Abhängigkeiten zu vermeiden
 * @returns {boolean} true, wenn im Demo-Modus basierend auf Umgebungsvariablen
 */
export function checkDemoMode(): boolean {
  // Nur statische Prüfung basierend auf Umgebungsvariablen
  return process.env.EXPO_PUBLIC_APP_VARIANT === 'demo' || 
         process.env.EXPO_PUBLIC_APP_ENV === 'demo' || 
         process.env.APP_ENV === 'demo';
}

/**
 * Prüft, ob Mock-Daten verwendet werden sollen, nur basierend auf statischen Werten
 * @returns {boolean} true, wenn Mock-Daten verwendet werden sollen
 */
export function shouldUseMockDataFallback(): boolean {
  // Im Demo-Modus oder Development immer Mock-Daten verwenden
  if (checkDemoMode() || __DEV__) {
    return true;
  }
  
  // Ansonsten keine Mock-Daten
  return false;
} 