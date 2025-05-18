/**
 * MySolvboxService
 * 
 * Service für die Verwaltung und Validierung von MySolvbox-Tabs.
 * Enthält zentrale Logik für die Tab-Validierung und -Verwaltung, um die Konsistenz
 * im gesamten MySolvbox-Bereich zu gewährleisten.
 * 
 * Dieser Service kapselt auch alle Operationen rund um MySolvbox und
 * stellt eine einheitliche Schnittstelle für den mysolvboxStore bereit,
 * sowohl für Echtdaten als auch für Mock-Daten.
 * 
 * Implementiert das IService-Interface für die ServiceRegistry.
 */

import { shouldUseMockData } from '@/config/app/env';
import ApiService from '@/services/ApiService';
import { MySolvboxTile } from '@/types/tiles';
import { logger } from '@/utils/logger';
import { getTileService } from '@/utils/service/serviceHelper';
import { IService, ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';

import { DEFAULT_TAB_ID, isValidTabId } from '../config/tabs';
import { MySolvboxTabId, MySolvboxTabConfig } from '../types';

/**
 * MySolvboxService stellt Methoden zur Verfügung, um mit MySolvbox-Daten zu arbeiten
 * Implementiert das IService-Interface für die ServiceRegistry
 */
export class MySolvboxService implements IService {
  private defaultTabId: MySolvboxTabId = DEFAULT_TAB_ID;

  /**
   * Initialisiert den Service
   */
  async init(): Promise<void> {
    logger.debug('[MySolvboxService] Initialisiert');
  }

  /**
   * Gibt Ressourcen frei
   */
  async dispose(): Promise<void> {
    logger.debug('[MySolvboxService] Ressourcen freigegeben');
  }

  /**
   * Überprüft, ob die angegebene Tab-ID gültig ist
   * @param tabId - Die zu prüfende Tab-ID
   * @param tabs - Die verfügbaren Tabs
   * @returns Boolean, der angibt, ob die Tab-ID gültig ist
   */
  public isValidTabId(tabId: string, tabs: MySolvboxTabConfig[]): tabId is MySolvboxTabId {
    return tabs.some(tab => tab.id === tabId);
  }

  /**
   * Gibt eine validierte Tab-ID zurück - entweder die übergebene ID, wenn sie gültig ist,
   * oder die Standard-Tab-ID als Fallback
   * @param tabId - Die zu validierende Tab-ID
   * @param tabs - Die verfügbaren Tabs
   * @returns Eine garantiert gültige Tab-ID
   */
  public validateTabId(tabId: string, tabs: MySolvboxTabConfig[]): MySolvboxTabId {
    return this.isValidTabId(tabId, tabs) ? tabId : this.defaultTabId;
  }

  /**
   * Setzt die Standard-Tab-ID (Fallback)
   * @param tabId - Die neue Standard-Tab-ID
   */
  public setDefaultTabId(tabId: MySolvboxTabId): void {
    this.defaultTabId = tabId;
  }

  /**
   * Gibt die aktuelle Standard-Tab-ID zurück
   * @returns Die aktuelle Standard-Tab-ID
   */
  public getDefaultTabId(): MySolvboxTabId {
    return this.defaultTabId;
  }

  /**
   * Ruft die Kacheln für einen bestimmten Tab ab
   * @param tabId ID des Tabs
   * @param forceRefresh Erzwingt das Neuladen der Daten
   * @returns Promise mit einem Array von Kacheln für den angegebenen Tab
   */
  public async getTilesForTab(tabId: string, forceRefresh = false): Promise<MySolvboxTile[]> {
    try {
      if (!this.isTabIdValid(tabId)) {
        throw new Error(`Ungültige Tab-ID: ${tabId}`);
      }

      // Hole alle Kacheln über den tileService aus der ServiceRegistry
      const allTiles = await getTileService().getMySolvboxTiles(forceRefresh);
      
      // Filtere nach dem angegebenen Tab
      return allTiles.filter(tile => tile.tabId === tabId);
    } catch (error) {
      logger.error('Fehler beim Abrufen der MySolvbox-Kacheln:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Hilfsmethode zur Überprüfung der Tab-ID Gültigkeit ohne Tab-Liste
   * @param tabId ID des zu prüfenden Tabs
   * @returns true, wenn der Tab gültig ist, sonst false
   */
  public isTabIdValid(tabId: string): boolean {
    return isValidTabId(tabId);
  }

  /**
   * Speichert eine Kachel (als Favorit markieren)
   * @param tileId ID der zu speichernden Kachel
   * @returns Promise mit true bei Erfolg, sonst false
   */
  public async saveTile(tileId: number): Promise<boolean> {
    try {
      // Im Demo/Entwicklungsmodus wird nichts gespeichert
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 600));
        logger.info('MySolvbox-Kachel als Favorit gespeichert (Mock):', tileId);
        return true;
      }

      // In der Produktionsumgebung der API-Aufruf
      const apiService = this.getApiService();
      await apiService.post('/mysolvbox/favorites', { tileId });
      return true;
    } catch (error) {
      logger.error('Fehler beim Speichern der MySolvbox-Kachel:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Entfernt eine Kachel aus den Favoriten
   * @param tileId ID der zu entfernenden Kachel
   * @returns Promise mit true bei Erfolg, sonst false
   */
  public async unsaveTile(tileId: number): Promise<boolean> {
    try {
      // Im Demo/Entwicklungsmodus wird nichts gelöscht
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 600));
        logger.info('MySolvbox-Kachel aus Favoriten entfernt (Mock):', tileId);
        return true;
      }

      // In der Produktionsumgebung der API-Aufruf
      const apiService = this.getApiService();
      await apiService.delete(`/mysolvbox/favorites/${tileId}`);
      return true;
    } catch (error) {
      logger.error('Fehler beim Entfernen der MySolvbox-Kachel aus Favoriten:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Ruft die Favoriten des Benutzers ab
   * @returns Promise mit einem Array von Kachel-IDs, die als Favoriten gespeichert sind
   */
  public async getFavorites(): Promise<number[]> {
    try {
      // Im Demo/Entwicklungsmodus simulierte Favoriten
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 700));
        // Einige Beispiel-IDs
        return [1, 3, 5, 8];
      }

      // In der Produktionsumgebung der API-Aufruf
      const apiService = this.getApiService();
      const favorites = await apiService.get<{tileIds: number[]}>('/mysolvbox/favorites');
      return favorites?.tileIds || [];
    } catch (error) {
      logger.error('Fehler beim Abrufen der MySolvbox-Favoriten:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Hilfsmethode zum Abrufen des ApiService aus der ServiceRegistry
   */
  private getApiService(): ApiService {
    try {
      return ServiceRegistry.getInstance().getService<ApiService>(ServiceType.API);
    } catch (error) {
      logger.error('[MySolvboxService] Fehler beim Abrufen des ApiService:', error instanceof Error ? error.message : String(error));
      return new ApiService();
    }
  }
} 