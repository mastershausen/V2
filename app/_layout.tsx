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

// App-Installation beim Start überprüfen
const APP_INSTALLATION_KEY = 'app_installation';

// Ignoriere bestimmte Warnungen
LogBox.ignoreLogs([
  'Constants.platform.ios.model has been deprecated',
  'The navigation state parsed',
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
        
        // Analytics-Service initialisieren
        await analyticsService.initAnalytics();
        logger.info('[App] Analytics-Service initialisiert');
        
        // Mindestens 1 Sekunde Verzögerung für bessere Benutzererfahrung
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!isMounted) return;
        
        logger.info('[App] Startvorbereitungen abgeschlossen');
        setAppReady(true);
        
        try {
          logger.info('[App] Versuche SplashScreen auszublenden...');
          await SplashScreen.hideAsync();
          logger.info('[App] SplashScreen erfolgreich ausgeblendet');
        } catch (splashError) {
          logger.warn('[App] Konnte SplashScreen nicht ausblenden', 
            splashError instanceof Error ? splashError.message : String(splashError)
          );
          // Fahre dennoch fort, auch wenn der SplashScreen nicht ausgeblendet werden konnte
        }
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
  
  if (!appReady) {
    logger.debug('[App] App noch nicht bereit, zeige leeres Layout');
    return null;
  }
  
  logger.info('[App] App bereit, zeige Hauptlayout');
  
  // Vereinfachtes Layout mit den erforderlichen Providern
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
