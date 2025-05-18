# Store-Migrationsframework

## Überblick

Das Store-Migrationsframework bietet eine standardisierte und robuste Methode, um persistierte Store-Daten bei App-Updates zu migrieren. Es sorgt dafür, dass Daten aus älteren App-Versionen sicher in das aktuelle Format konvertiert werden, wobei ungültige Daten erkannt und automatisch korrigiert werden.

## Hauptmerkmale

- **Zentraler Migrations-Manager**: Single-Entry-Point für alle Store-Migrationen
- **Standardisierte Migration**: Einheitlicher Ansatz für alle Stores
- **Schema-basierte Validierung**: Nutzt Zod für typensichere Validierung
- **Robuste Fehlerbehandlung**: Dreistufiger Mechanismus zur Reparatur ungültiger Daten
- **Flexible Anpassungsmöglichkeiten**: Versionsspezifische Transformationslogik
- **Debugging-Unterstützung**: Ausführliche Logging-Optionen

## Beispiel-Verwendung

### 1. Schema definieren

Zuerst definiert man ein Schema für den Store mit Zod:

```typescript
// stores/myStore/schema.ts
import { z } from "zod";
import { createStoreSchema } from "@/utils/store/migrationManager";

export const myStoreSchema = createStoreSchema({
  count: z.number(),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      active: z.boolean(),
    })
  ),
  lastUpdated: z.number(),
});
```

### 2. Store beim MigrationManager registrieren

Dann registriert man den Store beim zentralen MigrationManager:

```typescript
// stores/myStore.ts
import { registerStore, createMigration } from "@/utils/store/migrationManager";
import { myStoreSchema } from "./schema";

const initialState = {
  count: 0,
  items: [],
  lastUpdated: Date.now(),
};

// Registriere den Store beim MigrationManager
registerStore("myStore", {
  schema: myStoreSchema,
  initialState,
  version: 1,
  debug: true,
  storeName: "MyStore",
});
```

### 3. Migration in den Store integrieren

#### Mit createStore-Utility:

```typescript
import { createStore } from "@/stores/utils/createStore";
import { myStoreSchema } from "./schema";

export const useMyStore = createStore(
  (set) => ({
    ...initialState,
    // ... Aktionen
  }),
  {
    name: "my-store",
    persist: true,
    initialState,
    schema: myStoreSchema,
    debug: true,
    version: 1,
  }
);
```

#### Oder direkt mit Zustand:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMigration } from "@/utils/store/migrationManager";

export const useMyStore = create()(
  persist(
    (set) => ({
      ...initialState,
      // ... Aktionen
    }),
    {
      name: "my-store",
      storage: createJSONStorage(() => AsyncStorage),
      migrate: createMigration<typeof initialState>("myStore"),
      version: 1,
    }
  )
);
```

### 4. Versionsspezifische Transformationen (optional)

Für komplexere Migrationen kann man versionsspezifische Transformationen definieren:

```typescript
registerStore("myStore", {
  schema: myStoreSchema,
  initialState,
  version: 2, // Aktuelle Version
  debug: true,
  storeName: "MyStore",
  transformers: {
    // Migration von Version 1 zu Version 2
    1: (oldState) => {
      return {
        ...oldState,
        // Neue Felder mit Standardwerten
        newField: "defaultValue",
        // Alte Strukturen umwandeln
        items:
          (oldState as any).oldItems?.map((item) => ({
            id: item.id,
            name: item.label, // Feldumbenennung
            active: true, // Neues Feld mit Standardwert
          })) || [],
      };
    },
  },
});
```

## API-Referenz

### Funktionen

#### `registerStore<T>(storeName: string, config: MigrationConfig<T>): void`

Registriert einen Store für die Migration beim zentralen MigrationManager.

#### `createMigration<T>(storeName: string): (persistedState: unknown, version: number) => T`

Erstellt eine Migrationsfunktion für die Verwendung mit zustand/persist.

#### `createStoreSchema<T extends z.ZodRawShape>(schema: T)`

Hilfsfunktion zum Erstellen eines Zod-Schemas für einen Store.

#### `validateField<T>(value: unknown, schema: z.ZodType<T>, defaultValue: T): T`

Validiert ein einzelnes Feld und gibt den validierten Wert oder einen Standardwert zurück.

### Typen

#### `MigrationConfig<T>`

Konfiguration für eine Store-Migration:

- `schema`: Zod-Schema für die Validierung des Stores
- `initialState`: Initialer Zustand für Fallbacks
- `version`: Aktuelle Version des Schemas
- `debug`: (optional) Ob Debug-Logging aktiviert werden soll
- `storeName`: (optional) Name des Stores für Debug-Logging
- `transformers`: (optional) Versionsbasierte Transformationen als Record<number, (state: unknown) => Partial<T>>

## Dreistufiger Fehlerbehandlungsmechanismus

Der MigrationManager implementiert einen robusten dreistufigen Ansatz zur Fehlerbehandlung:

1. **Vollständige Validierung**: Versucht den kompletten Store zu validieren
2. **Partielle Validierung**: Bei Fehlern werden einzelne Felder validiert
3. **Fallback auf initialState**: Bei kritischen Fehlern wird der initialState verwendet

Dieses Verfahren stellt sicher, dass selbst bei teilweise korrupten Daten möglichst viele Informationen erhalten bleiben.

## Best Practices

1. **Zentralisierung**: Alle Stores über den MigrationManager registrieren
2. **Versionierung**: Bei Änderungen am Schema die Version erhöhen
3. **Initialzustand**: Immer einen vollständigen Initialzustand bereitstellen
4. **Transformers**: Bei Schemaänderungen entsprechende Transformer definieren
5. **Validierung**: Schema so streng wie nötig und so flexibel wie möglich definieren
6. **Debugging**: In der Entwicklung `debug: true` aktivieren für bessere Fehlerdiagnose
7. **Testing**: Test-Cases für Migrationsfunktionen schreiben, besonders für Upgrade-Pfade
