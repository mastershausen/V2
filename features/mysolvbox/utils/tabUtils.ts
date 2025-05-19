/**
 * tabUtils - Hilfsfunktionen für Tab-Hooks
 * 
 * Diese Datei enthält modulare Hilfsfunktionen für Tab-Hooks, die es ermöglichen,
 * die gemeinsame Logik zu nutzen, ohne komplexe Delegationsmuster zu benötigen.
 */

import { useState, useEffect, useCallback } from 'react';

import { isValidMySolvboxTileId, getTileTypeFromId } from '../config/tileIds';
import { TileData, MySolvboxTabId } from '../types';

/**
 * Konfiguration für den Daten-Loader
 */
export interface TabDataLoaderConfig<T extends TileData> {
  fetchData: () => T[];
  setTiles: (tiles: T[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  errorMessage: string;
  tabId: MySolvboxTabId;
}

/**
 * Hook zum Laden von Tab-Daten
 * 
 * Diese Funktion extrahiert die Logik zum Laden von Tab-Daten in eine eigenständige,
 * wiederverwendbare Funktion, die in verschiedenen Tab-Hooks verwendet werden kann.
 * @param root0
 * @param root0.fetchData
 * @param root0.setTiles
 * @param root0.setIsLoading
 * @param root0.setError
 * @param root0.errorMessage
 * @param root0.tabId
 */
export function useTabDataLoader<T extends TileData>({
  fetchData,
  setTiles,
  setIsLoading,
  setError,
  errorMessage,
  tabId
}: TabDataLoaderConfig<T>): void {
  useEffect(() => {
    try {
      // Sicherstellen, dass fetchData eine Funktion ist
      if (typeof fetchData !== 'function') {
        throw new Error('fetchData muss eine Funktion sein');
      }

      // fetchData aufrufen und das Ergebnis speichern
      const data = fetchData();
      
      // Sicherstellen, dass data ein Array ist
      if (!Array.isArray(data)) {
        throw new Error('Geladene Daten müssen ein Array sein');
      }
      
      setTiles(data);
      setIsLoading(false);
    } catch (err) {
      console.error(`Fehler beim Laden der ${tabId}-Daten:`, err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      setIsLoading(false);
    }
  }, [fetchData, errorMessage, tabId, setTiles, setIsLoading, setError]);
}

/**
 * Hook zum Erstellen eines Tab-Tile-Handlers
 * 
 * Diese Funktion erstellt einen Handler für Kachel-Klicks basierend auf der Tab-ID,
 * ohne dass eine komplexe Delegation zu einem übergeordneten Hook erforderlich ist.
 * @param tabId
 * @param customHandler
 */
export function useTabTileHandler(tabId: MySolvboxTabId, customHandler?: (tileId: number) => void) {
  // Import router from expo-router
  const router = require('expo-router').useRouter();

  return useCallback((tileId: number) => {
    // Wenn ein benutzerdefinierter Handler bereitgestellt wurde, verwende diesen
    if (customHandler) {
      customHandler(tileId);
      return;
    }
    
    // Zunächst prüfen, ob die Kachel-ID überhaupt gültig ist
    if (!isValidMySolvboxTileId(tileId)) {
      console.warn(`Ungültige Kachel-ID: ${tileId}`);
      return;
    }

    // Prüfen, ob die Kachel zum richtigen Tab gehört
    const tileType = getTileTypeFromId(tileId);
    if (tileType !== tabId) {
      console.warn(`Kachel-ID ${tileId} gehört nicht zum Tab ${tabId}`);
      return;
    }

    // Log-Ausgabe
    console.log(`${tabId} Tile pressed: ${tileId}`);
    
    // Den tatsächlichen Titel der Kachel aus den Mockup-Daten holen
    let tileTitle = "Ergebnisse";
    
    // Import der Hilfsfunktionen für Kacheldaten
    const { 
      getSaveTileById, 
      getGrowTileById, 
      getForesightTileById, 
      getBonusTileById 
    } = require('../config/data');
    
    // Je nach Tab-ID die entsprechende Hilfsfunktion verwenden
    if (tabId === 'save') {
      const tile = getSaveTileById(tileId);
      if (tile) {
        tileTitle = tile.title;
      }
    } else if (tabId === 'grow') {
      const tile = getGrowTileById(tileId);
      if (tile) {
        tileTitle = tile.title;
      }
    } else if (tabId === 'foresight') {
      const tile = getForesightTileById(tileId);
      if (tile) {
        tileTitle = tile.title;
      }
    } else if (tabId === 'bonus') {
      const tile = getBonusTileById(tileId);
      if (tile) {
        tileTitle = tile.title;
      }
    }
    
    // Zum TileResults Screen navigieren
    router.push({
      pathname: '/mysolvbox/tileResults',
      params: { 
        tileId: tileId.toString(),
        title: tileTitle,
        imageUrl: ''
      }
    });
  }, [tabId, customHandler, router]);
}

/**
 * Factory-Funktion für Tab-Hooks
 * 
 * Diese Funktion erstellt einen Tab-Hook basierend auf der übergebenen Konfiguration.
 * Sie vereinfacht die Erstellung neuer Tab-Hooks, indem sie die gemeinsame Logik kapselt.
 * @param config
 * @param config.tabId
 * @param config.fetchData
 * @param config.errorMessage
 * @param config.onTilePress
 */
export function createTabHook<T extends TileData>(config: {
  tabId: MySolvboxTabId;
  fetchData: () => T[];
  errorMessage: string;
  onTilePress?: (tileId: number) => void;
}) {
  return function useCreatedTabHook() {
    const [tiles, setTiles] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Daten laden
    useTabDataLoader({
      fetchData: config.fetchData,
      setTiles,
      setIsLoading,
      setError,
      errorMessage: config.errorMessage,
      tabId: config.tabId
    });

    // Handler für Kachel-Klicks
    const handleTilePress = useTabTileHandler(config.tabId, config.onTilePress);

    return {
      tiles,
      handleTilePress,
      isLoading,
      error,
    };
  };
} 