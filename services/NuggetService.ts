/**
 * NuggetService - Verwaltung von Nugget-Daten
 * 
 * Dieser Service kapselt alle Operationen rund um Nuggets und
 * stellt eine einheitliche Schnittstelle für den nuggetStore bereit,
 * sowohl für Echtdaten als auch für Mock-Daten.
 */

import { shouldUseMockData } from '@/config/app/env';
import { NuggetData } from '@/shared-components/cards/nugget-card/types';
import {createProfileInitials} from '@/utils/profileImageUtils';
import { IService } from '@/utils/service/serviceRegistry';

import ApiService from './ApiService';
import { logger } from '../utils/logger';

// Alexander Becker Benutzer-Referenz für konsistente Demo-Nuggets
const ALEXANDER_BECKER_USER = {
  id: 'u2', // Konsistente ID für Alexander Becker
  name: 'Alexander Becker',
  username: 'alexbecker',
  // Modernes Profilbild-Format
  profileImage: createProfileInitials('AB')
};

// Mock-Daten für Demo-Modus
const MOCK_NUGGETS: NuggetData[] = [
  // Alexander Becker Nuggets für den Demo-Modus
  {
    id: 'nugget-ab-1',
    user: ALEXANDER_BECKER_USER,
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 Tage alt
    content: 'Steuertipp für Selbstständige: Fahrtkosten zum temporären Arbeitsort (z.B. Coworking Space) sind als Reisekosten voll absetzbar, nicht nur mit Entfernungspauschale. Voraussetzung: Ihr seid dort nicht öfter als 3 Tage pro Woche. §9 Abs. 1 Satz 3 Nr. 4a EStG',
    helpfulCount: 67,
    commentCount: 12,
    isHelpful: false,
    isSaved: true,
    tags: ['Steuern', 'Selbstständigkeit', 'Finanzen'],
    media: [{
      type: 'image',
      url: 'https://example.com/placeholder.jpg',
      thumbnailUrl: 'https://example.com/placeholder-thumb.jpg',
      aspectRatio: 1.5
    }]
  },
  {
    id: 'nugget-ab-2',
    user: ALEXANDER_BECKER_USER,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 Tage alt
    content: 'GmbH-Geschäftsführer aufgepasst: Die Tantieme sollte jährlich neu vereinbart und an messbare Ziele geknüpft werden. Sonst droht die Aberkennung durch das Finanzamt wegen verdeckter Gewinnausschüttung. Idealerweise schriftlich vor Beginn des Geschäftsjahres fixieren.',
    helpfulCount: 54,
    commentCount: 8,
    isHelpful: false,
    isSaved: false,
    tags: ['GmbH', 'Geschäftsführer', 'Steuern'],
  },
  {
    id: 'nugget-ab-3',
    user: ALEXANDER_BECKER_USER,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 Tage alt
    content: 'Homeoffice-Pauschale 2023: 6€ pro Tag (max. 1.260€ im Jahr). Alternativ: Arbeitszimmer voll absetzen, wenn es Mittelpunkt der Tätigkeit ist. Wichtig: Entweder die Pauschale ODER das Arbeitszimmer geltend machen - nicht beides!',
    helpfulCount: 38,
    commentCount: 5,
    isHelpful: true,
    isSaved: true,
    tags: ['Homeoffice', 'Steuertipps', 'Selbstständigkeit'],
  },
  {
    id: 'nugget-ab-4',
    user: ALEXANDER_BECKER_USER,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 Tag alt
    content: 'Bewirtungskosten richtig absetzen: 1. Rechnung mit Anlass und Teilnehmern versehen 2. Separate Rechnung (keine Sammelrechnung) 3. Unterschrift nicht vergessen 4. Bewirtungsbeleg aufbewahren. So sind 70% der Kosten absetzbar!',
    helpfulCount: 22,
    commentCount: 3,
    isHelpful: false,
    isSaved: false,
    tags: ['Bewirtung', 'Steuertipps', 'Unternehmer'],
  },
  // Andere Mock-Nutzer für die allgemeine Nutzung
  {
    id: 'nugget-1',
    user: {
      id: 'mock-user-1',
      name: 'Demo User',
      username: 'demouser',
      // Modernes Profilbild-Format
      profileImage: createProfileInitials('DU')
    },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 Tage alt
    content: 'Dies ist ein Demo-Nugget, das zeigt, wie die Inhalte in SolvBox aussehen könnten.',
    helpfulCount: 12,
    commentCount: 4,
    isHelpful: false,
    isSaved: true,
    tags: ['Demo', 'Beispiel'],
  },
  {
    id: 'nugget-2',
    user: {
      id: 'mock-user-2',
      name: 'Olivia Wagner',
      username: 'oliviawagner',
      // Modernes Profilbild-Format
      profileImage: createProfileInitials('OW')
    },
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 Tage alt
    content: 'Konversionssteigerung für eure Website: Achtet auf die erste Sekunde. Das Gehirn entscheidet unbewusst in 50 ms, ob Besucher bleiben oder gehen. Schafft sofort Klarheit: Wer seid ihr? Was bietet ihr? Warum hier?',
    helpfulCount: 42,
    commentCount: 8,
    isHelpful: true,
    isSaved: false,
    tags: ['Marketing', 'Webdesign', 'Conversion'],
  }
];

