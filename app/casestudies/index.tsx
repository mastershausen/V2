import { Redirect } from 'expo-router';
import React from 'react';

/**
 * Route für die Auflistung aller Fallstudien wurde entfernt
 * Umleitung zum HomeScreen
 */
export default function CasestudiesRoute() {
  return <Redirect href="/(tabs)/home" />;
}
