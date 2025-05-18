/**
 * Mock-Daten für SolvboxAI-Tests
 */
import { SolvboxAITile } from "../../types/tiles";

/**
 * Mockt die Tile-Daten für SolvboxAI
 */
export const mockTiles: SolvboxAITile[] = [
  {
    id: 1,
    title: 'Marketing-Strategie',
    tabId: 'gigs',
    aiCategory: 'marketing',
    isActive: true,
    complexity: 'basic',
  },
  {
    id: 2,
    title: 'Finanzen & Controlling',
    tabId: 'casestudies',
    aiCategory: 'finance',
    isActive: true,
    complexity: 'advanced',
  },
  {
    id: 3,
    title: 'Personalmanagement',
    tabId: 'gigs',
    aiCategory: 'hr',
    isActive: true,
    complexity: 'expert',
  },
];

/**
 * Mockt die Empfehlungsdaten für SolvboxAI
 */
export const mockRecommendations: SolvboxAITile[] = [
  {
    id: 4,
    title: 'Marktanalyse',
    tabId: 'gigs',
    aiCategory: 'marketing',
    isActive: true,
    complexity: 'basic',
  },
  {
    id: 5,
    title: 'Budgetplanung',
    tabId: 'casestudies',
    aiCategory: 'finance',
    isActive: true,
    complexity: 'advanced',
  },
  {
    id: 6,
    title: 'Teambuilding',
    tabId: 'gigs',
    aiCategory: 'hr',
    isActive: true,
    complexity: 'basic',
  },
]; 