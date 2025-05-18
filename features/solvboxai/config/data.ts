/**
 * SolvboxAI Daten
 * 
 * Diese Datei enthält statische Daten für SolvboxAI-Kacheln
 * und Hilfsfunktionen für den Zugriff auf diese Daten.
 * 
 * Alle Demo-Daten sind an die Typdefinitionen in types/index.ts angepasst.
 */

import { 
  SolvboxAITabId, 
  GigTileData, 
  CaseStudyTileData,
  SolvboxAITileData,
  SolvboxAITabDataMap 
} from '../types';

// =========================================================
// Demo-Daten für die Tabs
// =========================================================

/**
 * Demo-Daten für den "Gigs"-Tab
 */
export const GIGS: GigTileData[] = [
  {
    id: 8001,
    title: 'KI-Agenten für alltägliche Aufgaben',
    type: 'gig',
    isActive: true,
    sortOrder: 1,
    complexity: 'einfach',
    subtitle: 'Automatisiere wiederkehrende Aufgaben',
    description: 'Entdecke, wie KI-Agenten alltägliche Aufgaben automatisieren können, um Zeit zu sparen und Effizienz zu steigern.',
    aiPromptExample: 'Erstelle einen KI-Agenten, der E-Mails nach Priorität sortiert und Antwortvorschläge generiert.',
    estimatedTime: '15-30 Minuten'
  },
  {
    id: 8002,
    title: 'KI-Agenten für mehr PR & Podcasts',
    type: 'gig',
    isActive: true,
    sortOrder: 2,
    complexity: 'mittel',
    subtitle: 'Optimiere deine PR-Strategie',
    description: 'Nutze KI-Agenten, um Pressemitteilungen zu erstellen, Medientrends zu analysieren und Podcast-Inhalte zu verbessern.',
    aiPromptExample: 'Erstelle eine Strategie für die Nutzung von KI zur Verbesserung unserer PR-Kampagnen und Podcast-Produktion.',
    estimatedTime: '45-60 Minuten'
  },
  {
    id: 8003,
    title: 'KI-Agenten im Marketing',
    type: 'gig',
    isActive: true,
    sortOrder: 3,
    complexity: 'mittel',
    subtitle: 'Präzisere Marketing-Kampagnen',
    description: 'Implementiere KI-Agenten für Marketinganalysen, Zielgruppenoptimierung und automatisierte Content-Erstellung.',
    aiPromptExample: 'Entwickle eine Liste von KI-Agenten, die unser Marketing-Team einsetzen könnte, um die Effizienz zu steigern.',
    estimatedTime: '30-45 Minuten'
  },
  {
    id: 8004,
    title: 'KI-Agenten für perfekten Kundenservice',
    type: 'gig',
    isActive: true,
    sortOrder: 4,
    complexity: 'mittel',
    subtitle: 'Rund-um-die-Uhr Kundensupport',
    description: 'Verbessere deinen Kundenservice mit KI-Agenten, die Anfragen kategorisieren, häufige Probleme lösen und personalisierte Antworten geben.',
    aiPromptExample: 'Entwirf einen KI-Agenten für unseren Kundenservice, der Anfragen priorisiert und erste Lösungsvorschläge bietet.',
    estimatedTime: '45-60 Minuten'
  },
  {
    id: 8005,
    title: 'KI-Agenten im Vertrieb',
    type: 'gig',
    isActive: true,
    sortOrder: 5,
    complexity: 'komplex',
    subtitle: 'Vertriebsprozesse optimieren',
    description: 'Steigere Verkaufszahlen mit KI-Agenten, die Leads qualifizieren, Verkaufsprognosen erstellen und den Verkaufsprozess automatisieren.',
    aiPromptExample: 'Erstelle einen Implementierungsplan für KI-Agenten, die unseren Vertriebsmitarbeitern helfen können.',
    estimatedTime: '60-90 Minuten'
  },
  {
    id: 8006,
    title: 'KI als Rechtsberater',
    type: 'gig',
    isActive: true,
    sortOrder: 6,
    complexity: 'komplex',
    subtitle: 'Rechtliche Unterstützung mit KI',
    description: 'Nutze KI-Agenten für die Vertragsprüfung, Rechtsrecherche und zur Erstellung von Rechtsdokumenten.',
    aiPromptExample: 'Wie könnte ein KI-Agent unser Rechtsteam bei der Überprüfung von Standardverträgen unterstützen?',
    estimatedTime: '60-90 Minuten'
  },
  {
    id: 8007,
    title: 'KI als Unternehmensberater',
    type: 'gig',
    isActive: true,
    sortOrder: 7,
    complexity: 'komplex',
    subtitle: 'Strategische Beratung durch KI',
    description: 'Lass KI-Agenten Marktanalysen durchführen, Geschäftsstrategien entwickeln und Optimierungsvorschläge machen.',
    aiPromptExample: 'Entwickle eine Struktur für einen KI-Berateragenten, der uns bei strategischen Geschäftsentscheidungen unterstützt.',
    estimatedTime: '90-120 Minuten'
  },
  {
    id: 8008,
    title: 'KI Anwendungen um Zeit & Geld zu sparen',
    type: 'gig',
    isActive: true,
    sortOrder: 8,
    complexity: 'einfach',
    subtitle: 'Kosteneffiziente KI-Lösungen',
    description: 'Entdecke, wie KI-Agenten Prozesse optimieren, Kosten senken und Ressourcen effizienter nutzen können.',
    aiPromptExample: 'Welche KI-Anwendungen könnten wir implementieren, um innerhalb der nächsten 6 Monate Zeit und Kosten zu sparen?',
    estimatedTime: '30-45 Minuten'
  },
  {
    id: 8009,
    title: 'Was die Zukunft bringt',
    type: 'gig',
    isActive: true,
    sortOrder: 9,
    complexity: 'mittel',
    subtitle: 'Zukunftstrends bei KI-Agenten',
    description: 'Erhalte Einblicke in kommende Trends und Entwicklungen im Bereich der KI-Agenten und deren Auswirkungen auf Unternehmen.',
    aiPromptExample: 'Welche KI-Agenten-Technologien werden in den nächsten 2-3 Jahren für Unternehmen unserer Größe relevant sein?',
    estimatedTime: '45-60 Minuten'
  },
  {
    id: 8010,
    title: 'Sicherheit & Datenschutz',
    type: 'gig',
    isActive: true,
    sortOrder: 10,
    complexity: 'komplex',
    subtitle: 'Sichere Implementierung von KI',
    description: 'Lerne, wie du KI-Agenten sicher implementierst, Datenschutzrichtlinien einhältst und potenzielle Risiken minimierst.',
    aiPromptExample: 'Erstelle eine Checkliste für Datenschutz- und Sicherheitsaspekte, die wir bei der Implementierung von KI-Agenten beachten sollten.',
    estimatedTime: '60-90 Minuten'
  }
];

