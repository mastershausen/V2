/**
 * UserService - Verwaltung von Benutzerdaten und Profilen
 * 
 * Dieser Service kapselt alle Operationen rund um Benutzerprofile und
 * stellt eine einheitliche Schnittstelle für Stores und Komponenten bereit,
 * sowohl für Echtdaten als auch für Mock-Daten.
 */

import { shouldUseMockData } from '@/config/app/env';
import { sessionService } from '@/features/auth/services';
import { IService } from '@/utils/service/serviceRegistry';

import ApiService from './ApiService';
import { MOCK_USERS } from './auth/mockData';
import { AuthResponse, UserProfileApi } from './auth/types';
import AuthService from './AuthService';
import { UserProfile, UserRole } from '../stores/types/userTypes';
import { logger } from '../utils/logger';

/**
 * UserService stellt Methoden zur Verfügung, um mit Benutzerdaten zu arbeiten
 * Implementiert das IService-Interface für die ServiceRegistry.
 */
class UserService implements IService {
  private apiService: ApiService;
  private authService: AuthService;
  private cachedProfile: UserProfile | null = null;
  
  /**
   *
   * @param apiService
   * @param authService
   */
  constructor(apiService?: ApiService, authService?: AuthService) {
    this.apiService = apiService || new ApiService();
    this.authService = authService || new AuthService();
  }
  
  /**
   * Initialisierung des User-Service
   */
  async init(): Promise<void> {
    logger.debug('[UserService] Initialisiert');
    // Vorausfüllen des Caches für schnellere erste Abfrage
    this.cachedProfile = null;
  }

  /**
   * Ressourcen freigeben
   */
  async dispose(): Promise<void> {
    logger.debug('[UserService] Ressourcen freigegeben');
    this.cachedProfile = null;
  }

  /**
   * Normalisiert ein Benutzerprofil für die interne Verwendung
   * @param user
   */
  private normalizeUserProfile(user: UserProfileApi): UserProfile {
    return {
      id: user.id,
      name: user.name || user.email.split('@')[0],
      email: user.email,
      role: (user.role as UserRole) || 'free',
      profileImage: user.profileImage || null,
      username: user.username || user.email.split('@')[0],
      isVerified: user.is_verified || false,
      joinDate: new Date()
    };
  }
  
  /**
   * Konvertiert ein API-Profil in ein internes UserProfile
   * @param user
   */
  private convertApiProfile(user: UserProfileApi): UserProfile {
    return {
      id: user.id,
      name: user.name || user.email.split('@')[0],
      email: user.email,
      role: (user.role as UserRole) || 'free',
      profileImage: user.profileImage || null,
      username: user.username || user.email.split('@')[0],
      isVerified: user.is_verified || false,
      joinDate: new Date()
    };
  }

