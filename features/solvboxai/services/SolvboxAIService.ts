/**
 * SolvboxAIService
 * 
 * Service für die Verwaltung und Validierung von SolvboxAI-Daten.
 * Dieser Service kapselt alle Operationen rund um SolvboxAI und
 * stellt eine einheitliche Schnittstelle für den solvboxaiStore bereit,
 * sowohl für Echtdaten als auch für Mock-Daten.
 * 
 * Enthält zentrale Logik für:
 * - Datenabruf und -transformation
 * - Kategorie-Management
 * - Tab-Validierung
 * - Benutzerinteraktionen (Feedback, Nutzung, etc.)
 * - Fehlerbehandlung
 * 
 * Implementiert das IService-Interface für die ServiceRegistry.
 */

import { shouldUseMockData } from '@/config/app/env';
import ApiService from '@/services/ApiService';
import { SolvboxAITile } from '@/types/tiles';
import { logger } from '@/utils/logger';
import { getTileService } from '@/utils/service/serviceHelper';
import { IService, ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';

import {getDataForTabId, getCategoriesForTabId, getRecommendations, GIGS, CASE_STUDIES} from '../config/data';
import { DEFAULT_TAB_ID, isValidTabId } from '../config/tabs';
import { SolvboxAITabId, SolvboxAITabConfig, SolvboxAITileData } from '../types';

/**
 * Fehlertypen, die in SolvboxAI auftreten können
 */
export enum SolvboxAIErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

/**
 * SolvboxAI-spezifischer Fehler mit zusätzlichen Eigenschaften
 */
export class SolvboxAIError extends Error {
  /**
   * Typ des Fehlers
   */
  public type: SolvboxAIErrorType;
  
  /**
   * Gibt an, ob der Fehler dem Benutzer angezeigt werden sollte
   */
  public shouldDisplay: boolean;
  
  /**
   * Gibt an, ob der Fehler automatisch erneut versucht werden kann
   */
  public isRetryable: boolean;
  
  /**
   * Originaler Fehler, falls vorhanden
   */
  public originalError?: Error;

  /**
   * Erstellt einen neuen SolvboxAIError
   * @param {string} message - Fehlermeldung
   * @param {SolvboxAIErrorType} type - Fehlertyp
   * @param {boolean} shouldDisplay - Ob der Fehler angezeigt werden soll
   * @param {boolean} isRetryable - Ob der Fehler wiederholt werden kann
   * @param {Error} [originalError] - Der ursprüngliche Fehler
   */
  constructor(
    message: string,
    type: SolvboxAIErrorType = SolvboxAIErrorType.UNKNOWN,
    shouldDisplay: boolean = true,
    isRetryable: boolean = false,
    originalError?: Error
  ) {
    super(message);
    this.name = 'SolvboxAIError';
    this.type = type;
    this.shouldDisplay = shouldDisplay;
    this.isRetryable = isRetryable;
    this.originalError = originalError;
  }
}

/**
 * SolvboxAIService stellt Methoden zur Verfügung, um mit SolvboxAI-Daten zu arbeiten
 * 
 * Die Klasse implementiert das IService-Interface für die ServiceRegistry
 * und stellt eine zentrale Schnittstelle für den Zugriff auf alle SolvboxAI-bezogenen
 * Funktionen bereit.
 */
export class SolvboxAIService implements IService {
  private defaultTabId: SolvboxAITabId = DEFAULT_TAB_ID;
  
  // Cache für häufig benötigte Daten
  private categoriesCache: Map<SolvboxAITabId, string[]> = new Map();
  private lastCacheUpdate: Date | null = null;
  private cacheDuration = 60 * 60 * 1000; // 1 Stunde in Millisekunden

  /**
   * Initialisiert den Service
   */
  async init(): Promise<void> {
    logger.debug('[SolvboxAIService] Initialisiert');
  }

  /**
   * Gibt Ressourcen frei
   */
  async dispose(): Promise<void> {
    this.clearCache();
    logger.debug('[SolvboxAIService] Ressourcen freigegeben');
  }

  /**
   * Hilfsmethode zur standardisierten Fehlerbehandlung
   * Protokolliert den Fehler und erstellt einen SolvboxAIError
   * @param {Error | unknown} error - Der aufgetretene Fehler
   * @param {string} context - Kontext, in dem der Fehler aufgetreten ist
   * @param {string} [fallbackMessage] - Nachricht, die verwendet wird, wenn keine vorhanden ist
   * @param {SolvboxAIErrorType} [type] - Typ des Fehlers
   * @returns {SolvboxAIError} Ein standardisierter SolvboxAIError
   * @private
   */
  private handleError(
    error: Error | unknown,
    context: string,
    fallbackMessage: string = 'Ein unbekannter Fehler ist aufgetreten',
    type: SolvboxAIErrorType = SolvboxAIErrorType.UNKNOWN
  ): SolvboxAIError {
    let errorMessage = fallbackMessage;
    let errorType = type;
    let isRetryable = false;
    
    // Extrahiere Informationen aus dem Fehler
    if (error instanceof Error) {
      errorMessage = error.message || fallbackMessage;
      
      // Bestimme den Fehlertyp basierend auf dem Fehler
      if (error.name === 'NetworkError' || error.message.includes('network')) {
        errorType = SolvboxAIErrorType.NETWORK;
        isRetryable = true;
      } else if (error.message.includes('validation') || error.message.includes('invalid')) {
        errorType = SolvboxAIErrorType.VALIDATION;
      } else if (error.message.includes('not found') || error.message.includes('404')) {
        errorType = SolvboxAIErrorType.NOT_FOUND;
      } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
        errorType = SolvboxAIErrorType.UNAUTHORIZED;
      } else if (error.message.includes('server') || error.message.includes('500')) {
        errorType = SolvboxAIErrorType.SERVER;
        isRetryable = true;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // Protokolliere den Fehler
    logger.error(`SolvboxAI Fehler (${context}):`, errorMessage);
    
    // Erstelle einen standardisierten Fehler
    return new SolvboxAIError(
      errorMessage,
      errorType,
      true, // Alle Fehler sollten standardmäßig angezeigt werden
      isRetryable,
      error instanceof Error ? error : undefined
    );
  }

  /**
   * Überprüft, ob die angegebene Tab-ID gültig ist
   * @param {string} tabId - Die zu prüfende Tab-ID
   * @param {SolvboxAITabConfig[]} tabs - Die verfügbaren Tabs
   * @returns {boolean} true, wenn die Tab-ID gültig ist, sonst false
   */
  public isValidTabId(tabId: string, tabs: SolvboxAITabConfig[]): tabId is SolvboxAITabId {
    // Prüfe zuerst mit der zentralen Validierungsfunktion
    if (isValidTabId(tabId)) {
      return true;
    }
    
    // Fallback: Prüfe anhand der übergebenen Tabs
    return tabs.some(tab => tab.id === tabId);
  }

  /**
   * Gibt eine validierte Tab-ID zurück - entweder die übergebene ID, wenn sie gültig ist,
   * oder die Standard-Tab-ID als Fallback
   * @param {string} tabId - Die zu validierende Tab-ID
   * @param {SolvboxAITabConfig[]} tabs - Die verfügbaren Tabs
   * @returns {SolvboxAITabId} Eine garantiert gültige Tab-ID
   * @throws {SolvboxAIError} Wenn die übergebene Tab-ID ungültig ist
   */
  public validateTabId(tabId: string, tabs: SolvboxAITabConfig[]): SolvboxAITabId {
    try {
      if (this.isValidTabId(tabId, tabs)) {
        return tabId;
      }
      
      // Werfe SolvboxAIError für ungültige Tab-ID
      throw new Error(`Ungültige Tab-ID: ${tabId}`);
    } catch (error) {
      // Protokolliere den Fehler, aber gib einen Fallback zurück
      this.handleError(error, 'validateTabId', `Ungültige Tab-ID: ${tabId}`, SolvboxAIErrorType.VALIDATION);
      
      // Verwende den Standardtab als Fallback
      return this.defaultTabId;
    }
  }

  /**
   * Hilfsmethode zur Überprüfung der Tab-ID Gültigkeit ohne Tab-Liste
   * Nutzt die zentrale isValidTabId-Funktion aus config/tabs
   * @param {string} tabId - ID des zu prüfenden Tabs
   * @returns {boolean} true, wenn der Tab gültig ist, sonst false
   */
  public isTabIdValid(tabId: string): boolean {
    return isValidTabId(tabId);
  }

  /**
   * Setzt die Standard-Tab-ID (Fallback)
   * Diese ID wird verwendet, wenn keine gültige Tab-ID angegeben wird
   * @param {SolvboxAITabId} tabId - Die neue Standard-Tab-ID
   * @returns {void}
   */
  public setDefaultTabId(tabId: SolvboxAITabId): void {
    this.defaultTabId = tabId;
  }

  /**
   * Gibt die aktuelle Standard-Tab-ID zurück
   * @returns {SolvboxAITabId} Die aktuelle Standard-Tab-ID
   */
  public getDefaultTabId(): SolvboxAITabId {
    return this.defaultTabId;
  }

  /**
   * Ruft die Kacheln für einen bestimmten Tab ab
   * @param {string} tabId ID des Tabs
   * @param {boolean} forceRefresh Erzwingt das Neuladen der Daten
   * @returns {Promise<SolvboxAITile[]>} Promise mit einem Array von Kacheln für den angegebenen Tab
   * @throws {SolvboxAIError} Wenn ein Fehler auftritt
   * 
   * Verwendet den tileService aus der ServiceRegistry, um die Daten zu laden
   */
  public async getTilesForTab(tabId: string, forceRefresh = false): Promise<SolvboxAITile[]> {
    try {
      if (!this.isTabIdValid(tabId)) {
        throw new SolvboxAIError(
          `Ungültige Tab-ID: ${tabId}`,
          SolvboxAIErrorType.VALIDATION,
          true,
          false
        );
      }

      // Hole alle Kacheln über den tileService aus der ServiceRegistry
      const allTiles = await getTileService().getSolvboxAITiles(forceRefresh);
      
      // Filtere nach dem angegebenen Tab
      return allTiles.filter(tile => tile.tabId === tabId);
    } catch (error) {
      throw this.handleError(error, 'getTilesForTab', 'Fehler beim Abrufen der SolvboxAI-Kacheln');
    }
  }

  /**
   * Gibt die Demo-Kacheln für einen bestimmten Tab zurück
   * Verwendet die statischen Daten aus config/data
   * @param {SolvboxAITabId} tabId - ID des Tabs
   * @returns {SolvboxAITileData[]} Array von SolvboxAITileData für den angegebenen Tab
   * @throws {SolvboxAIError} Wenn ein Fehler beim Abrufen der Demo-Daten auftritt
   */
  public getDemoTilesForTab(tabId: SolvboxAITabId): SolvboxAITileData[] {
    try {
      const data = getDataForTabId(tabId);
      
      // Für Debugging
      console.log(`getDemoTilesForTab(${tabId}):`, {
        anzahlTiles: data.length,
        ersterTile: data.length > 0 ? data[0].id : null
      });
      
      return data;
    } catch (error) {
      // Werfe einen SolvboxAIError
      throw this.handleError(
        error, 
        'getDemoTilesForTab', 
        `Fehler beim Abrufen der Demo-Kacheln für Tab "${tabId}"`,
        SolvboxAIErrorType.NOT_FOUND
      );
    }
  }

  /**
   * Ruft alle Kategorien für einen bestimmten Tab ab
   * Verwendet einen internen Cache für bessere Performance
   * @param {SolvboxAITabId} tabId - ID des Tabs
   * @param {boolean} forceRefresh - Erzwingt das Neuladen der Daten, Standard: false
   * @returns {Promise<string[]>} Promise mit einem Array von Kategorienamen für den angegebenen Tab
   * @throws {SolvboxAIError} Wenn ein Fehler beim Abrufen der Kategorien auftritt
   */
  public async getCategoriesForTab(tabId: SolvboxAITabId, forceRefresh = false): Promise<string[]> {
    try {
      // Prüfe, ob valide Kategorien bereits im Cache sind und dieser noch aktuell ist
      if (!forceRefresh && this.categoriesCache.has(tabId) && this.isCacheValid()) {
        const cachedCategories = this.categoriesCache.get(tabId);
        if (cachedCategories && cachedCategories.length > 0) {
          return cachedCategories;
        }
      }

      // Hole alle Kacheln für den Tab
      const tiles = await this.getTilesForTab(tabId, forceRefresh);
      
      // Extrahiere eindeutige Kategorien
      const categories = new Set<string>();
      tiles.forEach(tile => {
        if (tile.aiCategory) {
          categories.add(tile.aiCategory);
        }
      });
      
      const result = Array.from(categories).sort();
      
      // Aktualisiere den Cache
      this.categoriesCache.set(tabId, result);
      this.lastCacheUpdate = new Date();
      
      return result;
    } catch (error) {
      // Log den Fehler, aber verwende Demo-Daten als Fallback
      logger.error('Fehler beim Abrufen der Kategorien:', error instanceof Error ? error.message : String(error));
      
      try {
        // Fallback auf Demo-Daten
        return getCategoriesForTabId(tabId);
      } catch (fallbackError) {
        // Wenn auch der Fallback fehlschlägt, werfe einen SolvboxAIError
        throw this.handleError(
          fallbackError, 
          'getCategoriesForTab', 
          `Fehler beim Abrufen der Kategorien für Tab "${tabId}"`,
          SolvboxAIErrorType.UNKNOWN
        );
      }
    }
  }

  /**
   * Filtert Kacheln nach einer bestimmten Kategorie
   * @param {SolvboxAITile[]} tiles - Array von Kacheln
   * @param {string} category - Zu filternde Kategorie
   * @returns {SolvboxAITile[]} Gefiltertes Array von Kacheln
   */
  public filterTilesByCategory(tiles: SolvboxAITile[], category: string): SolvboxAITile[] {
    if (!category) return tiles;
    
    return tiles.filter(tile => tile.aiCategory === category);
  }

  /**
   * Prüft, ob der Cache noch gültig ist
   * Basierend auf dem Zeitstempel der letzten Aktualisierung und der konfigurierten Cache-Dauer
   * @returns {boolean} true, wenn der Cache noch gültig ist, sonst false
   * @private
   */
  private isCacheValid(): boolean {
    if (!this.lastCacheUpdate) return false;
    
    const now = new Date();
    const elapsed = now.getTime() - this.lastCacheUpdate.getTime();
    
    return elapsed < this.cacheDuration;
  }

  /**
   * Leert den Cache
   * Entfernt alle gespeicherten Kategorien und setzt den Zeitstempel zurück
   * @returns {void}
   */
  public clearCache(): void {
    this.categoriesCache.clear();
    this.lastCacheUpdate = null;
  }

  /**
   * Hilfsmethode zum Abrufen des ApiService aus der ServiceRegistry
   */
  private getApiService(): ApiService {
    try {
      return ServiceRegistry.getInstance().getService<ApiService>(ServiceType.API);
    } catch (error) {
      logger.error('[SolvboxAIService] Fehler beim Abrufen des ApiService:', error instanceof Error ? error.message : String(error));
      return new ApiService();
    }
  }

  /**
   * Markiert eine Kachel als verwendet
   * Im Produktionsmodus wird eine API-Anfrage gesendet, im Demo-Modus wird ein Erfolg simuliert
   * @param {number} tileId - ID der verwendeten Kachel
   * @returns {Promise<boolean>} Promise mit true bei Erfolg, sonst false
   * @throws {SolvboxAIError} Wenn ein Fehler beim Markieren der Kachel auftritt
   */
  public async markTileAsUsed(tileId: number): Promise<boolean> {
    try {
      // Im Demo/Entwicklungsmodus wird nichts gespeichert
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 800));
        logger.info('SolvboxAI-Kachel als verwendet markiert (Mock):', tileId);
        return true;
      }

      // In der Produktionsumgebung der API-Aufruf
      const apiService = this.getApiService();
      await apiService.post('/solvboxai/usage', { tileId });
      return true;
    } catch (error) {
      const solvboxAIError = this.handleError(
        error, 
        'markTileAsUsed', 
        'Fehler beim Markieren der Kachel als verwendet', 
        SolvboxAIErrorType.NETWORK
      );
      return false;
    }
  }

  /**
   * Ruft die für den Benutzer empfohlenen Kacheln ab
   * @param {number} maxCount Maximale Anzahl der Empfehlungen
   * @returns {Promise<SolvboxAITile[]>} Promise mit einem Array von empfohlenen Kacheln
   * @throws {SolvboxAIError} Wenn ein Fehler auftritt
   */
  public async getRecommendedTiles(maxCount = 3): Promise<SolvboxAITile[]> {
    try {
      // Im Demo/Entwicklungsmodus simulierte Empfehlungen
      if (shouldUseMockData()) {
        // Verwende die Demo-Empfehlungen
        return this.getDemoRecommendations(maxCount).map(demo => {
          // Konvertiere zu SolvboxAITile
          return {
            id: demo.id,
            title: demo.title,
            description: demo.description,
            imageUrl: demo.imageUrl,
            tabId: demo.tabId || 'gigs',
            categories: demo.categories || [],
            categoryLabels: demo.categoryLabels || []
          } as SolvboxAITile;
        });
      }

      try {
        // Hole alle Kacheln und wähle zufällig einige aus
        const allTiles = await getTileService().getSolvboxAITiles();
        
        // Mische die Kacheln, sodass wir zufällige Empfehlungen erhalten
        const shuffled = [...allTiles].sort(() => 0.5 - Math.random());
        
        // Beschränke auf die angegebene maximale Anzahl
        return shuffled.slice(0, maxCount);
      } catch (error) {
        // Bei Fehler verwende die Demo-Daten als Fallback
        logger.warn('Verwende Demo-Empfehlungen als Fallback: ', 
          error instanceof Error ? error.message : String(error));
        
        // Verwende die Demo-Empfehlungen, aber konvertiere sie in das richtige Format
        return this.getDemoRecommendations(maxCount).map(demo => {
          // Konvertiere zu SolvboxAITile
          return {
            id: demo.id,
            title: demo.title,
            description: demo.description,
            imageUrl: demo.imageUrl,
            tabId: demo.tabId || 'gigs',
            categories: demo.categories || [],
            categoryLabels: demo.categoryLabels || []
          } as SolvboxAITile;
        });
      }
    } catch (error) {
      throw this.handleError(error, 'getRecommendedTiles', 'Fehler beim Abrufen der Empfehlungen');
    }
  }

  /**
   * Ruft Demo-Empfehlungen für Kacheln ab
   * @param maxCount Maximale Anzahl der Empfehlungen
   * @returns Array von Demo-Empfehlungen
   */
  public getDemoRecommendations(maxCount = 3): SolvboxAITileData[] {
    try {
      // Verwende die erste Kachel als Basis für Empfehlungen oder 8001 als Fallback
      const allTiles = [...GIGS, ...CASE_STUDIES];
      // Stellt sicher, dass baseTileId ein gültiger Zahlentyp ist
      const baseTileId = allTiles.length > 0 
        ? (typeof allTiles[0].id === 'number' ? allTiles[0].id : 8001) 
        : 8001;
      
      const recommendations = getRecommendations(baseTileId as number, maxCount);
      return recommendations;
    } catch (error) {
      logger.error('Fehler beim Abrufen der Demo-Empfehlungen:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Sendet Feedback zu einer Kachel
   * Im Produktionsmodus wird das Feedback an die API gesendet,
   * im Demo-Modus wird ein Erfolg simuliert
   * @param {number} tileId - ID der Kachel, zu der das Feedback gesendet wird
   * @param {number} rating - Bewertung (1-5)
   * @param {string} [comment] - Optionaler Kommentar
   * @returns {Promise<boolean>} Promise mit true bei erfolgreicher Übermittlung, sonst false
   * @throws {SolvboxAIError} Wenn die Bewertung außerhalb des gültigen Bereichs (1-5) liegt
   * oder ein anderer Fehler auftritt
   */
  public async sendFeedback(tileId: number, rating: number, comment?: string): Promise<boolean> {
    try {
      // Validiere Input
      if (rating < 1 || rating > 5) {
        throw new Error(`Ungültiges Rating: ${rating}. Muss zwischen 1-5 sein.`);
      }
      
      // Im Demo/Entwicklungsmodus wird nichts gespeichert
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 1000));
        logger.info('SolvboxAI-Feedback gesendet (Mock):', { tileId, rating, comment });
        return true;
      }

      // In der Produktionsumgebung der API-Aufruf
      const apiService = this.getApiService();
      await apiService.post('/solvboxai/feedback', { 
        tileId, 
        rating, 
        comment: comment || '' 
      });
      return true;
    } catch (error) {
      const solvboxAIError = this.handleError(
        error, 
        'sendFeedback', 
        'Fehler beim Senden des Feedbacks', 
        SolvboxAIErrorType.NETWORK
      );
      return false;
    }
  }

  /**
   * Konvertiert SolvboxAITile-Objekte aus dem Backend in SolvboxAITileData-Objekte für die UI
   * Wandelt die Komplexitätsstufen ins deutsche Format um und fügt zusätzliche Eigenschaften hinzu
   * @param {SolvboxAITile[]} tiles - Array von SolvboxAITile-Objekten
   * @returns {SolvboxAITileData[]} Array von SolvboxAITileData-Objekten, konvertiert für die UI
   * @throws {SolvboxAIError} Wenn ein Fehler bei der Konvertierung auftritt
   */
  public convertTilesToTileData(tiles: SolvboxAITile[]): SolvboxAITileData[] {
    try {
      return tiles.map(tile => {
        const type = tile.tabId === 'gigs' ? 'gig' : 'casestudy';
        
        // Konvertiere Komplexität ins deutsche Format
        let complexity: 'einfach' | 'mittel' | 'komplex' | undefined;
        switch (tile.complexity) {
          case 'basic': complexity = 'einfach'; break;
          case 'advanced': complexity = 'mittel'; break;
          case 'expert': complexity = 'komplex'; break;
          default: complexity = undefined;
        }
        
        if (type === 'gig') {
          return {
            ...tile,
            type,
            complexity
          } as SolvboxAITileData;
        } else {
          return {
            ...tile,
            type,
            industry: tile.aiCategory, // Verwende aiCategory als industry
            companySize: 'medium' as const // Standardwert, falls nicht vorhanden
          } as SolvboxAITileData;
        }
      });
    } catch (error) {
      // Werfe einen SolvboxAIError
      throw this.handleError(
        error, 
        'convertTilesToTileData', 
        'Fehler bei der Konvertierung der Kacheln',
        SolvboxAIErrorType.UNKNOWN
      );
    }
  }
  
  /**
   * Sicherer Wrapper für asynchrone Operationen, der Fehler standarisiert erfasst und behandelt
   * @param {() => Promise<T>} operation - Die auszuführende asynchrone Operation
   * @param {string} context - Kontext der Operation für Fehlermeldungen
   * @param {string} errorMessage - Fallback-Fehlermeldung
   * @returns {Promise<T>} Das Ergebnis der Operation, wenn erfolgreich
   * @throws {SolvboxAIError} Ein standardisierter Fehler, wenn die Operation fehlschlägt
   */
  public async safeOperation<T>(
    operation: () => Promise<T>, 
    context: string,
    errorMessage: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      // Wenn es bereits ein SolvboxAIError ist, werfe ihn einfach weiter
      if (error instanceof SolvboxAIError) {
        throw error;
      }
      
      // Ansonsten erstelle einen neuen standardisierten Fehler
      throw this.handleError(error, context, errorMessage);
    }
  }
} 