/**
 * Demo-Daten für den "Fallstudien"-Tab
 */
export const CASE_STUDIES: CaseStudyTileData[] = [
  {
    id: 9001,
    title: 'Alltägliche Aufgaben automatisieren',
    type: 'casestudy',
    isActive: true,
    sortOrder: 1,
    industry: 'Dienstleistung',
    companySize: 'small',
    subtitle: 'Produktivitätssteigerung durch Automatisierung',
    description: 'Ein kleines Beratungsunternehmen automatisierte administrative Aufgaben mit KI-Agenten und steigerte die Produktivität um 35%.',
    resultSummary: 'Zeitersparnis von 20+ Stunden pro Woche, ROI innerhalb von 3 Monaten erreicht'
  },
  {
    id: 9002,
    title: 'Marketing',
    type: 'casestudy',
    isActive: true,
    sortOrder: 2,
    industry: 'E-Commerce',
    companySize: 'medium',
    subtitle: 'KI-gestützte Marketingoptimierung',
    description: 'Ein Online-Händler setzte KI-Agenten ein, um Marketingkampagnen zu analysieren und zu optimieren, was zu einem Anstieg der Konversionsraten führte.',
    resultSummary: '28% höhere Konversionsraten, 15% Reduktion der Marketingkosten'
  },
  {
    id: 9003,
    title: 'PR & Podcasts',
    type: 'casestudy',
    isActive: true,
    sortOrder: 3,
    industry: 'Medien',
    companySize: 'small',
    subtitle: 'Reichweitensteigerung durch KI',
    description: 'Ein Medienunternehmen nutzte KI-Agenten zur Podcast-Produktion und PR-Optimierung, was zu mehr Reichweite und besseren Medienbeziehungen führte.',
    resultSummary: '45% Steigerung der Podcast-Downloads, doppelte Medienpräsenz'
  },
  {
    id: 9004,
    title: 'Kundenservice',
    type: 'casestudy',
    isActive: true,
    sortOrder: 4,
    industry: 'Telekommunikation',
    companySize: 'large',
    subtitle: 'Kundenzufriedenheit maximieren',
    description: 'Ein Telekommunikationsunternehmen implementierte KI-Agenten im Kundenservice, was zu schnelleren Antwortzeiten und höherer Kundenzufriedenheit führte.',
    resultSummary: '70% schnellere Antwortzeiten, 23% höhere Kundenzufriedenheit'
  },
  {
    id: 9005,
    title: 'Vertrieb',
    type: 'casestudy',
    isActive: true,
    sortOrder: 5,
    industry: 'Software',
    companySize: 'medium',
    subtitle: 'Vertriebsprozesse revolutionieren',
    description: 'Ein Softwareunternehmen setzte KI-Agenten im Vertrieb ein, um Leads zu qualifizieren und den Verkaufsprozess zu optimieren.',
    resultSummary: '40% mehr qualifizierte Leads, 25% höhere Abschlussrate'
  },
  {
    id: 9006,
    title: 'Recht',
    type: 'casestudy',
    isActive: true,
    sortOrder: 6,
    industry: 'Rechtsberatung',
    companySize: 'medium',
    subtitle: 'Juristische Effizienz durch KI',
    description: 'Eine Anwaltskanzlei nutzte KI-Agenten für die Vertragsprüfung und juristische Recherche, was zu genaueren Ergebnissen in kürzerer Zeit führte.',
    resultSummary: '60% weniger Zeit für Routineaufgaben, 30% mehr Kapazität für komplexe Fälle'
  },
  {
    id: 9007,
    title: 'Recruiting',
    type: 'casestudy',
    isActive: true,
    sortOrder: 7,
    industry: 'Personal',
    companySize: 'small',
    subtitle: 'Talentakquise optimieren',
    description: 'Eine Personalvermittlung implementierte KI-Agenten, um Kandidatenprofile zu screenen und passende Kandidaten für offene Stellen zu identifizieren.',
    resultSummary: '50% schnellere Stellenbesetzung, 40% besseres Matching'
  },
  {
    id: 9008,
    title: 'Hilfreich & kostensenkend',
    type: 'casestudy',
    isActive: true,
    sortOrder: 8,
    industry: 'Fertigung',
    companySize: 'large',
    subtitle: 'Kostenoptimierung durch KI',
    description: 'Ein Fertigungsunternehmen setzte KI-Agenten ein, um Produktionsprozesse zu optimieren und Kosten zu senken.',
    resultSummary: '18% Kostenreduktion, 12% weniger Ausschuss, ROI innerhalb von 6 Monaten'
  }
];

