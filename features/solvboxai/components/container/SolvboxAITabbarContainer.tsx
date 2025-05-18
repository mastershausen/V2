import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { themeColors } from '@/config/theme';
import { sizes } from '@/config/theme/sizes';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BaseTabbar, BaseTabConfig } from '@/shared-components/navigation/BaseTabbar';
import { createLogger } from '@/utils/logger';
import { getFeatureSolvboxAIService } from '@/utils/service/serviceHelper';

import { TAB_IDS } from '../../config/tabs';
import { SolvboxAITabbarProps, SolvboxAITabId, SolvboxAITabConfig } from '../../types';

// Erstelle einen spezialisierten Logger für diese Komponente
const logger = createLogger({ prefix: '🧩 SolvboxAITabbar' });

/**
 * SolvboxAITabbarContainer-Komponente
 *
 * Eine spezialisierte Container-Komponente für die SolvboxAI-Tabbar, die auf BaseTabbar aufbaut.
 * Dient als Container-Komponente mit Geschäftslogik für Tab-Validierung und -Wechsel.
 * @param {object} props - Die Komponenten-Props
 * @param {SolvboxAITabId} props.activeTab - Die derzeit aktive Tab-ID
 * @param {Function} props.onTabPress - Callback-Funktion für Tab-Klicks
 * @param {number} props.scrollOffset - Vertikaler Scroll-Offset für Animation
 * @param {number} props.screenWidth - Bildschirmbreite für Responsivität
 * @param {object} props.style - Custom Styles für den Tab-Container
 * @param {object} props.tabItemStyle - Custom Styles für einzelne Tab-Items
 * @param {object} props.tabLabelStyle - Custom Styles für Tab-Labels
 * @param {Array} props.tabs - Array mit Tab-Konfigurationen
 * @returns {React.ReactElement} Die gerenderte Tabbar-Komponente
 */
export default function SolvboxAITabbarContainer({ 
  activeTab, 
  onTabPress,
  scrollOffset = 0,
  screenWidth = 0,
  style,
  tabItemStyle,
  tabLabelStyle,
  tabs
}: SolvboxAITabbarProps): React.ReactElement {
  const { t } = useTranslation();
  const colors = useThemeColor();

  // DEBUG: Tab-Anzeigeproblem - Prüfe, ob der richtige activeTab übergeben wird
  logger.debug('Rendering with activeTab:', activeTab);

  // Übersetzte Tabs
  const defaultTabs = useMemo<BaseTabConfig[]>(() => [
    {
      id: TAB_IDS.GIGS,
      label: t('tabs.gigs')
    },
    {
      id: TAB_IDS.CASESTUDIES,
      label: t('tabs.casestudies')
    }
  ], [t]);

  // Verwende die bereitgestellten Tabs oder die Standardtabs
  const effectiveTabs = tabs || defaultTabs;

  /**
   * Verarbeitet Tab-Klicks und validiert die Tab-ID
   * @param {string} tabId - Die ID des angeklickten Tabs
   */
  const handleTabPress = (tabId: string): void => {
    // Hole die Service-Instanz
    const solvboxAIService = getFeatureSolvboxAIService();
    
    // Prüfen, ob es sich um eine gültige Tab-ID handelt
    if (solvboxAIService.isValidTabId(tabId, effectiveTabs as SolvboxAITabConfig[])) {
      onTabPress(tabId as SolvboxAITabId);
    } else {
      // Nur in Entwicklungsumgebung warnen
      logger.warn(`Ungültige SolvboxAI Tab-ID: ${tabId}`);
    }
  };

  // Generiere die Styles basierend auf dem aktuellen Theme
  const styles = React.useMemo(() => createStyles(colors), [colors]);

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
      indicatorContainerStyle={styles.indicatorContainer}
      indicatorStripStyle={styles.indicatorStrip}
    />
  );
}

// Die Styles werden für bessere Testbarkeit außerhalb der Komponente definiert
const createStyles = (colors: typeof themeColors.light) => StyleSheet.create({
  tabContainer: {
    height: sizes.tabBarCompact,
    paddingHorizontal: spacing.m,
  },
  tabItem: {
    paddingHorizontal: spacing.m,
    minWidth: sizes.elementSize.tabMinWidth,
  },
  tabLabel: {
    fontSize: typography.fontSize.m,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.textPrimary,
  },
  indicatorContainer: {
    height: sizes.elementSize.indicatorHeight,
  },
  indicatorStrip: {
    height: sizes.elementSize.indicatorHeight,
    backgroundColor: colors.primary,
    borderRadius: sizes.elementSize.indicatorHeight / 2,
  }
}); 