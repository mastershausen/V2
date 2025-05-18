/**
 * usePhotoSelection Hook
 * 
 * Bietet Funktionen zum Auswählen und Verarbeiten von Fotos aus der Mediengalerie oder Kamera
 */

import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Platform } from 'react-native';

import { logger } from '@/utils/logger';

// Direkter Export des ImagePicker-Typs für Kompatibilität
export type PhotoSelectionResult = ImagePicker.ImagePickerResult;

// Hook für die Fotoauswahl
/**
 *
 */
export function usePhotoSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Öffnet die Bildergalerie zur Auswahl eines Bildes
  const openImageLibrary = async (): Promise<PhotoSelectionResult> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        logger.info('Bild aus Galerie ausgewählt');
      }

      return result;
    } catch (err) {
      logger.error('Fehler beim Öffnen der Bildergalerie', err instanceof Error ? err.message : String(err));
      // Korrekte Struktur für eine abgebrochene Auswahl
      return { canceled: true, assets: null };
    }
  };

  // Öffnet die Kamera zur Aufnahme eines Bildes
  const openCamera = async (): Promise<PhotoSelectionResult> => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        logger.info('Bild mit Kamera aufgenommen');
      }

      return result;
    } catch (err) {
      logger.error('Fehler beim Öffnen der Kamera', err instanceof Error ? err.message : String(err));
      // Korrekte Struktur für eine abgebrochene Auswahl
      return { canceled: true, assets: null };
    }
  };

  return {
    openImageLibrary,
    openCamera,
    isLoading,
    setIsLoading,
    error,
    setError
  };
}

export default usePhotoSelection; 