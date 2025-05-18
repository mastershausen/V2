/**
 * uiStore - Verwaltung des UI-Zustands
 * 
 * Hier wird der globale UI-Zustand verwaltet, einschließlich
 * - Theme (Light/Dark/System)
 * - UI-Status-Flags
 * - Lade-Zustände
 */
import { z } from 'zod';

import { createStoreSchema, registerStore } from '@/utils/store/migrationManager';

import { createUIActions } from './actions/uiActions';
import { createUISelectors } from './selectors/uiSelectors';
import {UIState, UIStore} from './types/uiTypes';
import { createStore } from './utils/createStore';

// Schema für die Validierung des UI-Stores
// Hinweis: Schema beschreibt nur den State, nicht die Aktionen/Selektoren
const uiStateSchema = createStoreSchema({
  themeMode: z.union([
    z.literal('light'),
    z.literal('dark'),
    z.literal('system')
  ]),
  isMenuOpen: z.boolean(),
  isLoading: z.boolean()
});

// Initialer Zustand
const initialState: UIState = {
  themeMode: 'system',
  isMenuOpen: false,
  isLoading: false,
};

// Registriere den UI-Store beim MigrationManager
registerStore('ui', {
  schema: uiStateSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: 'UIStore'
});

/**
 * Der uiStore verwaltet den UI-Zustand der Anwendung.
 */
export const useUIStore = createStore<UIStore, UIState>(
  (set, get) => {
    // Erstelle die Selektoren
    const selectors = createUISelectors(get);
    
    // Erstelle die Aktionen
    const actions = createUIActions(set, get);
    
    // Kombiniere alles zu einem Store
    return {
      // Initialer Zustand
      ...initialState,
      
      // Selektoren
      ...selectors,
      
      // Aktionen
      ...actions,
    };
  },
  {
    name: 'ui',
    persist: true,
    initialState, 
    version: 1
  }
); 