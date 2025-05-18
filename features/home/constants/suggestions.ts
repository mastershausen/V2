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
    label: i18n.t('home.defaultSuggestions.taxOptions'), 
    icon: 'money' 
  },
  { 
    id: '2', 
    label: i18n.t('home.defaultSuggestions.saveMoney'), 
    icon: 'piggy-bank' 
  },
  { 
    id: '3', 
    label: i18n.t('home.defaultSuggestions.growth'), 
    icon: 'line-chart' 
  },
  { 
    id: '4', 
    label: i18n.t('home.defaultSuggestions.businessPlan'), 
    icon: 'file-text-o' 
  },
  { 
    id: '5', 
    label: i18n.t('home.defaultSuggestions.investment'), 
    icon: 'briefcase' 
  },
  { 
    id: '6', 
    label: i18n.t('home.defaultSuggestions.insurance'), 
    icon: 'shield' 
  },
  { 
    id: '7', 
    label: i18n.t('home.defaultSuggestions.retirement'), 
    icon: 'clock-o' 
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