import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { themeColors } from '@/config/theme/colors';
import { spacing } from '@/config/theme/spacing';
import { ui } from '@/config/theme/ui';
import { TileData } from '@/features/mysolvbox/types';
import { TileCard } from '@/shared-components/cards/TileCard';
import { TILE_SPACING, HORIZONTAL_PADDING } from '@/shared-components/container/BaseTabScreen';
import { ErrorBoundary } from '@/shared-components/utils/ErrorBoundary';

/**
 * Props für die TileGrid-Komponente
 */
interface TileGridProps<T extends TileData> {
  /**
   * Die anzuzeigenden Kacheln
   */
  tiles: T[];
  
  /**
   * Handler für Klicks auf Kacheln
   */
  onTilePress: (id: number) => void;
  
  /**
   * Optionale benutzerdefinierte Styles
   */
  style?: React.ComponentProps<typeof View>['style'];
  
  /**
   * Fallback-Komponente bei Fehlern
   */
  errorFallback?: React.ReactNode;
  
  /**
   * Komponente, die angezeigt wird, wenn keine Kacheln vorhanden sind
   */
  emptyComponent?: React.ReactNode;
  
  /**
   * Anzahl der Kacheln pro Reihe
   */
  tilesPerRow?: number;
}

/**
 * TileGrid-Komponente
 *
 * Eine wiederverwendbare Komponente zur Anzeige eines Rasters von Kacheln
 * mit konsistenter Fehlerbehandlung und leerem Zustand.
 *
 * Der generische Typ T erlaubt die Verwendung mit verschiedenen spezialisierten
 * Kacheltypen (SaveTileData, GrowTileData, etc.) bei voller Typsicherheit.
 * @param root0
 * @param root0.tiles
 * @param root0.onTilePress
 * @param root0.style
 * @param root0.errorFallback
 * @param root0.emptyComponent
 * @param root0.tilesPerRow
 */
export function TileGrid<T extends TileData>({
  tiles,
  onTilePress,
  style,
  errorFallback = (
    <View style={styles.errorContainer}>
      <View style={styles.errorMessage}>
        <View style={styles.textContainer}>
          <View><View style={styles.textLine}></View></View>
          <View><View style={[styles.textLine, styles.shortLine]}></View></View>
        </View>
      </View>
    </View>
  ),
  emptyComponent = (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyMessage}>
        <View style={styles.textContainer}>
          <View><View style={styles.textLine}></View></View>
        </View>
      </View>
    </View>
  ),
  tilesPerRow = 3
}: TileGridProps<T>) {
  // Prüfe, ob Kacheln vorhanden sind
  const hasTiles = Array.isArray(tiles) && tiles.length > 0;
  
  // Berechnungen für die Kachelgrößen
  const calculatedValues = useMemo(() => {
    return {
      tileSpacing: TILE_SPACING,
      horizontalPadding: HORIZONTAL_PADDING,
      tilesPerRow
    };
  }, [tilesPerRow]);
  
  // Fehler-Handler für die ErrorBoundary
  const handleError = (error: Error) => {
    console.error('Fehler in TileGrid:', error);
  };
  
  return (
    <ErrorBoundary
      fallback={errorFallback}
      onError={handleError}
    >
      {!hasTiles ? (
        // Wenn keine Kacheln vorhanden sind, zeige die leere Komponente
        emptyComponent
      ) : (
        // Wenn Kacheln vorhanden sind, rendere sie
        <View style={[styles.container, style]}>
          {tiles.map((tile, index) => {
            // Array in Gruppen von je 3 Elementen aufteilen
            const rowIndex = Math.floor(index / 3);
            const columnIndex = index % 3;
            
            return (
              <View 
                key={`tile-${tile.id}`} 
                style={styles.tileWrapper}
              >
                <TileCard
                  id={tile.id}
                  title={tile.title || 'Unbenannter Eintrag'}
                  onPress={onTilePress}
                  tilesPerRow={3}
                  tileSpacing={calculatedValues.tileSpacing}
                  horizontalPadding={calculatedValues.horizontalPadding}
                />
              </View>
            );
          })}
        </View>
      )}
    </ErrorBoundary>
  );
}

/**
 * Styles für die TileGrid-Komponente
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    padding: spacing.xs,
  },
  tileWrapper: {
    width: '30%',
    marginBottom: spacing.m,
    marginHorizontal: spacing.xxs,
  },
  errorContainer: {
    padding: spacing.m,
    width: '100%',
  },
  errorMessage: {
    backgroundColor: themeColors.light.error,
    borderRadius: ui.borderRadius.s,
    padding: spacing.m,
  },
  emptyContainer: {
    padding: spacing.m,
    width: '100%',
  },
  emptyMessage: {
    backgroundColor: themeColors.light.backgroundTertiary,
    borderRadius: ui.borderRadius.s,
    padding: spacing.m,
  },
  textContainer: {
    gap: spacing.s,
  },
  textLine: {
    height: spacing.m,
    backgroundColor: themeColors.light.divider,
    borderRadius: ui.borderRadius.xs,
    width: '100%',
  },
  shortLine: {
    width: '60%',
  },
  indicatorStrip: {
    height: 3,
    borderRadius: ui.borderRadius.xs,
  },
}); 