import { SearchSuggestion } from '../types/search';
import i18n from '@/i18n/config';
import { Ionicons } from '@expo/vector-icons';

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
    icon: 'cash-outline' 
  },
  { 
    id: '2', 
    label: i18n.t('home.defaultSuggestions.saveMoney'), 
    icon: 'calculator-outline' 
  },
  { 
    id: '3', 
    label: i18n.t('home.defaultSuggestions.growth'), 
    icon: 'trending-up-outline' 
  },
  { 
    id: '4', 
    label: i18n.t('home.defaultSuggestions.businessPlan'), 
    icon: 'document-text-outline' 
  },
  { 
    id: '5', 
    label: i18n.t('home.defaultSuggestions.investment'), 
    icon: 'trending-up-outline' 
  },
  { 
    id: '6', 
    label: i18n.t('home.defaultSuggestions.insurance'), 
    icon: 'shield-outline' 
  },
  { 
    id: '7', 
    label: i18n.t('home.defaultSuggestions.retirement'), 
    icon: 'hourglass-outline' 
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