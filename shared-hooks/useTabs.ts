/**
 * useTabs.ts - Gemeinsamer Basis-Hook für Tab-Management
 * 
 * Dieser Hook stellt eine einheitliche API für die Verwaltung von Tabs bereit,
 * unabhängig vom spezifischen Feature-Bereich. Er kapselt die gemeinsame Logik
 * für Tab-Validierung, -Wechsel und -Status.
 */

import { useMemo, useCallback } from 'react';

// Generischer Typ für Tab-IDs
export type TabId = string;

// Generischer Typ für Tab-Konfigurationen
export interface TabConfigBase {
  id: TabId;
  label: string;
  component: React.ComponentType<React.ComponentProps<any>>;
}

// Optionen für den useTabs-Hook
export interface UseTabsOptions<T extends TabId> {
  tabs: TabConfigBase[];
  defaultTabId: T;
  activeTab?: string;
  setActiveTab?: (tabId: string) => void;
  validateTabId?: (tabId: string, tabs: TabConfigBase[]) => tabId is T;
}

// Rückgabetyp des useTabs-Hooks
export interface UseTabsResult<T extends TabId> {
  tabs: TabConfigBase[];
  activeTabId: T;
  setActiveTab: (tabId: string) => void;
  isValidTabId: (tabId: string) => tabId is T;
  handleTabChange: (tabId: string) => void;
}

/**
 * Hook für einheitliches Tab-Management
 * @param {UseTabsOptions<T>} options - Konfigurationsoptionen für das Tab-Management
 * @param {TabConfigBase[]} options.tabs - Liste der verfügbaren Tabs
 * @param {T} options.defaultTabId - Standard-Tab-ID, die verwendet wird, wenn kein aktiver Tab gesetzt ist oder der aktive Tab ungültig ist
 * @param {string} [options.activeTab] - Aktuell aktiver Tab (optional)
 * @param {Function} [options.setActiveTab] - Callback-Funktion zum Setzen des aktiven Tabs (optional)
 * @param {Function} [options.validateTabId] - Benutzerdefinierte Validierungsfunktion für Tab-IDs (optional)
 * @returns {UseTabsResult<T>} Funktionen und Daten für Tab-Verwaltung
 * @template T - Typ der Tab-ID, erweitert den TabId-Basistyp
 */
export function useTabs<T extends TabId>({
  tabs,
  defaultTabId,
  activeTab,
  setActiveTab,
  validateTabId
}: UseTabsOptions<T>): UseTabsResult<T> {
  
  // Standard-Validierungsfunktion
  const defaultValidateTabId = useCallback((tabId: string, tabs: TabConfigBase[]): tabId is T => {
    return tabs.some(tab => tab.id === tabId);
  }, []);

  // Verwende die übergebene Validierungsfunktion oder die Standard-Funktion
  const isValidTabId = useCallback((tabId: string): tabId is T => {
    return validateTabId 
      ? validateTabId(tabId, tabs) 
      : defaultValidateTabId(tabId, tabs);
  }, [validateTabId, tabs, defaultValidateTabId]);

  // Validiere den aktiven Tab
  const activeTabId = useMemo<T>(() => {
    return isValidTabId(activeTab || '') 
      ? (activeTab as T) 
      : defaultTabId;
  }, [activeTab, defaultTabId, isValidTabId]);

  /**
   * Gibt eine Funktion zurück, die den aktiven Tab bei Klick auf einen Tab wechselt.
   * Falls kein setActiveTab-Handler übergeben wurde, wird eine Warnmeldung ausgegeben.
   * Bei ungültigen Tabs wird auf den Standardtab zurückgegriffen.
   */
  const handleTabChange = useMemo(() => {
    return (tabId: string) => {
      if (!isValidTabId(tabId)) {
        console.warn(`Ungültiger Tab: ${tabId}, falle zurück auf ${defaultTabId}`);
        if (setActiveTab) {
          setActiveTab(defaultTabId);
        } else {
          console.warn('Kein setActiveTab-Handler definiert');
        }
        return;
      }

      if (setActiveTab) {
        setActiveTab(tabId as T);
      } else {
        console.warn('Kein setActiveTab-Handler definiert');
      }
    };
  }, [defaultTabId, setActiveTab, isValidTabId]);

  return {
    tabs,
    activeTabId,
    setActiveTab: setActiveTab || (() => console.warn('Kein setActiveTab-Handler definiert')),
    isValidTabId,
    handleTabChange
  };
} 