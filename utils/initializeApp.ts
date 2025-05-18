/**
 * @file utils/initializeApp.ts
 * @description Zentrale Initialisierungsfunktion für die App
 * 
 * Diese Datei enthält die zentrale Initialisierungsfunktion, die alle Stores
 * und Services in der richtigen Reihenfolge initialisiert.
 */

import { initializeModeStore } from '@/features/mode/stores/modeStore';
import { initializeAuthStore } from '@/stores/authStore';

import { logger } from './logger';
import bootstrapServices from './service/initServices';


/**
 * Initialisiert alle Stores und Services der App in der richtigen Reihenfolge
 *
 * Die Reihenfolge ist wichtig, da einige Stores von anderen abhängen können.
 * Diese Funktion sollte nur einmal beim App-Start aufgerufen werden.
 * @returns {Promise<void>} Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist
 */
export default async function initializeApp(): Promise<void> {
  try {
    logger.info('Starte App-Initialisierung...');

    // 1. Services registrieren und initialisieren
    await bootstrapServices();
    logger.info('Services registriert und initialisiert');

    // 2. Auth Store initialisieren
    await initializeAuthStore();
    logger.info('Auth Store initialisiert');

    // 3. Mode Store initialisieren
    await initializeModeStore();
    logger.info('Mode Store initialisiert');

    // Weitere Stores können hier in der richtigen Reihenfolge initialisiert werden

    logger.info('App-Initialisierung erfolgreich abgeschlossen');
  } catch (error) {
    logger.error('Fehler bei der App-Initialisierung:', String(error));
    throw error; // Fehler weiterwerfen, damit die App entsprechend reagieren kann
  }
} 