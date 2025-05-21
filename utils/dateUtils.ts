/**
 * Hilfsfunktionen für Datumsformatierungen
 */

import { useTranslation } from 'react-i18next';
import { getCurrentLanguage } from '@/i18n/config';

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

  // Wir benötigen einen Import von i18next, da dies eine reine Hilfsfunktion ist
  // und nicht innerhalb einer React-Komponente läuft (kein useTranslation Hook)
  const language = getCurrentLanguage();
  const i18n = require('@/i18n/config').default;

  // Benutzerfreundliche Zeitangaben
  if (isSameDay(date, now)) {
    // Heute
    if (diffInSecs < 60) {
      return i18n.t('nugget.interaction.timeTerms.justNow');
    } else if (diffInMins < 60) {
      return diffInMins === 1 
        ? i18n.t('nugget.interaction.timeTerms.minuteAgo') 
        : i18n.t('nugget.interaction.timeTerms.minutesAgo', { count: diffInMins });
    } else {
      return diffInHours === 1 
        ? i18n.t('nugget.interaction.timeTerms.hourAgo') 
        : i18n.t('nugget.interaction.timeTerms.hoursAgo', { count: diffInHours });
    }
  } else if (isSameDay(date, yesterday)) {
    // Gestern
    return i18n.t('nugget.interaction.timeTerms.yesterday');
  } else if (diffInDays < 7) {
    // Innerhalb einer Woche
    return diffInDays === 1 
      ? i18n.t('nugget.interaction.timeTerms.dayAgo') 
      : i18n.t('nugget.interaction.timeTerms.daysAgo', { count: diffInDays });
  } else if (diffInWeeks === 1) {
    // Genau eine Woche
    return i18n.t('nugget.interaction.timeTerms.weekAgo');
  } else if (diffInWeeks < 2) {
    // Weniger als zwei Wochen
    return i18n.t('nugget.interaction.timeTerms.daysAgo', { count: diffInDays });
  } else {
    // Älter als zwei Wochen - formatiertes Datum
    return formatDate(date);
  }
}

/**
 * Formatiert ein Datum in lokalisiertem Format (TT.MM.JJJJ oder MM/DD/YYYY je nach Sprache)
 * @param date Das zu formatierende Datum
 * @returns Formatierte Zeichenkette
 */
export function formatDate(date: Date): string {
  const language = getCurrentLanguage();
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatiert ein Datum in lokalisiertem Format mit Uhrzeit
 * @param date Das zu formatierende Datum
 * @returns Formatierte Zeichenkette
 */
export function formatDateTime(date: Date): string {
  const language = getCurrentLanguage();
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  const separator = language === 'de' ? ', ' : ', ';
  
  return `${formatDate(date)}${separator}${date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
} 