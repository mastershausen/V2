/**
 * useSearch.ts - Gemeinsamer Basis-Hook für Suchfunktionalität
 * 
 * Dieser Hook stellt eine einheitliche API für die Suche bereit,
 * kapselt den Suchzustand und die Logik zur Verarbeitung von Suchanfragen.
 */

import { useState, useCallback } from 'react';

import { UseSearchOptions, UseTabSearchResult } from './types';

/**
 * Hook für einheitliches Suchmanagement
 * @param {UseSearchOptions} [options] - Konfigurationsoptionen für die Suche
 * @param {string} [options.initialQuery] - Initialer Suchbegriff, standardmäßig leer
 * @param {(query: string) => void} [options.onQueryChange] - Callback-Funktion, die bei Änderungen des Suchbegriffs aufgerufen wird
 * @returns {UseTabSearchResult} Funktionen und Daten für die Suche
 */
export default function useSearch(options?: UseSearchOptions): UseTabSearchResult {
  // Suche-Zustand
  const [searchQuery, setSearchQuery] = useState<string>(options?.initialQuery || '');

  /**
   * Handler für Suchänderungen
   */
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Wenn ein Callback definiert ist, rufe diesen auf
    if (options?.onQueryChange) {
      options.onQueryChange(query);
    } else {
      // Fallback: Logge die Suche
      console.log('Suche nach:', query);
    }
  }, [options]);

  return {
    searchQuery,
    setSearchQuery,
    handleSearchChange
  };
} 