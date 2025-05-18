/**
 * Zentraler Export aller Stores
 * 
 * Diese Datei exportiert alle Stores und sollte verwendet werden,
 * um auf die Stores zuzugreifen, anstatt die einzelnen Store-Dateien 
 * direkt zu importieren. Dies erleichtert zukünftige Refactorings.
 */

// Exporte für jeden Store
export { useSolvboxaiStore } from './solvboxaiStore';
export { useUIStore } from './uiStore';
export { useUserStore } from './userStore';
export { useMysolvboxStore } from './mysolvboxStore';
export { useNuggetStore } from './nuggetStore';
export { useApiStore } from './apiStore';
export { useAuthStore } from './authStore';

// ModeStore wurde nach features/mode verschoben
// Export des Mode-Stores wurde entfernt in v2.0.0
// Neuer Import-Pfad: import { useModeStore } from '@/features/mode';
