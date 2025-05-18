import React from 'react';
import { useTranslation } from 'react-i18next';

import { TabScreensContainer, TabbarComponentProps } from '@/shared-components/container/TabScreensContainer';

import { MySolvboxTabbarContainer } from '../components/container/MySolvboxTabbarContainer';
import { useMySolvbox } from '../hooks/useMySolvbox';

/**
 * MySolvbox-Hauptbildschirm mit Tabs und kompakter, dezenter Suchfunktion
 *
 * Verwendet den useMySolvbox-Hook, der die gesamte Geschäftslogik kapselt
 * und dem Screen eine einheitliche API zur Verfügung stellt.
 *
 * Diese Komponente ist jetzt eine reine UI-Komponente, ohne eigene Zustandslogik.
 * Alle Funktionalität wird vom useMySolvbox-Hook bereitgestellt.
 * @returns {React.ReactElement} Die gerenderte MySolvboxScreen-Komponente mit Tabs und Suchfeld
 */
export default function MySolvboxScreen(): React.ReactElement {
  const { t } = useTranslation();
  
  // Hole alle benötigten Daten und Funktionen aus dem Hook
  const {
    tabs,
    activeTabId,
    handleTabChange,
    handleSearchChange
  } = useMySolvbox();
  
  // Typ-Konvertierung für die TabbarComponent
  const TabbarWithTypes = MySolvboxTabbarContainer as React.ComponentType<TabbarComponentProps>;
  
  return (
    <TabScreensContainer
      tabs={tabs}
      activeTab={activeTabId}
      onTabChange={handleTabChange}
      showSearch={true}
      onSearchChange={handleSearchChange}
      TabbarComponent={TabbarWithTypes}
      searchPlaceholder={t('common.search')}
      compactSearch={true}
      subtleSearch={true}
    />
  );
} 