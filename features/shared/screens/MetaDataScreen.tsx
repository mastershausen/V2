import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  Alert,
  TextInput,
  Switch,
  Modal,
  FlatList,
  Keyboard,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCreateForm } from '@/features/shared/contexts/CreateFormContext';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

// Korrekte Tab-IDs entsprechend der Datenstruktur
const MYSOLVBOX_TABS = ["Sichern", "Wachsen", "Vorausdenken", "Bonus"];
const SOLVBOXAI_TABS = ["Gigs", "Fallstudien"];

// Kachel-Optionen entsprechend der tatsächlichen Daten in der App
type TileOptionsType = {
  [key: string]: string[];
};

const TILE_OPTIONS: TileOptionsType = {
  // MySolvbox Kacheln - Aus data/mysolvbox-tiles.json und features/mysolvbox/config/data.ts
  "Sichern": [
    "Kunden kurzfristig gewinnen", 
    "Fixkosten senken", 
    "Vermögen schützen", 
    "Unternehmen kernsanieren", 
    "Recht & Sicherheit", 
    "Kunden langfristig binden", 
    "Fremdkapital beschaffen", 
    "Mitarbeiter führen", 
    "Cyber- und IT-Sicherheit", 
    "Kunde ist insolvent. Was tun?"
  ],
  "Wachsen": [
    "Steuern auf ein Minimum", 
    "A-Mitarbeiter gewinnen und halten", 
    "Dauerhaften Kundenstrom aufbauen", 
    "Vertrieb der verkauft",
    "Brot & Butter Geschäft aufbauen",
    "Max. Marge Produkt aufbauen",
    "Steuern vom Finanzamt zurückholen",
    "Bitte, bitte nutze KI",
    "Investoren finden"
  ],
  "Vorausdenken": [
    "Erbschafts- & Schenkungssteuer vermeiden",
    "Unternehmen das ohne dich funktioniert",
    "Vermögen im Inland schützen",
    "Unternehmen verkaufen",
    "Nachfolge regeln",
    "Unternehmen kaufen",
    "Steuerfrei durch Immobilien",
    "Immobilien allgemein",
    "Off-market Immobilien",
    "Onlinegeschäft aufbauen"
  ],
  "Bonus": [
    "Lange und glücklich Leben",
    "Besser verhandeln",
    "Rhetorik & Kommunikation meistern",
    "Zukunftsforschung",
    "Ideen und neue Märkte entwickeln",
    "Allgemeine Goldnuggets",
    "Auswandern als Unternehmer",
    "Alternative Investments",
    "Unternehmen ins Ausland verlagern",
    "Auswandern mit Familie"
  ],
  
  // SolvboxAI Kacheln - Aus data/solvboxai-tiles.json und features/solvboxai/config/data.ts
  "Gigs": [
    "KI-Agenten für alltägliche Aufgaben", 
    "KI-Agenten für mehr PR & Podcasts",
    "KI im Kundenservice",
    "KI im Vertrieb",
    "KI im Recruiting",
    "KI als Rechtsberater",
    "KI als Unternehmensberater",
    "KI Anwendungen um Zeit & Geld zu sparen",
    "Was die Zukunft bringt"
  ],
  "Fallstudien": [
    "Lästige Alltagsaufgaben automatisieren",
    "Marketing",
    "PR & Podcasts",
    "Kundenservice",
    "Vertrieb",
    "Recht",
    "Recruiting",
    "Allgemein hilfreich & kostensenkend"
  ]
};

// Keyword Vorschläge nach Typ kategorisiert
const KEYWORD_SUGGESTIONS = {
  'gig': [
    'Steuerberatung', 'Online-Marketing', 'Buchhaltungsoptimierung', 
    'Umsatzsteigerung', 'Kostenreduktion', 'Digitale Transformation',
    'Internetauftritt verbessern', 'Social Media Strategie', 'SEO-Optimierung'
  ],
  'casestudy': [
    'Prozessoptimierung', 'Umsatzverdopplung', 'Kostenreduktion', 
    'Kundenerfahrung verbessern', 'Digitalisierungsprojekt', 'ERP-Einführung',
    'Cloud-Migration', 'Systemintegration', 'Marketing-Automation'
  ]
};

// Eingeschränkte Keywords, die alleine nicht erlaubt sind
const RESTRICTED_KEYWORDS = ['kunden', 'geld', 'service', 'firma', 'unternehmen', 'business'];

