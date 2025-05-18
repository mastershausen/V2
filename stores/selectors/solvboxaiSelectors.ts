/**
 * solvboxaiSelectors - Selektoren für den SolvboxAI-Store
 * 
 * Diese Selektoren kapseln die Logik zum Abrufen und Transformieren von Daten aus dem
 * solvboxaiStore. Durch die Verwendung von Selektoren wird die Zugrifflogik zentralisiert
 * und wiederverwendbar gemacht.
 * 
 * Alle Selektoren sind memoiziert, um unnötige Neuberechnungen zu vermeiden.
 */

import { DEFAULT_TAB_ID } from '@/features/solvboxai/config/tabs';
import { SolvboxAITabId } from '@/features/solvboxai/types';
import { SolvboxAITile } from '@/types/tiles';

import { SolvboxaiState, SolvboxaiStore } from '../types/solvboxaiTypes';

// Einfache Memo-Implementierung für Selektoren
type SelectorCache<T> = {
  lastState: SolvboxaiState | null;
  lastResult: T | null;
};

// Typdefinitionen für die Rückgabewerte von Selektoren
type BoundSelectors = {
  activeTab: string;
  allTiles: SolvboxAITile[];
  activeTiles: SolvboxAITile[];
  recommendations: SolvboxAITile[];
  lastLoaded: string | undefined;
  recommendationsLoaded: string | undefined;
  shouldReloadTiles: boolean;
  shouldReloadRecommendations: boolean;
  hasData: boolean;
  hasRecommendations: boolean;
  tilesByTab: (tabId: string) => SolvboxAITile[];
  tilesByCategory: (category: string) => SolvboxAITile[];
  categoriesForActiveTab: string[];
  tileCounts: Record<string, number>;
};

/**
 * Erstellt einen memoisieren Selektor
 * @param selector - Die Selektorfunktion
 * @returns Eine memoizierte Version des Selektors
 */
function createMemoizedSelector<R>(selector: (state: SolvboxaiState) => R) {
  const cache: SelectorCache<R> = {
    lastState: null,
    lastResult: null
  };
  
  return (state: SolvboxaiState): R => {
    // Bei erstem Aufruf oder wenn sich der State geändert hat
    if (cache.lastState !== state) {
      cache.lastResult = selector(state);
      cache.lastState = state;
    }
    
    return cache.lastResult as R;
  };
}

/**
 * Erstellt einen memoisieren Selektor mit zusätzlichem Parameter
 * @param selector - Die Selektorfunktion mit State und Parameter
 * @returns Eine memoizierte Version des Selektors
 */
function createParameterizedMemoizedSelector<P, R>(
  selector: (state: SolvboxaiState, param: P) => R
) {
  const cache = new Map<P, { state: SolvboxaiState; result: R }>();
  
  return (state: SolvboxaiState, param: P): R => {
    const cached = cache.get(param);
    
    // Cache-Hit nur wenn State und Parameter identisch sind
    if (cached && cached.state === state) {
      return cached.result;
    }
    
    // Cache-Miss: Berechne neu
    const result = selector(state, param);
    cache.set(param, { state, result });
    
    // Halte Cache-Größe unter Kontrolle (max 20 Einträge)
    if (cache.size > 20) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    return result;
  };
}

// Memoizierte Basisselektoren
export const selectActiveTab = createMemoizedSelector((state: SolvboxaiState): string => {
  return state.activeTab || DEFAULT_TAB_ID;
});

export const selectAllTiles = createMemoizedSelector((state: SolvboxaiState): SolvboxAITile[] => {
  return state.tiles || [];
});

export const selectRecommendations = createMemoizedSelector((state: SolvboxaiState): SolvboxAITile[] => {
  return state.recommendations || [];
});

export const selectTilesByTab = createParameterizedMemoizedSelector(
  (state: SolvboxaiState, tabId: string): SolvboxAITile[] => {
    return (state.tiles || []).filter((tile: SolvboxAITile) => tile.tabId === tabId);
  }
);

export const selectTilesByCategory = createParameterizedMemoizedSelector(
  (state: SolvboxaiState, category: string): SolvboxAITile[] => {
    const activeTab = selectActiveTab(state);
    const activeTiles = selectTilesByTab(state, activeTab);
    
    if (category === 'all' || !category) {
      return activeTiles;
    }
    
    return activeTiles.filter(tile => {
      // Prüfe sowohl aiCategory als auch category Felder
      const tileCategory: string = 
        typeof (tile as any).aiCategory === 'string' ? (tile as any).aiCategory : 
        typeof (tile as any).category === 'string' ? (tile as any).category : '';
      
      return tileCategory === category;
    });
  }
);

// Zusammengesetzte memoizierte Selektoren
export const selectActiveTiles = createMemoizedSelector((state: SolvboxaiState): SolvboxAITile[] => {
  const activeTab = selectActiveTab(state);
  return selectTilesByTab(state, activeTab);
});

