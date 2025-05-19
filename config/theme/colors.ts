/**
 * Farbsystem für die Solvbox App
 * 
 * Definiert alle Farben für helles und dunkles Theme
 */

export const themeColors = {
  // Erweiterte Farbpalette - helles Theme
  light: {
    // Primärfarben
    primary: '#007AFF', // Blau als Hauptfarbe
    secondary: '#34C759', // Grün als Sekundärfarbe
    
    // Pastel-Varianten
    pastel: {
      primary: 'rgba(0, 122, 255, 0.15)', // Pastellversion der Primärfarbe
      primaryBorder: 'rgba(0, 122, 255, 0.5)', // Pastellversion für Ränder
      secondary: 'rgba(52, 199, 89, 0.15)', // Pastellversion der Sekundärfarbe
      secondaryBorder: 'rgba(52, 199, 89, 0.5)', // Pastellversion für Ränder
    },

    // Statusfarben
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FFCC00',
    info: '#0A7EA4',
    
    // Hintergrundvarianten
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#FFFFFF',
    
    // Trennlinien
    divider: '#E0E0E0',
    dividerLight: '#DDDDDD',
    
    // Text-Farben
    textPrimary: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Formularelemente
    inputBackground: '#FFFFFF',
    inputBorder: '#E0E0E0',
    inputText: '#333333',
    
    // Kartenelemente
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',

    // Overlay und Transparenzen
    overlay: {
      light: 'rgba(255, 255, 255, 0.8)',
      medium: 'rgba(255, 255, 255, 0.5)',
      dark: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Media Player
    mediaPlayer: {
      controlsBackground: 'rgba(0, 0, 0, 0.5)',
      controlsText: '#FFFFFF',
      controlsIcon: '#FFFFFF',
      playButtonBackground: 'rgba(0, 0, 0, 0.5)',
      sliderThumb: '#FFFFFF',
      sliderTrackActive: 'rgba(255, 255, 255, 0.8)',
      sliderTrackInactive: 'rgba(255, 255, 255, 0.5)',
      speedButtonBackground: 'rgba(255, 255, 255, 0.15)',
    },
    
    // UI-Elemente
    ui: {
      icon: '#333333',
      headerBackground: '#FFFFFF',
      headerText: '#333333',
      buttonBackground: '#007AFF',
      buttonText: '#FFFFFF',
      disabledBackground: '#CCCCCC',
      disabledText: '#666666',
    }
  },
  
  // Erweiterte Farbpalette - dunkles Theme
  dark: {
    // Primärfarben
    primary: '#007AFF', // Blau als Hauptfarbe für dunkles Theme
    secondary: '#30D158', // Angepasstes Grün für dunkles Theme
    
    // Pastel-Varianten für das dunkle Theme
    pastel: {
      primary: 'rgba(0, 122, 255, 0.25)', // Pastellversion der Primärfarbe (dunkler Modus)
      primaryBorder: 'rgba(0, 122, 255, 0.6)', // Pastellversion für Ränder (dunkler Modus)
      secondary: 'rgba(48, 209, 88, 0.25)', // Pastellversion der Sekundärfarbe (dunkler Modus)
      secondaryBorder: 'rgba(48, 209, 88, 0.6)', // Pastellversion für Ränder (dunkler Modus)
    },
    
    // Statusfarben
    success: '#30D158',
    error: '#FF453A',
    warning: '#FFD60A',
    info: '#64D2FF',
    
    // Hintergrundvarianten
    backgroundPrimary: '#151718',
    backgroundSecondary: '#1C1D1F',
    backgroundTertiary: '#2C2C2E',
    
    // Trennlinien
    divider: '#2C2C2E',
    dividerLight: '#3C3C3E',
    
    // Text-Farben
    textPrimary: '#ECEDEE',
    textSecondary: '#AEAEB2',
    textTertiary: '#8E8E93',
    
    // Formularelemente
    inputBackground: '#1C1D1F',
    inputBorder: '#2C2C2E',
    inputText: '#ECEDEE',
    
    // Kartenelemente
    cardBackground: '#1C1D1F',
    cardBorder: '#2C2C2E',

    // Overlay und Transparenzen
    overlay: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.05)',
      dark: 'rgba(0, 0, 0, 0.7)',
    },
    
    // Media Player
    mediaPlayer: {
      controlsBackground: 'rgba(0, 0, 0, 0.5)',
      controlsText: '#FFFFFF',
      controlsIcon: '#FFFFFF',
      playButtonBackground: 'rgba(0, 0, 0, 0.5)',
      sliderThumb: '#FFFFFF',
      sliderTrackActive: 'rgba(255, 255, 255, 0.8)',
      sliderTrackInactive: 'rgba(255, 255, 255, 0.5)',
      speedButtonBackground: 'rgba(255, 255, 255, 0.15)',
    },
    
    // UI-Elemente
    ui: {
      icon: '#ECEDEE',
      headerBackground: '#151718',
      headerText: '#ECEDEE',
      buttonBackground: '#007AFF',
      buttonText: '#ECEDEE',
      disabledBackground: '#2C2C2E',
      disabledText: '#8E8E93',
    }
  }
}; 