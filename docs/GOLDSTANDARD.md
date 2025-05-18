# Goldstandard für die Solvbox-App

Dieses Dokument definiert die Goldstandard-Prinzipien für die Solvbox-App anhand des Beispiels von MySolvboxScreen.

## Über diesen Goldstandard

**Wichtig: Dieser Goldstandard dient als Orientierung, nicht als dogmatisches Regelwerk.**

Das Ziel ist eine **Balance zwischen sauberer Architektur und praktischer Funktionalität**. Folgende Grundsätze gelten:

1. **Funktionalität hat Vorrang** vor architektonischer Perfektion
2. **Pragmatismus ist wichtiger** als akademische Reinheit
3. **Lesbarkeit und Wartbarkeit** sind entscheidend
4. **Inkrementelle Verbesserungen** sind besser als keine Verbesserungen

Dieser Goldstandard ist bewusst als **konkrete Referenzimplementierung** gestaltet. Du solltest in der Lage sein, einen Screen zu refaktorieren, indem du diesem Dokument folgst, ohne weitere Fragen stellen zu müssen.

## Praktische Anwendung dieses Goldstandards

Wenn du einen Screen refaktorieren sollst, gehe so vor:

1. **Trenne UI von Logik**: Extrahiere alle Geschäftslogik in einen spezialisierten Hook
2. **Identifiziere Konfigurationen**: Lagere Konstanten und Konfigurationen in separate Dateien aus
3. **Nutze Basis-Hooks**: Baue auf vorhandenen Hooks wie useTabs oder useSearch auf
4. **Zentralisiere Typen**: Definiere alle Typen zentral in einer types/index.ts
5. **Klare Store-Aktionen**: Halte Store-Aktionen in separaten Dateien mit klarer Struktur

Fokussiere dich zunächst auf die grundlegenden Änderungen, die den größten Mehrwert bringen. Perfektioniere später, wenn Zeit bleibt.

## Kernprinzipien

1. **Trennung von UI und Logik**
2. **Zentralisierung von Konfigurationen**
3. **Typsicherheit durch TypeScript**
4. **Einheitliche Hook-Architektur**
5. **Modularisierter Store-Aufbau**

## Beispiel: MySolvboxScreen

Der `MySolvboxScreen` verkörpert alle Goldstandard-Prinzipien und dient als Referenzimplementierung:

```tsx
import React from "react";
import { useTranslation } from "react-i18next";

import {
  TabScreensContainer,
  TabbarComponentProps,
} from "@/shared-components/container/TabScreensContainer";

import { MySolvboxTabbarContainer } from "../components/container/MySolvboxTabbarContainer";
import { useMySolvbox } from "../hooks/useMySolvbox";

/**
 * MySolvbox-Hauptbildschirm mit Tabs und kompakter, dezenter Suchfunktion
 *
 * Verwendet den useMySolvbox-Hook, der die gesamte Geschäftslogik kapselt
 * und dem Screen eine einheitliche API zur Verfügung stellt.
 *
 * Diese Komponente ist jetzt eine reine UI-Komponente, ohne eigene Zustandslogik.
 * Alle Funktionalität wird vom useMySolvbox-Hook bereitgestellt.
 * @returns {React.ReactElement} Die gerenderte MySolvboxScreen-Komponente mit Tabs und Suchfeld
 */
export default function MySolvboxScreen(): React.ReactElement {
  const { t } = useTranslation();

  // Hole alle benötigten Daten und Funktionen aus dem Hook
  const { tabs, activeTabId, handleTabChange, handleSearchChange } =
    useMySolvbox();

  // Typ-Konvertierung für die TabbarComponent
  const TabbarWithTypes =
    MySolvboxTabbarContainer as React.ComponentType<TabbarComponentProps>;

  return (
    <TabScreensContainer
      tabs={tabs}
      activeTab={activeTabId}
      onTabChange={handleTabChange}
      showSearch={true}
      onSearchChange={handleSearchChange}
      TabbarComponent={TabbarWithTypes}
      searchPlaceholder={t("common.search")}
      compactSearch={true}
      subtleSearch={true}
    />
  );
}
```

