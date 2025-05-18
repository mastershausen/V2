/**
 * @file features/build/index.ts
 * @description Hauptexport-Datei für das Build-Feature
 * 
 * Diese Datei exportiert alle wichtigen Komponenten, Hooks, Dienste und
 * Hilfsfunktionen des Build-Features für die Verwendung in anderen Teilen
 * der Anwendung.
 */

// Typen
export type { BuildType, BuildConfig, EnvironmentInfo } from './types';

// Konfiguration
export { BUILD_CONFIGS, DEFAULT_BUILD_TYPE } from './config/buildConfigs';
export { getEnvironment, isValidBuildType, resetEnvironment } from './config/environment';

// Services
export { BuildService } from './services/BuildService';

// Hooks
export { useBuildType } from './hooks/useBuildType';
export type { UseBuildTypeResult } from './hooks/useBuildType';
export { useBuildInfo, BuildInfoDisplay } from './hooks/useBuildInfo';

// Komponenten
export { BuildIndicator } from './components/BuildIndicator';

// Hilfsfunktionen
export {
  executeInBuildTypes,
  executeInDevBuild,
  executeInDemoBuild,
  executeInLiveBuild,
  executeInNonLiveBuilds
} from './utils/buildHelpers'; 