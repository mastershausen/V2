import { Ionicons } from '@expo/vector-icons';

/**
 * Fehlertypen für die Suche
 * Ermöglicht eine bessere Kategorisierung von Fehlern
 */
export enum SearchErrorType {
  NETWORK = 'network',     // Netzwerkfehler
  TIMEOUT = 'timeout',     // Zeitüberschreitung
  VALIDATION = 'validation', // Validierungsfehler
  ABORTED = 'aborted',     // Abgebrochene Anfrage
  SERVER = 'server',       // Serverfehler
  AUTH = 'auth',           // Authentifizierungsfehler
  UNKNOWN = 'unknown'      // Unbekannter Fehler
}

/**
 * SearchError Interface
 * 
 * Erweitert den standardmäßigen Error-Typ um spezifische Eigenschaften
 * für Suchfehler, einschließlich Fehlertyp und Zeitstempel.
 */
export interface SearchError extends Error {
  /**
   * Der Typ des Suchfehlers
   */
  type: SearchErrorType;
  
  /**
   * Zeitstempel, wann der Fehler aufgetreten ist
   */
  timestamp: Date;
  
  /**
   * Der ursprüngliche Fehler, falls dieser aus einem anderen Fehler abgeleitet wurde
   */
  originalError?: unknown;
}

/**
 * Typ für Suchvorschläge mit Icon und Text
 */
export interface SearchSuggestion {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/**
 * Kategorien für Suchergebnisse
 */
export enum SearchResultCategory {
  ARTICLE = 'article',
  NUGGET = 'nugget',
  EXPERT = 'expert',
  DOCUMENT = 'document',
  TOOL = 'tool',
}

/**
 * Basis-Interface für Suchergebnisse
 */
export interface BaseSearchResult {
  id: string;
  title: string;
  category: SearchResultCategory;
}

/**
 * Artikel-Suchergebnis
 */
export interface ArticleSearchResult extends BaseSearchResult {
  category: SearchResultCategory.ARTICLE;
  summary: string;
  imageUrl?: string;
  publishDate: string;
  readTime: number; // in Minuten
}

/**
 * Nugget-Suchergebnis
 */
export interface NuggetSearchResult extends BaseSearchResult {
  category: SearchResultCategory.NUGGET;
  content: string;
  author: string;
  likes: number;
  tags: string[];
}

/**
 * Experten-Suchergebnis
 */
export interface ExpertSearchResult extends BaseSearchResult {
  category: SearchResultCategory.EXPERT;
  name: string;
  specialty: string;
  avatarUrl?: string;
  rating: number;
  available: boolean;
}

/**
 * Dokument-Suchergebnis
 */
export interface DocumentSearchResult extends BaseSearchResult {
  category: SearchResultCategory.DOCUMENT;
  fileType: string;
  size: number; // in Bytes
  lastModified: string;
  downloadUrl: string;
}

/**
 * Tool-Suchergebnis
 */
export interface ToolSearchResult extends BaseSearchResult {
  category: SearchResultCategory.TOOL;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  useCount: number;
}

/**
 * Union-Typ für alle möglichen Suchergebnisse
 */
export type SearchResult =
  | ArticleSearchResult
  | NuggetSearchResult
  | ExpertSearchResult
  | DocumentSearchResult
  | ToolSearchResult;

/**
 * Sortieroptionen für Suchergebnisse
 */
export enum SearchSortOption {
  RELEVANCE = 'relevance',
  DATE_NEWEST = 'date_newest',
  DATE_OLDEST = 'date_oldest',
  POPULARITY = 'popularity',
  ALPHABETICAL = 'alphabetical',
}

/**
 * Filterkriterien für benutzerdefinierte Filter
 * Umfasst alle möglichen Filtertypen mit ihrer jeweiligen Werteart
 */
export type FilterCriteriaValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | string[] 
  | number[] 
  | null;

/**
 * Filteroption-Typ für benutzerdefinierte Filter
 * Definiert die Struktur eines einzelnen benutzerdefinierten Filters
 */
export interface FilterOption {
  value: FilterCriteriaValue;
  label?: string;
  isActive?: boolean;
}

/**
 * SearchFilterOptions Interface
 * 
 * Definiert die verschiedenen Filteroptionen, die auf eine Suche
 * angewendet werden können. Diese Struktur ist erweiterbar, um
 * weitere Filtertypen hinzufügen zu können.
 */
export interface SearchFilterOptions {
  /**
   * Filter nach Kategorien (z.B. "document", "article", "user")
   */
  categories?: SearchResultCategory[];
  
