/**
 * AnalyticsService für die Such-Funktionalität
 * 
 * Stellt eine spezialisierte Schnittstelle für das Tracking von Such-Events bereit.
 * Nutzt den zentralen Analytics-Service für die eigentliche Tracking-Implementierung.
 * 
 * Der Service dient als Abstraktionsschicht zwischen der Such-Funktionalität und dem
 * zentralen Analytics-System, wodurch:
 * 1. Such-spezifische Event-Typen korrekt formatiert werden
 * 2. Einheitliche Parameter und Metadaten übergeben werden
 * 3. Eine konsistente Fehlerbehandlung gewährleistet wird
 * 4. Zukünftige Änderungen am zentralen Analytics-System isoliert werden
 * 
 * Alle Methoden sind typsicher implementiert und verwenden die entsprechenden
 * Interfaces aus dem `../types/analytics` Modul.
 */

import { Platform } from 'react-native';
import analyticsService from '@/services/analytics';
import { 
  SearchAnalyticsEventType, 
  SearchAnalyticsEventParams, 
  SearchEventSource, 
  SearchErrorEventParams,
  SearchFilterEventParams,
  SearchResultEventParams
} from '../types/analytics';

/**
 * Verfolgt ein Such-Event
 * 
 * Diese Methode erfasst grundlegende Suchevents, wenn ein Nutzer eine Suche
 * durchführt. Sie protokolliert die Suchanfrage, ob Ergebnisse gefunden wurden,
 * und zusätzliche kontextbezogene Informationen.
 * 
 * @param query Die Suchanfrage
 * @param hasResults Ob die Suche Ergebnisse zurückgegeben hat
 * @param source Die Quelle der Suche (manuell, Vorschlag, Verlauf)
 * @param additionalParams Zusätzliche Parameter für das Event
 * @returns Promise<boolean> True wenn das Event erfolgreich getrackt wurde
 * 
 * @example
 * // Einfaches Tracking einer erfolgreichen Suche
 * await trackSearchPerformed("finanzberatung", true, "manual");
 * 
 * // Tracking mit zusätzlichen Parametern
 * await trackSearchPerformed("steuern", true, "suggestion", {
 *   resultCount: 42,
 *   durationMs: 350,
 *   categories: ["document", "article"]
 * });
 */
export const trackSearchPerformed = async (
  query: string,
  hasResults: boolean,
  source: SearchEventSource = 'manual',
  additionalParams: Partial<SearchAnalyticsEventParams> = {}
): Promise<boolean> => {
  const eventParams: SearchAnalyticsEventParams = {
    query,
    hasResults,
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
    source,
    ...additionalParams
  };
  
  return analyticsService.trackEvent(
    SearchAnalyticsEventType.SEARCH_PERFORMED,
    eventParams
  );
};

/**
 * Verfolgt einen Klick auf einen Suchvorschlag
 * 
 * Diese Methode erfasst Interaktionen mit Suchvorschlägen, wobei sowohl der
 * ausgewählte Vorschlag als auch dessen Position in der Liste protokolliert werden.
 * Diese Daten sind wertvoll, um die Relevanz und Nützlichkeit von Vorschlägen zu bewerten.
 * 
 * @param suggestion Der ausgewählte Vorschlag
 * @param position Die Position des Vorschlags in der Liste (0-basiert)
 * @returns Promise<boolean> True wenn das Event erfolgreich getrackt wurde
 * 
 * @example
 * // Tracking eines Klicks auf den zweiten Vorschlag in der Liste
 * await trackSuggestionClicked("versicherung", 1);
 */
export const trackSuggestionClicked = async (
  suggestion: string,
  position: number
): Promise<boolean> => {
  const eventParams: SearchAnalyticsEventParams = {
    query: suggestion,
    hasResults: true, // Wir nehmen an, dass Vorschläge zu Ergebnissen führen
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
    source: 'suggestion',
    position
  };
  
  return analyticsService.trackEvent(
    SearchAnalyticsEventType.SUGGESTION_CLICKED,
    eventParams
  );
};

/**
 * Verfolgt einen Klick auf ein Suchergebnis
 * 
 * Diese Methode erfasst Interaktionen mit Suchergebnissen und ist besonders wichtig,
 * um die Qualität und Relevanz der Suchergebnisse zu bewerten. Die Position des angeklickten
 * Ergebnisses kann Hinweise auf die Effektivität der Sortieralgorithmen geben.
 * 
 * @param resultId ID des ausgewählten Ergebnisses
 * @param resultType Typ des Ergebnisses (Dokument, Artikel, Benutzer, etc.)
 * @param resultPosition Position in der Ergebnisliste (0-basiert)
 * @param query Die Suchanfrage, die zu diesem Ergebnis geführt hat
 * @param additionalParams Zusätzliche Parameter für das Event
 * @returns Promise<boolean> True wenn das Event erfolgreich getrackt wurde
 * 
 * @example
 * // Tracking eines Klicks auf das erste Suchergebnis
 * await trackResultClicked(
 *   "doc-123",
 *   "document",
 *   0,
 *   "steuerberater frankfurt",
 *   { resultPage: 1 }
 * );
 */
