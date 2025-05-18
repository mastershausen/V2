import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { BaseTabbar, BaseTabConfig } from '@/shared-components/navigation/BaseTabbar';
import { getMySolvboxService } from '@/utils/service/serviceHelper';

import { MySolvboxTabbarProps, MySolvboxTabId, MySolvboxTabConfig } from '../../types';

/**
 * MySolvboxTabbarContainer-Komponente
 *
 * Eine spezialisierte Container-Komponente für die MySolvbox-Tabbar, die auf BaseTabbar aufbaut.
 * Dient als Container-Komponente mit Geschäftslogik für Tab-Validierung.
 * @param activeTab.activeTab
 * @param activeTab - Die derzeit aktive Tab-ID
 * @param onTabPress - Callback-Funktion für Tab-Klicks
 * @param scrollOffset - Vertikaler Scroll-Offset für Animation (optional)
 * @param screenWidth - Bildschirmbreite für Responsivität (optional)
 * @param style - Custom Styles für den Tab-Container (optional)
 * @param tabItemStyle - Custom Styles für einzelne Tab-Items (optional)
 * @param tabLabelStyle - Custom Styles für Tab-Labels (optional)
 * @param tabs - Array mit Tab-Konfigurationen (optional, Standard: MYSOLVBOX_TABS)
 * @param activeTab.onTabPress
 * @param activeTab.scrollOffset
 * @param activeTab.screenWidth
 * @param activeTab.style
 * @param activeTab.tabItemStyle
 * @param activeTab.tabLabelStyle
 * @param activeTab.tabs
 */
export function MySolvboxTabbarContainer({ 
  activeTab, 
  onTabPress,
  scrollOffset = 0,
  screenWidth = 0,
  style,
  tabItemStyle,
  tabLabelStyle,
  tabs
}: MySolvboxTabbarProps): React.ReactElement {
  const { t } = useTranslation();

  // Übersetzte Tabs
  const defaultTabs = useMemo<BaseTabConfig[]>(() => [
    {
      id: 'save',
      label: t('tabs.save')
    },
    {
      id: 'grow',
      label: t('tabs.grow')
    },
    {
      id: 'foresight',
      label: t('tabs.foresight')
    },
    {
      id: 'bonus',
      label: t('tabs.bonus')
    }
  ], [t]);

  // Verwende die bereitgestellten Tabs oder die Standardtabs
  const effectiveTabs = tabs || defaultTabs;

  /**
   * Verarbeitet Tab-Klicks und validiert die Tab-ID
   * @param tabId - Die ID des angeklickten Tabs
   */
  const handleTabPress = (tabId: string): void => {
    // Hole die Service-Instanz
    const mysolvboxService = getMySolvboxService();
    
    // Prüfen, ob es sich um eine gültige Tab-ID handelt
    if (mysolvboxService.isValidTabId(tabId, effectiveTabs as MySolvboxTabConfig[])) {
      onTabPress(tabId as MySolvboxTabId);
    } else {
      // Log-Nachricht für ungültige Tab-IDs
      // eslint-disable-next-line no-console
      console.warn(`Ungültige MySolvbox Tab-ID: ${tabId}`);
    }
  };

  return (
    <BaseTabbar
      activeTab={activeTab}
      onTabPress={handleTabPress}
      tabs={effectiveTabs}
      scrollOffset={scrollOffset}
      screenWidth={screenWidth}
      indicatorStyle="line"
      showShadow={true}
      tabContainerStyle={[styles.tabContainer, style]}
      tabItemStyle={[styles.tabItem, tabItemStyle]}
      tabLabelStyle={[styles.tabLabel, tabLabelStyle]}
      indicatorStripStyle={styles.indicatorStrip}
    />
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxs,
  },
  tabLabel: {
    textAlign: 'center',
    fontSize: typography.fontSize.m,
    fontWeight: '500',
  },
  indicatorStrip: {
    height: 3,
    borderRadius: 1.5,
  },
}); 