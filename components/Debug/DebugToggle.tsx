import React, { useEffect, useState } from 'react';
import { Switch, Text, View, StyleSheet } from 'react-native';


import { isDevelopmentMode } from '@/config/app/env';
import { BuildService } from '@/features/build/services/BuildService';
import { useModeStore } from '@/features/mode/stores';
import { switchAppMode } from '@/services/auth';
import { logger } from '@/utils/logger';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';

/**
 * Hilfsfunktion zum Abrufen des BuildService aus der ServiceRegistry
 */
function getBuildService(): BuildService {
  try {
    return ServiceRegistry.getInstance().getService<BuildService>(ServiceType.BUILD);
  } catch (error) {
    logger.error('[DebugToggle] Fehler beim Abrufen des BuildService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new BuildService();
  }
}

/**
 * Debug-Toggle-Komponente, die einen Switch zum Umschalten des App-Modus im Development-Build anzeigt.
 * Diese Komponente ist nur sichtbar, wenn die App im Development-Modus läuft.
 * 
 * Aktualisierte Version, die den neuen modeStore verwendet.
 */
export function DebugToggle() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Nur im Development-Modus anzeigen und Zustand laden
    if (!isDevelopmentMode() || !getBuildService().isDevBuild()) {
      return;
    }

    // Beim ersten Rendern den aktuellen Status aus dem ModeStore laden
    const checkModeStatus = async () => {
      try {
        const modeStore = useModeStore.getState();
        setIsDemoMode(modeStore.appMode === 'demo');
        setIsVisible(true);
      } catch (error) {
        logger.error('Fehler beim Laden des App-Modus:', error instanceof Error ? error.message : String(error));
      }
    };

    checkModeStatus();
    
    // Event-Handler für Modus-Änderungen registrieren
    const unsubscribe = useModeStore.subscribe((state) => {
      // Bei Änderungen des Modus den lokalen State aktualisieren
      setIsDemoMode(state.appMode === 'demo');
    });

    return () => {
      // Event-Handler entfernen
      unsubscribe();
    };
  }, []);

  // Toggle-Handler: Wechselt zwischen Demo- und Live-Modus
  const toggleAppMode = async () => {
    try {
      const targetMode = isDemoMode ? 'live' : 'demo';
      logger.info(`[DebugToggle] Wechsle zu ${targetMode}-Modus`);
      
      // Verwende den zentralen switchAppMode-Service
      const result = await switchAppMode(targetMode);
      
      if (result.success) {
        logger.info(`[DebugToggle] Erfolgreich zu ${targetMode}-Modus gewechselt`);
      } else {
        logger.error(`[DebugToggle] Fehler beim Wechsel zu ${targetMode}-Modus:`, result.error);
      }
      
    } catch (error) {
      logger.error('Fehler beim Umschalten des App-Modus:', error instanceof Error ? error.message : String(error));
    }
  };

  // Component nur im Development-Build und -Modus rendern
  if (!isDevelopmentMode() || !getBuildService().isDevBuild()) {
    return null;
  }

  // Komponente nur anzeigen, wenn sichtbar (nach dem ersten Laden)
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Demo-Modus:</Text>
        <Switch
          value={isDemoMode}
          onValueChange={toggleAppMode}
          testID="debug-mode-toggle"
        />
      </View>
      
      <Text style={styles.currentMode}>
        Aktueller Modus: <Text style={styles.highlight}>{isDemoMode ? 'Demo' : 'Live'}</Text>
      </Text>

      <Text style={styles.hint}>
        ℹ️ Diese Kontrolle ist nur im DevBuild sichtbar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  currentMode: {
    fontSize: 14,
    marginBottom: 8,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default DebugToggle; 