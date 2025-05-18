import { useState, useCallback } from 'react';

import { getForesightTileData } from '../config/data';
import { ForesightTileData } from '../types';
import { useTabDataLoader, useTabTileHandler } from '../utils/tabUtils';

/**
 * Filtert Voraussichtskacheln nach Zeithorizont
 * @param tiles Alle Voraussichtskacheln
 * @param timeHorizon Der Zeithorizont, nach dem gefiltert werden soll
 * @returns Gefilterte Kacheln
 */
export function filterForesightTilesByTimeHorizon(tiles: ForesightTileData[], timeHorizon: string): ForesightTileData[] {
  if (!timeHorizon) return tiles;
  return tiles.filter(tile => tile.timeHorizon === timeHorizon);
}

/**
 * Filtert Voraussichtskacheln nach Kategorie
 * @param tiles Alle Voraussichtskacheln
 * @param category Die Kategorie, nach der gefiltert werden soll
 * @returns Gefilterte Kacheln
 */
export function filterForesightTilesByCategory(tiles: ForesightTileData[], category: string): ForesightTileData[] {
  if (!category) return tiles;
  return tiles.filter(tile => tile.category === category);
}

/**
 * Hook für die Geschäftslogik des ForesightTab
 *
 * Bietet Standard-Funktionalität sowie erweiterte Filtermöglichkeiten
 * nach Zeithorizont für Voraussichtskacheln.
 * @returns Alle notwendigen Daten und Funktionen für den ForesightTab
 */
export function useForesightTab() {
  // Standard-State
  const [tiles, setTiles] = useState<ForesightTileData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Tab-spezifischer State für erweiterte Funktionen
  const [timeHorizonFilter, setTimeHorizonFilter] = useState<string | null>(null);

  // Daten laden mit der Hilfsfunktion
  useTabDataLoader({
    fetchData: getForesightTileData,
    setTiles,
    setIsLoading,
    setError,
    errorMessage: 'Fehler beim Laden der Voraussichtsdaten',
    tabId: 'foresight'
  });

  // Handler für Kachel-Klicks
  const handleTilePress = useTabTileHandler('foresight', (tileId: number) => {
    // Spezielle Logik für diesen Tab
    console.log(`Spezielle Foresight-Aktion für Kachel ${tileId}`);
  });

  // Gefilterte Daten basierend auf dem Filter
  const filteredTiles = useCallback(() => {
    if (!timeHorizonFilter) return tiles;
    
    return tiles.filter(tile => 
      tile.timeHorizon === timeHorizonFilter
    );
  }, [tiles, timeHorizonFilter]);

  return {
    // Standard-API
    tiles: filteredTiles(),
    allTiles: tiles,
    handleTilePress,
    isLoading,
    error,
    
    // Erweiterte API für den Foresight Tab
    timeHorizonFilter,
    setTimeHorizonFilter,
    clearFilter: () => setTimeHorizonFilter(null),
    availableTimeHorizons: [...new Set(tiles.map(tile => tile.timeHorizon).filter(Boolean))]
  };
} 