// Ergänze fehlende Typen für die KeywordTag-Komponente
interface KeywordTagProps {
  text: string;
  onRemove: () => void;
  colors: any; // Für die einfache Demo-Implementierung reicht 'any' als Typ
  index: number; // Index für unterschiedliche Pastellfarben
}

/**
 * KeywordTag-Komponente für die Darstellung eines einzelnen Keyword-Tags
 */
function KeywordTag({ text, onRemove, colors, index }: KeywordTagProps) {
  // Einheitliches Blau für alle Tags
  const tagColor = {
    bg: colors.pastel.primary,
    border: colors.pastel.primaryBorder,
    text: colors.primary
  };
  
  return (
    <View style={[styles.keywordTag, { 
      backgroundColor: tagColor.bg,
      borderColor: tagColor.border,
      borderWidth: 0.5, // Dünnerer Rand
    }]}>
      <Text style={[styles.keywordTagText, { color: tagColor.text }]}>
        {text}
      </Text>
      <TouchableOpacity onPress={onRemove} style={styles.keywordTagRemoveButton}>
        <Ionicons name="close-circle" size={16} color={tagColor.text} />
      </TouchableOpacity>
    </View>
  );
}

/**
 * Einfache Dropdown-Komponente als Ersatz für den Picker
 */
