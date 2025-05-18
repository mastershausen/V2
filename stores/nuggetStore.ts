/**
 * nuggetStore - Verwaltung der Nugget-Daten
 * 
 * Hier werden die Nugget-Daten zentral verwaltet und zwischen
 * verschiedenen Komponenten geteilt
 */

import { z } from 'zod';

import NuggetService from '@/services/NuggetService';
import { NuggetData } from '@/shared-components/cards/nugget-card/types';
import { AppMode } from '@/types/common/appMode';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';
import { createStoreSchema, registerStore } from '@/utils/store/migrationManager';
import { StoreEventType, storeEvents } from '@/utils/store/storeEvents';

import { createStore } from './utils/createStore';

// Schema für den Store-Zustand (ohne Aktionen und Selektoren)
const nuggetStateSchema = createStoreSchema({
  userNuggets: z.array(z.any()), // Für dynamische Nugget-Objekte, könnte spezifischer sein
  demoNuggets: z.array(z.any()),
  isLoading: z.boolean(),
  error: z.string().nullable(),
  initialized: z.boolean()
});

interface NuggetState {
  userNuggets: NuggetData[];
  demoNuggets: NuggetData[]; // Separate Nuggets für den Demo-Modus
  isLoading: boolean;
  error: string | null;
  initialized: boolean; // Flag, um zu verfolgen, ob der Store bereits initialisiert wurde
}

interface NuggetActions {
  addNugget: (nugget: NuggetData) => void;
  updateNugget: (nuggetId: string, updates: Partial<NuggetData>) => void;
  deleteNugget: (nuggetId: string) => void;
  loadUserNuggets: () => void;
  clearNuggets: () => void;
  initializeStore: () => void; // Neue Funktion zur Store-Initialisierung
}

interface NuggetSelectors {
  getNuggetById: (id: string) => NuggetData | undefined;
  getUserNuggets: () => NuggetData[];
}

export type NuggetStore = NuggetState & NuggetActions & NuggetSelectors;

// Initialer Zustand
const initialState: NuggetState = {
  userNuggets: [],
  demoNuggets: [], // Leere Liste für Demo-Nuggets
  isLoading: false,
  error: null,
  initialized: false,
};

// Registriere den Store beim MigrationManager
registerStore('nugget', {
  schema: nuggetStateSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: 'NuggetStore'
});

// Helper-Funktion, um den NuggetService aus der Registry zu holen
function getNuggetService(): NuggetService {
  try {
    return ServiceRegistry.getInstance().getService<NuggetService>(ServiceType.NUGGET);
  } catch (error) {
    console.error('[nuggetStore] Fehler beim Holen des NuggetService:', error);
    // Als Fallback erstellen wir eine neue Instanz, wenn die Registry versagt
    const nuggetService = new NuggetService();
    
    // Versuche, den Service in der Registry zu registrieren, 
    // falls er noch nicht registriert war
    try {
      ServiceRegistry.getInstance().register(ServiceType.NUGGET, nuggetService);
    } catch (registerError) {
      // Wenn die Registrierung fehlschlägt, loggen aber weitermachen
      console.warn('[nuggetStore] Konnte NuggetService nicht automatisch registrieren:', registerError);
    }
    
    return nuggetService;
  }
}

// Event-Handler für App-Modus-Events
const handleAppModeEvent = async (
  mode: AppMode,
  setFn: (state: Partial<NuggetState>) => void,
  getFn: () => NuggetStore
) => {
  console.log(`Nugget-Store: App-Modus geändert zu ${mode}`);
  
  if (mode === 'demo') {
    // Sofort die userNuggets leeren, um zu verhindern, dass 
    // Real-Mode-Nuggets kurz sichtbar sind
    setFn({ userNuggets: [], isLoading: true });
    
    try {
      // Demo-Modus: Lade vordefinierte Demo-Nuggets (nur Alexander Becker)
      const nuggetService = getNuggetService();
      const demoNuggets = await nuggetService.getUserNuggets(true);
      
      setFn({ 
        userNuggets: demoNuggets,
        demoNuggets: demoNuggets,
        isLoading: false
      });
    } catch (error) {
      console.error('[nuggetStore] Fehler beim Laden der Demo-Nuggets:', error);
      setFn({ isLoading: false, error: 'Fehler beim Laden der Demo-Nuggets' });
    }
  } else {
    // Real-Modus: Leere Liste für userNuggets setzen,
    // damit der placeholderTab angezeigt wird
    setFn({ 
      userNuggets: [] 
    });
  }
};

/**
 * Der nuggetStore verwaltet Nugget-Daten und teilt sie zwischen Komponenten
 */
