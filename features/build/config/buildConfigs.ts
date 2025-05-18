/**
 * @file features/build/config/buildConfigs.ts
 * @description Konfigurationen für verschiedene Build-Typen
 * 
 * Diese Datei definiert die Konfigurationen für alle unterstützten Build-Typen
 * und dient als Single Source of Truth für alle build-bezogenen Einstellungen.
 */

import { BuildType, BuildConfig } from '../types';

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