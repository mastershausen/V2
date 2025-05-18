/**
 * @file features/mode/stores/types.ts
 * @description Definiert Typen für den Mode-Store
 */

import { z } from 'zod';

import { AppMode, ModeErrorType, UserStatus } from '@/types/common/appMode';
import { createStoreSchema } from '@/utils/store/migrationManager';

/**
 * Mode-Store Zustand
 */
export interface ModeState {
  /**
   * Aktueller Betriebsmodus der App
   */
  appMode: AppMode;
  
  /**
   * Aktueller Benutzerstatus im System
   */
  userStatus: UserStatus;
  
  /**
   * Ob das System mit Demo-Daten arbeitet
   */
  isDemoAccount: boolean;
  
  /**
   * Der letzte aufgetretene Fehler
   */
  lastError?: string;
  
  /**
   * Der Typ des letzten aufgetretenen Fehlers
   */
  lastErrorType?: ModeErrorType;
}

/**
 * Mode-Store Aktionen
 */
export interface ModeActions {
  /**
   * Setzt den Betriebsmodus der App
   */
  setAppMode: (mode: AppMode) => Promise<void>;
  
  /**
   * Wechselt zwischen Demo- und Live-Modus
   */
  toggleAppMode: () => Promise<void>;
  
  /**
   * Setzt den Status des Benutzers
   */
  setUserStatus: (status: UserStatus) => void;
  
  /**
   * Setzt den Demo-Account-Status
   */
  setDemoAccount: (isDemoAccount: boolean) => void;
  
  /**
   * Setzt einen Fehler im Mode-System
   */
  setError: (error: string, errorType: ModeErrorType) => void;
  
  /**
   * Löscht den aktuellen Fehler
   */
  clearError: () => void;
}

/**
 * Mode-Store vollständiger Typ (Zustand + Aktionen)
 */
export interface ModeStore extends ModeState, ModeActions {}

/**
 * Schema für die Validierung des Mode-Stores
 */
export const modeStateSchema = createStoreSchema({
  appMode: z.enum(['demo', 'live', 'development']),
  userStatus: z.union([
    z.object({ type: z.literal('guest') }),
    z.object({ type: z.literal('demo') }),
    z.object({ type: z.literal('authenticated') })
  ]),
  isDemoAccount: z.boolean(),
  lastError: z.string().optional(),
  lastErrorType: z.union([
    z.literal('network_error'),
    z.literal('auth_required'),
    z.literal('server_error'),
    z.literal('validation_error'),
    z.literal('permission_denied'),
    z.literal('invalid_state'),
    z.literal('unknown'),
    z.literal('invalid_mode'),
    z.literal('unauthorized_change'),
    z.literal('build_mismatch')
  ]).optional()
}); 