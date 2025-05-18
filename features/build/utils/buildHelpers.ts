/**
 * @file features/build/utils/buildHelpers.ts
 * @description Hilfsfunktionen für Build-Typ-bezogene Operationen
 * 
 * Diese Datei enthält nützliche Hilfsfunktionen, die im Zusammenhang mit
 * Build-Typen und Umgebungsvariablen verwendet werden können.
 */

import { BuildType } from '../types';
import { BuildService } from '../services/BuildService';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';
import { logger } from '@/utils/logger';

/**
 * Hilfsfunktion zum Abrufen des BuildService aus der ServiceRegistry
 */
function getBuildService(): BuildService {
  try {
    return ServiceRegistry.getInstance().getService<BuildService>(ServiceType.BUILD);
  } catch (error) {
    logger.error('[buildHelpers] Fehler beim Abrufen des BuildService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new BuildService();
  }
}

/**
 * Führt einen Codeblock nur in bestimmten Build-Typen aus
 * @param buildTypes Array von Build-Typen, in denen der Code ausgeführt werden soll
 * @param callback Funktion, die ausgeführt werden soll
 * @param fallback Optionale Fallback-Funktion für andere Build-Typen
 * @returns Das Ergebnis der ausgeführten Funktion
 */
export function executeInBuildTypes<T>(
  buildTypes: BuildType[],
  callback: () => T,
  fallback?: () => T
): T | undefined {
  const buildService = getBuildService();
  const currentBuild = buildService.getCurrentBuildType();
  
  if (buildTypes.includes(currentBuild)) {
    return callback();
  } else if (fallback) {
    return fallback();
  }
  
  return undefined;
}

/**
 * Führt einen Codeblock nur im Dev-Build aus
 * @param callback Funktion, die ausgeführt werden soll
 * @param fallback Optionale Fallback-Funktion für andere Build-Typen
 * @returns Das Ergebnis der ausgeführten Funktion
 */
export function executeInDevBuild<T>(
  callback: () => T,
  fallback?: () => T
): T | undefined {
  return executeInBuildTypes(['dev'], callback, fallback);
}

/**
 * Führt einen Codeblock nur im Demo-Build aus
 * @param callback Funktion, die ausgeführt werden soll
 * @param fallback Optionale Fallback-Funktion für andere Build-Typen
 * @returns Das Ergebnis der ausgeführten Funktion
 */
export function executeInDemoBuild<T>(
  callback: () => T,
  fallback?: () => T
): T | undefined {
  return executeInBuildTypes(['demo'], callback, fallback);
}

/**
 * Führt einen Codeblock nur im Live-Build aus
 * @param callback Funktion, die ausgeführt werden soll
 * @param fallback Optionale Fallback-Funktion für andere Build-Typen
 * @returns Das Ergebnis der ausgeführten Funktion
 */
export function executeInLiveBuild<T>(
  callback: () => T,
  fallback?: () => T
): T | undefined {
  return executeInBuildTypes(['live'], callback, fallback);
}

/**
 * Führt einen Codeblock in allen Nicht-Live-Builds aus (Dev, Demo, Staging)
 * @param callback Funktion, die ausgeführt werden soll
 * @param fallback Optionale Fallback-Funktion für Live-Build
 * @returns Das Ergebnis der ausgeführten Funktion
 */
export function executeInNonLiveBuilds<T>(
  callback: () => T,
  fallback?: () => T
): T | undefined {
  return executeInBuildTypes(['dev', 'demo', 'staging'], callback, fallback);
} 