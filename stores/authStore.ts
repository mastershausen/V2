/**
 * @file stores/authStore.ts
 * @description Zentraler Store für Authentifizierungs- und Sitzungsdaten nach dem Goldstandard
 * 
 * Dieser Store verwendet das erweiterte createStore-Pattern mit ausgelagerten Aktionen
 * und Selektoren für bessere Wartbarkeit und Testbarkeit.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { AuthStatus } from '@/features/auth/types';
import { User } from '@/types/auth';
import { AppMode } from '@/types/common/appMode';
import {registerStore, createStoreSchema} from '@/utils/store/migrationManager';
import { storeEvents, StoreEventType } from '@/utils/store/storeEvents';

import { createStore } from './utils/createStore';

// Typ für den Auth-Store-Zustand (ohne Aktionen und Selektoren)
export interface AuthState {
  // Status-Felder
  authStatus: AuthStatus;
  isInitialized: boolean;
  isLoading: boolean;
  appMode: AppMode;
  error: string | null;
  
  // Benutzer-Felder
  user: User | null;
}

// Typ für die Auth-Store-Aktionen
export interface AuthActions {
  // Benutzeraktionen
  login: (user: User) => void;
  logout: () => void;
  
  // Statusaktionen
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setAppMode: (appMode: AppMode) => void;
  clearError: () => void;
  
  // Kombinierte Aktionen
  initialize: () => Promise<void>;
}

/**
 * Kombination aus State und Actions für den vollständigen Store-Typ
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Initialer Zustand für den Auth-Store
 */
const initialState: AuthState = {
  authStatus: { type: 'unauthenticated', timestamp: Date.now() },
  isInitialized: false,
  isLoading: false,
  appMode: 'live',
  error: null,
  user: null,
};

// Einfaches Schema für den Auth-Store mit workaround durch z.any() für komplexe Strukturen
// Dies erlaubt eine lockere Validierung, die im Fehlerfall auf den initialState zurückfällt
const authSchema = createStoreSchema({
  authStatus: z.any(), // Vereinfachung des komplexen authStatus-Typs
  isInitialized: z.boolean(),
  isLoading: z.boolean(),
  appMode: z.enum(['live', 'demo', 'development']),
  error: z.string().nullable(),
  user: z.any().nullable()
});

// Registriere den Auth-Store beim MigrationManager
registerStore('auth', {
  schema: authSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: 'AuthStore'
});

/**
 * Initialisiere Event-Listener für den Store
 */
const initializeStoreEventListeners = () => {
  // Event-Listener für USER_LOGGED_IN
  storeEvents.on(StoreEventType.USER_LOGGED_IN, ({ user }) => {
    const store = useAuthStore.getState();
    store.login(user);
  });
  
  // Event-Listener für USER_LOGGED_OUT
  storeEvents.on(StoreEventType.USER_LOGGED_OUT, () => {
    const store = useAuthStore.getState();
    store.logout();
  });
  
  // Event-Listener für AUTH_ERROR
  storeEvents.on(StoreEventType.AUTH_ERROR, ({ error }) => {
    const store = useAuthStore.getState();
    store.setError(error);
  });
  
  // Event-Listener für APP_MODE_CHANGED
  storeEvents.on(StoreEventType.APP_MODE_CHANGED, ({ mode }) => {
    const store = useAuthStore.getState();
    store.setAppMode(mode);
  });
};

// Erstelle den Auth-Store mit dem standardisierten createStore-Pattern
export const useAuthStore = createStore<AuthStore, AuthState>(
  (set, get) => ({
    // Initialer Zustand
    ...initialState,
    
    // Benutzeraktionen
    login: (user: User) => {
      set({
        user,
        authStatus: { type: 'authenticated', userId: user.id, timestamp: Date.now() },
        error: null,
      });
    },
    
    logout: () => {
      set({
        user: null,
        authStatus: { type: 'unauthenticated', reason: 'logout', timestamp: Date.now() },
        error: null,
      });
    },
    
    // Statusaktionen
    setLoading: (isLoading: boolean) => {
      set({
        isLoading,
        authStatus: isLoading
          ? { type: 'loading', timestamp: Date.now() }
          : get().user
            ? { type: 'authenticated', userId: get().user!.id, timestamp: Date.now() }
            : { type: 'unauthenticated', reason: 'initial', timestamp: Date.now() }
      });
    },
    
    setError: (error: string | null) => {
      set({ error });
    },
    
    setAppMode: (appMode: AppMode) => {
      set({ appMode });
    },
    
    clearError: () => {
      set({ error: null });
    },
    
    // Kombinierte Aktionen
    initialize: async () => {
      // Hier könnte initialisierende Logik stehen, z.B. Token-Validierung
      set({ isInitialized: true });
    }
  }),
  {
    name: 'auth',
    persist: true,
    initialState,
    schema: authSchema,
    debug: true,
    version: 1,
    partialize: (state) => ({
      user: state.user,
      authStatus: state.authStatus,
      appMode: state.appMode
    })
  }
);

// Globale Selektoren für den Auth-Store
export const isAuthenticated = (state: AuthState) => state.authStatus.type === 'authenticated';
export const isUnauthenticated = (state: AuthState) => state.authStatus.type === 'unauthenticated';
export const isLoading = (state: AuthState) => state.isLoading;
export const hasError = (state: AuthState) => state.error !== null;
export const getUser = (state: AuthState) => state.user;
export const getAppMode = (state: AuthState) => state.appMode;

/**
 * Initialisiert den Auth-Store und seine Event-Listener
 * @returns {Promise<void>} Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist
 */
export async function initializeAuthStore(): Promise<void> {
  initializeStoreEventListeners();
  await useAuthStore.getState().initialize();
} 