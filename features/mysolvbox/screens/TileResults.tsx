/**
 * TileResults.tsx
 * 
 * Dieser Screen zeigt die Ergebnisse einer angeklickten Kachel aus dem MySolvbox Screen an.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderMedia } from '@/shared-components/media';
import { FilterTabs, FilterTabItem } from '@/shared-components/navigation/FilterTabs';

// Typ für die Route-Parameter
interface TileResultsParams {
  tileId?: string;
  title?: string;
  imageUrl?: string;
}

// Vordefinierte Filter-Tabs
const FILTER_TABS: FilterTabItem[] = [
  { id: 'all', label: 'Alles' },
  { id: 'experts', label: 'Experten' },
  { id: 'gigs', label: 'Gigs' },
  { id: 'nuggets', label: 'Nuggets' },
  { id: 'casestudies', label: 'Fallstudien' },
];

/**
 * TileResults Screen
 * 
 * Zeigt detaillierte Ergebnisse für eine angeklickte Kachel aus MySolvbox an.
 * Verwendet die HeaderMedia-Komponente für den Header-Bereich.
 */
export default function TileResults() {
  const params = useLocalSearchParams() as TileResultsParams;
  const router = useRouter();
  const colors = useThemeColor();
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Parameter aus der Route extrahieren
  const { tileId, title, imageUrl } = params || {};
  
  // Daten laden (simuliert)
  useEffect(() => {
    // Hier würden normalerweise die Daten für die angeklickte Kachel geladen
    const loadData = async () => {
      try {
        // Simuliere Netzwerkanfrage
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [tileId]);
  
  // Zurück-Navigation
  const handleGoBack = () => {
    router.back();
  };
  
  // Filter-Tab-Änderung
  const handleFilterChange = (filterId: string) => {
    console.log(`Filter geändert auf: ${filterId}`);
    setActiveFilter(filterId);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header mit HeaderMedia-Komponente */}
      <View style={styles.headerContainer}>
        <HeaderMedia 
          imageUrl={imageUrl || null}
          borderRadius={0}
        />
        
        {/* Zurück-Button */}
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.backgroundPrimary }]} 
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      {/* Filter-Tabs direkt unter dem Header */}
      <View style={styles.filterContainer}>
        <FilterTabs 
          tabs={FILTER_TABS}
          activeTabId={activeFilter}
          onTabChange={handleFilterChange}
        />
      </View>
      
      {/* Titel */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title || 'Ergebnisse'}
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Daten werden geladen...
            </Text>
          </View>
        ) : (
          /* Ergebnisinhalt */
          <View style={styles.resultsContainer}>
            {/* Hier können verschiedene Ergebnistypen angezeigt werden */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {activeFilter === 'all' 
                ? `Ergebnisse für "${title}"`
                : `${FILTER_TABS.find(tab => tab.id === activeFilter)?.label} für "${title}"`}
            </Text>
            
            <View style={[styles.infoCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Dieser Bereich zeigt die detaillierten Ergebnisse für die ausgewählte Kachel.
                Aktuell wird der Filter "{FILTER_TABS.find(tab => tab.id === activeFilter)?.label}" angezeigt.
              </Text>
            </View>
            
            {/* Weitere Inhaltsbereiche können hier hinzugefügt werden */}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 4,
    zIndex: 10,
  },
  titleContainer: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.m,
    paddingBottom: spacing.xxxl,
  },
  loadingContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
    fontSize: typography.fontSize.m,
  },
  resultsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  infoCard: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    marginBottom: spacing.m,
  },
  infoText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 1,
    elevation: 2,
    zIndex: 1,
  },
}); 