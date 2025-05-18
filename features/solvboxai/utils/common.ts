/**
 * common - Allgemeine Hilfsfunktionen
 * 
 * Diese Datei enthält allgemeine Hilfsfunktionen, die in verschiedenen
 * Teilen des SolvboxAI-Features verwendet werden können.
 */

/**
 * Verzögert die Ausführung um die angegebene Zeit
 * @param ms Verzögerung in Millisekunden
 * @returns Promise, das nach der angegebenen Zeit aufgelöst wird
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formatiert ein Datum in einen lesbaren String
 * @param date Das zu formatierende Datum
 * @param includeTime Ob die Uhrzeit mit formatiert werden soll
 * @returns Formatierter Datumsstring
 */
export const formatDate = (date: Date | string, includeTime = false): string => {
  const actualDate = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return actualDate.toLocaleDateString('de-DE', options);
};

/**
 * Generiert eine zufällige ID
 * @returns Zufällige ID als String
 */
export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Kürzt einen Text auf die angegebene Länge
 * @param text Der zu kürzende Text
 * @param maxLength Maximale Länge des Textes
 * @returns Gekürzter Text mit Ellipsis, wenn nötig
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Kürzt einen String auf eine bestimmte Länge
 * @param str Der zu kürzende String
 * @param maxLength Maximale Länge (Standardwert: 100)
 * @param suffix Suffix für gekürzte Strings (Standardwert: '...')
 * @returns Gekürzter String
 */
export const truncateString = (str: string, maxLength = 100, suffix = '...'): string => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Debounce-Funktion für die Begrenzung der Aufrufhäufigkeit von Funktionen
 * @param func Die zu debouncende Funktion
 * @param wait Wartezeit in Millisekunden
 * @returns Debounced-Funktion
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
} 