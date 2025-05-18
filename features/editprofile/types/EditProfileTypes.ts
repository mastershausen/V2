/**
 * Typdefinitionen für den EditProfile-Bereich
 */

import { HeaderMediaType } from '@/features/profile/types/ProfileTypes';
import { ProfileImageData } from '@/utils/profileImageUtils';

// Erweiterte Profiltypen für das Bearbeitungsformular
export interface EditProfileFormData {
  // Basisfelder von ProfileInfo
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  companyName?: string;
  company?: string; // Firmennamefeld, das in Formularen verwendet wird
  headline?: string;
  description?: string;
  profileImage?: string | ProfileImageData | null;
  website?: string;
  location?: string;
  industry?: string;
  email?: string;
  phone?: string;
  rating?: number;
  role?: 'free' | 'pro' | 'premium';
  userType?: 'free' | 'pro' | 'premium'; // Benutzertyp für Berechtigungen
  
  // Zusätzliche Felder für das Bearbeitungsformular
  headerImage?: string | null; // Zusätzliches Feld für das Header/Cover-Bild
  
  // HeaderMedia-Objekt für erweiterte Medienunterstützung
  headerMedia?: {
    type: HeaderMediaType;
    url: string;
    thumbnail: string;
  };
}

export interface EditProfileProps {
  initialData: EditProfileFormData;
  onSave: (data: EditProfileFormData) => void;
}

export interface MediaUploadOptions {
  allowsEditing: boolean;
  aspect: [number, number];
  quality: number;
} 