### Was macht den Screen zum Goldstandard?

1. **Reine UI-Komponente**: Der Screen enthält keine Geschäftslogik, sondern bezieht diese aus einem speziellen Hook.
2. **JSDoc**: Umfassende Dokumentation durch JSDoc-Kommentare.
3. **Klarer Exportstil**: Default-Export für den Screen.
4. **Typsicherheit**: Durchgängige TypeScript-Typisierung und explizite Typkonvertierung.

## Hook-Architektur

Die `useMySolvbox`-Hook-Implementierung zeigt die ideale Hook-Struktur:

```tsx
export function useMySolvbox(): UseTabScreenResult<MySolvboxTabId> {
  const { t } = useTranslation();

  // Tab-Komponenten für die Konfiguration
  const tabComponents = useMemo(
    () => ({
      save: SaveTab,
      grow: GrowTab,
      foresight: ForesightTab,
      bonus: BonusTab,
    }),
    []
  );

  // Stabile Tab-Konfiguration mit übersetzten Labels aus der zentralen Konfiguration
  const MYSOLVBOX_TABS = useMemo<MySolvboxTabConfig[]>(
    () => createTabConfigs(t, tabComponents),
    [t, tabComponents]
  );

  // Zugriff auf den MySolvbox-Store mit Selektoren
  const store = useMysolvboxStore();

  // Selektoren memoizieren, um stabile Referenzen zu gewährleisten
  const selectors = useMemo(() => createBoundSelectors(store), [store]);

  // Basishooks für gemeinsame Funktionalität
  const tabManagement = useTabs<MySolvboxTabId>({
    tabs: MYSOLVBOX_TABS,
    defaultTabId: DEFAULT_TAB_ID,
    activeTab: selectors.activeTab,
    setActiveTab: store.setActiveTab,
    validateTabId: useCallback(
      (tabId) => mysolvboxService.isValidTabId(tabId, MYSOLVBOX_TABS),
      [MYSOLVBOX_TABS]
    ),
  });

  const searchManagement = useSearch({
    onQueryChange: handleSearchChange,
  });

  // Automatisches Laden bei Tab-Wechsel
  useEffect(() => {
    if (selectors.shouldReloadTiles) {
      store.loadTabTiles();
    }
  }, [selectors.activeTab, selectors.shouldReloadTiles, store.loadTabTiles]);

  // Einheitliche API zurückgeben
  return {
    ...tabManagement,
    ...searchManagement,
    isLoading: store.isLoading,
    isError: Boolean(store.error),
    error: store.error ? new Error(store.error) : null,
    data: {
      tiles: selectors.activeTiles,
      allTiles: selectors.allTiles,
      lastLoaded: selectors.lastLoaded,
    },
  };
}
```

### Charakteristika des Goldstandard-Hooks:

1. **Komposition**: Basiert auf Basis-Hooks (useTabs, useSearch)
2. **Memoization**: Stabile Referenzen durch useMemo
3. **Einheitliche API**: Klare, konsistente Rückgabestruktur
4. **Separation of Concerns**: Trennung in Daten, UI-Zustand und Aktionen
5. **Typsicherheit**: Vollständige TypeScript-Typisierung

## Konfigurationsmanagement

Die Zentralisierung von Konfigurationen ist ein Kernprinzip:

```tsx
// Beispiel: features/mysolvbox/config/tabs.ts
export const TAB_IDS = {
  SAVE: "save" as const,
  GROW: "grow" as const,
  FORESIGHT: "foresight" as const,
  BONUS: "bonus" as const,
};

export const DEFAULT_TAB_ID: MySolvboxTabId = TAB_IDS.SAVE;

export function isValidTabId(tabId: string): tabId is MySolvboxTabId {
  return Object.values(TAB_IDS).includes(tabId as MySolvboxTabId);
}

export function createTabConfigs(
  t: (key: string) => string,
  components: Record<MySolvboxTabId, React.ComponentType>
): MySolvboxTabConfig[] {
  return [
    { id: TAB_IDS.SAVE, label: t("tabs.save"), component: components.save },
    { id: TAB_IDS.GROW, label: t("tabs.grow"), component: components.grow },
    {
      id: TAB_IDS.FORESIGHT,
      label: t("tabs.foresight"),
      component: components.foresight,
    },
    { id: TAB_IDS.BONUS, label: t("tabs.bonus"), component: components.bonus },
  ];
}
```

