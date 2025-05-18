import { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { createLogger } from '@/utils/logger';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';

import { SolvboxAIService } from '../services/SolvboxAIService';
import { CaseStudyTileData } from '../types';

// Erstelle einen spezialisierten Logger für diesen Hook
const logger = createLogger({ prefix: '🧩 useCaseStudiesTab' });

/**
 * Hilfsfunktion zum Abrufen des SolvboxAIService aus der ServiceRegistry
 */
function getSolvboxAIService(): SolvboxAIService {
  try {
    return ServiceRegistry.getInstance().getService<SolvboxAIService>(ServiceType.FEATURE_SOLVBOX_AI);
  } catch (error) {
    logger.error('[useCaseStudiesTab] Fehler beim Abrufen des SolvboxAIService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new SolvboxAIService();
  }
}

/**
 * Hook für die Geschäftslogik des CaseStudiesTab
 * Verwaltet das Laden, Filtern und die Interaktion mit Fallstudien-Daten
 * @returns Objekt mit Fallstudien-Daten und Hilfsfunktionen
 */
export function useCaseStudiesTab() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudyTileData[]>([]);
  const [filteredTiles, setFilteredTiles] = useState<CaseStudyTileData[]>([]);

  /**
   * Lädt die Fallstudien-Daten vom API-Service
   */
  const loadCaseStudies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      logger.debug('Lade Fallstudien...');
      
      // Hole die Service-Instanz
      const solvboxAIService = getSolvboxAIService();
      
      // Demo-Implementierung: Verwende die vorhandene Methode aus dem Service
      const data = solvboxAIService.getDemoTilesForTab('casestudies');
      
      // Typumwandlung, da wir wissen, dass der Service mit den richtigen Daten antwortet
      const typedData = data.filter(item => item.type === 'casestudy') as CaseStudyTileData[];
      
      setCaseStudies(typedData);
      setFilteredTiles(typedData);
      logger.debug(`${typedData.length} Fallstudien geladen`);
    } catch (err) {
      logger.error('Fehler beim Laden der Fallstudien:', err instanceof Error ? err : String(err));
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Aktualisiert die Fallstudien-Daten
   */
  const refreshCaseStudies = useCallback(async () => {
    await loadCaseStudies();
  }, [loadCaseStudies]);

  /**
   * Verarbeitet den Klick auf eine Fallstudien-Kachel
   * @param id ID der angeklickten Fallstudie
   */
  const handleTilePress = useCallback((id: number) => {
    logger.debug(`Fallstudien-Kachel angeklickt: ${id}`);
    // TODO: Navigation zu Fallstudien-Details implementieren
    
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
    loadCaseStudies();
  }, [loadCaseStudies]);

  return {
    isLoading,
    error,
    caseStudies,
    filteredTiles,
    handleTilePress,
    refreshCaseStudies
  };
} 