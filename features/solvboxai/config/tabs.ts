/**
 * SolvboxAI Tab-Konfiguration
 * 
 * Zentrale Definition aller Tab-IDs und Konfigurationen für SolvboxAI.
 * Diese Datei stellt sicher, dass Tab-IDs und -Konfigurationen konsistent
 * in der gesamten Anwendung verwendet werden.
 */

import React from 'react';

import { SolvboxAITabId, SolvboxAITabConfig } from '../types';

/**
 * Definition aller verfügbaren Tab-IDs als Konstanten mit String-Literalen
 * 
 * Diese Konstanten werden mit 'as const' definiert, um typsichere String-Literale
 * zu erzeugen, die exakt den Werten in der SolvboxAITabId-Typdefinition entsprechen.
 * Dadurch wird sichergestellt, dass alle Verweise auf Tab-IDs in der gesamten Anwendung
 * konsistent und typsicher sind.
 * 
 * Hinweis: Die IDs entsprechen den in types/tiles.ts definierten Werten
 * für die SolvboxAITile-Schnittstelle
 */
export const TAB_IDS = {
  GIGS: 'gigs' as const,
  CASESTUDIES: 'casestudies' as const
};

/**
 * Labels für die Tabs in der UI
 * Kann später durch t()-Funktion für Übersetzungen ersetzt werden
 */
export const TAB_LABELS = {
  GIGS: 'Gigs',
  CASESTUDIES: 'Fallstudien'
};

/**
 * Standard-Tab, der angezeigt wird, wenn kein Tab ausgewählt ist
 */
export const DEFAULT_TAB_ID: SolvboxAITabId = TAB_IDS.GIGS;

/**
 * Validiert, ob eine gegebene Tab-ID gültig ist
 * @param tabId Die zu prüfende Tab-ID
 * @returns true, wenn die Tab-ID gültig ist
 */
export function isValidTabId(tabId: string): tabId is SolvboxAITabId {
  return Object.values(TAB_IDS).includes(tabId as SolvboxAITabId);
}

/**
 * Erzeugt die SolvboxAI-Tab-Konfigurationen
 * @param t Übersetzungsfunktion (optional)
 * @param components Mapping von Tab-IDs zu Komponenten
 * @returns Array mit Tab-Konfigurationen
 */
export function createTabConfigs(
  t: (key: string, defaultValue: string) => string,
  components: Record<SolvboxAITabId, React.ComponentType>
): SolvboxAITabConfig[] {
  return [
    { 
      id: TAB_IDS.GIGS, 
      label: t('solvboxai.tabs.gigs', TAB_LABELS.GIGS), 
      component: components[TAB_IDS.GIGS] 
    },
    { 
      id: TAB_IDS.CASESTUDIES, 
      label: t('solvboxai.tabs.casestudies', TAB_LABELS.CASESTUDIES), 
      component: components[TAB_IDS.CASESTUDIES] 
    }
  ];
}

/**
 * Erstellt eine statische Tab-Konfiguration ohne Übersetzungen
 * Nützlich für Umgebungen, in denen keine Übersetzungsfunktion verfügbar ist
 * @param components
 */
export function createStaticTabConfigs(
  components: Record<SolvboxAITabId, React.ComponentType>
): SolvboxAITabConfig[] {
  return [
    { id: TAB_IDS.GIGS, label: TAB_LABELS.GIGS, component: components[TAB_IDS.GIGS] },
    { id: TAB_IDS.CASESTUDIES, label: TAB_LABELS.CASESTUDIES, component: components[TAB_IDS.CASESTUDIES] }
  ];
}
