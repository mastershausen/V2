# SolvboxAI Feature

Das SolvboxAI-Feature ist ein Modul der Solvbox-App, das KI-basierte Lösungen und Tools für Nutzer bereitstellt. Dieses Dokument erklärt die Architektur und Komponenten des Features.

## Architektur

SolvboxAI folgt dem Goldstandard-Architekturmuster der Solvbox-App mit klarer Trennung von UI und Geschäftslogik:

```
features/solvboxai/
├── components/        # UI-Komponenten
│   └── container/     # Container-Komponenten mit Geschäftslogik
├── config/            # Konfigurationsdateien
├── hooks/             # Custom React Hooks
├── screens/           # Screen-Komponenten
├── services/          # Services für API-Zugriff und Geschäftslogik
├── types/             # TypeScript-Typendefinitionen
└── utils/             # Hilfsfunktionen
```

## Hauptkomponenten

### Screens

- `SolvboxAIScreen`: Hauptbildschirm, der die Tabs und Suchfunktionalität verwaltet
- `GigsTab`: Zeigt verfügbare KI-Gigs an
- `CaseStudiesTab`: Zeigt Fallstudien zur KI-Anwendung an

### Hooks

- `useSolvboxAI`: Haupthook für SolvboxAI-Funktionalität, der alle Operationen kapselt
- `useGigsTab`: Spezialisierter Hook für den Gigs-Tab
- `useCaseStudiesTab`: Spezialisierter Hook für den Fallstudien-Tab

### Services

- `SolvboxAIService`: Singleton-Service für alle SolvboxAI-Operationen wie Datenabruf und Datenverarbeitung

### Konfiguration

- `tabs.ts`: Zentrale Definition aller Tab-IDs und Konfigurationen
- `data.ts`: Mock-Daten und Hilfsfunktionen für die Entwicklung

## Datenfluss

1. Der `SolvboxAIScreen` initialisiert den `useSolvboxAI`-Hook
2. Der Hook greift auf den `SolvboxAIService` zu, um Daten zu laden
3. Tab-spezifische Hooks (`useGigsTab`, `useCaseStudiesTab`) verarbeiten die Daten für ihre jeweiligen Tabs
4. Die UI-Komponenten zeigen die Daten an und reagieren auf Benutzerinteraktionen

## Typsystem

Alle Typdefinitionen sind in `types/index.ts` zentralisiert:

- `SolvboxAITabId`: String-Literal für valide Tab-IDs
- `SolvboxAITileData`: Basistyp für alle Kachel-Daten
- Spezialisierte Typen wie `GigTileData` und `CaseStudyTileData`

## Implementierungsdetails

### Singleton-Pattern

Der `SolvboxAIService` verwendet das Singleton-Pattern, um sicherzustellen, dass nur eine Instanz des Services existiert:

```typescript
public static getInstance(): SolvboxAIService {
  if (!SolvboxAIService.instance) {
    SolvboxAIService.instance = new SolvboxAIService();
  }
  return SolvboxAIService.instance;
}
```

### Hook-Factory-Pattern

Das `createTabHook`-Utility in `tabUtils.ts` verwendet ein Factory-Pattern, um spezialisierte Hooks mit gemeinsamer Grundfunktionalität zu erstellen:

```typescript
export function createTabHook<T extends SolvboxAITileData>(config: {
  tabId: SolvboxAITabId;
  fetchData: () => Promise<T[]>;
  errorMessage: string;
  onTilePress?: (tile: T) => void;
}) {
  return function useCreatedTabHook() {
    // Implementierung...
  };
}
```

## Goldstandard-Konformität

Das SolvboxAI-Feature folgt dem Goldstandard mit:

1. **Trennung von UI und Logik**: Geschäftslogik ist in Hooks und Services gekapselt
2. **Modulare Struktur**: Klare Verantwortlichkeiten für Komponenten und Services
3. **Typsicherheit**: Durchgängige TypeScript-Nutzung mit zentralen Typendefinitionen
4. **Wiederverwendbarkeit**: Gemeinsame Funktionalität durch Utility-Funktionen und Basis-Hooks
5. **Pragmatismus**: Abwägung zwischen Architektur und Funktionalität
