import { themeColors } from '@/config/theme';

/**
 * Typdefinition für Theme-Farben
 * Wird verwendet, um Komponenten mit dem aktuellen Farbschema zu stylen
 */
export type ThemeColors = typeof themeColors.light;

/**
 * Mögliche Bildschirmgrößen als String-Literale für responsive Designs
 */
export type ScreenSize = 'small' | 'medium' | 'large' | 'tablet';

/**
 * Richtungen für Layout-Komponenten
 */
export type Direction = 'horizontal' | 'vertical';

/**
 * Grundlegenden Ausrichtungsoptionen
 */
export type Alignment = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

/**
 * Größen für Komponentenvarianten
 */
export type Size = 'xs' | 's' | 'm' | 'l' | 'xl';

/**
 * Status für UI-Komponenten
 */
export type ComponentStatus = 'idle' | 'loading' | 'success' | 'error' | 'warning';

/**
 * Re-export aller spezifischen Typen aus den Untermodulen
 */
export * from './search'; 