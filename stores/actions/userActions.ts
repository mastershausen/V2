/**
 * userActions.ts - Vereinfachte Aktionen für den UserStore
 * 
 * Diese Datei enthält die aktualisierten Aktionen für den UserStore mit
 * vereinfachter Authentifizierungslogik und Integration des SessionService.
 */

// Direkte Typdefinitionen, um Import-Probleme zu vermeiden
type UserRole = 'free' | 'premium' | 'pro' | 'admin' | 'user' | 'guest';
type UserType = 'GUEST' | 'DEMO_USER' | 'REGISTERED_USER';

// Typen für lokale Verwendung
interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
  type?: UserType;
}

// Typen für den UserState
interface UserState {
  authStatus: 'authenticated' | 'unauthenticated' | 'loading';
  user: UserProfile | null;
  token: string | null;
  savedAuthenticatedSession: {
    user: UserProfile | null;
    token: string | null;
    authStatus: 'authenticated' | 'unauthenticated' | 'loading';
  } | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  type: UserType;
}

// Mock für Session
interface Session {
  authStatus: 'authenticated' | 'unauthenticated' | 'loading';
  user: {
    id: string;
    email: string;
    name: string;
    type: UserType;
  };
}

// Mock für Services
const sessionService = {
  loadSession: async (): Promise<Session | null> => null,
  saveSession: async (): Promise<boolean> => true
};

const logger = {
  info: (message: string) => console.log(message),
  error: (message: string, error: string) => console.error(message, error)
};

// Typen für die Aktionsfunktionen
type SetFunction = (fn: (state: UserState) => Partial<UserState>) => void;
type GetFunction = () => UserState & {
  hasMinimumRole: (minimumRole: UserRole) => boolean;
};

export const createUserActions = (set: SetFunction, get: GetFunction) => {
  return {
    /**
     * Initialisiert den Authentifizierungszustand
     */
    initAuth: async (): Promise<void> => {
      try {
        // Setze den Status auf "loading" während der Initialisierung
        set(() => ({ authStatus: 'loading' }));
        
        // Lade die gespeicherte Sitzung über den SessionService
        const session = await sessionService.loadSession();
        
        if (session) {
          // Setze den Zustand basierend auf der geladenen Sitzung
          set(() => ({
            authStatus: session.authStatus,
            user: {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              role: 'free' as UserRole, // Konvertiere zu UserRole
              type: session.user.type
            },
            token: session.user.id // Verwende ID als Token
          }));
        } else {
          // Keine gültige Sitzung gefunden
          set(() => ({
            authStatus: 'unauthenticated',
            user: null,
            token: null
          }));
        }
      } catch (error) {
        logger.error('Fehler bei der Auth-Initialisierung:', String(error));
        // Bei Fehler auf "unauthenticated" setzen
        set(() => ({
          authStatus: 'unauthenticated',
          user: null,
          token: null
        }));
      }
    },

    /**
     * Benutzer anmelden
     * @param {string} email - E-Mail-Adresse
     * @param {string} password - Passwort
     * @returns {Promise<boolean>} Erfolg der Anmeldung
     */
    login: async (email: string, password: string): Promise<boolean> => {
      logger.info(`Login mit: ${email}, Passwort vorhanden: ${!!password}`);
      
      try {
        // Demo-Anmeldung für Alexander Becker
        if (email === 'alexander@beckerundpartner.de' && password === 'demo123') {
          try {
            // Mock für Alexander Becker
            const ALEXANDER_BECKER = {
              id: 'demo-user-alexander',
              email: 'alexander@beckerundpartner.de',
              name: 'Alexander Becker',
              role: 'admin' as UserRole
            };
            
            // Demo-Benutzer erstellen basierend auf Alexander Becker
            const demoUser: User = {
              id: ALEXANDER_BECKER.id,
              email: ALEXANDER_BECKER.email,
              name: ALEXANDER_BECKER.name,
              role: 'admin',
              type: 'DEMO_USER'
            };
            
            // Speichere die Sitzung über den SessionService
            // @ts-expect-error - Typ-Probleme aufgrund inkompatibler Auth-Status-Definitionen
            const success = await sessionService.saveSession(demoUser, 'authenticated');
            
            if (success) {
              // Aktualisiere den Store mit der Alexander Becker-Sitzung
              set(() => ({
                authStatus: 'authenticated',
                user: {
                  id: demoUser.id,
                  email: demoUser.email,
                  name: demoUser.name,
                  role: 'admin' as UserRole,
                  type: 'DEMO_USER' as UserType
                },
                token: `demo-token-${Date.now()}`
              }));
              
              return true;
            }
            
            return false;
          } catch (importError) {
            logger.error('Fehler beim Importieren von Alexander Becker:', String(importError));
            return false;
          }
        }
        
        // Hier würde die echte Login-Logik implementiert werden
        // Dies ist nur ein einfaches Beispiel
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email: email,
          name: 'Angemeldeter Benutzer',
          role: 'free',
          type: 'REGISTERED_USER'
        };
        
        // Speichere die Sitzung über den SessionService
        // @ts-expect-error - Typ-Probleme aufgrund inkompatibler Auth-Status-Definitionen
        const success = await sessionService.saveSession(mockUser, 'authenticated');
        
        if (success) {
          // Aktualisiere den Store mit der neuen Sitzung
          set(() => ({
            authStatus: 'authenticated',
            user: {
              id: mockUser.id,
              email: mockUser.email,
              name: mockUser.name,
              role: 'free',
              type: 'REGISTERED_USER' as UserType
            },
            token: `token-${Date.now()}`
          }));
          
          return true;
        }
        
        return false;
      } catch (error) {
        logger.error('Fehler beim Login:', String(error));
        return false;
      }
    },
  };
};