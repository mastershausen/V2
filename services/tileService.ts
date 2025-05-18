import AsyncStorage from '@react-native-async-storage/async-storage';

import mySolvboxTilesData from '@/data/mysolvbox-tiles.json';
import solvboxAITilesData from '@/data/solvboxai-tiles.json';
import { logger } from '@/utils/logger';
import { IService } from '@/utils/service/serviceRegistry';

import {MySolvboxTile, SolvboxAITile} from '../types/tiles';


// Cache-Keys
const CACHE_KEYS = {
  MYSOLVBOX: 'mysolvbox_tiles_cache',
  SOLVBOXAI: 'solvboxai_tiles_cache',
  LAST_UPDATE: 'tiles_last_update'
};

// Cache-Dauer in Millisekunden (24 Stunden)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Service zum Laden und Verwalten der Kachel-Daten
 * Implementiert das IService-Interface für die ServiceRegistry.
 */
class TileService implements IService {
  /**
   * Initialisierung des Tile-Service
   */
  async init(): Promise<void> {
    logger.debug('[TileService] Initialisiert');
  }

  /**
   * Ressourcen freigeben
   */
  async dispose(): Promise<void> {
    logger.debug('[TileService] Ressourcen freigegeben');
  }

  /**
   * Lädt die MySolvbox-Kacheln
   * @param forceRefresh Erzwingt das Neuladen der Daten
   */
  async getMySolvboxTiles(forceRefresh = false): Promise<MySolvboxTile[]> {
    try {
      // Wenn kein Neuladen erzwungen wird, versuche zuerst aus dem Cache zu laden
      if (!forceRefresh) {
        const cachedTiles = await this.loadFromCache<MySolvboxTile>(CACHE_KEYS.MYSOLVBOX);
        if (cachedTiles) return cachedTiles;
      }
      
      // Später: API-Call
      // Aktuell: Lokale JSON-Datei laden
      const response = mySolvboxTilesData;
      
      // Cache die Daten
      // Die Daten aus der JSON-Datei müssen zuerst als unknown behandelt werden,
      // da sie nicht 100% dem Interface entsprechen
      await this.cacheTiles(CACHE_KEYS.MYSOLVBOX, response.tiles as unknown as MySolvboxTile[]);
      
      return response.tiles as unknown as MySolvboxTile[];
    } catch (error) {
      logger.error('Fehler beim Laden der MySolvbox-Kacheln:', error instanceof Error ? error.message : String(error));
      
      // Versuche aus dem Cache zu laden
      const cachedTiles = await this.loadFromCache<MySolvboxTile>(CACHE_KEYS.MYSOLVBOX);
      if (cachedTiles) return cachedTiles;
      
      return [];
    }
  }

  /**
   * Lädt die SolvboxAI-Kacheln
   * @param forceRefresh Erzwingt das Neuladen der Daten
   */
  async getSolvboxAITiles(forceRefresh = false): Promise<SolvboxAITile[]> {
    try {
      // Wenn kein Neuladen erzwungen wird, versuche zuerst aus dem Cache zu laden
      if (!forceRefresh) {
        const cachedTiles = await this.loadFromCache<SolvboxAITile>(CACHE_KEYS.SOLVBOXAI);
        if (cachedTiles) return cachedTiles;
      }
      
      // Später: API-Call
      // Aktuell: Lokale JSON-Datei laden
      const response = solvboxAITilesData;
      
      // Cache die Daten
      // Die Daten aus der JSON-Datei müssen zuerst als unknown behandelt werden,
      // da sie nicht 100% dem Interface entsprechen
      await this.cacheTiles(CACHE_KEYS.SOLVBOXAI, response.tiles as unknown as SolvboxAITile[]);
      
      return response.tiles as unknown as SolvboxAITile[];
    } catch (error) {
      logger.error('Fehler beim Laden der SolvboxAI-Kacheln:', error instanceof Error ? error.message : String(error));
      
      // Versuche aus dem Cache zu laden
      const cachedTiles = await this.loadFromCache<SolvboxAITile>(CACHE_KEYS.SOLVBOXAI);
      if (cachedTiles) return cachedTiles;
      
      return [];
    }
  }

  /**
   * Speichert Kacheln im Cache
   * @param key Cache-Schlüssel
   * @param tiles Array von Kacheln
   */
  private async cacheTiles(key: string, tiles: (MySolvboxTile | SolvboxAITile)[]): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(tiles));
      await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());
    } catch (error) {
      logger.error('Fehler beim Cachen der Kacheln:', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Lädt Kacheln aus dem Cache
   * @param key Cache-Schlüssel
   * @returns Array von Kacheln oder null, wenn kein Cache existiert oder ungültig ist
   */
  private async loadFromCache<T extends MySolvboxTile | SolvboxAITile>(key: string): Promise<T[] | null> {
    try {
      const lastUpdate = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATE);
      const cachedData = await AsyncStorage.getItem(key);
      
      if (!lastUpdate || !cachedData) return null;
      
      // Prüfe ob der Cache noch gültig ist
      const timestamp = parseInt(lastUpdate);
      if (Date.now() - timestamp > CACHE_DURATION) return null;
      
      return JSON.parse(cachedData) as T[];
    } catch (error) {
      logger.error('Fehler beim Laden aus dem Cache:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  /**
   * Leert den Cache
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.MYSOLVBOX,
        CACHE_KEYS.SOLVBOXAI,
        CACHE_KEYS.LAST_UPDATE
      ]);
    } catch (error) {
      logger.error('Fehler beim Leeren des Caches:', error instanceof Error ? error.message : String(error));
    }
  }
}

// Standardexport für die ServiceRegistry
export default TileService; 