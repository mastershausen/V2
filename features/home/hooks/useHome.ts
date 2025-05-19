import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

import { getAnalyticsManager, SearchAnalyticsEventParams, SearchAnalyticsEventType } from '../types/analytics';
import { DEFAULT_SUGGESTIONS, getPersonalizedSuggestions } from '../constants/suggestions';
import { SearchService } from '../services/SearchService';
import {
  SearchFilterOptions,
  SearchOptions,
  SearchResponse,
  SearchResultsParams,
  SearchSortOption,
  SearchSuggestion,
  UseHomeOptions,
  UseHomeResult,
  createSearchUrlParams,
  createSearchDeepLink,
  UseHomeHook
} from '../types/search';
import SearchAnalyticsService from '../services/AnalyticsService';

// Private Konstanten für den Hook
const DEFAULT_STORAGE_KEY = 'home_search_history';
const DEFAULT_MAX_HISTORY_ITEMS = 10;
const DEFAULT_DEBOUNCE_TIME = 300; // 300ms

/**
 * Hook für die vereinheitlichte Verwaltung des Home-Screens
 * 
 * Konsolidiert die Suchfunktionalität aus SearchContext und useHomeSearch in einer
 * sauberen, konsistenten API gemäß Gold Standard. Trennt klar zwischen interner
 * Implementierung und öffentlicher Schnittstelle.
 * 
 * Hauptfunktionalitäten:
 * - Suchmanagement (Eingabe, Vorschläge, Historie)
 * - Suchfilter und Sortierung
 * - Fehlerbehandlung
 * - AsyncStorage-Integration für persistente Daten
 * - Analytik-Events
 * 
 * @param options - Konfigurationsoptionen für den Hook
 * @returns Einheitliche Schnittstelle für HomeScreen-Funktionalität
 */
