/**
 * @file services/auth.ts
 * @description VERALTET - Dies ist die Legacy-Implementierung der Auth-Funktionen
 * @deprecated Bitte verwende stattdessen den AuthService aus der ServiceRegistry.
 * Zugriff über: `import { getAuthService } from '@/utils/service/serviceHelper';`
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { enableDemoModeOverride, enableLiveModeOverride } from '@/config/app/debug';
import { DEMO_USERS, DEMO_NETWORK_DELAY, AUTH_ERROR_MESSAGES } from '@/config/auth/constants';
import { sessionService } from '@/features/auth/services';
import { User, AuthResponse, USER_TYPES } from '@/types/auth';
import { AppMode, UserStatus, USER_STATUS } from '@/types/common/appMode';
import { logger } from '@/utils/logger';
import { getBuildService } from '@/utils/service/serviceHelper';
import { authEvents, modeEvents } from '@/utils/store/storeEvents';

/**
 * @deprecated Bitte verwende stattdessen den AuthService aus der ServiceRegistry.
 * Simuliert eine Netzwerklatenz für Demo-Zwecke
 * @param {number} ms Verzögerung in Millisekunden
 * @returns {Promise<void>} Promise, das nach der angegebenen Zeit auflöst
 */
const delay = (ms: number = DEMO_NETWORK_DELAY): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * @deprecated Bitte verwende stattdessen den AuthService aus der ServiceRegistry.
 * Hilfsfunktion für DevBuild-Erkennung
 * @returns {boolean} true, wenn es sich um einen Development-Build handelt
 */
function isDevBuildOnly(): boolean {
  try {
  // Nur auf den tatsächlichen Build-Typ prüfen, nicht auf __DEV__
  // (damit Storybook, Testumgebungen etc. nicht fälschlich als DevBuild gelten)
    const buildService = getBuildService();
    if (typeof buildService.getCurrentBuildType === 'function') {
      return buildService.getCurrentBuildType() === 'dev';
    }
    // Fallback, wenn die Methode nicht vorhanden ist
    return __DEV__;
  } catch (error) {
    logger.error('[Auth] Fehler beim Ermitteln des Build-Typs:', 
      error instanceof Error ? error.message : String(error));
    return __DEV__; // Fallback im Fehlerfall
  }
}

/**
 * @deprecated Bitte verwende stattdessen den AuthService aus der ServiceRegistry.
 * Zentrale Funktion für App-Modus-Verwaltung
 * Setzt sowohl AppMode als auch UserStatus basierend auf der Aktion
 * @param {AppMode} newMode Ziel-Modus der App
 * @param {UserStatus} newStatus Neuer Benutzerstatus
 * @param {string} action Kontext der Aktion (für Logging)
 * @returns {Promise<void>} Promise, das nach erfolgreicher Ausführung auflöst
 */
async function handleModeTransition(
  newMode: AppMode,
  newStatus: UserStatus,
  action: string
): Promise<void> {
  const currentMode = await getCurrentAppMode();
  logger.info(`[Auth] Starte Mode-Transition: ${action}, aktueller Modus=${currentMode}, neuer Modus=${newMode}, neuer Status=${newStatus}`);

  // Neue Logik: Immer live, außer DevBuild-Login
  modeEvents.setAppMode(newMode);
  modeEvents.setUserStatus(newStatus);
  logger.info(`[Auth] Mode-Transition: ${action} setzt AppMode=${newMode}, UserStatus=${newStatus}`);

  // Konfiguriere App-Modus-Overrides (in Entwicklungsumgebung)
  if (__DEV__) {
    if (newMode === 'demo') {
      await enableDemoModeOverride();
    } else {
      await enableLiveModeOverride();
    }
  }
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * @deprecated Bitte verwende stattdessen den AuthService aus der ServiceRegistry.
 * Hilfsfunktion zum Abrufen des aktuellen App-Modus
 * @returns {Promise<AppMode>} Der aktuelle App-Modus aus dem AsyncStorage
 */
async function getCurrentAppMode(): Promise<AppMode> {
  try {
    const storageData = await AsyncStorage.getItem('mode-storage');
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      return parsedData.state?.appMode || 'live';
    }
  } catch (error) {
    logger.error('[Auth] Fehler beim Abrufen des App-Modus:', error instanceof Error ? error.message : String(error));
  }
  return 'live'; // Fallback
}

/**
 * @deprecated Bitte verwende stattdessen den AuthService aus der ServiceRegistry.
 * Hilfsfunktion zum Abrufen des aktuellen Benutzer-Status
 * @returns {Promise<UserStatus>} Der aktuelle Benutzer-Status aus dem AsyncStorage
 */
