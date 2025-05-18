/**
 * mysolvboxStore - Verwaltung des MySolvbox-Zustands
 * 
 * Hier wird der MySolvbox-spezifische Zustand verwaltet, einschließlich
 * - Aktiver Tab
 * - Kacheln für den aktiven Tab
 * - Feature-spezifische Einstellungen
 */
import { z } from 'zod';

import { createStoreSchema, registerStore } from '@/utils/store/migrationManager';

import { createMySolvboxActions } from './actions/mysolvboxActions';
import { MySolvboxState, MySolvboxStore } from './types/mysolvboxTypes';
import { createStore } from './utils/createStore';

// Schema für die Validierung des MySolvbox-Stores
const mysolvboxStateSchema = createStoreSchema({
  activeTab: z.string(),
  tiles: z.array(z.any()).optional(),
  lastLoaded: z.string().optional(),
  isLoading: z.boolean().optional(),
  error: z.string().nullable().optional()
});

// Initialer Zustand
const initialState: MySolvboxState = {
  activeTab: 'save', // Default Tab
  tiles: [],
  lastLoaded: undefined
};

// Registriere den Store beim MigrationManager
registerStore('mysolvbox', {
  schema: mysolvboxStateSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: 'MySolvboxStore'
});

/**
 * Der mysolvboxStore verwaltet den MySolvbox-spezifischen Zustand der Anwendung.
 */
export const useMysolvboxStore = createStore<MySolvboxStore, MySolvboxState>(
  (set, get) => {
    // Erstelle die Aktionen
    const actions = createMySolvboxActions(set, get);
    
    // Kombiniere alles zu einem Store
    return {
      // Initialer Zustand
      ...initialState,
      
      // Aktionen
      ...actions,
    };
  },
  {
    name: 'mysolvbox',
    persist: true,
    initialState,
    partialize: (state) => ({
      activeTab: state.activeTab,
      tiles: state.tiles,
      lastLoaded: state.lastLoaded
    }),
  }
); 