/**
 * @file services/auth/types.ts
 * @description Typdefinitionen für die alte Auth-API.
 * Teil des Adapter-Patterns für Kompatibilität.
 */

import { User } from '../../types/auth';

/**
 * API-Antworttyp für Authentifizierungsoperationen
 */
export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

/**
 * API-Benutzerprofilstruktur
 */
export interface UserProfileApi {
  id: string;
  email: string;
  name?: string;
  role?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string | null;
  header_image?: string | null;
  company_name?: string;
  headline?: string;
  website?: string;
  description?: string;
  location?: string;
  industry?: string;
  phone?: string;
  is_verified?: boolean;
  created_at?: string;
  rating?: number;
  profileImage?: string | null;
}

/**
 * MockUser-Struktur für MOCK_USERS
 * Wird von appModeStore verwendet
 */
export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  header_image: string | null;
  company_name: string;
  headline: string;
  website: string;
  description: string;
  location: string;
  industry: string;
  phone: string;
  is_verified: boolean;
  created_at: string;
  rating: number;
  additionalProperties?: Record<string, unknown>;
} 