/**
 * @file app/_layout.tsx
 * @description Vereinfachte Root-Layout-Komponente für Development Client
 */

import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { logger } from '@/utils/logger';

// Ignoriere bestimmte Warnungen
LogBox.ignoreLogs([
  'Constants.platform.ios.model has been deprecated',
  'The navigation state parsed',
  'Unable to resolve module',
  './vendor/react-native-vector-icons'
]);

/**
 * Vereinfachte Root-Layout-Komponente für Development Client
 */
export default function RootLayout() {
  useEffect(() => {
    logger.info('[App] App gestartet - vereinfachte Version für Development Client');
  }, []);
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
