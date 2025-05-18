/**
 * Index-Datei für die Nugget-Hooks
 * 
 * Exportiert alle Hook-Funktionen für die Nugget-Funktionalität.
 */

// Hook-Implementierungen exportieren
import useCreateNugget from './useCreateNugget';
export { useCreateNugget };
// export { default as useNuggetValidation } from './useNuggetValidation';

// Re-exportiere nur die tatsächlich benötigten Typen aus dem alten System
export { NuggetCreationStatus } from '../types';

// Exportiere den Hook-Alias für Abwärtskompatibilität
export const useNuggetCreation = useCreateNugget; 