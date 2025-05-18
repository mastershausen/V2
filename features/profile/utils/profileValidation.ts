/**
 * profileValidation.ts
 * 
 * Validierungslogik für Profildaten
 */

import { HeaderMediaType } from '../types/ProfileTypes';

interface ProfileData {
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  company?: string;
  headline?: string;
  description?: string;
  headerMedia?: {
    type: HeaderMediaType;
    url: string;
    thumbnail: string;
  };
  website?: string;
  email?: string;
  phone?: string;
  [key: string]: any; // Für zusätzliche Felder
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors?: Record<string, string>;
}

/**
 * Validiert die Profildaten
 * @param data - Die zu validierenden Profildaten
 * @returns ValidationResult - Das Validierungsergebnis
 */
export function validateProfileData(data: ProfileData): ValidationResult {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};
  
  // Validiere Name (falls vorhanden)
  if (data.name !== undefined && data.name.trim() === '') {
    errors.push('Name darf nicht leer sein');
    fieldErrors.name = 'Name darf nicht leer sein';
  }

  // Validiere Benutzername
  if (!data.username || data.username.trim() === '') {
    errors.push('Benutzername ist erforderlich');
    fieldErrors.username = 'Benutzername ist erforderlich';
  } else if (data.username.length < 3) {
    errors.push('Benutzername muss mindestens 3 Zeichen lang sein');
    fieldErrors.username = 'Benutzername muss mindestens 3 Zeichen lang sein';
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.push('Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten');
    fieldErrors.username = 'Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten';
  }

  // Validiere E-Mail
  if (data.email && data.email.trim() !== '') {
    // Einfache E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('E-Mail-Adresse ist ungültig');
      fieldErrors.email = 'E-Mail-Adresse ist ungültig';
    }
  }

  // Validiere Website (falls vorhanden)
  if (data.website && data.website.trim() !== '') {
    try {
      // Versuche, eine URL zu erstellen
      new URL(data.website.startsWith('http') ? data.website : `https://${data.website}`);
    } catch (e) {
      errors.push('Website-URL ist ungültig');
      fieldErrors.website = 'Website-URL ist ungültig';
    }
  }

  // Validiere Telefonnummer (falls vorhanden)
  if (data.phone && data.phone.trim() !== '') {
    // Einfache Validierung: Mindestens 6 Ziffern
    if (!/^[+\d\s\-()]{6,}$/.test(data.phone)) {
      errors.push('Telefonnummer ist ungültig');
      fieldErrors.phone = 'Telefonnummer ist ungültig';
    }
  }

  // Beschreibung nicht zu lang (falls vorhanden)
  if (data.description && data.description.length > 1000) {
    errors.push('Beschreibung darf maximal 1000 Zeichen lang sein');
    fieldErrors.description = 'Beschreibung darf maximal 1000 Zeichen lang sein';
  }

  // Headline nicht zu lang (falls vorhanden)
  if (data.headline && data.headline.length > 100) {
    errors.push('Headline darf maximal 100 Zeichen lang sein');
    fieldErrors.headline = 'Headline darf maximal 100 Zeichen lang sein';
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
  };
} 