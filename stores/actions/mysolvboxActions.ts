/**
 * mysolvboxActions - Aktionen für den mysolvboxStore
 * 
 * Diese Aktionen kapseln alle Store-Updates und stellen einheitliche
 * Transformationen für die Daten sicher. Jede Aktion validiert die
 * Eingabedaten und stellt sicher, dass nur gültige Daten im Store landen.
 */

import { MySolvboxService } from '@/features/mysolvbox/services/MySolvboxService';
import { MySolvboxTile } from '@/types/tiles';
import { logger } from '@/utils/logger';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';

import { MySolvboxState } from '../types/mysolvboxTypes';

// Typen für die Aktionsfunktionen
type SetFunction = (fn: (state: MySolvboxState) => Partial<MySolvboxState>) => void;
type GetFunction = () => MySolvboxState;

/**
 * Hilfsfunktion zum Abrufen des MySolvboxService aus der ServiceRegistry
 */
function getMySolvboxService(): MySolvboxService {
  try {
    return ServiceRegistry.getInstance().getService<MySolvboxService>(ServiceType.MYSOLVBOX);
  } catch (error) {
    logger.error('[mysolvboxActions] Fehler beim Abrufen des MySolvboxService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new MySolvboxService();
  }
}

/**
 * Erstellt die Aktionen für den mysolvboxStore
 * @param set - Die Set-Funktion des Stores
 * @param get - Die Get-Funktion des Stores
 * @returns Ein Objekt mit allen Aktionen für den Store
 */
export const createMySolvboxActions = (set: SetFunction, get: GetFunction) => ({
  /**
   * Aktiven Tab setzen mit Validierung
   * @param tab - Die zu setzende Tab-ID
   */
  setActiveTab: (tab: string) => {
    // Hole die Service-Instanz
    const mysolvboxService = getMySolvboxService();
    
    // Validiere den Tab-Namen, bevor er gesetzt wird
    if (mysolvboxService.isTabIdValid(tab)) {
      set((state) => ({ 
        activeTab: tab 
      }));
      logger.info('MySolvbox: Aktiver Tab geändert auf', tab);
    } else {
      // Bei ungültigem Tab eine Warnung ausgeben, aber den Store nicht ändern
      logger.warn(`MySolvbox: Ungültiger Tab-Name: ${tab}`);
    }
  },
  
  /**
   * Lädt Kacheln für den aktiven Tab
   * @param forceRefresh - Erzwingt das Neuladen der Daten
   * @returns Promise, das nach dem Laden der Daten aufgelöst wird
   */
  loadTabTiles: async (forceRefresh = false) => {
    const activeTab = get().activeTab;
    // Hole die Service-Instanz
    const mysolvboxService = getMySolvboxService();
    
    try {
      // Status-Tracking für Lade-Indikator
      set((state) => ({
        isLoading: true,
        error: null
      }));
      
      // Kacheln laden
      const tiles = await mysolvboxService.getTilesForTab(activeTab, forceRefresh);
      
      // Validiere die Kacheln (Basisdaten überprüfen)
      const validatedTiles = validateTiles(tiles);
      
      // Erfolgreiches Laden im Store speichern
      set((state) => ({
        tiles: validatedTiles,
        lastLoaded: new Date().toISOString(),
        isLoading: false
      }));
      
      logger.info(`MySolvbox: ${validatedTiles.length} Kacheln für Tab ${activeTab} geladen`);
      
    } catch (error) {
      // Fehlerfall im Store speichern
      set((state) => ({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden der Kacheln'
      }));
      
      logger.error('MySolvbox: Fehler beim Laden der Kacheln:', error instanceof Error ? error : String(error));
    }
  },
  
  /**
   * Ruft alle verfügbaren Tabs ab
   * @returns Array mit Tab-Konfigurationen
   */
  // Diese Methode könnte angepasst oder entfernt werden, da Tabs jetzt 
  // typischerweise über den useMySolvbox-Hook verwaltet werden
  resetLoadingState: () => {
    set((state) => ({
      isLoading: false,
      error: null
    }));
  },
  
  /**
   * Setzt den Fehler-Status manuell zurück
   */
  clearError: () => {
    set((state) => ({
      error: null
    }));
  }
});

/**
 * Validiert die Kacheln vor dem Speichern im Store
 * @param tiles - Die zu validierenden Kacheln
 * @returns Ein Array validierter Kacheln
 */
const validateTiles = (tiles: MySolvboxTile[]): MySolvboxTile[] => {
  return tiles.filter(tile => {
    // Prüfe, ob alle Pflichtfelder vorhanden sind
    const isValid = Boolean(
      tile.id && 
      tile.title && 
      tile.tabId
    );
    
    if (!isValid) {
      logger.warn('MySolvbox: Ungültige Kachel gefiltert:', tile);
    }
    
    return isValid;
  }).map(tile => ({
    // Stelle sicher, dass alle Felder den erwarteten Typ haben
    ...tile,
    id: Number(tile.id), // Erzwinge Number-Typ
    sortOrder: tile.sortOrder ? Number(tile.sortOrder) : undefined,
    isActive: Boolean(tile.isActive)
  }));
}; 