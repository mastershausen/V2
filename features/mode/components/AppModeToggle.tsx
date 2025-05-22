/**
 * @file features/mode/components/AppModeToggle.tsx
 * @description Eine Komponente zum Umschalten zwischen Live- und Demo-Modus
 * 
 * Nutzt den modernen useMode-Hook für verbesserte Statusverwaltung
 * und bietet eine intuitive UI zum Moduswechsel mit Zustandsanzeige.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Text, TextStyle } from 'react-native';

import { useModeManager } from '@/features/mode/hooks/useModeManager';
import { useTheme } from '@/hooks/useTheme';
import { logger } from '@/utils/logger';

/**
 * Props für die AppModeToggle-Komponente
 */
interface AppModeToggleProps {
  /**
   * Optional: Text, der neben dem Toggle angezeigt wird
   */
  label?: string;
  
  /**
   * Optional: Callback, der bei erfolgreichem Moduswechsel aufgerufen wird
   */
  onModeChanged?: (newMode: 'demo' | 'live') => void;
  
  /**
   * Optional: Gibt an, ob der Toggle mit einem Rahmen angezeigt werden soll (veraltet)
   * @default false
   * @deprecated Wird für konsistentes Design nicht mehr verwendet
   */
  withBorder?: boolean;
  
  /**
   * Optional: Zusätzliche Styling-Klassen
   */
  style?: object;
}

/**
 * AppModeToggle - Komponente zum Umschalten zwischen Live- und Demo-Modus
 * 
 * Zeigt den aktuellen Modus an und ermöglicht das Umschalten mit visueller Rückmeldung
 * über den Wechselstatus und entsprechende Fehlerbehandlung.
 * @param {object} root0 - Die Props für die Komponente
 * @param {string} [root0.label] - Text, der neben dem Toggle angezeigt wird
 * @param {Function} [root0.onModeChanged] - Callback, der bei erfolgreichem Moduswechsel aufgerufen wird
 * @param {object} [root0.style] - Zusätzliche Styling-Klassen
 * @returns {React.ReactElement} Die gerenderte AppModeToggle-Komponente
 */
export function AppModeToggle({
  label,
  onModeChanged,
  style
}: AppModeToggleProps) {
  // App-Modus-Hook und Theme-Kontext verwenden
  const { colors } = useTheme();
  const {
    isDemoMode,
    isChangingMode: isTransitioning,
    switchToDemoMode,
    switchToLiveMode
  } = useModeManager();
  
  // Lokaler Status für Fehleranzeige
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Der aktuelle Modus als berechneter Wert für bessere Reaktionsfähigkeit
  const isCurrentlyDemoMode = isDemoMode();
  
  // Dynamische Styles basierend auf dem Theme und Props
  const dynamicStyles = useMemo(() => ({
    container: {
      backgroundColor: 'transparent'
    },
    label: {
      color: '#333333' // Einfacher, dunkler Text für beide Themes
    },
    errorText: {
      color: colors.error
    },
    modeBadge: {
      color: isCurrentlyDemoMode ? colors.primary : colors.primary, // Verwende Primärfarbe für Demo und Success für Live
      fontWeight: 'bold' as TextStyle['fontWeight'],
      backgroundColor: isCurrentlyDemoMode ? `${colors.primary}60` : `${colors.primary}60`, // 60% Opacity für maximalen Kontrast
      borderWidth: 1.5, // Dickerer Rahmen für mehr Sichtbarkeit
      borderColor: isCurrentlyDemoMode ? colors.primary : colors.primary,
      borderRadius: 16,
      overflow: 'hidden' as const,
      paddingHorizontal: 12,
      paddingVertical: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2, // Stärkerer Schatten
      shadowRadius: 2,
      elevation: 3
    }
  }), [colors, isCurrentlyDemoMode]);
  
  /**
   * Wechselt zwischen den Modi
   */
  const handleToggleMode = useCallback(async () => {
    if (isTransitioning) {
      return;
    }
    
    const currentDemoMode = isDemoMode();
    setErrorMessage(null);
    
    try {
      // Explizite Verzweigung basierend auf aktuellem Modus
      const result = currentDemoMode 
        ? await switchToLiveMode()
        : await switchToDemoMode();
      
      if (result.success) {
        const newModeName = currentDemoMode ? 'live' : 'demo';
        
        // Callback aufrufen, wenn vorhanden
        if (onModeChanged) {
          onModeChanged(newModeName as 'demo' | 'live');
        }
        
        logger.info(`AppModeToggle: Erfolgreich zum ${currentDemoMode ? 'Live' : 'Demo'}-Modus gewechselt`);
      } else if (result.requiresAuth) {
        // Wenn Authentifizierung erforderlich ist, zur Login-Seite navigieren
        logger.info('AppModeToggle: Authentifizierung für Live-Modus erforderlich, leite zum Login weiter');
        setErrorMessage('Authentifizierung erforderlich für Live-Modus');
        
        // Kurze Verzögerung, damit der Nutzer die Meldung sehen kann
        setTimeout(() => {
          import('expo-router').then(({ router }) => {
            router.push('/(auth)/login');
          });
        }, 1500);
      } else {
        setErrorMessage(`Fehler beim Wechsel: ${result.error || 'Unbekannter Fehler'}`);
        logger.warn('AppModeToggle: Fehler beim Moduswechsel', { error: result.error });
      }
    } catch (error) {
      setErrorMessage('Unerwarteter Fehler beim Moduswechsel');
      logger.error('AppModeToggle: Unerwarteter Fehler beim Moduswechsel', error instanceof Error ? error.message : String(error));
    }
  }, [isDemoMode, isTransitioning, switchToDemoMode, switchToLiveMode, onModeChanged]);
  
  return (
    <View style={[styles.outerContainer, style]}>
      <View style={[styles.container, dynamicStyles.container]}>
        {label && <Text style={[styles.label, dynamicStyles.label]}>{label}</Text>}
        
        {/* Dezentes Badge als Button */}
        <TouchableOpacity 
          onPress={handleToggleMode}
          disabled={isTransitioning}
          accessibilityLabel={`Wechseln zum ${isCurrentlyDemoMode ? 'Live' : 'Demo'}-Modus`}
          accessibilityRole="button"
        >
          <Text style={[styles.modeBadge, dynamicStyles.modeBadge]}>
            {isCurrentlyDemoMode ? 'Demo' : 'Live'}
          </Text>
        </TouchableOpacity>
        
        {/* Ladeindikator */}
        {isTransitioning && (
          <ActivityIndicator 
            size="small" 
            color={colors.primary} 
            style={styles.loadingIndicator}
          />
        )}
        
        {/* Fehleranzeige */}
        {errorMessage && (
          <Text style={[styles.errorText, dynamicStyles.errorText]}>
            {errorMessage}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 0 // Entfernt unnötigen Abstand
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 0 // Entfernt horizontales Padding
  },
  label: {
    marginRight: 12,
    fontSize: 16
  },
  modeBadge: {
    fontSize: 14,
    textAlign: 'center'
  },
  loadingIndicator: {
    marginLeft: 8
  },
  errorText: {
    marginLeft: 8,
    fontSize: 12
  }
}); 