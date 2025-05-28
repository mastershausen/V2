/**
 * @file app/_layout.tsx
 * @description Root-Layout-Komponente für die gesamte App
 * 
 * Optimierte Version mit verbessertem AuthCheck für zuverlässige Auth-Übergänge.
 * Implementiert eine zentrale Layout-Struktur für die App und konfiguriert Provider.
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {useEffect, useState} from 'react';
import { LogBox } from 'react-native';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { analyticsService } from '@/services/analytics';
import { logger } from '@/utils/logger';
import bootstrapServices from '@/utils/service/initServices';
import { CustomSplashScreen } from '@/shared-components/splash/CustomSplashScreen';
import { setupAutoAuth } from '@/utils/autoAuth';

// App-Installation beim Start überprüfen
const APP_INSTALLATION_KEY = 'app_installation';

// Ignoriere bestimmte Warnungen
LogBox.ignoreLogs([
  'Constants.platform.ios.model has been deprecated',
  'The navigation state parsed',
  'Unable to resolve module',
  './vendor/react-native-vector-icons'
]);

// SplashScreen vorhalten, bis das Layout vollständig geladen ist
SplashScreen.preventAutoHideAsync().catch(error => {
  logger.error('Fehler beim Verhindern des automatischen Ausblendens des SplashScreens', 
    error instanceof Error ? error.message : String(error)
  );
});

/**
 * Root-Layout-Komponente
 * Verbesserte Version für zuverlässigere Navigation
 */
export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(false);
  
  // Verbesserte Initialisierungslogik mit mehr Fehlerbehandlung
  useEffect(() => {
    let isMounted = true;

    async function prepare() {
      try {
        logger.info('[App] Initialisiere App...');
        
        // Initialisiere Services vor allem anderen
        logger.info('[App] Starte Service-Initialisierung...');
        await bootstrapServices();
        logger.info('[App] Service-Initialisierung abgeschlossen');
        
        // AUTO-AUTH: Benutzer automatisch anmelden (für Testzwecke)
        logger.info('[App] Auto-Auth: Benutzer wird automatisch angemeldet...');
        await setupAutoAuth();
        logger.info('[App] Auto-Auth: Benutzer erfolgreich angemeldet');
        
        // Analytics-Service initialisieren
        await analyticsService.initAnalytics();
        logger.info('[App] Analytics-Service initialisiert');
        
        // Expo SplashScreen ausblenden und den benutzerdefinierten Splashscreen anzeigen
        try {
          logger.info('[App] Versuche Expo SplashScreen auszublenden...');
          await SplashScreen.hideAsync();
          if (isMounted) {
            setShowCustomSplash(true);
          }
          logger.info('[App] Expo SplashScreen erfolgreich ausgeblendet');
        } catch (splashError) {
          logger.warn('[App] Konnte Expo SplashScreen nicht ausblenden', 
            splashError instanceof Error ? splashError.message : String(splashError)
          );
          // Trotzdem Custom Splash anzeigen
          if (isMounted) {
            setShowCustomSplash(true);
          }
        }
        
        // Der benutzerdefinierte Splashscreen wird sich selbst ausblenden,
        // sobald seine Animation abgeschlossen ist
      } catch (error) {
        logger.error('[App] Fehler beim Initialisieren der App:', 
          error instanceof Error ? error.message : String(error)
        );
        
        if (isMounted) {
          // Bei Fehlern trotzdem fortfahren, damit die App nicht stecken bleibt
          setAppReady(true);
          SplashScreen.hideAsync().catch(e => {
            logger.error('[App] Fehler beim Ausblenden des SplashScreens nach Fehler:', String(e));
          });
        }
      }
    }
    
    prepare();
    
    // Cleanup beim App-Herunterfahren
    return () => {
      isMounted = false;
      analyticsService.shutdownAnalytics();
      logger.info('[App] Analytics-Service heruntergefahren');
    };
  }, []);
  
  // Callback für wenn der benutzerdefinierte Splashscreen fertig ist
  const handleSplashComplete = () => {
    setShowCustomSplash(false);
    setAppReady(true);
  };
  
  // Einfaches Layout OHNE GestureHandler
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <CustomSplashScreen 
          isVisible={showCustomSplash} 
          onAnimationComplete={handleSplashComplete} 
        />
        {appReady && <Slot />}
      </AuthProvider>
    </ThemeProvider>
  );
}
