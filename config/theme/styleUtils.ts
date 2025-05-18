/**
 * Style-Utilities für die Solvbox App
 * 
 * Hilfsfunktionen für konsistentes Styling mit TypeScript-Unterstützung.
 * Diese Utilities helfen dabei, typsichere Styles zu erstellen und mit Theme-Farben zu arbeiten.
 */
import { StyleSheet, ViewStyle, TextStyle, ImageStyle, StyleProp } from 'react-native';

// Typdefinitionen für Style-Objekte
export type StyleType = ViewStyle | TextStyle | ImageStyle;
export type StylesType = { [key: string]: StyleType };
export type NamedStyles<T> = { [P in keyof T]: StyleType };

/**
 * Erzeugt eine Farbe mit Opazität im RGBA-Format
 * Unterstützt HEX, RGB und RGBA Eingabeformate
 * @param color - Die Basisfarbe (HEX, RGB oder RGBA)
 * @param opacity - Opazitätswert zwischen 0 und 1
 * @returns RGBA-Farbstring
 * @example
 * // Hex zu RGBA
 * withOpacity('#FF5500', 0.5) // => rgba(255, 85, 0, 0.5)
 * 
 * // RGB zu RGBA
 * withOpacity('rgb(255, 85, 0)', 0.5) // => rgba(255, 85, 0, 0.5)
 * 
 * // RGBA Opazität überschreiben
 * withOpacity('rgba(255, 85, 0, 0.8)', 0.5) // => rgba(255, 85, 0, 0.5)
 */