/**
 * NuggetService stellt Methoden zur Verfügung, um mit Nugget-Daten zu arbeiten
 * Implementiert das IService-Interface für die ServiceRegistry.
 */
class NuggetService implements IService {
  private apiService: ApiService;
  private cachedNuggets: NuggetData[] | null = null;
  
  /**
   *
   * @param apiService
   */
  constructor(apiService?: ApiService) {
    this.apiService = apiService || new ApiService();
  }
  
  /**
   * Initialisierung des Nugget-Service
   */
  async init(): Promise<void> {
    logger.debug('[NuggetService] Initialisiert');
    // Vorausfüllen des Caches für schnellere erste Abfrage
    this.cachedNuggets = null;
  }

  /**
   * Ressourcen freigeben
   */
  async dispose(): Promise<void> {
    logger.debug('[NuggetService] Ressourcen freigegeben');
    this.cachedNuggets = null;
  }

  /**
   * Ruft alle Nuggets für den aktuellen Benutzer ab
   * @param forceDemoNuggets Wenn true, werden immer die Demo-Nuggets zurückgegeben
   * @returns Promise mit einem Array von Nugget-Daten
   */
  async getUserNuggets(forceDemoNuggets?: boolean): Promise<NuggetData[]> {
    try {
      // Verwendung des Caches, wenn verfügbar und kein Refresh erzwungen wird
      if (this.cachedNuggets && !forceDemoNuggets) {
        return [...this.cachedNuggets];
      }
      
      // Force Demo-Nuggets immer, wenn forceDemoNuggets true ist
      if (forceDemoNuggets) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filtere nur Nuggets von Alexander Becker
        const alexanderNuggets = MOCK_NUGGETS.filter(
          nugget => nugget.user.id === 'u2' || 
                    nugget.user.name === 'Alexander Becker' || 
                    nugget.user.id.startsWith('nugget-ab-')
        );
        
        return [...alexanderNuggets];
      }
      
      // Im Demo/Entwicklungsmodus verwenden wir Mock-Daten
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 500));
        this.cachedNuggets = [...MOCK_NUGGETS];
        return [...MOCK_NUGGETS];
      }

      // In der Produktionsumgebung die API aufrufen
      const nuggets = await this.apiService.get<NuggetData[]>('/nuggets/user');
      this.cachedNuggets = nuggets ?? [];
      return this.cachedNuggets;
    } catch (error) {
      logger.error('Fehler beim Abrufen der Nuggets:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Fügt ein neues Nugget hinzu
   * @param nugget Zu speicherndes Nugget-Objekt ohne ID
   * @returns Promise mit dem gespeicherten Nugget inkl. generierter ID
   */
  async addNugget(nugget: Omit<NuggetData, 'id'>): Promise<NuggetData | null> {
    try {
      // Im Demo/Entwicklungsmodus simulieren wir das Hinzufügen
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generiere eine neue ID
        const newNugget: NuggetData = {
          ...nugget,
          id: `nugget-${Date.now()}`,
        };
        
        // Füge das Nugget zu den Mock-Daten hinzu (nur für diese Session)
        MOCK_NUGGETS.unshift(newNugget);
        
        // Update cached nuggets
        if (this.cachedNuggets) {
          this.cachedNuggets.unshift(newNugget);
        }
        
        return newNugget;
      }

      // In der Produktionsumgebung der API-Aufruf
      const savedNugget = await this.apiService.post<NuggetData>('/nuggets', nugget);
      
      // Cache aktualisieren
      if (savedNugget && this.cachedNuggets) {
        this.cachedNuggets.unshift(savedNugget);
      }
      
      return savedNugget;
    } catch (error) {
      logger.error('Fehler beim Hinzufügen des Nuggets:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  /**
   * Aktualisiert ein bestehendes Nugget
   * @param nuggetId ID des zu aktualisierenden Nuggets
   * @param updates Zu aktualisierende Felder
   * @returns Promise mit dem aktualisierten Nugget oder null bei Fehler
   */
  async updateNugget(nuggetId: string, updates: Partial<NuggetData>): Promise<NuggetData | null> {
    try {
      // Im Demo/Entwicklungsmodus simulieren wir das Update
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Finde das Nugget in den Mock-Daten
        const index = MOCK_NUGGETS.findIndex(n => n.id === nuggetId);
        if (index === -1) {
          throw new Error('Nugget nicht gefunden');
        }
        
        // Aktualisiere das Nugget
        const updatedNugget: NuggetData = {
          ...MOCK_NUGGETS[index],
          ...updates,
          id: nuggetId // ID kann nicht geändert werden
        };
        
        // Ersetze das alte Nugget durch das aktualisierte
        MOCK_NUGGETS[index] = updatedNugget;
        
        // Cache aktualisieren
        if (this.cachedNuggets) {
          const cacheIndex = this.cachedNuggets.findIndex(n => n.id === nuggetId);
          if (cacheIndex !== -1) {
            this.cachedNuggets[cacheIndex] = updatedNugget;
          }
        }
        
        return updatedNugget;
      }

      // In der Produktionsumgebung der API-Aufruf
      const updatedNugget = await this.apiService.put<NuggetData>(`/nuggets/${nuggetId}`, updates);
      
      // Cache aktualisieren
      if (updatedNugget && this.cachedNuggets) {
        const index = this.cachedNuggets.findIndex(n => n.id === nuggetId);
        if (index !== -1) {
          this.cachedNuggets[index] = updatedNugget;
        }
      }
      
      return updatedNugget;
    } catch (error) {
      logger.error('Fehler beim Aktualisieren des Nuggets:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  /**
   * Löscht ein Nugget
   * @param nuggetId ID des zu löschenden Nuggets
   * @returns Promise mit true bei Erfolg, sonst false
   */
  async deleteNugget(nuggetId: string): Promise<boolean> {
    try {
      // Im Demo/Entwicklungsmodus simulieren wir das Löschen
      if (shouldUseMockData()) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Finde das Nugget in den Mock-Daten
        const index = MOCK_NUGGETS.findIndex(n => n.id === nuggetId);
        if (index === -1) {
          throw new Error('Nugget nicht gefunden');
        }
        
        // Entferne das Nugget aus den Mock-Daten
        MOCK_NUGGETS.splice(index, 1);
        
        // Cache aktualisieren
        if (this.cachedNuggets) {
          const cacheIndex = this.cachedNuggets.findIndex(n => n.id === nuggetId);
          if (cacheIndex !== -1) {
            this.cachedNuggets.splice(cacheIndex, 1);
          }
        }
        
        return true;
      }

      // In der Produktionsumgebung der API-Aufruf
      await this.apiService.delete(`/nuggets/${nuggetId}`);
      
      // Cache aktualisieren
      if (this.cachedNuggets) {
        const index = this.cachedNuggets.findIndex(n => n.id === nuggetId);
        if (index !== -1) {
          this.cachedNuggets.splice(index, 1);
        }
      }
      
      return true;
    } catch (error) {
      logger.error('Fehler beim Löschen des Nuggets:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
}

export default NuggetService; 