// =========================================================
// Tabellen-Mapping und Hilfsfunktionen
// =========================================================

/**
 * Mapping von Tab-IDs zu den entsprechenden Daten-Arrays
 * Wird von den Zugriffshelfer-Funktionen verwendet
 */
export const TAB_DATA_MAP: SolvboxAITabDataMap = {
  'gigs': GIGS,
  'casestudies': CASE_STUDIES
};

/**
 * Gibt alle Kacheldaten für einen bestimmten Tab zurück
 * Diese Funktion ist der Hauptzugriffspunkt für Tab-spezifische Daten
 * @param {SolvboxAITabId} tabId - Die ID des Tabs
 * @returns {SolvboxAITileData[]} Ein Array mit allen Kacheln für den angegebenen Tab
 */
export function getDataForTabId(tabId: SolvboxAITabId): SolvboxAITileData[] {
  return TAB_DATA_MAP[tabId] || [];
}

/**
 * Findet eine Kachel anhand ihrer ID
 * Durchsucht alle verfügbaren Tabs, um eine Kachel mit der angegebenen ID zu finden
 * @param {number} id - Die ID der zu findenden Kachel
 * @returns {SolvboxAITileData | undefined} Die gefundene Kachel oder undefined, wenn keine Kachel gefunden wurde
 */
export function getTileById(id: number): SolvboxAITileData | undefined {
  // Suche in allen Tabs
  for (const tabId in TAB_DATA_MAP) {
    const tiles = TAB_DATA_MAP[tabId as SolvboxAITabId];
    const foundTile = tiles.find(tile => tile.id === id);
    if (foundTile) return foundTile;
  }
  return undefined;
}

/**
 * Gibt alle Kategorien für einen bestimmten Tab zurück
 * Extrahiert die Kategorien aus den Kacheln und entfernt Duplikate
 * @param {SolvboxAITabId} tabId - Die ID des Tabs
 * @returns {string[]} Ein sortiertes Array mit allen einzigartigen Kategorien für den angegebenen Tab
 */
export function getCategoriesForTabId(tabId: SolvboxAITabId): string[] {
  const tiles = getDataForTabId(tabId);
  const categories = new Set<string>();
  
  tiles.forEach(tile => {
    // Je nach Tile-Typ wird eine andere Eigenschaft als Kategorie verwendet
    if (tile.type === 'gig' && 'complexity' in tile && typeof tile.complexity === 'string') {
      categories.add(tile.complexity);
    } else if (tile.type === 'casestudy' && 'industry' in tile && typeof tile.industry === 'string') {
      categories.add(tile.industry);
    }
  });
  
  return Array.from(categories).sort();
}

