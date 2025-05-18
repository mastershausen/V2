import React from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { TileData, MySolvboxTabId } from '@/features/mysolvbox/types';

export const TILE_SPACING = spacing.xs * 2; // 8 (spacing.s)
export const HORIZONTAL_PADDING = spacing.m; // 16

/**
 * Props für die BaseTabScreen-Komponente
 */
interface BaseTabScreenProps<T extends TileData> {
  /**
   * Kinder-Komponenten
   */
  children: React.ReactNode;
  
  /**
   * Tab-ID für Tracking und Analytics
   */
  tabId?: MySolvboxTabId;
  
  /**
   * Gibt an, ob der Inhalt gerade geladen wird
   */
  isLoading?: boolean;
  
  /**
   * Optionale benutzerdefinierte Styles
   */
  style?: React.ComponentProps<typeof View>['style'];
  
  /**
   * Optionale benutzerdefinierte Styles für den Inhaltscontainer
   */
  contentContainerStyle?: React.ComponentProps<typeof ScrollView>['contentContainerStyle'];
}

/**
 * BaseTabScreen-Komponente
 * 
 * Eine wiederverwendbare Containerkomponente für Tab-Screens.
 * Unterstützt generische TileData-Typen für typsichere Verwendung mit spezialisierten Kacheln.
 * @param root0
 * @param root0.children
 * @param root0.tabId
 * @param root0.isLoading
 * @param root0.style
 * @param root0.contentContainerStyle
 */
export function BaseTabScreen<T extends TileData>({
  children,
  tabId,
  isLoading = false,
  style,
  contentContainerStyle
}: BaseTabScreenProps<T>) {
  return (
    <ScrollView 
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>{children}</>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: HORIZONTAL_PADDING - (TILE_SPACING / 2),
    paddingVertical: TILE_SPACING,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
}); 