function CustomDropdown({ 
  options, 
  selectedValue, 
  onValueChange, 
  placeholder,
  labelStyle,
  containerStyle,
  colors
}: { 
  options: string[]; 
  selectedValue: string; 
  onValueChange: (value: string) => void; 
  placeholder?: string;
  labelStyle?: any;
  containerStyle?: any;
  colors: any;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[styles.dropdownButton, { 
          borderColor: colors.divider,
          backgroundColor: colors.backgroundSecondary,
          height: 40 // Gleiche Höhe wie Segmented Control
        }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownButtonText, labelStyle, { color: colors.textPrimary }]}>
          {selectedValue || placeholder || 'Auswählen'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { 
            backgroundColor: colors.backgroundPrimary,
            minHeight: 220 // Mindesthöhe für das Modal
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {placeholder || 'Auswählen'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedValue === item && { backgroundColor: colors.backgroundSecondary }
                  ]}
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.optionText, 
                      { color: colors.textPrimary },
                      selectedValue === item && { fontWeight: 'bold', color: colors.primary }
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedValue === item && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/**
 * Segmented Control Komponente
 */
function SegmentedControl({ 
  options, 
  selectedValue, 
  onValueChange,
  colors
}: { 
  options: Array<{value: boolean, label: string}>;
  selectedValue: boolean;
  onValueChange: (value: boolean) => void;
  colors: any;
}) {
  return (
    <View style={[styles.segmentedControl, { 
      backgroundColor: colors.backgroundTertiary,
      borderColor: colors.primary,
      borderWidth: 1,
    }]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.label}
          style={[
            styles.segmentedControlOption,
            selectedValue === option.value && { 
              backgroundColor: colors.pastel.primary,
            }
          ]}
          onPress={() => onValueChange(option.value)}
        >
          <Text
            style={[
              styles.segmentedControlText,
              { color: colors.textSecondary },
              selectedValue === option.value && { 
                color: colors.primary,
                fontWeight: typography.fontWeight.bold 
              }
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/**
 * MetaDataScreen
 * 
 * Gemeinsamer Screen für zusätzliche Metadaten sowohl für Gigs als auch für Fallstudien.
 * Wird über getrennte Routen in verschiedenen Stacks angesteuert.
 */
export default function MetaDataScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { formData, goBackToDetailsScreen } = useCreateForm();
  
  // State für Metadaten
  const [keywordTags, setKeywordTags] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [keywordError, setKeywordError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const keywordInputRef = useRef<TextInput>(null);
  const errorAnim = useRef(new Animated.Value(0)).current;
  
  // MySolvbox vorausgewählt, aber Tab und Kachel bleiben leer
  const [showInMySolvbox, setShowInMySolvbox] = useState<boolean>(true); // MySolvbox vorausgewählt
  const [selectedTab, setSelectedTab] = useState<string>(''); // Kein Tab vorausgewählt 
  const [selectedTile, setSelectedTile] = useState<string>(''); // Keine Kachel vorausgewählt
  
  // Keywordeingabe validieren und ggf. hinzufügen
  const validateAndAddKeyword = (text: string) => {
    // Trimmen und in Kleinbuchstaben umwandeln für die Prüfung
    const trimmedText = text.trim();
    const lowerText = trimmedText.toLowerCase();
    
    // Leere Eingabe ignorieren
    if (trimmedText === '') {
      setCurrentKeyword('');
      return;
    }
    
    // Prüfen, ob das Keyword bereits existiert
    if (keywordTags.includes(trimmedText)) {
      showErrorAnimation('Dieses Keyword wurde bereits hinzugefügt');
      return;
    }
    
    // In Wörter aufteilen und prüfen, ob es mindestens zwei gibt
    const words = trimmedText.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length < 2) {
      showErrorAnimation('Keywords müssen aus mindestens zwei Wörtern bestehen');
      return;
    }
    
    // Prüfen, ob es Wiederholungen gibt (z.B. "Kunde Kunde")
    for (let i = 1; i < words.length; i++) {
      if (words[i].toLowerCase() === words[i-1].toLowerCase()) {
        showErrorAnimation('Keywords dürfen keine Wortwiederholungen enthalten');
        return;
      }
    }
    
    // Prüfen, ob es sich um ein eingeschränktes Einzelwort handelt
    if (RESTRICTED_KEYWORDS.includes(lowerText) && !lowerText.includes(' ')) {
      showErrorAnimation(`"${trimmedText}" ist zu allgemein. Bitte spezifischer formulieren`);
      return;
    }
    
    // Wenn alles okay ist, Keyword hinzufügen
    setKeywordTags([...keywordTags, trimmedText]);
    setCurrentKeyword('');
    setKeywordError('');
  };
  
  // Fehlermeldung mit Animation anzeigen
  const showErrorAnimation = (message: string) => {
    setKeywordError(message);
    Animated.sequence([
      Animated.timing(errorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }),
      Animated.timing(errorAnim, {
        toValue: 0,
        duration: 300,
        delay: 2000,
        useNativeDriver: false
      })
    ]).start(() => setKeywordError(''));
  };
  
  // Keyword entfernen
  const removeKeyword = (index: number) => {
    const newTags = [...keywordTags];
    newTags.splice(index, 1);
    setKeywordTags(newTags);
  };
  
  // Vorschlag auswählen
  const selectSuggestion = (suggestion: string) => {
    if (!keywordTags.includes(suggestion)) {
      setKeywordTags([...keywordTags, suggestion]);
    }
    setShowSuggestions(false);
    keywordInputRef.current?.focus();
  };

  // Handler für Toggle zwischen MySolvbox und SolvboxAI
  const handleToggleChange = (value: boolean) => {
    setShowInMySolvbox(value);
    
    // Zurücksetzen der Auswahlen
    setSelectedTab('');
    setSelectedTile('');
  };
  
  // Handler für Änderung des Tabs
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    // Zurücksetzen der Kachelauswahl, wenn der Tab sich ändert
    setSelectedTile('');
  };
  
  // Handler für Erstellen-Button
  const handleCreatePress = () => {
    // Prüfen, ob alle notwendigen Auswahlfelder befüllt sind
    if (showInMySolvbox === null) {
      Alert.alert('Fehler', 'Bitte wähle aus, ob dein Beitrag in MySolvbox oder SolvboxAI erscheinen soll.');
      return;
    }
    
    if (!selectedTab) {
      Alert.alert('Fehler', 'Bitte wähle einen Tab aus.');
      return;
    }
    
    if (!selectedTile) {
      Alert.alert('Fehler', 'Bitte wähle eine Kachel aus.');
      return;
    }

    // Prüfen, ob die Beschreibung mindestens 500 Zeichen hat
    if (formData.description.length < 500) {
      Alert.alert(
        'Beschreibung zu kurz',
        `Die Beschreibung sollte mindestens 500 Zeichen enthalten, um qualitativ hochwertigen Content zu gewährleisten. Aktuell: ${formData.description.length} Zeichen.`
      );
      return;
    }
    
    // Metadaten ausgeben (später an API senden)
    console.log({
      contentType: formData.type,
      keywords: keywordTags,
      destination: showInMySolvbox ? 'MySolvbox' : 'SolvboxAI',
      tab: selectedTab,
      tile: selectedTile
    });
    
    // Erfolgsmeldung und Navigation zur Startseite
    Alert.alert(
      `${formData.type === 'gig' ? 'Gig' : 'Fallstudie'} erfolgreich erstellt`,
      `Dein ${formData.type === 'gig' ? 'Gig' : 'Deine Fallstudie'} wurde erfolgreich erstellt!`,
      [{ text: 'OK', onPress: () => router.push('/(tabs)/home') }]
    );
  };

  // Erstellungs-Button für die Header-Navigation
  const renderCreateButton = () => (
    <TouchableOpacity 
      style={styles.createButton}
      onPress={handleCreatePress}
    >
      <Text style={[styles.createButtonText, { color: colors.primary }]}>
        Erstellen
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* HeaderNavigation-Komponente */}
      <HeaderNavigation
        title={formData.type === 'gig' ? 'Gig-Metadaten' : 'Fallstudien-Metadaten'}
        showBackButton={true}
        onBackPress={goBackToDetailsScreen}
        rightContent={renderCreateButton()}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {formData.type === 'gig' ? 'Gig-Metadaten' : 'Fallstudien-Metadaten'} hinzufügen
          </Text>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Hier kannst du weitere Informationen zu {formData.type === 'gig' ? 'deinem Gig' : 'deiner Fallstudie'} hinzufügen, 
            um {formData.type === 'gig' ? 'ihn' : 'sie'} besser auffindbar zu machen.
          </Text>
          
          {/* Keywords-Eingabe */}
          <View style={[styles.section, { 
            backgroundColor: colors.backgroundSecondary,
            borderRadius: ui.borderRadius.m,
            padding: spacing.m,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Keywords
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Gib spezifische Suchbegriffe oder Phrasen ein, damit dein Beitrag bei relevanten Suchanfragen erscheint
            </Text>
            
            {/* Keyword-Eingabefeld im iOS-Stil */}
            <View style={[styles.keywordInputContainer, { 
              borderColor: keywordError ? colors.error : 'transparent',
              backgroundColor: colors.backgroundPrimary,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }]}>
              {/* Bereits hinzugefügte Keywords als Tags anzeigen */}
              <View style={styles.keywordTagsContainer}>
                {keywordTags.map((tag, index) => (
                  <KeywordTag 
                    key={index} 
                    text={tag} 
                    onRemove={() => removeKeyword(index)} 
                    colors={colors}
                    index={index}
                  />
                ))}
                
                {/* Eingabefeld für neue Keywords */}
                <TextInput
                  ref={keywordInputRef}
                  style={[styles.keywordInput, { color: colors.textPrimary }]}
                  value={currentKeyword}
                  onChangeText={setCurrentKeyword}
                  placeholder={keywordTags.length === 0 ? "Keyword hinzufügen..." : ""}
                  placeholderTextColor={colors.textTertiary}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  onFocus={() => setShowSuggestions(true)}
                  onSubmitEditing={() => {
                    validateAndAddKeyword(currentKeyword);
                  }}
                  onBlur={() => {
                    if (currentKeyword.trim() !== '') {
                      validateAndAddKeyword(currentKeyword);
                    }
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
              </View>
            </View>
            
            {/* Fehlermeldung mit Animation */}
            <Animated.View 
              style={[
                styles.errorContainer, 
                { 
                  opacity: errorAnim,
                  height: errorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20]
                  }) 
                }
              ]}
            >
              <Text style={[styles.errorText, { color: colors.error }]}>
                {keywordError}
              </Text>
            </Animated.View>
            
            {/* Keyword-Vorschläge */}
            {showSuggestions && (
              <View style={[styles.suggestionsContainer, { 
                backgroundColor: colors.backgroundPrimary,
                borderColor: colors.divider,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
              }]}>
                <Text style={[styles.suggestionsTitle, { color: colors.textSecondary }]}>
                  Vorschläge
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.suggestionsRow}>
                    {KEYWORD_SUGGESTIONS[formData.type === 'gig' ? 'gig' : 'casestudy'].map((suggestion, index) => (
                      <TouchableOpacity 
                        key={index}
                        style={[styles.suggestionTag, { 
                          backgroundColor: keywordTags.includes(suggestion) 
                            ? colors.pastel.primary
                            : colors.backgroundTertiary,
                          borderColor: keywordTags.includes(suggestion)
                            ? colors.pastel.primaryBorder
                            : 'transparent',
                          borderWidth: 0.5, // Dünnerer Rand
                          paddingVertical: 3, // Kompaktere Höhe
                          paddingHorizontal: spacing.xs,
                        }]}
                        onPress={() => selectSuggestion(suggestion)}
                      >
                        <Text style={[styles.suggestionText, { 
                          color: keywordTags.includes(suggestion) 
                            ? colors.primary 
                            : colors.textPrimary,
                          fontSize: typography.fontSize.xs, // Kleinere Schrift
                        }]}>
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
          
          {/* Zielbereich-Auswahl */}
          <View style={[styles.section, { 
            backgroundColor: colors.backgroundSecondary,
            borderRadius: ui.borderRadius.m,
            padding: spacing.m,
            marginTop: spacing.m,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Zielbereich
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Wähle aus, wo dein Beitrag zusätzlich erscheinen soll
            </Text>
            
            {/* Segmented Control für MySolvbox/SolvboxAI */}
            <View style={{ marginVertical: spacing.m }}>
              <SegmentedControl
                options={[
                  { value: true, label: 'MySolvbox' },
                  { value: false, label: 'SolvboxAI' }
                ]}
                selectedValue={showInMySolvbox}
                onValueChange={handleToggleChange}
                colors={colors}
              />
            </View>
            
            {/* Tab-Auswahl */}
            <View style={styles.pickerContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Tab auswählen
              </Text>
              <CustomDropdown
                options={showInMySolvbox === true ? MYSOLVBOX_TABS : showInMySolvbox === false ? SOLVBOXAI_TABS : []}
                selectedValue={selectedTab}
                onValueChange={handleTabChange}
                placeholder="Tab auswählen"
                colors={colors}
                containerStyle={styles.dropdownContainer}
              />
            </View>
            
            {/* Kachel-Auswahl */}
            <View style={styles.pickerContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Kachel auswählen
              </Text>
              <CustomDropdown
                options={selectedTab ? (TILE_OPTIONS[selectedTab] || []) : []}
                selectedValue={selectedTile}
                onValueChange={setSelectedTile}
                placeholder="Kachel auswählen"
                colors={colors}
                containerStyle={styles.dropdownContainer}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createButton: {
    padding: spacing.xs,
  },
  createButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.s,
  },
  description: {
    fontSize: typography.fontSize.m,
    marginBottom: spacing.l,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.m,
  },
  input: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    fontSize: typography.fontSize.m,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.m,
  },
  toggleLabel: {
    fontSize: typography.fontSize.m,
    marginHorizontal: spacing.m,
  },
  pickerContainer: {
    marginBottom: spacing.m,
  },
  inputLabel: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.xs,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    paddingHorizontal: spacing.m,
    height: 40, // Gleiche Höhe wie Segmented Control
  },
  dropdownButtonText: {
    fontSize: typography.fontSize.m,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.m,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
    paddingBottom: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    marginBottom: spacing.xs,
  },
  optionText: {
    fontSize: typography.fontSize.m,
  },
  
  // Neue Stile für Keywords
  keywordInputContainer: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    minHeight: 50,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  keywordTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  keywordTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3, // Kompaktere Höhe
    margin: 3,
  },
  keywordTagText: {
    fontSize: typography.fontSize.xs, // Kleinere Schrift
    marginRight: 3,
    fontWeight: typography.fontWeight.medium,
  },
  keywordTagRemoveButton: {
    padding: 1,
  },
  keywordInput: {
    flex: 1,
    minWidth: 100,
    height: 30,
    fontSize: typography.fontSize.m,
    paddingHorizontal: spacing.xs,
  },
  errorContainer: {
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  errorText: {
    fontSize: typography.fontSize.xs,
  },
  suggestionsContainer: {
    marginTop: spacing.xs,
    padding: spacing.s,
    borderRadius: ui.borderRadius.m,
    borderWidth: 1,
  },
  suggestionsTitle: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingBottom: spacing.xs,
  },
  suggestionTag: {
    padding: spacing.s,
    borderRadius: 20,
    marginRight: spacing.xs,
  },
  suggestionText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium,
  },
  dropdownContainer: {
    marginTop: spacing.xs,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: ui.borderRadius.m,
    overflow: 'hidden',
    height: 40,
  },
  segmentedControlOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  segmentedControlText: {
    fontSize: typography.fontSize.m,
  },
}); 