/**
 * Zentrale Typdefinitionen für den MySolvbox-Bereich
 * 
 * Diese Datei enthält alle gemeinsam genutzten Typendefinitionen für die MySolvbox-Funktionalität,
 * um die Typsicherheit und Wartbarkeit der Komponenten zu verbessern.
 */

import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { TabConfig } from '@/shared-components/container/TabScreensContainer';
import { BaseTabConfig } from '@/shared-components/navigation/BaseTabbar';
import { BaseTileData } from '@/types/tile-data';

/**
 * Definiert die zulässigen Tab-IDs für MySolvbox als Literal-Typ
 */
export type MySolvboxTabId = 'save' | 'grow' | 'foresight' | 'bonus';

/**
 * Alternative Benennung für konsistente Kodierung
 * @internal
 */
export type SolvboxTabId = MySolvboxTabId;

/**
 * Konfiguration für jeden MySolvbox-Tab
 */
export interface MySolvboxTabConfig extends TabConfig {
  id: MySolvboxTabId;
}

/**
 * Alternative Benennung für konsistente Kodierung
 * @internal
 */
export type SolvboxTabConfig = MySolvboxTabConfig;

/**
 * Props für die MySolvbox-Tabbar
 */
export interface MySolvboxTabbarProps {
  activeTab: MySolvboxTabId;
  onTabPress: (tabId: MySolvboxTabId) => void;
  scrollOffset?: number;
  screenWidth?: number;
  style?: StyleProp<ViewStyle>;
  tabItemStyle?: StyleProp<ViewStyle>;
  tabLabelStyle?: StyleProp<TextStyle>;
  tabs?: BaseTabConfig[];
}

/**
 * Alternative Benennung für Container-Komponenten mit konsistenter Namensgebung
 * @internal
 */
export type TabbarProps = MySolvboxTabbarProps;

/**
 * Ergebnis des MySolvbox-Hooks
 */
export interface UseMySolvboxResult {
  activeTab: MySolvboxTabId;
  setActiveTab: (tabId: MySolvboxTabId) => void;
  tabs: MySolvboxTabConfig[];
}

/**
 * Alternative Benennung für konsistente Kodierung
 * @internal
 */
export type UseSolvboxResult = UseMySolvboxResult;

/**
 * Basisdaten für alle Kacheln
 */
export interface TileData {
  id: number;
  title: string;
  description?: string;
}

/**
 * Daten für Sparkacheln
 */
export interface SaveTileData extends TileData {
  category: 'cost' | 'revenue' | 'protection' | 'legal' | 'other';
}

/**
 * Daten für Wachstumskacheln
 */
export interface GrowTileData extends TileData {
  category: string;
  complexity?: string;
}

/**
 * Daten für Voraussichtskacheln
 */
export interface ForesightTileData extends TileData {
  category: string;
  timeHorizon?: string;
}

/**
 * Daten für Bonuskacheln
 */
export interface BonusTileData extends TileData {
  category: string;
  benefitType?: string;
}

/**
 * Union-Typ für alle spezialisierten Kacheltypen
 */
export type AnyTileData = SaveTileData | GrowTileData | ForesightTileData | BonusTileData;

/**
 * Mapping zwischen Tab-IDs und ihren spezifischen Datentypen
 */
export interface TabDataTypeMap {
  'save': SaveTileData;
  'grow': GrowTileData;
  'foresight': ForesightTileData;
  'bonus': BonusTileData;
}

/**
 * Basisstruktur für die Rückgabe aller Tab-Hooks
 */
export interface BaseTabHookResult<T extends TileData> {
  tiles: T[];
  handleTilePress: (tileId: number) => void;
  isLoading: boolean;
  error: Error | null;
} 