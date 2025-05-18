/**
 * @file features/mode/stores/modeStore.ts
 * @description Mode-Store mit Zustand und Aktionen
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { default as EventEmitter } from 'eventemitter3';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { AppMode, ModeErrorType, UserStatus } from '@/types/common/appMode';
import { createMigration, registerStore } from '@/utils/store/migrationManager';
import { storeEvents, StoreEventType } from '@/utils/store/storeEvents';

import { ModeStore, ModeState, modeStateSchema } from './types';
import { ModeEvents } from '../types';

/**
 * Event-Emitter für Mode-Änderungsereignisse
 */
export const modeEventEmitter = new EventEmitter();

/**
 * Initialer Zustand des Mode-Stores
 */
const initialState: ModeState = {
  appMode: 'live',
  userStatus: { type: 'guest' },
  isDemoAccount: false,
  lastError: undefined,
  lastErrorType: undefined
};

// Registriere den Store beim MigrationManager - muss vor dem ersten Aufruf von createMigration erfolgen
registerStore('mode', {
  schema: modeStateSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: 'ModeStore'
});

/**
 * Event-Listener für Store-Events initialisieren
 */
const initializeStoreEventListeners = () => {
  storeEvents.on(StoreEventType.APP_MODE_CHANGED, ({ mode }) => {
    const currentStore = useModeStore.getState();
    if (currentStore.appMode === mode) {
      return;
    }
    useModeStore.setState({ appMode: mode });
    modeEventEmitter.emit(ModeEvents.APP_MODE_CHANGED, {
      oldValue: currentStore.appMode,
      newValue: mode
    });
  });
  
  storeEvents.on(StoreEventType.USER_STATUS_CHANGED, ({ status }) => {
    const currentStore = useModeStore.getState();
    
    if (isObjectWithType(currentStore.userStatus) && isObjectWithType(status) && currentStore.userStatus.type === status.type) {
      return;
    }
    
    useModeStore.setState({ userStatus: status });
  });

  const currentStore = useModeStore.getState();
  storeEvents.emit(StoreEventType.USER_STATUS_CHANGED, { status: currentStore.userStatus });
};

function isObjectWithType(val: unknown): val is { type: string } {
  return typeof val === 'object' && val !== null && 'type' in val;
}

/**
 * ModeStore - Zentrales Zustandsmanagement für den App-Modus
 * 
 * Stellt grundlegende Zustandsinformationen und Aktionen für die Verwaltung
 * des Betriebsmodus der App bereit. Der Store ist persistent und verwendet
 * einen Event-Emitter für die Kommunikation mit anderen Komponenten.
 */
export const useModeStore = create<ModeStore>()(
  persist(
    (set, get) => ({
      // Primitive Grundzustände
      ...initialState,

      /**
       * Setzt den Betriebsmodus der App
       * @param {AppMode} mode - Der neue Betriebsmodus
       */
      setAppMode: async (mode: AppMode) => {
        const currentMode = get().appMode;
        if (currentMode === mode) {
          return;
        }
        try {
          set({ appMode: mode });
          storeEvents.emit(StoreEventType.APP_MODE_CHANGED, { mode });
          modeEventEmitter.emit(ModeEvents.APP_MODE_CHANGED, {
            oldValue: currentMode,
            newValue: mode
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler beim Setzen des App-Modus';
          set({ 
            lastError: errorMessage,
            lastErrorType: 'unknown'
          });
        }
      },

      /**
       * Wechselt zwischen Demo- und Live-Modus
       */
      toggleAppMode: async () => {
        const currentMode = get().appMode;
        const newMode: AppMode = currentMode === 'demo' ? 'live' : 'demo';
        
        await get().setAppMode(newMode);
      },

      /**
       * Setzt den Status des Benutzers
       * @param {UserStatus} status - Der neue Benutzerstatus
       */
      setUserStatus: (status: UserStatus) => {
        const currentStatus = get().userStatus;
        if (isObjectWithType(currentStatus) && isObjectWithType(status) && currentStatus.type === status.type) {
          return;
        }
        set({ userStatus: status });
        storeEvents.emit(StoreEventType.USER_STATUS_CHANGED, { status });
      },

      /**
       * Setzt den Demo-Account-Status
       * @param {boolean} isDemoAccount - Gibt an, ob es sich um einen Demo-Account handelt
       */
      setDemoAccount: (isDemoAccount: boolean) => {
        set({ isDemoAccount });
      },

      /**
       * Setzt einen Fehler im Mode-System
       * @param {string} error - Die Fehlermeldung
       * @param {ModeErrorType} errorType - Der Fehlertyp
       */
      setError: (error: string, errorType: ModeErrorType) => {
        set({ 
          lastError: error,
          lastErrorType: errorType
        });
      },

      /**
       * Löscht den aktuellen Fehler
       */
      clearError: () => {
        set({ 
          lastError: undefined,
          lastErrorType: undefined
        });
      }
    }),
    {
      name: 'mode-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        appMode: state.appMode,
        userStatus: state.userStatus,
        isDemoAccount: state.isDemoAccount
      }),
      // Verwende die Migrationsfunktion vom MigrationManager
      migrate: createMigration<ModeState>('mode'),
      version: 1 // Aktuelle Version des Speicherformats
    }
  )
);

/**
 * Initialisiert den Mode-Store und seine Event-Listener
 * @returns {Promise<void>} Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist
 */
export async function initializeModeStore(): Promise<void> {
  initializeStoreEventListeners();
} 