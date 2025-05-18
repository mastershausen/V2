/**
 * @file types/auth/examples/AuthUsage.ts
 * @description Beispiel für die Verwendung der Auth-Typen
 */

// Dieser Code ist nur für Dokumentationszwecke und wird nicht kompiliert
// Import-Statements wurden beibehalten, um die Verwendung der Typen zu zeigen
import {
  User,
  UserRole,
  AuthStatus,
  isAuthenticated,
  isError,
  isUnauthenticated,
  AuthContextValue,
  isValidUser,
  isValidSession,
  UserSessionData,
  isSessionExpired,
  AppMode
} from '../index';

// 1. Beispiel: Verwendung der Typen in Komponenten
type AuthProps = {
  user: User | null;
  authStatus: AuthStatus;
  appMode: AppMode;
};

/**
 * Komponente, die den Authentifizierungsstatus anzeigt
 * @param user Der aktuelle Benutzer
 * @param authStatus Der aktuelle Auth-Status
 * @param appMode Der aktuelle App-Modus
 * @returns JSX-Element basierend auf dem Auth-Status
 */
function renderAuthInfo(user: User | null, authStatus: AuthStatus, appMode: AppMode): string {
  // Verwendung der Type Guards für sichere Typisierung
  if (isAuthenticated(authStatus)) {
    // TypeScript weiß jetzt, dass authStatus.type === 'authenticated'
    return `
      Angemeldet als: ${user?.name}
      Benutzer-ID: ${authStatus.userId}
      ${authStatus.expiresAt ? `Läuft ab: ${new Date(authStatus.expiresAt).toLocaleString()}` : ''}
    `;
  }
  
  if (isError(authStatus)) {
    // TypeScript weiß jetzt, dass authStatus.type === 'error'
    return `
      Fehler: ${authStatus.message}
      Code: ${authStatus.code}
    `;
  }
  
  if (isUnauthenticated(authStatus)) {
    // TypeScript weiß jetzt, dass authStatus.type === 'unauthenticated'
    return `
      Nicht angemeldet
      ${authStatus.reason ? `Grund: ${authStatus.reason}` : ''}
    `;
  }
  
  // Muss ein Loading-Status sein
  return "Lade Authentifizierungsinformationen...";
}

// 2. Beispiel: Verwendung der Typen in Hooks
function useUserRole(user: User | null): UserRole | null {
  if (!user) return null;
  
  // Validierung des Benutzers mit Type Guard
  if (!isValidUser(user)) {
    console.error('Ungültiger Benutzer erkannt', user);
    return null;
  }
  
  return user.role;
}

// 3. Beispiel: Verwendung zur Validierung von Benutzersitzungen
function validateSession(session: UserSessionData | null): boolean {
  if (!isValidSession(session)) {
    console.log('Ungültige Sitzung');
    return false;
  }
  
  if (isSessionExpired(session)) {
    console.log('Sitzung abgelaufen');
    return false;
  }
  
  return true;
}

// 4. Beispiel: Verwendung des Auth-Kontexts in einer Komponente
/**
 * Komponente, die das Benutzerprofil anzeigt
 * @param auth
 * @returns JSX-Element basierend auf dem Auth-Status
 */
function renderProfileComponent(auth: AuthContextValue): string {
  // Hier würde normalerweise ein React-Hook wie useEffect verwendet werden
  // Beispiel:
  // useEffect(() => {
  //   async function checkSession() {
  //     if (!auth.isAuthenticated()) {
  //       try {
  //         if (auth.appMode === 'demo') {
  //           const demoSession = await auth.createDemoSession();
  //           console.log('Demo-Sitzung erstellt', demoSession);
  //         } else {
  //           const refreshed = await auth.refreshSession();
  //           console.log('Sitzung aktualisiert:', refreshed);
  //         }
  //       } catch (error) {
  //         console.error('Fehler beim Erstellen der Sitzung', error);
  //       }
  //     }
  //   }
  //   
  //   checkSession();
  // }, [auth]);
  
  // Verwendung der Type Guards für die Darstellung
  if (isAuthenticated(auth.authStatus)) {
    return `
      Willkommen, ${auth.user?.name}!
      Rolle: ${auth.user?.role}
    `;
  }
  
  return "Bitte melden Sie sich an, um Ihr Profil zu sehen.";
}

// 5. Beispiel: Typsichere Konvertierung von Legacy-Status (nur als Beispiel)
function convertLegacyStatus(legacyStatus: 'loggedIn' | 'loggedOut' | 'pending'): AuthStatus {
  switch (legacyStatus) {
    case 'loggedIn':
      return {
        type: 'authenticated',
        userId: 'unknown', // In echtem Code müsste dies aus Benutzerdaten kommen
        timestamp: Date.now()
      };
    case 'loggedOut':
      return {
        type: 'unauthenticated',
        timestamp: Date.now()
      };
    case 'pending':
    default:
      return {
        type: 'loading',
        timestamp: Date.now(),
        operation: 'login' // Geändert auf gültigen Wert
      };
  }
} 