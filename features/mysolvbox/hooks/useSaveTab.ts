import { getSaveTileData } from '../config/data';
import { SaveTileData, BaseTabHookResult } from '../types';
import { createTabHook } from '../utils/tabUtils';

/**
 * Hook für die Geschäftslogik des SaveTab
 *
 * Verwendet die Hook-Factory, um einen spezialisierten Tab-Hook zu erstellen,
 * ohne komplexe Delegationsmuster zu benötigen. Das vereinfacht den Code
 * und macht ihn leichter verständlich.
 * @returns Alle notwendigen Daten und Funktionen für den SaveTab
 */
export const useSaveTab = createTabHook<SaveTileData>({
  tabId: 'save',
  fetchData: getSaveTileData,
  errorMessage: 'Fehler beim Laden der Spardaten',
}); 