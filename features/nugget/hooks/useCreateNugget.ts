/**
 * useCreateNugget Hook
 * 
 * Zentraler Hook für die Nugget-Erstellung, der alle Funktionen und Zustandslogik
 * an einer Stelle kapselt. Implementiert die in den Typen definierte Schnittstelle
 * und bietet eine konsistente API für den Nugget-Erstellungsprozess.
 */

import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { NuggetData , NuggetUser } from '@/shared-components/cards/nugget-card/types';
import { useNuggetStore } from '@/stores/nuggetStore';
import { useUserStore } from '@/stores/userStore';
import { logger } from '@/utils/logger';
import { getMediaService, getNuggetService } from '@/utils/service/serviceHelper';

import { 
  DEFAULT_ALLOWED_MEDIA_TYPES, 
  MAX_CONTENT_LENGTH, 
  MAX_MEDIA_COUNT,
  generateMediaId,
  validateNuggetForm
} from '../config/constants';
import { NuggetCreationStatus, NuggetMediaItem, NuggetServiceInterface } from '../types';

/**
 * Definiere zusätzliche Typensicherheit
 */

/**
 * Media-Asset, das hochgeladen werden soll
 */
interface MediaAsset {
  uri: string;
  type: string;
}

/**
 * Payload für die Nugget-Erstellung über den Service
 */
interface NuggetPayload extends Omit<NuggetData, 'id'> {
  link?: string;
}

/**
 * Zustand des Nugget-Formulars
 */
interface NuggetFormState {
  content: string;
  media: NuggetMediaItem[];
  link: string | null;
  isAddingLink: boolean;
  tags: string[];
}

/**
 * Validierungsfehler für das Nugget-Formular
 */
interface NuggetValidationError {
  content?: string;
  media?: string;
  link?: string;
}

/**
 * Vollständiger Zustand für die Nugget-Erstellung
 */
interface NuggetCreationState extends NuggetFormState {
  status: NuggetCreationStatus;
  errors: NuggetValidationError | null;
}

/**
 * Konfiguration für den useCreateNugget Hook
 */
interface UseCreateNuggetConfig {
  /** Optionen für die Nugget-Erstellung */
  options?: {
    /** Maximale Zeichenanzahl für den Inhalt */
    maxContentLength?: number;
    /** Maximale Anzahl an Medien */
    maxMediaCount?: number;
    /** Erlaubte Medientypen */
    allowedMediaTypes?: Array<'image' | 'video' | 'link'>;
    /** Standard-Tags für neue Nuggets */
    defaultTags?: string[];
    /** Ob der Editor automatisch fokussiert werden soll */
    autoFocus?: boolean;
  };
  /** Callback nach erfolgreicher Erstellung */
  onSuccess?: (nugget: NuggetData) => void;
  /** Callback bei Fehlern */
  onError?: (error: Error) => void;
  /** Callback bei Abbruch */
  onCancel?: () => void;
  /** Service-Instanz für Tests/Mocking */
  nuggetService?: NuggetServiceInterface;
}

/**
 * Rückgabetyp des useCreateNugget Hooks
 */
interface UseCreateNuggetResult {
  /** Aktueller Zustand des Formulars */
  state: NuggetCreationState;
  /** Setzt den Textinhalt */
  setContent: (content: string) => void;
  /** Fügt ein Medium hinzu */
  addMedia: (media: Omit<NuggetMediaItem, 'id'>) => void;
  /** Entfernt ein Medium */
  removeMedia: (indexOrId: number | string) => void;
  /** Setzt den Link */
  setLink: (link: string | null) => void;
  /** Schaltet Link-Hinzufügen-Modus um */
  toggleAddingLink: (isAdding?: boolean) => void;
  /** Fügt ein Tag hinzu */
  addTag: (tag: string) => void;
  /** Entfernt ein Tag */
  removeTag: (tag: string) => void;
  /** Setzt alle Tags */
  setTags: (tags: string[]) => void;
  /** Setzt das Formular zurück */
  resetForm: () => void;
  /** Validiert das Formular */
  validate: () => boolean;
  /** Erstellt ein neues Nugget */
  createNugget: () => Promise<NuggetData | null>;
  /** Lädt ein Medium hoch */
  uploadMedia: (file: string) => Promise<string>;
  /** Bricht die Erstellung ab */
  cancelCreation: () => void;
}

/**
 * Verfügbare Action-Typen für den Reducer
 */
