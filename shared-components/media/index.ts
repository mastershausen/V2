/**
 * Medien-Komponenten für die App
 */

// Komponenten exportieren
export { ProfileImage } from './ProfileImage';
export { HeaderMedia } from './HeaderMedia';
export { UserroleBadge } from './UserroleBadge';

// Typen exportieren
export type { UserRole } from './UserroleBadge';

/**
 * Re-Export der Profilbild-Typen aus utils/profileImageUtils
 * 
 * Hinweis: Alle Funktionen sollten direkt aus '@/utils/profileImageUtils' importiert werden.
 * Beispiel:
 * import { ProfileImageData, createProfileInitials } from '@/utils/profileImageUtils';
 */
export { type ProfileImageData } from '@/utils/profileImageUtils'; 