/**
 * Zentrale Typdefinitionen für die Nugget-Funktionalität
 * 
 * Basierend auf dem GOLDSTANDARD.md enthält diese Datei alle
 * Typen für den CreateNuggetScreen und zugehörige Komponenten.
 */

import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { NuggetData, NuggetMedia } from '../../../shared-components/cards/nugget-card/types';
import { ProfileImageData } from '../../../utils/profileImageUtils';

// ==================== ALLGEMEINE ENUMS UND BASIS-TYPEN ====================

/**
 * Status der Nugget-Erstellung
 */
export enum NuggetCreationStatus {
  IDLE = 'idle',
  VALIDATING = 'validating',
  SAVING = 'saving',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Validierungsfehler für die Nugget-Erstellung
 */
export interface NuggetValidationError {
  content?: string;
  media?: string;
  link?: string;
}

/**
 * Erlaubte Medientypen für Nuggets
 */
export type NuggetMediaType = 'image' | 'video' | 'link';

/**
 * Medien-Item für die Nugget-Erstellung
 * Erweitert NuggetMedia mit zusätzlichen Metadaten für die UI
 */
export interface NuggetMediaItem extends NuggetMedia {
  /**
   * Lokaler URI für die Vorschau (für noch nicht hochgeladene Medien)
   */
  localUri?: string;
  
  /**
   * Flag, ob das Medium gerade hochgeladen wird
   */
  isUploading?: boolean;
  
  /**
   * Upload-Fortschritt (0-100)
   */
  uploadProgress?: number;
  
  /**
   * Eindeutige ID für die UI (um Medien während des Uploads zu identifizieren)
   */
  id: string;
}

// ==================== HOOK-TYPEN UND KONFIGURATIONEN ====================

/**
 * Optionen für die Nugget-Erstellung
 */
export interface NuggetCreationOptions {
  /**
   * Maximale Anzahl an Zeichen für den Inhalt
   * @default 500
   */
  maxContentLength?: number;
  
  /**
   * Maximale Anzahl an Medien, die hinzugefügt werden können
   * @default 1
   */
  maxMediaCount?: number;
  
  /**
   * Erlaubte Medientypen
   * @default ['image', 'video', 'link']
   */
  allowedMediaTypes?: Array<NuggetMediaType>;
  
  /**
   * Standardtags für neue Nuggets
   */
  defaultTags?: string[];
  
  /**
   * Ob Nuggets automatisch nach der Erstellung gespeichert werden sollen
   * @default true
   */
  autoSave?: boolean;
  
  /**
   * Ob der Content-Editor automatisch fokussiert werden soll
   * @default true
   */
  autoFocus?: boolean;
}

/**
 * Eingabeformular-Zustand für die Nugget-Erstellung
 */
export interface NuggetFormState {
  /**
   * Textinhalt des Nuggets
   */
  content: string;
  
  /**
   * Ausgewählte Medien (Bilder, Videos, Links)
   */
  media: NuggetMediaItem[];
  
  /**
   * Eingefügter Link
   */
  link: string | null;
  
  /**
   * Flag, ob gerade ein Link hinzugefügt wird
   */
  isAddingLink: boolean;
  
  /**
   * Tags/Kategorien für das Nugget
   */
  tags: string[];
}

/**
 * Zustand für den Nugget-Erstellungsprozess
 */
export interface NuggetCreationState extends NuggetFormState {
  /**
   * Aktueller Status des Erstellungsprozesses
   */
  status: NuggetCreationStatus;
  
  /**
   * Validierungsfehler
   */
  errors: NuggetValidationError | null;
}

/**
 * Schnittstelle für den NuggetService
 * Definiert alle verfügbaren Methoden für Nugget-Operationen
 */
export interface NuggetServiceInterface {
  /**
   * Ruft alle Nuggets für den aktuellen Benutzer ab
   * @param forceDemoNuggets Wenn true, werden immer die Demo-Nuggets zurückgegeben
   * @returns Promise mit einem Array von Nugget-Daten
   */
  getUserNuggets(forceDemoNuggets?: boolean): Promise<NuggetData[]>;
  
  /**
   * Fügt ein neues Nugget hinzu
   * @param nugget Zu speicherndes Nugget-Objekt ohne ID
   * @returns Promise mit dem gespeicherten Nugget inkl. generierter ID
   */
  addNugget(nugget: Omit<NuggetData, 'id'>): Promise<NuggetData | null>;
  
  /**
   * Aktualisiert ein bestehendes Nugget
   * @param nuggetId ID des zu aktualisierenden Nuggets
   * @param updates Zu aktualisierende Felder
   * @returns Promise mit dem aktualisierten Nugget oder null bei Fehler
   */
  updateNugget(nuggetId: string, updates: Partial<NuggetData>): Promise<NuggetData | null>;
  