  /**
   * Filter nach Startdatum (Ergebnisse nach diesem Datum)
   */
  dateFrom?: Date;
  
  /**
   * Filter nach Enddatum (Ergebnisse vor diesem Datum)
   */
  dateTo?: Date;
  
  /**
   * Filter nach Tags oder Schlagwörtern
   */
  tags?: string[];
  
  /**
   * Benutzerdefinierte Filter für domänenspezifische Filterungen
   */
  custom?: {
    [key: string]: string | number | boolean | string[] | number[];
  };
}

/**
 * SearchOptions Interface
 * 
 * Definiert die Optionen für eine Suchanfrage, die an die Suchfunktion übergeben wird.
 * Enthält die Suchquery, Paginierungsoptionen, Sortierung und Filteroptionen.
 */
export interface SearchOptions {
  /**
   * Die Suchquery, nach der gesucht werden soll
   */
  query: string;
  
  /**
   * Die Seitennummer für die Paginierung, beginnend bei 1
   * @default 1
   */
  page?: number;
  
  /**
   * Die maximale Anzahl von Ergebnissen pro Seite
   * @default 20
   */
  limit?: number;
  
  /**
   * Die Sortierung der Ergebnisse
   * @default SearchSortOption.RELEVANCE
   */
  sort?: SearchSortOption;
  
  /**
   * Filteroptionen für die Suche (Kategorien, Datumsbereich, Tags, etc.)
   */
  filters?: SearchFilterOptions;
  
  /**
   * Verzögerungszeit in Millisekunden für das Debouncing von Suchanfragen
   * Wird verwendet, um die Anzahl der Anfragen bei der Eingabe zu reduzieren
   * @default 300
   */
  debounceMs?: number;
}

/**
 * SearchResponse Interface
 * 
 * Repräsentiert die Antwort einer Suchanfrage mit Ergebnissen, Metadaten
 * und Paginierungsinformationen. Diese Struktur wird sowohl vom Server zurückgegeben
 * als auch von Mock-Implementierungen verwendet.
 */
export interface SearchResponse {
  /**
   * Die ursprüngliche Suchquery
   */
  query: string;
  
  /**
   * Die Liste der gefundenen Suchergebnisse
   */
  results: SearchResult[];
  
  /**
   * Die aktuelle Seitennummer
   */
  page: number;
  
  /**
   * Die Gesamtanzahl der Ergebnisse über alle Seiten hinweg
   */
  totalResults: number;
  
  /**
   * Die Anzahl der Seiten für diese Suche
   */
  totalPages: number;
  
  /**
   * Gibt an, ob es weitere Ergebnisse gibt (weitere Seiten verfügbar sind)
   */
  hasMore: boolean;
  
  /**
   * Der verwendete Sortieroptionstyp für diese Suchergebnisse
   */
  sortBy: SearchSortOption;
  
  /**
   * Die Dauer der Suchanfrage in Millisekunden
   */
  durationMs?: number;
  
  /**
   * Vorgeschlagene Korrekturen oder alternative Suchvorschläge
   * für ungenaue oder falsch geschriebene Suchanfragen
   */
  corrections?: {
    /**
     * Die vorgeschlagene Korrektur zur ursprünglichen Abfrage
     */
    suggestion: string;
    
    /**
     * Die Konfidenz der Korrektur (0-1)
     */
    confidence: number;
  }[];
  
  /**
   * Facetten oder Aggregationen für die Filterung
   * (z.B. Anzahl der Ergebnisse pro Kategorie)
   */
  facets?: {
    [key: string]: {
      [value: string]: number;
    };
  };
}

/**
 * SearchResultsParams Interface
 * 
 * Definiert die Parameter, die an die Suchergebnisseite übergeben werden,
 * wenn von der Startseite oder anderen Bereichen zu den Suchergebnissen
 * navigiert wird.
 */
export interface SearchResultsParams {
  /**
   * Die Suchquery für die Ergebnisseite
   */
  query: string;
  
  /**
   * Initiale Filter, die auf die Ergebnisse angewendet werden sollen
   */
  initialFilters?: SearchFilterOptions;
  