export function withOpacity(color: string, opacity: number): string {
  // Begrenze Opazität auf gültigen Bereich
  const safeOpacity = Math.max(0, Math.min(1, opacity));
  
  // HEX-Farbe (z.B. #FF5500 oder #F50)
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    
    // Kurze Form (#RGB) in lange Form (#RRGGBB) umwandeln
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // HEX zu RGB konvertieren
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${safeOpacity})`;
  }
  
  // RGB-Farbe (z.B. rgb(255, 85, 0))
  if (color.startsWith('rgb(')) {
    const rgb = color.slice(4, -1);
    return `rgba(${rgb}, ${safeOpacity})`;
  }
  
  // RGBA-Farbe (z.B. rgba(255, 85, 0, 0.8))
  if (color.startsWith('rgba(')) {
    const rgba = color.slice(5, -1).split(',');
    const rgb = rgba.slice(0, 3).join(',');
    return `rgba(${rgb}, ${safeOpacity})`;
  }
  
  // Farbname oder unbekanntes Format (keine Umwandlung möglich)
  console.warn(`withOpacity: Unbekanntes Farbformat für "${color}". Verwende Originalfarbe.`);
  return color;
}

/**
 * Erstellt dynamische Styles basierend auf den übergebenen Werten
 *
 * Diese Funktion kombiniert Basis-Styles mit dynamischen Style-Properties
 * und behält dabei die TypeScript-Typsicherheit bei.
 * @example
 * ```tsx
 * const baseStyles = StyleSheet.create({
 *   container: { flex: 1 },
 *   text: { fontSize: 16 }
 * });
 * 
 * // Dynamisch Styles basierend auf Props hinzufügen
 * const combinedStyles = createStyles(baseStyles, {
 *   container: { backgroundColor: isActive ? colors.primary : colors.background }
 * });
 * ```
 * @param baseStyles Die Basis-Styles aus StyleSheet.create()
 * @param dynamicStyles Objekt mit dynamischen Style-Properties
 * @returns Kombinierte Styles
 */
export function createStyles<T extends StylesType>(baseStyles: T, dynamicStyles?: Partial<T>) {
  if (!dynamicStyles) return baseStyles;
  
  const result = { ...baseStyles } as T;
  
  (Object.keys(dynamicStyles) as Array<keyof T>).forEach((key) => {
    const dynamicValue = dynamicStyles[key];
    const baseValue = baseStyles[key];
    
    if (baseValue && dynamicValue) {
      result[key] = { ...baseValue, ...dynamicValue } as T[typeof key];
    } else if (dynamicValue) {
      result[key] = dynamicValue as T[typeof key];
    }
  });
  
  return result;
}

/**
 * Kombiniert mehrere Style-Objekte zu einem Array
 *
 * Besonders nützlich für das Zusammenfügen von Basis-Styles mit
 * bedingten Styles innerhalb von Komponenten.
 * @example
 * ```tsx
 * <View style={combineStyles(
 *   styles.container,
 *   isActive && styles.activeContainer,
 *   disabled && styles.disabledContainer,
 *   customStyle
 * )} />
 * ```
 * @param styles Array oder einzelne Style-Objekte
 * @returns Array mit allen kombinierten Styles
 */
export function combineStyles(...styles: (StyleType | undefined | null | false | (StyleType | undefined | null | false)[])[]): StyleType[] {
  return styles.flat().filter(Boolean) as StyleType[];
}

/**
 * Erstellt einen Komponenten-Stil mit Base-Styles und Theme-abhängigen Styles
 *
 * Besonders nützlich für Komponenten, die auf Theme-Änderungen reagieren müssen.
 * Die Funktion erstellt ein Styling-Template, das dann mit konkreten Theme-Werten
 * aufgerufen werden kann.
 * @example
 * ```tsx
 * // Style-Funktion definieren
 * const createScreenStyles = createThemedStyles(
 *   // Basis-Styles (unabhängig vom Theme)
 *   StyleSheet.create({
 *     container: { flex: 1 },
 *     title: { fontSize: 20 }
 *   }),
 *   // Theme-abhängige Styles als Funktion
 *   (colors) => ({
 *     container: { backgroundColor: colors.backgroundPrimary },
 *     title: { color: colors.textPrimary }
 *   })
 * );
 * 
 * // In der Komponente verwenden:
 * function MyComponent() {
 *   const colors = useThemeColor();
 *   const styles = createScreenStyles(colors);
 *   
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.title}>Hallo Welt</Text>
 *     </View>
 *   );
 * }
 * ```
 * @param baseStyles Basis-Styles (unabhängig vom Theme)
 * @param themeDependentStyles Funktion, die Theme-abhängige Styles zurückgibt
 * @returns Funktion, die die kombinierten Styles basierend auf dem Theme zurückgibt
 */
export function createThemedStyles<T extends StylesType, C = any>(
  baseStyles: T,
  themeDependentStyles: (colors: C) => Partial<T>
) {
  return (colors: C) => {
    const themeStyles = themeDependentStyles(colors);
    return createStyles(baseStyles, themeStyles);
  };
}

/**
 * Extrahiert StyleProp<ViewStyle> aus einem Style-Objekt für typsichere View-Style-Weitergabe
 * @example
 * ```tsx
 * interface CardProps {
 *   style?: StyleProp<ViewStyle>;
 * }
 * 
 * function Card({ style }: CardProps) {
 *   return <View style={[styles.card, style]} />;
 * }
 * 
 * // In übergeordneter Komponente:
 * const parentStyles = StyleSheet.create({
 *   customCard: { margin: 10, elevation: 2 }
 * });
 * 
 * <Card style={viewStyle(parentStyles.customCard)} />
 * ```
 * @param style Das Style-Objekt, das als ViewStyle verwendet werden soll
 * @returns Das Style-Objekt als typisiertes ViewStyle
 */
export function viewStyle(style: StyleType): StyleProp<ViewStyle> {
  return style as StyleProp<ViewStyle>;
}

/**
 * Extrahiert StyleProp<TextStyle> aus einem Style-Objekt für typsichere Text-Style-Weitergabe
 * @example
 * ```tsx
 * interface LabelProps {
 *   style?: StyleProp<TextStyle>;
 * }
 * 
 * function Label({ style }: LabelProps) {
 *   return <Text style={[styles.label, style]} />;
 * }
 * 
 * // In übergeordneter Komponente:
 * const parentStyles = StyleSheet.create({
 *   customText: { fontWeight: 'bold', fontSize: 16 }
 * });
 * 
 * <Label style={textStyle(parentStyles.customText)} />
 * ```
 * @param style Das Style-Objekt, das als TextStyle verwendet werden soll
 * @returns Das Style-Objekt als typisiertes TextStyle
 */
export function textStyle(style: StyleType): StyleProp<TextStyle> {
  return style as StyleProp<TextStyle>;
}

/**
 * Extrahiert StyleProp<ImageStyle> aus einem Style-Objekt für typsichere Image-Style-Weitergabe
 * @example
 * ```tsx
 * interface CustomImageProps {
 *   style?: StyleProp<ImageStyle>;
 * }
 * 
 * function CustomImage({ style }: CustomImageProps) {
 *   return <Image style={[styles.image, style]} />;
 * }
 * 
 * // In übergeordneter Komponente:
 * const parentStyles = StyleSheet.create({
 *   roundedImage: { borderRadius: 25, width: 50, height: 50 }
 * });
 * 
 * <CustomImage style={imageStyle(parentStyles.roundedImage)} />
 * ```
 * @param style Das Style-Objekt, das als ImageStyle verwendet werden soll
 * @returns Das Style-Objekt als typisiertes ImageStyle
 */
export function imageStyle(style: StyleType): StyleProp<ImageStyle> {
  return style as StyleProp<ImageStyle>;
}

// Export aller Hilfsfunktionen
export const styleUtils = {
  createStyles,
  combineStyles,
  createThemedStyles,
  viewStyle,
  textStyle,
  imageStyle,
  withOpacity,
}; 