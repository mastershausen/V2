/**
 * Service-Typen und Interfaces
 * 
 * Enthält grundlegende Typ-Definitionen für das Service-System,
 * separiert von der Implementierungslogik, um zirkuläre Abhängigkeiten zu vermeiden.
 */

/**
 * Basis-Typ für eine Kachel (Tile)
 */
export interface BaseTile {
  id: string | number;
  title: string;
  [key: string]: unknown;
}

/**
 * Tabs-Struktur für die isValidTabId-Methode
 */
export interface TabItem {
  id: string;
  [key: string]: unknown;
}

/**
 * Interface für alle Services
 */
export interface IService {
  /**
   * Optionale Initialisierungsmethode
   */
  init?(): Promise<void>;

  /**
   * Optionale Methode zum Freigeben von Ressourcen
   */
  dispose?(): Promise<void>;

  /**
   * Lädt Daten aus dem Speicher
   */
  loadData?<T>(key: string): Promise<T | null>;

  /**
   * Speichert Daten im Speicher
   * @returns Erfolgsstatus der Operation
   */
  saveData?<T>(key: string, data: T): Promise<boolean | void>;

  /**
   * Bereinigt den Speicher
   * @returns Erfolgsstatus der Operation
   */
  cleanupStorage?(): Promise<boolean | void>;

  /**
   * Entfernt ein Element aus dem Speicher
   * @returns Erfolgsstatus der Operation
   */
  removeItem?(key: string): Promise<boolean | void>;

  /**
   * Prüft, ob eine Tab-ID gültig ist
   */
  isValidTabId?(tabId: string, tabs: TabItem[]): boolean;

  /**
   * Markiert eine Kachel als verwendet
   * @param tileId Die ID der Kachel (kann eine Zeichenkette oder Nummer sein)
   * @returns Erfolgsstatus der Operation
   */
  markTileAsUsed?(tileId: string | number): Promise<boolean | void>;
  
  /**
   * Holt MySolvbox-Kacheln
   */
  getMySolvboxTiles?(forceRefresh?: boolean): Promise<BaseTile[]>;

  /**
   * Holt SolvboxAI-Kacheln
   */
  getSolvboxAITiles?(forceRefresh?: boolean): Promise<BaseTile[]>;
}

/**
 * Enum mit allen verfügbaren Service-Typen
 */
export enum ServiceType {
  // Auth
  AUTH = 'AUTH',
  
  // API
  API = 'API',
  
  // Storage
  STORAGE = 'STORAGE',
  
  // Anwendungsspezifische Services
  MYSOLVBOX = 'MYSOLVBOX',
  NUGGET = 'NUGGET',
  MEDIA = 'MEDIA',
  USER = 'USER',
  SOLVBOX_AI = 'SOLVBOX_AI',
  PERMISSIONS = 'PERMISSIONS',
  TILE = 'TILE',
  
  // Feature-spezifische Services
  BUILD = 'BUILD',
  SEARCH = 'SEARCH',
  FEATURE_SOLVBOX_AI = 'FEATURE_SOLVBOX_AI',
  
  // Zusätzliche Core-Services
  MODE = 'MODE',
}

/**
 * Interface für den ModeService
 * Dieses Interface wird verwendet, um zirkuläre Abhängigkeiten zu vermeiden
 */
export interface IModeService extends IService {
  /**
   * Prüft, ob der Demo-Modus aktiv ist
   */
  isDemoMode(): boolean;
  
  /**
   * Gibt den aktuellen App-Modus zurück
   */
  getCurrentAppMode(): string;
}

/**
 * Interface für den BuildService
 * Mit spezifischen Methoden für Build-bezogene Aufgaben
 */
export interface BuildServiceType extends IService {
  /**
   * Prüft, ob es sich um einen Entwicklungs-Build handelt
   */
  isDevBuild(): boolean;
}

/**
 * Interface für den TileService
 */
export interface ITileService extends IService {
  /**
   * Holt MySolvbox-Kacheln
   */
  getMySolvboxTiles(forceRefresh?: boolean): Promise<BaseTile[]>;

  /**
   * Holt SolvboxAI-Kacheln
   */
  getSolvboxAITiles(forceRefresh?: boolean): Promise<BaseTile[]>;
} 