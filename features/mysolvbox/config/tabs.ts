/**
 * Solvbox Tab-Konfiguration
 * 
 * Zentrale Definition aller Tab-IDs und Konfigurationen für Solvbox.
 * Durch diese Zentralisierung wird die Wartbarkeit verbessert und
 * Redundanzen in der Konfiguration vermieden.
 */

import React from 'react';

import { SolvboxTabId, SolvboxTabConfig } from '../types';

/**
 * Typ für alle verfügbaren Tab-IDs als String-Literale
 * Diese Konstante kann für Typüberprüfungen verwendet werden
 */
export const TAB_IDS = {
  SAVE: 'save' as const,
  GROW: 'grow' as const,
  FORESIGHT: 'foresight' as const,
  BONUS: 'bonus' as const
};

/**
 * Standard-Labels für die Tabs
 * Verwendet für statische Konfigurationen ohne Übersetzung
 */
export const TAB_LABELS = {
  SAVE: 'Sichern',
  GROW: 'Wachsen',
  FORESIGHT: 'Vorausdenken',
  BONUS: 'Bonus'
};

/**
 * Standard-Tab, der angezeigt wird, wenn kein Tab ausgewählt ist
 */
export const DEFAULT_TAB_ID: SolvboxTabId = TAB_IDS.SAVE;

/**
 * Validiert, ob eine gegebene Tab-ID gültig ist
 * @param tabId Die zu prüfende Tab-ID
 * @returns true, wenn die Tab-ID gültig ist
 */
export function isValidTabId(tabId: string): tabId is SolvboxTabId {
  return Object.values(TAB_IDS).includes(tabId as SolvboxTabId);
}

/**
 * Erzeugt die Solvbox-Tab-Konfigurationen mit den übersetzten Labels
 * @param t Übersetzungsfunktion
 * @param components Mapping von Tab-IDs zu Komponenten
 * @returns Array mit Tab-Konfigurationen
 */
export function createTabConfigs(
  t: (key: string) => string,
  components: Record<SolvboxTabId, React.ComponentType>
): SolvboxTabConfig[] {
  return [
    { id: TAB_IDS.SAVE, label: t('tabs.save'), component: components.save },
    { id: TAB_IDS.GROW, label: t('tabs.grow'), component: components.grow },
    { id: TAB_IDS.FORESIGHT, label: t('tabs.foresight'), component: components.foresight },
    { id: TAB_IDS.BONUS, label: t('tabs.bonus'), component: components.bonus }
  ];
}

/**
 * Erstellt eine statische Tab-Konfiguration ohne Übersetzungen
 * Nützlich für Umgebungen, in denen keine Übersetzungsfunktion verfügbar ist
 * @param components
 */
export function createStaticTabConfigs(
  components: Record<SolvboxTabId, React.ComponentType>
): SolvboxTabConfig[] {
  return [
    { id: TAB_IDS.SAVE, label: TAB_LABELS.SAVE, component: components[TAB_IDS.SAVE] },
    { id: TAB_IDS.GROW, label: TAB_LABELS.GROW, component: components[TAB_IDS.GROW] },
    { id: TAB_IDS.FORESIGHT, label: TAB_LABELS.FORESIGHT, component: components[TAB_IDS.FORESIGHT] },
    { id: TAB_IDS.BONUS, label: TAB_LABELS.BONUS, component: components[TAB_IDS.BONUS] }
  ];
} 