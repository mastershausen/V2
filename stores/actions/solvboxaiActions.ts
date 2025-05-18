/**
 * solvboxAIActions - Aktionen für den SolvboxAI-Store
 */
import { SolvboxAIService } from '@/services/SolvboxAIService';

import { SolvboxaiState } from '../types/solvboxaiTypes';

// Typen für die Funktionsparameter
type SetFunction = (fn: (state: SolvboxaiState) => Partial<SolvboxaiState>) => void;
type GetFunction = () => SolvboxaiState;

/**
 * Erstellt alle Aktionen für den SolvboxAI-Store
 * @param set
 * @param get
 */
export function createSolvboxAIActions(set: SetFunction, get: GetFunction) {
  return {
    /**
     * Setzt das aktive Tab
     * @param tabId
     */
    setActiveTab: (tabId: 'gigs' | 'casestudies') => {
      set((state) => ({
        activeTab: tabId,
      }));
    },

    /**
     * Lädt alle Kacheln für das aktive Tab
     * @param forceRefresh
     */
    loadTabTiles: async (forceRefresh = false) => {
      const state = get();
      const activeTab = state.activeTab;

      // Nur laden, wenn nötig (nicht kürzlich geladen oder erzwungene Aktualisierung)
      const shouldLoad =
        forceRefresh ||
        !state.lastLoaded ||
        parseInt(state.lastLoaded, 10) && (Date.now() - parseInt(state.lastLoaded, 10)) > 5 * 60 * 1000; // 5 Minuten Cache

      if (!shouldLoad) return;

      try {
        set((state) => ({ isLoading: true, error: null }));

        // API-Aufruf zum Laden der Daten
        const tiles = await SolvboxAIService.getTilesForTab(activeTab);

        set((state) => ({
          tiles: tiles,
          lastLoaded: Date.now().toString(),
          isLoading: false,
        }));
      } catch (error) {
        set((state) => ({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        }));
      }
    },

    /**
     * Holt alle verfügbaren Tabs
     */
    getTabs: () => {
      // In einer realen Implementierung würden wir das von der API holen
      return ['gigs', 'casestudies'];
    },

    /**
     * Lädt Empfehlungen
     */
    loadRecommendations: async () => {
      const state = get();

      // Nur laden, wenn nötig
      const shouldLoad =
        !state.recommendationsLoaded ||
        parseInt(state.recommendationsLoaded, 10) && (Date.now() - parseInt(state.recommendationsLoaded, 10)) > 60 * 60 * 1000; // 1 Stunde Cache

      if (!shouldLoad) return;

      try {
        // API-Aufruf zum Laden der Empfehlungen
        const recommendations = await SolvboxAIService.getRecommendedTiles();

        set((state) => ({
          recommendations,
          recommendationsLoaded: Date.now().toString(),
        }));
      } catch (error) {
        // Fehler nur loggen, nicht in den Zustand schreiben
        console.error('Fehler beim Laden der Empfehlungen:', error);
      }
    },

    /**
     * Markiert eine Kachel als genutzt
     * @param tileId
     */
    markTileAsUsed: (tileId: number) => {
      // API-Aufruf zum Markieren als genutzt (fire-and-forget)
      SolvboxAIService.markTileAsUsed(tileId).catch((error) => {
        console.error('Fehler beim Markieren als genutzt:', error);
      });

      // Keine Zustandsänderung nötig
    },

    /**
     * Sendet Feedback zu einer Kachel
     * @param tileId
     * @param rating
     * @param comment
     */
    sendFeedback: async (tileId: number, rating: number, comment?: string) => {
      try {
        // API-Aufruf zum Senden des Feedbacks
        await SolvboxAIService.sendFeedback(tileId, rating, comment);
        return Promise.resolve();
      } catch (error) {
        console.error('Fehler beim Senden des Feedbacks:', error);
        return Promise.reject(error);
      }
    },
  };
} 