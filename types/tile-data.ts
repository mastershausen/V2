/**
 * Basisdaten für eine Kachel in der App
 */
export interface BaseTileData {
  id: number;
  title: string;
  isActive?: boolean;
  sortOrder?: number;
} 