  /**
   * Löscht ein Nugget
   * @param nuggetId ID des zu löschenden Nuggets
   * @returns Promise mit true bei Erfolg oder false bei Fehler
   */
  deleteNugget(nuggetId: string): Promise<boolean>;
}

// ==================== HOOK API-TYPEN ====================

/**
 * Konfiguration für den useCreateNugget Hook
 */
export interface UseCreateNuggetConfig {
  /**
   * Optionen für die Nugget-Erstellung
   */
  options?: NuggetCreationOptions;
  
  /**
   * Callback, der nach erfolgreicher Erstellung aufgerufen wird
   */
  onSuccess?: (nugget: NuggetData) => void;
  
  /**
   * Callback, der bei einem Fehler aufgerufen wird
   */
  onError?: (error: Error) => void;
  
  /**
   * Callback, der aufgerufen wird, wenn der Benutzer die Erstellung abbricht
   */
  onCancel?: () => void;
  
  /**
   * Service-Implementierung (für Tests und Mocking)
   */
  nuggetService?: NuggetServiceInterface;
}

/**
 * Rückgabetyp für den useCreateNugget Hook
 */
export interface UseCreateNuggetResult {
  /**
   * Aktueller Zustand des Nugget-Erstellungsprozesses
   */
  state: NuggetCreationState;
  
  /**
   * Aktualisiert den Textinhalt des Nuggets
   */
  setContent: (content: string) => void;
  
  /**
   * Fügt ein Medien-Item hinzu
   */
  addMedia: (media: Omit<NuggetMediaItem, 'id'>) => void;
  
  /**
   * Entfernt ein Medien-Item anhand des Index oder der ID
   */
  removeMedia: (indexOrId: number | string) => void;
  
  /**
   * Setzt den Link-Wert
   */
  setLink: (link: string | null) => void;
  
  /**
   * Schaltet den isAddingLink-Status um
   */
  toggleAddingLink: (isAdding?: boolean) => void;
  
  /**
   * Fügt ein Tag hinzu
   */
  addTag: (tag: string) => void;
  
  /**
   * Entfernt ein Tag
   */
  removeTag: (tag: string) => void;
  
  /**
   * Setzt die Tags
   */
  setTags: (tags: string[]) => void;
  
  /**
   * Setzt den gesamten Formularstatus zurück
   */
  resetForm: () => void;
  
  /**
   * Validiert die Eingaben und gibt das Ergebnis zurück
   * @returns True, wenn alle Eingaben gültig sind
   */
  validate: () => boolean;
  
  /**
   * Erstellt und speichert ein neues Nugget
   * @returns Promise mit dem erstellten Nugget oder null bei Fehler
   */
  createNugget: () => Promise<NuggetData | null>;
  
  /**
   * Funktion zum Hochladen von Medien
   * @param file Die Datei (lokaler URI), die hochgeladen werden soll
   * @returns Promise mit der URL der hochgeladenen Datei
   */
  uploadMedia: (file: string) => Promise<string>;
  
  /**
   * Bricht den Erstellungsprozess ab
   */
  cancelCreation: () => void;
}

// ==================== KOMPONENTEN-PROPS ====================

/**
 * Basis-Props für alle Nugget-Komponenten
 */
export interface BaseNuggetComponentProps {
  /**
   * Benutzerdefinierte Stile
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Props für die NuggetEditor-Komponente
 */
export interface NuggetEditorProps extends BaseNuggetComponentProps {
  /**
   * Der aktuelle Textinhalt
   */
  value: string;
  
  /**
   * Callback für Änderungen
   */
  onChangeText: (text: string) => void;
  
  /**
   * Maximale Zeichenanzahl
   */
  maxLength?: number;
  
  /**
   * Ob der Editor fokussiert werden soll
   */
  autoFocus?: boolean;
  
  /**
   * Platzhaltertext
   */
  placeholder?: string;
  
  /**
   * Stile für den Textinhalt
   */
  textStyle?: StyleProp<TextStyle>;
  
  /**
   * Stile für den Platzhaltertext
   */
  placeholderStyle?: StyleProp<TextStyle>;
  
  /**
   * Aktueller Validierungsfehler
   */
  error?: string;
  
  /**
   * Ob der Editor deaktiviert sein soll
   */
  disabled?: boolean;
}

/**
 * Props für die ProfileDisplay-Komponente
 */
export interface ProfileDisplayProps extends BaseNuggetComponentProps {
  /**
   * Profilbild-Daten oder URL
   */
  imageSource?: string | ProfileImageData;
  
  /**
   * Benutzername für Fallback und Anzeige
   */
  username?: string;
  
  /**
   * Name des Benutzers
   */
  name?: string;
  
  /**
   * Größe des Profilbilds
   */
  imageSize?: number;
  