export const useHome: UseHomeHook = (options = {}) => {
  // i18n Übersetzungs-Hook für Sprachunterstützung
  const { i18n } = useTranslation();
  
  // Standardwerte für Options
  const {
    onSearchResults,
    autoNavigateToResults = false,
    defaultFilters = {},
    historyStorageKey = 'search_history',
    searchDebounceMs = 300,
    maxHistoryItems = 10
  } = options;

  // Expo Router Navigation
  const navigation = useNavigation();
  const router = useRouter();
  
  // State-Management für Kernfunktionalitäten
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>(DEFAULT_SUGGESTIONS);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // State-Management für erweiterte Funktionalitäten
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilters, setActiveFilters] = useState<SearchFilterOptions>(defaultFilters);
  const [sortOptionState, setSortOptionState] = useState<SearchSortOption>(SearchSortOption.RELEVANCE);
  const [lastSearched, setLastSearched] = useState<Date | null>(null);
  
  // Refs für Abbruch und Clean-up
  const cancelSearchRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const searchStartTime = useRef<number>(0);
  
  // Abgeleitete Werte mit useMemo für Rendering-Optimierung
  const showHistory = useMemo<boolean>(() => 
    searchQuery.trim() === '' && searchHistory.length > 0, 
    [searchQuery, searchHistory]
  );
  
  const showSuggestions = useMemo<boolean>(() => 
    suggestions.length > 0, 
    [suggestions]
  );

  // Tracking-Events für Analytik
  const trackSearch = useCallback((query: string, hasResults: boolean, durationMs?: number) => {
    try {
      SearchAnalyticsService.trackSearchPerformed(
        query,
        hasResults,
        'manual',
        {
          resultCount: hasResults ? searchResults?.totalResults : 0,
          durationMs
        }
      );
    } catch (error) {
      // Silent fail für Analytik
      console.debug('Analytics error', error);
    }
  }, [searchResults]);

  const trackSuggestionClick = useCallback((suggestion: string, position: number) => {
    try {
      SearchAnalyticsService.trackSuggestionClicked(suggestion, position);
    } catch (error) {
      console.debug('Analytics error', error);
    }
  }, []);

  /**
   * Lädt den gespeicherten Suchverlauf aus dem AsyncStorage
   */
  const loadSearchHistory = useCallback(async () => {
    try {
      const historyJson = await AsyncStorage.getItem(historyStorageKey);
      if (historyJson && isMountedRef.current) {
        setSearchHistory(JSON.parse(historyJson));
      }
    } catch (error) {
      console.error('Fehler beim Laden des Suchverlaufs', error);
    }
  }, [historyStorageKey]);
  
  /**
   * Speichert den aktuellen Suchverlauf im AsyncStorage
   */
  const saveSearchHistory = useCallback(async (newHistory: string[]) => {
    try {
      await AsyncStorage.setItem(historyStorageKey, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Fehler beim Speichern des Suchverlaufs', error);
    }
  }, [historyStorageKey]);
  
  /**
   * Fügt eine Suchanfrage zum Verlauf hinzu und speichert sie
   */
  const addToSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setSearchHistory(prevHistory => {
      // Duplikate vermeiden und neuen Eintrag an den Anfang setzen
      const newHistory = [
        query, 
        ...prevHistory.filter(item => item !== query)
      ].slice(0, maxHistoryItems);
      
      // Speichern des neuen Verlaufs
      saveSearchHistory(newHistory);
      
      return newHistory;
    });
  }, [saveSearchHistory, maxHistoryItems]);

  /**
   * Führt die eigentliche Suche durch und verarbeitet die Ergebnisse
   * Enthält vollständige Fehlerbehandlung und Abbruchlogik
   */
  const performSearch = useCallback(async (options: SearchOptions) => {
    // Analytisches Tracking
    trackSearch(options.query, true);
    
    try {
      setIsSearching(true);
      setError(null);
      
      // Vorherige Suche abbrechen
      if (cancelSearchRef.current) {
        cancelSearchRef.current();
      }
      
      // Neue Suche starten
      const searchServiceInstance = new SearchService();
      cancelSearchRef.current = searchServiceInstance.searchWithDelay(
        { ...options, debounceMs: searchDebounceMs },
        (response) => {
          if (!isMountedRef.current) return;
          
          setSearchResults(response);
          setIsSearching(false);
          setLastSearched(new Date());
          
          // Analytik aktualisieren
          trackSearch(options.query, response.results.length > 0);
          
          // Callback für Suchergebnisse
          if (onSearchResults) {
            onSearchResults(response);
          }
          
          // Automatisch zur Ergebnisseite navigieren
          if (autoNavigateToResults && response.results.length > 0) {
            navigateToResults(options.query, response);
          }
        },
        (error) => {
          if (!isMountedRef.current) return () => {};
          
          setIsSearching(false);
          setError(error);
          console.error('Fehler bei der Suche:', error);
        }
      );
      
      return cancelSearchRef.current;
    } catch (error) {
      if (!isMountedRef.current) return () => {};
      
      const typedError = error as Error;
      setIsSearching(false);
      setError(typedError);
      console.error('Fehler bei performSearch:', typedError.message);
      return () => {}; // Leere Abbruchfunktion
    }
  }, [onSearchResults, autoNavigateToResults, searchDebounceMs, trackSearch]);

  /**
   * Navigiert zur Suchergebnisseite mit den relevanten Parametern
   */
  const navigateToResults = useCallback((query: string, response?: SearchResponse) => {
    // Erstelle typensichere Parameter
    const params: SearchResultsParams = {
      query,
      initialFilters: activeFilters,
      sortOption: sortOptionState,
      source: 'home'
    };
    try {
      // Konvertiere Parameter in URL-Parameter mit Hilfsfunktion
      const urlParams = createSearchUrlParams(params);
      // Typkonvertierung für URLSearchParams
      const urlParamsStringRecord: Record<string, string> = Object.fromEntries(
        Object.entries(urlParams).filter(([_, v]) => v !== undefined)
      );
      const searchParams = new URLSearchParams(urlParamsStringRecord).toString();
      router.push(`/search-results?${searchParams}`);
      // Tracking für erfolgreiche Navigation
      if (response) {
        trackSearch(query, response.results.length > 0);
      }
    } catch (error) {
      setError(new Error('Navigation zu Suchergebnissen fehlgeschlagen'));
    }
  }, [router, activeFilters, sortOptionState, trackSearch]);

  /**
   * Führt eine Suche aus basierend auf der aktuellen Abfrage
   */
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    // Suchbegriff zum Verlauf hinzufügen
    addToSearchHistory(searchQuery);
    
    if (autoNavigateToResults) {
      // Zu den Suchergebnissen navigieren
      try {
        // Erstelle typensichere Parameter
        const params: SearchResultsParams = {
          query: searchQuery,
          initialFilters: activeFilters,
          sortOption: sortOptionState,
          source: 'home'
        };
        
        // Konvertiere Parameter in URL-Parameter mit Hilfsfunktion
        const urlParams = createSearchUrlParams(params);
        
        // Typkonvertierung für URLSearchParams
        const urlParamsStringRecord: Record<string, string> = Object.fromEntries(
          Object.entries(urlParams).filter(([_, v]) => v !== undefined)
        );
        
        const searchParams = new URLSearchParams(urlParamsStringRecord).toString();
        router.push(`/search-results?${searchParams}`);
        
        // Tracking für erfolgreiche Navigation
        trackSearch(searchQuery, true);
      } catch (error) {
        console.error('Fehler bei der Navigation zu den Suchergebnissen:', error);
      }
    } else {
      // Suche durchführen, ohne zu navigieren
      const cancelSearch = await performSearch({
        query: searchQuery,
        filters: activeFilters,
        sort: sortOptionState,
      });
      
      return () => {
        if (cancelSearch) cancelSearch();
      };
    }
  }, [searchQuery, autoNavigateToResults, router, activeFilters, sortOptionState, addToSearchHistory, performSearch, trackSearch]);

  /**
   * Lädt weitere Suchergebnisse (für Pagination)
   */
  const loadMoreResults = useCallback(() => {
    if (!searchQuery.trim() || !searchResults || !searchResults.hasMore || isSearching) return;
    
    const nextPage = currentPage + 1;
    
    // Suche mit nächster Seite durchführen
    performSearch({
      query: searchQuery,
      page: nextPage,
      sort: sortOptionState,
      filters: activeFilters,
    });
    
    setCurrentPage(nextPage);
  }, [
    searchQuery, 
    searchResults, 
    isSearching, 
    currentPage, 
    performSearch, 
    sortOptionState, 
    activeFilters
  ]);

  /**
   * Setzt eine Vorschlagsquery als aktuelle Suchanfrage und führt die Suche aus
   */
  const handleSuggestionPress = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.label);
    
    // Zum Suchverlauf hinzufügen
    addToSearchHistory(suggestion.label);
    
    // Suche durchführen
    performSearch({
      query: suggestion.label,
      page: 1,
      sort: sortOptionState,
      filters: activeFilters,
    });
    
    // Setze CurrentPage zurück
    setCurrentPage(1);
  }, [addToSearchHistory, performSearch, sortOptionState, activeFilters]);

  /**
   * Setzt die aktiven Filter und führt optional eine neue Suche durch
   */
  const setSearchFilters = useCallback((filters: SearchFilterOptions) => {
    setActiveFilters(filters);
    
    // Wenn eine aktive Suche vorhanden ist, führe sie mit den neuen Filtern erneut aus
    if (searchQuery.trim() && lastSearched) {
      performSearch({
        query: searchQuery,
        page: 1,
        sort: sortOptionState,
        filters,
      });
      
      // Setze CurrentPage zurück
      setCurrentPage(1);
    }
  }, [searchQuery, lastSearched, performSearch, sortOptionState]);

  /**
   * Setzt die Sortierungsoption und führt optional eine neue Suche durch
   */
  const setSortOption = useCallback((option: SearchSortOption) => {
    setSortOptionState(option);
    
    // Wenn eine aktive Suche vorhanden ist, führe sie mit der neuen Sortierung erneut aus
    if (searchQuery.trim() && lastSearched) {
      performSearch({
        query: searchQuery,
        page: 1,
        sort: option,
        filters: activeFilters,
      });
      
      // Setze CurrentPage zurück
      setCurrentPage(1);
    }
  }, [searchQuery, lastSearched, performSearch, activeFilters]);

  /**
   * Setzt die Suche zurück (löscht die aktuelle Anfrage)
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
    setError(null);
    setSearchResults(null);
    setCurrentPage(1);
    
    // Breche laufende Suchen ab
    if (cancelSearchRef.current) {
      cancelSearchRef.current();
      cancelSearchRef.current = null;
    }
  }, []);

  /**
   * Löscht den Suchverlauf
   */
  const clearHistory = useCallback(async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem(historyStorageKey);
    } catch (error) {
      console.error('Fehler beim Löschen des Suchverlaufs', error);
    }
  }, [historyStorageKey]);

  /**
   * Lädt personalisierten Vorschläge
   */
  const loadPersonalizedSuggestions = useCallback(() => {
    try {
      const personalizedSuggestions = getPersonalizedSuggestions();
      if (personalizedSuggestions.length > 0) {
        setSuggestions(personalizedSuggestions);
      }
    } catch (error) {
      console.error('Fehler beim Laden personalisierter Vorschläge', error);
    }
  }, []);

  /**
   * Filtert Suchvorschläge basierend auf Eingabe
   */
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Filter vorhandene Vorschläge basierend auf der Eingabe
      const filteredSuggestions = DEFAULT_SUGGESTIONS.filter(suggestion =>
        suggestion.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSuggestions(filteredSuggestions);
    } else {
      // Zeige Standardvorschläge oder personalisierte Vorschläge
      loadPersonalizedSuggestions();
    }
  }, [searchQuery, loadPersonalizedSuggestions]);

  /**
   * Lädt den Suchverlauf beim ersten Rendern
   */
  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  /**
   * Setzt den isMountedRef-Status für saubere Aufräumung
   */
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      // Clean-up: Breche laufende Suchen ab
      if (cancelSearchRef.current) {
        cancelSearchRef.current();
        cancelSearchRef.current = null;
      }
    };
  }, []);

  // Aktualisiere die Suchvorschläge, wenn sich die Sprache ändert
  useEffect(() => {
    if (showSuggestions) {
      setSuggestions(getPersonalizedSuggestions());
    }
  }, [showSuggestions, i18n.language]);

  /**
   * Öffentliche API des Hooks - strikt typisiert
   */
  return {
    // Zustandsdaten
    searchQuery,
    isSearching,
    suggestions,
    searchHistory,
    error,
    
    // Abgeleitete Daten
    showHistory,
    showSuggestions,
    
    // Aktionen
    setSearchQuery,
    handleSearch,
    handleSuggestionPress,
    clearSearch,
    clearHistory,
    
    // Filter- und Sortierfunktionen
    setSearchFilters,
    setSortOption,
    
    // Paginierung
    loadMoreResults,
    searchResults,
    
    // Metadaten
    lastSearched,
  };
} 