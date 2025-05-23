import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  StyleProp, 
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImageData } from '@/utils/profileImageUtils';

/**
 * Props für die ProfileImage-Komponente
 */
interface ProfileImageProps {
  /**
   * Bildquelle (kann URL-String oder ProfileImageData-Objekt sein)
   * - { uri: string } - Direkter URI-Verweis
   * - ProfileImageData - Objekt mit imageUrl und Initialen 
   */
  source?: { uri: string } | ProfileImageData | null;
  
  /**
   * Text für Initialen-Fallback
   */
  fallbackText?: string;
  
  /**
   * Größe des Bildes in Pixeln
   * @default 48
   */
  size?: number;
  
  /**
   * Stil-Variante des Bildes
   * @default 'circle'
   */
  variant?: 'circle' | 'rounded' | 'square';
  
  /**
   * Ist der aktuelle Modus "real" (nicht "demo")
   * @default true
   */
  isRealMode?: boolean;
  
  /**
   * Zusätzliche Styles für den Container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Zusätzliche Styles für das Bild
   */
  imageStyle?: StyleProp<ImageStyle>;
  
  /**
   * Zusätzliche Styles für den Fallback-Text
   */
  textStyle?: StyleProp<TextStyle>;
  
  /**
   * Breite des Randes in Pixeln
   * @default 0
   */
  borderWidth?: number;
  
  /**
   * Farbe des Randes (überschreibt die primäre Farbe)
   */
  borderColor?: string;
}

/**
 * Einfache Bild-Komponente ohne Cache-Logik
 * Zeigt ein Bild an oder Initialen als Fallback, wenn kein Bild verfügbar ist
 * 
 * Unterstützt sowohl direkte URI-Verweise als auch ProfileImageData-Objekte
 * @param root0
 * @param root0.source
 * @param root0.fallbackText
 * @param root0.size
 * @param root0.variant
 * @param root0.isRealMode
 * @param root0.style
 * @param root0.imageStyle
 * @param root0.textStyle
 * @param root0.borderWidth
 * @param root0.borderColor
 */
export function ProfileImage({
  source,
  fallbackText = 'U',
  size = 48,
  variant = 'circle',
  isRealMode = true,
  style,
  imageStyle,
  textStyle,
  borderWidth = 2,
  borderColor
}: ProfileImageProps) {
  const colors = useThemeColor();
  
  // Border-Radius basierend auf Variante
  const borderRadius = variant === 'circle' ? size / 2 : 
                      variant === 'rounded' ? size / 8 : 
                      0;
  
  // Bestimme, ob ein Bild angezeigt werden soll und welche URI
  const shouldShowImage = !!source;
  
  // Extrahiere URI aus source
  const imageUri = useMemo(() => {
    if (!source) return null;
    
    // Wenn es ein URI-Objekt ist
    if ('uri' in source && source.uri) {
      return source.uri;
    }
    
    // Wenn es ein ProfileImageData-Objekt ist
    if ('imageUrl' in source && source.imageUrl) {
      return source.imageUrl;
    }
    
    return null;
  }, [source]);
  
  // Fallback-Text für Initialen bestimmen
  const initialsText = useMemo(() => {
    // Wenn die Quelle ein ProfileImageData-Objekt mit Initialen ist
    if (source && 'initials' in source && source.initials) {
      return source.initials.toUpperCase();
    }
    
    // Andernfalls aus dem fallbackText berechnen
    if (fallbackText && fallbackText.trim()) {
      const parts = fallbackText.trim().split(' ');
      if (parts.length === 1) return fallbackText.substring(0, 2).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    
    return 'U';
  }, [source, fallbackText]);
  
  // Randfarbe festlegen (nutze übergebene borderColor oder die primäre Farbe)
  const actualBorderColor = borderColor || colors.primary;
  
  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.imageContainer,
          {
            width: size,
            height: size,
            borderRadius: borderRadius,
            borderWidth: borderWidth,
            borderColor: actualBorderColor
          }
        ]}
      >
        {shouldShowImage && imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.image,
              { borderRadius: borderRadius - borderWidth }, // Verringere den Border-Radius für das Bild
              imageStyle
            ]}
          />
        ) : (
          <View 
            style={[
              styles.fallbackContainer,
              { 
                backgroundColor: colors.primary,
                borderRadius: borderRadius - borderWidth // Verringere den Border-Radius für den Fallback
              }
            ]}
          >
            <Text 
              style={[
                styles.fallbackText, 
                {
                  fontSize: size * 0.4,
                  color: '#FFFFFF'
                },
                textStyle
              ]}
            >
              {initialsText}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fallbackText: {
    fontWeight: 'bold'
  }
}); 