/**
 * Konstanten und Validierungsfunktionen für die Nugget-Funktionalität
 * 
 * Diese Datei enthält alle zentralen Konstanten, Standardwerte und
 * Validierungsfunktionen für die Nugget-Funktionalität, die von
 * verschiedenen Komponenten und Hooks verwendet werden.
 */

import { NuggetMediaType, NuggetValidationError } from '../types';

// ==================== LAYOUT-KONSTANTEN ====================

/**
 * Größe des Profilbilds in der CreateNugget-Ansicht
 */
export const PROFILE_IMAGE_SIZE = 56;

// ==================== CONTENT-LIMITS ====================

/**
 * Maximale Zeichenanzahl für den Nugget-Inhalt
 */
export const MAX_CONTENT_LENGTH = 500;

/**
 * Schwellenwert für Warnung bei Zeichenanzahl (gelb)
 */
export const CONTENT_WARNING_THRESHOLD = 450;

/**
 * Schwellenwert für Fehler bei Zeichenanzahl (rot)
 */
export const CONTENT_ERROR_THRESHOLD = 480;

// ==================== MEDIA-LIMITS ====================

/**
 * Maximale Anzahl an Medien pro Nugget
 */
export const MAX_MEDIA_COUNT = 1;

/**
 * Standardmäßig erlaubte Medientypen für Nuggets
 */
export const DEFAULT_ALLOWED_MEDIA_TYPES: NuggetMediaType[] = ['image', 'video', 'link'];

// ==================== STANDARD-KONFIGURATIONEN ====================

/**
 * Standardoption für automatisches Speichern
 */
export const DEFAULT_AUTO_SAVE = true;

/**
 * Standardoption für automatischen Fokus auf den ContentEditor
 */
export const DEFAULT_AUTO_FOCUS = true;

// ==================== VALIDIERUNGSFUNKTIONEN ====================

/**
 * Validiert den Textinhalt eines Nuggets
 * @param {string} content Der zu validierende Textinhalt
 * @param {number} maxLength Maximale Länge des Inhalts
 * @returns {string|undefined} Fehlermeldung oder undefined, wenn gültig
 */
export const validateContent = (
  content: string, 
  maxLength: number = MAX_CONTENT_LENGTH
): string | undefined => {
  if (!content || content.trim() === '') {
    return 'Der Nugget-Inhalt darf nicht leer sein.';
  }
  
  if (content.length > maxLength) {
    return `Der Inhalt darf maximal ${maxLength} Zeichen lang sein.`;
  }
  
  return undefined;
};

/**
 * Validiert ein Link-URL
 * @param {string|null} link Die zu validierende URL
 * @returns {string|undefined} Fehlermeldung oder undefined, wenn gültig
 */
export const validateLink = (link: string | null): string | undefined => {
  if (!link) return undefined;
  
  try {
    // Einfache URL-Validierung
    const url = new URL(link);
    if (!url.protocol.startsWith('http')) {
      return 'Der Link muss mit http:// oder https:// beginnen.';
    }
  } catch {
    return 'Der Link hat ein ungültiges Format.';
  }
  
  return undefined;
};

/**
 * Validiert Medien für ein Nugget
 * @param {Array<{ type: NuggetMediaType }>} media Mediaelemente
 * @param {number} maxCount Maximale Anzahl erlaubter Elemente
 * @param {NuggetMediaType[]} allowedTypes Erlaubte Typen
 * @returns {string|undefined} Fehlermeldung oder undefined, wenn gültig
 */
export const validateMedia = (
  media: Array<{ type: NuggetMediaType }>,
  maxCount: number = MAX_MEDIA_COUNT,
  allowedTypes: NuggetMediaType[] = DEFAULT_ALLOWED_MEDIA_TYPES
): string | undefined => {
  if (media.length > maxCount) {
    return `Maximal ${maxCount} Medienelement${maxCount === 1 ? '' : 'e'} erlaubt.`;
  }
  
  const invalidType = media.find(item => !allowedTypes.includes(item.type));
  if (invalidType) {
    return `Medientyp "${invalidType.type}" ist nicht erlaubt.`;
  }
  
  return undefined;
};

/**
 * Validiert das gesamte Nugget-Formular
 * @param {string} content Textinhalt
 * @param {Array<{ type: NuggetMediaType }>} media Mediaelemente
 * @param {string|null} link Link (optional)
 * @param {object} options Validierungsoptionen
 * @param {number} [options.maxContentLength] Maximale Länge des Inhalts
 * @param {number} [options.maxMediaCount] Maximale Anzahl an Medien
 * @param {NuggetMediaType[]} [options.allowedMediaTypes] Erlaubte Medientypen
 * @returns {{ isValid: boolean; errors: NuggetValidationError }} Validierungsergebnis mit Fehlern
 */
export const validateNuggetForm = (
  content: string,
  media: Array<{ type: NuggetMediaType }>,
  link: string | null,
  options: {
    maxContentLength?: number;
    maxMediaCount?: number;
    allowedMediaTypes?: NuggetMediaType[];
  } = {}
): { isValid: boolean; errors: NuggetValidationError } => {
  const contentError = validateContent(content, options.maxContentLength);
  const mediaError = validateMedia(
    media, 
    options.maxMediaCount, 
    options.allowedMediaTypes
  );
  const linkError = validateLink(link);
  
  const errors: NuggetValidationError = {};
  if (contentError) errors.content = contentError;
  if (mediaError) errors.media = mediaError;
  if (linkError) errors.link = linkError;
  
  return {
    isValid: !contentError && !mediaError && !linkError,
    errors
  };
};

// ==================== HILFSFUNKTIONEN ====================

/**
 * Generiert eine zufällige ID für Medienelemente
 * @returns {string} Zufällige ID
 */
export const generateMediaId = (): string => {
  return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Erstellt eine Vorschau-URL für ein lokales Medienelement
 * @param {string} uri Lokaler URI des Medienelements
 * @returns {string} Vorschau-URL
 */
export const createLocalMediaPreview = (uri: string): string => {
  return uri;
};

/**
 * Extrahiert den Dateinamen aus einem URI oder Pfad
 * @param {string} path URI oder Pfad
 * @returns {string} Dateiname
 */
export const extractFilenameFromPath = (path: string): string => {
  return path.split('/').pop() || path;
}; 