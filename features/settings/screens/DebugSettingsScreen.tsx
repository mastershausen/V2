import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { SettingsItem } from '@/features/settings/components/SettingsItem';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { useDebugSettings } from '@/features/settings/hooks/useDebugSettings';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Props für den DebugSettingsScreen
 */
export interface DebugSettingsProps {
  /** Callback zum Schließen des Screens */
  onClose: () => void;
}

/**
 * Debug-Einstellungen-Screen
 * 
 * Diese Komponente erlaubt es Entwicklern und Testern, verschiedene
 * Debug-Einstellungen vorzunehmen und den App-Zustand zu untersuchen.
 * 
 * Ermöglicht das Umschalten zwischen verschiedenen Benutzerrollen und anzeigen
 * von Debug-Informationen.
 * @param param0 - Komponenteneigenschaften vom Typ DebugSettingsProps
 * @param param0.onClose - Callback-Funktion zum Schließen des Screens
 * @returns Die Debug-Einstellungen-Komponente
 */
export default function DebugSettingsScreen({ onClose }: DebugSettingsProps) {
  const colors = useThemeColor();
  
  // Debug-Settings-Hook für alle benötigten Funktionen und Daten
  const {
    // Feature-Flags
    showRoleSwitcher,
    showDebugMenu,
    
    // App-Modus Informationen
    isDemoMode,
    appMode,
    userStatus,
    isDemoAccount,
    
    // Benutzer-Informationen
    currentRole,
    isAuthenticated,
    userId,
    
    // Funktionen
    handleChangeRole
  } = useDebugSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation title="Debug-Einstellungen" onBackPress={onClose} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App-Modus-Einstellungen */}
        <SettingsSection title="App-Modus" icon="flask-outline">
          <SettingsItem
            label="Debug-Menü aktiviert"
            icon="bug-outline"
            value={`${showDebugMenu ? "Ja" : "Nein"}`}
          />
          
          <SettingsItem
            label="Demo-Modus"
            icon="flask-outline"
            value={`${isDemoMode() ? "An" : "Aus"}`}
          />
        </SettingsSection>
      
        {/* Benutzerrollen-Einstellungen - nur anzeigen, wenn Feature-Flag aktiviert */}
        {showRoleSwitcher && (
          <SettingsSection title="Benutzerrolle" icon="people-outline">
            <SettingsItem
              label="Free-User"
              icon={currentRole === 'free' ? 'radio-button-on' : 'radio-button-off'}
              value="Kein Header möglich"
              onPress={() => handleChangeRole('free')}
            />
            
            <SettingsItem
              label="Pro-User"
              icon={currentRole === 'pro' ? 'radio-button-on' : 'radio-button-off'}
              value="Header (Bild/Video) möglich"
              onPress={() => handleChangeRole('pro')}
            />
            
            <SettingsItem
              label="Premium-User"
              icon={currentRole === 'premium' ? 'radio-button-on' : 'radio-button-off'}
              value="Header (Bild/Video) möglich"
              onPress={() => handleChangeRole('premium')}
            />
            
            <SettingsItem
              label="Admin-User"
              icon={currentRole === 'admin' ? 'radio-button-on' : 'radio-button-off'}
              value="Alle Rechte"
              onPress={() => handleChangeRole('admin')}
            />
          </SettingsSection>
        )}
        
        {/* App-Info */}
        <SettingsSection title="App-Informationen" icon="information-circle-outline">
          <SettingsItem
            label="App-Modus"
            value={appMode}
          />
          
          <SettingsItem
            label="User-Status"
            value={userStatus}
          />
          
          <SettingsItem
            label="Demo-Account"
            value={isDemoAccount ? "Ja" : "Nein"}
          />
          
          <SettingsItem
            label="Angemeldet"
            value={isAuthenticated ? "Ja" : "Nein"}
          />
          
          {userId && (
            <SettingsItem
              label="User ID"
              value={userId}
            />
          )}
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.m,
  },
}); 