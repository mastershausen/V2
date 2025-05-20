import { useNavigation } from '@react-navigation/native';
import React, { memo, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableWithoutFeedback, 
  Keyboard, 
  StatusBar, 
  Platform, 
  SafeAreaView,
  KeyboardAvoidingView,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { borderRadius, spacing, typography } from '@/config/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SearchInput } from '@/shared-components/searchinput/SearchInput';

import { SuggestionList } from '../components/SuggestionList';
import { useHome } from '../hooks/useHome';
import { HomeScreenColors, getHomeColors } from '../types/theme';

// Konstanten für Layout-Berechnungen
const SMALL_DEVICE_THRESHOLD = 700;
const TOP_MARGIN_PERCENT_SMALL = 0.05;
const TOP_MARGIN_PERCENT_NORMAL = 0.10;
const IOS_STATUS_BAR_HEIGHT = 50;
const IOS_KEYBOARD_OFFSET = 10;

/**
 * Hauptbildschirm der Anwendung mit Suchfunktion und Vorschlägen.
 * 
 * Diese Komponente zeigt einen auf Suche fokussierten HomeScreen an, der ein prominentes
 * Suchfeld und eine Liste von Suchvorschlägen bietet. Die Komponente ist vollständig
 * responsive und passt ihr Layout je nach Gerätegröße und Plattform an.
 * 
 * Funktionen:
 * - Prominente Suchleiste mit direkter Eingabemöglichkeit
 * - Dynamisch generierte Suchvorschläge
 * - Vollautomatische Navigation zu Suchergebnissen
 * - Optimiertes Layout für verschiedene Bildschirmgrößen
 * - Plattformspezifische Anpassungen (iOS/Android)
 * - Vollständige Tastatur- und Theme-Unterstützung
 * - Mehrsprachige Unterstützung via i18n
 * 
 * Die gesamte Such-Logik wird aus dem `useHome`-Hook bezogen, wodurch diese Komponente
 * als reine UI-Komponente ohne eigene Geschäftslogik fungiert (Separation of Concerns).
 * 
 * @returns {React.ReactElement} Die gerenderte HomeScreen-Komponente
 */
function HomeScreen() {
  // i18n Translation Hook
  const { t } = useTranslation();
  
  // Hooks für Styling und Dimensionen
  const themeColors = useThemeColor();
  const colors = getHomeColors(themeColors);
  const colorScheme = useColorScheme();
  
  // Router für Navigation
  const router = useRouter();
  
  // Verwende useWindowDimensions für bessere Performance
  const { height: windowHeight } = useWindowDimensions();
  
  // Zugriff auf den useHome-Hook für die gesamte Suchlogik
  const { 
    searchQuery, 
    setSearchQuery, 
    handleSearch, 
    handleSuggestionPress,
    isSearching,
    suggestions
  } = useHome({
    autoNavigateToResults: true
  });
  
  // Berechnung der Layouts mit useMemo für Performance-Optimierung
  const layoutStyles = useMemo(() => {
    // Dynamisches Styling für den Status Bar
    const statusBarHeight = Platform.OS === "ios" ? IOS_STATUS_BAR_HEIGHT : StatusBar.currentHeight || 0;
    
    // Anpassung der Top-Margin basierend auf Bildschirmhöhe
    const isSmallDevice = windowHeight < SMALL_DEVICE_THRESHOLD;
    const topMarginPercent = isSmallDevice ? TOP_MARGIN_PERCENT_SMALL : TOP_MARGIN_PERCENT_NORMAL;
    const topMargin = statusBarHeight + (windowHeight * topMarginPercent);
    
    return { marginTop: topMargin };
  }, [windowHeight]);
  
  // Erstelle Styles basierend auf den aktuellen Theme-Farben
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? IOS_KEYBOARD_OFFSET : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <StatusBar 
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent={true}
          />
          
          <View style={[styles.contentContainer, layoutStyles]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Wie können wir helfen?
              </Text>
              <Text style={styles.headerSubtitle}>
                Suchst du nach Expertise oder Lösungen?
              </Text>
            </View>
            
            <View style={styles.searchContainer}>
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('home.searchPlaceholder')}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                isLoading={isSearching}
                clearButtonMode="while-editing"
                shadowLevel="light"
              />
            </View>
            
            <View style={styles.suggestionsContainer}>
              <Text style={[styles.suggestionsTitle, { color: colors.textSecondary }]}>
                Meistgesuchte Lösungen
              </Text>
              <SuggestionList
                suggestions={suggestions}
                onSuggestionPress={handleSuggestionPress}
                colors={colors}
                horizontal={false}
                maxItems={5}
                containerStyle={styles.suggestionListContainer}
              />
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/**
 * Erstellt Styles für den HomeScreen basierend auf den Theme-Farben.
 * 
 * @param {HomeScreenColors} colors - Die Theme-Farben für den HomeScreen
 * @returns {StyleSheet.NamedStyles<any>} Das StyleSheet-Objekt mit allen Stilen
 */
const createStyles = (colors: HomeScreenColors) => StyleSheet.create({
  // Container-Stile
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  contentContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.xl,
  },
  
  // Header-Stile
  header: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
    alignItems: 'center', // Zentriert den Text horizontal
  },
  headerTitle: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center', // Zentriert den Text
    width: '100%', // Stellt sicher, dass der Text die volle Breite einnimmt
  },
  headerSubtitle: {
    fontSize: typography.fontSize.l,
    color: colors.textSecondary,
    marginBottom: spacing.m,
    textAlign: 'center', // Zentriert den Text
  },
  
  // Such-/Vorschlagsstile
  searchContainer: {
    marginBottom: spacing.m,
  },
  suggestionsContainer: {
    marginTop: spacing.m,
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  suggestionListContainer: {
    marginTop: spacing.xs,
  },
});

/**
 * Exportiert eine memoized Version des HomeScreen, um unnötige
 * Renderingzyklen zu vermeiden, wenn sich die Props nicht ändern.
 */
export default memo(HomeScreen); 