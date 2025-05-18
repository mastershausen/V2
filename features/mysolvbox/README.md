# MySolvbox - Architektur und Konzepte

## Überblick

MySolvbox ist ein modularer Tab-basierter Bereich der Solvbox-App, der verschiedene Themenbereiche wie Sparen, Wachstum, Vorausschau und Bonus-Funktionen anbietet. Jeder Tab enthält spezifische Kacheln mit Aktionen oder Informationen für den Benutzer.

## Architektur

Die MySolvbox-Architektur basiert auf folgenden Prinzipien:

1. **Zentrale Typdefinitionen**: Alle Typen sind zentral in `types/index.ts` definiert
2. **Gemeinsame Basis-Komponenten**: Wiederverwendbare UI-Komponenten in `components/`
3. **Tab-spezifische Screens**: Jeder Tab hat einen eigenen Screen in `screens/`
4. **Modulare Hook-Struktur**: Utility-Funktionen und Hook-Factory statt Delegation

### State-Management

MySolvbox verwendet ein hybrides State-Management-Modell:

- **Zentraler Store**: Verwaltet gemeinsame Daten (aktiver Tab, Kacheldaten)
- **Lokaler State**: Für UI-spezifische Zustände in Komponenten

```
┌─────────────────────────────────────────┐
│             MySolvboxStore              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │activeTab│  │  tiles  │  │  error  │  │
│  └─────────┘  └─────────┘  └─────────┘  │
└───────────────────┬─────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼──────────┐   ┌────────▼─────────┐
│   useMySolvbox   │   │     tabUtils     │
└───────┬──────────┘   └────────┬─────────┘
        │                       │
┌───────▼────────────────────────▼─────────┐
│ useSaveTab, useGrowTab, useForesightTab, │
│               useBonusTab                │
└────────────────────┬─────────────────────┘
                     │
┌────────────────────▼─────────────────────┐
│              UI-Komponenten              │
└─────────────────────────────────────────┘
```

## Hauptkomponenten

### Typsystem (`types/index.ts`)

Zentrale Typdefinitionen für alle MySolvbox-Komponenten:

- `TileData`: Basistyp für alle Kachel-Daten
- `SaveTileData`, `GrowTileData`, etc.: Spezialisierte Typen
- `MySolvboxTabId`: Union-Typ für Tab-IDs
- `BaseTabHookResult`: Gemeinsame Struktur für Tab-Hook-Ergebnisse

### Hooks und Utilities

Die modulare Hook-Struktur:

1. **`tabUtils`**: Zentrale Utility-Funktionen für Tab-Hooks:

   - `createTabHook`: Factory-Funktion für die einfache Erstellung von Tab-Hooks
   - `useTabDataLoader`: Zum Laden von Tab-Daten
   - `useTabTileHandler`: Zum Erstellen von Kachel-Click-Handlern

2. **Tab-spezifische Hooks**:

   - Standard-Implementierung mit `createTabHook`:

     ```typescript
     export const useGrowTab = createTabHook<GrowTileData>({
       tabId: "grow",
       fetchData: getGrowTileData,
       errorMessage: "Fehler beim Laden der Wachstumsdaten",
     });
     ```

   - Erweiterte Implementierung mit direkten Hilfsfunktionen:
     ```typescript
     export function useForesightTab() {
       const [tiles, setTiles] = useState<ForesightTileData[]>([]);
       // ... weitere State-Elemente ...

       useTabDataLoader({...});
       const handleTilePress = useTabTileHandler('foresight');

       // ... spezifische Logik ...

       return {
         // Standard-API
         tiles, handleTilePress, isLoading, error,
         // Erweiterte API
         // ... zusätzliche Funktionen ...
       };
     }
     ```

3. **`useMySolvbox`**: Haupthook für den gesamten MySolvbox-Bereich:
   - Stellt Tab-Konfiguration bereit
   - Verwaltet die Suche
   - Verbindet den zentralen Store mit den Tab-Hooks

### Store (`stores/mysolvboxStore.ts`)

Der zentrale Store für MySolvbox verwendet eine zustandsbasierte Architektur und bietet:

- **State**: `activeTab`, `tiles`, `isLoading`, `error`
- **Aktionen**: `setActiveTab`, `loadTabTiles`, `clearError`
- **Persistenz**: Speichert ausgewählte Daten lokal

## Verwendung

### Beispiel: Einbinden von MySolvbox

```tsx
import { MySolvboxScreen } from "features/mysolvbox/screens/MySolvboxScreen";

function App() {
  return (
    <View>
      <MySolvboxScreen />
    </View>
  );
}
```

### Beispiel: Direkter Store-Zugriff

```tsx
import { useMysolvboxStore } from "@/stores/mysolvboxStore";

function SomeComponent() {
  const store = useMysolvboxStore();

  // Store-Daten verwenden
  const { activeTab, isLoading } = store;

  // Aktion auslösen
  const handleRefresh = () => store.loadTabTiles(true);

  // ...
}
```

### Erstellen eines neuen Tabs

Dank der Hook-Factory ist es nun sehr einfach, einen neuen Tab zu erstellen:

```tsx
// 1. Daten definieren
// data/newTabData.ts
export function getNewTabData(): NewTabData[] {
  return NEW_TAB_TILES;
}

// 2. Hook erstellen
// hooks/useNewTab.ts
import { createTabHook } from "./tabUtils";

export const useNewTab = createTabHook<NewTabData>({
  tabId: "newtab",
  fetchData: getNewTabData,
  errorMessage: "Fehler beim Laden der Daten",
});

// 3. Tab-Komponente erstellen
// screens/NewTab.tsx
function NewTab() {
  const { tiles, handleTilePress, isLoading, error } = useNewTab();

  return (
    <BaseTabScreen tabId="newtab" isLoading={isLoading}>
      <TileGrid
        tiles={tiles}
        onTilePress={handleTilePress}
        errorFallback={error ? <ErrorMessage /> : undefined}
      />
    </BaseTabScreen>
  );
}
```

## Best Practices

1. **Typen konsequent nutzen**: Immer die korrekten Tab- und Tile-Typen verwenden
2. **Store nur für geteilte Daten nutzen**: Lokalen State für UI-spezifisches
3. **Hooks für die Geschäftslogik**: UI bleibt frei von Logik
4. **Modularität bevorzugen**: Für komplexe Tabs einzelne Funktionen statt Delegation verwenden
5. **Hook-Factory nutzen**: Für Standardfälle die `createTabHook`-Factory verwenden