export const trackResultClicked = async (
  resultId: string,
  resultType: string,
  resultPosition: number,
  query: string,
  additionalParams: Partial<SearchResultEventParams> = {}
): Promise<boolean> => {
  const eventParams: SearchResultEventParams = {
    resultId,
    resultType: resultType as any,
    resultPosition,
    resultPage: 1,
    query,
    hasResults: true,
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
    ...additionalParams
  };
  
  return analyticsService.trackEvent(
    SearchAnalyticsEventType.SEARCH_RESULT_CLICKED,
    eventParams
  );
};

/**
 * Verfolgt einen Suchfehler
 * 
 * Diese Methode erfasst Fehler, die während des Suchprozesses auftreten. Diese
 * Daten sind entscheidend, um technische Probleme zu identifizieren und die
 * Zuverlässigkeit der Suchfunktion zu verbessern.
 * 
 * @param query Die Suchanfrage, die zum Fehler geführt hat
 * @param errorType Typ des Fehlers (z.B. 'network', 'timeout', 'server')
 * @param errorMessage Fehlermeldung für detailliertere Diagnose
 * @returns Promise<boolean> True wenn das Event erfolgreich getrackt wurde
 * 
 * @example
 * try {
 *   // Suchlogik
 * } catch (error) {
 *   await trackSearchError(
 *     searchQuery,
 *     "network",
 *     error.message || "Netzwerkfehler bei der Suche"
 *   );
 * }
 */
export const trackSearchError = async (
  query: string,
  errorType: string,
  errorMessage: string
): Promise<boolean> => {
  const eventParams: SearchErrorEventParams = {
    query,
    hasResults: false,
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
    errorType: errorType as any,
    errorMessage
  };
  
  return analyticsService.trackEvent(
    SearchAnalyticsEventType.SEARCH_ERROR,
    eventParams
  );
};

/**
 * Verfolgt das Anwenden eines Filters
 * 
 * Diese Methode erfasst die Anwendung von Filtern auf Suchergebnisse. Diese
 * Daten helfen zu verstehen, wie Benutzer die Suchergebnisse verfeinern, und
 * können zur Verbesserung der Filteroptionen und -platzierung verwendet werden.
 * 
 * @param filterType Typ des Filters (z.B. 'category', 'date', 'tag')
 * @param filterValues Ausgewählte Filterwerte
 * @param query Die aktuelle Suchanfrage
 * @param isInitialFilter Ob es sich um den ersten Filter handelt
 * @returns Promise<boolean> True wenn das Event erfolgreich getrackt wurde
 * 
 * @example
 * // Tracking eines Kategoriefilters
 * await trackFilterApplied(
 *   "category",
 *   ["document", "article"],
 *   "versicherung",
 *   false
 * );
 */
export const trackFilterApplied = async (
  filterType: string,
  filterValues: string[],
  query: string,
  isInitialFilter: boolean = false
): Promise<boolean> => {
  const eventParams: SearchFilterEventParams = {
    filterType,
    filterValues,
    isInitialFilter,
    query,
    hasResults: true, // Wird später aktualisiert, wenn Ergebnisse geladen werden
    platform: Platform.OS,
    timestamp: new Date().toISOString()
  };
  
  return analyticsService.trackEvent(
    SearchAnalyticsEventType.FILTER_APPLIED,
    eventParams
  );
};

/**
 * Verfolgt die Änderung der Sortierung
 * 
 * Diese Methode erfasst Änderungen an der Sortierung von Suchergebnissen.
 * Diese Daten helfen zu verstehen, welche Sortieroptionen für Benutzer am
 * wichtigsten sind und welche Sortierkriterien möglicherweise hinzugefügt
 * oder optimiert werden sollten.
 * 
 * @param sortOption Die gewählte Sortierungsoption
 * @param query Die aktuelle Suchanfrage
 * @returns Promise<boolean> True wenn das Event erfolgreich getrackt wurde
 * 
 * @example
 * // Tracking einer Sortierungsänderung
 * await trackSortChanged("date_desc", "nachrichten");
 */
export const trackSortChanged = async (
  sortOption: string,
  query: string
): Promise<boolean> => {
  const eventParams: SearchAnalyticsEventParams = {
    query,
    hasResults: true, // Wird später aktualisiert, wenn Ergebnisse geladen werden
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
    sortOption
  };
  
  return analyticsService.trackEvent(
    SearchAnalyticsEventType.SORT_CHANGED,
    eventParams
  );
};

/**
 * Exportierter SearchAnalyticsService als Objekt für einfache Verwendung
 * 
 * Diese Sammlung von Tracking-Methoden stellt eine konsistente API für die
 * Erfassung aller such-bezogenen Benutzerinteraktionen bereit und kann
 * im gesamten Feature verwendet werden.
 * 
 * @example
 * import SearchAnalyticsService from '../services/AnalyticsService';
 * 
 * // Verwendung innerhalb eines Hooks oder einer Komponente
 * SearchAnalyticsService.trackSearchPerformed("steuerberater", true, "manual");
 */
const SearchAnalyticsService = {
  trackSearchPerformed,
  trackSuggestionClicked,
  trackResultClicked,
  trackSearchError,
  trackFilterApplied,
  trackSortChanged
};

export default SearchAnalyticsService; 