/**
 * Service-Initialisierung
 * 
 * Zentraler Punkt zur Initialisierung aller Services über die ServiceRegistry.
 * Diese Datei wird in der App-Startup-Sequenz verwendet, um alle benötigten
 * Services zu registrieren und zu initialisieren.
 */


import { BuildService } from '@/features/build/services/BuildService';
import { SearchService } from '@/features/home/services/SearchService';
import { ModeService } from '@/features/mode/services/ModeService';
import { MySolvboxService } from '@/features/mysolvbox/services/MySolvboxService';
import { SolvboxAIService as FeatureSolvboxAIService } from '@/features/solvboxai/services/SolvboxAIService';
import { 
  ApiService, 
  AuthService, 
  MediaService, 
  NuggetService, 
  PermissionService, 
  SolvboxAIService, 
  StorageService, 
  TileService, 
  UserService 
} from '@/services';
import { logger } from '@/utils/logger';

import { ServiceRegistry, ServiceType } from './serviceRegistry';

/**
 * Registriert alle Services bei der ServiceRegistry
 */
export async function registerAllServices(): Promise<void> {
  try {
    const registry = ServiceRegistry.getInstance();
    
    // Zuerst den ModeService registrieren, da andere Services davon abhängen können
    registry.register(ServiceType.MODE, new ModeService());
    logger.info('[ServiceRegistry] ModeService erfolgreich registriert');
    
    // Dann die Core-Services
    registry.register(ServiceType.API, new ApiService());
    registry.register(ServiceType.STORAGE, new StorageService());
    registry.register(ServiceType.AUTH, new AuthService());
    
    // Dann die abhängigen Services mit ihren Abhängigkeiten
    registry.register(
      ServiceType.MEDIA, 
      new MediaService(), 
      [ServiceType.API]
    );
    
    registry.register(
      ServiceType.USER, 
      new UserService(), 
      [ServiceType.API, ServiceType.AUTH]
    );
    
    registry.register(
      ServiceType.NUGGET, 
      new NuggetService(), 
      [ServiceType.API]
    );
    
    registry.register(
      ServiceType.SOLVBOX_AI, 
      new SolvboxAIService(), 
      [ServiceType.API]
    );
    
    registry.register(
      ServiceType.TILE, 
      new TileService()
    );
    
    registry.register(
      ServiceType.PERMISSIONS, 
      new PermissionService()
    );

    // Registriere die zusätzlichen Services
    registry.register(
      ServiceType.BUILD,
      new BuildService()
    );

    registry.register(
      ServiceType.MYSOLVBOX,
      new MySolvboxService(),
      [ServiceType.API, ServiceType.TILE]
    );

    registry.register(
      ServiceType.SEARCH,
      new SearchService()
    );

    registry.register(
      ServiceType.FEATURE_SOLVBOX_AI,
      new FeatureSolvboxAIService(),
      [ServiceType.API]
    );
    
    logger.info('[ServiceRegistry] Alle Services wurden erfolgreich registriert');
  } catch (error) {
    logger.error('[ServiceRegistry] Fehler bei der Registrierung der Services:', 
      error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Initialisiert alle Services über die ServiceRegistry
 */
export async function initAllServices(): Promise<void> {
  try {
    const registry = ServiceRegistry.getInstance();
    
    // Initialisiere alle Services in der richtigen Reihenfolge
    await registry.initAllServices();
    
    logger.info('[ServiceRegistry] Alle Services wurden erfolgreich initialisiert');
  } catch (error) {
    logger.error('[ServiceRegistry] Fehler bei der Initialisierung der Services:', 
      error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Zentrale Funktion zum Registrieren und Initialisieren aller Services
 */
export async function bootstrapServices(): Promise<void> {
  logger.info('[ServiceRegistry] Starte Service-Bootstrap-Prozess');
  
  await registerAllServices();
  await initAllServices();
  
  logger.info('[ServiceRegistry] Service-Bootstrap abgeschlossen');
}

/**
 * Befreit alle Service-Ressourcen beim App-Shutdown
 */
export async function disposeAllServices(): Promise<void> {
  try {
    const registry = ServiceRegistry.getInstance();
    await registry.disposeAllServices();
    logger.info('[ServiceRegistry] Alle Services wurden erfolgreich beendet');
  } catch (error) {
    logger.error('[ServiceRegistry] Fehler beim Beenden der Services:', 
      error instanceof Error ? error.message : String(error));
  }
}

export default bootstrapServices; 