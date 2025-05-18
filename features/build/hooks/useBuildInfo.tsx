/**
 * @file features/build/hooks/useBuildInfo.tsx
 * @description React Hook und Komponente zur Anzeige von Build-Informationen
 * 
 * Diese Komponente zeigt Debug-Informationen zum Build an und kann
 * in Entwicklungsumgebungen aktiviert werden.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useBuildType } from './useBuildType';
import { BuildService } from '../services/BuildService';
import { ServiceRegistry, ServiceType } from '@/utils/service/serviceRegistry';
import { logger } from '@/utils/logger';

/**
 * Hilfsfunktion zum Abrufen des BuildService aus der ServiceRegistry
 */
function getBuildService(): BuildService {
  try {
    return ServiceRegistry.getInstance().getService<BuildService>(ServiceType.BUILD);
  } catch (error) {
    logger.error('[useBuildInfo] Fehler beim Abrufen des BuildService:', error instanceof Error ? error.message : String(error));
    // Fallback: Erstelle eine neue Instanz wenn der Service nicht gefunden wurde
    return new BuildService();
  }
}

/**
 * Hook für Debug-Informationen zum aktuellen Build
 * Gibt zusätzliche Informationen zurück, die für Debug-Zwecke nützlich sind
 */
export function useBuildInfo() {
  const buildInfo = useBuildType();
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => setExpanded(!expanded);
  
  // Sammle alle verfügbaren Debug-Informationen
  const debugInfo = {
    buildType: buildInfo.buildType,
    appMode: buildInfo.buildConfig.defaultMode,
    apiBase: buildInfo.buildConfig.apiBase,
    canSwitchMode: buildInfo.canSwitchAppMode,
    debugEnabled: buildInfo.isDebugEnabled,
    isDev: __DEV__,
    usesMockData: buildInfo.usesMockData,
    timestamp: new Date().toISOString(),
  };
  
  return {
    ...buildInfo,
    debugInfo,
    expanded,
    toggleExpanded,
  };
}

/**
 * Komponente zur Anzeige von Build-Informationen
 * Wird standardmäßig nur in Debug-Builds angezeigt, kann aber auch explizit aktiviert werden
 */
export function BuildInfoDisplay({ alwaysShow = false }) {
  const { debugInfo, expanded, toggleExpanded, isDebugEnabled, buildType } = useBuildInfo();
  
  // Nicht anzeigen, wenn weder Debug aktiviert ist noch explizit angefordert wurde
  if (!isDebugEnabled && !alwaysShow) {
    return null;
  }
  
  // Farbe basierend auf Build-Typ
  const getColorForBuildType = () => {
    switch (buildType) {
      case 'dev': return '#4CAF50'; // Grün
      case 'demo': return '#2196F3'; // Blau
      case 'staging': return '#FF9800'; // Orange
      case 'live': return '#F44336'; // Rot
      default: return '#9E9E9E'; // Grau
    }
  };
  
  return (
    <>
      <TouchableOpacity 
        style={[styles.indicator, { backgroundColor: getColorForBuildType() }]}
        onPress={toggleExpanded}
      >
        <Text style={styles.text}>{buildType.toUpperCase()}</Text>
      </TouchableOpacity>
      
      <Modal
        visible={expanded}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleExpanded}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Build-Informationen</Text>
            
            <ScrollView style={styles.infoScrollView}>
              {Object.entries(debugInfo).map(([key, value]) => (
                <View key={key} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{key}:</Text>
                  <Text style={styles.infoValue}>
                    {typeof value === 'boolean' ? (value ? 'Ja' : 'Nein') : String(value)}
                  </Text>
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={toggleExpanded}
            >
              <Text style={styles.closeButtonText}>Schließen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 40,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    opacity: 0.9,
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoScrollView: {
    maxHeight: 300,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 2,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 