/**
 * Schnittstellen und Typen für die NuggetCard-Komponente
 */

import { ProfileImageData } from '../../../../utils/profileImageUtils';

/**
 * Benutzerinformationen für die NuggetCard
 * Es wird nur die ID als erforderlich gespeichert, die restlichen
 * Informationen werden dynamisch vom UserStore abgerufen
 */
export interface NuggetUser {
  id: string;
  name?: string;  // Optional, wird dynamisch aus dem UserStore geholt
  username?: string;  // Optional, wird dynamisch aus dem UserStore geholt
  
  /**
   * Profilbild-Daten mit Initialen und optionaler Bild-URL
   * Dies ist das einheitliche Format für Profilbilder
   */
  profileImage?: ProfileImageData;
}

/**
 * Mediendaten für die NuggetCard
 */
export interface NuggetMedia {
  type: 'image' | 'video' | 'link';
  url: string;
  thumbnailUrl?: string;
  aspectRatio?: number;
  title?: string; // Für Links: Titel der verlinkten Seite
  description?: string; // Für Links: Beschreibung der verlinkten Seite
}

/**
 * Hauptdaten für ein Nugget
 */
export interface NuggetData {
  id: string;
  user: NuggetUser;
  timestamp: string | Date;
  content: string;
  helpfulCount: number; // "Das hilft" Counter statt Likes
  commentCount: number;
  isHelpful: boolean; // Ob der aktuelle Nutzer es als hilfreich markiert hat
  isSaved: boolean; // Ob der aktuelle Nutzer es gespeichert hat
  media?: NuggetMedia[];
  tags?: string[];
} 