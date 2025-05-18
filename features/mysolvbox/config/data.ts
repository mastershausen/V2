/**
 * Zentrale Konfiguration für MySolvbox Datenquellen
 * 
 * Diese Datei dient als zentraler Zugriffspunkt für alle Datenquellen der MySolvbox.
 * Dadurch werden die Datenquellen von der Logik getrennt und können leichter
 * ausgetauscht oder angepasst werden.
 */

import { TAB_IDS } from './tabs';
import { BonusTileData, ForesightTileData, GrowTileData, SaveTileData } from '../types';

// Mock-Daten für die Tabs (in realen Projekten würden diese aus APIs kommen)

// Save Tab Daten
const SAVE_TILES: SaveTileData[] = [
  {
    id: 1001,
    title: "Kurzfristig Kunden gewinnen",
    category: "revenue",
    description: "Strategien zur kurzfristigen Kundenakquise"
  },
  {
    id: 1002,
    title: "Fixkosten senken",
    category: "cost",
    description: "Strategien zur Senkung der Fixkosten"
  },
  {
    id: 1003,
    title: "Vermögen schützen",
    category: "protection",
    description: "Strategien zum Vermögensschutz"
  },
  {
    id: 1004,
    title: "Unternehmen kernsanieren",
    category: "cost",
    description: "Umfassende Maßnahmen zur Unternehmenssanierung"
  },
  {
    id: 1005,
    title: "Recht & Sicherheit",
    category: "legal",
    description: "Rechtliche Absicherung und Risikominimierung"
  },
  {
    id: 1006,
    title: "Kunden langfristig binden",
    category: "revenue",
    description: "Strategien zur Kundenbindung und Loyalitätssteigerung"
  },
  {
    id: 1007,
    title: "Fremdkapital beschaffen",
    category: "other",
    description: "Strategien zur Fremdkapitalbeschaffung"
  },
  {
    id: 1008,
    title: "Mitarbeiter führen",
    category: "other",
    description: "Führungsstrategien für effiziente Teams"
  },
  {
    id: 1009,
    title: "Cyber- und IT-Sicherheit",
    category: "protection",
    description: "Maßnahmen zur Absicherung der IT-Infrastruktur"
  },
  {
    id: 1010,
    title: "Kunde ist insolvent. Was tun?",
    category: "legal",
    description: "Handlungsempfehlungen bei Kundeninsolvenz"
  }
];

// Grow Tab Daten
const GROW_TILES: GrowTileData[] = [
  {
    id: 2001,
    title: "Steuern auf ein Minimum",
    category: "Finanzen",
    description: "Optimieren Sie Ihre Steuerbelastung durch legale Strategien und Planungsmethoden."
  },
  {
    id: 2002,
    title: "A-Mitarbeiter gewinnen und halten",
    category: "Team",
    description: "Strategien zur Gewinnung und Bindung von Top-Talenten für Ihr Unternehmen."
  },
  {
    id: 2003,
    title: "Dauerhaften Kundenstrom aufbauen",
    category: "Marketing",
    description: "Entwickeln Sie nachhaltige Methoden zur kontinuierlichen Kundengewinnung."
  },
  {
    id: 2004,
    title: "Vertrieb der verkauft",
    category: "Vertrieb",
    description: "Aufbau eines effektiven Vertriebssystems mit messbaren Ergebnissen."
  },
  {
    id: 2005,
    title: "Brot & Butter Geschäft aufbauen",
    category: "Strategie",
    description: "Entwicklung eines stabilen Kerngeschäfts für kontinuierliche Einnahmen."
  },
  {
    id: 2006,
    title: "Max. Marge Produkt aufbauen",
    category: "Produkt",
    description: "Strategien zur Entwicklung von Produkten mit maximaler Gewinnspanne."
  },
  {
    id: 2007,
    title: "Steuern vom Finanzamt zurückholen",
    category: "Finanzen",
    description: "Legale Wege zur Rückforderung von überbezahlten Steuern."
  },
  {
    id: 2008,
    title: "Bitte, bitte nutze KI",
    category: "Technologie",
    description: "Integration von KI-Technologien zur Steigerung der Effizienz und Innovation."
  },
  {
    id: 2009,
    title: "Investoren finden",
    category: "Finanzierung",
    description: "Strategien zur Ansprache und Gewinnung von Investoren für Ihr Unternehmen."
  }
];

// Foresight Tab Daten
const FORESIGHT_TILES: ForesightTileData[] = [
  {
    id: 3001,
    title: "Erbschaft regeln und Steuern vermeiden",
    category: "Nachfolge",
    description: "Strategien zur steueroptimierten Regelung des Nachlasses.",
    timeHorizon: "Langfristig"
  },
  {
    id: 3002,
    title: "Unternehmen das ohne dich funktioniert",
    category: "Unternehmensstruktur",
    description: "Aufbau eines selbstlaufenden Unternehmens mit effizienten Prozessen.",
    timeHorizon: "Mittelfristig"
  },
  {
    id: 3003,
    title: "Vermögen im Inland schützen",
    category: "Vermögensschutz",
    description: "Legale Strategien zum Schutz Ihres Vermögens innerhalb Deutschlands.",
    timeHorizon: "Kurzfristig"
  },
  {
    id: 3004,
    title: "Unternehmen verkaufen",
    category: "Exit",
    description: "Vorbereitungen und Strategien für einen erfolgreichen Unternehmensverkauf.",
    timeHorizon: "Mittelfristig"
  },
  {
    id: 3005,
    title: "Nachfolge regeln",
    category: "Nachfolge",
    description: "Planung und Umsetzung einer erfolgreichen Unternehmensnachfolge.",
    timeHorizon: "Langfristig"
  },
  {
    id: 3006,
    title: "Unternehmen kaufen",
    category: "Akquisition",
    description: "Due-Diligence-Prozess und Strategien für erfolgreiche Unternehmenskäufe.",
    timeHorizon: "Kurzfristig"
  },
  {
    id: 3007,
    title: "Steuerfrei durch Immobilien",
    category: "Immobilien",
    description: "Legale Steueroptimierung durch geschickte Immobilieninvestitionen.",
    timeHorizon: "Mittelfristig"
  },
  {
    id: 3008,
    title: "Immobilien allgemein",
    category: "Immobilien",
    description: "Grundlegende Strategien für erfolgreiche Immobilieninvestitionen.",
    timeHorizon: "Kurzfristig"
  },
  {
    id: 3009,
    title: "Off-market Immobilien",
    category: "Immobilien",
    description: "Zugang zu exklusiven Immobilienangeboten außerhalb des öffentlichen Marktes.",
    timeHorizon: "Mittelfristig"
  },
  {
    id: 3010,
    title: "Onlinegeschäft aufbauen",
    category: "Digitalisierung",
    description: "Strategien zum Aufbau eines erfolgreichen Online-Geschäftsmodells.",
    timeHorizon: "Kurzfristig"
  }
];

