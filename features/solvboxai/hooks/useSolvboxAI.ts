import { useMemo, useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useSearch from '@/shared-hooks/useSearch';
import { useTabs } from '@/shared-hooks/useTabs';
import { logger } from '@/utils/logger';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';

import { getCategoriesForTabId, getDataForTabId, getTilesByCategory } from '../config/data';
import { TAB_IDS, createTabConfigs, DEFAULT_TAB_ID } from '../config/tabs';
import CaseStudiesTab from '../screens/CaseStudiesTab';
import GigsTab from '../screens/GigsTab';
import { SolvboxAIService } from '../services/SolvboxAIService';
import { SolvboxAITabId, UseSolvboxAIResult, SolvboxAITileData } from '../types';

/**
 * Hilfsfunktion zum Abrufen des SolvboxAIService aus der ServiceRegistry
 */
function getSolvboxAIService(): SolvboxAIService {
  try {
    return ServiceRegistry.getInstance().getService<SolvboxAIService>(ServiceType.FEATURE_SOLVBOX_AI);
  } catch (error) {
    logger.error('[useSolvboxAI] Fehler beim Abrufen des SolvboxAIService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new SolvboxAIService();
  }
}

/**
 * useSolvboxAI - Hook für SolvboxAI-Funktionalität
 *
 * Dieser Hook kapselt alle Tab-bezogenen Operationen für SolvboxAI und stellt
 * eine konsistente API für den SolvboxAIScreen bereit. Er kombiniert:
 * - Tab-Management (via useTabs)
 * - Suche (via useSearch)
 * - Store-Logik direkt integriert (kein externer Store erforderlich)
 * - Tab-Konfiguration und -Validierung
 * - Kategorie-Management
 * - Kachel-Interaktionen
 * @returns {UseSolvboxAIResult} Eine einheitliche API für SolvboxAI-Funktionalität
 */
export function useSolvboxAI(): UseSolvboxAIResult {
  const { t } = useTranslation();
  
  // Lokaler Zustand für Datenverwaltung und UI
  const [tiles, setTiles] = useState<SolvboxAITileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastLoaded, setLastLoaded] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // GOLDSTANDARD: Externer Tab-Zustand für konsistente Zustandsverwaltung
  // Analog zur MySolvbox-Implementierung
  const [activeTab, setActiveTabState] = useState<SolvboxAITabId>(DEFAULT_TAB_ID);
  
  // Tab-Komponenten-Map erstellen
  const tabComponents = useMemo(() => ({
    [TAB_IDS.GIGS]: GigsTab,
    [TAB_IDS.CASESTUDIES]: CaseStudiesTab
  }), []);
  
  // Tabs mit Übersetzungen und Komponenten erstellen
  const tabs = useMemo(() => createTabConfigs(t, tabComponents), [t, tabComponents]);
  
  // Funktion zur Validierung von Tab-IDs
  const isValidTabId = useCallback((tabId: string): tabId is SolvboxAITabId => {
    // Hole die Service-Instanz
    const solvboxAIService = getSolvboxAIService();
    return solvboxAIService.isTabIdValid(tabId);
  }, []);
  
  // Wrapper-Funktion für setActiveTab mit korrekter Typisierung
  const setActiveTab = useCallback((tabId: string) => {
    if (isValidTabId(tabId)) {
      setActiveTabState(tabId as SolvboxAITabId);
    } else {
      console.warn(`Ungültige Tab-ID: ${tabId}, verwende Fallback ${DEFAULT_TAB_ID}`);
      setActiveTabState(DEFAULT_TAB_ID);
    }
  }, [isValidTabId]);
  
  // Tab-Management via gemeinsamen Basis-Hook
  // GOLDSTANDARD: Übergebe hier den externen Tab-Zustand und seine Setter-Funktion
  // entsprechend der MySolvbox-Implementierung
  const { 
    activeTabId, 
    handleTabChange,
    tabs: configuredTabs 
  } = useTabs<SolvboxAITabId>({
    tabs,
    defaultTabId: DEFAULT_TAB_ID,
    activeTab, // Externer Tab-Zustand
    setActiveTab, // Setter-Funktion
    validateTabId: isValidTabId
  });
  
  console.log('useSolvboxAI: activeTab =', activeTab, 'activeTabId =', activeTabId);
  
  // Wrapper für die Tab-Änderungsfunktion
  // Konvertiert den Index in einen Tab-Typ oder lässt String-ID direkt durch
  const handleTabChangeWrapper = useCallback((index: string | number) => {
    if (typeof index === 'string') {
      // Wenn der Index schon eine Tab-ID ist
      setActiveTab(index as SolvboxAITabId);
    } else {
      // Wenn der Index numerisch ist, konvertiere ihn in eine Tab-ID
      setActiveTab(tabs[index]?.id as SolvboxAITabId || DEFAULT_TAB_ID);
    }
  }, [tabs, setActiveTab]);
  
  // Suche-Handler
  const handleSearchChange = useCallback((query: string) => {
    // Einfache Implementierung für die aktuelle Version
    console.log('SolvboxAI Suche:', query);
  }, []);
  
  // Suche via gemeinsamen Basis-Hook
  const { 
    searchQuery, 
    handleSearchChange: onSearchChange,
    setSearchQuery 
  } = useSearch({
    onQueryChange: handleSearchChange
  });
  
  // Lade Kacheln beim Mounten oder Tab-Wechsel
  useEffect(() => {
    // Kategorie zurücksetzen bei Tab-Wechsel
    setSelectedCategory(null);
    
    const loadTiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Hole die Service-Instanz
        const solvboxAIService = getSolvboxAIService();
        
        // Verwende den Service für Datenabruf
        const loadedTiles = await solvboxAIService.getDemoTilesForTab(activeTabId);
        setTiles(loadedTiles);
        setLastLoaded(new Date().toISOString());
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Fehler beim Laden der Daten'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTiles();
  }, [activeTabId]);
  
  // Handler für Kategorienwechsel
  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);
  
  // Handler für Klicks auf Kacheln
  const handleTilePress = useCallback((id: number) => {
    // Hole die Service-Instanz
    const solvboxAIService = getSolvboxAIService();
    
    solvboxAIService.markTileAsUsed(id)
      .then(() => console.log(`Kachel ${id} wurde als verwendet markiert`))
      .catch(err => console.error(`Fehler beim Markieren der Kachel ${id}:`, err));
  }, []);
  
  // Berechne gefilterte Kacheln basierend auf Tab und Kategorie
  const filteredTiles = useMemo(() => {
    if (selectedCategory) {
      return getTilesByCategory(activeTabId, selectedCategory);
    }
    return tiles.length > 0 ? tiles : getDataForTabId(activeTabId);
  }, [activeTabId, selectedCategory, tiles]);
  
  // Hole alle verfügbaren Kategorien für den aktuellen Tab
  const categories = useMemo(() => {
    return getCategoriesForTabId(activeTabId);
  }, [activeTabId]);
  
  // Funktion zum manuellen Aktualisieren der Daten
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Hole die Service-Instanz
      const solvboxAIService = getSolvboxAIService();
      
      const loadedTiles = await solvboxAIService.getDemoTilesForTab(activeTabId);
      setTiles(loadedTiles);
      setLastLoaded(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Fehler beim Aktualisieren'));
    } finally {
      setIsLoading(false);
    }
    
    return Promise.resolve();
  }, [activeTabId]);
  
  // Data-Objekt für erweiterte Informationen
  const data = useMemo(() => ({
    lastLoaded,
    allTiles: tiles
  }), [lastLoaded, tiles]);
  
  // Hauptergebnis mit der API für den SolvboxAI-Screen
  const result: UseSolvboxAIResult = {
    activeTab: activeTabId,
    setActiveTab: handleTabChange,
    activeTabId, // Alias für Kompatibilität
    handleTabChange: handleTabChangeWrapper,
    handleSwipeEnd: handleTabChangeWrapper, // Verwende die gleiche Funktion für Swipe-Ende
    tabs: configuredTabs,
    
    // Suche
    searchTerm: searchQuery,
    onSearchChange,
    handleSearchChange: onSearchChange, // Alias für Kompatibilität
    onSearchClear: () => setSearchQuery(''),
    
    // Kategorien
    selectedCategory,
    onCategoryChange: handleCategoryChange,
    
    // Weitere Eigenschaften
    isLoading,
    isError: Boolean(error),
    error,
    filteredTiles,
    refresh,
  };
  
  return result;
}

// Re-exportiere die Typen aus der types/index.ts für einfacheren Zugriff
export type { SolvboxAITabId }; 