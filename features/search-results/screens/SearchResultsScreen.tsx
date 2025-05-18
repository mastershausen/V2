import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { themeColors, spacing, typography } from '@/config/theme';
import SearchService from '@/features/home/services/SearchService';
import { 
  SearchFilterOptions, 
  SearchResponse, 
  SearchResult, 
  SearchSortOption, 
  SearchResultsUrlParams
} from '@/features/home/types/search';

/**
 * SearchResults Screen
 * 
 * Zeigt Suchergebnisse basierend auf den übergebenen Parametern an.
 * Wird von HomeScreen mittels expo-router navigiert.
 */
export default function SearchResultsScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // Parameter aus der Route extrahieren und validieren
  const params = useLocalSearchParams<{
    query?: string;
    initialFilters?: string;
    sortOption?: string;
    source?: string;
  }>();
  
  // State für die Suchergebnisse
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  
  // Validiere die Parameter und extrahiere sie
  const searchParams = useMemo(() => {
    // Überprüfe, ob eine Suchanfrage vorhanden ist
    if (!params.query) {
      return { valid: false, errorMessage: 'Keine Suchanfrage angegeben' };
    }
    
    // Parse die optionalen Filter 
    let parsedFilters: SearchFilterOptions | undefined;
    if (params.initialFilters) {
      try {
        parsedFilters = JSON.parse(params.initialFilters);
      } catch (e) {
        console.warn('Fehler beim Parsen der Filter-Parameter, verwende Standard-Filter', e);
      }
    }
    
    // Validiere die Sortierungsoption
    const sortOption = params.sortOption 
      ? (params.sortOption as SearchSortOption) 
      : SearchSortOption.RELEVANCE;
    
    // Validiere die Quelle
    const source = params.source || 'home';
    
    return {
      valid: true,
      query: params.query,
      filters: parsedFilters,
      sortOption,
      source
    };
  }, [params]);
  
  // Suche bei Initialisierung oder Parameteränderung durchführen
  useEffect(() => {
    // Wenn die Parameter ungültig sind, zeige einen Fehler an
    if (!searchParams.valid) {
      setError(new Error(searchParams.errorMessage || 'Ungültige Suchparameter'));
      setIsLoading(false);
      return;
    }
    
    const performSearch = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Suche durchführen
        const searchResponse = await SearchService.search({
          query: searchParams.query || '',
          sort: searchParams.sortOption,
          filters: searchParams.filters,
        });
        
        setResults(searchResponse.results);
        setResponse(searchResponse);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    performSearch();
  }, [searchParams]);
  
  // Ergebniskarte für ein Suchergebnis
  const ResultCard = ({ result }: { result: SearchResult }) => {
    return (
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>{result.title}</Text>
        <Text style={styles.resultCategory}>{result.category}</Text>
        {result.category === 'article' && (
          <Text style={styles.resultDetails}>
            {(result as any).readTime} min Lesezeit • {(result as any).publishDate}
          </Text>
        )}
        {result.category === 'expert' && (
          <Text style={styles.resultDetails}>
            {(result as any).specialty} • Bewertung: {(result as any).rating}
          </Text>
        )}
        {result.category === 'nugget' && (
          <Text style={styles.resultContent} numberOfLines={2}>
            {(result as any).content}
          </Text>
        )}
      </View>
    );
  };
  
  // Wenn die Parameter ungültig sind, zeige einen Fehler an und eine Möglichkeit zurückzukehren
  if (!searchParams.valid) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {searchParams.errorMessage || 'Ungültige Suchparameter'}
          </Text>
          <Text 
            style={styles.backLink}
            onPress={() => router.back()}
          >
            Zurück zur Suche
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Ergebnisse für "{searchParams.query || ''}"
        </Text>
        {response && (
          <Text style={styles.resultCount}>
            {response.totalResults} Treffer
          </Text>
        )}
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.light.primary} />
          <Text style={styles.loadingText}>Suche läuft...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Fehler bei der Suche: {error.message}
          </Text>
          <Text 
            style={styles.backLink}
            onPress={() => router.back()}
          >
            Zurück zur Suche
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Keine Ergebnisse für "{searchParams.query || ''}" gefunden
          </Text>
          <Text 
            style={styles.backLink}
            onPress={() => router.back()}
          >
            Zurück zur Suche
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.resultsList}>
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.light.backgroundPrimary,
  },
  header: {
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.light.divider,
  },
  headerTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.semiBold,
    color: themeColors.light.textPrimary,
  },
  resultCount: {
    fontSize: typography.fontSize.m,
    color: themeColors.light.textSecondary,
    marginTop: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
    color: themeColors.light.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.m,
  },
  errorText: {
    textAlign: 'center',
    color: themeColors.light.error,
    marginBottom: spacing.m,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.m,
  },
  emptyText: {
    textAlign: 'center',
    color: themeColors.light.textSecondary,
    marginBottom: spacing.m,
  },
  backLink: {
    color: themeColors.light.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.m,
  },
  resultsList: {
    flex: 1,
  },
  resultCard: {
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.light.divider,
  },
  resultTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.semiBold,
    color: themeColors.light.textPrimary,
  },
  resultCategory: {
    fontSize: typography.fontSize.s,
    color: themeColors.light.primary,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  resultDetails: {
    fontSize: typography.fontSize.s,
    color: themeColors.light.textSecondary,
    marginTop: spacing.xs,
  },
  resultContent: {
    fontSize: typography.fontSize.m,
    color: themeColors.light.textPrimary,
    marginTop: spacing.s,
  },
}); 