async function getCurrentUserStatus(): Promise<UserStatus> {
  try {
    const storageData = await AsyncStorage.getItem('mode-storage');
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      return parsedData.state?.userStatus || USER_STATUS.GUEST;
    }
  } catch (error) {
    logger.error('[Auth] Fehler beim Abrufen des Benutzer-Status:', error instanceof Error ? error.message : String(error));
  }
  return USER_STATUS.GUEST; // Fallback
}

/**
 * @deprecated Bitte verwende stattdessen den AuthService aus der ServiceRegistry.
 * Meldet einen Benutzer an.
 * @param {string} email E-Mail-Adresse
 * @param {string} password Passwort
 * @returns {Promise<AuthResponse>} Promise mit dem Ergebnis der Anmeldung
 */
export async function login(
  email: string, 
  password: string
): Promise<AuthResponse> {
  authEvents.setError('');
  try {
    // Nur im DevBuild DemoMode, sonst immer live
    const targetMode = isDevBuildOnly() ? 'demo' : 'live';
    await handleModeTransition(targetMode, USER_STATUS.AUTHENTICATED, 'Login');
    await delay();
    const user = DEMO_USERS.find(
      u => u.email === email && u.password === password
    );
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...userData } = user;
      const userObj: User = {
        ...userData,
        type: USER_TYPES.DEMO_USER
      };
      authEvents.login(userObj);
      await sessionService.saveSession(userObj, { type: 'authenticated', userId: userObj.id, timestamp: Date.now() });
      logger.info('[Auth] Demo-Benutzer Session erstellt');
      if (__DEV__) {
        // Radikaler Hard-Override: Store und Storage direkt setzen
        const { useModeStore } = await import('@/features/mode/stores');
        useModeStore.getState().setAppMode('demo');
        await AsyncStorage.setItem('mode-storage', JSON.stringify({ state: { appMode: 'demo', userStatus: { type: 'authenticated' }, isDemoAccount: false } }));
      }
      return { success: true, user: userObj };
    }
    authEvents.setError(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    return { 
      success: false, 
      error: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS 
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    authEvents.setError(errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Registriert einen neuen Benutzer.
 * @param {string} email E-Mail-Adresse
 * @param {string} password Passwort
 * @param {string} [name] Name des Benutzers (optional)
 * @param {boolean} [skipEmailCheck] Optional: Wenn true, wird die E-Mail-Prüfung übersprungen
 * @returns {Promise<AuthResponse>} Promise mit dem Ergebnis der Registrierung
 */
export async function register(
  email: string, 
  password: string, 
  name?: string,
  skipEmailCheck: boolean = false
): Promise<AuthResponse> {
  try {
    await handleModeTransition('live', USER_STATUS.AUTHENTICATED, 'Registrierung');
    await delay();
    if (!skipEmailCheck) {
      const emailExistsInDemo = DEMO_USERS.some(u => u.email === email);
      let emailExistsInStorage = false;
      try {
        const storedEmails = await AsyncStorage.getItem('registered_emails');
        if (storedEmails) {
          const emailsArray = JSON.parse(storedEmails);
          emailExistsInStorage = emailsArray.includes(email);
        }
      } catch (storageError) {
        logger.error('[Auth] Fehler beim Prüfen gespeicherter E-Mails:', String(storageError));
      }
      if (emailExistsInDemo || emailExistsInStorage) {
        authEvents.setError(AUTH_ERROR_MESSAGES.EMAIL_EXISTS);
        return { 
          success: false, 
          error: AUTH_ERROR_MESSAGES.EMAIL_EXISTS
        };
      }
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      type: USER_TYPES.DEMO_USER,
      role: 'free'
    };
    try {
      const storedEmails = await AsyncStorage.getItem('registered_emails');
      const emailsArray = storedEmails ? JSON.parse(storedEmails) : [];
      if (!emailsArray.includes(email)) {
        emailsArray.push(email);
        await AsyncStorage.setItem('registered_emails', JSON.stringify(emailsArray));
      }
    } catch (storageError) {
      logger.error('[Auth] Fehler beim Speichern der E-Mail:', String(storageError));
    }
    // Setze explizit ein permanentes Flag im AsyncStorage
    await AsyncStorage.setItem('auth_registered', 'true');
    
    // Nur noch Store setzen, keine manuellen Flags mehr!
    const { useAuthStore } = await import('@/stores/authStore');
    useAuthStore.getState().login(newUser);
    authEvents.login(newUser);
    await sessionService.saveSession(newUser, { 
      type: 'authenticated', 
      userId: newUser.id, 
      timestamp: Date.now() 
    });
    const { useModeStore } = await import('@/features/mode/stores');
    useModeStore.getState().setAppMode('live');
    await AsyncStorage.setItem('mode-storage', JSON.stringify({ 
      state: { 
        appMode: 'live', 
        userStatus: { type: 'authenticated' }, 
        isDemoAccount: false 
      } 
    }));
    logger.info('[Auth] Benutzer erfolgreich registriert:', email);
    return { success: true, user: newUser };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    authEvents.setError(errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Meldet einen Benutzer ab.
 * @returns {Promise<AuthResponse>} Promise mit dem Ergebnis der Abmeldung
 */
export async function logout(): Promise<AuthResponse> {
  // Logout: Immer live
  await handleModeTransition('live', USER_STATUS.GUEST, 'Logout');
  try {
    // Versuche Session zu löschen
    await sessionService.logout();
    
    // Lösche auch das auth_registered Flag
    await AsyncStorage.removeItem('auth_registered');
    
    // Melde Benutzer ab über Events
    authEvents.logout();
    
    logger.info('[Auth] Benutzer erfolgreich abgemeldet');
    
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    authEvents.setError(errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Führt einen automatischen Login im Demo-Modus durch
 * @param {string} [demoEmail] Die zu verwendende Demo-E-Mail
 * @returns {Promise<AuthResponse>} Promise mit dem Ergebnis der Anmeldung
 */
export async function autologinForDemoMode(demoEmail?: string): Promise<AuthResponse> {
  // Autologin: Immer live (DemoMode nur über expliziten Login im DevBuild)
  await handleModeTransition('live', USER_STATUS.AUTHENTICATED, 'Autologin');
  const email = demoEmail || 'demo@solvbox.com';
  logger.info('[Auth] Starte Autologin für Demo-AppMode mit:', email);
  
  try {
    // Verzögerung für realistische Demo
    await delay();
    
    // Demo-Benutzer finden oder erstellen
    const demoUser = DEMO_USERS.find(u => u.email === email) || {
      id: `demo-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'free',
      userType: USER_TYPES.DEMO_USER,
      password: 'demo123'
    };
    
    // Passwort entfernen und userType in type umwandeln
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, userType, ...userData } = demoUser;
    
    // Korrektes User-Objekt erstellen
    const userObj: User = {
      ...userData,
      type: USER_TYPES.DEMO_USER
    };
    
    // Melde Benutzer an über Events
    authEvents.login(userObj);
    
    // Session speichern
    await sessionService.saveSession(userObj, { type: 'authenticated', userId: userObj.id, timestamp: Date.now() });
    
    logger.info('[Auth] Demo-Anmeldung erfolgreich für:', email);
    
    return {
      success: true,
      user: userObj
    };
  } catch (error) {
    logger.error('[Auth] Fehler bei Demo-Anmeldung:', 
      error instanceof Error ? error.message : String(error)
    );
    return {
      success: false,
      error: 'Fehler bei Demo-Anmeldung'
    };
  }
}

/**
 * Wechselt den App-Modus (Betriebsmodus der App).
 * @param {AppMode} newMode Der neue App-Modus
 * @returns {Promise<AuthResponse>} Promise mit dem Ergebnis des Moduswechsels
 */
export async function switchAppMode(newMode: AppMode): Promise<AuthResponse> {
  try {
    // Prüfe Store und auth_registered Flag
    const { useAuthStore } = await import('@/stores/authStore');
    const store = useAuthStore.getState();
    const isAuthenticated = store.authStatus && store.authStatus.type === 'authenticated';
    
    // Einmal registriert = immer authentifiziert für Moduswechsel
    let isRegisteredEver = false;
    try {
      isRegisteredEver = await AsyncStorage.getItem('auth_registered') === 'true';
    } catch (error) {
      logger.error('[Auth] Fehler beim Prüfen des Registrierungsstatus:', error instanceof Error ? error.message : String(error));
    }
    
    if (isAuthenticated || isRegisteredEver) {
      const currentStatus = await getCurrentUserStatus();
      await handleModeTransition(newMode, currentStatus, 'Moduswechsel');
      const { useModeStore } = await import('@/features/mode/stores');
      useModeStore.getState().setAppMode(newMode);
      await AsyncStorage.setItem('mode-storage', JSON.stringify({ 
        state: { 
          appMode: newMode, 
          userStatus: currentStatus,
          isDemoAccount: newMode === 'demo'
        } 
      }));
      logger.info(`[Auth] Modus erfolgreich gewechselt zu ${newMode}`);
      return { success: true };
    }
    if (newMode === 'live') {
      await handleModeTransition('live', USER_STATUS.GUEST, 'Moduswechsel');
      return { success: true };
    }
    return { 
      success: false, 
      error: 'Für den Demo-Modus ist eine Authentifizierung erforderlich' 
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Fehler beim Moduswechsel';
    logger.error('[Auth] ' + errorMsg);
    return { success: false, error: errorMsg };
  }
} 