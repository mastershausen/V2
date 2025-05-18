/**
 * @file features/settings/index.ts
 * @description Export aller wichtigen Komponenten und Funktionen des Settings-Features
 * 
 * Dieser Einstiegspunkt exportiert die wichtigsten Komponenten und Hooks des Settings-Features,
 * um eine einfache Verwendung in anderen Teilen der Anwendung zu ermöglichen.
 */

// Komponenten und Screens exportieren
export { default as SettingsScreen } from './screens/SettingsScreen';
export { default as AccountSettingsScreen } from './screens/AccountSettingsScreen';
export { default as DebugSettingsScreen } from './screens/DebugSettingsScreen';

// Hooks exportieren
export { useSettings } from './hooks/useSettings';
export { useDebugSettings } from './hooks/useDebugSettings';

// Typen exportieren
export * from './types';

// Store exportieren
export {
  useSettingsStore,
  initializeSettingsStore,
  type SettingsStore,
  type SettingsState,
  type SettingsActions,
  type SettingsSelectors
} from './store';

/**
 * Initialisiert alle erforderlichen Komponenten des Settings-Features
 */
export async function initializeSettings(): Promise<void> {
  // Hier den SettingsStore initialisieren
  await initializeSettingsStore();
}
