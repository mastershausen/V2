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
 * Die Labels werden aus den Übersetzungen bezogen.
 */
export const DEFAULT_SUGGESTIONS: SearchSuggestion[] = [
  { 
    id: '1', 
    label: i18n.t('home.defaultSuggestions.taxSaving'), 
    icon: 'money' 
  },
  { 
    id: '2', 
    label: i18n.t('home.defaultSuggestions.protectAssets'), 
    icon: 'shield' 
  },
  { 
    id: '3', 
    label: i18n.t('home.defaultSuggestions.gainCustomers'), 
    icon: 'users' 
  },
  { 
    id: '4', 
    label: i18n.t('home.defaultSuggestions.reduceCosts'), 
    icon: 'arrow-down' 
  },
  { 
    id: '5', 
    label: i18n.t('home.defaultSuggestions.sellCompany'), 
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