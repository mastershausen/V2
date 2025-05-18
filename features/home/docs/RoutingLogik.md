# Routing-Logik für Search-Results-Screen

## Übersicht

Dieses Dokument beschreibt die Routing-Logik zwischen dem HomeScreen und dem SearchResults-Screen in der Solvbox-App. Die Implementierung folgt dem Gold Standard für Hooks und verwendet expo-router für die Navigation.

## Datenfluss

```
 HomeScreen                              SearchResultsScreen
 +-----------------+                      +-------------------+
 |                 |   navigateToResults  |                   |
 | Suchfeld        +--------------------->+ Ergebnisliste     |
 | Vorschläge      |    (mit Params)      | Filter            |
 |                 |                      | Sortierung        |
 +-----------------+                      +-------------------+
         ^                                        |
         |              navigateBack              |
         +----------------------------------------+
```

## Parameter-Übergabe

Die Navigation zum SearchResults-Screen erfolgt mit folgenden Parametern:

```typescript
export interface SearchResultsParams {
  query: string;                      // Suchanfrage
  initialFilters?: SearchFilterOptions; // Initial angewendete Filter
  sortOption?: SearchSortOption;      // Initiale Sortierung
  source?: 'home' | 'deeplink' | 'suggestion'; // Quelle der Navigation
}
```

## Implementierung im useHome-Hook

Die Navigation wird im `useHome`-Hook wie folgt implementiert:

```typescript
const navigateToResults = useCallback((query: string, response?: SearchResponse) => {
  const params: SearchResultsParams = {
    query,
    initialFilters: activeFilters,
    sortOption: sortOptionState,
    source: 'home'
  };
  
  // Navigiere zur Ergebnisseite mit expo-router
  navigation.navigate('search-results', params);
}, [navigation, activeFilters, sortOptionState]);
```

Der Hook ruft diese Funktion bei einer erfolgreichen Suche auf, wenn `autoNavigateToResults` auf `true` gesetzt ist:

```typescript
cancelSearchRef.current = SearchService.searchWithDelay(
  options,
  (response) => {
    setIsSearching(false);
    setLastSearched(new Date());
    
    // Callback für Suchergebnisse
    if (onSearchResults) {
      onSearchResults(response);
    }
    
    // Automatisch zur Ergebnisseite navigieren
    if (autoNavigateToResults && response.results.length > 0) {
      navigateToResults(options.query, response);
    }
  },
  // ...
);
```

## Implementierung des SearchResults-Screen

Der SearchResults-Screen extrahiert die Suchparameter mit dem `useLocalSearchParams`-Hook von expo-router:

```typescript
const params = useLocalSearchParams<{
  query: string;
  initialFilters?: string; // JSON-String
  sortOption?: SearchSortOption;
  source?: string;
}>();
```

Anschließend führt er eine Suche mit den extrahierten Parametern durch:

```typescript
useEffect(() => {
  const performSearch = async () => {
    if (!params.query) {
      setError(new Error('Keine Suchanfrage angegeben'));
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Optionale Filter parsen (falls vorhanden)
      let filters: SearchFilterOptions | undefined;
      try {
        filters = params.initialFilters ? JSON.parse(params.initialFilters) : undefined;
      } catch (e) {
        console.error('Fehler beim Parsen der Filter-Parameter', e);
      }
      
      // Sortierung extrahieren
      const sortOption = params.sortOption || SearchSortOption.RELEVANCE;
      
      // Suche durchführen
      const searchResponse = await SearchService.search({
        query: params.query,
        sort: sortOption,
        filters,
      });
      
      setResults(searchResponse.results);
      setResponse(searchResponse);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  performSearch();
}, [params.query, params.initialFilters, params.sortOption]);
```

## URL-Schema

Das URL-Schema für die SearchResults-Seite ist:

```
/search-results?query=beispielanfrage&initialFilters={"categories":["article"]}&sortOption=relevance&source=home
```

## Deeplink-Integration

Die App unterstützt auch Deeplinks zum SearchResults-Screen, was es ermöglicht, direkt zu Suchergebnissen zu navigieren:

```
app://search-results?query=beispielanfrage
```

## Besondere Merkmale

1. **Automatische Navigation**: Der HomeScreen kann so konfiguriert werden, dass er bei erfolgreicher Suche automatisch zur Ergebnisseite navigiert.

2. **Parameter-Serialisierung**: Filter-Optionen werden als JSON-String übertragen und auf der Empfängerseite deserialisiert.

3. **Fehlerbehandlung**: Der SearchResults-Screen behandelt fehlende Parameter und Parsing-Fehler angemessen.

4. **Performance-Optimierung**: Der SearchResults-Screen verwendet `useEffect` mit Abhängigkeiten, um Suchen nur bei Änderung der Parameter zu wiederholen.

## Vorteile dieses Ansatzes

1. **Trennung von Zuständen**: Der HomeScreen und der SearchResults-Screen verwalten ihre Zustände unabhängig voneinander.

2. **Deklarative Navigation**: Die Navigation erfolgt deklarativ über URL-Parameter.

3. **Flexibilität**: Der SearchResults-Screen kann direkt über Deeplinks aufgerufen werden.

4. **Typsicherheit**: Alle Parameter sind typisiert, was die Codequalität verbessert. 