enum ActionType {
  SET_CONTENT = 'SET_CONTENT',
  ADD_MEDIA = 'ADD_MEDIA',
  REMOVE_MEDIA = 'REMOVE_MEDIA',
  SET_LINK = 'SET_LINK',
  TOGGLE_ADDING_LINK = 'TOGGLE_ADDING_LINK',
  ADD_TAG = 'ADD_TAG',
  REMOVE_TAG = 'REMOVE_TAG',
  SET_TAGS = 'SET_TAGS',
  SET_STATUS = 'SET_STATUS',
  SET_ERRORS = 'SET_ERRORS',
  RESET_FORM = 'RESET_FORM'
}

/**
 * Typen für die verschiedenen Actions
 */
type Action =
  | { type: ActionType.SET_CONTENT; payload: string }
  | { type: ActionType.ADD_MEDIA; payload: NuggetMediaItem }
  | { type: ActionType.REMOVE_MEDIA; payload: number | string }
  | { type: ActionType.SET_LINK; payload: string | null }
  | { type: ActionType.TOGGLE_ADDING_LINK; payload?: boolean }
  | { type: ActionType.ADD_TAG; payload: string }
  | { type: ActionType.REMOVE_TAG; payload: string }
  | { type: ActionType.SET_TAGS; payload: string[] }
  | { type: ActionType.SET_STATUS; payload: NuggetCreationStatus }
  | { type: ActionType.SET_ERRORS; payload: NuggetValidationError | null }
  | { type: ActionType.RESET_FORM };

/**
 * Reducer für den Nugget-Erstellungszustand
 * @param {NuggetCreationState} state - Der aktuelle Zustand
 * @param {Action} action - Die auszuführende Aktion
 * @returns {NuggetCreationState} Der neue Zustand nach der Aktion
 */
const nuggetCreationReducer = (state: NuggetCreationState, action: Action): NuggetCreationState => {
  switch (action.type) {
    case ActionType.SET_CONTENT:
      return { ...state, content: action.payload };
      
    case ActionType.ADD_MEDIA:
      return { 
        ...state, 
        media: [...state.media, action.payload] 
      };
      
    case ActionType.REMOVE_MEDIA:
      return { 
        ...state, 
        media: typeof action.payload === 'number'
          ? state.media.filter((_: NuggetMediaItem, index: number) => index !== action.payload)
          : state.media.filter((item: NuggetMediaItem) => item.id !== action.payload)
      };
      
    case ActionType.SET_LINK:
      return { ...state, link: action.payload };
      
    case ActionType.TOGGLE_ADDING_LINK:
      return { 
        ...state, 
        isAddingLink: action.payload !== undefined ? action.payload : !state.isAddingLink 
      };
      
    case ActionType.ADD_TAG:
      // Verhindere Duplikate
      if (state.tags.includes(action.payload)) {
        return state;
      }
      return { ...state, tags: [...state.tags, action.payload] };
      
    case ActionType.REMOVE_TAG:
      return { 
        ...state, 
        tags: state.tags.filter((tag: string) => tag !== action.payload) 
      };
      
    case ActionType.SET_TAGS:
      return { ...state, tags: action.payload };
      
    case ActionType.SET_STATUS:
      return { ...state, status: action.payload };
      
    case ActionType.SET_ERRORS:
      return { ...state, errors: action.payload };
      
    case ActionType.RESET_FORM:
      return { 
        ...initialState, 
        status: NuggetCreationStatus.IDLE,
        errors: null 
      };
      
    default:
      return state;
  }
};

// Initialer Zustand für den Reducer
const initialState: NuggetFormState = {
  content: '',
  media: [],
  link: null,
  isAddingLink: false,
  tags: []
};

// Vollständiger initialer Zustand
const initialCreationState: NuggetCreationState = {
  ...initialState,
  status: NuggetCreationStatus.IDLE,
  errors: null
};

/**
 * Hook für die Erstellung von Nuggets
 * @param {UseCreateNuggetConfig} config - Konfiguration für die Nugget-Erstellung
 * @returns {UseCreateNuggetResult} Objekt mit Zustand und Funktionen
 */
