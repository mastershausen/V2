# MySolvbox Hooks

Diese Dokumentation beschreibt die überarbeitete Hook-Struktur für die MySolvbox-Tabs.

## Überblick

Die Hook-Struktur wurde vereinfacht und modularisiert, um:

- Die Einstiegshürde für neue Entwickler zu senken
- Die Wartbarkeit zu verbessern
- Delegationsmuster zu reduzieren
- Die Konsistenz zwischen verschiedenen Tabs zu erhöhen

## Hauptkonzepte

### Hook-Factory

Statt komplexer Hook-Hierarchien verwenden wir eine Hook-Factory, die es ermöglicht, spezialisierte Tab-Hooks mit minimalem Code zu erstellen:

```typescript
export const useGrowTab = createTabHook<GrowTileData>({
  tabId: "grow",
  fetchData: getGrowTileData,
  errorMessage: "Fehler beim Laden der Wachstumsdaten",
});
```

### Modulare Hilfsfunktionen

Für spezifische Anwendungsfälle stehen modulare Hilfsfunktionen zur Verfügung:

- `useTabDataLoader`: Zum Laden von Tab-Daten
- `useTabTileHandler`: Zum Erstellen von Kachel-Click-Handlern

## Einen neuen Tab-Hook erstellen

### 1. Standard-Tab ohne spezielle Logik

```typescript
// hooks/useNewTab.ts
import { getNewTabData } from "../data/newTabData";
import { NewTabData } from "../types";
import { createTabHook } from "./tabUtils";

export const useNewTab = createTabHook<NewTabData>({
  tabId: "newtab",
  fetchData: getNewTabData,
  errorMessage: "Fehler beim Laden der Neuen-Tab-Daten",
});
```

### 2. Tab mit erweiterter Logik

```typescript
// hooks/useAdvancedTab.ts
import { useState } from "react";
import { getAdvancedTabData } from "../data/advancedTabData";
import { AdvancedTabData } from "../types";
import { useTabDataLoader, useTabTileHandler } from "./tabUtils";

export function useAdvancedTab() {
  // Standard-State
  const [tiles, setTiles] = useState<AdvancedTabData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Eigene erweiterte State-Elemente
  const [specialSetting, setSpecialSetting] = useState<boolean>(false);

  // Standard-Daten laden
  useTabDataLoader({
    fetchData: getAdvancedTabData,
    setTiles,
    setIsLoading,
    setError,
    errorMessage: "Fehler beim Laden der erweiterten Daten",
    tabId: "advanced",
  });

  // Benutzerdefinierter Kachel-Handler mit Speziallogik
  const handleTilePress = useTabTileHandler("advanced", (tileId) => {
    console.log(`Spezial-Handling für Kachel ${tileId}`);
    setSpecialSetting(!specialSetting);
  });

  // Erweiterte API zurückgeben
  return {
    tiles,
    handleTilePress,
    isLoading,
    error,
    specialSetting,
    toggleSpecialSetting: () => setSpecialSetting(!specialSetting),
  };
}
```

## Vorteile der neuen Struktur

1. **Weniger Boilerplate-Code**: Standardfälle benötigen nur wenige Zeilen Code
2. **Klarere Verantwortlichkeiten**: Jeder Hook hat eine klar definierte Aufgabe
3. **Einfachere Wartung**: Änderungen an der gemeinsamen Logik an einem zentralen Ort
4. **Niedrigere Einstiegshürde**: Neue Entwickler können schnell produktiv werden
5. **Bessere Lesbarkeit**: Die Struktur ist intuitiver und selbsterklärender