### Prinzipien der Konfigurationsverwaltung:

1. **Zentrale Konstanten**: TAB_IDS als Quelle der Wahrheit
2. **Typensicherheit**: TypeScript-Literaltypen für stärkere Typisierung
3. **Validierungsfunktionen**: Integrierte Validierungslogik
4. **Lokalisierung**: Integration mit i18n-System
5. **Erweiterbarkeit**: Einfaches Hinzufügen neuer Tabs

## Service-Schicht

Die Service-Schicht folgt dem Singleton-Pattern und kapselt komplexe Geschäftslogik:

```tsx
export class MySolvboxService {
  private static instance: MySolvboxService;

  public static getInstance(): MySolvboxService {
    if (!MySolvboxService.instance) {
      MySolvboxService.instance = new MySolvboxService();
    }
    return MySolvboxService.instance;
  }

  public isValidTabId(
    tabId: string,
    tabs: MySolvboxTabConfig[]
  ): tabId is MySolvboxTabId {
    return tabs.some((tab) => tab.id === tabId);
  }

  public async getTilesForTab(
    tabId: string,
    forceRefresh = false
  ): Promise<MySolvboxTile[]> {
    try {
      if (!this.isTabIdValid(tabId)) {
        throw new Error(`Ungültige Tab-ID: ${tabId}`);
      }

      const allTiles = await tileService.getMySolvboxTiles(forceRefresh);
      return allTiles.filter((tile) => tile.tabId === tabId);
    } catch (error) {
      logger.error("Fehler beim Abrufen der MySolvbox-Kacheln:", error);
      return [];
    }
  }
}
```

### Service-Prinzipien:

1. **Singleton-Pattern**: Einheitlicher Zugriffspunkt
2. **Verantwortlichkeitstrennung**: Klare Zuständigkeiten
3. **Fehlerbehandlung**: Robuste Fehlerbehandlung
4. **Validierung**: Integrierte Validierungslogik
5. **Logging**: Konsistentes Logging

## Store-Architektur

Die Store-Architektur basiert auf dem Zustand-Pattern mit klarer Trennung von Aktionen und Zustand:

```tsx
// Store-Definition
export const useMysolvboxStore = createStore<MySolvboxStore>(
  (set, get) => {
    // Aktionen erzeugen
    const actions = createMySolvboxActions(set, get);

    // Store zusammensetzen
    return {
      // Initialer Zustand
      ...initialState,

      // Aktionen
      ...actions,
    };
  },
  {
    name: "mysolvbox",
    persist: true,
    partialize: (state) => ({
      activeTab: state.activeTab,
      tiles: state.tiles,
      lastLoaded: state.lastLoaded,
    }),
  }
);

// Aktionen in separater Datei
export const createMySolvboxActions = (set: SetFunction, get: GetFunction) => ({
  setActiveTab: (tab: string) => {
    if (mysolvboxService.isTabIdValid(tab)) {
      set((state) => ({ activeTab: tab }));
      logger.info("MySolvbox: Aktiver Tab geändert auf", tab);
    } else {
      logger.warn(`MySolvbox: Ungültiger Tab-Name: ${tab}`);
    }
  },

  loadTabTiles: async (forceRefresh = false) => {
    const activeTab = get().activeTab;

    try {
      // Lade-Status setzen
      set((state) => ({
        isLoading: true,
        error: null,
      }));

      // Kacheln laden
      const tiles = await mysolvboxService.getTilesForTab(
        activeTab,
        forceRefresh
      );

      // Erfolgsfall
      set((state) => ({
        tiles: validateTiles(tiles),
        lastLoaded: new Date().toISOString(),
        isLoading: false,
      }));
    } catch (error) {
      // Fehlerfall
      set((state) => ({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      }));
    }
  },
});
```

