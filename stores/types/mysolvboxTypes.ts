/**
 * Typdefinitionen für den mysolvboxStore
 * 
 * Enthält alle Schnittstellendefinitionen für den mysolvboxStore,
 * einschließlich Zustandsdaten und Aktionen.
 */
import { MySolvboxTile } from '@/types/tiles';
import { TabConfig } from '@/types/tiles';

/**
 * Basis-Zustand für den MySolvbox-Store
 * Enthält nur die State-Eigenschaften, keine Aktionen
 */
export interface MySolvboxState {
  // Tab- und Tile-Zustand
  activeTab: string;
  tiles?: MySolvboxTile[];
  lastLoaded?: string;
  
  // Lade- und Fehlerzustand
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Vollständiger mysolvboxStore-Typ mit allen Funktionen
 */
export interface MySolvboxStore extends MySolvboxState {
  // Tab-Verwaltung
  setActiveTab: (tab: string) => void;
  
  // Kachel-Operationen
  loadTabTiles: (forceRefresh?: boolean) => Promise<void>;
  
  // Zustandsmanagement
  resetLoadingState: () => void;
  clearError: () => void;
} 