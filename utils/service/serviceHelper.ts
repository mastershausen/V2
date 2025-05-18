/**
 * Service-Hilfsfunktionen
 * 
 * Stellt generische und spezifische Hilfsfunktionen für den Zugriff auf
 * Services über die ServiceRegistry bereit. Diese Funktionen bieten:
 *  - Einheitliche Fehlerbehandlung
 *  - Typsichere Rückgabewerte
 *  - Automatische Fallbacks bei Fehlern
 */

import { logger } from '@/utils/logger';

import { ServiceRegistry } from './serviceRegistry';
import { IService, ServiceType, IModeService } from './serviceTypes';

// Forward-Declarations der Service-Typen zur Vermeidung zirkulärer Abhängigkeiten
// Verwende das Basis-Interface, um leere Interfaces zu vermeiden
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type BaseServiceType = IService;
type ApiServiceType = IService;
type AuthServiceType = IService;
type StorageServiceType = IService;
type BuildServiceType = IService & { getCurrentBuildType(): string };
type ModeServiceType = IModeService;
type SearchServiceType = IService;
type MySolvboxServiceType = IService;
type SolvboxAIServiceType = IService;
type FeatureSolvboxAIServiceType = IService;
type MediaServiceType = IService & { uploadImage(asset: { uri: string; type: string }): Promise<string> };
type NuggetServiceType = IService & { addNugget(nuggetData: Record<string, unknown>): Promise<Record<string, unknown>> };
type PermissionServiceType = IService;
type TileServiceType = IService;
type UserServiceType = IService;

/**
 * Generische Hilfsfunktion für den Zugriff auf Services
 * @template T - Der Typ des Services, muss IService implementieren
 * @param {ServiceType} type - Typ des anzufordernden Services
 * @param {() => T} fallbackCreator - Funktion zum Erstellen einer Fallback-Instanz bei Fehlern
 * @param {string} serviceName - Name des Services für Logging-Zwecke
 * @returns {T} - Die Service-Instanz
 */
export function getService<T extends IService>(
  type: ServiceType,
  fallbackCreator: () => T,
  serviceName: string
): T {
  try {
    const registry = ServiceRegistry.getInstance();
    return registry.getService<T>(type);
  } catch (error) {
    logger.error(`[ServiceHelper] Fehler beim Abrufen des ${serviceName}:`, 
      error instanceof Error ? error.message : String(error));
    
    // Fallback: Erstelle eine neue Instanz, wenn der Service nicht gefunden wurde
    const fallbackService = fallbackCreator();
    
    // Optional: Versuche den Fallback-Service zu registrieren
    try {
      const registry = ServiceRegistry.getInstance();
      registry.register(type, fallbackService);
      logger.info(`[ServiceHelper] Fallback-${serviceName} erfolgreich in Registry registriert`);
    } catch (registerError) {
      // Bei Fehlern während der Registrierung nur loggen, nicht fehlschlagen
      logger.warn(`[ServiceHelper] Konnte Fallback-${serviceName} nicht registrieren:`, 
        registerError instanceof Error ? registerError.message : String(registerError));
    }
    
    return fallbackService;
  }
}

// Entferne ungenutzte Import-Funktionen

// Temporäre Service-Klassen für Fallbacks
class FallbackApiService implements ApiServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackAuthService implements AuthServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackStorageService implements StorageServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackBuildService implements BuildServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
  
  // Implementiere die minimale erforderliche Methode, um den Fehler zu beheben
  getCurrentBuildType(): string {
    return 'dev'; // Standardwert zurückgeben
  }
}

class FallbackModeService implements ModeServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
  isDemoMode(): boolean { return false; }
  getCurrentAppMode(): string { return 'live'; }
}

class FallbackSearchService implements SearchServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackMySolvboxService implements MySolvboxServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackSolvboxAIService implements SolvboxAIServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackFeatureSolvboxAIService implements FeatureSolvboxAIServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackMediaService implements MediaServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
  
  // Implementiere die minimale erforderliche Methode, um den Fehler zu beheben
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadImage(asset: { uri: string; type: string }): Promise<string> {
    logger.warn('Fallback MediaService.uploadImage aufgerufen');
    return Promise.resolve('fallback-image-url');
  }
}

class FallbackNuggetService implements NuggetServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
  
  // Implementiere die minimale erforderliche Methode, um den Fehler zu beheben
  addNugget(nuggetData: Record<string, unknown>): Promise<Record<string, unknown>> {
    logger.warn('Fallback NuggetService.addNugget aufgerufen');
    return Promise.resolve({ id: 'fallback-nugget-id', ...nuggetData });
  }
}

class FallbackPermissionService implements PermissionServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackTileService implements TileServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

