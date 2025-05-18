import { useEffect, useState, useCallback } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

import { ScreenSize } from '../types';

/**
 * Dimensionen des Bildschirms und Funktionen für die Anpassung des Layouts
 */
export interface ScreenDimensions {
  /**
   * Aktuelle Bildschirmbreite in Pixeln
   */
  screenWidth: number;
  
  /**
   * Aktuelle Bildschirmhöhe in Pixeln
   */
  screenHeight: number;
  
  /**
   * Prüft, ob das Gerät im Landscape-Modus ist
   */
  isLandscape: boolean;
  
  /**
   * Prüft, ob es sich um ein Tablet handelt (basierend auf Bildschirmgröße)
   */
  isTablet: boolean;
  
  /**
   * Aktuelle Bildschirmgröße als kategorisierter Wert
   * - small: < 375px (kleine Smartphones)
   * - medium: 375-767px (Standard Smartphones)
   * - large: 768-1023px (große Smartphones, kleine Tablets)
   * - tablet: >= 1024px (Tablets, Desktop)
   */
  screenSize: ScreenSize;
  
  /**
   * Berechnet einen adaptiven Wert basierend auf der Bildschirmbreite
   * Nützlich für responsive Layouts
   * @param {number} baseSize - Basisgröße für Referenzbreite von 375px (iPhone)
   * @returns {number} Angepasste Größe für die aktuelle Bildschirmbreite
   */
  adaptiveWidth: (baseSize: number) => number;
  
  /**
   * Berechnet einen adaptiven Wert basierend auf der Bildschirmhöhe
   * @param {number} baseSize - Basisgröße für Referenzhöhe von 667px (iPhone)
   * @returns {number} Angepasste Größe für die aktuelle Bildschirmhöhe
   */
  adaptiveHeight: (baseSize: number) => number;
  
  /**
   * Gibt den Wert basierend auf der aktuellen Bildschirmgröße zurück
   * @param {Record<ScreenSize, T>} values - Objekt mit Werten für jede Bildschirmgröße
   * @returns {T} Der Wert für die aktuelle Bildschirmgröße
   */
  getValueForScreenSize: <T>(values: Record<ScreenSize, T>) => T;
}

// Standard iPhone Breite als Referenzwert
const REFERENCE_WIDTH = 375;

// Standard iPhone Höhe als Referenzwert
const REFERENCE_HEIGHT = 667;

// Minimale Bildschirmbreite für Tablets
const TABLET_MIN_WIDTH = 768;

// Bildschirmgröße-Breakpoints
const SCREEN_SIZE_BREAKPOINTS = {
  small: 375,
  medium: 767,
  large: 1023,
};

/**
 * Hook, der die aktuellen Bildschirmdimensionen bereitstellt
 * und auf Änderungen reagiert (z.B. Rotation des Geräts)
 * @returns {ScreenDimensions} Aktuelle Bildschirmdimensionen und Hilfsfunktionen
 * @example
 * // Basis Verwendung
 * const { screenWidth, isLandscape, adaptiveWidth } = useScreenDimensions();
 * const paddingSize = adaptiveWidth(16);
 * @example
 * // Werte basierend auf Bildschirmgröße
 * const { getValueForScreenSize } = useScreenDimensions();
 * const fontSize = getValueForScreenSize({
 *   small: 14,
 *   medium: 16,
 *   large: 18,
 *   tablet: 20,
 * });
 */
export function useScreenDimensions(): ScreenDimensions {
  // State für die aktuellen Dimensionen
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));
  
  // Event-Handler für Dimensionsänderungen
  const handleDimensionsChange = useCallback(({ window }: { window: ScaledSize }) => {
    setDimensions(window);
  }, []);
  
  // Registriere Event-Listener für Dimensionsänderungen
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);
    
    // Event-Listener entfernen beim Unmount
    return () => subscription.remove();
  }, [handleDimensionsChange]);
  
  // Abgeleitete Werte
  const screenWidth = dimensions.width;
  const screenHeight = dimensions.height;
  const isLandscape = screenWidth > screenHeight;
  const isTablet = screenWidth >= TABLET_MIN_WIDTH || screenHeight >= TABLET_MIN_WIDTH;
  
  // Bestimme die aktuelle Bildschirmgröße
  const getScreenSize = useCallback((): ScreenSize => {
    if (screenWidth < SCREEN_SIZE_BREAKPOINTS.small) return 'small';
    if (screenWidth <= SCREEN_SIZE_BREAKPOINTS.medium) return 'medium';
    if (screenWidth <= SCREEN_SIZE_BREAKPOINTS.large) return 'large';
    return 'tablet';
  }, [screenWidth]);
  
  const screenSize = getScreenSize();
  
  /**
   * Berechnet eine adaptive Größe basierend auf der aktuellen Bildschirmbreite
   * @param {number} baseSize - Basisgröße für Standardbildschirm
   * @returns {number} Angepasste Größe
   */
  const adaptiveWidth = useCallback((baseSize: number): number => {
    return (screenWidth / REFERENCE_WIDTH) * baseSize;
  }, [screenWidth]);
  
  /**
   * Berechnet eine adaptive Größe basierend auf der aktuellen Bildschirmhöhe
   * @param {number} baseSize - Basisgröße für Standardbildschirm
   * @returns {number} Angepasste Größe
   */
  const adaptiveHeight = useCallback((baseSize: number): number => {
    return (screenHeight / REFERENCE_HEIGHT) * baseSize;
  }, [screenHeight]);
  
  /**
   * Wählt einen Wert basierend auf der aktuellen Bildschirmgröße
   * @param {Record<ScreenSize, T>} values - Werte für jede Bildschirmgröße
   * @returns {T} Der ausgewählte Wert
   */
  const getValueForScreenSize = useCallback(<T,>(values: Record<ScreenSize, T>): T => {
    return values[screenSize];
  }, [screenSize]);
  
  return {
    screenWidth,
    screenHeight,
    isLandscape,
    isTablet,
    screenSize,
    adaptiveWidth,
    adaptiveHeight,
    getValueForScreenSize,
  };
} 