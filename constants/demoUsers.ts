/**
 * Konstanten für Demo-Benutzer
 * 
 * Diese Datei enthält vordefinierte Demo-Benutzer für die Anwendung.
 */
import { UserProfile } from '@/types/user';

/**
 * Alexander Becker - Standard-Demo-Benutzer
 */
export const ALEXANDER_BECKER: UserProfile = {
  id: 'demo-user-alexander',
  email: 'alexander@beckerundpartner.de',
  name: 'Alexander Becker',
  username: 'alexander',
  role: 'admin',
  isVerified: true,
  joinDate: new Date('2022-01-01'),
  profileImage: 'https://example.com/alexander.jpg',
  userType: 'DEMO_USER'
};

/**
 * Liste aller verfügbaren Demo-Benutzer
 */
export const DEMO_USERS = {
  alexander: ALEXANDER_BECKER
};

/**
 * Standard-Demo-Benutzer, der angezeigt wird, wenn kein Benutzer angemeldet ist
 */
export const DEFAULT_DEMO_USER = ALEXANDER_BECKER; 