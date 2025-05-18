/**
 * ProfileTypes.ts
 * 
 * Enthält Typdefinitionen für Profil-bezogene Daten
 */

/**
 * Typ für das Header-Medium (Bild, Video oder keins)
 */
export type HeaderMediaType = 'image' | 'video' | 'none';

/**
 * Schnittstellendefinition für Header-Media-Daten
 */
export interface HeaderMedia {
  /** Typ des Mediums */
  type: HeaderMediaType;
  /** URL zum Medium */
  url: string;
  /** URL zum Vorschaubild (bei Videos) */
  thumbnail: string;
}

/**
 * Profilinformationen Schnittstelle
 */
export interface ProfileInfo {
  /** Vollständiger Name des Benutzers */
  name?: string;
  /** Vorname des Benutzers */
  firstName?: string;
  /** Nachname des Benutzers */
  lastName?: string;
  /** Benutzername für den Login und Kurzreferenz */
  username?: string;
  /** Firmenname */
  companyName?: string;
  /** Profilüberschrift/Berufsbezeichnung */
  headline?: string;
  /** Beschreibung/Bio des Benutzers */
  description?: string;
  /** Profilbild-URL oder Daten */
  profileImage?: string | null;
  /** Header-Media für das Profil */
  headerMedia?: HeaderMedia;
  /** Website des Benutzers/der Firma */
  website?: string;
  /** Standort des Benutzers */
  location?: string;
  /** Branche des Benutzers */
  industry?: string;
  /** E-Mail-Adresse des Benutzers */
  email?: string;
  /** Telefonnummer */
  phone?: string;
  /** Bewertung des Benutzers */
  rating?: number;
  /** Benutzerrolle */
  role?: 'free' | 'pro' | 'premium';
} 