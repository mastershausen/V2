import { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { createLogger } from '@/utils/logger';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';

import { SolvboxAIService } from '../services/SolvboxAIService';
import { GigTileData } from '../types';

// Erstelle einen spezialisierten Logger für diesen Hook
const logger = createLogger({ prefix: '🧩 useGigsTab' });

/**
 * Hilfsfunktion zum Abrufen des SolvboxAIService aus der ServiceRegistry
 */
function getSolvboxAIService(): SolvboxAIService {
  try {
    return ServiceRegistry.getInstance().getService<SolvboxAIService>(ServiceType.FEATURE_SOLVBOX_AI);
  } catch (error) {
    logger.error('[useGigsTab] Fehler beim Abrufen des SolvboxAIService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new SolvboxAIService();
  }
}

/**
 * Hook für die Geschäftslogik des GigsTab
 * Verwaltet das Laden, Filtern und die Interaktion mit Gig-Daten
 * @returns Objekt mit Gig-Daten und Hilfsfunktionen
 */
export function useGigsTab() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [gigs, setGigs] = useState<GigTileData[]>([]);
  const [filteredTiles, setFilteredTiles] = useState<GigTileData[]>([]);

  /**
   * Lädt die Gig-Daten vom API-Service
   */
  const loadGigs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      logger.debug('Lade Gigs...');
      
      // Hole die Service-Instanz
      const solvboxAIService = getSolvboxAIService();
      
      // Holt die Daten über den Service
      const data = solvboxAIService.getDemoTilesForTab('gigs');
      
      // Typumwandlung, da wir wissen, dass der Service mit den richtigen Daten antwortet
      const typedData = data.filter(item => item.type === 'gig') as GigTileData[];
      
      setGigs(typedData);
      setFilteredTiles(typedData);
      logger.debug(`${typedData.length} Gigs geladen`);
    } catch (err) {
      logger.error('Fehler beim Laden der Gigs:', err instanceof Error ? err : String(err));
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Aktualisiert die Gig-Daten
   */
  const refreshGigs = useCallback(async () => {
    await loadGigs();
  }, [loadGigs]);

  /**
   * Verarbeitet den Klick auf eine Gig-Kachel
   * @param id ID des angeklickten Gigs
   */
  const handleTilePress = useCallback((id: number) => {
    logger.debug(`Gig-Kachel angeklickt: ${id}`);
    // TODO: Navigation zu Gig-Details implementieren
    
    // Hole die Service-Instanz
    const solvboxAIService = getSolvboxAIService();
    
    // Optional: Verwendung registrieren (wenn unterstützt)
    try {
      solvboxAIService.markTileAsUsed(id).catch(e => logger.error('Fehler beim Markieren des Tiles:', e));
    } catch (err) {
      logger.error('Fehler beim Verarbeiten des Klicks:', err instanceof Error ? err : String(err));
    }
  }, []);

  // Beim ersten Render die Daten laden
  useEffect(() => {
    loadGigs();
  }, [loadGigs]);

  return {
    isLoading,
    error,
    gigs,
    filteredTiles,
    handleTilePress,
    refreshGigs
  };
} 