  /**
   * Ob sich der Benutzer im "Real"-Modus befindet
   */
  isRealMode?: boolean;
  
  /**
   * Callback bei Klick auf das Profilbild
   */
  onPress?: () => void;
}

/**
 * Props für die MediaSelector-Komponente
 */
export interface MediaSelectorProps extends BaseNuggetComponentProps {
  /**
   * Aktuelle Medien
   */
  media: NuggetMediaItem[];
  
  /**
   * Callback zum Hinzufügen eines Mediums
   */
  onAddMedia: (media: Omit<NuggetMediaItem, 'id'>) => void;
  
  /**
   * Callback zum Entfernen eines Mediums
   */
  onRemoveMedia: (indexOrId: number | string) => void;
  
  /**
   * Maximal erlaubte Anzahl an Medien
   */
  maxMediaCount?: number;
  
  /**
   * Erlaubte Medientypen
   */
  allowedMediaTypes?: Array<NuggetMediaType>;
  
  /**
   * Funktion zum Auswählen von Medien aus der Galerie
   */
  onPickMedia?: () => Promise<void>;
  
  /**
   * Aktueller Validierungsfehler
   */
  error?: string;
  
  /**
   * Ob die Komponente deaktiviert sein soll
   */
  disabled?: boolean;
}

/**
 * Props für die LinkManager-Komponente
 */
export interface LinkManagerProps extends BaseNuggetComponentProps {
  /**
   * Aktueller Link
   */
  link: string | null;
  
  /**
   * Callback zum Setzen des Links
   */
  onLinkChange: (link: string | null) => void;
  
  /**
   * Flag, ob gerade ein Link hinzugefügt wird
   */
  isAddingLink: boolean;
  
  /**
   * Callback zum Umschalten des isAddingLink-Status
   */
  onToggleAddingLink: (isAdding?: boolean) => void;
  
  /**
   * Aktueller Validierungsfehler
   */
  error?: string;
  
  /**
   * Ob die Komponente deaktiviert sein soll
   */
  disabled?: boolean;
}

/**
 * Props für die NuggetToolbar-Komponente
 */
export interface NuggetToolbarProps extends BaseNuggetComponentProps {
  /**
   * Ist Medieneingabe deaktiviert
   */
  isMediaDisabled?: boolean;
  
  /**
   * Ist Linkeingabe deaktiviert
   */
  isLinkDisabled?: boolean;
  
  /**
   * Callback für Klick auf Medien-Button
   */
  onMediaPress: () => void;
  
  /**
   * Callback für Klick auf Link-Button
   */
  onLinkPress: () => void;
  
  /**
   * Weitere Aktionen als Kind-Komponenten
   */
  children?: ReactNode;
}

// ==================== KOMPATIBILITÄT MIT BESTEHENDEM CODE ====================

/**
 * Für die Kompatibilität mit vorhandenen Komponenten und Code - Aliasnamen
 * Zukünftig sollten die neuen Typennamen verwendet werden
 */
export type NuggetContentEditorProps = NuggetEditorProps;
export type NuggetMediaPickerProps = MediaSelectorProps;

export interface NuggetTagSelectorProps {
  /**
   * Aktuelle Tags
   */
  selectedTags: string[];
  
  /**
   * Callback zum Hinzufügen eines Tags
   */
  onAddTag: (tag: string) => void;
  
  /**
   * Callback zum Entfernen eines Tags
   */
  onRemoveTag: (tag: string) => void;
  
  /**
   * Verfügbare Tags zur Auswahl
   */
  availableTags?: string[];
  
  /**
   * Ob neue Tags erstellt werden können
   */
  allowNewTags?: boolean;
  
  /**
   * Benutzerdefinierte Stile
   */
  style?: StyleProp<ViewStyle>;
}

// Für die Kompatibilität mit vorhandenem Code
export type UseNuggetCreationConfig = UseCreateNuggetConfig;
export type UseNuggetCreationResult = Omit<UseCreateNuggetResult, 'getUserProfileImageUrl' | 'pickMedia'>;

/**
 * Props für die NuggetCreationForm-Komponente - alter Typ, zur Kompatibilität
 */
export interface NuggetCreationFormProps {
  /**
   * Hook-Ergebnis von useNuggetCreation
   */
  nuggetCreation: UseNuggetCreationResult;
  
  /**
   * Benutzerdefinierte Stile für den Container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Ob die Komponente vollständig angezeigt werden soll
   * (mit Header, Footer und allen Steuerelementen)
   * @default true
   */
  fullScreen?: boolean;
  
  /**
   * Benutzerdefinierter Inhalt für den Header
   */
  headerContent?: ReactNode;
  
  /**
   * Benutzerdefinierter Inhalt für den Footer
   */
  footerContent?: ReactNode;
  
  /**
   * Callback für die Zurück-Schaltfläche
   */
  onBack?: () => void;
}
