/**
 * tileIds - Hilfsfunktionen für konsistente ID-Verwaltung
 * 
 * Diese Datei enthält Funktionen zur Verwaltung von Kachel-IDs, um Konsistenz
 * und Typsicherheit in der gesamten SolvboxAI-Anwendung zu gewährleisten.
 */

import { SolvboxAITileData, SolvboxAITabId } from '../types';

/**
 * Typdefinition für gültige Tile-ID-Formate
 */
export type TileId = string | number;

/**
 * Prefix-Map für verschiedene Tab-Typen
 * Nützlich für die Generierung eindeutiger IDs
 */
const ID_PREFIXES: Record<SolvboxAITabId, number> = {
  gigs: 8000,
  casestudies: 9000,
};

/**
 * Konvertiert eine ID zu einer Zahl
 * @param id ID als String oder Zahl
 * @returns ID als Zahl
 */
export function toNumericId(id: TileId): number {
  return typeof id === 'string' ? parseInt(id, 10) : id;
}

/**
 * Konvertiert eine ID zu einem String
 * @param id ID als String oder Zahl
 * @returns ID als String
 */
export function toStringId(id: TileId): string {
  return id.toString();
}

/**
 * Prüft, ob eine ID gültig ist
 * @param id ID als String oder Zahl
 * @returns true, wenn die ID gültig ist
 */
export function isValidId(id: TileId): boolean {
  if (typeof id === 'string') {
    return /^\d+$/.test(id);
  }
  return typeof id === 'number' && !isNaN(id) && id > 0;
}

/**
 * Generiert eine neue eindeutige ID für einen Tab
 * @param tabId Tab-ID für den Kontext
 * @param existingIds Existierende IDs, um Eindeutigkeit zu gewährleisten
 * @returns Neue eindeutige ID
 */
export function generateUniqueId(
  tabId: SolvboxAITabId, 
  existingIds: TileId[] = []
): number {
  const prefix = ID_PREFIXES[tabId] || 1000;
  const numericIds = existingIds.map(toNumericId);
  
  // Finde die höchste vorhandene ID
  const maxId = numericIds.length > 0 
    ? Math.max(...numericIds) 
    : prefix;
  
  // Neue ID ist eine Einheit höher
  return maxId + 1;
}

/**
 * Ermittelt den Tab-Typ aus einer ID
 * @param id ID der Kachel
 * @returns Tab-Typ oder null, wenn nicht bestimmbar
 */
export function getTabTypeFromId(id: TileId): SolvboxAITabId | null {
  const numId = toNumericId(id);
  
  if (numId >= ID_PREFIXES.gigs && numId < ID_PREFIXES.casestudies) {
    return 'gigs';
  } else if (numId >= ID_PREFIXES.casestudies && numId < 10000) {
    return 'casestudies';
  }
  
  return null;
}

/**
 * Konvertiert ID in das korrekte Format für TileData
 * Diese Funktion hilft bei der Behebung von @ts-expect-error für die TileGrid-Komponente
 * @param id ID der Kachel
 * @returns ID als Zahl für TileGrid
 */
export function toTileGridId(id: TileId): number {
  return toNumericId(id);
}

/**
 * Extrahiert IDs aus einem Array von Kacheln
 * @param tiles Array von Kacheln
 * @returns Array von IDs
 */
export function extractIds<T extends SolvboxAITileData>(tiles: T[]): TileId[] {
  return tiles.map(tile => tile.id);
}

/**
 * Erstellt eine Map von IDs zu Kacheln für schnellen Zugriff
 * @param tiles Array von Kacheln
 * @returns Map von IDs zu Kacheln
 */
export function createTileIdMap<T extends SolvboxAITileData>(tiles: T[]): Map<TileId, T> {
  const map = new Map<TileId, T>();
  
  tiles.forEach(tile => {
    map.set(tile.id, tile);
  });
  
  return map;
}

/**
 * Findet eine Kachel in einem Array nach ID
 * @param tiles Array von Kacheln
 * @param id ID der gesuchten Kachel
 * @returns Kachel oder undefined, wenn nicht gefunden
 */
export function findTileById<T extends SolvboxAITileData>(
  tiles: T[], 
  id: TileId
): T | undefined {
  const numericId = toNumericId(id);
  return tiles.find(tile => toNumericId(tile.id) === numericId);
} 