/**
 * @file features/build/components/BuildIndicator.tsx
 * @description Komponente zur Anzeige des aktuellen Build-Typs
 * 
 * Diese Komponente zeigt den aktuellen Build-Typ an und ist nützlich für
 * Debugging-Zwecke. Sie sollte nur in Entwicklungsumgebungen sichtbar sein.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useBuildType } from '../hooks/useBuildType';

interface BuildIndicatorProps {
  /** Ob der Indikator immer sichtbar sein soll, auch in Produktionsumgebungen */
  alwaysShow?: boolean;
}

/**
 * Komponente zur Anzeige des aktuellen Build-Typs
 * Standardmäßig nur in Debug-Umgebungen sichtbar
 */
export function BuildIndicator({ alwaysShow = false }: BuildIndicatorProps) {
  const { buildType, isDebugEnabled } = useBuildType();
  
  // Wenn nicht im Debug-Modus und nicht explizit angefordert, nicht anzeigen
  if (!isDebugEnabled && !alwaysShow) {
    return null;
  }
  
  // Farbe basierend auf Build-Typ
  const getColorForBuildType = () => {
    switch (buildType) {
      case 'dev': return '#4CAF50'; // Grün
      case 'demo': return '#2196F3'; // Blau
      case 'staging': return '#FF9800'; // Orange
      case 'live': return '#F44336'; // Rot
      default: return '#9E9E9E'; // Grau
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: getColorForBuildType() }]}>
      <Text style={styles.text}>{buildType.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    opacity: 0.9,
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 