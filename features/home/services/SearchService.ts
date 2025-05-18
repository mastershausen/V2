import { Platform } from 'react-native';

import {createLogger} from '@/utils/logger';
import {IService} from '@/utils/service/serviceRegistry';

import {
  SearchError,
  SearchErrorType,
  SearchFilterOptions,
  SearchOptions,
  SearchResponse,
  SearchResult,
  SearchResultCategory,
  SearchSortOption,
} from '../types/search';

// Konstanten für die Suche
const API_ENDPOINT = '/api/search';
const DEFAULT_SEARCH_LIMIT = 20;
const DEFAULT_SEARCH_TIMEOUT = 10000; // 10 Sekunden
const SEARCH_DELAY = 300; // 300ms Verzögerung für die Suche während der Eingabe

// Logger speziell für den SearchService
const searchLogger = createLogger({
  prefix: '🔍 SearchService',
  showInProduction: false, // Im Produktivmodus keine Logs
});

/**
 * Such-Service für die Anwendung
 *
 * Diese Klasse stellt eine umfassende Schnittstelle für die Suchfunktionalität bereit.
 * Sie ist verantwortlich für:
 * - Kommunikation mit der Such-API (oder Bereitstellung von Mock-Daten während der Entwicklung)
 * - Verzögerung/Debouncing von Suchanfragen während der Nutzereingabe
 * - Abbruch von laufenden Suchanfragen
 * - Fehlerbehandlung und Fehlernormalisierung
 * - Performance-Tracking und Logging
 *
 * Der Service implementiert das IService-Interface für die ServiceRegistry.
 * @example
 * // Service-Instanz abrufen
 * const searchService = ServiceRegistry.getInstance().getService<SearchService>(ServiceType.SEARCH);
 * 
 * // Suche mit Callbacks durchführen
 * searchService.searchWithDelay(
 *   { query: "Beispiel", page: 1 },
 *   (results) => console.log("Suchergebnisse:", results),
 *   (error) => console.error("Suchfehler:", error)
 * );
 */
export class SearchService implements IService {
  // Private Member-Variablen
  private searchTimeout: NodeJS.Timeout | null = null;
  private abortController: AbortController | null = null;
  private lastQuery: string = '';
  private isDebugMode: boolean = __DEV__;

  /**
   * Initialisiert den Service
   */
  async init(): Promise<void> {
    searchLogger.info('SearchService initialisiert');
  }

  /**
   * Gibt Ressourcen frei
   */
  async dispose(): Promise<void> {
    this.cancelSearch();
    searchLogger.info('SearchService Ressourcen freigegeben');
  }

