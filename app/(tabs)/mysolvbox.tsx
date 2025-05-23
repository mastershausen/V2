import React from "react";

/**
 * MySolvbox-Tab-Screen (Explore)
 * 
 * Dieser Screen dient nur als Container für die eigentliche ExploreScreen-Komponente
 * aus dem features/mysolvbox-Verzeichnis. So wird eine klare Trennung zwischen
 * Routing/Navigation und der eigentlichen Implementierung erreicht.
 */
import ExploreScreen from '@/features/mysolvbox/screens/Explore';

/**
 * Tab-Screen für den Explore-Bereich
 */
export default function MySolvboxTabScreen() {
  return <ExploreScreen />;
} 