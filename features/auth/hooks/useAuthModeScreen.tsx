/**
 * @file features/auth/hooks/useAuthModeScreen.tsx
 * @description Hook für die Anzeige von Modus-Informationen in Auth-Screens
 * 
 * Ermöglicht die einfache Integration des AppModeToggle in Anmeldebildschirmen
 * mit kontextsensitiven Informationen zum aktuellen Modus und dessen Auswirkungen.
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { AppModeToggle } from '@/features/mode/components';
import { useModeManager } from '@/hooks';
import { useTheme } from '@/hooks/useTheme';


/**
 * Hook, der UI-Elemente und Logik für die Modus-Anzeige in Auth-Screens bereitstellt
 * 
 * Kombiniert den AppModeToggle mit kontextsensitiven Hinweisen und Aktionen,
 * sodass Benutzer den App-Modus direkt in den Auth-Screens verwalten können.
 * @returns {object} UI-Elemente und Status-Informationen für Auth-Screens
 */
export function useAuthModeScreen() {
  const { colors } = useTheme();
  
  const { 
    isDemoMode, 
    isLiveMode,
    isSessionValid,
  } = useModeManager();
  
  /**
   * Callback für Moduswechsel-Ereignisse
   */
  const handleModeChanged = useCallback(() => {
    // Hier könnten zusätzliche Aktionen nach dem Moduswechsel erfolgen,
    // z.B. automatische Navigation oder UI-Updates
  }, []);
  
  /**
   * Modus-bezogene Beschreibung für den aktuellen Kontext
   */
  const modeDescription = useMemo(() => {
    if (isDemoMode) {
      return 'Du befindest dich im Demo-Modus. Hier kannst du die App ohne Registrierung testen.';
    } else if (isLiveMode && isSessionValid) {
      return 'Du bist im Live-Modus und bereits angemeldet. Du kannst dich einloggen oder den Demo-Modus wählen.';
    } else {
      return 'Im Live-Modus kannst du dich mit deinem Konto anmelden oder ein neues erstellen.';
    }
  }, [isDemoMode, isLiveMode, isSessionValid]);
  
  /**
   * Modus-Information-Component für Auth-Screens
   */
  const ModeInfoComponent = useMemo(() => {
    return (
      <View style={styles.modeInfoContainer}>
        <AppModeToggle 
          label="App-Modus" 
          onModeChanged={handleModeChanged}
          withBorder={true}
          style={styles.toggle}
        />
        <Text style={[styles.modeDescription, { color: colors.textSecondary }]}>
          {modeDescription}
        </Text>
      </View>
    );
  }, [colors.textSecondary, modeDescription, handleModeChanged]);
  
  /**
   * Rendert die Modus-Info als Footer-Komponente
   */
  const renderModeFooter = useCallback(() => {
    return ModeInfoComponent;
  }, [ModeInfoComponent]);
  
  return {
    ModeInfoComponent,
    renderModeFooter,
    isDemoMode,
    isLiveMode
  };
}

const styles = StyleSheet.create({
  modeInfoContainer: {
    marginTop: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  toggle: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  modeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  }
}); 