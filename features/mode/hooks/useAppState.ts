/**
 * @file features/mode/hooks/useAppState.ts
 * @description Hook für App-Zustand-Verwaltung
 * 
 * Stellt einen Hook zur Verfügung, der den aktuellen Zustand der App überwacht
 * (Vordergrund, Hintergrund, inaktiv) und entsprechende Callback-Funktionen bereitstellt.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { logger } from '@/utils/logger';

/**
 * Typdefinition für das Ergebnis des useAppState-Hooks
 */
export interface AppStateResult {
  appState: AppStateStatus;
  lastState: AppStateStatus | null;
  isActive: boolean;
  isBackground: boolean;
  isInactive: boolean;
  onForeground: (callback: () => void) => () => void;
  onBackground: (callback: () => void) => () => void;
}

/**
 * Hook zur Überwachung des App-Zustands
 * @returns {AppStateResult} Aktueller App-Zustand und zugehörige Hilfsfunktionen
 */
export function useAppState(): AppStateResult {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [lastState, setLastState] = useState<AppStateStatus | null>(null);
  const appStateRef = useRef(AppState.currentState);
  
  const foregroundCallbacks = useRef<Array<() => void>>([]);
  const backgroundCallbacks = useRef<Array<() => void>>([]);
  
  /**
   * Registriert einen Callback, der ausgeführt wird, wenn die App in den Vordergrund kommt
   */
  const onForeground = useCallback((callback: () => void) => {
    foregroundCallbacks.current.push(callback);
    
    return () => {
      foregroundCallbacks.current = foregroundCallbacks.current.filter(cb => cb !== callback);
    };
  }, []);
  
  /**
   * Registriert einen Callback, der ausgeführt wird, wenn die App in den Hintergrund geht
   */
  const onBackground = useCallback((callback: () => void) => {
    backgroundCallbacks.current.push(callback);
    
    return () => {
      backgroundCallbacks.current = backgroundCallbacks.current.filter(cb => cb !== callback);
    };
  }, []);
  
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Speichere vorherigen Zustand
      const previousAppState = appStateRef.current;
      setLastState(previousAppState);
      
      // Aktualisiere den Zustand
      setAppState(nextAppState);
      appStateRef.current = nextAppState;
      
      // Protokollierung für Debugging
      logger.debug('App-Status geändert', { 
        from: previousAppState, 
        to: nextAppState 
      });
      
      // Führe registrierte Callbacks aus
      if (previousAppState.match(/inactive|background/) && nextAppState === 'active') {
        // App kam in den Vordergrund
        foregroundCallbacks.current.forEach(callback => {
          try {
            callback();
          } catch (error) {
            logger.error('Fehler in onForeground Callback', 
              error instanceof Error ? error.message : String(error)
            );
          }
        });
      } else if (previousAppState === 'active' && nextAppState.match(/inactive|background/)) {
        // App ging in den Hintergrund
        backgroundCallbacks.current.forEach(callback => {
          try {
            callback();
          } catch (error) {
            logger.error('Fehler in onBackground Callback', 
              error instanceof Error ? error.message : String(error)
            );
          }
        });
      }
    };
    
    // Registriere den Listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      // Entferne den Listener beim Unmount
      subscription.remove();
    };
  }, []);
  
  return {
    appState,
    lastState,
    isActive: appState === 'active',
    isBackground: appState === 'background',
    isInactive: appState === 'inactive',
    onForeground,
    onBackground
  };
} 