# Store-Verzeichnis (Zustandsverwaltung)

Dieses Verzeichnis enthält alle globalen Zustände (Stores) der Anwendung, strukturiert nach dem Stores-Pattern.

## Struktur

```
stores/
  ├── utils/                      # Hilfsfunktionen für Stores
  │   └── createStore.ts          # Factory-Funktion für Stores
  ├── types/                      # TypeScript-Definitionen
  │   └── [storeName]Types.ts     # Typen für einen spezifischen Store
  ├── actions/                    # Store-Aktionen (zustandsverändernde Funktionen)
  │   └── [storeName]Actions.ts   # Aktionen für einen Store
  ├── selectors/                  # Store-Selektoren (berechnete Werte)
  │   └── [storeName]Selectors.ts # Selektoren für einen Store
  ├── constants/                  # Konstanten und Mock-Daten
  │   └── [storeName]Constants.ts # Konstanten für einen Store
  ├── tests/                      # Tests und Beispiele
  │   └── [storeName].test.ts     # Tests für einen Store
  └── [storeName].ts              # Hauptdatei für einen Store
```

## Core Stores

- **userStore**: Authentifizierungszustand und Benutzerdaten
- **uiStore**: UI-bezogene Zustände (Theme, Flags, etc.)
- **apiStore**: API-Status und -Cache

## Feature Stores

- **mysolvboxStore**: Status für das mysolvbox-Feature
- **solvboxaiStore**: Status für das solvboxai-Feature

## Verwendung

### Store erstellen

Folge den Schritten in der Dokumentation (`docs/store-pattern.md`), um einen neuen Store zu erstellen:

1. Definiere die Typen in `types/[storeName]Types.ts`
2. Definiere die Aktionen in `actions/[storeName]Actions.ts`
3. Definiere die Selektoren in `selectors/[storeName]Selectors.ts`
4. Definiere Konstanten in `constants/[storeName]Constants.ts` (optional)
5. Erstelle die Hauptdatei `[storeName].ts`

### Store verwenden

```typescript
import { useMyStore } from "@/stores/myStore";

function MyComponent() {
  const {
    // Zustand
    data,

    // Aktionen
    fetchData,

    // Selektoren
    isDataValid,
  } = useMyStore();

  // ...
}
```

## Weitere Informationen

Siehe `docs/store-pattern.md` für eine detaillierte Dokumentation des Store-Patterns.
