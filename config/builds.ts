/**
 * @file config/builds.ts
 * @description Zentrale Konfigurationen und Utilities für das Build-System
 * 
 * Diese Datei dient als Single Source of Truth für alle build-bezogenen
 * Konfigurationen, Typen und Hilfsfunktionen.
 */

import { AppMode } from '@/features/mode/types';

/**
 * Definiert die verfügbaren Build-Typen
 */
export type BuildType = 'dev' | 'demo' | 'live' | 'staging';

/**
 * @deprecated Bitte importiere AppMode direkt aus '@/features/mode/types'
 * Definiert die verfügbaren App-Modi
 */
// export type AppMode = 'demo' | 'live';

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
 * Konfigurationen für jeden Build-Typ
 */
export const BUILD_CONFIGS: Record<BuildType, BuildConfig> = {
  // Entwicklungs-Build
  dev: {
    name: 'Development',
    description: 'Build für Entwicklung und Testing',
    defaultMode: 'demo',
    canSwitchMode: true,
    debugEnabled: true,
    useMockData: true,
    apiBase: 'http://localhost:3000',
    persistData: false
  },
  
  // Demo-Build
  demo: {
    name: 'Demo',
    description: 'Build für Demonstrationen ohne Backend',
    defaultMode: 'demo',
    canSwitchMode: false,
    debugEnabled: false,
    useMockData: true,
    apiBase: 'mock://',
    persistData: true
  },
  
  // Live-Build
  live: {
    name: 'Production',
    description: 'Produktions-Build mit Backend-Integration',
    defaultMode: 'live',
    canSwitchMode: false,
    debugEnabled: false,
    useMockData: false,
    apiBase: 'https://api.solvbox.com',
    persistData: true
  },
  
  // Staging-Build (für zukünftige Verwendung)
  staging: {
    name: 'Staging',
    description: 'Test-Build mit Staging-Backend',
    defaultMode: 'live',
    canSwitchMode: true,
    debugEnabled: true,
    useMockData: false,
    apiBase: 'https://staging-api.solvbox.com',
    persistData: true
  }
};

/**
 * Standardmäßiger Build-Typ für die Entwicklung
 */
export const DEFAULT_BUILD_TYPE: BuildType = 'dev';

/**
 * Ermittelt den aktuellen Build-Typ basierend auf Umgebungsvariablen
 * @returns Den aktuellen Build-Typ
 */
export function getCurrentBuildType(): BuildType {
  // In einer realen Implementierung würde dies aus process.env oder 
  // einer anderen Konfigurationsquelle gelesen
  const envBuildType = process.env.BUILD_TYPE;
  
  if (envBuildType && isValidBuildType(envBuildType)) {
    return envBuildType;
  }
  
  // Standard ist der Dev-Build
  return DEFAULT_BUILD_TYPE;
}

/**
 * Prüft, ob ein String ein gültiger BuildType ist
 * @param value Der zu prüfende Wert
 * @returns True, wenn es ein gültiger BuildType ist
 */
export function isValidBuildType(value: string): value is BuildType {
  return Object.keys(BUILD_CONFIGS).includes(value as BuildType);
}

/**
 * Holt die Konfiguration für den aktuellen Build-Typ
 * @returns Die aktuelle Build-Konfiguration
 */
export function getCurrentBuildConfig(): BuildConfig {
  const buildType = getCurrentBuildType();
  return BUILD_CONFIGS[buildType];
}

/**
 * Hilfsfunktionen für Build-Typ-Checks
 */
export const isDevBuild = (): boolean => getCurrentBuildType() === 'dev';
export const isDemoBuild = (): boolean => getCurrentBuildType() === 'demo';
export const isLiveBuild = (): boolean => getCurrentBuildType() === 'live';
export const isStagingBuild = (): boolean => getCurrentBuildType() === 'staging';

/**
 * Prüft, ob ein Feature im aktuellen Build verfügbar ist
 * @param featureCheck Eine Funktion, die basierend auf der BuildConfig prüft, ob das Feature verfügbar ist
 * @returns True, wenn das Feature verfügbar ist
 */
export function isFeatureEnabled(featureCheck: (config: BuildConfig) => boolean): boolean {
  const config = getCurrentBuildConfig();
  return featureCheck(config);
}

/**
 * Häufig verwendete Feature-Checks
 */
export const isDebugEnabled = (): boolean => 
  isFeatureEnabled(config => config.debugEnabled);

export const canSwitchAppMode = (): boolean => 
  isFeatureEnabled(config => config.canSwitchMode);

export const shouldUseMockData = (): boolean => 
  isFeatureEnabled(config => config.useMockData);

export const shouldPersistData = (): boolean => 
  isFeatureEnabled(config => config.persistData);

/**
 * Gibt den Standard-App-Modus für den aktuellen Build-Typ zurück
 * @returns Der Standard-App-Modus
 */
export function getDefaultAppMode(): AppMode {
  return getCurrentBuildConfig().defaultMode;
}

/**
 * Gibt die API-Basis-URL für den aktuellen Build-Typ zurück
 * @returns Die API-Basis-URL
 */
export function getApiBaseUrl(): string {
  return getCurrentBuildConfig().apiBase;
} 