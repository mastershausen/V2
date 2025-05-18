import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { changeLanguage, getCurrentLanguage } from '@/i18n/config';
import { spacing, typography } from '@/config/theme';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Eigenschaften für die LanguageSelector-Komponente
 */
interface LanguageSelectorProps {
  /**
   * Callback, der aufgerufen wird, wenn die Sprache geändert wurde
   */
  onLanguageChange?: (language: string) => void;
  
  /**
   * Kompakter Anzeigemodus (nur Icon)
   * @default false
   */
  compact?: boolean;
}

/**
 * Eine Komponente zur Sprachauswahl
 * 
 * Ermöglicht dem Benutzer, die Sprache der Anwendung zu ändern.
 * Unterstützt Deutsch und Englisch und speichert die Auswahl.
 * 
 * @param {LanguageSelectorProps} props Die Komponentenprops
 * @returns {React.ReactElement} Die gerenderte Komponente
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange,
  compact = false
}) => {
  const { t, i18n } = useTranslation();
  const themeColors = useThemeColor();
  
  const currentLanguage = getCurrentLanguage();
  
  // Konstanten für Farben, die nicht direkt im Theme definiert sind
  const TEXT_COLOR_ON_PRIMARY = '#FFFFFF'; // Weiß für Text auf farbigem Hintergrund
  
  // Sprachen, die in der App unterstützt werden
  const languages = [
    { code: 'de', name: t('language.de'), flag: '🇩🇪' },
    { code: 'en', name: t('language.en'), flag: '🇬🇧' }
  ];

  /**
   * Ändert die aktuelle Sprache der App
   * 
   * @param {string} lang Der Sprachcode (z.B. 'de', 'en')
   */
  const handleLanguageChange = async (lang: string) => {
    if (lang !== currentLanguage) {
      await changeLanguage(lang);
      if (onLanguageChange) {
        onLanguageChange(lang);
      }
    }
  };

  // Findet die aktuelle Sprache in der Liste
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactButton, { backgroundColor: themeColors.backgroundSecondary }]}
        onPress={() => {
          // Wechsle zwischen Deutsch und Englisch
          const newLang = currentLanguage === 'de' ? 'en' : 'de';
          handleLanguageChange(newLang);
        }}
        accessibilityLabel={t('language.selection')}
      >
        <Text style={styles.flagText}>{selectedLanguage.flag}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        {t('language.selection')}
      </Text>
      
      <Text style={[styles.currentLanguage, { color: themeColors.textSecondary }]}>
        {t('language.currentLanguage', { language: selectedLanguage.name })}
      </Text>
      
      <View style={styles.languageButtons}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              { 
                backgroundColor: lang.code === currentLanguage 
                  ? themeColors.primary 
                  : themeColors.backgroundSecondary,
                borderColor: themeColors.divider
              }
            ]}
            onPress={() => handleLanguageChange(lang.code)}
            accessibilityLabel={lang.name}
            accessibilityState={{ selected: lang.code === currentLanguage }}
          >
            <Text style={styles.flagText}>{lang.flag}</Text>
            <Text 
              style={[
                styles.languageName,
                { 
                  color: lang.code === currentLanguage 
                    ? TEXT_COLOR_ON_PRIMARY 
                    : themeColors.textPrimary 
                }
              ]}
            >
              {lang.name}
            </Text>
            {lang.code === currentLanguage && (
              <Ionicons 
                name="checkmark-circle" 
                size={18} 
                color={TEXT_COLOR_ON_PRIMARY} 
                style={styles.checkIcon} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.m,
  },
  title: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.s,
  },
  currentLanguage: {
    fontSize: typography.fontSize.m,
    marginBottom: spacing.m,
  },
  languageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 120,
  },
  flagText: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  languageName: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.medium,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LanguageSelector; 