/**
 * @file features/settings/store/schema.ts
 * @description Schema-Definitionen für den Settings-Store
 */

import { z } from 'zod';

import { createStoreSchema } from '@/utils/store/migrationManager';

/**
 * Schema für die App-Einstellungen
 */
export const settingsStateSchema = createStoreSchema({
  // Darstellung
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  
  // Benachrichtigungen
  notifications: z.boolean(),
  
  // Datenschutzeinstellungen
  privacySettings: z.object({
    analytics: z.boolean(),
    marketing: z.boolean()
  }),
  
  // Navigation
  lastScreens: z.array(z.string()),
  
  // Erweiterte Einstellungen
  userPreferences: z.record(z.any()),
  
  // Allgemeine Store-Felder
  isLoading: z.boolean(),
  error: z.string().nullable()
});

/**
 * Typ für den Settings-Store-Zustand
 * Generiert aus dem Schema
 */
export type SettingsState = z.infer<typeof settingsStateSchema>;

/**
 * Initialer Zustand für den Settings-Store
 */
export const initialSettingsState: SettingsState = {
  theme: 'system',
  language: 'de',
  notifications: true,
  privacySettings: {
    analytics: true,
    marketing: false
  },
  lastScreens: [],
  userPreferences: {},
  isLoading: false,
  error: null
}; 