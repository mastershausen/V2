/**
 * Typdefinitionen für Analytics-Events
 * 
 * Diese Datei stellt typensichere Definitionen für alle Analytics-Events
 * und deren Parameter bereit, um Typsicherheit in der gesamten Anwendung zu gewährleisten.
 */

import { SearchErrorType, SearchResultCategory } from './search';

/**
 * Mögliche Event-Typen für die Such-Analytik
 */
export enum SearchAnalyticsEventType {
  SEARCH_PERFORMED = 'search_performed',
  SUGGESTION_CLICKED = 'suggestion_clicked',
  FILTER_APPLIED = 'filter_applied',
  SORT_CHANGED = 'sort_changed',
  SEARCH_RESULTS_VIEWED = 'search_results_viewed',
  SEARCH_RESULT_CLICKED = 'search_result_clicked',
  NO_RESULTS = 'no_results_found',
  SEARCH_ERROR = 'search_error'
}

/**
 * Source-Typen für Such-Events
 */
export type SearchEventSource = 'manual' | 'suggestion' | 'history' | 'deeplink';

/**
 * Parameter für Such-Analytics-Events
 */
export interface SearchAnalyticsEventParams {
  query: string;                   // Die Suchanfrage
  hasResults: boolean;             // Ob die Suche Ergebnisse zurückgegeben hat
  resultCount?: number;            // Anzahl der Ergebnisse (optional)
  platform: string;                // Die Plattform (z.B. 'ios', 'android', 'web')
  timestamp: string;               // Zeitstempel im ISO-Format
  durationMs?: number;             // Dauer der Suche in Millisekunden (optional)
  source?: SearchEventSource;      // Quelle der Suche
  filterCount?: number;            // Anzahl der angewendeten Filter (optional)
  categories?: string[];           // Ausgewählte Kategorien (optional)
  sortOption?: string;             // Gewählte Sortierungsoption (optional)
  page?: number;                   // Aktuelle Seitennummer (optional)
  position?: number;               // Position in einer Liste (z.B. für Vorschläge)
}

/**
 * Error-Event-Parameter
 */
export interface SearchErrorEventParams extends SearchAnalyticsEventParams {
  errorType: SearchErrorType;
  errorMessage: string;
  errorCode?: string;
  searchContext?: string;
}

/**
 * Filter-Event-Parameter
 */
export interface SearchFilterEventParams extends SearchAnalyticsEventParams {
  filterType: string;
  filterValues: string[];
  isInitialFilter: boolean;
}

/**
 * Result-Event-Parameter
 */
export interface SearchResultEventParams extends SearchAnalyticsEventParams {
  resultId: string;
  resultType: SearchResultCategory;
  resultPosition: number;
  resultPage: number;
}

/**
 * Vereinigter Event-Parametertyp für flexiblere Handhabung
 */
export type SearchEventParams = 
  | SearchAnalyticsEventParams 
  | SearchErrorEventParams 
  | SearchFilterEventParams 
  | SearchResultEventParams;

/**
 * Die AnalyticsManager-Schnittstelle definiert die Methoden,
 * die ein Analytics-Implementierung bereitstellen muss
 */
export interface AnalyticsManager {
  /**
   * Verfolgt ein Such-Event mit den angegebenen Parametern
   * @param eventName Der Name des Events
   * @param params Die Event-Parameter
   * @returns true wenn das Tracking erfolgreich war, false sonst
   */
  trackEvent(
    eventName: string | SearchAnalyticsEventType,
    params: SearchEventParams
  ): boolean;
}

/**
 * Gibt einen einfachen Analytics-Manager zurück, der für die Entwicklung geeignet ist
 * @returns Eine Instanz von AnalyticsManager
 */
export const getAnalyticsManager = (): AnalyticsManager => {
  return {
    trackEvent: (
      eventName: string | SearchAnalyticsEventType, 
      params: SearchEventParams
    ): boolean => {
      if (__DEV__) {
        console.log(`[Analytics] ${eventName}:`, params);
      }
      // Hier würde die eigentliche Analytics-Implementierung erfolgen
      return true;
    }
  };
}; 