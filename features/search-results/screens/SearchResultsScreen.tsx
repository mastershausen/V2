/**
 * SearchResultsScreen.tsx
 * 
 * Zeigt Suchergebnisse basierend auf der Suchanfrage an.
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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FilterTabs, FilterTabItem } from '@/shared-components/navigation/FilterTabs';
import { FilterIcon } from '@/shared-components/navigation/FilterIcon';
import { NuggetCard } from '@/shared-components/cards/nugget-card/NuggetCard';
import { GigCard } from '@/shared-components/cards/gig-card/GigCard';
import { ExpertCard } from '@/shared-components/cards/expert-card/ExpertCard';
import { SearchInput } from '@/shared-components/searchinput/SearchInput';
import mockNuggets from '@/mock/data/mockNuggets';
import mockGigs from '@/mock/data/mockGigs';
import mockExperts from '@/mock/data/mockExperts';

// Vordefinierte Filter-Tabs
const FILTER_TABS: FilterTabItem[] = [
  { id: 'all', label: 'Alles' },
  { id: 'experts', label: 'Experten' },
  { id: 'gigs', label: 'Gigs' },
  { id: 'nuggets', label: 'Nuggets' },
  { id: 'casestudies', label: 'Fallstudien' },
];

/**
 * SearchResultsScreen
 * 
 * Zeigt Suchergebnisse basierend auf der Suchanfrage an.
 */
export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{
    query?: string;
    initialFilters?: string;
    sortOption?: string;
    source?: string;
  }>();
  const router = useRouter();
  const colors = useThemeColor();
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(
    mockExperts.length + mockGigs.length + mockNuggets.length
  );
  
  // Zurück-Navigation
  const handleGoBack = () => {
    router.back();
  };
  
  // Filter-Tab-Änderung
  const handleFilterChange = (filterId: string) => {
    console.log(`Filter geändert auf: ${filterId}`);
    setActiveFilter(filterId);
  };
  
  // Filter-Dialog öffnen
  const handleFilterPress = () => {
    console.log('Filter-Dialog öffnen');
    Alert.alert(
      'Filter', 
      'Hier würde ein Filter-Dialog angezeigt werden',
      [
        {
          text: 'Filter anwenden',
          onPress: () => {
            // Simulation der Anwendung von Filtern
            setHasActiveFilters(true);
          },
        },
        {
          text: 'Filter zurücksetzen',
          onPress: () => {
            setHasActiveFilters(false);
          },
        },
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
      ]
    );
  };
  
  // Suche ausführen
  const handleSearch = () => {
    console.log(`Suche nach: ${searchQuery}`);
    // Hier würde normalerweise die Suche ausgeführt werden
    // Für diesen Prototyp simulieren wir nur kurz das Laden
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
          source: 'search'
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
            Suche läuft...
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
      
      case 'casestudies':
        return (
          <View style={styles.filterContentContainer}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Hier würden Fallstudien angezeigt werden.
            </Text>
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
      {/* Header mit Suchfeld und Zurück-Button */}
      <View style={styles.searchHeaderContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.searchInputWrapper}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Suchen..."
            onSubmitEditing={handleSearch}
            shadowLevel="none"
            containerStyle={styles.searchInputContainer}
            isLoading={isLoading}
          />
        </View>
      </View>
      
      {/* Filter-Tabs */}
      <View style={styles.filterContainer}>
        <FilterTabs 
          tabs={FILTER_TABS}
          activeTabId={activeFilter}
          onTabChange={handleFilterChange}
        />
        
        {/* Weicher Übergang zum Filter-Icon */}
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
          locations={[0, 0.5, 0.85, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tabGradient}
        />
        
        {/* Fixiertes Filter-Icon */}
        <View style={styles.fixedFilterIconContainer}>
          <FilterIcon
            hasActiveFilters={hasActiveFilters}
            onPress={handleFilterPress}
            size={22}
            style={styles.fixedFilterIcon}
          />
        </View>
      </View>
      
      {/* Ergebnisanzahl - NACH den Tabs */}
      <View style={styles.resultsCountContainer}>
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
          {totalResults} Treffer
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderFilterContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.s,
    paddingRight: spacing.m,
    paddingTop: spacing.s,
    paddingBottom: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchInputContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: spacing.xs,
    borderBottomWidth: 0, // Entfernt die untere Grenze, da wir die Ergebnisanzahl darunter haben
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 1,
    elevation: 2,
    position: 'relative', // Wichtig für die absolute Positionierung des Filter-Icons
    overflow: 'visible', // Damit das Filter-Icon nicht abgeschnitten wird
  },
  resultsCountContainer: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  resultCount: {
    fontSize: typography.fontSize.m,
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
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  infoText: {
    fontSize: typography.fontSize.m,
    textAlign: 'center',
  },
  fixedFilterIconContainer: {
    position: 'absolute',
    right: spacing.m,
    top: '50%',
    transform: [{ translateY: -14 }], // Hälfte der ungefähren Höhe des Icons für vertikale Zentrierung
    zIndex: 10, // Stellt sicher, dass das Icon über anderen Elementen liegt
  },
  fixedFilterIcon: {
    backgroundColor: 'white', // Feste Farbe statt dynamischer Referenz
    borderRadius: 25, // Kreisrund für einen hervorstehenden Look
    padding: spacing.xs,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 1,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  tabGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80, // Etwas breiter für einen sanfteren Übergang
    zIndex: 5, // Über den Tabs, aber unter dem Filter-Icon
  },
}); 