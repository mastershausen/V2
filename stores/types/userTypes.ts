/**
 * Typdefinitionen für den userStore
 */




import { type ProfileImageData } from '../../utils/profileImageUtils';

/**
 * Verfügbare Benutzerrollen
 */
export type UserRole = 'free' | 'pro' | 'premium' | 'admin';

/**
 * Benutzerprofiltyp
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  profileImage?: string | ProfileImageData | null;
  headerImage?: string | null;
  companyName?: string;
  headline?: string;
  website?: string;
  description?: string;
  location?: string;
  industry?: string;
  isVerified: boolean;
  joinDate: Date;
  rating?: number;
}

/**
 * Authentifizierungsstatus
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

/**
 * Basiszustand des userStores
 * Enthält nur die State-Eigenschaften, keine Aktionen
 */
export interface UserState {
  // Zustandsdaten
  authStatus: AuthStatus;
  user: UserProfile | null;
  token: string | null;
  
  // Gespeicherte Authenticated-Modus-Sitzung
  savedAuthenticatedSession: {
    user: UserProfile | null;
    token: string | null;
    authStatus: AuthStatus;
    hasLoggedInToLiveMode?: boolean;
  } | null;
}

/**
 * Vollständiger userStore-Typ mit Aktionen und Hilfsfunktionen
 */
export interface UserStore extends UserState {
  // Aktionen
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<UserProfile> & { password: string }) => Promise<boolean>;
  fetchCurrentUser: () => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  changeUserRole: (newRole: UserRole) => Promise<boolean>;
  
  // Demo & Mock-Daten Funktionen
  getMockUserById: (userId: string) => UserProfile | null;
  getAllMockUsers: () => UserProfile[];
  
  // Hilfsfunktionen
  isAuthenticated: () => boolean;
  getCurrentUser: () => UserProfile | null;
  
  // Rollenbezogene Hilfsfunktionen
  hasRole: (role: UserRole) => boolean;
  hasMinimumRole: (minimumRole: UserRole) => boolean;
  isAdmin: () => boolean;
  isPremium: () => boolean;
  isPro: () => boolean;
  
  // Profilberechtigungen
  getProfilePermissions: () => {
    canEdit: boolean;
    canViewFullProfile: boolean;
    canAccessAdminFeatures: boolean;
    isDemoMode: boolean;
    isOwner: boolean;
  };
  
  // Zusätzliche Debug-Funktionen
  resetAuth: () => Promise<void>;
  clearStorage: () => Promise<void>;
}

/**
 * Hierarchie der Rollen für Berechtigungsprüfungen
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'free': 0,
  'pro': 1,
  'premium': 2,
  'admin': 3
}; 