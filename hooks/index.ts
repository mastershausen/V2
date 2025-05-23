/**
 * Zentrale Exportdatei für alle Hooks
 * 
 * Diese Datei dient als zentraler Einstiegspunkt für alle Hooks in der Anwendung.
 * Hooks sollten immer über diese Datei importiert werden, nicht direkt aus ihren
 * Quelldateien, um zukünftige Refactorings zu erleichtern.
 */

// UI-bezogene Hooks
export { useColorScheme } from './useColorScheme';
export { useTheme } from './useTheme';
export { useThemeColor } from './useThemeColor';
export { useFirstTimeVisit } from './useFirstTimeVisit';

// Geschäftslogik-Hooks
export { useAuth } from './useAuth';
export { useTabScreen } from './useTabScreen';
export { usePhotoSelection } from './usePhotoSelection';

// Fehlerbehandlung
export { useErrorHandler } from './useErrorHandler';

// Feature Flags
export { useFeatureFlag } from './useFeatureFlag';

// Mode-Management
export { useModeManager } from '@/features/mode/hooks';
export { useMode } from '@/features/mode/hooks';

// Legacy-Hooks wurden entfernt
// - useAppMode - vollständig entfernt, nutze stattdessen useMode
// - useDemoModeStatus - entfernt in v2.0.0
// - useAppModeManager - entfernt in v2.0.0

// Hinweis: Mode-bezogene Hooks jetzt aus features/mode importieren:
// import { useMode, useModeManager } from '@/features/mode'; 