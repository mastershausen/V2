/**
 * solvboxAI-Store - Vereinfachte Version
 */
import { z } from 'zod';

import {createStoreSchema, registerStore} from '@/utils/store/migrationManager';

import { SolvboxaiState, SolvboxaiStore } from './types/solvboxaiTypes';
import { createStore } from './utils/createStore';

// Schema für die Validierung des SolvboxAI-Stores (nur für Migrationszwecke)
const solvboxaiStateSchema = createStoreSchema({
  activeTab: z.string(),
  tiles: z.array(z.any()),
  recommendations: z.array(z.any()),
  lastLoaded: z.string().optional(),
  recommendationsLoaded: z.string().optional(),
  isLoading: z.boolean().optional(),
  error: z.string().nullable().optional()
});

// Initialer Zustand
const initialState: SolvboxaiState = {
  activeTab: 'gigs',
  tiles: [],
  recommendations: [],
  lastLoaded: undefined,
  recommendationsLoaded: undefined,
  isLoading: false,
  error: null
};

// Registriere den Store beim MigrationManager
registerStore('solvboxai', {
  schema: solvboxaiStateSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: 'SolvboxAIStore'
});

// Einfache Store-Implementierung
export const useSolvboxaiStore = createStore<SolvboxaiStore, SolvboxaiState>(
  (set, get) => ({
    // Anfangszustand
    ...initialState,

    // Aktionen
    setActiveTab: (tab: string) => {
      set({ activeTab: tab });
    },

    loadTabTiles: async (forceRefresh = false) => {
      set({ isLoading: true });
      // Demo-Daten simulieren
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const tabId = get().activeTab as 'gigs' | 'casestudies';
      
      set({ 
        tiles: [
          { id: 1, title: 'Demo Tile 1', tabId, aiCategory: 'Kategorie 1' },
          { id: 2, title: 'Demo Tile 2', tabId, aiCategory: 'Kategorie 2' }
        ],
        lastLoaded: Date.now().toString(),
        isLoading: false
      });
    },

    getTabs: () => ['gigs', 'casestudies'],

    loadRecommendations: async () => {
      // Demo-Implementierung
      await new Promise(resolve => setTimeout(resolve, 300));
      set({
        recommendations: [
          { id: 3, title: 'Empfehlung 1', tabId: 'gigs', aiCategory: 'Kategorie 1' },
          { id: 4, title: 'Empfehlung 2', tabId: 'casestudies', aiCategory: 'Kategorie 2' }
        ],
        recommendationsLoaded: Date.now().toString()
      });
    },

    markTileAsUsed: (id: number) => {
      // Einfach nur loggen
      console.log(`Tile ${id} als benutzt markiert`);
    },

    sendFeedback: async (id: number, rating: number, comment?: string) => {
      // Einfach nur loggen
      console.log(`Feedback für Tile ${id}: ${rating}/5, Kommentar: ${comment || 'keiner'}`);
    }
  }),
  {
    name: 'solvboxai',
    persist: true,
    initialState,
    partialize: (state) => ({
      activeTab: state.activeTab
    })
  }
); 