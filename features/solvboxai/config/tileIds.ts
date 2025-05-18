/**
 * Tile-ID-Management für SolvboxAI
 * 
 * Diese Datei enthält Funktionen und Konstanten für die Verwaltung von Tile-IDs
 * in SolvboxAI. Sie stellt sicher, dass IDs korrekt validiert und typisiert werden.
 */

import { TAB_IDS } from './tabs';
import { SolvboxAITabId } from '../types';

/**
 * Tile-ID-Präfixe für verschiedene Tab-Typen
 */
export const TILE_ID_PREFIXES = {
  [TAB_IDS.GIGS]: 'gig_',
  [TAB_IDS.CASESTUDIES]: 'cs_',
};

/**
 * Prüft, ob eine Tile-ID gültig ist
 * @param tileId Die zu prüfende Tile-ID
 * @returns true, wenn die ID gültig ist, sonst false
 */
export function isValidSolvboxAITileId(tileId: number | string): boolean {
  // Behandle numerische IDs
  if (typeof tileId === 'number') {
    return tileId > 0;
  }
  
  // Behandle String-IDs mit Präfixen
  if (typeof tileId === 'string') {
    return Object.values(TILE_ID_PREFIXES).some(prefix => 
      tileId.startsWith(prefix) && tileId.length > prefix.length
    );
  }
  
  return false;
}

/**
 * Extrahiert den Tab-Typ aus einer Tile-ID
 * @param tileId Die Tile-ID, aus der der Tab-Typ extrahiert werden soll
 * @returns Den Tab-Typ oder undefined, wenn die ID ungültig ist
 */
export function getTileTypeFromId(tileId: number | string): SolvboxAITabId | undefined {
  if (typeof tileId === 'number') {
    // Numerische ID-Logik basierend auf Bereichen
    if (tileId >= 1000 && tileId < 2000) return TAB_IDS.GIGS;
    if (tileId >= 2000 && tileId < 3000) return TAB_IDS.CASESTUDIES;
    return undefined;
  }
  
  if (typeof tileId === 'string') {
    // String-ID-Logik basierend auf Präfixen
    for (const [tabId, prefix] of Object.entries(TILE_ID_PREFIXES)) {
      if (tileId.startsWith(prefix)) {
        return tabId as SolvboxAITabId;
      }
    }
  }
  
  return undefined;
}

/**
 * Erzeugt eine neue Tile-ID für einen bestimmten Tab-Typ
 * @param tabId Der Tab-Typ, für den die ID erzeugt werden soll
 * @param numericId Optionale numerische ID, die verwendet werden soll
 * @returns Eine neue Tile-ID
 */
export function createTileId(tabId: SolvboxAITabId, numericId?: number): string {
  const prefix = TILE_ID_PREFIXES[tabId];
  
  if (!prefix) {
    throw new Error(`Ungültiger Tab-Typ: ${tabId}`);
  }
  
  if (numericId) {
    return `${prefix}${numericId}`;
  }
  
  // Generiere eine zufällige ID, wenn keine numerische ID angegeben ist
  const randomId = Math.floor(Math.random() * 1000000);
  return `${prefix}${randomId}`;
} 