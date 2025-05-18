/**
 * Hilfsfunktionen für Datumsformatierungen
 */

/**
 * Formatiert ein Datum als benutzerfreundliche relative Zeit 
 * (Heute, Gestern, Vor X Tagen, Vor einer Woche, etc.)
 * @param date Das zu formatierende Datum
 * @returns Formatierte Zeichenkette
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  
  // Hilfsfunktion zum Prüfen, ob zwei Daten am gleichen Tag sind
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };
  
  // Gestern ermitteln
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Berechne die Differenz in Tagen
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  // Benutzerfreundliche Zeitangaben
  if (isSameDay(date, now)) {
    // Heute
    if (diffInSecs < 60) {
      return 'Gerade eben';
    } else if (diffInMins < 60) {
      return `Vor ${diffInMins} ${diffInMins === 1 ? 'Minute' : 'Minuten'}`;
    } else {
      return `Vor ${diffInHours} ${diffInHours === 1 ? 'Stunde' : 'Stunden'}`;
    }
  } else if (isSameDay(date, yesterday)) {
    // Gestern
    return 'Gestern';
  } else if (diffInDays < 7) {
    // Innerhalb einer Woche
    return `Vor ${diffInDays} ${diffInDays === 1 ? 'Tag' : 'Tagen'}`;
  } else if (diffInWeeks === 1) {
    // Genau eine Woche
    return 'Vor einer Woche';
  } else if (diffInWeeks < 2) {
    // Weniger als zwei Wochen
    return `Vor ${diffInDays} Tagen`;
  } else {
    // Älter als zwei Wochen - formatiertes Datum
    return formatDate(date);
  }
}

/**
 * Formatiert ein Datum in lokalisiertem Format (TT.MM.JJJJ)
 * @param date Das zu formatierende Datum
 * @returns Formatierte Zeichenkette
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatiert ein Datum in lokalisiertem Format mit Uhrzeit (TT.MM.JJJJ, HH:MM)
 * @param date Das zu formatierende Datum
 * @returns Formatierte Zeichenkette
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)}, ${date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
} 