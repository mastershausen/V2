/**
 * @file features/auth/config/modes.ts
 * @description Konfiguration für verschiedene Auth-Modi
 */

import { AuthMode } from './constants';

/**
 * Überprüft, ob die Anwendung im Demo-Modus läuft
 * @returns Wahr, wenn die Anwendung im Demo-Modus läuft
 */
export function isDemoMode(): boolean {
  // Diese Implementierung kann je nach Umgebung angepasst werden
  // Hier können wir auf Umgebungsvariablen oder gespeicherte Einstellungen zugreifen
  return process.env.EXPO_PUBLIC_APP_MODE === AuthMode.DEMO;
}

/**
 * Überprüft, ob die Anwendung im Live-Modus läuft
 * @returns Wahr, wenn die Anwendung im Live-Modus läuft
 */
export function isLiveMode(): boolean {
  return process.env.EXPO_PUBLIC_APP_MODE === AuthMode.LIVE;
}

/**
 * Überprüft, ob die Anwendung im Entwicklungsmodus läuft
 * @returns Wahr, wenn die Anwendung im Entwicklungsmodus läuft
 */
export function isDevelopmentMode(): boolean {
  return !isDemoMode() && !isLiveMode();
}

/**
 * Ermittelt den aktuellen Auth-Modus
 * @returns Den aktuellen Auth-Modus
 */
export function getCurrentAuthMode(): AuthMode {
  if (isDemoMode()) {
    return AuthMode.DEMO;
  } 
  
  if (isLiveMode()) {
    return AuthMode.LIVE;
  }
  
  return AuthMode.DEVELOPMENT;
} 