export const selectCategoriesForActiveTab = createMemoizedSelector((state: SolvboxaiState): string[] => {
  const activeTiles = selectActiveTiles(state);
  const categories = new Set<string>();
  
  activeTiles.forEach(tile => {
    // Berücksichtige sowohl aiCategory als auch category Felder
    const category: string = 
      typeof (tile as any).aiCategory === 'string' ? (tile as any).aiCategory : 
      typeof (tile as any).category === 'string' ? (tile as any).category : '';
    
    if (category) {
      categories.add(category);
    }
  });
  
  return Array.from(categories).sort();
});

export const selectTileCounts = createMemoizedSelector((state: SolvboxaiState): Record<string, number> => {
  const allTiles = selectAllTiles(state);
  const counts: Record<string, number> = {};
  
  // Zähle Kacheln pro Tab
  allTiles.forEach(tile => {
    const tabId = tile.tabId;
    counts[tabId] = (counts[tabId] || 0) + 1;
  });
  
  return counts;
});

export const selectLastLoaded = createMemoizedSelector(
  (state: SolvboxaiState): string | undefined => {
    return state.lastLoaded;
  }
);

export const selectRecommendationsLoaded = createMemoizedSelector(
  (state: SolvboxaiState): string | undefined => {
    return state.recommendationsLoaded;
  }
);

export const selectShouldReloadTiles = createParameterizedMemoizedSelector(
  (state: SolvboxaiState, maxAgeMs: number = 60 * 60 * 1000): boolean => {
    if (!state.lastLoaded) return true;
    
    const lastLoaded = new Date(state.lastLoaded).getTime();
    const now = new Date().getTime();
    const age = now - lastLoaded;
    
    return age > maxAgeMs;
  }
);

export const selectShouldReloadRecommendations = createParameterizedMemoizedSelector(
  (state: SolvboxaiState, maxAgeMs: number = 24 * 60 * 60 * 1000): boolean => {
    if (!state.recommendationsLoaded) return true;
    
    const lastLoaded = new Date(state.recommendationsLoaded).getTime();
    const now = new Date().getTime();
    const age = now - lastLoaded;
    
    return age > maxAgeMs;
  }
);

export const selectHasData = createMemoizedSelector((state: SolvboxaiState): boolean => {
  return Boolean(state.tiles && state.tiles.length > 0);
});

export const selectHasRecommendations = createMemoizedSelector((state: SolvboxaiState): boolean => {
  return Boolean(state.recommendations && state.recommendations.length > 0);
});

// Stabile gebundene Selektoren
const boundSelectorsCache = new WeakMap<SolvboxaiState, BoundSelectors>();

/**
 * Erstellt ein Objekt mit allen Selektoren gebunden an den aktuellen Store-State
 * Die Funktion ist intern memoiziert, um stabile Referenzen zu gewährleisten
 * @param store - Der SolvboxAI-Store
 * @returns Ein Objekt mit allen Selektoren, vorgebunden an den übergebenen State
 */
export const createBoundSelectors = (store: SolvboxaiStore): BoundSelectors => {
  // Extrahiere den State aus dem Store
  const state: SolvboxaiState = {
    activeTab: store.activeTab,
    tiles: store.tiles,
    lastLoaded: store.lastLoaded,
    recommendations: store.recommendations,
    recommendationsLoaded: store.recommendationsLoaded, isLoading: store.isLoading || false, error: store.error || null
  };

  // Prüfe ob für diesen State bereits Selektoren erstellt wurden
  if (boundSelectorsCache.has(state)) {
    return boundSelectorsCache.get(state)!;
  }
  
  // Erstelle neue gebundene Selektoren
  const boundSelectors: BoundSelectors = {
    activeTab: selectActiveTab(state),
    allTiles: selectAllTiles(state),
    activeTiles: selectActiveTiles(state),
    recommendations: selectRecommendations(state),
    lastLoaded: selectLastLoaded(state),
    recommendationsLoaded: selectRecommendationsLoaded(state),
    shouldReloadTiles: selectShouldReloadTiles(state, 60 * 60 * 1000), // 1 Stunde
    shouldReloadRecommendations: selectShouldReloadRecommendations(state, 24 * 60 * 60 * 1000), // 24 Stunden
    hasData: selectHasData(state),
    hasRecommendations: selectHasRecommendations(state),
    categoriesForActiveTab: selectCategoriesForActiveTab(state),
    tileCounts: selectTileCounts(state),
    // Die parametrisierten Funktionen müssen stabil bleiben
    tilesByTab: (tabId: string) => selectTilesByTab(state, tabId),
    tilesByCategory: (category: string) => selectTilesByCategory(state, category)
  };
  
  // Cache das Ergebnis
  boundSelectorsCache.set(state, boundSelectors);
  
  return boundSelectors;
}; 