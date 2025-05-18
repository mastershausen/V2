/**
 * Basis-Interface für alle Kacheln in der App
 */
export interface BaseTile {
  id: number;
  title: string;
  isActive?: boolean;
  sortOrder?: number;
  lastModified?: string;
}

/**
 * MySolvbox spezifische Kachel-Eigenschaften
 */
export interface MySolvboxTile extends BaseTile {
  tabId: 'save' | 'grow' | 'foresight' | 'bonus';
  category?: string;
  description?: string;
}

/**
 * SolvboxAI spezifische Kachel-Eigenschaften
 */
export interface SolvboxAITile extends BaseTile {
  tabId: 'gigs' | 'casestudies';
  aiCategory?: string;
  categories?: string[];
  complexity?: 'basic' | 'advanced' | 'expert';
  description?: string;
  imageUrl?: string;
  createdAt?: string;
}

/**
 * Tab-Konfiguration
 */
export interface TabConfig {
  id: string;
  label: string;
}

/**
 * Response-Format für die zukünftige API
 */
export interface TileResponse {
  tiles: (MySolvboxTile | SolvboxAITile)[];
  version: string;
  lastUpdated: string;
} 