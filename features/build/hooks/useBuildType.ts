/**
 * @file features/build/hooks/useBuildType.ts
 * @description React Hook für den Zugriff auf Build-Typ-Informationen
 * 
 * Dieser Hook bietet Zugriff auf Build-Typ-Informationen und -Funktionen
 * für Komponenten. Er ermöglicht es, Build-abhängige UI-Elemente zu rendern.
 */

import { useMemo } from 'react';
import { BuildType, BuildConfig } from '../types';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';
import { BuildService } from '../services/BuildService';

/**
 * Rückgabetyp des useBuildType Hooks
 */
export interface UseBuildTypeResult {
  /** Der aktuelle Build-Typ */
  buildType: BuildType;
  /** Die vollständige Build-Konfiguration */
  buildConfig: BuildConfig;
  /** Prüft, ob es ein Development-Build ist */
  isDevBuild: boolean;
  /** Prüft, ob es ein Demo-Build ist */
  isDemoBuild: boolean;
  /** Prüft, ob es ein Live-Build ist */
  isLiveBuild: boolean;
  /** Prüft, ob es ein Staging-Build ist */
  isStagingBuild: boolean;
  /** Prüft, ob im aktuellen Build der App-Modus gewechselt werden kann */
  canSwitchAppMode: boolean;
  /** Prüft, ob Debug-Features aktiviert sind */
  isDebugEnabled: boolean;
  /** Prüft, ob Mock-Daten verwendet werden */
  usesMockData: boolean;
}

/**
 * Hilfsfunktion zum Abrufen des BuildService aus der ServiceRegistry
 */
function getBuildService(): BuildService {
  try {
    return ServiceRegistry.getInstance().getService<BuildService>(ServiceType.BUILD);
  } catch (error) {
    console.error('[useBuildType] Fehler beim Abrufen des BuildService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new BuildService();
  }
}

/**
 * Hook für den Zugriff auf Build-Typ-Informationen
 * @returns Build-Typ-Informationen und Hilfsfunktionen
 */
export function useBuildType(): UseBuildTypeResult {
  // Verwende useMemo für bessere Performance
  return useMemo(() => {
    const buildService = getBuildService();
    const buildType = buildService.getCurrentBuildType();
    const buildConfig = buildService.getCurrentBuildConfig();
    
    return {
      buildType,
      buildConfig,
      isDevBuild: buildService.isDevBuild(),
      isDemoBuild: buildService.isDemoBuild(),
      isLiveBuild: buildService.isLiveBuild(),
      isStagingBuild: buildService.isStagingBuild(),
      canSwitchAppMode: buildService.canSwitchAppMode(),
      isDebugEnabled: buildService.isDebugEnabled(),
      usesMockData: buildService.shouldUseMockData()
    };
  }, []);
} 