function useCreateNugget(config: UseCreateNuggetConfig = {}): UseCreateNuggetResult {
  // Extrahiere Optionen und Callbacks aus der Konfiguration
  const {
    options = {},
    onSuccess,
    onError,
    onCancel,
    nuggetService
  } = config;
  
  // Konfigurationsoptionen mit Default-Werten
  const {
    maxContentLength = MAX_CONTENT_LENGTH,
    maxMediaCount = MAX_MEDIA_COUNT,
    allowedMediaTypes = DEFAULT_ALLOWED_MEDIA_TYPES,
    defaultTags = [],
  } = options;

  // Services für Nugget und Media Operationen über ServiceRegistry abrufen
  const mediaService = useMemo(() => getMediaService(), []);
  const nuggetServiceInstance = useMemo(() => nuggetService ? nuggetService : getNuggetService(), [nuggetService]);
  
  // Zugriff auf Stores
  const { addNugget } = useNuggetStore();
  
  // Reducer für den Zustand
  const [state, dispatch] = useReducer(
    nuggetCreationReducer, 
    { ...initialCreationState, tags: defaultTags }
  );

  // Setze initial Tags wenn sich defaultTags ändert
  useEffect(() => {
    if (defaultTags.length > 0 && state.tags.length === 0) {
      dispatch({ type: ActionType.SET_TAGS, payload: defaultTags });
    }
  }, [defaultTags, state.tags.length]);

  // Callbacks für Zustandsänderungen
  const setContent = useCallback((content: string) => {
    dispatch({ type: ActionType.SET_CONTENT, payload: content });
  }, []);

  const addMedia = useCallback((media: Omit<NuggetMediaItem, 'id'>) => {
    const mediaItem: NuggetMediaItem = {
      ...media,
      id: generateMediaId()
    };
    dispatch({ type: ActionType.ADD_MEDIA, payload: mediaItem });
  }, []);

  const removeMedia = useCallback((indexOrId: number | string) => {
    dispatch({ type: ActionType.REMOVE_MEDIA, payload: indexOrId });
  }, []);

  const setLink = useCallback((link: string | null) => {
    dispatch({ type: ActionType.SET_LINK, payload: link });
  }, []);

  const toggleAddingLink = useCallback((isAdding?: boolean) => {
    dispatch({ type: ActionType.TOGGLE_ADDING_LINK, payload: isAdding });
  }, []);

  const addTag = useCallback((tag: string) => {
    dispatch({ type: ActionType.ADD_TAG, payload: tag });
  }, []);

  const removeTag = useCallback((tag: string) => {
    dispatch({ type: ActionType.REMOVE_TAG, payload: tag });
  }, []);

  const setTags = useCallback((tags: string[]) => {
    dispatch({ type: ActionType.SET_TAGS, payload: tags });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: ActionType.RESET_FORM });
  }, []);

  const setErrors = useCallback((errors: NuggetValidationError | null) => {
    dispatch({ type: ActionType.SET_ERRORS, payload: errors });
  }, []);

  /**
   * Validiert das aktuelle Formular
   * @returns {boolean} True, wenn alle Eingaben gültig sind
   */
  const validate = useCallback((): boolean => {
    const validationResult = validateNuggetForm(
      state.content,
      state.media,
      state.link,
      {
        maxContentLength,
        maxMediaCount,
        allowedMediaTypes
      }
    );
    
    setErrors(validationResult.errors);
    return validationResult.isValid;
  }, [state.content, state.media, state.link, maxContentLength, maxMediaCount, allowedMediaTypes, setErrors]);

  /**
   * Lädt ein Medienelement hoch
   * @param {string} fileUri - Der Dateipfad des hochzuladenden Mediums
   * @returns {Promise<string>} Die URL des hochgeladenen Mediums
   */
  const uploadMedia = useCallback(async (fileUri: string): Promise<string> => {
    try {
      // Erstelle ein MediaAsset-Objekt für die Verwendung mit MediaService
      const mediaAsset: MediaAsset = {
        uri: fileUri,
        type: fileUri.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'
      };
      
      // Hochladen des Mediums mit dem MediaService
      return await mediaService.uploadImage(mediaAsset);
    } catch (error) {
      logger.error('Fehler beim Hochladen des Mediums:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }, [mediaService]);

  /**
   * Erstellt ein neues Nugget mit den aktuellen Formulardaten
   * @returns {Promise<NuggetData | null>} Das erstellte Nugget oder null bei Fehler
   */
  const createNugget = useCallback(async (): Promise<NuggetData | null> => {
    try {
      // Validiere das Formular
      if (!validate()) {
        return null;
      }

      // Status auf "SAVING" setzen
      dispatch({ type: ActionType.SET_STATUS, payload: NuggetCreationStatus.SAVING });

      // Aktuelle Formularwerte
      const { content, media, link, tags } = state;

      // Aktuellen Benutzer holen
      const currentUser = useUserStore.getState().user as NuggetUser;
      
      if (!currentUser || typeof currentUser !== 'object' || !currentUser.id) {
        throw new Error('Kein angemeldeter Benutzer gefunden');
      }

      // Lade alle Medien hoch, die noch nicht hochgeladen wurden
      const mediaToUpload = media.filter(item => !item.url && item.localUri);
      
      let finalMedia = media;
      
      if (mediaToUpload.length > 0) {
        const uploadPromises = mediaToUpload.map(item => 
          uploadMedia(item.localUri!).then(url => ({
            ...item,
            url,
            isUploading: false,
            uploadProgress: 1
          }))
        );

        // Warte auf alle Uploads
        const uploadedMedia = await Promise.all(uploadPromises);

        // Kombiniere hochgeladene und bereits vorhandene Medien
        finalMedia = media.map(item => {
          const uploaded = uploadedMedia.find(m => m.id === item.id);
          return uploaded || item;
        });
      }

      /**
       * Bereitet die Nugget-Daten für die Speicherung vor
       * @param {NuggetUser} user - Der Benutzer, der das Nugget erstellt
       * @param {string} content - Der Textinhalt des Nuggets
       * @param {NuggetMediaItem[]} media - Die Medien des Nuggets
       * @param {string[]} tags - Die Tags des Nuggets
       * @param {string | null} link - Ein optionaler Link, der mit dem Nugget verknüpft ist
       * @returns {NuggetPayload} Das vorbereitete Nugget-Objekt ohne ID
       */
      const prepareNuggetData = (
        user: NuggetUser, 
        content: string, 
        media: NuggetMediaItem[], 
        tags: string[],
        link: string | null
      ): NuggetPayload => {
        const nuggetData: NuggetPayload = {
          user,
          timestamp: new Date().toISOString(),
          content,
          tags,
          helpfulCount: 0,
          commentCount: 0,
          isHelpful: false,
          isSaved: false,
          media: media
            .filter(m => m.url) // Nur Medien mit URL einschließen
            .map(m => ({
              type: m.type,
              url: m.url!,
              thumbnailUrl: m.thumbnailUrl || m.url!,
              aspectRatio: m.aspectRatio || 1
            }))
        };

        // Füge den Link hinzu, wenn vorhanden
        if (link) {
          nuggetData.link = link;
        }

        return nuggetData;
      };

      // Erstelle das Nugget-Objekt mit hochgeladenen Medien
      const nuggetData = prepareNuggetData(
        currentUser, 
        content, 
        finalMedia, 
        tags, 
        link
      );
      
      // Erstelle das Nugget mit dem Service
      const createdNugget = await nuggetServiceInstance.addNugget(nuggetData);

      if (!createdNugget) {
        throw new Error('Fehler beim Erstellen des Nuggets');
      }

      // Füge das neue Nugget zum Store hinzu
      addNugget(createdNugget);

      // Status auf "SUCCESS" setzen
      dispatch({ type: ActionType.SET_STATUS, payload: NuggetCreationStatus.SUCCESS });
      dispatch({ type: ActionType.RESET_FORM });

      // Erfolg-Callback aufrufen, wenn vorhanden
      if (onSuccess) {
        onSuccess(createdNugget);
      }

      return createdNugget;
    } catch (error) {
      // Status auf "ERROR" setzen
      dispatch({ type: ActionType.SET_STATUS, payload: NuggetCreationStatus.ERROR });

      // Fehler-Callback aufrufen, wenn vorhanden
      if (onError && error instanceof Error) {
        onError(error);
      }

      logger.error('Fehler beim Erstellen des Nuggets:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }, [state, validate, uploadMedia, onError, nuggetServiceInstance, addNugget, onSuccess]);

  /**
   * Bricht die Nugget-Erstellung ab
   */
  const cancelCreation = useCallback(() => {
    // Setze das Formular zurück
    resetForm();
    
    // Rufe onCancel-Callback auf, falls definiert
    if (onCancel) {
      onCancel();
    }
  }, [resetForm, onCancel]);

  // Erstelle das Ergebnisobjekt als Memo
  const hookResult = useMemo<UseCreateNuggetResult>(() => ({
    state,
    setContent,
    addMedia,
    removeMedia,
    setLink,
    toggleAddingLink,
    addTag,
    removeTag,
    setTags,
    resetForm,
    validate,
    createNugget,
    uploadMedia,
    cancelCreation
  }), [
    state,
    setContent,
    addMedia,
    removeMedia,
    setLink,
    toggleAddingLink,
    addTag,
    removeTag,
    setTags,
    resetForm,
    validate,
    createNugget,
    uploadMedia,
    cancelCreation
  ]);

  return hookResult;
}

export default useCreateNugget; 