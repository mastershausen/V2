/**
 * MySolvbox Utils
 * 
 * Zentrale Exportdatei für alle Utility-Funktionen des MySolvbox-Features.
 * Hier werden alle öffentlichen Funktionen aus den verschiedenen Utility-Dateien
 * reexportiert, um einen einfachen Zugriff zu ermöglichen.
 */

// Re-export der Factory-Funktion aus tabUtils.ts
export {
  createTabHook,
  useTabDataLoader,
  useTabTileHandler
} from './tabUtils';

// Re-export aller ID-Verwaltungsfunktionen aus tileIds.ts
export {
  toNumericId,
  toStringId,
  isValidId,
  isValidMySolvboxTileId,
  generateUniqueId,
  getTabTypeFromId,
  getTileTypeFromId,
  toTileGridId,
  extractIds,
  createTileIdMap,
  findTileById,
  type TileId
} from './tileIds';

export * from './common'; 