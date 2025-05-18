/**
 * categoryUtils - Hilfsfunktionen für Kategorieverwaltung
 * 
 * Diese Datei enthält Funktionen zur Verwaltung von Kategorien für MySolvbox-Tiles,
 * wie z.B. das Extrahieren und Filtern nach Kategorien.
 */

import { TFunction } from 'i18next';

import { MySolvboxTile } from '@/types/tiles';

import { MySolvboxTabId } from '../types';

/**
 * Extrahiert alle eindeutigen Kategorien aus einem Array von Kacheln
 * abhängig vom Tab-Typ
 * @param {MySolvboxTabId} tabId ID des Tabs
 * @param {MySolvboxTile[]} tiles Kachel-Array
 * @returns {string[]} String-Array mit eindeutigen Kategorien, beginnend mit 'all'
 */
export function getCategoriesForTiles(
  tabId: MySolvboxTabId,
  tiles: MySolvboxTile[]
): string[] {
  // Verwende ein Set für eindeutige Kategorien
  const uniqueCategories = new Set<string>();
  
  // Standardkategorie immer hinzufügen
  uniqueCategories.add('all');
  
  // Kategorien aus den Kacheln extrahieren
  tiles.forEach(tile => {
    if (tile.category && typeof tile.category === 'string') {
      uniqueCategories.add(tile.category);
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
      result[category] = t('mysolvbox.categories.all', 'Alle');
      return;
    }
    
    // Für bekannte Kategorien die Übersetzungen verwenden
    const translationKey = `mysolvbox.categories.${category}`;
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
export function filterTilesByCategory(
  tiles: MySolvboxTile[],
  selectedCategory: string | null
): MySolvboxTile[] {
  if (!selectedCategory || selectedCategory === 'all') return tiles;
  
  return tiles.filter(tile => {
    return tile.category === selectedCategory;
  });
} 