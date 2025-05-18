import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

import SearchService from '../services/SearchService';
import {
  SearchFilterOptions,
  SearchOptions,
  SearchResponse,
  SearchResult,
  SearchSortOption,
  SearchSuggestion,
} from '../types/search';

/**
 * Standardvorschläge für die Suche
 */
const DEFAULT_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', label: 'Steuern sparen', icon: 'cash-outline' },
  { id: '2', label: 'Finanzplanung', icon: 'calculator-outline' },
  { id: '3', label: 'Versicherungen', icon: 'shield-outline' },
  { id: '4', label: 'Investment', icon: 'trending-up-outline' },
  { id: '5', label: 'Altersvorsorge', icon: 'hourglass-outline' },
];

// Speicherkey für den Suchverlauf
const SEARCH_HISTORY_KEY = 'homeSearchHistory';

// Maximale Anzahl Einträge im Suchverlauf
const MAX_HISTORY_ITEMS = 10;

/**
 * Props für den useHomeSearch-Hook
 */
export interface UseHomeSearchProps {
  /**
   * Callback-Funktion für Suchergebnisse
   */
  onSearchResults?: (results: SearchResponse) => void;
  
  /**
   * Gibt an, ob automatisch zur Ergebnisseite navigiert werden soll
   */
  autoNavigateToResults?: boolean;
  
  /**
   * Standardfilter für die Suche
   */
  defaultFilters?: SearchFilterOptions;
}

/**
 * Hook für die erweiterte Verwaltung der Suchfunktion auf dem Home-Screen
 *
 * Bietet Funktionen für Suche, Suchvorschläge und speichert den Suchverlauf
 * @param {UseHomeSearchProps} props - Optionen für den Hook
 * @returns {object} Funktionalität für die Suchkomponente inklusive State und Handlers
 */
