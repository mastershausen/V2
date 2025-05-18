/**
 * Index-Datei für das Nugget-Feature
 * 
 * Exportiert alle zentralen Funktionen, Typen und Konstanten aus dem Nugget-Feature,
 * um einen einfachen Import in anderen Teilen der Anwendung zu ermöglichen.
 */

// Screens
export { default as CreateNuggetScreen } from './screens/createNuggetScreen';

// Typen - Reexport der Typen direkt
export * from './types';

// Hooks - Reexport nur die Hook-Implementierungen, nicht die Typen,
// da diese bereits über './types' exportiert werden
// Wenn neue Hook-Implementierungen hinzugefügt werden, hier importieren:
// export { useNuggetCreation, useNuggetValidation } from './hooks';

// Konfiguration und Konstanten
export * from './config/constants';

// Hilfsfunktionen
export * from './utils/mediaHelpers'; 