### Store-Prinzipien:

1. **Aktions-Trennung**: Aktionen in separater Datei
2. **createStore-Utility**: Einheitliches Store-Erstellungsmuster
3. **Validierung**: Integrierte Datenvalidierung
4. **Fehlerbehandlung**: Robuste Fehlerbehandlung im Store
5. **Selektive Persistenz**: Partielle Persistenz über partialize-Funktion

## Typdefinitionen

Zentrale Typdefinitionen gewährleisten Konsistenz und Wiederverwendbarkeit:

```tsx
// features/mysolvbox/types/index.ts
export type MySolvboxTabId = "save" | "grow" | "foresight" | "bonus";

export interface MySolvboxTabConfig extends TabConfig {
  id: MySolvboxTabId;
}

export interface SaveTileData extends TileData {
  category: "cost" | "revenue" | "protection" | "legal" | "other";
}

export interface GrowTileData extends TileData {
  category: string;
  complexity?: string;
}

// Typ-Mapping für typspezifische Funktionen
export interface TabDataTypeMap {
  save: SaveTileData;
  grow: GrowTileData;
  foresight: ForesightTileData;
  bonus: BonusTileData;
}
```

### Typ-Prinzipien:

1. **String-Literale**: Für stärkere Typ-Prüfung
2. **Interface-Erweiterung**: Typ-Hierarchie durch Erweiterung
3. **Zentrale Definition**: Alle Typen in einer zentralen Datei
4. **Type-Mapping**: Zuordnung von Typen zu Identifikatoren
5. **Strenge Typsicherheit**: Keine any-Verwendung

## Testkonzept

Unser Testansatz folgt dem Prinzip des "pragmatischen ROI" (Return on Investment). Tests sollen die Entwicklung beschleunigen, nicht verlangsamen.

```tsx
// Beispiel für einen fokussierten, ROI-orientierten Test
describe("tileIds Utilities", () => {
  test("toNumericId sollte string zu number korrekt konvertieren", () => {
    expect(toNumericId("123")).toBe(123);
    expect(toNumericId(456)).toBe(456);
  });

  test("findTileById sollte Kachel mit korrekter ID finden", () => {
    const tiles = [
      { id: 1, title: "Test" },
      { id: 2, title: "Test 2" },
    ];
    expect(findTileById(tiles, 1)?.title).toBe("Test");
    expect(findTileById(tiles, 3)).toBeUndefined();
  });
});
```

### ROI-basierte Teststrategie:

1. **Fokus auf kritische Pfade** statt vollständiger Abdeckung:

   - Priorisiere Tests für Code, der bereits Probleme verursacht hat
   - Teste Kernfunktionen, die von vielen anderen Komponenten genutzt werden
   - Teste Teile mit komplexer Geschäftslogik, die schwer zu debuggen ist

2. **Effizienz durch gezielte Tests**:

   - **Hoher ROI**: Einfache Utility-Funktionen (5-10 Tests)
   - **Mittlerer ROI**: Kernhooks und Services (3-5 Tests pro Hook)
   - **Niedriger ROI**: Mache sie optional oder schiebe sie auf

3. **"Bug-getriebenes Testing"**:
   - **Regression-Prävention**: Schreibe Tests für gefundene Bugs
   - **Minimale Mocks**: Verwende einfache, wartungsarme Testdaten

### Konkrete Testpriorisierung:

1. **Utilities (höchste Priorität)**:

   - ID-Management-Funktionen
   - Daten-Transformation-Funktionen
   - Validierungsfunktionen

2. **Hooks (mittlere Priorität)**:

   - Grundfunktionen testen (Init, Filter, Fehlerbehandlung)
   - Keine umfassenden Render-Tests

3. **Komponenten (niedrigste Priorität)**:
   - Nur grundlegende Snapshot-Tests
   - Komplexe Interaktionen sind optional

