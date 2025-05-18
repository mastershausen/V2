/**
 * AuthService
 * 
 * Service-Klasse für die Auth-Funktionen, implementiert das IService-Interface
 * für die ServiceRegistry.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { enableDemoModeOverride, enableLiveModeOverride } from '@/config/app/debug';
import { DEMO_USERS, DEMO_NETWORK_DELAY, AUTH_ERROR_MESSAGES } from '@/config/auth/constants';
import { sessionService } from '@/features/auth/services';
import { User, AuthResponse, USER_TYPES } from '@/types/auth';
import { AppMode, UserStatus, USER_STATUS } from '@/types/common/appMode';
import { logger } from '@/utils/logger';
import { getBuildService } from '@/utils/service/serviceHelper';
import {IService} from '@/utils/service/serviceRegistry';
import { authEvents, modeEvents } from '@/utils/store/storeEvents';

import StorageService from './StorageService';

/**
 * Simuliert eine Netzwerklatenz für Demo-Zwecke
 * @param {number} ms Verzögerung in Millisekunden
 * @returns {Promise<void>} Promise, das nach der angegebenen Zeit auflöst
 */
const delay = (ms: number = DEMO_NETWORK_DELAY): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * AuthService implementiert das IService-Interface für die ServiceRegistry.
 */
class AuthService implements IService {
  private storageService: StorageService | null = null;
  
  /**
   * Setter für StorageService-Abhängigkeit
   * @param {StorageService} storageService - Die StorageService-Instanz zur Verwendung
   * @returns {void}
   */
  setStorageService(storageService: StorageService): void {
    this.storageService = storageService;
  }
  
  /**
   * Initialisierung des Auth-Service
   * @returns {Promise<void>} Promise, das nach erfolgreicher Initialisierung auflöst
   */
  async init(): Promise<void> {
    logger.debug('[AuthService] Initialisiert');
  }

  /**
   * Ressourcen freigeben
   * @returns {Promise<void>} Promise, das nach erfolgreicher Ressourcenfreigabe auflöst
   */
  async dispose(): Promise<void> {
    logger.debug('[AuthService] Ressourcen freigegeben');
  }

  /**
   * Hilfsfunktion für DevBuild-Erkennung
   * @returns {boolean} True, wenn im DevBuild
   */
  private isDevBuildOnly(): boolean {
    // Nur auf den tatsächlichen Build-Typ prüfen, nicht auf __DEV__
    // (damit Storybook, Testumgebungen etc. nicht fälschlich als DevBuild gelten)
    const buildService = getBuildService();
    return buildService.getCurrentBuildType() === 'dev';
  }

  /**
   * Zentrale Funktion für App-Modus-Verwaltung
   * Setzt sowohl AppMode als auch UserStatus basierend auf der Aktion
   * @param {AppMode} newMode Ziel-Modus der App
   * @param {UserStatus} newStatus Neuer Benutzerstatus
   * @param {string} action Kontext der Aktion (für Logging)
   * @returns {Promise<void>} Promise, das nach erfolgreicher Transition auflöst
   */
  private async handleModeTransition(
    newMode: AppMode,
    newStatus: UserStatus,
    action: string
  ): Promise<void> {
    const currentMode = await this.getCurrentAppMode();
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
   * Hilfsfunktion zum Abrufen des aktuellen App-Modus
   * @returns {Promise<AppMode>} Der aktuelle App-Modus aus dem AsyncStorage
   */
  private async getCurrentAppMode(): Promise<AppMode> {
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
   * Hilfsfunktion zum Abrufen des aktuellen Benutzer-Status
   * @returns {Promise<UserStatus>} Der aktuelle Benutzer-Status aus dem AsyncStorage
   */
  private async getCurrentUserStatus(): Promise<UserStatus> {
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
   * Meldet einen Benutzer an.
   * @param {string} email E-Mail-Adresse
   * @param {string} password Passwort
   * @returns {Promise<AuthResponse>} Promise mit dem Ergebnis der Anmeldung
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    authEvents.setError('');
    try {
      // Nur im DevBuild DemoMode, sonst immer live
      const targetMode = this.isDevBuildOnly() ? 'demo' : 'live';
      await this.handleModeTransition(targetMode, USER_STATUS.AUTHENTICATED, 'Login');
      await delay();
      const user = DEMO_USERS.find(
        u => u.email === email && u.password === password
      );
      if (user) {
        const { password: _, ...userData } = user;
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
  async register(
    email: string, 
    password: string, 
    name?: string,
    skipEmailCheck: boolean = false
  ): Promise<AuthResponse> {
    try {
      await this.handleModeTransition('live', USER_STATUS.AUTHENTICATED, 'Registrierung');
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
  async logout(): Promise<AuthResponse> {
    // Logout: Immer live
    await this.handleModeTransition('live', USER_STATUS.GUEST, 'Logout');
    try {
      // Versuche Session zu löschen
      await sessionService.logout();
      
      // Events auslösen
      authEvents.logout();
      
      logger.info('[Auth] Benutzer erfolgreich abgemeldet');
      return { success: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.NETWORK_ERROR;
      authEvents.setError(errorMsg);
      logger.error('[Auth] Fehler beim Abmelden:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Automatische Anmeldung im Demo-Modus
   * @param {string} [demoEmail] Optionale E-Mail des Demo-Benutzers
   * @returns {Promise<AuthResponse>} Promise mit dem Ergebnis der Demo-Anmeldung
   */
  async autologinForDemoMode(demoEmail?: string): Promise<AuthResponse> {
    try {
      // In Demo-Modus wechseln
      await this.handleModeTransition('demo', USER_STATUS.AUTHENTICATED, 'Demo-Autologin');
      
      // Verzögerung für realistisches Gefühl
      await delay(500);
      
      // Demo-Benutzer finden oder ersten nehmen
      const demoUser = demoEmail 
        ? DEMO_USERS.find(u => u.email === demoEmail) 
        : DEMO_USERS[0];
      
      if (demoUser) {
        const { password: _, ...userData } = demoUser;
        const userObj: User = {
          ...userData,
          type: USER_TYPES.DEMO_USER
        };
        
        // Events auslösen
        authEvents.login(userObj);
        
        // Session speichern
        await sessionService.saveSession(userObj, { 
          type: 'authenticated', 
          userId: userObj.id, 
          timestamp: Date.now()
        });
        
        logger.info('[Auth] Demo-Benutzer automatisch angemeldet:', demoUser.email);
        return { success: true, user: userObj };
      }
      
      // Kein Demo-Benutzer gefunden
      const errorMsg = 'Kein Demo-Benutzer verfügbar';
      authEvents.setError(errorMsg);
      return { success: false, error: errorMsg };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.NETWORK_ERROR;
      authEvents.setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Wechselt den App-Modus
   * @param {AppMode} newMode Ziel-Modus
   * @returns {Promise<AuthResponse>} Promise mit dem Ergebnis des Moduswechsels
   */
  async switchAppMode(newMode: AppMode): Promise<AuthResponse> {
    try {
      if (newMode === 'demo') {
        // In Demo-Modus wechseln: Auto-Login
        return await this.autologinForDemoMode();
      } else {
        // In Live-Modus wechseln: Gast-Status
        await this.handleModeTransition('live', USER_STATUS.GUEST, 'Modus-Wechsel zu Live');
        return { success: true };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.NETWORK_ERROR;
      authEvents.setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }
}

export default AuthService; 