/**
 * ServiceRegistry
 * 
 * Eine zentrale Registry für alle Services der App.
 * Ermöglicht einheitlichen Zugriff auf Services, Dependency Injection
 * und vereinfacht das Testen durch einfaches Mocking.
 */

import { logger } from '@/utils/logger';

// Importiere Typen und Interfaces aus der serviceTypes-Datei
import { IService, ServiceType } from './serviceTypes';

// Re-exportiere die Typen für einfacheren Zugriff
export { IService, ServiceType };

/**
 * ServiceRegistry - Singleton für den zentralen Zugriff auf Services
 */
export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services = new Map<ServiceType, IService>();
  private dependencies = new Map<ServiceType, ServiceType[]>();
  private initialized = new Set<ServiceType>();

  private constructor() {}

  /**
   * Gibt die Singleton-Instanz der ServiceRegistry zurück
   * @returns {ServiceRegistry} Die Singleton-Instanz
   */
  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * Registriert einen Service mit optionalen Abhängigkeiten
   * @template T - Service-Typ, der IService implementiert
   * @param {ServiceType} type - Der Typ des Services
   * @param {T} service - Die Service-Instanz
   * @param {ServiceType[]} dependencies - Optionale Abhängigkeiten (andere Services)
   */
  public register<T extends IService>(
    type: ServiceType, 
    service: T, 
    dependencies: ServiceType[] = []
  ): void {
    logger.debug(`[ServiceRegistry] Registriere Service: ${type}`);
    
    this.services.set(type, service);
    this.dependencies.set(type, dependencies);
  }

  /**
   * Holt einen registrierten Service aus der Registry
   * @template T - Service-Typ, der IService implementiert
   * @param {ServiceType} type - Der Typ des Services, der geholt werden soll
   * @returns {T} Die Service-Instanz
   * @throws Error wenn Service nicht gefunden wird
   */
  public getService<T extends IService>(type: ServiceType): T {
    const service = this.services.get(type) as T;
    
    if (!service) {
      throw new Error(`[ServiceRegistry] Service nicht gefunden: ${type}`);
    }
    
    return service;
  }

  /**
   * Initialisiert einen Service und seine Abhängigkeiten
   * @param {ServiceType} type - Der zu initialisierende Service-Typ
   */
  public async initService(type: ServiceType): Promise<void> {
    if (this.initialized.has(type)) {
      return;
    }

    const service = this.services.get(type);
    if (!service) {
      throw new Error(`[ServiceRegistry] Service nicht gefunden: ${type}`);
    }

    const dependencies = this.dependencies.get(type) || [];
    
    // Zuerst alle Abhängigkeiten initialisieren
    for (const dependency of dependencies) {
      await this.initService(dependency);
    }
    
    // Dann den Service selbst initialisieren, wenn eine init-Methode existiert
    if (service.init) {
      logger.debug(`[ServiceRegistry] Initialisiere Service: ${type}`);
      await service.init();
    }
    
    this.initialized.add(type);
  }

  /**
   * Initialisiert alle registrierten Services
   */
  public async initAllServices(): Promise<void> {
    logger.debug('[ServiceRegistry] Initialisiere alle Services');
    
    for (const type of this.services.keys()) {
      await this.initService(type);
    }
  }

  /**
   * Gibt alle Ressourcen frei
   */
  public async disposeAllServices(): Promise<void> {
    logger.debug('[ServiceRegistry] Gebe alle Services frei');
    
    for (const [type, service] of this.services.entries()) {
      if (service.dispose) {
        await service.dispose();
      }
      this.initialized.delete(type);
    }
  }

  /**
   * Ersetzt einen Service mit einem Mock für Tests
   * @template T - Service-Typ, der IService implementiert
   * @param {ServiceType} type - Der Typ des zu ersetzenden Services
   * @param {T} mockService - Der Mock-Service
   */
  public mockService<T extends IService>(type: ServiceType, mockService: T): void {
    logger.debug(`[ServiceRegistry] Ersetze Service mit Mock: ${type}`);
    
    const dependencies = this.dependencies.get(type) || [];
    this.services.set(type, mockService);
    this.dependencies.set(type, dependencies);
    this.initialized.delete(type);
  }

  /**
   * Setzt die Registry zurück (hauptsächlich für Tests)
   */
  public reset(): void {
    this.services.clear();
    this.dependencies.clear();
    this.initialized.clear();
  }
} 