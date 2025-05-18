/**
 * Zentrale Konfiguration für MySolvbox Tile-IDs
 * 
 * Diese Datei definiert die ID-Bereiche für verschiedene Kacheltypen und stellt
 * Hilfsfunktionen zur Validierung und Typbestimmung bereit.
 */

import { MySolvboxTabId } from '../types';
import { TAB_IDS } from './tabs';

/**
 * Definition der ID-Bereiche für verschiedene Kacheltypen
 */
export const ID_RANGES = {
  MYSOLVBOX: {
    [TAB_IDS.SAVE]: {
      START: 1000,
      END: 1999
    },
    [TAB_IDS.GROW]: {
      START: 2000,
      END: 2999
    },
    [TAB_IDS.FORESIGHT]: {
      START: 3000,
      END: 3999
    },
    [TAB_IDS.BONUS]: {
      START: 4000,
      END: 4999
    }
  }
};

/**
 * Prüft, ob eine gegebene ID eine gültige MySolvbox-Kachel-ID ist
 * @param id Die zu prüfende ID
 * @returns true, wenn die ID eine gültige MySolvbox-Kachel-ID ist
 */
export function isValidMySolvboxTileId(id: number): boolean {
  return (
    (id >= ID_RANGES.MYSOLVBOX[TAB_IDS.SAVE].START && id <= ID_RANGES.MYSOLVBOX[TAB_IDS.SAVE].END) ||
    (id >= ID_RANGES.MYSOLVBOX[TAB_IDS.GROW].START && id <= ID_RANGES.MYSOLVBOX[TAB_IDS.GROW].END) ||
    (id >= ID_RANGES.MYSOLVBOX[TAB_IDS.FORESIGHT].START && id <= ID_RANGES.MYSOLVBOX[TAB_IDS.FORESIGHT].END) ||
    (id >= ID_RANGES.MYSOLVBOX[TAB_IDS.BONUS].START && id <= ID_RANGES.MYSOLVBOX[TAB_IDS.BONUS].END)
  );
}

/**
 * Bestimmt den Kacheltyp basierend auf der ID
 * @param id Die Kachel-ID
 * @returns Der Kacheltyp oder undefined, wenn die ID ungültig ist
 */
export function getTileTypeFromId(id: number): MySolvboxTabId | undefined {
  if (id >= ID_RANGES.MYSOLVBOX[TAB_IDS.SAVE].START && id <= ID_RANGES.MYSOLVBOX[TAB_IDS.SAVE].END) {
    return TAB_IDS.SAVE;
  } else if (id >= ID_RANGES.MYSOLVBOX[TAB_IDS.GROW].START && id <= ID_RANGES.MYSOLVBOX[TAB_IDS.GROW].END) {
    return TAB_IDS.GROW;
  } else if (id >= ID_RANGES.MYSOLVBOX[TAB_IDS.FORESIGHT].START && id <= ID_RANGES.MYSOLVBOX[TAB_IDS.FORESIGHT].END) {
    return TAB_IDS.FORESIGHT;
  } else if (id >= ID_RANGES.MYSOLVBOX[TAB_IDS.BONUS].START && id <= ID_RANGES.MYSOLVBOX[TAB_IDS.BONUS].END) {
    return TAB_IDS.BONUS;
  }
  return undefined;
} 