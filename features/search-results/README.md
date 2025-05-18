# Search Results Feature

## Übersicht

Das Search Results Feature zeigt Suchergebnisse an, die über den Home-Screen oder durch Deeplinks initiiert wurden. Es folgt dem Gold Standard und ist als eigenständiges Feature implementiert, während die Routing-Logik in `app/search-results.tsx` verbleibt.

## Struktur

```
search-results/
├── screens/
│   ├── SearchResultsScreen.tsx    # Hauptkomponente für Suchergebnisse
│   └── index.ts                   # Export der Screen-Komponenten
└── README.md                      # Dieses Dokument
```

## Integration mit anderen Features

- **Home-Feature**: Der `useHome`-Hook im Home-Feature navigiert zu diesem Screen.
- **Routing**: Die Routing-Datei `app/search-results.tsx` ist ein einfacher Wrapper.

## Verwendung

Die Navigation zu diesem Screen erfolgt über:

```typescript
navigation.navigate('search-results', {
  query: 'suchbegriff',
  initialFilters: { ... },  // optional
  sortOption: 'relevance',  // optional
  source: 'home'            // optional
});
```

Oder über einen Deeplink:

```
app://search-results?query=suchbegriff
```

## Datenfluss

1. Die Route wird mit Parametern aufgerufen
2. Der Screen extrahiert Parameter mit `useLocalSearchParams`
3. Die Suche wird durchgeführt
4. Ergebnisse werden angezeigt

## Weiterentwicklung

In zukünftigen Versionen könnten folgende Erweiterungen vorgenommen werden:

- Erweiterte Filteroptionen
- Pagination für große Ergebnismengen
- Speichern von Suchergebnissen
- Teilen von Suchergebnissen 