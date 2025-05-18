import { useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { UseTabScreenResult } from '@/shared-hooks/types';
import useSearch from '@/shared-hooks/useSearch';
import { useTabs } from '@/shared-hooks/useTabs';
import { useMysolvboxStore } from '@/stores/mysolvboxStore';
import { createBoundSelectors } from '@/stores/selectors/mysolvboxSelectors';
import { logger } from '@/utils/logger';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';

import { createTabConfigs, DEFAULT_TAB_ID } from '../config/tabs';
import { BonusTab } from '../screens/BonusTab';
import { ForesightTab } from '../screens/ForesightTab';
import { GrowTab } from '../screens/GrowTab';
import { SaveTab } from '../screens/SaveTab';
import { MySolvboxService } from '../services/MySolvboxService';
import { MySolvboxTabConfig, MySolvboxTabId } from '../types';

/**
 * Hilfsfunktion zum Abrufen des MySolvboxService aus der ServiceRegistry
 */
function getMySolvboxService(): MySolvboxService {
  try {
    return ServiceRegistry.getInstance().getService<MySolvboxService>(ServiceType.MYSOLVBOX);
  } catch (error) {
    logger.error('[useMySolvbox] Fehler beim Abrufen des MySolvboxService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new MySolvboxService();
  }
}

/**
 * MySolvbox Hook - Zentraler Hook für MySolvbox-Funktionalität
 */

/**
 * useMySolvbox - Hook für MySolvbox-Funktionalität
 *
 * Dieser Hook kapselt alle Tab-bezogenen Operationen für MySolvbox und stellt
 * eine konsistente API für den MySolvboxScreen bereit. Er kombiniert:
 * - Tab-Management (via useTabs)
 * - Suche (via useSearch)
 * - Store-Zugriff (via useMysolvboxStore)
 * - Tab-Konfiguration und -Validierung
 *
 * Anwendungsbeispiel:
 * ```tsx
 * const { tabs, activeTabId, handleTabChange, searchQuery, handleSearchChange } = useMySolvbox();
 * ```
 * @returns {UseTabScreenResult<MySolvboxTabId>} Eine einheitliche API für MySolvbox-Funktionalität
 */
export function useMySolvbox(): UseTabScreenResult<MySolvboxTabId> {
  const { t } = useTranslation();
  
  // Tab-Komponenten für die Konfiguration
  const tabComponents = useMemo(() => ({
    save: SaveTab,
    grow: GrowTab,
    foresight: ForesightTab,
    bonus: BonusTab
  }), []);
  
  // Stabile Tab-Konfiguration mit übersetzten Labels aus der zentralen Konfiguration
  const MYSOLVBOX_TABS = useMemo<MySolvboxTabConfig[]>(() => 
    createTabConfigs(t, tabComponents)
  , [t, tabComponents]);
  
  // Zugriff auf den MySolvbox-Store mit Selektoren
  const store = useMysolvboxStore();
  
  // Selektoren memoizieren, um stabile Referenzen zu gewährleisten
  const selectors = useMemo(() => createBoundSelectors(store), [store]);
  
  // Zugriff auf Store-Aktionen (Referenzen bleiben stabil dank Zustand)
  const { setActiveTab, loadTabTiles } = store;
  
  // Tab-Validierung durch den Service (memoiziert für stabile Referenz)
  const validateTabId = useCallback((tabId: string): tabId is MySolvboxTabId => {
    // Hole die Service-Instanz
    const mysolvboxService = getMySolvboxService();
    return mysolvboxService.isValidTabId(tabId, MYSOLVBOX_TABS);
  }, [MYSOLVBOX_TABS]);
  
  // Tab-Management via gemeinsamen Basis-Hook
  const tabManagement = useTabs<MySolvboxTabId>({
    tabs: MYSOLVBOX_TABS,
    defaultTabId: DEFAULT_TAB_ID,
    activeTab: selectors.activeTab,
    setActiveTab,
    validateTabId
  });
  
  // Suche-Handler memoizieren für stabile Referenz
  const handleSearchChange = useCallback((query: string) => {
    // Hier könnte später die Suche implementiert werden
    console.log('MySolvbox Suche:', query);
  }, []);
  
  // Suche via gemeinsamen Basis-Hook
  const searchManagement = useSearch({
    onQueryChange: handleSearchChange
  });
  
  // Kacheln automatisch bei Tab-Wechsel laden, wenn Daten veraltet sind
  useEffect(() => {
    if (selectors.shouldReloadTiles) {
      loadTabTiles();
    }
  }, [selectors.activeTab, selectors.shouldReloadTiles, loadTabTiles]);
  
  // Memoiziertes Ergebnisobjekt für stabile API
  const result = useMemo(() => ({
    ...tabManagement,
    ...searchManagement,
    // Lade- und Fehlerzustand aus dem Store
    isLoading: store.isLoading,
    isError: Boolean(store.error),
    error: store.error ? new Error(store.error) : null,
    // Kacheldaten über Selektoren
    data: {
      tiles: selectors.activeTiles,
      allTiles: selectors.allTiles,
      lastLoaded: selectors.lastLoaded
    }
  }), [
    tabManagement,
    searchManagement,
    store.isLoading,
    store.error,
    selectors.activeTiles,
    selectors.allTiles,
    selectors.lastLoaded
  ]);
  
  return result;
}

// Re-exportiere die Typen aus der types/index.ts für einfacheren Zugriff
export type { MySolvboxTabId }; 