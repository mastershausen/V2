/**
 * Hilfsfunktionen für Profilbilder
 */

/**
 * Repräsentiert Profilbild-Daten mit klarer Unterscheidung zwischen
 * Initialen und Bild-URLs
 * 
 * Diese Struktur ist das einheitliche Format für Profilbilder in der Anwendung
 */
export interface ProfileImageData {
  /**
   * Die Initialen des Benutzers (z.B. 'AB' für Alexander Becker)
   * Werden angezeigt, wenn kein Bild vorhanden ist
   */
  initials: string;
  
  /**
   * URL zu einem Profilbild (optional)
   * Hat Vorrang vor Initialen, wenn vorhanden
   */
  imageUrl?: string;
}

/**
 * Erstellt Profilbild-Daten aus Initialen
 * @param initials Die zu verwendenden Initialen
 * @returns Ein ProfileImageData-Objekt
 */
export function createProfileInitials(initials: string): ProfileImageData {
  return {
    initials: initials.toUpperCase(),
  };
}

/**
 * Erstellt Profilbild-Daten aus einem vollständigen Namen
 * @param name Der vollständige Name, aus dem Initialen extrahiert werden
 * @returns Ein ProfileImageData-Objekt mit Initialen aus dem Namen
 */
export function createProfileInitialsFromName(name: string): ProfileImageData {
  const nameParts = name.split(' ');
  let initials: string;
  
  if (nameParts.length === 1) {
    // Bei einem Wort: Die ersten beiden Buchstaben
    initials = name.substring(0, 2).toUpperCase();
  } else {
    // Bei mehreren Wörtern: Erster Buchstabe des ersten und letzten Wortes
    initials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  }
  
  return {
    initials,
  };
}

/**
 * Erstellt Profilbild-Daten aus einer Bild-URL
 * @param imageUrl Die URL zum Profilbild
 * @param fallbackInitials Initialen als Fallback, falls das Bild nicht geladen werden kann
 * @returns Ein ProfileImageData-Objekt
 */
export function createProfileImage(imageUrl: string, fallbackInitials: string): ProfileImageData {
  return {
    initials: fallbackInitials.toUpperCase(),
    imageUrl,
  };
}

import { NuggetUser } from '../shared-components/cards/nugget-card/types';
import { UserProfile } from '../stores/types/userTypes';

/**
 * Extrahiert Profilbild-Daten aus einem UserProfile
 * @param user Das Benutzerprofil
 * @returns Profilbild-Daten mit Initialen und optionaler Bild-URL
 */
export function getProfileDataFromUser(user: UserProfile): ProfileImageData {
  // Wenn bereits vollständige Profilbild-Daten vorhanden sind oder leere Eingabe
  if (!user) {
    return createProfileInitials('??');
  }
  
  // Wenn profileImage ein String ist, diesen als URL verwenden
  if (typeof user.profileImage === 'string') {
    return createProfileImage(user.profileImage, user.name?.substring(0, 2) || '??');
  }
  
  // Wenn keine Profilbild-Daten vorhanden sind, erstelle Initialen aus dem Namen
  return createProfileInitialsFromName(user.name);
}

/**
 * Konvertiert ein UserProfile in ein NuggetUser-Objekt
 * @param profile Das Benutzerprofil
 * @returns Ein für NuggetCards kompatibles Benutzerobjekt
 */
export function createNuggetUserFromProfile(profile: UserProfile): NuggetUser {
  return {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    profileImage: getProfileDataFromUser(profile)
  };
}

/**
 * Extrahiert Profilbild-Daten aus einem NuggetUser
 * @param user Die Nugget-Benutzerdaten
 * @returns Profilbild-Daten mit Initialen und optionaler Bild-URL
 */
export function getProfileDataFromNuggetUser(user: NuggetUser): ProfileImageData {
  // Wenn bereits vollständige Profilbild-Daten vorhanden sind, verwende diese
  if (user.profileImage) {
    return user.profileImage;
  }
  
  // Fallback: Erstelle Profilbild aus dem Namen oder verwende Fragezeichen
  return user.name ? 
    createProfileInitialsFromName(user.name) : 
    createProfileInitials('??');
} 