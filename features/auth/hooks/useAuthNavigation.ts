/**
 * @file features/auth/hooks/useAuthNavigation.ts
 * @description Vereinfachter Navigations-Hook für Auth-Flows
 * 
 * Stellt React-Hook für die Navigation zwischen Authentifizierungsbildschirmen bereit.
 * Bietet stabile Referenzen durch useCallback und trennt UI-Logik von der Navigation.
 */

import { useRouter, useSegments } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { logger } from '@/utils/logger';
import Routes from '@/constants/routes';

// Gültige Routentypen aus Expo Router
type ValidRoute = Parameters<ReturnType<typeof useRouter>['replace']>[0];

/**
 * Interface für Navigationsrouten nach Auth-Zuständen
 */
export interface NavigationRoutes {
  // Route, zu der nicht-authentifizierte Benutzer geleitet werden
  authRoute: ValidRoute;
  // Route, zu der authentifizierte Benutzer geleitet werden
  authenticatedRoute: ValidRoute;
  // Route für den Splash-Screen oder initiale App-Anzeige
  initialRoute?: ValidRoute;
}

/**
 * Optionen für den useAuthNavigation Hook
 */
export interface UseAuthNavigationOptions {
  // Routen-Konfiguration
  routes?: Partial<NavigationRoutes>;
  // Verzögerung in ms nach der Navigation bei Statusänderungen
  navigationDelay?: number;
}

// Standardrouten für die Auth-Navigation
const DEFAULT_ROUTES: NavigationRoutes = {
  authRoute: '/(auth)/login' as ValidRoute,
  authenticatedRoute: '/(tabs)/home' as ValidRoute,
  initialRoute: '/' as ValidRoute // Root-Route (Splash-Screen)
};

/**
 * Typensichere Funktion, die prüft, ob der Nutzer sich im Auth-Bereich befindet
 */
function isInAuthGroup(segments: readonly string[]): boolean {
  return segments.includes('(auth)');
}

/**
 * Typensichere Funktion, die prüft, ob der Nutzer sich auf dem Splash-Screen befindet
 */
function isOnInitialRoute(segments: readonly string[]): boolean {
  return segments.length === 0 || (segments.length === 1 && segments[0] === '');
}

/**
 * Hook für die Navigation zwischen Authentifizierungsbildschirmen
 * 
 * Stellt Funktionen bereit, um zwischen verschiedenen Authentifizierungsscreens zu navigieren,
 * wie Login, Registrierung und Passwort zurücksetzen. Alle Funktionen werden mit useCallback
 * memoiziert, um stabile Referenzen zu gewährleisten.
 * 
 * @returns {Object} Navigationsfunktionen für Authentifizierungs-Flows
 */
export function useAuthNavigation(options: UseAuthNavigationOptions = {}) {
  const { 
    routes: customRoutes = {}, 
    navigationDelay = 100,
  } = options;
  
  const routes = { ...DEFAULT_ROUTES, ...customRoutes };
  const router = useRouter();
  const segments = useSegments();
  
  // Navigation-Tracking
  const [lastNavigation, setLastNavigation] = useState<ValidRoute | null>(null);
  const navigationInProgress = useRef(false);
  const navigationTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Aktuelle Position basierend auf Segments
  const inAuthGroup = isInAuthGroup(segments);
  const onInitialRoute = isOnInitialRoute(segments);
  
  /**
   * Navigiert sicher zur angegebenen Route
   */
  const navigateTo = useCallback((route: ValidRoute, immediate = false) => {
    // Gleiche Navigation nicht wiederholen
    if (lastNavigation === route || navigationInProgress.current) {
      return;
    }
    
    // Navigation als "in Bearbeitung" markieren
    navigationInProgress.current = true;
    
    // Navigationstimer bereinigen, falls aktiv
    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
      navigationTimer.current = null;
    }
    
    const executeNavigation = () => {
      try {
        logger.debug(`🧭 Navigation zu: ${route}`, { 
          currentRoute: segments.join('/'),
        });
        
        // Route wechseln
        router.replace(route);
        
        // Navigation als abgeschlossen markieren
        setLastNavigation(route);
      } catch (error) {
        logger.error(`🔴 Navigationsfehler zu ${route}:`, 
          error instanceof Error ? error.message : String(error)
        );
      } finally {
        // Navigation als "nicht in Bearbeitung" markieren
        navigationInProgress.current = false;
      }
    };
    
    // Navigation sofort oder mit Verzögerung ausführen
    if (immediate) {
      executeNavigation();
    } else {
      navigationTimer.current = setTimeout(executeNavigation, navigationDelay);
    }
  }, [router, segments, lastNavigation, navigationDelay]);
  
  /**
   * Navigiert zum Login-Bildschirm
   */
  const navigateToLogin = useCallback(() => {
    router.replace(Routes.AUTH.LOGIN);
  }, [router]);
  
  /**
   * Navigiert zum Registrierungs-Bildschirm
   */
  const navigateToRegister = useCallback(() => {
    router.replace(Routes.AUTH.REGISTER);
  }, [router]);
  
  /**
   * Navigiert zum Passwort-Zurücksetzen-Bildschirm
   */
  const navigateToForgotPassword = useCallback(() => {
    router.navigate(Routes.AUTH.FORGOT_PASSWORD);
  }, [router]);
  
  /**
   * Navigiert zum Passwort-Bestätigungs-Bildschirm
   * 
   * @param {string} email - Die E-Mail-Adresse, für die das Passwort zurückgesetzt wird
   */
  const navigateToResetPasswordConfirmation = useCallback((email: string) => {
    // Da wir keine spezielle Route für die Passwortzurücksetzungsbestätigung haben,
    // navigieren wir zum allgemeinen Passwort-vergessen Bildschirm
    // und speichern ggf. die E-Mail im State oder localStorage für spätere Verwendung
    router.navigate(Routes.AUTH.FORGOT_PASSWORD);
    // E-Mail könnte alternativ durch einen globalen State oder SessionStorage weitergegeben werden
  }, [router]);
  
  /**
   * Navigiert zum Dashboard (nach erfolgreicher Authentifizierung)
   */
  const navigateToDashboard = useCallback(() => {
    router.replace(Routes.TABS.HOME);
  }, [router]);
  
  return {
    // Aktuelle Navigation-Zustände
    inAuthGroup,
    onInitialRoute,
    isNavigating: navigationInProgress.current,
    lastNavigatedRoute: lastNavigation,
    
    // Navigation-Aktionen
    navigateTo,
    navigateToLogin,
    navigateToRegister,
    navigateToForgotPassword,
    navigateToResetPasswordConfirmation,
    navigateToDashboard,
  };
} 