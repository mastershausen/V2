/**
 * profileUtils - Hilfsfunktionen für die Verarbeitung von Profildaten
 */



import {UserType} from '@/features/auth/types';
import { ProfileImageData } from '@/utils/profileImageUtils';

// ProfileTypes-Definitionen hier statt aus dem features/profile importieren
export interface ProfileHeaderMedia {
  id?: string;        // Optional, damit wir leichter Objekte erstellen können
  type: HeaderMediaType;
  url: string;
  preview?: string;
  thumbnail?: string;
}

export type HeaderMediaType = 'video' | 'image' | 'none';

// Für ältere Codeteile, die noch 'free' statt 'REGISTERED_USER' verwenden
export type LegacyUserType = 'free' | 'pro' | 'premium';

export interface ProfileData {
  name: string;
  company?: string;
  avatar?: string;
  profileImage?: string | ProfileImageData | null;
  userType: UserType | LegacyUserType;
  headerMedia?: ProfileHeaderMedia;
  rating: number;
  website?: string;
  headline?: string;
  description?: string;
  location?: string;
  email?: string;
  phone?: string;
  industry?: string;
}

/**
 * Definition eines Eingabe-Typs für die Profilnormalisierung
 * Enthält alle möglichen Felder, die als Eingabe übergeben werden können
 */
interface ProfileDataInput {
  id?: string;
  name?: string;
  companyName?: string;
  company?: string;
  profileImage?: string | ProfileImageData | null;
  avatar?: string | {uri?: string};   // Alte avatar-Eigenschaft
  avatarUri?: string;                 // Neue avatarUri-Eigenschaft
  role?: string;
  userType?: string;
  headerMedia?: Partial<ProfileHeaderMedia> | null;
  rating?: number;
  website?: string;
  headline?: string;
  description?: string;
  location?: string;
  industry?: string;
  email?: string;
  phone?: string;
  demoMode?: boolean;
  userStatus?: string;
  initials?: string;
  stats?: {
    connectionsCount?: number;
    reviewsCount?: number;
    reviewsAverage?: number;
  };
}

function isObjectWithType(val: unknown): val is { type: string } {
  return typeof val === 'object' && val !== null && 'type' in val;
}

/**
 * Normalisiert Profildaten und stellt sicher, dass alle erforderlichen Felder vorhanden sind
 * Unabhängig davon, ob die Daten aus echten Benutzerdaten oder Mock-Daten stammen
 * @param data Eingabedaten des Profils, die normalisiert werden sollen
 */
