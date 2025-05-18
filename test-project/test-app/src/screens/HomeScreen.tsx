import React from 'react';
import { 
  View, 
  Text, 
  TouchableWithoutFeedback, 
  Keyboard, 
  StatusBar, 
  Platform, 
  SafeAreaView,
  StyleSheet,
  TextInput
} from 'react-native';

// Konstanten für Styling
const typography = {
  fontSize: {
    title: 24,
    medium: 16,
  },
  fontWeight: {
    bold: "700",
    regular: "400"
  }
};

const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32
};

// Konstanten für Layout-Berechnungen
const SMALL_DEVICE_THRESHOLD = 700;
const TOP_MARGIN_PERCENT_SMALL = 0.05;
const TOP_MARGIN_PERCENT_NORMAL = 0.10;
const IOS_STATUS_BAR_HEIGHT = 50;

/**
 * Hauptbildschirm der Anwendung mit Suchfunktion und Vorschlägen.
 */
export default function HomeScreen() {
  // Status für die Suchleiste
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Farben für Light/Dark-Mode
  const colors = {
    backgroundPrimary: '#FFFFFF',
    textPrimary: '#333333',
    textSecondary: '#666666',
    inputBackground: '#F5F5F5',
    chipBackground: '#EFEFEF',
    chipText: '#333333'
  };
  
  // Dummy-Vorschläge
  const suggestions = [
    { id: '1', title: '? Steueroptionen' },
    { id: '2', title: '? Geld sparen' },
    { id: '3', title: '? Wachstumsstrategien' },
    { id: '4', title: '? Geschäftsplan' },
    { id: '5', title: '? Anlageberatung' },
    { id: '6', title: '? Versicherungen' },
    { id: '7', title: '? Altersvorsorge' },
  ];
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle={'dark-content'}
          backgroundColor="transparent"
          translucent={true}
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Wie können wir helfen?
            </Text>
            <Text style={styles.headerSubtitle}>
              Suchst du nach Expertise oder Lösungen?
            </Text>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Hier nach Lösung suchen..."
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          
          <View style={styles.suggestionsContainer}>
            {suggestions.map(suggestion => (
              <View key={suggestion.id} style={styles.suggestionChip}>
                <Text style={styles.suggestionText}>{suggestion.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

// Styles
const styles = StyleSheet.create({
  // Container-Stile
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.xl,
    marginTop: 50 // Feste Marge oben
  },
  
  // Header-Stile
  header: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
    alignItems: 'center', // Zentriert den Text horizontal
  },
  headerTitle: {
    fontSize: typography.fontSize.title, // Reduzierte Schriftgröße
    fontWeight: typography.fontWeight.bold,
    color: '#333333',
    marginBottom: spacing.xs,
    textAlign: 'center', // Zentriert den Text
    width: '100%', // Stellt sicher, dass der Text die volle Breite einnimmt
  },
  headerSubtitle: {
    fontSize: typography.fontSize.medium,
    color: '#666666',
    marginBottom: spacing.m,
    textAlign: 'center', // Zentriert den Text
  },
  
  // Such-/Vorschlagsstile
  searchContainer: {
    marginBottom: spacing.m,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: spacing.m,
    fontSize: typography.fontSize.medium,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.s,
    justifyContent: 'center',
  },
  suggestionChip: {
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    padding: spacing.s,
    paddingHorizontal: spacing.m,
    margin: spacing.xs,
  },
  suggestionText: {
    fontSize: typography.fontSize.medium,
    color: '#333333',
  }
}); 