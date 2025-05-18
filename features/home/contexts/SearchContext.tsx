import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Keyboard } from 'react-native';

import { DEFAULT_SUGGESTIONS } from '../constants/suggestions';
import { SearchSuggestion } from '../types/search';

/**
 * Interface für den Search-Context
 */
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  handleSearch: () => void;
  suggestions: SearchSuggestion[];
  handleSuggestionPress: (suggestion: SearchSuggestion) => void;
  clearSearch: () => void;
}

/**
 * Props für den SearchProvider
 */
interface SearchProviderProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

// Context erstellen mit Standardwerten
const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  isSearching: false,
  handleSearch: () => {},
  suggestions: [],
  handleSuggestionPress: () => {},
  clearSearch: () => {},
});

/**
 * Provider für den Suchkontext
 * Vereinfachte Version für MVP, kann später erweitert werden
 * @param props - Die Props für den Provider
 * @param props.children - Die Child-Komponenten
 * @param props.onSearch - Optional: Callback-Funktion für Suchanfragen
 * @returns Der SearchProvider mit Context
 */
export function SearchProvider({ children, onSearch }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions] = useState<SearchSuggestion[]>(DEFAULT_SUGGESTIONS);
  
  // Suchfunktion
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    Keyboard.dismiss();
    setIsSearching(true);
    
    // Falls eine Callback-Funktion übergeben wurde, rufe sie auf
    if (onSearch) {
      onSearch(searchQuery);
    }
    
    // Für MVP: Setze isSearching direkt zurück
    // Bei Anbindung an Backend würde dies asynchron passieren
    setIsSearching(false);
  };
  
  // Behandelt das Auswählen eines Vorschlags
  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.label);
    handleSearch();
  };
  
  // Löscht die Suche
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };
  
  const value = {
    searchQuery,
    setSearchQuery,
    isSearching,
    handleSearch,
    suggestions,
    handleSuggestionPress,
    clearSearch
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

/**
 * Hook zum Zugriff auf den SearchContext
 * @returns Die Werte und Funktionen des SearchContext
 */
export const useSearch = () => useContext(SearchContext); 