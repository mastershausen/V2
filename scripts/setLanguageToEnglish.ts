import { changeLanguage } from '../i18n/config';

/**
 * Setzt die Sprache der Anwendung auf Englisch
 */
export const setLanguageToEnglish = async (): Promise<void> => {
  await changeLanguage('en');
  console.log('Sprache wurde auf Englisch umgestellt');
};

// Führe die Funktion aus, wenn das Skript direkt aufgerufen wird
if (require.main === module) {
  setLanguageToEnglish();
}

export default setLanguageToEnglish; 