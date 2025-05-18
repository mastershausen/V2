/**
 * @file features/mode/services/ModeService.ts
 * @description Mode-Service für die zentrale App-Modus-Verwaltung
 * 
 * Implementiert das IModeService-Interface für die ServiceRegistry und
 * stellt Methoden für den Zugriff auf den App-Modus bereit.
 */

import { AppMode } from '@/types/common/appMode';
import { logger } from '@/utils/logger';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';
import { IModeService } from '@/utils/service/serviceTypes';

import { useModeStore } from '../stores';

/**
 * ModeService - Service für die App-Modus-Verwaltung
 * 
 * Bietet Schnittstellen für den Zugriff auf den aktuellen App-Modus.
 */
export class ModeService implements IModeService {
  /**
   * Initialisiert den ModeService (IService-Implementierung)
   */
  async init(): Promise<void> {
    // Keine spezielle Initialisierung erforderlich
  }

  /**
   * Gibt Ressourcen frei (IService-Implementierung)
   */
  async dispose(): Promise<void> {
    // Keine speziellen Ressourcen freizugeben
  }
  
  /**
   * Gibt den aktuellen App-Modus zurück
   * @returns {AppMode} Der aktuelle App-Modus
   */
  getCurrentAppMode(): AppMode {
    try {
      const modeStore = useModeStore.getState();
      return modeStore.appMode;
    } catch (error) {
      logger.error('[ModeService] Fehler beim Abrufen des App-Modus:', 
        error instanceof Error ? error.message : String(error));
      return 'live'; // Default-Fallback
    }
  }
  
  /**
   * Prüft, ob der Demo-Modus aktiv ist
   * @returns {boolean} true wenn der Demo-Modus aktiv ist
   */
  isDemoMode(): boolean {
    return this.getCurrentAppMode() === 'demo';
  }
  
  /**
   * Hilfsfunktion zum Abrufen eines ModeService-Objekts aus der ServiceRegistry
   * @returns {ModeService} Die ModeService-Instanz
   */
  static getService(): ModeService {
    try {
      const registry = ServiceRegistry.getInstance();
      return registry.getService<ModeService>(ServiceType.MODE);
    } catch (error) {
      logger.error('[ModeService] Fehler beim Abrufen des ModeService:', 
        error instanceof Error ? error.message : String(error));
      // Fallback: Erstelle eine neue Instanz, wenn keine in der Registry vorhanden ist
      return new ModeService();
    }
  }
}

/**
 * Hilfsfunktion zum Abrufen des ModeService aus der ServiceRegistry
 * @returns {ModeService} Die ModeService-Instanz
 */
export function getModeService(): ModeService {
  return ModeService.getService();
}