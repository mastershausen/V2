/**
 * Konstanten und Hilfsfunktionen für den userStore
 */

import { UserProfileApi } from '../../services/auth/types';
import { UserProfile, UserRole } from '../types/userTypes';

/**
 * Demo-Benutzer für App-Store-Prüfer
 */
export const DEMO_USER: UserProfile = {
  id: 'demo-user',
  username: 'demo_user',
  firstName: 'Demo',
  lastName: 'User',
  name: 'Demo User',
  email: 'demo@solvbox.com',
  profileImage: undefined, // Kein Profilbild für Demo-Benutzer
  isVerified: false,
  joinDate: new Date(),
  role: 'free',
};

/**
 * Hilfsfunktionen für Mock-Daten
 */

/**
 * Mock-Benutzer für App-Store-Prüfer anpassen
 * @param mockUser - Der Basis-Mock-Benutzer
 * @returns Normalisiertes UserProfile
 */
export function normalizeMockUser(mockUser: any): UserProfile {
  return {
    ...mockUser,
    username: mockUser.firstName.toLowerCase() + mockUser.lastName.toLowerCase(),
    isVerified: true,
    joinDate: new Date(Date.now() - Math.random() * 31536000000), // Zufälliges Datum innerhalb des letzten Jahres
  };
}

/**
 * Konvertiert ein API-Benutzerprofil in unser internes Modell
 * @param apiProfile - Das Profil aus der API
 * @returns Konvertiertes UserProfile für internen Gebrauch
 */
export function convertApiProfileToUser(apiProfile: UserProfileApi): Partial<UserProfile> {
  // Hier sollte die tatsächliche Konvertierungslogik implementiert werden
  // Aktuell nur ein einfaches Mapping
  return {
    id: apiProfile.id,
    username: apiProfile.username || '',
    firstName: apiProfile.first_name || '',
    lastName: apiProfile.last_name || '',
    name: `${apiProfile.first_name || ''} ${apiProfile.last_name || ''}`.trim(),
    email: apiProfile.email || '',
    profileImage: apiProfile.profile_image ?
      apiProfile.profile_image : undefined,
    headerImage: apiProfile.header_image || undefined,
    companyName: apiProfile.company_name || undefined,
    headline: apiProfile.headline || undefined,
    description: apiProfile.description || undefined,
    website: apiProfile.website || undefined,
    location: apiProfile.location || undefined,
    industry: apiProfile.industry || undefined,
    phone: apiProfile.phone || undefined,
    isVerified: apiProfile.is_verified || false,
    joinDate: apiProfile.created_at ? new Date(apiProfile.created_at) : new Date(),
    role: (apiProfile.role as UserRole) || 'free',
  };
} 