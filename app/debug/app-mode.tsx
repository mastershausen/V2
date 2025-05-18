/**
 * app/debug/app-mode.tsx
 * 
 * Debug-Bildschirm zur Anzeige und Verwaltung des App-Modus.
 * 
 * Hinweis: Diese Datei wird NUR im DevBuild kompiliert und ist in den
 * ProductionBuilds (Demo und Live) nicht verfügbar.
 */

import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

// Import des ModeService für direkten Zugriff
import { callIfFunction } from '@/automated_fixes/callIfFunction';
import { isDemoMode } from '@/config/app/env';
import { AppModeToggle } from '@/features/mode/components';
import { useMode , useModeManager } from '@/hooks';
// Verwende ThemedButton statt Button
import { ThemedButton as Button } from '@/shared-components/theme/ThemedButton';

import { InfoItem } from './components/InfoItem';

/**
 * Debug-Bildschirm zur Anzeige und Verwaltung des App-Modus
 * 
 * Ermöglicht detaillierte Einblicke in den aktuellen App-Modus und
 * die Möglichkeit, diesen zu ändern und zu testen.
 */
export default function AppModeScreen() {
  // Zugriff auf den neuen Modus-Hook für umfassende Informationen
  const mode = useMode();
  
  // Legacy-Hook für zusätzliche Informationen
  const modeManager = useModeManager();

  /**
   * Funktion zum Umschalten des App-Modus
   */
  const toggleAppMode = useCallback(async () => {
    await mode.toggleAppMode();
  }, [mode]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App-Modus Debug</Text>
        <Text style={styles.description}>
          Diese Seite zeigt den aktuellen Modus der App an und ermöglicht das Umschalten.
        </Text>
      </View>

      {/* Basis-Informationen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.infoGrid}>
          {/* Direkter Aufruf der Funktion vs. Hook-Eigenschaften */}
          <InfoItem label="isDemoMode()" value={String(callIfFunction(isDemoMode))} />
          <InfoItem label="useMode.isDemoMode()" value={String(mode.isDemoMode())} />
          <InfoItem label="useModeManager.isDemoMode()" value={String(modeManager.isDemoMode())} />

          {/* Zusätzliche Statuswerte */}
          <InfoItem label="mode.appMode" value={mode.currentAppMode} />
          <InfoItem label="mode.userStatus" value={mode.currentUserMode} />
          <InfoItem label="mode.isDemoAccount" value={String(mode.isDemoAccount)} />
          <InfoItem label="mode.isChangingMode" value={String(mode.isChangingMode)} />
          <InfoItem label="mode.usesMockData" value={String(mode.usesMockData)} />
          <InfoItem label="mode.canSwitchModes" value={String(mode.canSwitchModes)} />
        </View>
      </View>

      {/* Steuerung */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Steuerung</Text>
        
        <Text style={styles.subsectionTitle}>Standard-Schaltfläche</Text>
        <AppModeToggle onModeChanged={() => console.log('Modus geändert')} />
        
        <Text style={styles.subsectionTitle}>Direkter Toggle</Text>
        <Button 
          label={`Zu ${mode.isDemoMode() ? 'Live' : 'Demo'}-Modus wechseln`}
          onPress={toggleAppMode}
          variant="secondary"
          style={styles.button}
          icon="repeat"
        />
      </View>

      {/* Fehler-Informationen */}
      {mode.lastError && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Letzter Fehler</Text>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{mode.lastError}</Text>
          </View>
          <Button 
            label="Fehler zurücksetzen"
            onPress={mode.resetModeError}
            variant="secondary"
            style={styles.button}
          />
        </View>
      )}
    </ScrollView>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  infoGrid: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 12,
  },
  button: {
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
  }
}); 