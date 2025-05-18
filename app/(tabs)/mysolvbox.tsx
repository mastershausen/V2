import React from "react";

/**
 * MySolvbox-Tab-Screen
 * 
 * Dieser Screen dient nur als Container für die eigentliche MySolvboxScreen-Komponente
 * aus dem features/mysolvbox-Verzeichnis. So wird eine klare Trennung zwischen
 * Routing/Navigation und der eigentlichen Implementierung erreicht.
 */
import MySolvboxScreen from '@/features/mysolvbox/screens/MySolvboxScreen';

/**
 *
 */
export default function MySolvboxTabScreen() {
  return <MySolvboxScreen />;
} 