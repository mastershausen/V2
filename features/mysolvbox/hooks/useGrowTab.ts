import { getGrowTileData } from '../config/data';
import { GrowTileData, BaseTabHookResult } from '../types';
import { createTabHook } from '../utils/tabUtils';

/**
 * Hook für die Geschäftslogik des GrowTab
 *
 * Verwendet die Hook-Factory, um einen spezialisierten Tab-Hook zu erstellen,
 * ohne komplexe Delegationsmuster zu benötigen. Das vereinfacht den Code
 * und macht ihn leichter verständlich.
 * @returns Alle notwendigen Daten und Funktionen für den GrowTab
 */
export const useGrowTab = createTabHook<GrowTileData>({
  tabId: 'grow',
  fetchData: getGrowTileData,
  errorMessage: 'Fehler beim Laden der Wachstumsdaten',
}); 