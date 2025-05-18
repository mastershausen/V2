/**
 * SolvboxAIService - Verwaltung der SolvboxAI-Funktionalität
 * 
 * Dieser Service kapselt alle Operationen rund um SolvboxAI und
 * stellt eine einheitliche Schnittstelle für den solvboxaiStore bereit,
 * sowohl für Echtdaten als auch für Mock-Daten.
 */

import { shouldUseMockData } from '@/config/app/env';
import { TAB_IDS, TAB_LABELS } from '@/features/solvboxai/config/tabs';
import { getTileService } from '@/utils/service/serviceHelper';
import { IService } from '@/utils/service/serviceRegistry';

import ApiService from './ApiService';
import { SolvboxAITile, TabConfig } from '../types/tiles';
import { logger } from '../utils/logger';

// Verfügbare Tabs für SolvboxAI, basierend auf der zentralen Tab-Konfiguration
const SOLVBOX_TABS: TabConfig[] = [
  { id: TAB_IDS.GIGS, label: TAB_LABELS.GIGS },
  { id: TAB_IDS.CASESTUDIES, label: TAB_LABELS.CASESTUDIES }
];

/**
 * SolvboxAIService stellt Methoden zur Verfügung, um mit SolvboxAI-Daten zu arbeiten
 * Implementiert das IService-Interface für die ServiceRegistry.
 */
class SolvboxAIService implements IService {
  private apiService: ApiService;
  
  /**
   *
   * @param apiService
   */
  constructor(apiService?: ApiService) {
    this.apiService = apiService || new ApiService();
  }
  
  /**
   * Initialisierung des SolvboxAI-Service
   */
  async init(): Promise<void> {
    logger.debug('[SolvboxAIService] Initialisiert');
  }

  /**
   * Ressourcen freigeben
   */
  async dispose(): Promise<void> {
    logger.debug('[SolvboxAIService] Ressourcen freigegeben');
  }

  /**
   * Ruft die verfügbaren Tabs für SolvboxAI ab
   * @returns Array mit Tab-Konfigurationen
   */
  getTabs(): TabConfig[] {
    return [...SOLVBOX_TABS];
  }

  /**
   * Prüft, ob eine Tab-ID gültig ist
   * @param tabId ID des zu prüfenden Tabs
   * @returns true, wenn der Tab gültig ist, sonst false
   */
  isValidTab(tabId: string): boolean {
    return SOLVBOX_TABS.some(tab => tab.id === tabId);
  }

  /**
   * Ruft die Kacheln für einen bestimmten Tab ab
   * @param tabId ID des Tabs
   * @param forceRefresh Erzwingt das Neuladen der Daten
   * @returns Promise mit einem Array von Kacheln für den angegebenen Tab
   */
  async getTilesForTab(tabId: string, forceRefresh = false): Promise<SolvboxAITile[]> {
    try {
      if (!this.isValidTab(tabId)) {
        throw new Error(`Ungültige Tab-ID: ${tabId}`);
      }

      // Hole alle Kacheln über den tileService aus der ServiceRegistry
      const allTiles = await getTileService().getSolvboxAITiles(forceRefresh);
      
      // Filtere nach dem angegebenen Tab
      return allTiles.filter(tile => tile.tabId === tabId);
    } catch (error) {
      logger.error('Fehler beim Abrufen der SolvboxAI-Kacheln:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Markiert eine Kachel als verwendet
   * @param tileId ID der verwendeten Kachel
   * @returns Promise mit true bei Erfolg, sonst false
   */
  async markTileAsUsed(tileId: number): Promise<boolean> {
    try {
      // Im Demo/Entwicklungsmodus wird nichts gespeichert
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 600));
        logger.info('SolvboxAI-Kachel als verwendet markiert (Mock):', tileId);
        return true;
      }

      // In der Produktionsumgebung der API-Aufruf
      await this.apiService.post('/solvboxai/usage', { tileId });
      return true;
    } catch (error) {
      logger.error('Fehler beim Markieren der SolvboxAI-Kachel als verwendet:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Ruft die für den Benutzer empfohlenen Kacheln ab
   * @returns Promise mit einem Array von empfohlenen Kacheln
   */
  async getRecommendedTiles(): Promise<SolvboxAITile[]> {
    try {
      // Im Demo/Entwicklungsmodus simulierte Empfehlungen
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Hole alle Kacheln und wähle zufällig einige aus
        const allTiles = await getTileService().getSolvboxAITiles();
        const shuffled = [...allTiles].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
      }

      // In der Produktionsumgebung der API-Aufruf
      const recommendations = await this.apiService.get<SolvboxAITile[]>('/solvboxai/recommendations');
      return recommendations || [];
    } catch (error) {
      logger.error('Fehler beim Abrufen der SolvboxAI-Empfehlungen:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Sendet Feedback zu einer Kachel
   * @param tileId ID der Kachel
   * @param rating Bewertung (1-5)
   * @param comment Optionaler Kommentar
   * @returns Promise mit true bei Erfolg, sonst false
   */
  async sendFeedback(tileId: number, rating: number, comment?: string): Promise<boolean> {
    try {
      // Validiere die Bewertung
      if (rating < 1 || rating > 5) {
        throw new Error('Bewertung muss zwischen 1 und 5 liegen');
      }

      // Im Demo/Entwicklungsmodus wird nichts gespeichert
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 700));
        logger.info('SolvboxAI-Feedback gesendet (Mock):', { tileId, rating, comment });
        return true;
      }

      // In der Produktionsumgebung der API-Aufruf
      await this.apiService.post('/solvboxai/feedback', { tileId, rating, comment });
      return true;
    } catch (error) {
      logger.error('Fehler beim Senden des SolvboxAI-Feedbacks:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
}

export default SolvboxAIService; 