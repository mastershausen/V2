import { getBonusTileData } from '../config/data';
import { BonusTileData, BaseTabHookResult } from '../types';
import { createTabHook } from '../utils/tabUtils';

/**
 * Hook für die Geschäftslogik des BonusTab
 *
 * Verwendet die Hook-Factory, um einen spezialisierten Tab-Hook zu erstellen,
 * ohne komplexe Delegationsmuster zu benötigen. Das vereinfacht den Code
 * und macht ihn leichter verständlich.
 * @returns Alle notwendigen Daten und Funktionen für den BonusTab
 */
export const useBonusTab = createTabHook<BonusTileData>({
  tabId: 'bonus',
  fetchData: getBonusTileData,
  errorMessage: 'Fehler beim Laden der Bonusdaten',
}); 