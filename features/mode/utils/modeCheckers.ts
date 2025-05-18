/**
 * @file features/mode/utils/modeCheckers.ts
 * @description Helper-Funktionen für Mode- und Status-Checks
 */

import { AppMode, UserStatus } from '../types';

/**
 * Prüft, ob der angegebene Modus der Demo-Modus ist
 * @param {AppMode} mode - Der zu prüfende App-Modus
 * @returns {boolean} true, wenn der Modus 'demo' ist
 */
export const isDemo = (mode: AppMode): boolean => mode === 'demo';

/**
 * Prüft, ob der angegebene Modus der Live-Modus ist
 * @param {AppMode} mode - Der zu prüfende App-Modus
 * @returns {boolean} true, wenn der Modus 'live' ist
 */
export const isLive = (mode: AppMode): boolean => mode === 'live';

/**
 * Prüft, ob der angegebene Benutzerstatus 'authenticated' ist
 * @param {UserStatus} status - Der zu prüfende Benutzerstatus
 * @returns {boolean} true, wenn der Status 'authenticated' ist
 */
export const isAuthenticated = (status: UserStatus): boolean => status === 'authenticated';

/**
 * Prüft, ob der angegebene Benutzerstatus 'demo' ist
 * @param {UserStatus} status - Der zu prüfende Benutzerstatus
 * @returns {boolean} true, wenn der Status 'demo' ist
 */
export const isDemoUser = (status: UserStatus): boolean => status === 'demo';

/**
 * Prüft, ob der angegebene Benutzerstatus 'guest' ist
 * @param {UserStatus} status - Der zu prüfende Benutzerstatus
 * @returns {boolean} true, wenn der Status 'guest' ist
 */
export const isGuest = (status: UserStatus): boolean => status === 'guest'; 