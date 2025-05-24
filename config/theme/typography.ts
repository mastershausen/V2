/**
 * Typografie-System für die Solvbox App
 * 
 * Definiert alle Schriftgrößen, -gewichte und -stile
 * Verwendet San Francisco auf allen Plattformen
 */
import { TextStyle, Platform } from 'react-native';

// Typdefinition für fontWeight-Werte, die von React Native unterstützt werden
type FontWeight = TextStyle['fontWeight'];

export const typography = {
  // Schriftfamilien - San Francisco für alle Plattformen
  fontFamily: {
    default: Platform.select({
      ios: 'San Francisco',
      android: 'SF Pro Display', // Falls verfügbar, sonst System-Default
      default: undefined
    }),
    accent: Platform.select({
      ios: 'San Francisco',
      android: 'SF Pro Display',
      default: undefined
    }),
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
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 28,
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
    heading: {
      fontSize: 18,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 24,
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
    subheading: {
      fontSize: 16,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 22,
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as FontWeight, // regular
      lineHeight: 24,
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
    bodySemiBold: {
      fontSize: 16,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 24,
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as FontWeight, // regular
      lineHeight: 18,
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: '600' as FontWeight, // semiBold
      lineHeight: 22,
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
    smallText: {
      fontSize: 12,
      fontWeight: '400' as FontWeight, // regular
      lineHeight: 16,
      fontFamily: Platform.select({
        ios: 'San Francisco',
        android: 'SF Pro Display',
        default: undefined
      }),
    },
  },
}; 