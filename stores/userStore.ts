/**
 * userStore - Vereinfachtes Benutzerverwaltungssystem
 * 
 * Diese Datei enthält den überarbeiteten userStore, der jetzt auf
 * dem vereinfachten SessionService basiert und unabhängig vom App-Modus
 * funktioniert.
 */

import { z } from 'zod';

import { AuthStatus } from '@/features/auth/types';
import { type UserProfile } from '@/types/userTypes';
import { createStoreSchema, registerStore } from '@/utils/store/migrationManager';
import { userEvents } from '@/utils/store/storeEvents';

import { createUserActions } from './actions/userActions';
import { createUserSelectors } from './selectors/userSelectors';
import { createStore } from './utils/createStore';

// Definition des UserState-Typs
interface UserState {
  authStatus: AuthStatus;
  user: UserProfile | null;
  token: string | null;
  savedAuthenticatedSession: {
    user: UserProfile | null;
    token: string | null;
    authStatus: AuthStatus;
  } | null;
}

// Schema für die Validierung des UserStore
const userStoreSchema = createStoreSchema({
  authStatus: z.union([
    z.object({
      type: z.literal('authenticated'),
      userId: z.string(),
      timestamp: z.number()
    }),
    z.object({
      type: z.literal('unauthenticated'),
      reason: z.enum(['logout', 'expired', 'initial', 'demo']).optional(),
      timestamp: z.number()
    }),
    z.object({
      type: z.literal('loading'),
      timestamp: z.number()
    })
  ]),
  user: z.any().nullable(),
  token: z.string().nullable(),
  savedAuthenticatedSession: z.object({
    user: z.any().nullable(),
    token: z.string().nullable(),
    authStatus: z.union([
      z.object({
        type: z.literal('authenticated'),
        userId: z.string(),
        timestamp: z.number()
      }),
      z.object({
        type: z.literal('unauthenticated'),
        reason: z.enum(['logout', 'expired', 'initial', 'demo']).optional(),
        timestamp: z.number()
      }),
      z.object({
        type: z.literal('loading'),
        timestamp: z.number()
      })
    ])
  }).nullable()
});

// Typ für den Store - alles was wir exportieren
interface UserStoreType extends UserState {
  // Funktionen von selectors und actions werden hier eingebunden
  [key: string]: unknown;
}

// Vereinfachter initialer Zustand
const initialState: UserState = {
  authStatus: { type: 'unauthenticated', timestamp: Date.now() },
  user: null,
  token: null,
  savedAuthenticatedSession: null,
};

// Registriere den Store beim MigrationManager
registerStore('user', {
  schema: userStoreSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: 'UserStore'
});

// Minimaler Set an Funktionen für unseren Store
/* eslint-disable import/prefer-default-export */
export const useUserStore = createStore<UserStoreType, UserState>(
  (set, get) => {
    // Erstelle die Selektoren
    const selectors = createUserSelectors(get as () => UserState);
    
    // Erstelle die Aktionen
    const actions = createUserActions(
      // Typumwandlung für set
      (fn) => set((state: UserStoreType) => {
        const updates = fn(state as unknown as UserState);
        return updates as unknown as Partial<UserStoreType>;
      }),
      // Typumwandlung für get
      () => ({
        ...get() as unknown as UserState,
        hasMinimumRole: selectors.hasMinimumRole
      })
    );
    
    // Kombiniere alles zu einem Store
    return {
      // Initialer Zustand
      ...initialState,
      
      // Selektoren
      ...selectors,
      
      // Die Funktionen, die durch die Aktionen bereitgestellt werden
      ...actions,
    } as UserStoreType;
  },
  {
    name: 'user',
    persist: true,
    initialState,
    // Nur bestimmte Felder persistieren, sensible Daten ausschließen
    partialize: (state: UserStoreType) => ({
      user: state.user,
      token: state.token,
      authStatus: state.authStatus,
      savedAuthenticatedSession: state.savedAuthenticatedSession,
    }),
  }
);

// Überwache Änderungen am Store und sende Events
useUserStore.subscribe((state) => {
  // Wenn sich der Benutzerzustand ändert, sende ein Event
  userEvents.userStateChanged(state.user);
}); 