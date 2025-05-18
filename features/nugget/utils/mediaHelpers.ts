/**
 * Hilfsfunktionen zum Umgang mit Medien für die Nugget-Funktionalität
 * 
 * Diese Datei enthält Hilfsfunktionen für die Verarbeitung und Verwaltung
 * von Medien innerhalb der Nugget-Funktionalität, die von verschiedenen
 * Komponenten und Hooks verwendet werden können.
 */

import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import { logger } from '@/utils/logger';

import { generateMediaId } from '../config/constants';
import { NuggetMediaItem, NuggetMediaType } from '../types';

/**
 * Logger-Funktion, die in Produktionsumgebungen deaktiviert werden kann
 * @param {string} level Log-Level
 * @param {string} message Nachricht
 * @param {unknown} data Zusätzliche Daten (optional)
 */
const log = (level: 'error' | 'info' | 'warn', message: string, data?: unknown): void => {
  // In Produktionsumgebung könnte dies deaktiviert oder an einen Service weitergeleitet werden
  if (process.env.NODE_ENV !== 'production') {
    if (level === 'error') {
      logger.error(message, data as object);
    } else if (level === 'warn') {
      logger.warn(message, data as object);
    } else {
      logger.info(message, data as object);
    }
  }
};

/**
 * Extrahiert die Profilbild-URL aus einem Benutzer-Objekt
 * @param {{ profileImage?: string | { imageUrl: string } | null }} user Das Benutzer-Objekt
 * @returns {string|undefined} Die URL des Profilbilds oder undefined
 */
export const getUserProfileImageUrl = (
  user: { 
    profileImage?: string | { imageUrl: string } | null;
  } | null
): string | undefined => {
  if (!user) return undefined;
  
  // Wenn profileImage ein String ist, verwende es direkt
  if (typeof user.profileImage === 'string') {
    return user.profileImage;
  }
  
  // Wenn profileImage ein Objekt mit imageUrl ist, extrahiere die URL
  if (user.profileImage && typeof user.profileImage === 'object' && 'imageUrl' in user.profileImage) {
    return user.profileImage.imageUrl;
  }
  
  return undefined;
};

/**
 * Öffnet die Medien-Picker und erlaubt dem Benutzer die Auswahl von Bildern oder Videos
 * @param {object} options Optionen für den Medien-Picker
 * @param {ImagePicker.MediaTypeOptions} [options.mediaTypes] Erlaubte Medientypen
 * @param {boolean} [options.allowsEditing] Erlaubt Bearbeitung vor Auswahl
 * @param {number} [options.quality] Qualität des ausgewählten Mediums
 * @param {(uri: string) => Promise<string>} [options.onUpload] Callback für Upload-Funktion
 * @param {(error: Error) => void} [options.onError] Callback bei Fehler
 * @returns {Promise<NuggetMediaItem | null>} Promise mit dem ausgewählten Medienelement oder null
 */
export const pickMediaFromLibrary = async (
  options: {
    mediaTypes?: ImagePicker.MediaTypeOptions;
    allowsEditing?: boolean;
    quality?: number;
    onUpload?: (uri: string) => Promise<string>;
    onError?: (error: Error) => void;
  } = {}
): Promise<NuggetMediaItem | null> => {
  try {
    // Standard-Optionen festlegen
    const {
      mediaTypes = ImagePicker.MediaTypeOptions.All,
      allowsEditing = true,
      quality = 1,
      onUpload,
      onError
    } = options;
    
    // Berechtigungen prüfen
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Berechtigung benötigt', 'Die App benötigt Zugriff auf deine Medienbibliothek.');
      return null;
    }
    
    // Medienbibliothek öffnen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing,
      quality,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const mediaType: NuggetMediaType = asset.type === 'video' ? 'video' : 'image';
      
      let mediaUrl = asset.uri;
      
      // Wenn eine Upload-Funktion vorhanden ist, das Medium hochladen
      if (onUpload) {
        try {
          mediaUrl = await onUpload(asset.uri);
        } catch (error) {
          if (onError && error instanceof Error) {
            onError(error);
          } else {
            log('error', 'Fehler beim Hochladen des Mediums:', error);
          }
          // Trotz Upload-Fehler mit lokalem URI fortfahren
        }
      }
      
      // Medienelement erstellen
      return {
        type: mediaType,
        url: mediaUrl,
        thumbnailUrl: mediaType === 'video' ? mediaUrl : undefined,
        aspectRatio: asset.width && asset.height ? asset.width / asset.height : 1.5,
        localUri: asset.uri !== mediaUrl ? asset.uri : undefined,
        id: generateMediaId()
      };
    }
    
    return null;
  } catch (error) {
    log('error', 'Fehler beim Auswählen der Medien:', error);
    options.onError?.(error instanceof Error ? error : new Error('Unbekannter Fehler'));
    return null;
  }
};

/**
 * Berechnet den Medientyp basierend auf dem MIME-Typ oder der Dateiendung
 * @param {string} path Dateipfad oder URI
 * @param {string} [mimeType] MIME-Typ der Datei (optional)
 * @returns {NuggetMediaType} Medientyp (image, video oder link)
 */
export const determineMediaType = (
  path: string, 
  mimeType?: string
): NuggetMediaType => {
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
  }
  
  // Fallback: Dateiendung prüfen
  const extension = path.split('.').pop()?.toLowerCase();
  if (extension) {
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    }
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
      return 'video';
    }
  }
  
  // Bei externen URLs prüfen, ob es sich um einen Link handelt
  if (path.startsWith('http')) {
    return 'link';
  }
  
  // Standardwert
  return 'image';
};

/**
 * Prüft, ob das angegebene Medium ein Bild ist
 * @param {{ type: NuggetMediaType }} media Das zu prüfende Medium
 * @param {NuggetMediaType} media.type Der Medientyp
 * @returns {boolean} True, wenn es sich um ein Bild handelt
 */
export const isImage = (media: { type: NuggetMediaType }): boolean => {
  return media.type === 'image';
};

/**
 * Prüft, ob das angegebene Medium ein Video ist
 * @param {{ type: NuggetMediaType }} media Das zu prüfende Medium
 * @param {NuggetMediaType} media.type Der Medientyp
 * @returns {boolean} True, wenn es sich um ein Video handelt
 */
export const isVideo = (media: { type: NuggetMediaType }): boolean => {
  return media.type === 'video';
};

/**
 * Prüft, ob das angegebene Medium ein Link ist
 * @param {{ type: NuggetMediaType }} media Das zu prüfende Medium
 * @param {NuggetMediaType} media.type Der Medientyp
 * @returns {boolean} True, wenn es sich um einen Link handelt
 */
export const isLink = (media: { type: NuggetMediaType }): boolean => {
  return media.type === 'link';
}; 