/**
 * String-Utility-Funktionen
 * 
 * Sammlung von Hilfsfunktionen für String-Operationen
 */

/**
 * Prüft, ob ein String eine gültige Bild-URL ist
 * @param url Der zu prüfende String
 * @returns true, wenn der String eine gültige Bild-URL ist, sonst false
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Prüfe, ob der String eine URL ist
  try {
    // Versuche, eine URL zu erstellen
    new URL(url);
  } catch (e) {
    // Bei ungültiger URL-Syntax false zurückgeben
    return false;
  }
  
  // Allgemeine Prüfung auf bekannte Bild-Dateiendungen
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowercaseUrl = url.toLowerCase();
  
  // Prüfe, ob die URL eine bekannte Bild-Dateiendung hat
  for (const ext of imageExtensions) {
    if (lowercaseUrl.endsWith(ext)) {
      return true;
    }
  }
  
  // Alternativ: Prüfe auf Muster wie "image/jpeg" im URL-Pfad
  if (lowercaseUrl.includes('image/')) {
    return true;
  }
  
  // Spezielle Fallbacks für bekannte Bild-Hoster
  if (
    lowercaseUrl.includes('cloudinary.com') ||
    lowercaseUrl.includes('imgur.com') ||
    lowercaseUrl.includes('unsplash.com') ||
    (lowercaseUrl.includes('amazonaws.com') && lowercaseUrl.includes('images'))
  ) {
    return true;
  }
  
  return false;
}
