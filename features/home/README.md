# Home Feature

Dieses Verzeichnis enthält alle Komponenten, Hooks und Services für den Home-Screen der Anwendung, 
mit besonderem Fokus auf die Suchfunktionalität und deren Analytics-Integration.

## Struktur

```
features/home/
  ├── components/            # UI-Komponenten
  │   ├── SearchInput.tsx    # Eingabefeld für die Suche
  │   ├── SuggestionList.tsx # Liste der Suchvorschläge
  │   └── ...                # Weitere Komponenten
  ├── hooks/                 # React Hooks
  │   ├── useHome.ts         # Zentraler Hook für die Home-Funktionalität
  │   └── ...                # Weitere Hooks
  ├── screens/               # Screen-Komponenten
  │   ├── HomeScreen.tsx     # Home-Screen-Komponente
  │   └── ...                # Weitere Screens
  ├── services/              # Services
  │   ├── SearchService.ts   # Service für die Suche
  │   ├── AnalyticsService.ts# Service für Such-Analytics
  │   └── ...                # Weitere Services
  ├── types/                 # TypeScript-Definitionen
  │   ├── analytics.ts       # Typen für Analytics-Events
  │   ├── search.ts          # Typen für die Suche
  │   └── ...                # Weitere Typdefinitionen
  ├── constants/             # Konstanten
  │   ├── suggestions.ts     # Standard-Suchvorschläge
  │   └── ...                # Weitere Konstanten
  └── README.md              # Diese Datei
```

## Hauptfunktionalitäten

### useHome Hook

Der `useHome` Hook ist der zentrale Punkt für alle Home-Screen-Funktionalitäten. Er verwaltet:

- Suchzustand (Abfrage, Ergebnisse, Verlauf)
- Suchverlauf (Speichern und Laden)
- Suchvorschläge
- Filter und Sortierung
- Navigation zu Suchergebnissen
- Analytics-Tracking der Suchinteraktionen

### AnalyticsService

Der `AnalyticsService` bietet eine spezialisierte Schnittstelle für das Tracking von Such-Events:

- `trackSearchPerformed`: Verfolgt Suchanfragen
- `trackSuggestionClicked`: Verfolgt Klicks auf Suchvorschläge
- `trackResultClicked`: Verfolgt Klicks auf Suchergebnisse
- `trackSearchError`: Verfolgt Fehler bei der Suche
- `trackFilterApplied`: Verfolgt das Anwenden von Filtern
- `trackSortChanged`: Verfolgt Änderungen der Sortierung

Diese Events werden für ein späteres Supabase-Backend vorbereitet, um Einblicke in das Nutzerverhalten zu gewinnen.

## Verwendung

```typescript
// In einer Screen-Komponente
function HomeScreen() {
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    performSearch,
    selectSuggestion
  } = useHome();

  // UI-Code
}
```

## Analytics-Integration

Die Such-Analytics sind vollständig in den `useHome`-Hook integriert:

1. Alle Suchaktionen werden automatisch verfolgt
2. Suchzeitpunkt, Dauer und Ergebnisse werden erfasst
3. Interaktionen mit Vorschlägen werden mit Position aufgezeichnet
4. Fehler werden mit Typ und Nachricht dokumentiert

Dies ermöglicht eine detaillierte Analyse des Suchverhaltens, der Sucheffektivität und auftretender Probleme. 