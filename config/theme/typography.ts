/**
 * Typografie-System für die Solvbox App
 * 
 * Definiert alle Schriftgrößen, -gewichte und -stile
 */
import { TextStyle } from 'react-native';

// Typdefinition für fontWeight-Werte, die von React Native unterstützt werden
type FontWeight = TextStyle['fontWeight'];

export const typography = {
  // Schriftfamilien
  fontFamily: {
    default: undefined, // System-Default (San Francisco auf iOS, Roboto auf Android)
    accent: undefined,  // Falls speziell benötigt
  },
  
  // Schriftgrößen
  fontSize: {
    xs: 10,
    s: 12,
    m: 14,
    l: 16,
    xl: 18,
    xxl: 20,
    title: 24,
    largeTitle: 32,
  },
  
  // Schriftgewichte mit expliziten String-Literalen
  fontWeight: {
    regular: '400' as FontWeight,
    medium: '500' as FontWeight,
    semiBold: '600' as FontWeight,
    bold: '700' as FontWeight,
  },
  
  // Zeilenhöhen
  lineHeight: {
    xs: 14,
    s: 18,
    m: 22,
    l: 24,
    xl: 28,
    xxl: 32,
    title: 32,
    largeTitle: 40,
  },
  
  // Vordefinierte Text-Stile
  styles: {
    title: {
      fontSize: 32,
      fontWeight: '700' as FontWeight, // bold
      lineHeight: 40,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 28,
    },
    heading: {
      fontSize: 18,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 24,
    },
    subheading: {
      fontSize: 16,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 22,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as FontWeight, // regular
      lineHeight: 24,
    },
    bodySemiBold: {
      fontSize: 16,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as FontWeight, // regular
      lineHeight: 18,
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 22,
    },
    smallText: {
      fontSize: 12,
      fontWeight: '400' as FontWeight, // regular
      lineHeight: 16,
    },
  },
}; 