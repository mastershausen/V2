/**
 * Selektoren für den userStore
 * 
 * Diese Selektoren stellen Funktionen bereit, um Daten aus dem userStore 
 * abzufragen und zu transformieren. Sie ermöglichen den Zugriff auf 
 * abgeleitete Zustände basierend auf den Rohdaten im Store.
 */
import { isDemoMode } from '@/features/auth/config/modes';
import { AuthStatus } from '@/features/auth/types';
import { useModeStore } from '@/features/mode/stores';
import { type UserProfile, type UserRole, ROLE_HIERARCHY } from '@/types/userTypes';
import { logger } from '@/utils/simpleLogger';

// Definition des neuen UserState-Typs
interface UserState {
  authStatus: AuthStatus;
  user: UserProfile | null;
  token: string | null;
  savedAuthenticatedSession: {
    user: UserProfile | null;
    token: string | null;
    authStatus: AuthStatus;
  } | null;
}

// Typen für die Selektorfunktionen
type GetFunction = () => UserState;

/**
 * Erstellt die Selektoren für den userStore
 * @param get - Funktion, um den aktuellen Zustand des userStore abzurufen
 * @returns Objekt mit Selektorfunktionen
 */
export const createUserSelectors = (get: GetFunction) => {
  // Definiere eine lokale isAuthenticated-Funktion
  const isAuthenticated = (): boolean => {
    const state = get();
    
    // Vereinfachte Debug-Ausgabe
    logger.debug(
      `AUTH CHECK: Status=${state.authStatus}, Token=${!!state.token}, User=${!!state.user}`
    );
    
    // Strengere Prüfung für den authentifizierten Zustand
    const isValid = state.authStatus === 'authenticated' && 
                   !!state.token && 
                   !!state.user && 
                   !!state.user.id; // Zusätzlich prüfen, ob der Benutzer eine ID hat
    
    return isValid;
  };
  
  // Definiere eine lokale hasMinimumRole-Funktion
  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    const user = get().user;
    if (!user || !user.role) return false;
    
    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
    const minimumRoleLevel = ROLE_HIERARCHY[minimumRole] || 0;
    
    return userRoleLevel >= minimumRoleLevel;
  };
  
  return {
    /**
     * Prüft, ob der Benutzer authentifiziert ist
     * @returns true, wenn der Benutzer authentifiziert ist, sonst false
     */
    isAuthenticated,
    
    /**
     * Gibt den aktuellen Benutzer zurück
     * @returns Das Benutzerprofil oder null, wenn kein Benutzer angemeldet ist
     */
    getCurrentUser: () => {
      return get().user;
    },
    
    /**
     * Prüft, ob der Benutzer eine bestimmte Rolle hat
     * @param role - Die zu prüfende Rolle
     * @returns true, wenn der Benutzer die angegebene Rolle hat, sonst false
     */
    hasRole: (role: UserRole): boolean => {
      const user = get().user;
      if (!user || !user.role) return false;
      return user.role === role;
    },
    
    /**
     * Prüft, ob der Benutzer mindestens die angegebene Rolle hat
     * @param minimumRole - Die Mindestrolle
     * @returns true, wenn der Benutzer mindestens die angegebene Rolle hat
     */
    hasMinimumRole,
    
    /**
     * Prüft, ob der Benutzer ein Administrator ist
     * @returns true, wenn der Benutzer die Rolle 'admin' hat
     */
    isAdmin: (): boolean => {
      return get().user?.role === 'admin' || false;
    },
    
    /**
     * Prüft, ob der Benutzer eine Premium-Rolle hat
     * @returns true, wenn der Benutzer mindestens die Rolle 'premium' hat
     */
    isPremium: (): boolean => {
      return hasMinimumRole('premium');
    },
    
    /**
     * Prüft, ob der Benutzer eine Pro-Rolle hat
     * @returns true, wenn der Benutzer mindestens die Rolle 'pro' hat
     */
    isPro: (): boolean => {
      return hasMinimumRole('pro');
    },

    /**
     * Ermittelt die Berechtigungen für den Profilbereich.
     *
     * Diese Funktion gibt ein Objekt mit verschiedenen Berechtigungen zurück,
     * die bestimmen, was der aktuelle Benutzer im Profilbereich tun kann.
     * Sie berücksichtigt sowohl den Demo-Modus (aus dem useModeStore) als auch
     * die Benutzerrolle und den Eigentümerstatus.
     * @returns Objekt mit Berechtigungen für den Profilbereich
     */
    getProfilePermissions: () => {
      const state = get();
      const user = state.user;
      
      // Demo-Modus-Status über Helper-Funktion abrufen
      const isInDemoMode = isDemoMode();
      // isDemoAccount direkt vom ModeStore abrufen
      const isDemoAccount = useModeStore.getState().isDemoAccount;
      
      return {
        canEdit: isAuthenticated() && (
          state.user?.id === user?.id || 
          state.user?.role === 'admin'
        ),
        canViewFullProfile: !isInDemoMode || isDemoAccount,
        canAccessAdminFeatures: state.user?.role === 'admin' && !isInDemoMode,
        isDemoMode: isInDemoMode,
        // Im Demo-Modus immer false zurückgeben, unabhängig von der Benutzer-ID
        isOwner: isInDemoMode ? false : (state.user?.id === user?.id)
      };
    }
  };
};

/**
 * Überprüft, ob ein Benutzer mit einer bestimmten Rolle Zugriff auf bestimmte Funktionen hat
 * @param user Der Benutzer (oder undefined, wenn nicht eingeloggt)
 * @param requiredRole Die minimal erforderliche Rolle für den Zugriff
 * @returns true, wenn der Benutzer Zugriff haben soll
 */
export const hasRole = (user: UserProfile | null | undefined, requiredRole: UserRole): boolean => {
  try {
    // Im Demo-Modus simulieren wir vollen Zugriff
    if (isDemoMode()) {
      return true;
    }

    // Wenn kein Benutzer vorhanden ist, kein Zugriff
    if (!user || !user.role) {
      return false;
    }

    // Benutzerrolle überprüfen
    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 0;

    // Je höher der Wert, desto höher die Berechtigung
    return userRoleLevel >= requiredRoleLevel;
  } catch (error) {
    logger.error(`Fehler bei Rollenzugriffsprüfung: ${error}`);
    return false; // Im Fehlerfall verweigern wir den Zugriff
  }
}; 