  /**
   * Ruft den aktuell angemeldeten Benutzer ab
   * @param forceRefresh True, um den Cache zu umgehen
   * @returns Promise mit dem Benutzerprofil oder null bei Fehler
   */
  async getCurrentUser(forceRefresh: boolean = false): Promise<UserProfile | null> {
    try {
      // Cache verwenden, wenn verfügbar und kein Refresh erzwungen wird
      if (this.cachedProfile && !forceRefresh) {
        return this.cachedProfile;
      }
      
      // Im Demo/Entwicklungsmodus verwenden wir den Mock-Mechanismus
      if (shouldUseMockData()) {
        // In der realen Implementierung würden wir hier die Benutzer-ID aus der Session holen
        const session = await sessionService.loadSession();
        if (!session?.user) return null;
        
        const userId = session.user.id;
        
        // Verwende direkt getMockUser anstelle des Auth-Services
        const mockUser = this.getMockUser(userId);
        if (!mockUser) {
          logger.error('Fehler beim Abrufen des Benutzerprofils: User nicht gefunden');
          return null;
        }
        
        this.cachedProfile = mockUser;
        return this.cachedProfile;
      }

      // In der Produktionsumgebung direkt die API aufrufen
      const userProfile = await this.apiService.get<UserProfileApi>('/users/me');
      
      // Validierung des Benutzerprofils
      if (!userProfile || !userProfile.id) {
        logger.error('Ungültiges Benutzerprofil vom Server erhalten');
        return null;
      }
      
      this.cachedProfile = this.convertApiProfile(userProfile);
      return this.cachedProfile;
    } catch (error) {
      logger.error('Fehler beim Abrufen des aktuellen Benutzers:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  /**
   * Sucht einen Mock-Benutzer anhand seiner ID
   * @param id Benutzer-ID
   * @returns Benutzerprofil oder null, wenn nicht gefunden
   */
  getMockUser(id: string): UserProfile | null {
    const mockUser = MOCK_USERS.find(user => user.id === id);
    if (!mockUser) return null;
    
    // Konvertiere in UserProfile-Format
    return {
      id: mockUser.id,
      username: mockUser.username,
      firstName: mockUser.first_name,
      lastName: mockUser.last_name,
      name: `${mockUser.first_name} ${mockUser.last_name}`,
      email: mockUser.email,
      profileImage: mockUser.profile_image || undefined,
      headerImage: mockUser.header_image || undefined,
      companyName: mockUser.company_name || undefined,
      headline: mockUser.headline || undefined,
      description: mockUser.description || undefined,
      website: mockUser.website || undefined,
      location: mockUser.location || undefined,
      industry: mockUser.industry || undefined,
      phone: mockUser.phone || undefined,
      isVerified: mockUser.is_verified,
      joinDate: new Date(mockUser.created_at),
      rating: mockUser.rating || undefined,
      role: mockUser.role as UserRole,
    };
  }

  /**
   * Ruft alle Mock-Benutzer ab
   * @returns Array mit allen Mock-Benutzerprofilen
   */
  getAllMockUsers(): UserProfile[] {
    return MOCK_USERS.map(user => this.getMockUser(user.id)!);
  }

  /**
   * Aktualisiert das Benutzerprofil
   * @param id Benutzer-ID
   * @param updates Zu aktualisierende Felder
   * @returns Promise mit Erfolgs-/Fehlerinformationen
   */
  async updateUserProfile(
    id: string, 
    updates: Partial<UserProfile>
  ): Promise<AuthResponse> {
    try {
      // Konvertiere das interne Format in das API-Format
      const apiUpdates: Partial<UserProfileApi> = {};
      
      if (updates.firstName) apiUpdates.first_name = updates.firstName;
      if (updates.lastName) apiUpdates.last_name = updates.lastName;
      if (updates.username) apiUpdates.username = updates.username;
      if (updates.companyName) apiUpdates.company_name = updates.companyName;
      if (updates.headline) apiUpdates.headline = updates.headline;
      if (updates.description) apiUpdates.description = updates.description;
      if (updates.website) apiUpdates.website = updates.website;
      if (updates.profileImage) {
        // Konvertiere ProfileImageData zu String oder behalte String/null bei
        if (typeof updates.profileImage === 'object' && updates.profileImage !== null) {
          apiUpdates.profile_image = updates.profileImage.imageUrl || null;
        } else {
          apiUpdates.profile_image = updates.profileImage;
        }
      }
      if (updates.headerImage) apiUpdates.header_image = updates.headerImage;
      if (updates.location) apiUpdates.location = updates.location;
      if (updates.industry) apiUpdates.industry = updates.industry;
      if (updates.phone) apiUpdates.phone = updates.phone;
      if (updates.role) apiUpdates.role = updates.role;
      if (updates.rating !== undefined) apiUpdates.rating = updates.rating;
      
      // Cache invalidieren
      this.cachedProfile = null;
      
      // Im Dev/Demo-Modus simulieren wir die Update-Operation
      if (shouldUseMockData()) {
        logger.debug(`[UserService] Simuliere Profilupdate für Benutzer ${id}`);
        return { success: true };
      }
      
      // In der Produktionsumgebung die API verwenden
      await this.apiService.put(`/users/${id}/profile`, apiUpdates);
      return { success: true };
    } catch (error) {
      logger.error('Fehler beim Aktualisieren des Benutzerprofils:', error instanceof Error ? error.message : String(error));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      };
    }
  }
}

export default UserService; 