# Namenskonventionen für MySolvBox

Dieses Dokument beschreibt die standardisierten Namenskonventionen für die MySolvBox-Anwendung.

## Verzeichnisstruktur

```
features/mysolvbox/               # Feature-Verzeichnis mit "My"-Präfix
├── components/                   # Komponenten
│   ├── ui/                       # Reine UI-Komponenten
│   └── container/                # Container-Komponenten mit Geschäftslogik
├── screens/                      # Screen-Komponenten (Page-Level)
├── hooks/                        # Custom Hooks
├── types/                        # TypeScript-Typdefinitionen
├── config/                       # Konfigurationsdateien
├── services/                     # Services und API-Zugriffe
├── data/                         # Statische Daten
├── utils/                        # Hilfsfunktionen
└── docs/                         # Dokumentation
```

## Dateibenennungen

### Allgemeine Regeln

- **PascalCase** für Komponenten und Typen
- **camelCase** für Hooks, Konfiguration, Utilities und Instanzen

### Spezifische Konventionen

#### Komponenten

- UI-Komponenten: `[Name].tsx` (z.B. `TileGrid.tsx`)
- Container-Komponenten: `[Name]Container.tsx` (z.B. `TabbarContainer.tsx`)
- Screen-Komponenten: `[Name]Screen.tsx` (z.B. `MySolvboxScreen.tsx`)

#### Hooks

- Immer mit "use"-Präfix: `use[Name].ts` (z.B. `useSaveTab.ts`)

#### Konfiguration

- Beschreibende Namen im camelCase: `tabs.ts`, `tileIds.ts`

#### Typen

- Interface/Types: `[Name].ts` oder in `index.ts` gesammelt

## Präfix-Richtlinien

- **"My"-Präfix für Feature-bezogene Komponenten und Services** (z.B. `MySolvboxScreen`, `MySolvboxService`)
- **Kein "My"-Präfix für generische Komponenten** innerhalb des Features (z.B. `TileGrid` statt `MySolvboxTileGrid`)

## UI vs. Container-Komponenten

### UI-Komponenten

- Befinden sich in `components/ui/`
- Enthalten keine Geschäftslogik oder Hooks
- Nehmen Daten nur über Props entgegen
- Sind für die reine Darstellung zuständig

### Container-Komponenten

- Befinden sich in `components/container/` oder `screens/`
- Verwenden Hooks für Geschäftslogik
- Verarbeiten Daten und leiten sie an UI-Komponenten weiter
- Sind für den Anwendungsfluss zuständig

## Exportrichtlinien

- Named Exports für alle Komponenten außer Screen-Komponenten
- Default Exports nur für Screen-Komponenten (für React Navigation)
