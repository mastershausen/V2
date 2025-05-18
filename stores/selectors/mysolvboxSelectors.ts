/**
 * mysolvboxSelectors - Selektoren für den MySolvbox-Store
 * 
 * Diese Selektoren kapseln die Logik zum Abrufen und Transformieren von Daten aus dem
 * mysolvboxStore. Durch die Verwendung von Selektoren wird die Zugrifflogik zentralisiert
 * und wiederverwendbar gemacht.
 * 
 * Alle Selektoren sind memoiziert, um unnötige Neuberechnungen zu vermeiden.
 */

import { DEFAULT_TAB_ID } from '@/features/mysolvbox/config/tabs';
import { MySolvboxTabId } from '@/features/mysolvbox/types';
import { MySolvboxTile } from '@/types/tiles';

import { MySolvboxState, MySolvboxStore } from '../types/mysolvboxTypes';

// Einfache Memo-Implementierung für Selektoren
type SelectorCache<T> = {
  lastState: MySolvboxState | null;
  lastResult: T | null;
};

// Typdefinitionen für die Rückgabewerte von Selektoren
type BoundSelectors = {
  activeTab: string;
  allTiles: MySolvboxTile[];
  activeTiles: MySolvboxTile[];
  lastLoaded: string | undefined;
  shouldReloadTiles: boolean;
  hasData: boolean;
  tilesByTab: (tabId: string) => MySolvboxTile[];
};

/**
 * Erstellt einen memoisieren Selektor
 * @param selector - Die Selektorfunktion
 * @returns Eine memoizierte Version des Selektors
 */
function createMemoizedSelector<R>(selector: (state: MySolvboxState) => R) {
  const cache: SelectorCache<R> = {
    lastState: null,
    lastResult: null
  };
  
  return (state: MySolvboxState): R => {
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
  selector: (state: MySolvboxState, param: P) => R
) {
  const cache = new Map<P, { state: MySolvboxState; result: R }>();
  
  return (state: MySolvboxState, param: P): R => {
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
export const selectActiveTab = createMemoizedSelector((state: MySolvboxState): string => {
  return state.activeTab || DEFAULT_TAB_ID;
});

export const selectAllTiles = createMemoizedSelector((state: MySolvboxState): MySolvboxTile[] => {
  return state.tiles || [];
});

export const selectTilesByTab = createParameterizedMemoizedSelector(
  (state: MySolvboxState, tabId: string): MySolvboxTile[] => {
    return (state.tiles || []).filter(tile => tile.tabId === tabId);
  }
);

// Zusammengesetzte memoizierte Selektoren
export const selectActiveTiles = createMemoizedSelector((state: MySolvboxState): MySolvboxTile[] => {
  const activeTab = selectActiveTab(state);
  return selectTilesByTab(state, activeTab);
});

export const selectLastLoaded = createMemoizedSelector(
  (state: MySolvboxState): string | undefined => {
    return state.lastLoaded;
  }
);

export const selectShouldReloadTiles = createParameterizedMemoizedSelector(
  (state: MySolvboxState, maxAgeMs: number = 5 * 60 * 1000): boolean => {
    if (!state.lastLoaded) return true;
    
    const lastLoaded = new Date(state.lastLoaded).getTime();
    const now = new Date().getTime();
    const age = now - lastLoaded;
    
    return age > maxAgeMs;
  }
);

export const selectHasData = createMemoizedSelector((state: MySolvboxState): boolean => {
  return Boolean(state.tiles && state.tiles.length > 0);
});

// Stabile gebundene Selektoren
const boundSelectorsCache = new WeakMap<MySolvboxState, BoundSelectors>();

/**
 * Erstellt ein Objekt mit allen Selektoren gebunden an den aktuellen Store-State
 * Die Funktion ist intern memoiziert, um stabile Referenzen zu gewährleisten
 * @param state - Der MySolvbox-State
 * @returns Ein Objekt mit allen Selektoren, vorgebunden an den übergebenen State
 */
export const createBoundSelectors = (state: MySolvboxState): BoundSelectors => {
  // Prüfe ob für diesen State bereits Selektoren erstellt wurden
  if (boundSelectorsCache.has(state)) {
    return boundSelectorsCache.get(state)!;
  }
  
  // Erstelle neue gebundene Selektoren
  const boundSelectors: BoundSelectors = {
    activeTab: selectActiveTab(state),
    allTiles: selectAllTiles(state),
    activeTiles: selectActiveTiles(state),
    lastLoaded: selectLastLoaded(state),
    shouldReloadTiles: selectShouldReloadTiles(state, 5 * 60 * 1000),
    hasData: selectHasData(state),
    // Die tilesByTab-Funktion muss stabil bleiben
    tilesByTab: (tabId: string) => selectTilesByTab(state, tabId)
  };
  
  // Cache das Ergebnis
  boundSelectorsCache.set(state, boundSelectors);
  
  return boundSelectors;
}; 