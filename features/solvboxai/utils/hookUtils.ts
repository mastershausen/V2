/**
 * hookUtils - Hilfsfunktionen für Tab-Hooks
 * 
 * Diese Datei enthält modulare Hilfsfunktionen für die Erstellung und Verwendung
 * von React-Hooks in der SolvboxAI-Komponente.
 */

import {useEffect, useCallback} from 'react';

import { getFeatureSolvboxAIService } from '@/utils/service/serviceHelper';

import { SolvboxAITabId, SolvboxAITileData } from '../types';
import { filterTilesByCategory } from './categoryUtils';


/**
 * Konfiguration für den Daten-Loader
 */
export interface TabDataLoaderConfig<T extends SolvboxAITileData> {
  /**
   * Funktion zum Abrufen der Daten
   */
  fetchData: () => T[];
  
  /**
   * Funktion zum Setzen der Kacheln
   */
  setTiles: (tiles: T[]) => void;
  
  /**
   * Funktion zum Setzen des Ladezustands
   */
  setIsLoading: (isLoading: boolean) => void;
  
  /**
   * Funktion zum Setzen eines Fehlers
   */
  setError: (error: Error | any | null) => void;
  
  /**
   * Fehlermeldung im Falle eines Fehlers
   */
  errorMessage: string;
  
  /**
   * Die ID des Tabs
   */
  tabId: SolvboxAITabId;
}

/**
 * Hook zum Laden von Tab-Daten
 * 
 * Diese Funktion extrahiert die Logik zum Laden von Tab-Daten in eine eigenständige,
 * wiederverwendbare Funktion, die in verschiedenen Tab-Hooks verwendet werden kann.
 * @param config Konfiguration mit allen notwendigen Parametern
 * @param config.fetchData
 * @param config.setTiles
 * @param config.setIsLoading
 * @param config.setError
 * @param config.errorMessage
 * @param config.tabId
 */
export function useTabDataLoader<T extends SolvboxAITileData>({
  fetchData,
  setTiles,
  setIsLoading,
  setError,
  errorMessage,
  tabId
}: TabDataLoaderConfig<T>): void {
  useEffect(() => {
    console.log(`useTabDataLoader für Tab "${tabId}" wird ausgeführt`);
    
    // Setze erstmal den Ladestatus
    setIsLoading(true);
    setError(null);
    
    try {
      // Sicherstellen, dass fetchData eine Funktion ist
      if (typeof fetchData !== 'function') {
        throw new Error('fetchData muss eine Funktion sein');
      }

      console.log(`fetchData für Tab "${tabId}" wird aufgerufen`);
      
      // fetchData aufrufen und das Ergebnis speichern
      const data = fetchData();
      
      console.log(`Daten für Tab "${tabId}" erhalten:`, {
        istArray: Array.isArray(data),
        anzahlElemente: Array.isArray(data) ? data.length : 0,
        datentyp: typeof data
      });
      
      // Sicherstellen, dass data ein Array ist
      if (!Array.isArray(data)) {
        throw new Error('Geladene Daten müssen ein Array sein');
      }
      
      // Bei Erfolg setze die Daten und beende den Ladevorgang
      setTiles(data);
      setIsLoading(false);
    } 
    catch (error) {
      // Bei Fehler setze den Fehlerzustand und beende den Ladevorgang
      console.error(`Fehler beim Laden der ${tabId}-Daten:`, error);
      setError(error);
      setIsLoading(false);
    }
  }, [fetchData, errorMessage, tabId, setTiles, setIsLoading, setError]);
}

/**
 * Hook zum Erstellen eines Tab-Tile-Handlers
 * 
 * Diese Funktion erstellt einen Handler für Kachel-Klicks basierend auf der Tab-ID.
 * @param tabId ID des Tabs
 * @param customHandler Optionaler benutzerdefinierter Handler
 * @returns Callback-Funktion für Kachel-Klicks
 */
export function useTabTileHandler(tabId: SolvboxAITabId, customHandler?: (tileId: number) => void) {
  return useCallback(async (tileId: number) => {
    // Wenn ein benutzerdefinierter Handler bereitgestellt wurde, verwende diesen
    if (customHandler) {
      customHandler(tileId);
      return;
    }
    
    try {
      // Hole die Service-Instanz
      const solvboxAIService = getFeatureSolvboxAIService();
      
      // Markiere die Kachel als verwendet
      await solvboxAIService.markTileAsUsed(tileId);
      
      // Log-Ausgabe für Entwicklungszwecke
      console.log(`${tabId} Tile pressed and tracked: ${tileId}`);
    } catch (error) {
      // Fehler werden hier abgefangen, damit sie nicht die UI beeinträchtigen
      console.error(`Fehler beim Verarbeiten des Klicks auf Kachel ${tileId}:`, error);
    }
  }, [tabId, customHandler]);
}

/**
 * Hook zum Filtern von Kacheln nach Kategorie
 * 
 * Diese Funktion filtert Kacheln basierend auf einer ausgewählten Kategorie.
 * @param tiles Array der zu filternden Kacheln
 * @param selectedCategory Ausgewählte Kategorie oder null für alle Kacheln
 * @returns Callback-Funktion, die gefilterte Kacheln zurückgibt
 */
export function useTabCategoryFilter<T extends SolvboxAITileData>(
  tiles: T[],
  selectedCategory: string | null
) {
  return useCallback(() => {
    return filterTilesByCategory(tiles, selectedCategory);
  }, [tiles, selectedCategory]);
} 