  /**
   * Initiale Sortierungsoption für die Ergebnisse
   */
  sortOption?: SearchSortOption;
  
  /**
   * Die Quelle, von der aus zur Suchergebnisseite navigiert wurde
   */
  source?: string;
  
  /**
   * Optionale Tracking-ID für Analytics-Zwecke
   */
  trackingId?: string;
}

/**
 * Typisierte Routing-Parameter für den SearchResults-Screen
 * Diese werden in der URL verwendet und sind daher alle Strings
 */
export interface SearchResultsUrlParams {
  query: string;                // Suchanfrage
  initialFilters?: string;      // JSON-Stringified Filter
  sortOption?: string;          // Sortierungs-Option als String
  source?: string;              // Quelle der Navigation
}

/**
 * Konvertiert SearchResultsParams in URL-Parameter für die Navigation
 * 
 * @param params - Die typisierten SearchResultsParams
 * @returns Objekt mit String-Werten für URL-Parameter
 */
export function createSearchUrlParams(params: SearchResultsParams): SearchResultsUrlParams {
  return {
    query: params.query,
    initialFilters: params.initialFilters ? JSON.stringify(params.initialFilters) : undefined,
    sortOption: params.sortOption,
    source: params.source
  };
}

/**
 * Erstellt eine Deep-Link-URL für Suchergebnisse
 * 
 * @param params - Die SearchResultsParams
 * @returns URL-String für Deep-Linking
 */
export function createSearchDeepLink(params: SearchResultsParams): string {
  const urlParams = createSearchUrlParams(params);
  const searchParams = new URLSearchParams();
  
  // Füge nur definierte Parameter hinzu
  Object.entries(urlParams).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value);
    }
  });
  
  return `/search-results?${searchParams.toString()}`;
}

/**
 * Interface für die Rückgabe des useHome-Hooks
 * Vereinigt Suchstatus, Suchergebnisse und Benutzeraktionen
 */
export interface UseHomeResult {
  // Zustandsdaten
  searchQuery: string;                         // Aktuelle Suchanfrage
  isSearching: boolean;                        // Aktueller Ladezustand
  suggestions: SearchSuggestion[];             // Angezeigte Suchvorschläge
  searchHistory: string[];                     // Suchverlauf des Benutzers
  error: Error | null;                         // Fehler bei der Suche (falls vorhanden)
  
  // Abgeleitete Daten
  showHistory: boolean;                        // Anzeigen des Suchverlaufs
  showSuggestions: boolean;                    // Anzeigen der Vorschläge
  
  // Aktionen
  setSearchQuery: (query: string) => void;     // Suchanfrage aktualisieren
  handleSearch: () => void;                    // Suche durchführen
  handleSuggestionPress: (suggestion: SearchSuggestion) => void;  // Vorschlag auswählen
  clearSearch: () => void;                     // Suche zurücksetzen
  clearHistory: () => void;                    // Suchverlauf löschen
  
  // Filter- und Sortierfunktionen (für spätere Erweiterungen)
  setSearchFilters: (filters: SearchFilterOptions) => void;  // Filter setzen
  setSortOption: (option: SearchSortOption) => void;         // Sortierung ändern
  
  // Paginierung
  loadMoreResults: () => void;                 // Weitere Ergebnisse laden
  searchResults: SearchResponse | null;        // Aktuelle Suchergebnisse
  
  // Metadaten
  lastSearched: Date | null;                   // Zeitpunkt der letzten Suche
}

/**
 * Options-Interface für den useHome-Hook
 * Ermöglicht Konfiguration bei der Initialisierung
 */
export interface UseHomeOptions {
  // Callback für Suchergebnisse (optional)
  onSearchResults?: (results: SearchResponse) => void;
  
  // Flag für automatische Navigation zu Suchergebnissen
  autoNavigateToResults?: boolean;
  
  // Standardfilter für die Suche
  defaultFilters?: SearchFilterOptions;
  
  // Speicherkey für den Suchverlauf
  historyStorageKey?: string;
  
  // Verzögerung für Sucheingaben in ms
  searchDebounceMs?: number;
  
  // Maximale Anzahl an Elementen im Suchverlauf
  maxHistoryItems?: number;
}

/**
 * Typendefinition für den useHome-Hook
 */
export type UseHomeHook = (options?: UseHomeOptions) => UseHomeResult; 