/**
 * Gibt alle Kacheln einer bestimmten Kategorie zurück
 * Filtert die Kacheln eines Tabs nach der angegebenen Kategorie
 * @param {SolvboxAITabId} tabId - Die ID des Tabs
 * @param {string} category - Die zu filternde Kategorie (oder 'all' für alle Kacheln)
 * @returns {SolvboxAITileData[]} Ein Array mit allen Kacheln der angegebenen Kategorie
 */
export function getTilesByCategory(tabId: SolvboxAITabId, category: string): SolvboxAITileData[] {
  const tiles = getDataForTabId(tabId);
  
  // "Alle" Kategorie gibt alle Kacheln zurück
  if (category === 'all') {
    return tiles;
  }
  
  // Filtere nach Kategorie basierend auf dem Typ der Kachel
  return tiles.filter(tile => {
    if (tile.type === 'gig' && 'complexity' in tile) {
      return tile.complexity === category;
    } else if (tile.type === 'casestudy' && 'industry' in tile) {
      return tile.industry === category;
    }
    return false;
  });
}

/**
 * Generiert Empfehlungen basierend auf einer bestimmten Kachel-ID
 * @param tileId ID der Ausgangskachel
 * @param limit Maximale Anzahl der Empfehlungen
 * @returns {SolvboxAITileData[]} Ein Array mit empfohlenen Kacheln, beschränkt auf das angegebene Limit
 */
export function getRecommendations(tileId: number, limit = 3): SolvboxAITileData[] {
  // Finde die Ausgangskachel
  const sourceTile = getTileById(tileId);
  
  // Wenn Kachel nicht gefunden, leeres Array zurückgeben
  if (!sourceTile) return [];
  
  let relatedTiles: SolvboxAITileData[] = [];
  
  // Ermittle die relevante Kategorie der Quellkachel
  let sourceCategory: string | undefined;
  if (sourceTile.type === 'gig' && 'complexity' in sourceTile && typeof sourceTile.complexity === 'string') {
    sourceCategory = sourceTile.complexity;
  } else if (sourceTile.type === 'casestudy' && 'industry' in sourceTile && typeof sourceTile.industry === 'string') {
    sourceCategory = sourceTile.industry;
  }
  
  // Wenn keine Kategorie gefunden wurde, gib andere Kacheln zurück
  if (!sourceCategory) {
    const allTiles: SolvboxAITileData[] = [...GIGS, ...CASE_STUDIES];
    return allTiles
      .filter(tile => tile.id !== tileId)
      .slice(0, limit);
  }
  
  // Suche in allen Tabs nach passenden Kacheln
  for (const tabId in TAB_DATA_MAP) {
    const tabTiles = TAB_DATA_MAP[tabId as SolvboxAITabId];
    
    // Filtere nach der passenden Kategorie
    const categoryMatches: SolvboxAITileData[] = [];
    
    tabTiles.forEach(tile => {
      // Überspringe die Quellkachel
      if (tile.id === sourceTile.id) return;
      
      // Prüfe auf Kategorieübereinstimmung
      let tileCategory: string | undefined;
      if (tile.type === 'gig' && 'complexity' in tile && typeof tile.complexity === 'string') {
        tileCategory = tile.complexity;
      } else if (tile.type === 'casestudy' && 'industry' in tile && typeof tile.industry === 'string') {
        tileCategory = tile.industry;
      }
      
      if (tileCategory === sourceCategory) {
        categoryMatches.push(tile);
      }
    });
    
    relatedTiles = [...relatedTiles, ...categoryMatches];
  }
  
  // Wenn nicht genug gefunden wurden, füge andere Kacheln hinzu
  if (relatedTiles.length < limit) {
    // Alle Kacheln außer der Quellkachel
    const allTiles: SolvboxAITileData[] = [...GIGS, ...CASE_STUDIES];
    const allOtherTiles = allTiles
      .filter(tile => tile.id !== tileId)
      // Aus relatedTiles nicht nochmal hinzufügen
      .filter(tile => !relatedTiles.some(related => related.id === tile.id));
    
    // Auffüllen
    relatedTiles = [
      ...relatedTiles,
      ...allOtherTiles.slice(0, limit - relatedTiles.length)
    ];
  }
  
  // Begrenze auf gewünschte Anzahl
  return relatedTiles.slice(0, limit);
} 