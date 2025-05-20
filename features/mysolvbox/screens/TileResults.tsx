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
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderMedia } from '@/shared-components/media';
import { FilterTabs, FilterTabItem } from '@/shared-components/navigation/FilterTabs';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { NuggetCard } from '@/shared-components/cards/nugget-card/NuggetCard';
import { GigCard } from '@/shared-components/cards/gig-card/GigCard';
import { ExpertCard } from '@/shared-components/cards/expert-card/ExpertCard';
import mockNuggets from '@/mock/data/mockNuggets';
import mockGigs from '@/mock/data/mockGigs';
import mockExperts from '@/mock/data/mockExperts';

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
  
];

/**
 * Hilfsfunktion zum Kürzen des Titels auf maximal 25 Zeichen
 */
const truncateTitle = (title: string | undefined): string => {
  if (!title) return 'Ergebnisse';
  return title.length > 25 ? `${title.substring(0, 25)}...` : title;
};

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

  // Standard-Handlers für verschiedene Kartentypen
  const handleNuggetPress = (nuggetId: string) => {
    Alert.alert('Nugget', `Nugget ${nuggetId} wurde angeklickt`);
  };

  const handleGigPress = (gigId: string) => {
    // Suche nach dem Gig anhand der ID
    const gig = mockGigs.find(g => g.id === gigId);
    
    if (gig) {
      // Navigiere zum GigDetailsScreen mit den Gig-Daten als Parameter
      router.push({
        pathname: '/gigs/details',
        params: {
          id: gig.id,
          imageUrl: gig.imageUrl,
          source: 'tile'
        }
      });
    }
  };

  const handleExpertPress = (expertId: string) => {
    Alert.alert('Experte', `Experte ${expertId} wurde angeklickt`);
  };
  
  // Rendere Inhalte basierend auf aktivem Filter
  const renderFilterContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Daten werden geladen...
          </Text>
        </View>
      );
    }

    // Alle verfügbaren Inhalte basierend auf dem ausgewählten Filter anzeigen
    switch (activeFilter) {
      case 'nuggets':
        return (
          <View style={styles.filterContentContainer}>
            {mockNuggets.map(nugget => (
              <View key={nugget.id} style={styles.cardContainer}>
                <NuggetCard 
                  nugget={nugget}
                  onHelpfulPress={() => {}}
                  onCommentPress={() => {}}
                  onSharePress={() => {}}
                  onSavePress={() => {}}
                  onUserPress={() => handleNuggetPress(nugget.id)}
                />
              </View>
            ))}
          </View>
        );
        
      case 'gigs':
        return (
          <View style={styles.filterContentContainer}>
            {mockGigs.map(gig => (
              <View key={gig.id} style={styles.cardContainer}>
                <GigCard 
                  gig={gig}
                  onPress={() => handleGigPress(gig.id)}
                />
              </View>
            ))}
          </View>
        );
      
      case 'experts':
        return (
          <View style={styles.filterContentContainer}>
            {mockExperts.map(expert => (
              <View key={expert.id} style={styles.expertCardContainer}>
                <ExpertCard 
                  expert={expert}
                  onPress={() => handleExpertPress(expert.id)}
                />
              </View>
            ))}
          </View>
        );
        
      case 'all':
      default:
        // Bei "Alles" zeigen wir eine Mischung aus allen Inhaltstypen an
        return (
          <View style={styles.filterContentContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Experten
            </Text>
            {mockExperts.slice(0, 2).map(expert => (
              <View key={expert.id} style={styles.expertCardContainer}>
                <ExpertCard 
                  expert={expert}
                  onPress={() => handleExpertPress(expert.id)}
                />
              </View>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Gigs
            </Text>
            {mockGigs.slice(0, 2).map(gig => (
              <View key={gig.id} style={styles.cardContainer}>
                <GigCard 
                  gig={gig}
                  onPress={() => handleGigPress(gig.id)}
                />
              </View>
            ))}

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Nuggets
            </Text>
            {mockNuggets.slice(0, 2).map(nugget => (
              <View key={nugget.id} style={styles.cardContainer}>
                <NuggetCard 
                  nugget={nugget}
                  onHelpfulPress={() => {}}
                  onCommentPress={() => {}}
                  onSharePress={() => {}}
                  onSavePress={() => {}}
                  onUserPress={() => handleNuggetPress(nugget.id)}
                />
              </View>
            ))}
          </View>
        );
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header-Navigation mit der vorhandenen Komponente */}
      <HeaderNavigation 
        title={truncateTitle(title)} 
        showBackButton={true}
        onBackPress={handleGoBack}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header mit HeaderMedia-Komponente */}
        <View style={styles.headerContainer}>
          <HeaderMedia 
            imageUrl={imageUrl || null}
            borderRadius={0}
          />
        </View>
        
        {/* Filter-Tabs direkt unter dem Header */}
        <View style={styles.filterContainer}>
          <FilterTabs 
            tabs={FILTER_TABS}
            activeTabId={activeFilter}
            onTabChange={handleFilterChange}
          />
        </View>
        
        {renderFilterContent()}
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
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
  filterContentContainer: {
    flex: 1,
    width: '100%',
    marginBottom: spacing.l,
    padding: spacing.m,
  },
  cardContainer: {
    marginBottom: 0, // Entfernt den zusätzlichen Abstand, da die Card-Komponenten bereits marginBottom haben
  },
  expertCardContainer: {
    marginBottom: 0, // Entfernt den zusätzlichen Abstand, da die ExpertCard-Komponenten bereits marginBottom haben
  },
}); 