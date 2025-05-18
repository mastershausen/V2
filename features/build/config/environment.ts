/**
 * @file features/build/config/environment.ts
 * @description Vereinfachte Umgebungsvariablen für das Build-System
 * 
 * Diese Datei stellt nur die Exports bereit, die für die Kompatibilität mit 
 * bestehenden Imports nötig sind, ohne die redundante Build-Typ-Logik.
 */

import { BuildType, EnvironmentInfo } from '../types';
import { BUILD_CONFIGS, DEFAULT_BUILD_TYPE } from './buildConfigs';

/**
 * Prüft, ob ein String ein gültiger BuildType ist
 * @param value Der zu prüfende Wert
 * @returns True, wenn es ein gültiger BuildType ist
 */
export function isValidBuildType(value: string): value is BuildType {
  return Object.keys(BUILD_CONFIGS).includes(value as BuildType);
}

/**
 * Gibt statische Environment-Informationen zurück - ohne dynamische Ermittlung
 * @returns Die Environment-Informationen
 */
export function getEnvironment(): EnvironmentInfo {
  const buildType: BuildType = __DEV__ ? 'dev' : (process.env.BUILD_TYPE as BuildType || DEFAULT_BUILD_TYPE);
  const buildConfig = BUILD_CONFIGS[buildType];
  
  return {
    buildType,
    isDevelopment: __DEV__,
    apiBaseUrl: buildConfig.apiBase,
    debugEnabled: buildConfig.debugEnabled
  };
}

/**
 * Dummy-Funktion für Kompatibilität mit bestehendem Code
 */
export function resetEnvironment(): void {
  // Tut nichts, da wir keinen Cache mehr haben
} 