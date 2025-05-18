import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Text
} from 'react-native';

import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';

interface HeaderMediaProps {
  /**
   * URL zum Bild
   * @type {string|null}
   */
  imageUrl: string | null;
  
  /**
   * Fallback URL, die verwendet wird, wenn die primäre URL fehlschlägt
   * @type {string|null}
   */
  fallbackImageUrl?: string | null;
  
  /**
   * Oberer Abstand
   * @type {number}
   */
  marginTop?: number;
  
  /**
   * Wird aufgerufen, wenn ein Fehler beim Laden des Bildes auftritt
   * @type {Function}
   */
  onError?: () => void;
  
  /**
   * Wird aufgerufen, wenn das Bild erfolgreich geladen wurde
   * @type {Function}
   */
  onReady?: () => void;
  
  /**
   * Abrundung der Ecken
   * @type {number}
   */
  borderRadius?: number;
}

// Berechne feste Höhe für das Header-Bild
const SCREEN_WIDTH = Dimensions.get('window').width;
const HEADER_HEIGHT = Math.round(SCREEN_WIDTH * 0.5625); // Exakt 16:9

// Modus-spezifische Farben - klare visuelle Unterscheidung
const MODE_COLORS = {
  demo: {
    primary: '#1976D2', // Helleres Blau für Demo
    gradient: ['#1976D2', '#2196F3', '#42A5F5']
  },
  live: {
    primary: '#0277BD', // Kräftigeres, dunkleres Blau für Live
    gradient: ['#0277BD', '#0288D1', '#039BE5']
  }
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  modeText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

/**
 * HeaderMedia-Komponente für Medieninhalte in Kopfzeilen
 * 
 * Zeigt Bilder an und behandelt Lade- und Fehlerzustände.
 * Mode-abhängige Farbgebung für klare visuelle Unterscheidung zwischen Demo/Live.
 * @param root0 - Die Props für die Komponente
 * @param root0.imageUrl - Die URL zum Bild
 * @param root0.fallbackImageUrl - Fallback-URL bei Fehler
 * @param root0.marginTop - Oberer Abstand
 * @param root0.onError - Fehler-Callback
 * @param root0.onReady - Erfolgs-Callback
 * @param root0.borderRadius - Abrundung der Ecken
 * @returns HeaderMedia-Komponente
 */
export function HeaderMedia({
  imageUrl,
  fallbackImageUrl,
  marginTop = 0,
  onError,
  onReady,
  borderRadius = 0,
}: HeaderMediaProps) {
  const colors = useThemeColor();
  const { isDemoMode } = useMode();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Mode-spezifische Farben bestimmen
  const modeColors = useMemo(() => {
    return isDemoMode() ? MODE_COLORS.demo : MODE_COLORS.live;
  }, [isDemoMode]);
  
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (onReady) onReady();
  }, [onReady]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError();
    }
  }, [onError]);

  // Container-Stil mit dynamischen Eigenschaften für Margins und Border Radius
  const containerStyle = [
    styles.container,
    { 
      marginTop,
      borderBottomLeftRadius: borderRadius,
      borderBottomRightRadius: borderRadius
    }
  ];

  // Bild-Stil mit dynamischen Eigenschaften
  const imageStyle = [
    styles.headerImage,
    {
      borderBottomLeftRadius: borderRadius,
      borderBottomRightRadius: borderRadius
    }
  ];

  // Wenn ein Bild-URL verfügbar ist, zeige das Bild an
  const effectiveImageUrl = imageUrl || fallbackImageUrl || '';

  return (
    <View style={containerStyle}>
      {effectiveImageUrl ? (
        <>
          <Image 
            source={{ uri: effectiveImageUrl }}
            style={imageStyle}
            resizeMode="cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={modeColors.primary} size="large" />
            </View>
          )}
        </>
      ) : (
        <View 
          style={[
            imageStyle, 
            { 
              backgroundColor: modeColors.primary,
              borderBottomWidth: 1,
              borderBottomColor: colors.divider
            }
          ]} 
        />
      )}
    </View>
  );
}

export default HeaderMedia; 