// Bonus Tab Daten
const BONUS_TILES: BonusTileData[] = [
  {
    id: 4001,
    title: "Lange und glücklich Leben",
    category: "Persönlich",
    description: "Strategien für ein langes und erfülltes Leben als Unternehmer.",
    benefitType: "Gesundheit"
  },
  {
    id: 4002,
    title: "Besser verhandeln",
    category: "Skills",
    description: "Techniken zur Verbesserung Ihrer Verhandlungsfähigkeiten.",
    benefitType: "Kommunikation"
  },
  {
    id: 4003,
    title: "Rhetorik & Kommunikation meistern",
    category: "Skills",
    description: "Rhetorische Fähigkeiten entwickeln und effektiver kommunizieren.",
    benefitType: "Kommunikation"
  },
  {
    id: 4004,
    title: "Zukunftsforschung",
    category: "Strategie",
    description: "Einblicke in kommende Trends und Entwicklungen für Ihr Unternehmen.",
    benefitType: "Strategie"
  },
  {
    id: 4005,
    title: "Ideen und neue Märkte entwickeln",
    category: "Innovation",
    description: "Methoden zur systematischen Entwicklung neuer Geschäftsideen.",
    benefitType: "Innovation"
  },
  {
    id: 4006,
    title: "Allgemeine Goldnuggets",
    category: "Wissen",
    description: "Wertvolle Tipps und Erkenntnisse für Unternehmer.",
    benefitType: "Allgemein"
  },
  {
    id: 4007,
    title: "Auswandern als Unternehmer",
    category: "International",
    description: "Leitfaden für Unternehmer, die ins Ausland ziehen möchten.",
    benefitType: "International"
  },
  {
    id: 4008,
    title: "Alternative Investments",
    category: "Finanzen",
    description: "Nicht-traditionelle Anlagemöglichkeiten für Unternehmer.",
    benefitType: "Finanziell"
  },
  {
    id: 4009,
    title: "Unternehmen ins Ausland verlagern",
    category: "International",
    description: "Strategien zur Internationalisierung Ihres Unternehmens.",
    benefitType: "International"
  },
  {
    id: 4010,
    title: "Auswandern mit Familie",
    category: "Persönlich",
    description: "Familienorientierte Aspekte der Auswanderung für Unternehmer.",
    benefitType: "International"
  },
  {
    id: 4011,
    title: "Vermögen schützen im Ausland",
    category: "Finanzen",
    description: "Internationale Strategien zum Schutz Ihres Vermögens.",
    benefitType: "Finanziell"
  }
];

/**
 * Gibt Daten für den Save-Tab zurück
 */
export function getSaveTileData(): SaveTileData[] {
  return [...SAVE_TILES];
}

/**
 * Gibt Daten für den Grow-Tab zurück
 */
export function getGrowTileData(): GrowTileData[] {
  return [...GROW_TILES];
}

/**
 * Gibt Daten für den Foresight-Tab zurück
 */
export function getForesightTileData(): ForesightTileData[] {
  return [...FORESIGHT_TILES];
}

/**
 * Gibt Daten für den Bonus-Tab zurück
 */
export function getBonusTileData(): BonusTileData[] {
  return [...BONUS_TILES];
}

/**
 * Zuordnung von Tab-IDs zu deren Datenabruffunktionen
 */
export const DATA_PROVIDERS = {
  [TAB_IDS.SAVE]: getSaveTileData,
  [TAB_IDS.GROW]: getGrowTileData,
  [TAB_IDS.FORESIGHT]: getForesightTileData,
  [TAB_IDS.BONUS]: getBonusTileData
};

// Zusätzliche hilfreiche Funktionen

/**
 * Gibt eine SaveTileData anhand ihrer ID zurück
 * @param id
 */
export function getSaveTileById(id: number): SaveTileData | undefined {
  return SAVE_TILES.find(tile => tile.id === id);
}

/**
 * Gibt eine GrowTileData anhand ihrer ID zurück
 * @param id
 */
export function getGrowTileById(id: number): GrowTileData | undefined {
  return GROW_TILES.find(tile => tile.id === id);
}

/**
 * Gibt eine ForesightTileData anhand ihrer ID zurück
 * @param id
 */
export function getForesightTileById(id: number): ForesightTileData | undefined {
  return FORESIGHT_TILES.find(tile => tile.id === id);
}

/**
 * Gibt eine BonusTileData anhand ihrer ID zurück
 * @param id
 */
export function getBonusTileById(id: number): BonusTileData | undefined {
  return BONUS_TILES.find(tile => tile.id === id);
} 