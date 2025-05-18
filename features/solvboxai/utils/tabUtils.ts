/**
 * tabUtils - Hilfsfunktionen für Tab-Hooks
 * 
 * Diese Datei enthält die Factory-Funktion für Tab-Hooks,
 * die es ermöglicht, die gemeinsame Logik für verschiedene Tabs zu teilen.
 * Spezialisierte Hilfsfunktionen wurden in hookUtils.ts und categoryUtils.ts ausgelagert.
 */

import { useState, useCallback } from 'react';

import { SolvboxAITabId, SolvboxAITileData } from '../types';
import { getCategoriesForTiles } from './categoryUtils';
import { useTabCategoryFilter, useTabDataLoader, useTabTileHandler } from './hookUtils';

/**
 * Factory-Funktion für Tab-Hooks
 * 
 * Diese Funktion erstellt einen Tab-Hook basierend auf der übergebenen Konfiguration.
 * Sie vereinfacht die Erstellung neuer Tab-Hooks, indem sie die gemeinsame Logik kapselt.
 * @param config Konfiguration für den Tab-Hook
 * @param config.tabId ID des Tabs
 * @param config.fetchData Funktion zum Abrufen der Daten
 * @param config.errorMessage Fehlermeldung im Falle eines Fehlers
 * @param config.onTilePress Optionaler Handler für Kachel-Klicks
 * @returns Hook-Funktion für den Tab
 */
export function createTabHook<T extends SolvboxAITileData>(config: {
  tabId: SolvboxAITabId;
  fetchData: () => T[];
  errorMessage: string;
  onTilePress?: (tileId: number) => void;
}) {
  return function useCreatedTabHook() {
    const [tiles, setTiles] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | any | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Daten laden mit vereinfachter Fehlerbehandlung
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
    
    // Kategorien extrahieren
    const categories = useCallback(() => {
      return getCategoriesForTiles(config.tabId, tiles);
    }, [tiles]);
    
    // Kacheln filtern
    const filteredTiles = useTabCategoryFilter(tiles, selectedCategory);
    
    // Handler für Kategorieänderungen
    const handleCategoryChange = useCallback((category: string | null) => {
      setSelectedCategory(category);
    }, []);
    
    // Rückgabe aller benötigten Daten und Funktionen
    return {
      tiles,
      filteredTiles: filteredTiles(),
      categories: categories(),
      selectedCategory,
      handleCategoryChange,
      handleTilePress,
      isLoading,
      error
    };
  };
} 