/**
 * useTabScreen Hook
 * 
 * Ein Hook für die Verwaltung von Tabs in Bildschirmen, die mehrere Tabs anzeigen.
 * Behandelt Zustandsverwaltung und Tab-Wechsel.
 */
import { useState, useMemo, useCallback } from 'react';

// Generische Typen für die Tab-Konfiguration
export interface TabConfig<T extends string = string> {
  id: T;
  label: string;
}

// Optionen für den useTabScreen Hook
export interface UseTabScreenOptions<T extends string = string> {
  initialTabId?: T;
  tabs: TabConfig<T>[];
}

// Ergebnis des useTabScreen Hooks
export interface UseTabScreenResult<T extends string = string> {
  tabs: TabConfig<T>[];
  activeTabId: T;
  handleTabChange: (tabId: T) => void;
}

/**
 * useTabScreen Hook
 * @param options - Tab-Konfiguration und Optionen
 * @param options.initialTabId
 * @param options.tabs
 * @returns Tab-Zustand und Ereignisbehandler
 */
export function useTabScreen<T extends string = string>({
  initialTabId,
  tabs
}: UseTabScreenOptions<T>): UseTabScreenResult<T> {
  // Standard-Tab ist der erste Tab, wenn kein initialTabId angegeben wurde
  const defaultTabId = useMemo(() => initialTabId || tabs[0]?.id || '' as T, [initialTabId, tabs]);
  
  // Zustand für den aktiven Tab
  const [activeTabId, setActiveTabId] = useState<T>(defaultTabId);

  // Handler für Tab-Wechsel
  const handleTabChange = useCallback((tabId: T) => {
    setActiveTabId(tabId);
  }, []);

  // Memoiziertes Ergebnisobjekt
  return useMemo(() => ({
    tabs,
    activeTabId,
    handleTabChange
  }), [tabs, activeTabId, handleTabChange]);
} 