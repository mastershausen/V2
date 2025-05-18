/**
 * @file features/build/types/index.ts
 * @description Zentrale Typdefinitionen für das Build-Feature
 * 
 * Diese Datei definiert alle Typen und Interfaces, die im Zusammenhang mit 
 * dem Build-System verwendet werden.
 */

import { AppMode } from '@/features/mode/types';

/**
 * Definiert die verfügbaren Build-Typen
 */
export type BuildType = 'dev' | 'demo' | 'live' | 'staging';

/**
 * Basis-Konfiguration für alle Build-Typen
 */
export interface BuildConfig {
  /** Name des Builds */
  name: string;
  /** Beschreibung des Build-Typs */
  description: string;
  /** Standard-Modus für diesen Build */
  defaultMode: AppMode;
  /** Ob der Modus gewechselt werden kann */
  canSwitchMode: boolean;
  /** Ob Debug-Features aktiviert sind */
  debugEnabled: boolean;
  /** Ob Mock-Daten verwendet werden */
  useMockData: boolean;
  /** API-Endpunkt-Basis */
  apiBase: string;
  /** Ob Daten zwischen Sessions persistent sind */
  persistData: boolean;
}

/**
 * Environment-Informationen, die aus Umgebungsvariablen geladen werden
 */
export interface EnvironmentInfo {
  /** Der aktuelle Build-Typ */
  buildType: BuildType;
  /** Ob wir im Entwicklungsmodus sind (__DEV__) */
  isDevelopment: boolean;
  /** Der API-Basis-URL */
  apiBaseUrl: string;
  /** Ob Debug-Logging aktiviert ist */
  debugEnabled: boolean;
} 