### Testprinzipien:

1. **Tests als Beschleuniger**: Tests sollen helfen, nicht behindern
2. **Qualität über Quantität**: Wenige aussagekräftige Tests sind besser als viele oberflächliche
3. **Priorisierung nach Risiko**: Mehr Tests für fehleranfällige Bereiche
4. **Wartungsarme Tests**: Einfach zu verstehen und zu aktualisieren
5. **YAGNI für Tests**: "You Aren't Gonna Need It" - teste, was heute wichtig ist

Dieser Ansatz gewährleistet eine Balance zwischen Testabdeckung und Entwicklungsgeschwindigkeit, indem er den größten Nutzen mit dem geringsten Aufwand erzielt.

## Konsistentes ID-Management

Das Management von IDs in der Anwendung ist ein wichtiger Aspekt, der oft übersehen wird. Der Goldstandard definiert einen klaren Ansatz für konsistente und typsichere ID-Verwaltung:

```tsx
// features/mysolvbox/utils/tileIds.ts
export type TileId = number;

// Re-export nützlicher Funktionen aus der Konfiguration für einfacheren Zugriff
export { isValidMySolvboxTileId, getTileTypeFromId };

export function toNumericId(id: TileId): number {
  return id;
}

export function isValidId(id: TileId): boolean {
  return isValidMySolvboxTileId(id);
}

export function generateUniqueId(
  tabId: MySolvboxTabId,
  existingIds: TileId[] = []
): number {
  const range = ID_RANGES.MYSOLVBOX[tabId];
  const prefix = range.START;

  // Finde die höchste vorhandene ID
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : prefix;

  // Neue ID ist eine Einheit höher
  return maxId + 1;
}

export function findTileById<T extends TileData>(
  tiles: T[],
  id: TileId
): T | undefined {
  return tiles.find((tile) => tile.id === id);
}
```

### ID-Management-Prinzipien:

1. **Typsichere Definitionen**: Je nach Anwendungskontext wird der geeignete Typ gewählt:

   - `number` für interne, stabile Systeme (z.B. MySolvbox)
   - `string | number` für flexible Systeme mit externen Schnittstellen (z.B. SolvboxAI)

2. **Zentrale Utility-Funktionen**: Alle ID-bezogenen Operationen werden in einer zentralen Datei gebündelt:

   - Konvertierungsfunktionen (`toNumericId`, `toStringId`)
   - Validierungsfunktionen (`isValidId`)
   - Generierungsfunktionen (`generateUniqueId`)
   - Hilfsfunktionen (`findTileById`, `extractIds`)

3. **Konsistente API**: Unabhängig vom konkreten ID-Typ bieten die Funktionen eine einheitliche Schnittstelle, was die Austauschbarkeit und Wartbarkeit verbessert.

4. **Kompatibilitätsschicht**: Spezielle Funktionen wie `toTileGridId` sorgen für Kompatibilität zwischen verschiedenen Subsystemen mit unterschiedlichen ID-Anforderungen.

5. **Vorteile für Frontend-Komponenten**: Durch die Abstrahierung des ID-Managements wird der Code in Komponenten einfacher und klarer:
   ```tsx
   <TileGrid
     tiles={tiles.map((tile) => ({
       ...tile,
       id: toTileGridId(tile.id), // Konvertiert ID zum benötigten Format
     }))}
     onTilePress={handleTilePress}
   />
   ```

Dieser Ansatz folgt dem pragmatischen Geist des Goldstandards: Die konkreten ID-Typen können je nach Kontext variieren, aber die konsistente API abstrahiert diese Unterschiede und bietet Entwicklern eine einheitliche, typsichere Schnittstelle.

## Internationalisierung (i18n)

Die Internationalisierung der Anwendung folgt dem Prinzip der pragmatischen Priorisierung. Wir setzen auf einen ROI-basierten Ansatz, der die wichtigsten UI-Elemente zuerst übersetzt und komplexere Inhalte in späteren Phasen adressiert.

