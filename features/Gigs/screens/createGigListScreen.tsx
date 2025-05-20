import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import * as ImagePicker from 'expo-image-picker';

/**
 * WYSIWYG Gig-Erstellungsscreen
 * Erlaubt die direkte Bearbeitung einer Gig-Karte mit Echtzeit-Vorschau
 */
export default function CreateGigListScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // State für Gig-Daten
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('€');
  const [imageUrl, setImageUrl] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  // Preistyp (kostenlos, auf Anfrage, spezifischer Preis)
  const [priceType, setPriceType] = useState<'specific' | 'free' | 'inquiry'>('specific');
  
  // Ist der Gig vollständig genug, um erstellt zu werden?
  const canCreateGig = title.trim() !== '' && (description.trim() !== '' || isEditingDescription);
  
  // Bild auswählen
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Berechtigung erforderlich', 'Bitte erlaube den Zugriff auf deine Fotos, um ein Bild auszuwählen.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Hier würde normalerweise der Upload zum Server erfolgen
        // Für das Demo verwenden wir die lokale URI direkt
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Fehler beim Auswählen des Bildes:', error);
      Alert.alert('Fehler', 'Das Bild konnte nicht ausgewählt werden.');
    }
  };
  
  // Gig erstellen
  const createGig = () => {
    // Hier würde die tatsächliche Gig-Erstellung erfolgen
    const gigData = {
      title,
      description,
      price: priceType === 'specific' ? parseFloat(price) || 0 : 0,
      currency: priceType === 'free' 
                ? 'Kostenlos' 
                : priceType === 'inquiry' 
                  ? 'Auf Anfrage' 
                  : currency,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      rating: 5.0, // Neue Gigs starten mit 5.0 Sternen
    };
    
    Alert.alert(
      'Gig erstellt',
      'Dein Gig wurde erfolgreich erstellt.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  // Erstellen-Button für HeaderNavigation
  const renderErstellenButton = () => (
    <TouchableOpacity 
      onPress={createGig}
      disabled={!canCreateGig}
    >
      <Text 
        style={[
          styles.createButtonText, 
          { color: canCreateGig ? colors.primary : colors.textSecondary }
        ]}
      >
        Erstellen
      </Text>
    </TouchableOpacity>
  );
  
  // Formatierter Preis für die Anzeige
  const displayPrice = () => {
    if (priceType === 'free') return 'Kostenlos';
    if (priceType === 'inquiry') return 'Auf Anfrage';
    
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return `${currency}0`;
    return `${currency}${numPrice.toLocaleString('de-DE')}`;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Neues Gig" 
        rightContent={renderErstellenButton()}
        onBackPress={() => router.back()}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Editierbare GigCard */}
            <View style={[styles.gigCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.cardContent}>
                {/* Bild im 4:3 Format */}
                <TouchableOpacity 
                  style={styles.imageContainer}
                  onPress={pickImage}
                >
                  {imageUrl ? (
                    <Image 
                      source={{ uri: imageUrl }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.backgroundTertiary }]}>
                      <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
                      <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
                        Bild hinzufügen
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                {/* Text-Content */}
                <View style={styles.textContainer}>
                  {/* Editierbare Überschrift */}
                  <TextInput
                    style={[styles.titleInput, { color: colors.textPrimary }]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Titel des Gigs"
                    placeholderTextColor={colors.textTertiary}
                    maxLength={50}
                  />
                  
                  {/* Editierbare Beschreibung oder Anzeige */}
                  {isEditingDescription ? (
                    <TextInput
                      style={[styles.descriptionInput, { color: colors.textSecondary }]}
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Beschreibung des Gigs"
                      placeholderTextColor={colors.textTertiary}
                      multiline
                      numberOfLines={3}
                      maxLength={200}
                      onBlur={() => setIsEditingDescription(false)}
                      autoFocus
                    />
                  ) : (
                    <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
                      <Text 
                        style={[
                          styles.description, 
                          { color: description ? colors.textSecondary : colors.textTertiary }
                        ]}
                        numberOfLines={3}
                      >
                        {description || "Tippe hier, um eine Beschreibung hinzuzufügen"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {/* Fußzeile mit Preis und Bewertung */}
                  <View style={styles.footer}>
                    {/* Preis-Sektion */}
                    <TouchableOpacity 
                      onPress={() => {
                        // Zyklisch durch die Preistypen rotieren
                        if (priceType === 'specific') setPriceType('free');
                        else if (priceType === 'free') setPriceType('inquiry');
                        else setPriceType('specific');
                      }}
                    >
                      {priceType === 'specific' ? (
                        <View style={styles.priceInputContainer}>
                          <Text style={styles.currencyText}>{currency}</Text>
                          <TextInput
                            style={[styles.priceInput, { color: colors.textPrimary }]}
                            value={price}
                            onChangeText={setPrice}
                            placeholder="0"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="numeric"
                            maxLength={10}
                          />
                        </View>
                      ) : (
                        <Text style={[styles.price, { color: colors.textPrimary, fontWeight: 'bold' }]}>
                          {displayPrice()}
                        </Text>
                      )}
                    </TouchableOpacity>
                    
                    {/* Bewertungsanzeige (fest für neue Gigs) */}
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD600" style={{ marginRight: 2 }} />
                      <Text style={[styles.rating, { color: colors.textSecondary }]}>
                        5.0
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Hilfe-Text */}
            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpText, { color: colors.textTertiary }]}>
                Tippe auf die einzelnen Elemente, um sie zu bearbeiten. Tippe auf den Preis, um zwischen verschiedenen Preisoptionen zu wechseln.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  helpTextContainer: {
    marginTop: spacing.m,
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  helpText: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    textAlign: 'center',
  },
  // GigCard Styles
  gigCard: {
    borderRadius: ui.borderRadius.m,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    maxHeight: 130,
    minHeight: 130,
    marginBottom: spacing.m,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    transform: [{ translateY: -4 }],
  },
  cardContent: {
    flexDirection: 'row',
    paddingRight: spacing.m,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: '100%',
    borderTopLeftRadius: ui.borderRadius.m,
    borderBottomLeftRadius: ui.borderRadius.m,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    marginRight: spacing.m,
    backgroundColor: '#eee',
    marginLeft: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    marginLeft: spacing.s,
    paddingRight: spacing.s,
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
  },
  titleInput: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
    padding: 0,
  },
  description: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    marginBottom: spacing.s,
  },
  descriptionInput: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    marginBottom: spacing.s,
    padding: 0,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    fontSize: typography.fontSize.m,
    fontWeight: 'bold',
  },
  priceInput: {
    fontSize: typography.fontSize.m,
    fontWeight: 'bold',
    padding: 0,
    width: 60,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: ui.borderRadius.s,
  },
  rating: {
    fontSize: typography.fontSize.s,
    marginLeft: spacing.xxs,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
