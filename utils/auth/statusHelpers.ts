/**
 * @file utils/auth/statusHelpers.ts
 * @description Hilfsfunktionen für AuthStatus-Konvertierungen
 * 
 * Diese Datei enthält Hilfsfunktionen zum Konvertieren zwischen den verschiedenen
 * AuthStatus-Formaten, die im Projekt verwendet werden. Sie ermöglicht
 * die Interoperabilität zwischen dem komplexen Objekt-Typ und dem String-Literal-Typ.
 */

/**
 * Typdefinitionen innerhalb dieser Datei, um Importprobleme zu vermeiden
 */
export interface AuthenticatedStatus {
  type: 'authenticated';
  userId: string;
  timestamp: number;
}

export interface UnauthenticatedStatus {
  type: 'unauthenticated';
  reason?: 'logout' | 'expired' | 'initial' | 'demo';
  timestamp: number;
}

export interface LoadingStatus {
  type: 'loading';
  timestamp: number;
}

export type AuthStatus = AuthenticatedStatus | UnauthenticatedStatus | LoadingStatus;

/**
 * Extrahiert den String-Literal-Typ aus einem komplexen AuthStatus-Objekt
 * @param status Das komplexe AuthStatus-Objekt
 * @returns Der String-Literal-Typ 'authenticated', 'unauthenticated' oder 'loading'
 */
export function getAuthStatusType(status: AuthStatus): 'authenticated' | 'unauthenticated' | 'loading' {
  return status.type;
}

/**
 * Erstellt ein komplexes AuthStatus-Objekt aus einem String-Literal-Typ
 * @param type Der String-Literal-Typ ('authenticated', 'unauthenticated', 'loading')
 * @param userId Optional: Die Benutzer-ID (nur benötigt für 'authenticated')
 * @returns Ein komplexes AuthStatus-Objekt
 */
export function createAuthStatus(
  type: 'authenticated' | 'unauthenticated' | 'loading',
  userId?: string
): AuthStatus {
  const timestamp = Date.now();

  if (type === 'authenticated') {
    if (!userId) {
      throw new Error('userId ist erforderlich für authenticated Status');
    }
    return {
      type,
      userId,
      timestamp
    } as AuthenticatedStatus;
  } else if (type === 'unauthenticated') {
    return {
      type,
      timestamp
    } as UnauthenticatedStatus;
  } else {
    return {
      type: 'loading',
      timestamp
    } as LoadingStatus;
  }
}

/**
 * Prüft, ob ein AuthStatus 'authenticated' ist
 * @param status Das zu prüfende AuthStatus-Objekt
 * @returns true, wenn der Status 'authenticated' ist
 */
export function isAuthenticated(status: AuthStatus): boolean {
  return status.type === 'authenticated';
}

/**
 * Prüft, ob ein AuthStatus 'unauthenticated' ist
 * @param status Das zu prüfende AuthStatus-Objekt
 * @returns true, wenn der Status 'unauthenticated' ist
 */
export function isUnauthenticated(status: AuthStatus): boolean {
  return status.type === 'unauthenticated';
}

/**
 * Prüft, ob ein AuthStatus 'loading' ist
 * @param status Das zu prüfende AuthStatus-Objekt
 * @returns true, wenn der Status 'loading' ist
 */
export function isLoading(status: AuthStatus): boolean {
  return status.type === 'loading';
}

/**
 * Hilfsmethode, um zwei AuthStatus-Objekte zu vergleichen
 * @param status1 Erstes AuthStatus-Objekt
 * @param status2 Zweites AuthStatus-Objekt oder String-Literal
 * @returns true, wenn beide Status den gleichen Typ haben
 */
export function compareAuthStatus(
  status1: AuthStatus,
  status2: AuthStatus | 'authenticated' | 'unauthenticated' | 'loading'
): boolean {
  const type1 = getAuthStatusType(status1);
  const type2 = typeof status2 === 'string' ? status2 : getAuthStatusType(status2);
  
  return type1 === type2;
} 