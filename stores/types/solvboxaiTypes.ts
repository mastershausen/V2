/**
 * SolvboxAI Typen - Vereinfachte Version
 */

import { SolvboxAITile } from '@/types/tiles';

// State-Interface
export interface SolvboxaiState {
  activeTab: string;
  tiles: SolvboxAITile[];
  recommendations: SolvboxAITile[];
  lastLoaded?: string;
  recommendationsLoaded?: string;
  isLoading: boolean;
  error: string | null;
}

// Store-Interface
export interface SolvboxaiStore extends SolvboxaiState {
  setActiveTab: (tab: string) => void;
  loadTabTiles: (forceRefresh?: boolean) => Promise<void>;
  getTabs: () => string[];
  loadRecommendations: () => Promise<void>;
  markTileAsUsed: (id: number) => void;
  sendFeedback: (id: number, rating: number, comment?: string) => Promise<void>;
} 