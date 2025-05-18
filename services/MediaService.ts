/**
 * MediaService
 * 
 * Service für das Hochladen und Verwalten von Medieninhalten wie Bildern und Videos
 */

import { AppMode } from '@/types/common/appMode';
import { IService } from '@/utils/service/serviceRegistry';

import ApiService from './ApiService';
import { logger } from '../utils/logger';

/**
 * Schnittstelle für Medien-Assets
 */
interface MediaAsset {
  /**
   * URI des Assets
   */
  uri: string;
  
  /**
   * Typ des Assets
   */
  type?: string;
}

/**
 * Service für das Hochladen und Verwalten von Medieninhalten
 * Implementiert das IService-Interface für die ServiceRegistry.
 */
class MediaService implements IService {
  /**
   * Flag für die Verwendung des Entwicklungs-Modus mit simulierten Responses
   * @default true im __DEV__-Modus, sonst false
   */
  private useDevMode: boolean = __DEV__;
  
  /**
   * Der aktuelle App-Modus
   */
  private appMode: AppMode = 'live';
  
  /**
   * API-Service für HTTP-Anfragen
   */
  private apiService: ApiService;

  /**
   * Konstruktor mit Option zum Aktivieren/Deaktivieren des DevMode
   * @param {object} options - Optionen für den MediaService
   * @param {boolean} options.useDevMode - Wenn true, wird der Entwicklungsmodus verwendet
   * @param {AppMode} options.appMode - Der aktuelle App-Modus
   * @param {ApiService} apiService - Optional: API-Service-Instanz
   */
  constructor(options?: { useDevMode?: boolean; appMode?: AppMode }, apiService?: ApiService) {
    // Überschreibe nur, wenn explizit gesetzt
    if (options?.useDevMode !== undefined) {
      this.useDevMode = options.useDevMode;
    }
    
    if (options?.appMode) {
      this.appMode = options.appMode;
    }
    
    this.apiService = apiService || new ApiService();
  }
  
  /**
   * Initialisierung des Media-Service
   */
  async init(): Promise<void> {
    logger.debug('[MediaService] Initialisiert');
  }

  /**
   * Ressourcen freigeben
   */
  async dispose(): Promise<void> {
    logger.debug('[MediaService] Ressourcen freigegeben');
  }

  /**
   * Lädt ein Bild auf den Server hoch.
   * @param {MediaAsset} mediaAsset - Das Medien-Asset, das hochgeladen werden soll
   * @param {AppMode} appMode - Optional: Der App-Modus für diesen speziellen Upload
   * @returns {Promise<string>} - URL des hochgeladenen Bildes
   */
  async uploadImage(mediaAsset: MediaAsset, appMode?: AppMode): Promise<string> {
    const currentAppMode = appMode || this.appMode;
    
    try {
      // Im Demo-Modus simulieren wir einen erfolgreichen Upload
      if (currentAppMode === 'demo') {
        logger.debug('[MediaService] DEV-MODUS: Simuliere erfolgreichen Bildupload');
        
        // Demo-URLs für verschiedene Medientypen
        return 'https://example-api.solvbox.com/assets/demo-image.jpg';
      }
      
      // Echten Upload durchführen
      const uri = mediaAsset.uri;
      const filename = uri.split('/').pop() || 'upload.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: filename,
        type,
      } as unknown as Blob);
      
      const response = await fetch('https://live-api.solvbox.com/media/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data.url;
      } else {
        throw new Error(data.message || 'Fehler beim Bildupload');
      }
    } catch (error) {
      // Einheitliches Fehler-Logging
      logger.error('[MediaService] Fehler beim Bildupload:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
  
  /**
   * Lädt ein Profilbild hoch und aktualisiert das Benutzerprofil.
   * @param {MediaAsset} mediaAsset - Das Medien-Asset
   * @param {string} userId - Die Benutzer-ID
   * @param {AppMode} appMode - Optional: Der App-Modus für diesen speziellen Upload
   * @returns {Promise<string>} - URL des hochgeladenen Profilbilds
   */
  async uploadProfileImage(
    mediaAsset: MediaAsset,
    userId: string,
    appMode?: AppMode
  ): Promise<string> {
    try {
      // Bild hochladen
      const imageUrl = await this.uploadImage(mediaAsset, appMode);
      
      // Profil aktualisieren
      await this.apiService.put(`/users/${userId}/profile`, {
        profileImage: imageUrl,
      });
      
      return imageUrl;
    } catch (error) {
      logger.error('[MediaService] Fehler beim Hochladen des Profilbilds:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}

export default MediaService;