export function useHomeSearch({
  onSearchResults,
  autoNavigateToResults = true,
  defaultFilters,
}: UseHomeSearchProps = {}) {
  // Navigation hook für Weiterleitung zu Ergebnissen
  const navigation = useNavigation();
  
  // State für die Suche
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>(DEFAULT_SUGGESTIONS);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // State für Suchergebnisse
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<SearchFilterOptions>(defaultFilters || {});
  const [sortOption, setSortOption] = useState<SearchSortOption>(SearchSortOption.RELEVANCE);
  
  // Ref für Suchabbruch
  const cancelSearchRef = useRef<(() => void) | null>(null);
  
  /**
   * Lädt den gespeicherten Suchverlauf aus dem AsyncStorage
   */
  const loadSearchHistory = useCallback(async () => {
    try {
      const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (historyJson) {
        setSearchHistory(JSON.parse(historyJson));
      }
    } catch (error) {
      // Fehler beim Laden des Suchverlaufs
    }
  }, []);
  
  /**
   * Lädt den Suchverlauf beim ersten Rendern
   */
  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);
  
  /**
   * Speichert den aktuellen Suchverlauf im AsyncStorage
   */
  const saveSearchHistory = useCallback(async (newHistory: string[]) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      // Fehler beim Speichern des Suchverlaufs
    }
  }, []);
  
  /**
   * Fügt eine Suchanfrage zum Verlauf hinzu
   */
  const addToSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setSearchHistory(prevHistory => {
      // Duplikate vermeiden und neuen Eintrag an den Anfang setzen
      const newHistory = [
        query, 
        ...prevHistory.filter(item => item !== query)
      ].slice(0, MAX_HISTORY_ITEMS);
      
      // Speichern des neuen Verlaufs
      saveSearchHistory(newHistory);
      
      return newHistory;
    });
  }, [saveSearchHistory]);
  
  /**
   * Führt die eigentliche Suche durch und verarbeitet die Ergebnisse
   */
  const performSearch = useCallback(async (options: SearchOptions) => {
    try {
      setIsSearching(true);
      setSearchError(null);
      
      // Vorherige Suche abbrechen
      if (cancelSearchRef.current) {
        cancelSearchRef.current();
      }
      
      // Neue Suche starten
      cancelSearchRef.current = SearchService.searchWithDelay(
        options,
        (response) => {
          setSearchResults(response);
          setIsSearching(false);
          
          // Callback für Suchergebnisse
          if (onSearchResults) {
            onSearchResults(response);
          }
          
          // Automatisch zur Ergebnisseite navigieren
          if (autoNavigateToResults && response.results.length > 0) {
            // @ts-ignore - Navigation-Typ wird dynamisch bestimmt
            navigation.navigate('search-results', {
              query: options.query,
              results: response,
              filters: options.filters,
              sortOption: options.sort,
            });
          }
        },
        (error) => {
          setIsSearching(false);
          setSearchError(error);
        }
      );
    } catch (error) {
      setIsSearching(false);
      setSearchError(error as Error);
    }
  }, [onSearchResults, autoNavigateToResults, navigation]);
  
  /**
   * Führt eine Suche mit dem aktuellen Query durch
   */
  const handleSearch = useCallback(() => {
    // Tastatur schließen
    Keyboard.dismiss();
    
    if (!searchQuery.trim()) return;
    
    // Zum Suchverlauf hinzufügen
    addToSearchHistory(searchQuery);
    
    // Suche durchführen
    performSearch({
      query: searchQuery,
      page: 1,
      sort: sortOption,
      filters: activeFilters,
    });
    
    // Setze CurrentPage zurück, da dies eine neue Suche ist
    setCurrentPage(1);
  }, [searchQuery, addToSearchHistory, performSearch, sortOption, activeFilters]);
  
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
      sort: sortOption,
      filters: activeFilters,
    });
    
    setCurrentPage(nextPage);
  }, [
    searchQuery, 
    searchResults, 
    isSearching, 
    currentPage, 
    performSearch, 
    sortOption, 
    activeFilters
  ]);
  
  /**
   * Aktualisiert die Filter und führt eine neue Suche durch
   */
  const updateFilters = useCallback((filters: SearchFilterOptions) => {
    setActiveFilters(filters);
    
    if (searchQuery.trim()) {
      performSearch({
        query: searchQuery,
        page: 1,
        sort: sortOption,
        filters,
      });
      
      setCurrentPage(1);
    }
  }, [searchQuery, performSearch, sortOption]);
  
  /**
   * Aktualisiert die Sortierung und führt eine neue Suche durch
   */
  const updateSortOption = useCallback((option: SearchSortOption) => {
    setSortOption(option);
    
    if (searchQuery.trim()) {
      performSearch({
        query: searchQuery,
        page: 1,
        sort: option,
        filters: activeFilters,
      });
      
      setCurrentPage(1);
    }
  }, [searchQuery, performSearch, activeFilters]);
  
  /**
   * Setzt eine Vorschlagsquery als aktuelle Suchanfrage
   */
  const handleSuggestionPress = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.label);
    
    // Führe Suche mit dem Vorschlag durch
    addToSearchHistory(suggestion.label);
    
    performSearch({
      query: suggestion.label,
      page: 1,
      sort: sortOption,
      filters: activeFilters,
    });
    
    setCurrentPage(1);
  }, [addToSearchHistory, performSearch, sortOption, activeFilters]);
  
  /**
   * Löscht den Suchverlauf
   */
  const clearSearchHistory = useCallback(async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      // Fehler beim Löschen des Suchverlaufs
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
      setShowHistory(false);
    } else {
      // Zeige Standardvorschläge, wenn kein Suchtext vorhanden
      setSuggestions(DEFAULT_SUGGESTIONS);
      setShowHistory(true);
    }
  }, [searchQuery]);
  
  /**
   * Canceliere laufende Suchen beim Unmount
   */
  useEffect(() => {
    return () => {
      if (cancelSearchRef.current) {
        cancelSearchRef.current();
      }
    };
  }, []);
  
  return {
    // Suchzustand
    searchQuery,
    setSearchQuery,
    isSearching,
    searchError,
    
    // Suchfunktionen
    handleSearch,
    loadMoreResults,
    updateFilters,
    updateSortOption,
    
    // Suchvorschläge
    suggestions,
    handleSuggestionPress,
    
    // Suchverlauf
    searchHistory,
    showHistory,
    clearSearchHistory,
    
    // Suchergebnisse
    searchResults,
    activeFilters,
    sortOption,
    currentPage,
  };
} 