```tsx
// Beispiel für eine typische i18n-Integration in einer Komponente
import { useTranslation } from "react-i18next";

export default function SolvboxAIScreen() {
  const { t } = useTranslation();

  const tabsWithComponents = useMemo<TabConfig[]>(
    () => [
      {
        id: "gigs",
        label: t("solvboxai.tabs.gigs"),
        component: GigsTab,
      },
      {
        id: "casestudies",
        label: t("solvboxai.tabs.casestudies"),
        component: CaseStudiesTab,
      },
    ],
    [t]
  );

  // ...
}
```

### Internationalisierungs-Prinzipien:

1. **Pragmatische Priorisierung**:

   - **Sofort**: UI-Elemente (Tab-Labels, Fehlermeldungen, Filterkategorien)
   - **Später**: Umfangreiche Inhalte und Beispieldaten

2. **Strukturierte Übersetzungsdateien**:

   - Klare Hierarchie in der i18n/de.json (modulare Struktur nach Features)
   - Konsistente Benennungskonventionen (z.B. feature.bereich.element)

3. **Typensichere i18n-Utilities**:

   - Hilfsfunktionen für spezielle Übersetzungsfälle (z.B. für Kategorienamen)
   - Validierung von Übersetzungsschlüsseln, wo möglich

4. **Fallback-Strategien**:

   - Default-Werte für wichtige UI-Texte, falls Übersetzungen fehlen
   - Logging fehlender Übersetzungen im Entwicklungsmodus

5. **Beispiel für einen typischen Übersetzungsschlüssel-Aufbau**:
   ```json
   {
     "mysolvbox": {
       "tabs": {
         "save": "Sparen",
         "grow": "Wachsen"
       }
     },
     "solvboxai": {
       "tabs": {
         "gigs": "Gigs",
         "casestudies": "Fallstudien"
       },
       "categories": {
         "all": "Alle",
         "finance": "Finanzen"
       },
       "errors": {
         "invalidTabId": "Ungültige Tab-ID: {tabId}"
       }
     }
   }
   ```

Dieser Ansatz stellt sicher, dass die App schnell internationalisiert werden kann, ohne den Entwicklungsprozess zu verlangsamen. Die 80/20-Regel wird angewandt: Mit 20% Aufwand werden 80% der sichtbaren UI-Elemente übersetzt, während die restlichen Inhalte inkrementell in späteren Phasen adressiert werden können.

## Fazit

Der Goldstandard verkörpert die ideale Balance aus:

1. **Modularität**: Klare Trennung von Verantwortlichkeiten
2. **Wiederverwendbarkeit**: Aufbau auf Basis-Komponenten und -Hooks
3. **Wartbarkeit**: Klare Struktur und Dokumentation
4. **Typsicherheit**: Durchgängige TypeScript-Nutzung
5. **Erweiterbarkeit**: Einfaches Hinzufügen neuer Funktionen

Bei der Implementierung neuer Features oder der Refaktorierung bestehender Komponenten sollte dieser Goldstandard als Orientierung dienen.

## Der pragmatische Ansatz

Zum Schluss noch einmal das Wichtigste: **Dieser Goldstandard ist als praktische Anleitung gedacht, nicht als dogmatisches Regelwerk.**

Die besten Architekturen entstehen aus pragmatischen Entscheidungen:

- **80% Lösung jetzt** ist besser als 100% Lösung, die nie fertig wird
- **Funktionieren hat Priorität** gegenüber perfekter Architektur
- **Kleine Verbesserungen** summieren sich zu großen Fortschritten
- **Kontext entscheidet** - manchmal ist eine Abweichung vom Standard die beste Lösung

Wenn du zwischen Perfektion und Funktionalität entscheiden musst, wähle Funktionalität. Strebe danach, mit jeder Änderung den Code ein bisschen besser zu hinterlassen als du ihn vorgefunden hast.

**Schätze deine Zeit und die deiner Kollegen** – architektonische Entscheidungen sollten immer darauf abzielen, die Entwicklung zu beschleunigen und zu vereinfachen, nicht zu verkomplizieren.