  /**
   * Aktiviert oder deaktiviert den Debug-Modus
   *
   * Im Debug-Modus werden erweiterte Logs ausgegeben und unabhängig von der
   * Umgebung (Entwicklung oder Produktion) werden Mock-Daten verwendet.
   * @param {boolean} enabled Ob der Debug-Modus aktiviert sein soll
   */
  public setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled;
    searchLogger.info(`Debug-Modus ${enabled ? 'aktiviert' : 'deaktiviert'}`);
  }

  /**
   * Gibt zurück, ob der Debug-Modus aktiviert ist
   * @returns {boolean} Ob der Debug-Modus aktiviert ist
   */
  public isDebugging(): boolean {
    return this.isDebugMode;
  }

  /**
   * Führt eine verzögerte Suche durch, wenn der Benutzer tippt
   * Bricht vorherige Suchen ab
   *
   * Diese Methode implementiert ein Debouncing-Muster, um zu verhindern, dass
   * bei jeder Tastatureingabe eine neue Suchanfrage gesendet wird. Stattdessen
   * wird eine Verzögerung eingebaut und frühere Anfragen werden abgebrochen.
   * @param {SearchOptions} options - Suchoptionen mit Query, Filtern, Sortierung etc.
   * @param {(response: SearchResponse) => void} onResult - Callback für Suchergebnisse
   * @param {(error: SearchError) => void} onError - Callback für Fehler
   * @returns {() => void} Funktion zum manuellen Abbrechen der Suche
   * @example
   * const cancelSearch = searchService.searchWithDelay(
   *   { query: "test", page: 1, sort: SearchSortOption.RELEVANCE },
   *   (results) => setSearchResults(results),
   *   (error) => setError(error)
   * );
   * 
   * // Später die Suche abbrechen
   * cancelSearch();
   */
  public searchWithDelay(
    options: SearchOptions,
    onResult: (response: SearchResponse) => void,
    onError: (error: SearchError) => void
  ): () => void {
    const { query } = options;
    
    // Log bei neuer Suche
    if (query !== this.lastQuery) {
      searchLogger.debug(`Neue Suchanfrage: "${query}"`);
      this.lastQuery = query;
    }
    
    // Vorherige Suche abbrechen
    this.cancelSearch();

    // Verzögerungszeit festlegen (nutze übergebenen Wert oder Standard)
    const delay = options.debounceMs || SEARCH_DELAY;

    // Neue Suche starten
    this.searchTimeout = setTimeout(() => {
      searchLogger.debug(`Führe Suche aus für: "${query}" mit Verzögerung ${delay}ms`);
      
      this.search(options)
        .then(response => {
          searchLogger.debug(`Suchergebnisse erhalten: ${response.results.length} von ${response.totalResults} Treffern`);
          onResult(response);
        })
        .catch(error => {
          const searchError = this.normalizeError(error);
          searchLogger.error(`Suchfehler: ${searchError.message}`, searchError);
          onError(searchError);
        });
    }, delay);

    // Abbruch-Funktion zurückgeben
    return () => {
      searchLogger.debug('Suche abgebrochen durch Callback');
      this.cancelSearch();
    };
  }

  /**
   * Normalisiert verschiedene Fehlertypen zu einem einheitlichen SearchError
   *
   * Diese Methode sorgt dafür, dass unabhängig von der Art des aufgetretenen Fehlers
   * (HTTP-Fehler, Netzwerkfehler, Timeout etc.) immer ein standardisierter SearchError
   * zurückgegeben wird, um einheitliche Fehlerbehandlung zu ermöglichen.
   * @param {unknown} error Der ursprüngliche Fehler (kann jeden Typ haben)
   * @returns {SearchError} Der normalisierte Fehler mit Typ, Zeitstempel und Originaldaten
   * @private
   */
  private normalizeError(error: unknown): SearchError {
    // Wenn es bereits ein SearchError ist, zurückgeben
    if (
      error instanceof Error && 
      'type' in error && 
      'timestamp' in error
    ) {
      return error as SearchError;
    }

    // Standard Error in SearchError umwandeln
    if (error instanceof Error) {
      // Fehlertyp bestimmen
      let type = SearchErrorType.UNKNOWN;
      
      if (error.name === 'AbortError') {
        type = SearchErrorType.ABORTED;
      } else if (error.message.includes('Timeout')) {
        type = SearchErrorType.TIMEOUT;
      } else if (error.message.includes('Network') || error.message.includes('ECONNABORTED')) {
        type = SearchErrorType.NETWORK;
      }

      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type,
        timestamp: new Date(),
        originalError: error
      };
    }

    // Unbekannter Fehler
    return {
      name: 'SearchError',
      message: typeof error === 'string' ? error : 'Unbekannter Suchfehler',
      type: SearchErrorType.UNKNOWN,
      timestamp: new Date(),
      originalError: error
    };
  }

  /**
   * Bricht die aktuelle Suche ab
   * 
   * Diese Methode bricht sowohl ausstehende Timeouts (während des Debouncing)
   * als auch bereits laufende API-Anfragen ab.
   */
  public cancelSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
      searchLogger.debug('Ausstehende Suche abgebrochen (Timeout gelöscht)');
    }

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      searchLogger.debug('Laufende Netzwerkanfrage abgebrochen');
    }
  }

  /**
   * Führt eine Suche durch
   *
   * Diese Methode führt die eigentliche Suchanfrage aus, indem sie entweder
   * die API kontaktiert oder im Entwicklungsmodus Mock-Daten zurückgibt.
   * Sie implementiert alle erforderlichen Parameter wie Paginierung,
   * Sortierung und Filterung.
   * @param {SearchOptions} options - Suchoptionen mit Query, Filtern, Sortierung etc.
   * @returns {Promise<SearchResponse>} Promise mit den Suchergebnissen
   * @throws {SearchError} Bei Fehlern während der Suche
   * @example
   * try {
   *   const results = await searchService.search({
   *     query: "beispiel",
   *     page: 1,
   *     limit: 20,
   *     sort: SearchSortOption.NEWEST,
   *     filters: { categories: ["document", "article"] }
   *   });
   *   console.log("Anzahl Ergebnisse:", results.totalResults);
   * } catch (error) {
   *   console.error("Fehler bei der Suche:", error);
   * }
   */
  public async search(options: SearchOptions): Promise<SearchResponse> {
    const { query, page = 1, limit = DEFAULT_SEARCH_LIMIT, sort = SearchSortOption.RELEVANCE, filters } = options;

    try {
      // Zeitmessung für Performance-Tracking starten
      const startTime = Date.now();
      
      // In der Entwicklungsumgebung oder im Debug-Modus: Simuliere API-Antwort
      if (__DEV__ || this.isDebugMode) {
        searchLogger.debug(`Verwende Mock-Daten für Suchanfrage: "${query}"`);
        const results = await this.getMockSearchResults(query, page, limit, sort, filters);
        
        // Performance-Logging
        const duration = Date.now() - startTime;
        searchLogger.debug(`Mock-Suche abgeschlossen in ${duration}ms`);
        
        return results;
      }

      // Prepare abort controller for request cancellation
      this.abortController = new AbortController();
      const signal = this.abortController.signal;

      // Build request URL and parameters
      const url = new URL(API_ENDPOINT, 'https://api.solvbox.com');
      url.searchParams.append('q', query);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('sort', sort);

      // Add category filters if present
      if (filters?.categories?.length) {
        url.searchParams.append('categories', filters.categories.join(','));
      }

      // Add date range filters if present
      if (filters?.dateFrom) {
        url.searchParams.append('dateFrom', filters.dateFrom.toISOString());
      }

      if (filters?.dateTo) {
        url.searchParams.append('dateTo', filters.dateTo.toISOString());
      }

      // Add tag filters if present
      if (filters?.tags?.length) {
        url.searchParams.append('tags', filters.tags.join(','));
      }

      // Custom headers for the platform
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': Platform.OS,
        'X-App-Version': '1.0.0' // TODO: Get from app config
      };

      // Set timeout for fetch request
      const timeoutId = setTimeout(() => {
        if (this.abortController) {
          this.abortController.abort();
          searchLogger.warn(`Suchzeitüberschreitung für Query: "${query}"`);
        }
      }, DEFAULT_SEARCH_TIMEOUT);

      try {
        // Perform the actual fetch request
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers,
          signal
        });

        // Clear timeout since request completed
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Search API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        // Performance-Logging
        const duration = Date.now() - startTime;
        searchLogger.debug(`Suche abgeschlossen in ${duration}ms mit ${data.results.length} Ergebnissen`);
        
        return data as SearchResponse;
      } catch (fetchError) {
        // Clear timeout in case of error
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      // Standardize errors
      throw this.normalizeError(error);
    }
  }

  /**
   * Mock-Funktion für Suchergebnisse während der Entwicklung
   * @param {string} query - Suchanfrage
   * @param {number} page - Seitennummer
   * @param {number} limit - Anzahl der Ergebnisse pro Seite
   * @param {SearchSortOption} sort - Sortierungsoption
   * @param {SearchFilterOptions} [filters] - Filteroptionen
   * @returns {Promise<SearchResponse>} Simulierte Suchergebnisse
   */
  private async getMockSearchResults(
    query: string,
    page: number,
    limit: number,
    sort: SearchSortOption,
    filters?: SearchFilterOptions
  ): Promise<SearchResponse> {
    // Simuliere Netzwerklatenz
    await new Promise(resolve => setTimeout(resolve, 800));

    const results: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();

    // Simuliere Kategorienfilterung
    const categoryFilter = filters?.categories || Object.values(SearchResultCategory);

    searchLogger.debug(`Generiere Mock-Daten für Kategorien: ${categoryFilter.join(', ')}`);

    // Generiere ein paar gefilterte Beispieldaten
    if (categoryFilter.includes(SearchResultCategory.ARTICLE)) {
      results.push({
        id: '1',
        title: `Artikel über ${query}`,
        category: SearchResultCategory.ARTICLE,
        summary: `Ein umfassender Artikel zum Thema ${query}`,
        publishDate: new Date().toISOString(),
        readTime: 5,
      });
    }

    if (categoryFilter.includes(SearchResultCategory.NUGGET)) {
      results.push({
        id: '2',
        title: `${query} in 5 Minuten erklärt`,
        category: SearchResultCategory.NUGGET,
        content: `Hier ist eine kurze Erklärung zu ${query}...`,
        author: 'Max Mustermann',
        likes: 42,
        tags: ['Finanzen', 'Wissen', 'Kurz erklärt'],
      });
    }

    if (categoryFilter.includes(SearchResultCategory.EXPERT)) {
      results.push({
        id: '3',
        title: 'Experte für ' + query,
        category: SearchResultCategory.EXPERT,
        name: 'Dr. Erika Musterfrau',
        specialty: query,
        rating: 4.8,
        available: true,
      });
    }

    // Füge ein weiteres Ergebnis hinzu, um Paginierung zu simulieren
    if (categoryFilter.includes(SearchResultCategory.DOCUMENT)) {
      results.push({
        id: '4',
        title: `Dokument zu ${query}`,
        category: SearchResultCategory.DOCUMENT,
        fileType: 'PDF',
        size: 1024 * 1024 * 2, // 2MB
        lastModified: new Date().toISOString(),
        downloadUrl: `https://api.solvbox.com/documents/${encodeURIComponent(query)}.pdf`,
      });
    }

    // Sortierung anwenden
    if (sort === SearchSortOption.ALPHABETICAL) {
      searchLogger.debug('Sortiere Ergebnisse alphabetisch');
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === SearchSortOption.DATE_NEWEST) {
      searchLogger.debug('Sortiere Ergebnisse nach neuesten zuerst');
      // Bei echten Daten würde hier nach Datum sortiert werden
      results.reverse();
    }

    // Paginierung simulieren
    const totalResults = 23; // Angenommen, es gibt insgesamt 23 Ergebnisse
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    searchLogger.debug(`Paginierte Ergebnisse: ${paginatedResults.length} von ${totalResults} (Seite ${page}, Limit ${limit})`);

    return {
      results: paginatedResults,
      totalResults,
      page,
      limit,
      hasMore: startIndex + limit < totalResults,
      queryTime: 123, // Simulierte Abfragezeit in ms
    };
  }
} 