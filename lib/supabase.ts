import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import 'react-native-url-polyfill/auto';
import { config, shouldUseMockData } from '../config/app/env';

// Supabase-Konfiguration aus der Umgebungskonfiguration holen
const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseAnonKey;

// Mockup eines Supabase-Clients für die Entwicklung
// Dies verhindert Fehler, aber stellt keine echte Verbindung her
const supabaseMock = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: null }),
    signInWithIdToken: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: async () => ({ error: null }),
    }),
    insert: async () => ({ error: null }),
  }),
};

// Echter Supabase-Client-Generator für spätere Verwendung
const createRealClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
};

// Exportiere den richtigen Client basierend auf der Konfiguration
// Während der Entwicklung verwenden wir den Mock-Client
// In zukünftigen Updates wird der echte Client verwendet, wenn useMockData false ist
export const supabase = shouldUseMockData() ? supabaseMock : createRealClient();

/**
 * Supabase Klient
 * 
 * Wird in späteren Versionen der App verwendet
 */ 