class FallbackUserService implements UserServiceType, IService {
  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

// ========== Spezifische Service-Hilfsfunktionen ==========

/**
 * Holt den ApiService aus der ServiceRegistry
 * @returns {ApiServiceType} Die ApiService-Instanz
 */
export function getApiService(): ApiServiceType {
  return getService(
    ServiceType.API,
    () => {
      // Fallback synchron erstellen, wenn nötig
      return new FallbackApiService();
    },
    'ApiService'
  );
}

/**
 * Holt den AuthService aus der ServiceRegistry
 * @returns {AuthServiceType} Die AuthService-Instanz
 */
export function getAuthService(): AuthServiceType {
  return getService(
    ServiceType.AUTH,
    () => {
      return new FallbackAuthService();
    },
    'AuthService'
  );
}

/**
 * Holt den StorageService aus der ServiceRegistry
 * @returns {StorageServiceType} Die StorageService-Instanz
 */
export function getStorageService(): StorageServiceType {
  return getService(
    ServiceType.STORAGE,
    () => {
      return new FallbackStorageService();
    },
    'StorageService'
  );
}

/**
 * Holt den BuildService aus der ServiceRegistry
 * @returns {BuildServiceType} Die BuildService-Instanz
 */
export function getBuildService(): BuildServiceType {
  return getService(
    ServiceType.BUILD,
    () => {
      return new FallbackBuildService();
    },
    'BuildService'
  );
}

/**
 * Holt den ModeService aus der ServiceRegistry
 * @returns {ModeServiceType} Die ModeService-Instanz
 */
export function getModeService(): ModeServiceType {
  return getService(
    ServiceType.MODE,
    () => {
      return new FallbackModeService();
    },
    'ModeService'
  );
}

/**
 * Holt den SearchService aus der ServiceRegistry
 * @returns {SearchServiceType} Die SearchService-Instanz
 */
export function getSearchService(): SearchServiceType {
  return getService(
    ServiceType.SEARCH,
    () => {
      return new FallbackSearchService();
    },
    'SearchService'
  );
}

/**
 * Holt den MySolvboxService aus der ServiceRegistry
 * @returns {MySolvboxServiceType} Die MySolvboxService-Instanz
 */
export function getMySolvboxService(): MySolvboxServiceType {
  return getService(
    ServiceType.MYSOLVBOX,
    () => {
      return new FallbackMySolvboxService();
    },
    'MySolvboxService'
  );
}

/**
 * Holt den CoreSolvboxAIService aus der ServiceRegistry
 * @returns {SolvboxAIServiceType} Die SolvboxAIService-Instanz (Core)
 */
export function getSolvboxAIService(): SolvboxAIServiceType {
  return getService(
    ServiceType.SOLVBOX_AI,
    () => {
      return new FallbackSolvboxAIService();
    },
    'SolvboxAIService'
  );
}

/**
 * Holt den Feature-SolvboxAIService aus der ServiceRegistry
 * @returns {FeatureSolvboxAIServiceType} Die Feature-SolvboxAIService-Instanz
 */
export function getFeatureSolvboxAIService(): FeatureSolvboxAIServiceType {
  return getService(
    ServiceType.FEATURE_SOLVBOX_AI,
    () => {
      return new FallbackFeatureSolvboxAIService();
    },
    'FeatureSolvboxAIService'
  );
}

/**
 * Holt den MediaService aus der ServiceRegistry
 * @returns {MediaServiceType} Die MediaService-Instanz
 */
export function getMediaService(): MediaServiceType {
  return getService(
    ServiceType.MEDIA,
    () => {
      return new FallbackMediaService();
    },
    'MediaService'
  );
}

/**
 * Holt den NuggetService aus der ServiceRegistry
 * @returns {NuggetServiceType} Die NuggetService-Instanz
 */
export function getNuggetService(): NuggetServiceType {
  return getService(
    ServiceType.NUGGET,
    () => {
      return new FallbackNuggetService();
    },
    'NuggetService'
  );
}

/**
 * Holt den PermissionService aus der ServiceRegistry
 * @returns {PermissionServiceType} Die PermissionService-Instanz
 */
export function getPermissionService(): PermissionServiceType {
  return getService(
    ServiceType.PERMISSIONS,
    () => {
      return new FallbackPermissionService();
    },
    'PermissionService'
  );
}

/**
 * Holt den TileService aus der ServiceRegistry
 * @returns {TileServiceType} Die TileService-Instanz
 */
export function getTileService(): TileServiceType {
  return getService(
    ServiceType.TILE,
    () => {
      return new FallbackTileService();
    },
    'TileService'
  );
}

/**
 * Holt den UserService aus der ServiceRegistry
 * @returns {UserServiceType} Die UserService-Instanz
 */
export function getUserService(): UserServiceType {
  return getService(
    ServiceType.USER,
    () => {
      return new FallbackUserService();
    },
    'UserService'
  );
} 