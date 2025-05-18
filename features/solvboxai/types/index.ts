/**
 * Zentrale Typdefinitionen für das SolvboxAI-Feature.
 * Diese Datei enthält alle Typen, die über mehrere Komponenten im SolvboxAI-Modul geteilt werden.
 */

import { StyleProp, TextStyle, ViewStyle, ImageSourcePropType } from 'react-native';

import { BaseTabConfig } from '@/shared-components/navigation/BaseTabbar';
import { UseTabScreenResult } from '@/shared-hooks/types';
import { TabConfigBase } from '@/shared-hooks/useTabs';
import { BaseTileData } from '@/types/tile-data';

/**
 * Union-Typ aller gültigen Tab-IDs in SolvboxAI
 */
export type SolvboxAITabId = 'gigs' | 'casestudies';

/**
 * Tab-Konfiguration spezifisch für SolvboxAI
 */
export interface SolvboxAITabConfig extends TabConfigBase {
  id: SolvboxAITabId;
}

/**
 * Struktur einer typisierten Kategorie 
 */
export interface Category {
  id: string;
  label: string;
}

/**
 * Basis-Interface für alle Kachel-Daten in SolvboxAI
 */
export interface SolvboxAITileData {
  id: string | number; // Unterstützt sowohl String- als auch Zahlen-IDs für Kompatibilität
  title: string;
  description: string;
  subtitle?: string; // Für Kompatibilität mit den Mockdaten
  imageUrl?: string;
  imagePlaceholder?: ImageSourcePropType;
  categories?: string[];
  categoryLabels?: string[];
  tabId?: SolvboxAITabId;
  type?: 'gig' | 'casestudy'; // Für Kompatibilität mit vorhandener Implementierung
  isActive?: boolean; // Für Kompatibilität mit vorhandenem Code
  sortOrder?: number; // Für die Reihenfolge der Anzeige
  aiPromptExample?: string; // Beispiel-Prompt für KI-Anfragen
}

// Wir behalten SolvboxAIBaseTileData als Kompatibilitätsalias
export type SolvboxAIBaseTileData = SolvboxAITileData;

/**
 * Mapping von Tab-IDs zu ihren entsprechenden Kachel-Typ-Daten
 */
export interface SolvboxAITabDataMap {
  'gigs': GigTileData[];
  'casestudies': CaseStudyTileData[];
}

/**
 * Spezialisierter Typ für Gig-Kacheln
 */
export interface GigTileData extends SolvboxAITileData {
  complexity?: 'einfach' | 'mittel' | 'komplex';
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  duration?: string;
  requiredSkills?: string[];
  type: 'gig'; // Dieser Typ sollte immer 'gig' sein
}

/**
 * Spezialisierter Typ für Fallstudien-Kacheln
 */
export interface CaseStudyTileData extends SolvboxAITileData {
  industry?: string;
  companySize?: 'small' | 'medium' | 'large';
  resultSummary?: string;
  company?: string;
  results?: string[];
  implementationTime?: string;
  type: 'casestudy'; // Dieser Typ sollte immer 'casestudy' sein
}

/**
 * Props für TabScreen Komponenten
 */
export interface TabScreenProps {
  isActive: boolean;
}

/**
 * Ergebnis-Typ für den useSolvboxAI-Hook
 */
export interface UseSolvboxAIResult {
  // Tab-Navigation
  activeTab: SolvboxAITabId;
  activeTabId?: SolvboxAITabId; // Alias für Kompatibilität
  setActiveTab: (tabId: SolvboxAITabId) => void;
  handleTabChange: (index: string | number) => void;
  handleSwipeEnd: (index: string | number) => void;
  tabs: BaseTabConfig[];
  
  // Suche
  searchTerm: string;
  onSearchChange: (term: string) => void;
  handleSearchChange?: (term: string) => void; // Alias für Kompatibilität
  onSearchClear: () => void;
  
  // Kategorien
  selectedCategory: string | null;
  onCategoryChange?: (category: string | null) => void;
  
  // Status
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Daten
  filteredTiles: SolvboxAITileData[];
  
  // Aktionen
  refresh: () => Promise<void>;
}

/**
 * Ergebnis-Typ für den useGigsTab-Hook
 */
export interface UseGigsTabResult {
  tiles: GigTileData[];
  handleTilePress: (tile: GigTileData) => void;
  isLoading: boolean;
  error: Error | null;
  handleRefresh?: () => void;
}

/**
 * Ergebnis-Typ für den useCaseStudiesTab-Hook
 */
export interface UseCaseStudiesTabResult {
  tiles: CaseStudyTileData[];
  handleTilePress: (tile: CaseStudyTileData) => void;
  isLoading: boolean;
  error: Error | null;
  handleRefresh?: () => void;
}

/**
 * Basis-Hook-Ergebnis für alle Tab-Hooks
 */
export interface BaseTabHookResult<T extends SolvboxAITileData> {
  tiles: T[];
  handleTilePress: (tile: T) => void;
  isLoading: boolean;
  error: Error | null;
  handleRefresh?: () => void;
}

/**
 * Konfiguration für createTabHook
 */
export interface TabHookConfig<T extends SolvboxAITileData> {
  tabId: SolvboxAITabId;
  fetchData: () => Promise<T[]>;
  errorMessage: string;
  onTilePress?: (tile: T) => void;
}

/**
 * Props für die SolvboxAITabbarContainer-Komponente
 */
export interface SolvboxAITabbarContainerProps {
  activeTab: SolvboxAITabId;
  onTabPress: (tabId: SolvboxAITabId) => void;
}

/**
 * Props für die SolvboxAITabbar-Komponente
 * (reine UI-Komponente ohne Geschäftslogik)
 */
export interface SolvboxAITabbarProps {
  activeTab: SolvboxAITabId;
  onTabPress: (tabId: SolvboxAITabId) => void;
  scrollOffset?: number;
  screenWidth?: number;
  style?: StyleProp<ViewStyle>;
  tabItemStyle?: StyleProp<ViewStyle>;
  tabLabelStyle?: StyleProp<TextStyle>;
  tabs?: BaseTabConfig[];
} 