export const useNuggetStore = createStore<NuggetStore, NuggetState>(
  (set, get) => {
    // Abonniere Events vom storeEvents für App-Modus-Änderungen
    try {
      storeEvents.on(StoreEventType.APP_MODE_CHANGED, ({ mode }) => {
        handleAppModeEvent(mode, set, get);
      });
    } catch (error) {
      console.error('[nuggetStore] Fehler beim Abonnieren von AppModeEvents:', error);
      // Fehlschlag beim Abonnieren sollte die App nicht blocken
    }

    // Selektoren
    const selectors: NuggetSelectors = {
      getNuggetById: (id: string) => {
        return get().userNuggets.find(nugget => nugget.id === id);
      },
      getUserNuggets: () => {
        return get().userNuggets;
      }
    };

    // Hilfsfunktion um zu prüfen ob wir im Demo-Modus sind
    const isDemoMode = () => {
      const lastEvent = storeEvents.getLastKnownValue(StoreEventType.APP_MODE_CHANGED);
      return lastEvent?.mode === 'demo';
    };

    // Aktionen
    const actions: NuggetActions = {
      addNugget: (nugget: NuggetData) => {
        // Prüfe, ob im Demo-Modus über den ModeStore
        if (isDemoMode()) {
          // Im Demo-Modus: Füge das Nugget zu den Demo-Nuggets hinzu
          set((state: NuggetState) => ({
            userNuggets: [nugget, ...state.userNuggets],
            demoNuggets: [nugget, ...state.demoNuggets]
          }));
        } else {
          // Im Real-Modus: Füge das Nugget nur zu den userNuggets hinzu
          set((state: NuggetState) => ({
            userNuggets: [nugget, ...state.userNuggets]
          }));
        }
      },
      updateNugget: (nuggetId: string, updates: Partial<NuggetData>) => {
        // Prüfe, ob im Demo-Modus
        if (isDemoMode()) {
          // Im Demo-Modus: Aktualisiere auch die Demo-Nuggets
          set((state: NuggetState) => ({
            userNuggets: state.userNuggets.map(nugget => 
              nugget.id === nuggetId ? { ...nugget, ...updates } : nugget
            ),
            demoNuggets: state.demoNuggets.map(nugget => 
              nugget.id === nuggetId ? { ...nugget, ...updates } : nugget
            )
          }));
        } else {
          // Im Real-Modus: Aktualisiere nur die userNuggets
          set((state: NuggetState) => ({
            userNuggets: state.userNuggets.map(nugget => 
              nugget.id === nuggetId ? { ...nugget, ...updates } : nugget
            )
          }));
        }
      },
      deleteNugget: (nuggetId: string) => {
        // Prüfe, ob im Demo-Modus
        if (isDemoMode()) {
          // Im Demo-Modus: Lösche auch aus den Demo-Nuggets
          set((state: NuggetState) => ({
            userNuggets: state.userNuggets.filter(nugget => nugget.id !== nuggetId),
            demoNuggets: state.demoNuggets.filter(nugget => nugget.id !== nuggetId)
          }));
        } else {
          // Im Real-Modus: Lösche nur aus den userNuggets
          set((state: NuggetState) => ({
            userNuggets: state.userNuggets.filter(nugget => nugget.id !== nuggetId)
          }));
        }
      },
      loadUserNuggets: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const nuggetService = getNuggetService();
          
          // Prüfe, ob im Demo-Modus
          if (isDemoMode()) {
            // Sofort leere Liste setzen
            set({ userNuggets: [] });
            
            // Im Demo-Modus: Lade Demo-Nuggets von Alexander Becker
            const demoNuggets = await nuggetService.getUserNuggets(true);
            set({ 
              userNuggets: demoNuggets, 
              demoNuggets: demoNuggets, 
              isLoading: false 
            });
          } else {
            // Im Real-Modus: API-Aufruf für tatsächliche Nutzernuggets
            // Wenn keine vorhanden sind, bleibt die Liste leer
            const userNuggets = await nuggetService.getUserNuggets(false);
            set({ userNuggets, isLoading: false });
          }
        } catch (error) {
          console.error('[nuggetStore] Fehler beim Laden der Nuggets:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Fehler beim Laden der Nuggets'
          });
        }
      },
      clearNuggets: () => {
        // Prüfe, ob im Demo-Modus
        if (isDemoMode()) {
          // Im Demo-Modus: Setze sowohl userNuggets als auch demoNuggets zurück
          set({ userNuggets: [], demoNuggets: [] });
        } else {
          // Im Real-Modus: Setze nur userNuggets zurück
          set({ userNuggets: [] });
        }
      },
      // Store-Initialisierung
      initializeStore: () => {
        // Initialisierungslogik hier...
        set({ initialized: true });
      }
    };

    // Store zusammensetzen
    return {
      // Initialer Zustand
      ...initialState,
      
      // Aktionen
      ...actions,
      
      // Selektoren
      ...selectors
    };
  },
  {
    name: 'nugget',
    persist: true,
    initialState, // Initialer Zustand für Migration
    debug: true, // Debug-Logging aktivieren
    version: 1, // Aktuelle Version des Speicherformats
    partialize: (state) => ({
      userNuggets: state.userNuggets,
      demoNuggets: state.demoNuggets
    })
  }
); 