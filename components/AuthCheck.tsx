/**
 * @file components/AuthCheck.tsx
 * @description Optimierte Auth-Check-Komponente nach Gold Standard 4.1
 * 
 * Die Komponente prüft den Authentifizierungsstatus und stellt sicher, dass der Benutzer
 * zur richtigen Route weitergeleitet wird. Sie nutzt den optimierten useAuthNavigation-Hook
 * für zuverlässige Navigationszustände und sanfte Übergänge zwischen Auth-Zuständen.
 * 
 * HINWEIS: Für Testzwecke wurde die Umleitung deaktiviert, sodass der Benutzer immer
 * als authentifiziert gilt und keine Umleitung erfolgt.
 */

import { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthNavigation, NavigationRoutes } from '@/features/auth/hooks/useAuthNavigation';
import { ThemedText as Text } from '@/shared-components/theme/ThemedText';
import { logger } from '@/utils/logger';

// Typ aus dem useAuthNavigation-Hook für Route-Definitionen
type ValidRoute = Parameters<ReturnType<typeof useAuthNavigation>['navigateTo']>[0];

/**
 * Props für die AuthCheck-Komponente
 */
interface AuthCheckProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectIfUnauthenticated?: boolean;
  customRedirectPath?: string;
  enableLoadingScreen?: boolean;
}

/**
 * Optimierte AuthCheck-Komponente
 * 
 * Prüft Authentifizierungsstatus und leitet bei Bedarf weiter, mit verbessertem
 * Übergang zwischen den Zuständen und Vermeidung von Flackern.
 * 
 * HINWEIS: Für Testzwecke wurde die Umleitung deaktiviert.
 */
export function AuthCheck({
  children,
  redirectIfAuthenticated = false,
  redirectIfUnauthenticated = false,
  customRedirectPath,
  enableLoadingScreen = true
}: AuthCheckProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  const colors = useThemeColor();
  const backgroundColor = colors.backgroundPrimary;
  const textColor = colors.textPrimary;
  
  // Auth-Navigation mit benutzerdefinierten Routen falls angegeben
  const customRoutes: Partial<NavigationRoutes> | undefined = customRedirectPath 
    ? { 
        authenticatedRoute: customRedirectPath as ValidRoute,
        authRoute: customRedirectPath as ValidRoute
      } 
    : undefined;
  
  // Automatische Navigation deaktivieren, um manuelle Kontrolle zu haben
  const { 
    navigateTo,
    navigateToDashboard,
    navigateToLogin,
    isNavigating,
    inAuthGroup
  } = useAuthNavigation({ 
    routes: customRoutes,
    navigationDelay: 200
  });
  
  /**
   * Zeigt den Ladebildschirm für eine kurze Zeit an, um Flackern zu vermeiden
   */
  const hideLoadingWithDelay = useCallback(() => {
    const delay = 300; // Kurze Verzögerung für sanften Übergang
    setTimeout(() => setShowLoading(false), delay);
  }, []);
  
  /**
   * Hauptlogik für die Authentifizierungsprüfung und Navigation
   * HINWEIS: Für Testzwecke wurde die Umleitung deaktiviert.
   */
  useEffect(() => {
    // Während des Ladens keinen Redirect durchführen
    if (isLoading) {
      return;
    }
    
    // Wenn Navigation bereits läuft, nicht unterbrechen
    if (isNavigating) {
      return;
    }

    // DEAKTIVIERT FÜR TESTZWECKE: Umleitung für authentifizierte Benutzer
    // if (isAuthenticated && redirectIfAuthenticated) {
    //   logger.debug('AuthCheck: Authentifizierter Benutzer wird umgeleitet', { inAuthGroup });
    //   navigateToDashboard();
    //   return;
    // }
    
    // DEAKTIVIERT FÜR TESTZWECKE: Umleitung für nicht-authentifizierte Benutzer
    // if (!isAuthenticated && redirectIfUnauthenticated) {
    //   logger.debug('AuthCheck: Nicht-authentifizierter Benutzer wird umgeleitet', { inAuthGroup });
    //   navigateToLogin();
    //   return;
    // }
    
    // Wenn keine Umleitung nötig ist, Ladebildschirm ausblenden
    hideLoadingWithDelay();
  }, [
    isLoading, isAuthenticated, redirectIfAuthenticated,
    redirectIfUnauthenticated, navigateToDashboard, 
    navigateToLogin, isNavigating, inAuthGroup, hideLoadingWithDelay
  ]);

  // Debug-Informationen in der Entwicklung anzeigen
  if (__DEV__ && false) { // Auf false gesetzt, um in der Produktion nicht zu erscheinen
    console.log('AuthCheck Debug:', {
      isAuthenticated,
      isLoading,
      inAuthGroup,
      isNavigating
    });
  }
  
  // Ladebildschirm anzeigen, wenn aktiviert und im Ladezustand
  if (enableLoadingScreen && (isLoading || showLoading)) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
        <Text style={styles.loadingText}>Überprüfe Anmeldestatus...</Text>
      </View>
    );
  }
  
  // Kinder-Komponenten rendern, wenn keine Umleitung nötig ist
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.m,
  },
  loadingText: {
    marginTop: spacing.m,
    textAlign: 'center',
  }
}); 