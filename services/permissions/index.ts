/**
 * PermissionService
 * 
 * Bietet Methoden zum Abfragen und Anfordern von Berechtigungen für die App
 */
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

import { IService } from '@/utils/service/serviceRegistry';

import { logger } from '../../utils/logger';

/**
 * Service zur Verwaltung von App-Berechtigungen
 * Implementiert das IService-Interface für die ServiceRegistry.
 */
export class PermissionService implements IService {
  /**
   * Initialisierung des Permission-Service
   */
  async init(): Promise<void> {
    logger.debug('[PermissionService] Initialisiert');
  }

  /**
   * Ressourcen freigeben
   */
  async dispose(): Promise<void> {
    logger.debug('[PermissionService] Ressourcen freigegeben');
  }
  
  /**
   * Fordert die Berechtigung für den Zugriff auf die Mediathek an
   * @returns Promise<boolean> True, wenn die Berechtigung erteilt wurde, sonst false
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      console.log("[PermissionService] Fordere Mediathek-Berechtigung an");
      
      // Auf iOS muss die Berechtigung angefordert werden
      if (Platform.OS === 'ios') {
        // Prüfe zunächst den aktuellen Status
        const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
        console.log(`[PermissionService] Aktueller Mediathek-Status: ${currentStatus}`);
        
        if (currentStatus === 'granted') {
          console.log('[PermissionService] Mediathek-Berechtigung bereits vorhanden');
          return true;
        }
        
        // Unter iOS 14 versuchen wir eine limitierte Auswahl zu erlauben
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        // Prüfe, ob Berechtigung erteilt wurde
        const permissionGranted = status === 'granted'; 
        
        if (!permissionGranted) {
          logger.warn('Mediathek-Berechtigung verweigert', { status });
          console.warn(`[PermissionService] Mediathek-Berechtigung verweigert (Status: ${status})`);
        } else {
          console.log(`[PermissionService] Mediathek-Berechtigung erhalten (${status})`);
        }
        
        return permissionGranted;
      }
      
      // Auf Android wird die Berechtigung beim ersten Zugriff angefordert
      // Wir fordern sie aber explizit an, um konsistentes Verhalten zu haben
      if (Platform.OS === 'android') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        return status === 'granted';
      }
      
      // Fallback für andere Plattformen
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[PermissionService] Fehler beim Anfordern der Mediathek-Berechtigung:', errorMessage);
      logger.error('Fehler beim Anfordern der Mediathek-Berechtigung', errorMessage);
      
      // Im Fehlerfall versuchen wir trotzdem den Image Picker zu öffnen
      // Dies kann in manchen Fällen funktionieren, auch wenn die Berechtigungsabfrage fehlschlägt
      return true;
    }
  }

  /**
   * Fordert die Berechtigung für den Zugriff auf die Kamera an
   * @returns Promise<boolean> True, wenn die Berechtigung erteilt wurde, sonst false
   */
  async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      const permissionGranted = status === 'granted';
      
      if (!permissionGranted) {
        logger.warn('Kamera-Berechtigung verweigert');
      }
      
      return permissionGranted;
    } catch (error) {
      logger.error('Fehler beim Anfordern der Kamera-Berechtigung', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
}
