# `useHome`-Hook Dokumentation

## Übersicht

Der `useHome`-Hook ist eine zentrale Komponente für den HomeScreen der Solvbox-App. Er konsolidiert die Suchfunktionalität, den Zustand und die Navigation in einer konsistenten, gut typisierten Schnittstelle gemäß dem Gold Standard.

## Schnittstelle

```typescript
export function useHome(options?: UseHomeOptions): UseHomeResult;
```

### Optionen (UseHomeOptions)

Der Hook akzeptiert folgende Optionen:

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `onSearchResults` | `(results: SearchResponse) => void` | `undefined` | Callback für Suchergebnisse |
| `autoNavigateToResults` | `boolean` | `true` | Flag für automatische Navigation zu Suchergebnissen |
| `defaultFilters` | `SearchFilterOptions` | `{}` | Standardfilter für die Suche |
| `historyStorageKey` | `string` | `'home_search_history'` | Speicherkey für den Suchverlauf |
| `searchDebounceMs` | `number` | `300` | Verzögerung für Sucheingaben in ms |
| `maxHistoryItems` | `number` | `10` | Maximale Anzahl an Elementen im Suchverlauf |

### Rückgabewerte (UseHomeResult)

Der Hook gibt ein Objekt mit folgenden Eigenschaften zurück:

#### Zustandsdaten

| Eigenschaft | Typ | Beschreibung |
|-------------|-----|--------------|
| `searchQuery` | `string` | Aktuelle Suchanfrage |
| `isSearching` | `boolean` | Aktueller Ladezustand |
| `suggestions` | `SearchSuggestion[]` | Angezeigte Suchvorschläge |
| `searchHistory` | `string[]` | Suchverlauf des Benutzers |
| `error` | `Error \| null` | Fehler bei der Suche (falls vorhanden) |

#### Abgeleitete Daten

| Eigenschaft | Typ | Beschreibung |
|-------------|-----|--------------|
| `showHistory` | `boolean` | Anzeigen des Suchverlaufs |
| `showSuggestions` | `boolean` | Anzeigen der Vorschläge |

#### Aktionen

| Methode | Signatur | Beschreibung |
|---------|----------|--------------|
| `setSearchQuery` | `(query: string) => void` | Suchanfrage aktualisieren |
| `handleSearch` | `() => void` | Suche durchführen |
| `handleSuggestionPress` | `(suggestion: SearchSuggestion) => void` | Vorschlag auswählen |
| `clearSearch` | `() => void` | Suche zurücksetzen |
| `clearHistory` | `() => void` | Suchverlauf löschen |

#### Filter- und Sortierfunktionen

| Methode | Signatur | Beschreibung |
|---------|----------|--------------|
| `setSearchFilters` | `(filters: SearchFilterOptions) => void` | Filter setzen |
| `setSortOption` | `(option: SearchSortOption) => void` | Sortierung ändern |

#### Metadaten

| Eigenschaft | Typ | Beschreibung |
|-------------|-----|--------------|
| `lastSearched` | `Date \| null` | Zeitpunkt der letzten Suche |

## Beispielverwendung

```tsx
import { useHome } from '@/features/home/hooks/useHome';

function HomeScreen() {
  const {
    searchQuery,
    isSearching,
    suggestions,
    searchHistory,
    showHistory,
    showSuggestions,
    setSearchQuery,
    handleSearch,
    handleSuggestionPress,
    clearSearch
  } = useHome({
    autoNavigateToResults: true
  });
  
  return (
    <View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        loading={isSearching}
        onClear={clearSearch}
      />
      
      {showSuggestions && (
        <SuggestionList
          suggestions={suggestions}
          onSuggestionPress={handleSuggestionPress}
        />
      )}
      
      {showHistory && (
        <SearchHistory
          items={searchHistory}
          onItemPress={(item) => setSearchQuery(item)}
        />
      )}
    </View>
  );
}
```

## Interaktion mit anderen Hooks und Services

Der `useHome`-Hook interagiert mit folgenden Diensten:

1. **SearchService**: Führt die eigentliche Suche durch und liefert die Ergebnisse
2. **AsyncStorage**: Speichert und lädt den Suchverlauf
3. **Navigation**: Navigiert zur Suchergebnisseite (über expo-router)

## Optimierungen

Der Hook implementiert verschiedene Optimierungen:

1. **Debouncing**: Verzögerte Suche während der Eingabe reduziert API-Anfragen
2. **Memo**: Abgeleitete Werte werden mit `useMemo` optimiert
3. **Referenz-Stabilität**: Callbacks werden mit `useCallback` memoized
4. **Suchverlauf-Management**: Duplikate werden vermieden, neue Einträge erscheinen oben

## Fehlerbehandlung

Der Hook behandelt folgende Fehlerfälle:

1. **API-Fehler**: Werden im `error`-Feld gespeichert und können in der UI angezeigt werden
2. **Abgebrochene Suchen**: Vorherige Suchen werden abgebrochen, wenn neue beginnen
3. **AsyncStorage-Fehler**: Werden protokolliert, stürzen die App aber nicht ab

## Typsicherheit

Der Hook verwendet TypeScript für vollständige Typsicherheit, alle Parameter und Rückgabewerte sind typisiert. 