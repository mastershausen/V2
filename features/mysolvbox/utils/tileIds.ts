/**
 * tileIds - Hilfsfunktionen für konsistente ID-Verwaltung in MySolvbox
 * 
 * Diese Datei enthält Funktionen zur Verwaltung von Kachel-IDs, um Konsistenz
 * und Typsicherheit in der gesamten MySolvbox-Anwendung zu gewährleisten.
 */

import { TAB_IDS } from '../config/tabs';
import { ID_RANGES, isValidMySolvboxTileId, getTileTypeFromId } from '../config/tileIds';
import { TileData, MySolvboxTabId } from '../types';

/**
 * Typdefinition für gültige Tile-ID-Formate
 * In MySolvbox sind IDs immer numerisch, aber diesen Typ behalten wir für Konsistenz
 * mit SolvboxAI und für zukünftige Flexibilität.
 */
export type TileId = number;

/**
 * Re-export nützlicher Funktionen aus der Konfiguration für einfacheren Zugriff
 */
export { isValidMySolvboxTileId, getTileTypeFromId };

/**
 * Konvertiert eine ID zu einer Zahl (Identitätsfunktion in MySolvbox, da IDs bereits Zahlen sind)
 * @param id ID als Zahl
 * @returns ID als Zahl (unverändert)
 */
export function toNumericId(id: TileId): number {
  return id;
}

/**
 * Konvertiert eine ID zu einem String
 * @param id ID als Zahl
 * @returns ID als String
 */
export function toStringId(id: TileId): string {
  return id.toString();
}

/**
 * Prüft, ob eine ID gültig ist
 * Wrapper für isValidMySolvboxTileId für konsistente Benennung
 * @param id ID als Zahl
 * @returns true, wenn die ID gültig ist
 */
export function isValidId(id: TileId): boolean {
  return isValidMySolvboxTileId(id);
}

/**
 * Generiert eine neue eindeutige ID für einen Tab
 * @param tabId Tab-ID für den Kontext
 * @param existingIds Existierende IDs, um Eindeutigkeit zu gewährleisten
 * @returns Neue eindeutige ID
 */
export function generateUniqueId(
  tabId: MySolvboxTabId, 
  existingIds: TileId[] = []
): number {
  const range = ID_RANGES.MYSOLVBOX[tabId];
  const prefix = range.START;
  
  // Finde die höchste vorhandene ID
  const maxId = existingIds.length > 0 
    ? Math.max(...existingIds) 
    : prefix;
  
  // Neue ID ist eine Einheit höher
  return maxId + 1;
}

/**
 * Ermittelt den Tab-Typ aus einer ID
 * Wrapper für getTileTypeFromId für konsistente Benennung
 * @param id ID der Kachel
 * @returns Tab-Typ oder null, wenn nicht bestimmbar
 */
export function getTabTypeFromId(id: TileId): MySolvboxTabId | null {
  return getTileTypeFromId(id) || null;
}

/**
 * Konvertiert ID in das korrekte Format für TileData
 * Diese Funktion ist in MySolvbox eine Identitätsfunktion, da IDs bereits
 * im korrekten Format sind.
 * @param id ID der Kachel
 * @returns ID unverändert
 */
export function toTileGridId(id: TileId): number {
  return id;
}

/**
 * Extrahiert IDs aus einem Array von Kacheln
 * @param tiles Array von Kacheln
 * @returns Array von IDs
 */
export function extractIds<T extends TileData>(tiles: T[]): TileId[] {
  return tiles.map(tile => tile.id);
}

/**
 * Erstellt eine Map von IDs zu Kacheln für schnellen Zugriff
 * @param tiles Array von Kacheln
 * @returns Map von IDs zu Kacheln
 */
export function createTileIdMap<T extends TileData>(tiles: T[]): Map<TileId, T> {
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
export function findTileById<T extends TileData>(
  tiles: T[], 
  id: TileId
): T | undefined {
  return tiles.find(tile => tile.id === id);
} 