export function normalizeProfileData(data: ProfileDataInput): ProfileData {
  if (!data) {
    console.warn('ProfileUtils: Versuch, null/undefined Profildaten zu normalisieren');
    return getDefaultProfileData();
  }

  // TEMPORÄR: Debug-Ausgabe für eingehende Daten
  console.log('----------- NORMALIZE PROFILE DATA DEBUG -----------');
  console.log('Originaldaten - Name:', data.name || 'NICHT VORHANDEN');
  console.log('Originaldaten - Headline:', data.headline || 'NICHT VORHANDEN');
  console.log('Originaldaten - Description:', data.description ? data.description.substring(0, 50) + '...' : 'NICHT VORHANDEN');
  console.log('Originaldaten - Role/UserType:', data.role || data.userType || 'NICHT VORHANDEN');
  console.log('--------------------------------------------------');

  // Default headerMedia basierend auf userType
  const defaultHeaderMedia: ProfileHeaderMedia = {
    type: 'none',
    url: '',
    thumbnail: ''
  };

  // Standardeinstellung für alle Nutzertypen: Gradient statt Video/Bild
  const role = data.role || data.userType || 'free';
  
  // headerMedia-Daten überprüfen und normalisieren
  // Stelle sicher, dass wir immer ein vollständiges ProfileHeaderMedia-Objekt haben
  const headerMedia: ProfileHeaderMedia = {
    type: data.headerMedia?.type || 'none',
    url: data.headerMedia?.url || '',
    thumbnail: data.headerMedia?.thumbnail || ''
  };
  
  // Wenn headerMedia ein Video-Typ ist, aber keine URL hat
  if (headerMedia.type === 'video' && !headerMedia.url) {
    headerMedia.url = defaultHeaderMedia.url;
  }
  
  // Wenn headerMedia ein Bild-Typ ist, aber keine URL hat
  if (headerMedia.type === 'image' && !headerMedia.url) {
    headerMedia.url = defaultHeaderMedia.url;
  }

  // Profilbild-Handling: Bei neuem Benutzer kein Standard-Profilbild setzen
  let profileImage = data.profileImage;
  if (profileImage === null || profileImage === undefined) {
    // Wenn kein Profilbild gesetzt ist, verwenden wir null, damit die 
    // ProfileHeader-Komponente den Avatar-Buchstaben anzeigt
    profileImage = null;
  }

  // Headline und Beschreibung sicherstellen, wenn nicht vorhanden
  let headline = data.headline;
  let description = data.description;
  
  // Formatierte Headline mit Name und benutzerdefiniertem Text
  // Format: "Vorname Nachname | Benutzerdefinierter Text"
  if (data.name && data.name.trim() !== '') {
    if (!headline || headline.trim() === '') {
      // Wenn keine benutzerdefinierte Headline vorhanden ist, nur den Namen verwenden
      headline = `${data.name} | Mein Profil`;
    } else if (!headline.includes('|')) {
      // Wenn eine Headline existiert, aber kein "|" enthält, Format anwenden
      headline = `${data.name} | ${headline}`;
    }
    // Wenn die Headline bereits ein "|" enthält, nehmen wir an, dass sie bereits das richtige Format hat
  } else {
    // Fallback, wenn kein Name vorhanden ist
    if (!headline || headline.trim() === '') {
      headline = 'Mein Profil';
    }
  }
  
  // Wenn keine Beschreibung vorhanden ist, erstellen wir eine
  if (!description || description.trim() === '') {
    description = 'Hier können Sie Ihre Beschreibung hinzufügen und Ihre Expertise präsentieren.';
  }
  
  // Debug-Ausgabe für die Beschreibung
  console.log('PROFILE UTILS DEBUG - Beschreibung:');
  console.log('Original Description:', description);
  console.log('UserStatus:', data.userStatus);
  console.log('Role:', role);
  console.log('DemoMode:', data.demoMode);
  
  // Prüfen, ob ZUERST der Demo-Modus aktiv ist, bevor wir rollenspezifische Texte setzen
  const isDemoMode = data.demoMode === true || (isObjectWithType(data.userStatus) && data.userStatus.type === 'demo');
  if (isDemoMode) {
    // Im Demo-Modus immer einen spezifischen Text setzen, unabhängig vom Standardtext
    description = 'Im Demo-Modus zeigen wir ein Beispielprofil. Sie können es später personalisieren.';
    console.log('DEMO MODUS: Text wurde gesetzt.');
    return {
      name: data.name || '',
      company: data.companyName || data.company || '',
      avatar: data.initials || (data.name ? data.name.substring(0, 2).toUpperCase() : 'UN'),
      profileImage: profileImage,
      userType: role as UserType,
      headerMedia: headerMedia,
      rating: data.rating || 0,
      website: data.website || '',
      headline: headline,
      description: description,
      location: data.location || '',
      industry: data.industry || '',
      email: data.email || '',
      phone: data.phone || ''
    };
  }
  
  // DANACH rollenspezifische Texte setzen, aber nur wenn es sich um den Standard-Fallback handelt
  if (description === 'Hier können Sie Ihre Beschreibung hinzufügen und Ihre Expertise präsentieren.') {
    if (role === 'premium') {
      description = 'Als Premium-Nutzer können Sie detaillierte Beschreibungen Ihrer Expertise und Erfahrung hinzufügen.';
      console.log('PREMIUM ROLE: Text wurde gesetzt');
    } else if (role === 'pro') {
      description = 'Als Pro-Nutzer können Sie Ihre beruflichen Qualifikationen präsentieren.';
      console.log('PRO ROLE: Text wurde gesetzt');
    } else if (role === 'free') {
      description = 'Als Free-Nutzer können Sie die Grundfunktionen nutzen und Ihre Kernkompetenzen darstellen.';
      console.log('FREE ROLE: Text wurde gesetzt');
    }
  }
  
  // Webseite sicherstellen (optional)
  const website = data.website || '';

  // Konstruiere ein normalisiertes ProfileData-Objekt
  return {
    name: data.name || '',
    company: data.companyName || data.company || '',
    avatar: data.initials || (data.name ? data.name.substring(0, 2).toUpperCase() : 'UN'),
    profileImage: profileImage,
    userType: role as UserType,
    headerMedia: headerMedia,
    rating: data.rating || 0,
    website: website,
    headline: headline,
    description: description,
    location: data.location || '',
    industry: data.industry || '',
    email: data.email || '',
    phone: data.phone || ''
  };
}

/**
 * Liefert einen Standardwert für ein leeres Profil
 */
function getDefaultProfileData(): ProfileData {
  return {
    name: 'Unbekannter Benutzer',
    company: '',
    avatar: 'UN',
    profileImage: null,
    userType: 'free',
    headerMedia: {
      type: 'none',
      url: '',
      thumbnail: ''
    },
    rating: 0,
    website: '',
    headline: 'Willkommen auf meinem Profil',
    description: 'Hier können Sie Ihre Beschreibung hinzufügen und Ihre Expertise präsentieren.',
    location: '',
    industry: '',
    email: '',
    phone: ''
  };
} 