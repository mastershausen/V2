/**
 * SolvboxAI Utils
 * 
 * Zentrale Exportdatei für alle Utility-Funktionen des SolvboxAI-Features.
 * Hier werden alle öffentlichen Funktionen aus den verschiedenen Utility-Dateien
 * reexportiert, um einen einfachen Zugriff zu ermöglichen.
 */

// Re-export aller Funktionen aus categoryUtils.ts
export {
  getCategoriesForTiles,
  filterTilesByCategory
} from './categoryUtils';

// Re-export aller Funktionen aus hookUtils.ts
export {
  useTabDataLoader,
  useTabTileHandler,
  useTabCategoryFilter,
  type TabDataLoaderConfig
} from './hookUtils';

// Re-export der Factory-Funktion aus tabUtils.ts
export {
  createTabHook
} from './tabUtils';

// Re-export aller ID-Verwaltungsfunktionen aus tileIds.ts
export {
  toNumericId,
  toStringId,
  isValidId,
  generateUniqueId,
  getTabTypeFromId,
  toTileGridId,
  extractIds,
  createTileIdMap,
  findTileById,
  type TileId
} from './tileIds';

// Re-export aller Funktionen aus common.ts
export {
  delay,
  formatDate,
  generateRandomId,
  truncateText
} from './common'; 