import { SearchSuggestion } from '../types/search';
import i18n from '@/i18n/config';

/**
 * Standard-Suchvorschläge für den Home-Screen
 * 
 * Diese Vorschläge werden angezeigt, wenn keine personalisierten
 * Vorschläge verfügbar sind oder der Benutzer noch keine Suchanfragen
 * durchgeführt hat.
 * 
 * Die Vorschläge sind nach Relevanz und Beliebtheit sortiert.
 */
export const DEFAULT_SUGGESTIONS: SearchSuggestion[] = [
  { 
    id: '1', 
    label: 'Steuern sparen', 
    icon: 'money' 
  },
  { 
    id: '2', 
    label: 'Vermögen schützen', 
    icon: 'shield' 
  },
  { 
    id: '3', 
    label: 'Kunden gewinnen', 
    icon: 'users' 
  },
  { 
    id: '4', 
    label: 'Fixkosten senken', 
    icon: 'arrow-down' 
  },
  { 
    id: '5', 
    label: 'Unternehmen verkaufen', 
    icon: 'building-o' 
  },
];

/**
 * Gibt personalisierte Suchvorschläge zurück, basierend auf Benutzerverhalten.
 * 
 * In einer zukünftigen Version wird diese Funktion personalisierte Vorschläge
 * liefern, basierend auf den Benutzerdaten und dem Suchverhalten.
 * 
 * @returns {SearchSuggestion[]} Personalisierte Suchvorschläge
 */
export function getPersonalizedSuggestions(): SearchSuggestion[] {
  // TODO: Implementierung personalisierter Vorschläge
  return DEFAULT_SUGGESTIONS;
} 