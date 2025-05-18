/**
 * Gemeinsame Utilities für den MySolvbox-Bereich
 * 
 * Dieses Modul enthält wiederverwendbare Hilfsfunktionen, die in verschiedenen
 * Teilen des MySolvbox-Bereichs genutzt werden können.
 */

import { TileData } from '../types';

/**
 * Validiert eine Kachel-ID anhand eines Bereichs
 * @param id Die zu validierende Kachel-ID
 * @param rangeStart Untere Grenze des gültigen Bereichs
 * @param rangeEnd Obere Grenze des gültigen Bereichs
 * @returns Ob die ID im gültigen Bereich liegt
 */
export function isValidTileId(id: number, rangeStart: number, rangeEnd: number): boolean {
  if (!id || typeof id !== 'number') {
    return false;
  }
  
  return id >= rangeStart && id <= rangeEnd;
}

/**
 * Filtert Kacheln anhand eines Suchbegriffs
 * @param tiles Die zu filternden Kacheln
 * @param searchQuery Der Suchbegriff
 * @returns Die gefilterten Kacheln
 */
export function filterTilesBySearchQuery<T extends TileData>(
  tiles: T[],
  searchQuery: string
): T[] {
  if (!searchQuery || searchQuery.trim() === '') {
    return tiles;
  }
  
  const normalizedQuery = searchQuery.toLowerCase().trim();
  
  return tiles.filter(tile => {
    const titleMatch = tile.title.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = tile.description 
      ? tile.description.toLowerCase().includes(normalizedQuery) 
      : false;
    
    return titleMatch || descriptionMatch;
  });
}

/**
 * Gruppiert Kacheln nach einer Eigenschaft
 * @param tiles Die zu gruppierenden Kacheln
 * @param keyExtractor Funktion, die den Gruppierungsschlüssel extrahiert
 * @returns Ein Objekt mit den gruppierten Kacheln
 */
export function groupTilesBy<T extends TileData, K extends string>(
  tiles: T[],
  keyExtractor: (tile: T) => K
): Record<string, T[]> {
  return tiles.reduce((acc, tile) => {
    const key = keyExtractor(tile);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(tile);
    return acc;
  }, {} as Record<string, T[]>);
} 