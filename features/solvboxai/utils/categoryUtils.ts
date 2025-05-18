/**
 * categoryUtils - Hilfsfunktionen für Kategorieverwaltung
 * 
 * Diese Datei enthält Funktionen zur Verwaltung von Kategorien für SolvboxAI-Tiles,
 * wie z.B. das Extrahieren und Filtern nach Kategorien.
 */

import { TFunction } from 'i18next';

import { SolvboxAITabId, SolvboxAITileData } from '../types';

/**
 * Extrahiert alle eindeutigen Kategorien aus einem Array von Kacheln
 * abhängig vom Tab-Typ
 * @template T
 * @param {SolvboxAITabId} tabId ID des Tabs (gigs oder casestudies)
 * @param {Array<T>} tiles Kachel-Array
 * @returns {string[]} String-Array mit eindeutigen Kategorien, beginnend mit 'all'
 */
export function getCategoriesForTiles<T extends SolvboxAITileData>(
  tabId: SolvboxAITabId,
  tiles: T[]
): string[] {
  // Verwende ein Set für eindeutige Kategorien
  const uniqueCategories = new Set<string>();
  
  // Standardkategorie immer hinzufügen
  uniqueCategories.add('all');
  
  tiles.forEach(tile => {
    // Wenn die Kachel Kategorien hat, diese verwenden
    if (tile.categories && Array.isArray(tile.categories)) {
      tile.categories.forEach(category => {
        if (category) uniqueCategories.add(category);
      });
      return;
    }
    
    // Für Case Studies verwenden wir 'industry'
    if (tile.type === 'casestudy' && 'industry' in tile && typeof tile.industry === 'string' && tile.industry) {
      uniqueCategories.add(tile.industry);
    }
    
    // Für Gigs verwenden wir 'complexity'
    if (tile.type === 'gig' && 'complexity' in tile && typeof tile.complexity === 'string' && tile.complexity) {
      uniqueCategories.add(tile.complexity);
    }
  });
  
  return Array.from(uniqueCategories).sort();
}

/**
 * Generiert ein Objekt mit übersetzten Kategoriebeschriftungen aus den Kategorieids
 * @param t Übersetzungsfunktion
 * @param categories Kategorieids
 * @returns Object mit Schlüssel = Kategorieid, Wert = übersetzte Beschriftung
 */
export function translateCategories(
  t: TFunction,
  categories: string[]
): Record<string, string> {
  const result: Record<string, string> = {};
  
  categories.forEach(category => {
    // Für 'all' gibt es einen speziellen Übersetzungsschlüssel
    if (category === 'all') {
      result[category] = t('solvboxai.categories.all', 'Alle');
      return;
    }
    
    // Für bekannte Kategorien die Übersetzungen verwenden
    const translationKey = `solvboxai.categories.${category}`;
    result[category] = t(translationKey, category); // Fallback auf den Originalnamen
  });
  
  return result;
}

/**
 * Filtert Kacheln basierend auf einer ausgewählten Kategorie
 * @param tiles Array von Kacheln
 * @param selectedCategory Die ausgewählte Kategorie
 * @returns Gefiltertes Array von Kacheln
 */
export function filterTilesByCategory<T extends SolvboxAITileData>(
  tiles: T[],
  selectedCategory: string | null
): T[] {
  if (!selectedCategory || selectedCategory === 'all') return tiles;
  
  return tiles.filter(tile => {
    // Wenn die Kachel Kategorien hat, diese verwenden
    if (tile.categories && Array.isArray(tile.categories)) {
      return tile.categories.includes(selectedCategory);
    }
    
    // Für Gigs
    if (tile.type === 'gig' && 'complexity' in tile) {
      return tile.complexity === selectedCategory;
    }
    
    // Für Case Studies
    if (tile.type === 'casestudy' && 'industry' in tile) {
      return tile.industry === selectedCategory;
    }
    
    return false;
  });
} 