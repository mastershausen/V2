/**
 * @file utils/store/migrationManager.ts
 * @description Zentraler Entry-Point für das Store-Migrationssystem
 */

import { z } from 'zod';

/**
 * Konfiguration für eine Store-Migration
 */
export interface MigrationConfig<T = any> {
  /** Schema für die Validierung des Stores */
  schema: z.ZodType<T>;
  
  /** Initialer Zustand für Fallbacks */
  initialState: T;
  
  /** Aktuelle Version des Schemas */
  version: number;
  
  /** Ob Debug-Logging aktiviert werden soll */
  debug?: boolean;
  
  /** Name des Stores für Debug-Logging */
  storeName?: string;
  
  /** Versionsbasierte Transformationen */
  transformers?: Record<number, (state: unknown) => Partial<T>>;
}

/**
 * Zentrale Verwaltungsklasse für alle Store-Migrationen
 */
export class MigrationManager {
  private static instance: MigrationManager;
  private storeConfigs = new Map<string, MigrationConfig>();
  
  private constructor() {}
  
  /**
   * Gibt die Singleton-Instanz des MigrationManagers zurück
   */
  public static getInstance(): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager();
    }
    return MigrationManager.instance;
  }
  
  /**
   * Registriert einen Store für die Migration
   * @param storeName Eindeutiger Name des Stores
   * @param config Migrationskonfiguration
   */
  public registerStore<T>(storeName: string, config: MigrationConfig<T>): void {
    if (this.storeConfigs.has(storeName)) {
      console.warn(`[MigrationManager] Store '${storeName}' wurde bereits registriert. Überschreibe...`);
    }
    
    this.storeConfigs.set(storeName, config);
    
    if (config.debug) {
      console.log(`[MigrationManager] Store '${storeName}' registriert mit Version ${config.version}`);
    }
  }
  
  /**
   * Gibt eine Migrationsfunktion für einen registrierten Store zurück
   * @param storeName Name des registrierten Stores
   * @returns Migrationsfunktion für die Verwendung mit zustand/persist
   */
  public getMigrationFunction<T>(storeName: string): (persistedState: unknown, version: number) => T {
    const config = this.storeConfigs.get(storeName) as MigrationConfig<T>;
    
    if (!config) {
      throw new Error(`[MigrationManager] Store '${storeName}' nicht registriert, kann keine Migrationsfunktion erstellen`);
    }
    
    return (persistedState: unknown, persistedVersion: number): T => {
      const {
        schema,
        initialState,
        version: currentVersion,
        debug = false,
        storeName: storeLabel = storeName,
        transformers = {}
      } = config;
      
      if (debug) {
        console.log(`[MigrationManager] ${storeLabel}: Migration von Version ${persistedVersion} zu ${currentVersion} gestartet`, persistedState);
      }
      
      // Prüfe, ob es sich um ein gültiges Objekt handelt
      if (!persistedState || typeof persistedState !== 'object') {
        if (debug) {
          console.log(`[MigrationManager] ${storeLabel}: Ungültiger persistierter Zustand, verwende initialState`);
        }
        return { ...initialState };
      }
      
      // Transformationen anwenden, falls verfügbar
      let transformedState = persistedState;
      
      // Wenn Version unterschiedlich, durchlaufe Transformationen
      if (persistedVersion !== currentVersion) {
        // Prüfe, ob eine spezifische Transformation existiert
        const transformer = transformers[persistedVersion];
        
        if (transformer) {
          try {
            transformedState = transformer(persistedState);
            
            if (debug) {
              console.log(`[MigrationManager] ${storeLabel}: Transformierter Zustand:`, transformedState);
            }
          } catch (error) {
            console.error(`[MigrationManager] ${storeLabel}: Fehler bei Transformation von Version ${persistedVersion}:`, error);
            // Bei Transformationsfehlern auf initialState zurückfallen
            return { ...initialState };
          }
        }
      }
      
      try {
        // Vereinige transformierten Zustand mit dem initialState
        const mergedState = { ...initialState, ...transformedState };
        
        // Validiere mit dem Schema
        const validatedState = schema.parse(mergedState);
        
        if (debug) {
          console.log(`[MigrationManager] ${storeLabel}: Migration erfolgreich abgeschlossen`);
        }
        
        return validatedState;
      } catch (error) {
        if (debug) {
          console.error(`[MigrationManager] ${storeLabel}: Fehler bei der Migration:`, error);
        }
        
        // Versuche eine teilweise Validierung
        try {
          const partialState = { ...initialState };
          
          // Gehe durch alle Felder im initialState und versuche sie einzeln zu validieren
          for (const key in initialState) {
            if (Object.prototype.hasOwnProperty.call(initialState, key)) {
              try {
                // @ts-ignore - Dynamischer Zugriff auf Schema-Felder
                const fieldSchema = z.object({ [key]: schema.shape[key] });
                const result = fieldSchema.safeParse({ [key]: (persistedState as any)[key] });
                
                if (result.success) {
                  // @ts-ignore - Dynamischer Zugriff
                  partialState[key] = result.data[key];
                }
              } catch (e) {
                // Ignoriere Fehler für einzelne Felder
              }
            }
          }
          
          if (debug) {
            console.log(`[MigrationManager] ${storeLabel}: Teilweise Migration durchgeführt:`, partialState);
          }
          
          return partialState;
        } catch (e) {
          // Im Fehlerfall den initialState verwenden
          if (debug) {
            console.error(`[MigrationManager] ${storeLabel}: Kritischer Fehler bei der Migration, verwende initialState`);
          }
          return { ...initialState };
        }
      }
    };
  }
}

// Singleton-Instanz exportieren
export const migrationManager = MigrationManager.getInstance();

/**
 * Hilfsfunktion zum Erstellen eines Zod-Schemas für einen Store
 * @param schema Das Zod-Schema für den Store
 * @returns Das validierte Schema
 */
export function createStoreSchema<T extends z.ZodRawShape>(schema: T) {
  return z.object(schema);
}

/**
 * Registriert einen Store für die Migration
 * @param storeName Name des Stores
 * @param config Migrationskonfiguration
 */
export function registerStore<T>(storeName: string, config: MigrationConfig<T>): void {
  migrationManager.registerStore(storeName, config);
}

/**
 * Erstellt eine Migrationsfunktion für einen registrierten Store
 * @param storeName Name des registrierten Stores
 * @returns Migrationsfunktion für die Verwendung mit zustand/persist
 */
export function createMigration<T>(storeName: string): (persistedState: unknown, version: number) => T {
  return migrationManager.getMigrationFunction<T>(storeName);
}

/**
 * Validiert ein einzelnes Feld im Store
 * @param value Der zu validierende Wert
 * @param schema Schema für das Feld
 * @param defaultValue Standardwert, falls die Validierung fehlschlägt
 * @returns Validierter Wert oder Standardwert
 */
export function validateField<T>(
  value: unknown, 
  schema: z.ZodType<T>,
  defaultValue: T
): T {
  try {
    return schema.parse(value);
  } catch (error) {
    return defaultValue;
  }
} 