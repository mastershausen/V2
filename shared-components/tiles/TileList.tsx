import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { TileGrid } from '@/shared-components/container/TileGrid';
import { BaseTileData } from '@/types/tile-data';

interface TileListProps<T extends BaseTileData> {
  tiles: T[];
  isLoading?: boolean;
  onTilePress?: (id: number) => void;
}

/**
 * Allgemeine TileList-Komponente, die TileGrid verwendet
 * 
 * Diese Komponente dient als Adapter für die existierende TileGrid-Komponente,
 * um eine einheitliche API in verschiedenen Kontexten zu gewährleisten.
 * @param root0
 * @param root0.tiles
 * @param root0.isLoading
 * @param root0.onTilePress
 */
export function TileList<T extends BaseTileData>({
  tiles,
  isLoading = false,
  onTilePress = () => {}
}: TileListProps<T>): React.ReactElement {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TileGrid 
      tiles={tiles}
      onTilePress={onTilePress}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: spacing.m,
    alignItems: 'center',
    justifyContent: 'center'
  }
}); 