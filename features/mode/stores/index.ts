/**
 * @file features/mode/stores/index.ts
 * @description Zentrale Export-Datei für alle Mode-bezogenen Stores
 */

// Haupt-Store exportieren
export * from './modeStore';

// Export der definierten Typen aus types.ts
export * from './types';

/**
 * HINWEIS ZUR MIGRATION:
 * 
 * Referenzen zum modeStore sollten von '@/stores' nach '@/features/mode/stores' migriert werden:
 * 
 * Alt:
 * ```
 * import { useModeStore } from '@/stores';
 * ```
 * 
 * Neu:
 * ```
 * import { useModeStore } from '@/features/mode/stores';
 * ```
 */
