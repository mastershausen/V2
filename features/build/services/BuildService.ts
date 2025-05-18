/**
 * @file features/build/services/BuildService.ts
 * @description Service für Build-Typ-Management und Konfigurationszugriff
 * 
 * Dieser Service bietet Methoden zum Prüfen des aktuellen Build-Typs, zum
 * Zugriff auf Build-Konfigurationen und zur Verwaltung von Build-abhängigen
 * Funktionen. Implementiert das IService-Interface.
 */

import { BuildType, BuildConfig } from '../types';
import { BUILD_CONFIGS, DEFAULT_BUILD_TYPE } from '../config/buildConfigs';
import { IService } from '@/utils/service/serviceRegistry';

// Festlegung des BuildTypes einmalig beim Import dieses Moduls
const CURRENT_BUILD_TYPE: BuildType = __DEV__ ? 'dev' : (process.env.BUILD_TYPE as BuildType || DEFAULT_BUILD_TYPE);
const CURRENT_BUILD_CONFIG = BUILD_CONFIGS[CURRENT_BUILD_TYPE];

/**
 * Service für Build-bezogene Operationen
 * Implementiert das IService-Interface
 */
export class BuildService implements IService {
  /**
   * Initialisierung des Services
   */
  async init(): Promise<void> {
    // Keine spezielle Initialisierung erforderlich
  }

  /**
   * Freigabe von Ressourcen
   */
  async dispose(): Promise<void> {
    // Keine spezielle Ressourcenfreigabe erforderlich
  }

  /**
   * Gibt den aktuellen Build-Typ zurück
   * @returns Den aktuellen Build-Typ
   */
  getCurrentBuildType(): BuildType {
    return CURRENT_BUILD_TYPE;
  }

  /**
   * Gibt die Konfiguration für den aktuellen Build-Typ zurück
   * @returns Die aktuelle Build-Konfiguration
   */
  getCurrentBuildConfig(): BuildConfig {
    return CURRENT_BUILD_CONFIG;
  }

  /**
   * Prüft, ob die Anwendung im Development-Build läuft
   * @returns True, wenn es ein Development-Build ist
   */
  isDevBuild(): boolean {
    return __DEV__ || CURRENT_BUILD_TYPE === 'dev';
  }

  /**
   * Prüft, ob die Anwendung im Demo-Build läuft
   * @returns True, wenn es ein Demo-Build ist
   */
  isDemoBuild(): boolean {
    return !__DEV__ && CURRENT_BUILD_TYPE === 'demo';
  }

  /**
   * Prüft, ob die Anwendung im Live-Build läuft
   * @returns True, wenn es ein Live-Build ist
   */
  isLiveBuild(): boolean {
    return !__DEV__ && CURRENT_BUILD_TYPE === 'live';
  }

  /**
   * Prüft, ob die Anwendung im Staging-Build läuft
   * @returns True, wenn es ein Staging-Build ist
   */
  isStagingBuild(): boolean {
    return CURRENT_BUILD_TYPE === 'staging';
  }

  /**
   * Prüft, ob im aktuellen Build-Typ der App-Modus gewechselt werden kann
   * @returns True, wenn der App-Modus gewechselt werden kann
   */
  canSwitchAppMode(): boolean {
    return CURRENT_BUILD_CONFIG.canSwitchMode;
  }

  /**
   * Gibt den Standard-App-Modus für den aktuellen Build-Typ zurück
   * @returns Der Standard-App-Modus
   */
  getDefaultAppMode(): string {
    return CURRENT_BUILD_CONFIG.defaultMode;
  }

  /**
   * Gibt die API-Basis-URL für den aktuellen Build-Typ zurück
   * @returns Die API-Basis-URL
   */
  getApiBaseUrl(): string {
    return CURRENT_BUILD_CONFIG.apiBase;
  }

  /**
   * Prüft, ob im aktuellen Build-Typ Mock-Daten verwendet werden sollen
   * @returns True, wenn Mock-Daten verwendet werden sollen
   */
  shouldUseMockData(): boolean {
    return CURRENT_BUILD_CONFIG.useMockData;
  }

  /**
   * Prüft, ob Debug-Features aktiviert sind
   * @returns True, wenn Debug-Features aktiviert sind
   */
  isDebugEnabled(): boolean {
    return CURRENT_BUILD_CONFIG.debugEnabled;
  }
} 