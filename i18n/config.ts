import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './de.json';
import en from './en.json';

i18n.use(initReactI18next).init({
  resources: {
    de: {
      translation: de,
    },
    en: {
      translation: en,
    }
  },
  lng: 'de',
  fallbackLng: 'de',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  returnEmptyString: false,
  parseMissingKeyHandler: (key) => {
    return key.split('.').pop() || key;
  }
});

/**
 * Ändert die Sprache der Anwendung
 * @param language Der Sprachcode (z.B. 'de', 'en')
 */
export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language);
};

/**
 * Gibt die aktuelle Sprache der Anwendung zurück
 * @returns Der aktuelle Sprachcode
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export default i18n; 