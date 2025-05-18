import React from "react";

/**
 * Home-Tab-Screen
 * 
 * Dieser Screen dient nur als Container für die eigentliche HomeScreen-Komponente
 * aus dem features/home-Verzeichnis. So wird eine klare Trennung zwischen
 * Routing/Navigation und der eigentlichen Implementierung erreicht.
 */
import HomeScreen from '@/features/home/screens/HomeScreen';

/**
 *
 */
export default function HomeTabScreen() {
  return <HomeScreen />;
} 
