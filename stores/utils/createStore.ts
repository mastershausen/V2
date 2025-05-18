/**
 * createStore.ts
 * 
 * Eine einfache Factory-Funktion für Stores mit einheitlichem Muster.
 * Diese Funktion bietet einen konsistenten Ansatz für die Erstellung von Zustandsspeichern
 * in der gesamten Anwendung.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions, createJSONStorage, StateStorage } from 'zustand/middleware';

import { useModeStore } from '@/features/mode/stores';
import {registerStore, createMigration} from '@/utils/store/migrationManager';

import { isDevelopmentMode } from '../../config/app/env';

// Die MigrationFunction definieren, falls sie im neuen Manager nicht exportiert wird
type MigrationFunction<T> = (persistedState: unknown, version: number) => T;

/**
 * Generiert einen modus-spezifischen Schlüssel für den Storage
 * @param baseKey Basis-Schlüssel
 * @param separateDevKeys Ob separate Schlüssel für Development-Modus verwendet werden sollen
 * @param options Optionale Einstellungen für Suffixe
 * @param options.demoSuffix
 * @param options.devSuffix
 * @param options.liveSuffix
 * @returns Modus-spezifischer Schlüssel
 */
function getModeSpecificKey(
  baseKey: string,
  separateDevKeys: boolean = false,
  options?: {
    demoSuffix?: string;
    devSuffix?: string;
    liveSuffix?: string;
  }
): string {
  const { 
    demoSuffix = '-demo', 
    devSuffix = '-dev', 
    liveSuffix = ''
  } = options || {};
  
  // Default ist Live-Modus
  let suffix = liveSuffix;
  
  try {
    // Versuche den aktuellen Modus zu erhalten
    const currentMode = useModeStore.getState().appMode;
    
    if (currentMode === 'demo') {
      suffix = demoSuffix;
    } else if (separateDevKeys && isDevelopmentMode()) {
      suffix = devSuffix;
    }
  } catch (error) {
    // Fallback: Im Fehlerfall den Demo-Suffix verwenden, wenn wir im Demo-Modus sind
    const isDemoMode = () => {
      try {
        return useModeStore.getState().appMode === 'demo';
      } catch (e) {
        return false;
      }
    };
    
    if (isDemoMode()) {
      suffix = demoSuffix;
    } else if (separateDevKeys && isDevelopmentMode()) {
      suffix = devSuffix;
    }
  }
  
  return `${baseKey}${suffix}`;
}

/**
 * Optionen für die Store-Erstellung
 */
export interface CreateStoreOptions<TState> {
  /** Name des Stores für Debugging und Persistenz */
  name: string;
  
  /** Gibt an, ob der Store persistiert werden soll */
  persist?: boolean;
  
  /** 
   * Funktion zum Filtern des persistierten Zustands
   * Kann verwendet werden, um z.B. sensible Daten zu entfernen
   */
  partialize?: (state: TState) => Partial<TState> | TState;
  
  /** Version für Migrations-Unterstützung */
  version?: number;
  
  /** 
   * Migrationsfunktion für den persistierten Zustand
   * Wird verwendet, um alte Speicherformate in das aktuelle Format zu konvertieren
   */
  migrate?: (persistedState: unknown, version: number) => TState;
  
  /** 
   * Initialer Zustand, der als Fallback und für die Migration verwendet wird
   */
  initialState?: TState;
  
  /**
   * Gibt an, ob der Store Modus-spezifisch persistiert werden soll.
   * Wenn true, werden separate Speicherschlüssel für Demo- und Real-Modus verwendet.
   */
  useModeSpecificStorage?: boolean;
  
  /**
   * Ob separate Schlüssel für Development-Modus verwendet werden sollen
   */
  useDevSpecificStorage?: boolean;
  
  /**
   * Benutzerdefiniertes Prefix für den Store-Namen
   */
  storePrefix?: string;

  /**
   * Benutzerdefiniertes Suffix für den Demo-Modus
   */
  demoSuffix?: string;

  /**
   * Benutzerdefiniertes Suffix für den Live-Modus
   */
  liveSuffix?: string;

  /**
   * Benutzerdefiniertes Suffix für den Development-Modus
   */
  devSuffix?: string;

  /**
   * Gibt an, ob Debug-Logging aktiviert sein soll
   */
  debug?: boolean;
  
  /**
   * Schema für die Store-Validierung mit zod
   * Wird für die automatische Erstellung einer Migrationsfunktion verwendet
   */
  schema?: z.ZodType<TState>;
}

/**
 * Erstellt einen Store mit einheitlichem Muster
 * @param stateCreator Funktion zur Erstellung des Store-Zustands
 * @param options Optionen für die Store-Erstellung
 * @returns Zustand-Hook
 * @template T - Der vollständige Typ des Stores, einschließlich aller Aktionen und Selektoren
 * @template TState - Der zugrundeliegende State-Typ ohne Aktionen/Selektoren
 */
