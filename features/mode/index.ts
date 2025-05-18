/**
 * @file features/mode/index.ts
 * @description Zentrale Export-Datei für das Mode-Feature
 * 
 * Diese Datei exportiert alle öffentlichen APIs des Mode-Features.
 * Die interne Implementierung bleibt verborgen.
 */

// Kern-Typen exportieren - jetzt aus gemeinsamer Quelle
export { AppMode, UserStatus, USER_STATUS, ModeErrorType } from '@/types/common/appMode';

// Mode-spezifische Typen exportieren
export { ModeEvents, ModeChangeResult, ModeError } from './types';

// Hooks exportieren
export { useMode } from './hooks/useMode';
export { useModeManager } from './hooks/useModeManager';

// Store und Event-Emitter exportieren
export { useModeStore, modeEventEmitter } from './stores';

// Komponenten-API
export { AppModeToggle } from './components/AppModeToggle';
