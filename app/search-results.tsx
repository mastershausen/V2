import React from 'react';

/**
 * Search Results Route
 * 
 * Dieser Screen dient nur als Container für die eigentliche SearchResultsScreen-Komponente
 * aus dem features/search-results-Verzeichnis. So wird eine klare Trennung zwischen
 * Routing/Navigation und der eigentlichen Implementierung erreicht.
 * 
 * Die Komponente folgt dem üblichen Muster der Anwendung, wo die eigentlichen
 * Implementierungen in features/ liegen und die app/-Dateien lediglich für
 * das Routing durch expo-router verwendet werden.
 */
import SearchResultsScreen from '@/features/search-results/screens';

export default function SearchResultsRoute() {
  return <SearchResultsScreen />;
} 