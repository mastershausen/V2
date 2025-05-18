/**
 * @file features/settings/store/index.ts
 * @description Zentraler Settings-Store mit Migrationsframework
 */


import { createStore } from '@/stores/utils/createStore';
import { registerStore } from '@/utils/store/migrationManager';

import { SettingsActions, createSettingsActions } from './actions';
import { SettingsState, initialSettingsState, settingsStateSchema } from './schema';
import { SettingsSelectors, createSettingsSelectors } from './selectors';

/**
 * Registriere den Settings-Store beim MigrationManager
 */
registerStore('settings', {
  schema: settingsStateSchema,
  initialState: initialSettingsState,
  version: 1,
  debug: true,
  storeName: 'SettingsStore'
});

/**
 * Kombinierter Typ für den gesamten Settings-Store
 */
export type SettingsStore = SettingsState & SettingsActions & {
  // Selektoren als separate Properties hier einfügen, nicht die Methoden selbst
  selectors: SettingsSelectors;
};

/**
 * Der settingsStore verwaltet alle Benutzereinstellungen der App.
 * 
 * Er nutzt das Migrationsframework für sichere Updates der Datenstruktur
 * und stellt eine einheitliche API für die Verwaltung der Einstellungen bereit.
 */
export const useSettingsStore = createStore<SettingsStore, SettingsState>(
  (set, get) => {
    // Erstelle Selektoren
    const selectors = createSettingsSelectors(get);
    
    // Erstelle Aktionen
    const actions = createSettingsActions(
      // TypeScript-Casting für die Set-Funktion
      set as (state: Partial<SettingsState> | ((state: SettingsState) => Partial<SettingsState>)) => void,
      // TypeScript-Casting für die Get-Funktion
      get as () => SettingsState
    );
    
    // Kombiniere alles zu einem Store
    return {
      // Initialer Zustand
      ...initialSettingsState,
      
      // Aktionen
      ...actions,
      
      // Selektoren als Property
      selectors
    };
  },
  {
    // Store-Konfiguration
    name: 'settings',
    persist: true,
    schema: settingsStateSchema,
    initialState: initialSettingsState,
    debug: true,
    version: 1,
    
    // Nur bestimmte Felder persistieren
    partialize: (state) => ({
      theme: state.theme,
      language: state.language,
      notifications: state.notifications,
      privacySettings: state.privacySettings,
      lastScreens: state.lastScreens,
      userPreferences: state.userPreferences
    })
  }
);

// Re-export der Typen für einfacheren Zugriff
export * from './schema';
export * from './actions';
export * from './selectors';

/**
 * Initialisiert den Settings-Store
 * @returns {Promise<void>} Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist
 */
export async function initializeSettingsStore(): Promise<void> {
  // Hier könnte zukünftig initialisierende Logik stehen
  console.log('[SettingsStore] Initialisierung abgeschlossen');
} 