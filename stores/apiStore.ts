/**
 * apiStore - Verwaltung des API-Zustands
 * 
 * Hier wird der globale API-Zustand verwaltet, einschließlich
 * - Request-Tracking (Status, Fehler)
 * - Netzwerkstatus
 * - Globale Fehler
 */
import { z } from 'zod';

import { createStoreSchema, registerStore } from '@/utils/store/migrationManager';

import { createApiActions } from './actions/apiActions';
import { createApiSelectors } from './selectors/apiSelectors';
import { ApiState, ApiStore } from './types/apiTypes';
import { createStore } from './utils/createStore';

// Schema für den API-Store-Zustand
const apiStateSchema = createStoreSchema({
  requests: z.record(z.any()), // Offenes Schema für verschiedene Request-Typen
  globalError: z.string().nullable(),
  isOnline: z.boolean()
});

// Initialer Zustand
const initialState: ApiState = {
  requests: {},
  globalError: null,
  isOnline: true,
};

// Registriere den Store beim MigrationManager
registerStore('api', {
  schema: apiStateSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: 'ApiStore'
});

/**
 * Der apiStore verwaltet den API-Zustand der Anwendung.
 */
export const useApiStore = createStore<ApiStore, ApiState>(
  (set, get) => {
    // Erstelle die Selektoren
    const selectors = createApiSelectors(get);
    
    // Erstelle die Aktionen
    const actions = createApiActions(set, get);
    
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
    name: 'api',
    // Wir persistieren den API-Store nicht, da die Requests flüchtig sind
    persist: false,
    // Obwohl wir keine Persistenz nutzen, definieren wir Schema und initialState
    // für eine potenzielle zukünftige Nutzung
    initialState,
    debug: true,
  }
); 