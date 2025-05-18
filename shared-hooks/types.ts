/**
 * types.ts - Typdefinitionen für gemeinsame Hook-Typen
 * 
 * Diese Datei enthält zentrale Typdefinitionen für die gemeinsam genutzten Hooks.
 * Dadurch wird die Konsistenz zwischen verschiedenen Implementierungen sichergestellt.
 */

// Imports
import { TabId, TabConfigBase } from './useTabs';

/**
 * Interface für das Ergebnis eines Such-Hooks im Tab-Kontext
 */
export interface UseTabSearchResult {
  /** Aktueller Suchbegriff */
  searchQuery: string;
  /** Funktion zum Setzen des Suchbegriffs */
  setSearchQuery: (query: string) => void;
  /** Handler für Suchänderungen, der interne Zustandsänderungen durchführt */
  handleSearchChange: (query: string) => void;
}

/**
 * Interface für das Ergebnis aller TabScreen-Hooks
 * Kombiniert Tab-Management und Suchfunktionalität
 */
export interface UseTabScreenResult<T extends TabId> {
  /** Liste der verfügbaren Tabs */
  tabs: TabConfigBase[];
  /** Aktuell ausgewählte Tab-ID */
  activeTabId: T;
  /** Handler für Tab-Wechsel */
  handleTabChange: (tabId: string) => void;
  /** Funktion zur Validierung von Tab-IDs */
  isValidTabId: (tabId: string) => tabId is T;
  /** Aktueller Suchbegriff */
  searchQuery: string;
  /** Funktion zum Setzen des Suchbegriffs */
  setSearchQuery: (query: string) => void;
  /** Handler für Suchänderungen */
  handleSearchChange: (query: string) => void;
  /** Gibt an, ob die Daten geladen werden */
  isLoading?: boolean;
  /** Gibt an, ob ein Fehler aufgetreten ist */
  isError?: boolean;
  /** Fehlermeldung, falls ein Fehler aufgetreten ist */
  error?: Error | null;
  /** Zusätzliche Daten, die spezifisch für den Feature-Bereich sind */
  data?: Record<string, unknown>;
}

/**
 * Interface für Optionen des useSearch-Hooks
 */
export interface UseSearchOptions {
  /** Initialer Suchbegriff, standardmäßig leer */
  initialQuery?: string;
  /** Callback-Funktion, die bei Änderungen des Suchbegriffs aufgerufen wird */
  onQueryChange?: (query: string) => void;
}

/**
 * Interface für Eigenschaften einer Tab-Screen-Komponente
 */
export interface TabScreenProps {
  /** Suchbegriff (optional) */
  searchQuery?: string;
} 