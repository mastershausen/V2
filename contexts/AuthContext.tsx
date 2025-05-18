/**
 * @file contexts/AuthContext.tsx
 * @description Aktualisierter Authentifizierungskontext, der den Goldstandard-konformen useAuth-Hook verwendet.
 * Fungiert als Wrapper, um den Hook im gesamten App-Baum verfügbar zu machen.
 */

import React, { createContext, useContext } from 'react';

import { useAuth as useAuthHook, UseAuthResult } from '../hooks/useAuth';

// Erstelle den Auth-Kontext mit dem Typ aus dem Hook
const AuthContext = createContext<UseAuthResult | undefined>(undefined);

// Provider-Props
interface AuthProviderProps {
  children: React.ReactNode;
  onInitialized?: () => void;
}

/**
 * AuthProvider - Zentrale Komponente für die Authentifizierung
 *
 * Stellt Authentifizierungsstatus und -funktionen für die gesamte App bereit.
 * Diese Version verwendet den refaktorierten useAuth-Hook nach dem Goldstandard.
 * @param {object} props - Die Component-Props
 * @param {React.ReactNode} props.children - Die Kind-Komponenten, die vom Auth-Kontext umschlossen werden
 * @param {Function} [props.onInitialized] - Optionaler Callback, der nach der Initialisierung aufgerufen wird
 * @returns {React.ReactElement} Die Auth-Provider-Komponente
 */
export function AuthProvider({ children, onInitialized }: AuthProviderProps) {
  // Verwende den nach Goldstandard refaktorierten useAuth-Hook
  const auth = useAuthHook();
  
  // Wenn onInitialized bereitgestellt wurde, rufe es auf
  // In einer erweiterten Version könnte hier ein useEffect mit einer Initialisierungslogik stehen
  React.useEffect(() => {
    if (onInitialized) {
      onInitialized();
    }
  }, [onInitialized]);
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - Hook für einfachen Zugriff auf den Auth-Kontext
 * @returns {UseAuthResult} Der Auth-Kontext mit Status und Funktionen
 * @throws {Error} Fehler, wenn außerhalb eines AuthProviders verwendet
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  
  return context;
} 