import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FilterTabs, FilterTabItem } from '@/shared-components/navigation/FilterTabs';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * MySolvbox-Hauptbildschirm mit FilterTabs
 *
 * Zeigt FilterTabs für verschiedene Business-Kategorien an.
 * @returns {React.ReactElement} Die gerenderte MySolvboxScreen-Komponente
 */
export default function MySolvboxScreen(): React.ReactElement {
  const { t } = useTranslation();
  const colors = useThemeColor();
  
  // FilterTabs State
  const [activeFilter, setActiveFilter] = React.useState('alle');

  // Handler für FilterTabs
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  // FilterTabs-Konfiguration
  const FILTER_TABS: FilterTabItem[] = [
    { id: 'alle', label: 'Alle' },
    { id: 'steuern', label: 'Steuern' },
    { id: 'immobilien', label: 'Immobilien' },
    { id: 'mitarbeiter', label: 'Mitarbeiter' },
    { id: 'kundengewinnung', label: 'Kundengewinnung' },
    { id: 'ki', label: 'Künstliche Intelligenz' },
    { id: 'investments', label: 'Investments' },
    { id: 'finanzierung', label: 'Finanzierung' },
    { id: 'unternehmensstruktur', label: 'Unternehmensstruktur' },
    { id: 'recht-sicherheit', label: 'Recht & Sicherheit' },
    { id: 'auswandern', label: 'Auswandern' },
    { id: 'verkauf-exit', label: 'Verkauf & Exit' },
    { id: 'persoenliches-wachstum', label: 'Persönliches Wachstum' }
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header Navigation */}
      <HeaderNavigation 
        title="Explore" 
        showBackButton={false}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerContainer}
      />
      
      {/* FilterTabs */}
      <View style={styles.filterTabsContainer}>
        <FilterTabs 
          tabs={FILTER_TABS}
          activeTabId={activeFilter}
          onTabChange={handleFilterChange}
        />
      </View>
      
      {/* Hier könnten später gefilterte Inhalte angezeigt werden */}
      <View style={styles.contentContainer}>
        {/* Platzhalter für zukünftige Inhalte */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterTabsContainer: {
    paddingTop: spacing.xl,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.m,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerContainer: {
    marginBottom: spacing.m,
    zIndex: 1001,
    elevation: 1001,
  },
}); 