export function createStore<T, TState = any>(
  stateCreator: StateCreator<T>,
  options: CreateStoreOptions<TState>
) {
  const { 
    name, 
    persist: shouldPersist = false, 
    partialize,
    version = 1,
    migrate: customMigrate,
    initialState,
    useModeSpecificStorage = true,
    useDevSpecificStorage = false,
    storePrefix = 'store',
    demoSuffix = '-demo',
    liveSuffix = '',
    devSuffix = '-dev',
    debug = false,
    schema
  } = options;
  
  // Store-Erstellung mit oder ohne Persistenz
  if (shouldPersist) {
    // Basis-Store-Name
    const baseStoreName = `${storePrefix}-${name}`;
    
    // Bestimme den Store-Namen basierend auf dem App-Modus
    let storeName = baseStoreName;
    
    // Wenn modus-spezifischer Speicher aktiviert ist, verwende die Utility-Funktion für den Schlüssel
    if (useModeSpecificStorage) {
      // Lokale getModeSpecificKey-Funktion verwenden
      storeName = getModeSpecificKey(baseStoreName, useDevSpecificStorage, {
        demoSuffix,
        devSuffix,
        liveSuffix
      });
      
      if (debug) {
        console.log(`[createStore] Erstelle Store mit modusspezifischem Namen: ${storeName}`);
      }
    }
    
    const persistOptions: PersistOptions<T> = {
      name: storeName,
      storage: createJSONStorage(() => AsyncStorage as StateStorage),
      version,
    };
    
    // Wenn eine partialize-Funktion angegeben ist, diese verwenden
    if (partialize) {
      // @ts-ignore - Wir wissen, dass die Funktion kompatibel ist
      persistOptions.partialize = partialize;
    }
    
    // Bestimme die zu verwendende Migrationsfunktion
    let migrationFunction: MigrationFunction<T> | undefined;
    
    // 1. Priorisiere benutzerdefinierte Migration
    if (customMigrate) {
      // @ts-ignore - Wir akzeptieren die Typkonvertierung hier, da der Benutzer die Kontrolle hat
      migrationFunction = customMigrate;
    } 
    // 2. Verwende den zentralen MigrationManager, wenn Schema und InitialState vorhanden sind
    else if (schema && initialState) {
      // Registriere den Store beim MigrationManager
      registerStore(name, {
        // @ts-ignore - Wir wissen, dass das Schema kompatibel ist
        schema,
        initialState,
        version,
        debug,
        storeName: name
      });
      
      // Hole die Migrationsfunktion vom MigrationManager
      migrationFunction = createMigration<T>(name);
    } 
    // 3. Verwende einfache Standard-Migration nur mit initialState
    else if (initialState) {
      // Standardmigrationsfunktion basierend auf dem initialState
      migrationFunction = (persistedState: unknown, _version: number) => {
        // Prüfen, ob der persistierte Zustand ein gültiges Objekt ist
        if (!persistedState || typeof persistedState !== 'object') {
          if (debug) {
            console.log(`[createStore:migrate] Ungültiger persistierter Zustand für ${storeName}, verwende initialState`);
          }
          // @ts-ignore - Wir nehmen hier an, dass initialState kompatibel mit T ist
          return initialState as unknown as T;
        }
        
        // Versuche, den persistierten Zustand mit dem initialState zu vereinen
        try {
          // @ts-ignore - Wir nehmen hier an, dass der vereinigte Zustand kompatibel mit T ist
          const mergedState = { ...initialState, ...persistedState } as unknown as T;
          if (debug) {
            console.log(`[createStore:migrate] Erfolgreich migrierten Zustand für ${storeName} erstellt`);
          }
          return mergedState;
        } catch (error) {
          if (debug) {
            console.error(`[createStore:migrate] Fehler beim Migrieren für ${storeName}:`, error);
          }
          // Im Fehlerfall den initialState verwenden
          // @ts-ignore - Wir nehmen hier an, dass initialState kompatibel mit T ist
          return initialState as unknown as T;
        }
      };
    }
    
    if (migrationFunction) {
      persistOptions.migrate = migrationFunction;
    }
    
    // Erstelle einen persistierten Store
    return create<T>()(
      persist(stateCreator, persistOptions)
    );
  } else {
    // Erstelle einen nicht-persistierten Store
    return create<T>()(stateCreator);
  }
}

/**
 * Typen für Store-Aktionen
 */
export type ActionCreator<T> = (
  set: (state: Partial<T> | ((state: T) => Partial<T>)) => void, 
  get: () => T
) => Record<string, (...args: any[]) => any>;

/**
 * Typen für Store-Selektoren
 */
export type SelectorCreator<T> = (get: () => T) => Record<string, (...args: any[]) => any>; 