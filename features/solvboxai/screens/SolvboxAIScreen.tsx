import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TabScreensContainer, TabbarComponentProps, TabConfig } from '@/shared-components/container/TabScreensContainer';

import CaseStudiesTab from './CaseStudiesTab';
import GigsTab from './GigsTab';
import { SolvboxAITabbar } from '../components/container/SolvboxAITabbar';
import { useSolvboxAI } from '../hooks/useSolvboxAI';

/**
 * SolvboxAIScreen
 *
 * Hauptansicht für die SolvboxAI-Funktionalität, die alle KI-basierten Lösungen und Tools präsentiert.
 * Verwaltet die Tabs und zugehörigen Komponenten (Gigs und Fallstudien).
 *
 * Die Komponente stellt sicher, dass:
 * - Benutzer zwischen verschiedenen Tab-Ansichten navigieren können
 * - Tab-Inhalte dynamisch geladen werden
 * - Suchfunktionalität für Inhalte verfügbar ist
 *
 * Der Screen folgt dem Goldstandard:
 * - Keine eigene Geschäftslogik, sondern Nutzung des spezialisierten useSolvboxAI-Hooks
 * - Klare Trennung von UI und Logik (Presentational Component Pattern)
 * - Typsichere Implementierung mit TypeScript
 * - Reaktionsschnelle und benutzerfreundliche Oberfläche
 * @component
 * @example
 * // Verwendung in einer Route:
 * <Route path="/solvboxai" component={SolvboxAIScreen} />
 * @returns {React.ReactElement} Eine React-Komponente, die den SolvboxAI-Bereich darstellt
 */
export function SolvboxAIScreen(): React.ReactElement {
  const { t } = useTranslation();
  
  // Hole die benötigten Daten und Funktionen aus dem Hook
  const {
    tabs: baseTabs,
    activeTabId,
    handleTabChange, 
    handleSearchChange
  } = useSolvboxAI();

  // Typ-Konvertierung für die TabbarComponent
  const TabbarWithTypes = SolvboxAITabbar as React.ComponentType<TabbarComponentProps>;
  
  // Erstelle die vollständigen TabConfig-Objekte mit Components
  const tabsWithComponents = useMemo<TabConfig[]>(() => [
    {
      id: 'gigs',
      label: t('solvboxai.tabs.gigs'),
      component: GigsTab
    },
    {
      id: 'casestudies',
      label: t('solvboxai.tabs.casestudies'),
      component: CaseStudiesTab
    }
  ], [t]);

  // String-zu-Nummer-Konvertierung für Tab-Index
  const handleTabChangeWrapper = (tabId: string) => {
    const tabIndex = tabsWithComponents.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {
      handleTabChange(tabIndex);
    }
  };

  return (
    <TabScreensContainer
      tabs={tabsWithComponents}
      activeTab={activeTabId || 'gigs'} // Fallback auf ersten Tab
      onTabChange={handleTabChangeWrapper}
      showSearch={true}
      onSearchChange={handleSearchChange}
      TabbarComponent={TabbarWithTypes}
      searchPlaceholder={t('common.search')}
      compactSearch={true}
      subtleSearch={true}
    />
  );
}

// Standardexport für die Nutzung in der App
export default SolvboxAIScreen; 