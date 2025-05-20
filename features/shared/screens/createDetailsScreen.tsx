import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderMedia } from '@/shared-components/media/HeaderMedia';
import { ProfileImage } from '@/shared-components/media/ProfileImage';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { NuggetCardInteraction } from '@/shared-components/cards/nugget-card/components/NuggetCardInteraction';
import { DateBadge, ReviewBadge } from '@/shared-components/badges';

// Demo-Daten von Alexander Becker
const DEMO_USER = {
  name: 'Alexander Becker',
  profileImage: null, // Wir nutzen Initialen
  description: 'Ich zeige Selbstständigen & Unternehmern, wie sie mit legaler Steueroptimierung 5-stellig sparen können – jedes Jahr.',
  headline: 'Steuern runter. Gewinn rauf.',
  rating: 5.0,
  ratingCount: 42
};

export type CreateDetailsType = 'gig' | 'casestudy';

interface CreateDetailsScreenProps {
  /**
   * Bestimmt den Typ des Inhalts (Gig oder Fallstudie)
   * @default 'gig'
   */
  type?: CreateDetailsType;
  
  /**
   * Titel in der Navigationsleiste
   */
  navigationTitle?: string;
  
  /**
   * Ziel-Route beim Speichern/Erstellen
   */
  redirectRoute?: string;
  
  /**
   * Button-Text für den Erstellungsbutton im Header
   * @default 'Erstellen'
   */
  submitButtonText?: string;
  
  /**
   * Labels für die Action-Buttons im Footer
   */
  actionButtonLabels?: {
    leftButton?: string;
    middleButton?: string;
    rightButton?: string;
  };
}

/**
 * Universeller Erstellungs-/Bearbeitungs-Screen für Gigs und Fallstudien im WYSIWYG-Format
 */
export default function CreateDetailsScreen({
  type = 'gig',
  navigationTitle = type === 'gig' ? 'Gig erstellen' : 'Fallstudie erstellen',
  redirectRoute = '/(tabs)/home',
  submitButtonText = 'Erstellen',
  actionButtonLabels = {
    leftButton: 'Bewerten',
    middleButton: 'Anfragen',
    rightButton: type === 'gig' ? 'Fallstudie' : 'Speichern',
  }
}: CreateDetailsScreenProps) {
  const colors = useThemeColor();
  const router = useRouter();
  const { isDemoMode } = useMode();
  
  // Hole Parameter aus dem vorherigen Screen
  const params = useLocalSearchParams<{
    title?: string;
    description?: string;
    price?: string;
    imageUrl?: string;
    currency?: string;
  }>();
  
  // State für die Bearbeitung mit Initialwerten aus den Parametern
  const [title, setTitle] = useState(params.title || 'Dein Titel');
  const [cardTitle, setCardTitle] = useState(params.title || 'Dein Titel');
  const [description, setDescription] = useState(params.description || 'Beschreibung...');
  const [price, setPrice] = useState(params.price || '0');
  const [currency, setCurrency] = useState(params.currency || '€');
  const [imageUrl, setImageUrl] = useState(params.imageUrl || null);
  
  // Bearbeitungszustände
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  
  // State für Interaktionen (Placeholder-Daten)
  const [isHelpful, setIsHelpful] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  
  // Aktuelles Datum für DateBadge
  const today = new Date().toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Vollständiger Preis mit Währung
  const fullPrice = useMemo(() => {
    if (price && currency) {
      return `${currency}${price}`;
    }
    return `${currency}0`;
  }, [price, currency]);
  
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
        aspect: [16, 9],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Für das Demo verwenden wir die lokale URI direkt
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Fehler beim Auswählen des Bildes:', error);
      Alert.alert('Fehler', 'Das Bild konnte nicht ausgewählt werden.');
    }
  };
  
  // Handlers für Interaktionsbuttons (Platzhalter)
  const handleHelpfulPress = () => {
    setIsHelpful(!isHelpful);
    setHelpfulCount(prev => isHelpful ? prev - 1 : prev + 1);
  };
  
  const handleSharePress = () => {
    // Platzhalter
  };
  
  const handleSavePress = () => {
    setIsSaved(!isSaved);
  };
  
  // Handler für Erstellungs-Button
  const handleCreatePress = () => {
    // Hier später die tatsächliche Erstellung implementieren
    Alert.alert(
      type === 'gig' ? 'Gig erstellen' : 'Fallstudie erstellen',
      type === 'gig' ? 'Dein Gig wurde erfolgreich erstellt!' : 'Deine Fallstudie wurde erfolgreich erstellt!',
      [{ text: 'OK', onPress: () => router.push(redirectRoute) }]
    );
  };
  
  // Erstellen-Button für HeaderNavigation
  const renderErstellenButton = () => (
    <TouchableOpacity 
      onPress={handleCreatePress}
    >
      <Text 
        style={[
          styles.createButtonText, 
          { color: colors.primary }
        ]}
      >
        {submitButtonText}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header Navigation */}
      <HeaderNavigation 
        title={navigationTitle} 
        rightContent={renderErstellenButton()}
        onBackPress={() => router.back()}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Header Media (editierbar durch Klick) */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={pickImage}
          style={styles.headerMediaContainer}
        >
          <HeaderMedia 
            imageUrl={imageUrl}
            borderRadius={0}
          />
          
          {/* Overlay für Bildauswahl */}
          <View style={styles.imagePickerOverlay}>
            <View style={styles.imagePickerButton}>
              <Ionicons name="camera" size={28} color="#FFFFFF" />
              <Text style={styles.imagePickerText}>Foto ändern</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.content}>
          {/* Profilbereich mit Name und Bewertung */}
          <View style={styles.profileContainer}>
            <View style={styles.profileMainSection}>
              {/* Zeile für Name und Bewertung */}
              <View style={styles.profileNameRow}>
                {/* Profilbild und Name links */}
                <View style={styles.profileLeftSection}>
                  <ProfileImage
                    source={null}
                    fallbackText={DEMO_USER.name}
                    size={40}
                    variant="circle"
                    isRealMode={!isDemoMode()}
                    style={styles.profileImage}
                  />
                  
                  {/* Name des Anbieters */}
                  <Text style={[styles.userName, { color: colors.textPrimary }]}>
                    {DEMO_USER.name}
                  </Text>
                </View>
                
                {/* Bewertung rechts neben dem Namen */}
                <View style={styles.ratingContainer}>
                  <ReviewBadge
                    rating={DEMO_USER.rating}
                    ratingCount={DEMO_USER.ratingCount}
                  />
                </View>
              </View>
              
              {/* Zweite Zeile: Preisbadge rechts ausgerichtet, nur für Gigs anzeigen */}
              {type === 'gig' && (
                <View style={styles.priceBadgeRow}>
                  <View style={{flex: 1}} />
                  <View style={[styles.priceContainer, { 
                    backgroundColor: colors.backgroundSecondary, 
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.05)',
                  }]}>
                    <Text style={[styles.price, { color: colors.textPrimary }]}>
                      {fullPrice}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          
          {/* Interaktionsleiste in voller Breite */}
          <View style={styles.interactionContainer}>
            <NuggetCardInteraction
              helpfulCount={helpfulCount}
              commentCount={commentCount}
              isHelpful={isHelpful}
              isSaved={isSaved}
              onHelpfulPress={handleHelpfulPress}
              onSharePress={handleSharePress}
              onSavePress={handleSavePress}
              hideCommentButton={true}
            />
          </View>
          
          {/* Editierbarer Titel */}
          {isTitleEditing ? (
            <TextInput
              style={[styles.titleInput, { color: colors.textPrimary }]}
              value={title}
              onChangeText={setTitle}
              multiline
              autoFocus
              onBlur={() => {
                setIsTitleEditing(false);
                // Update auch den cardTitle
                setCardTitle(title);
              }}
            />
          ) : (
            <TouchableOpacity onPress={() => setIsTitleEditing(true)}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title || `Tippe hier, um einen ${type === 'gig' ? 'Gig-' : 'Fallstudien-'}Titel hinzuzufügen`}
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Editierbare Beschreibung */}
          {isDescriptionEditing ? (
            <TextInput
              style={[styles.descriptionInput, { color: colors.textSecondary }]}
              value={description}
              onChangeText={setDescription}
              multiline
              autoFocus
              onBlur={() => setIsDescriptionEditing(false)}
            />
          ) : (
            <TouchableOpacity onPress={() => setIsDescriptionEditing(true)}>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {description || "Tippe hier, um eine Beschreibung hinzuzufügen"}
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Hinweis zur Mindestlänge */}
          <Text style={[styles.characterCountHint, { 
            color: description.length >= 500 ? colors.success : colors.textSecondary 
          }]}>
            {description.length}/500 Zeichen (Minimum)
          </Text>
          
          {/* Trennlinie und Veröffentlichungsdatum */}
          <View style={[styles.footerDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.footerContainer}>
            <DateBadge
              date={today}
              prefix="Veröffentlicht am"
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Footer mit drei Buttons */}
      <View style={[styles.footer, { borderTopColor: colors.divider, backgroundColor: colors.backgroundPrimary }]}>
        {/* Gig bewerten */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel={actionButtonLabels.leftButton}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 180, 0, 0.15)' }]}>
            <Ionicons name="star-outline" size={22} color="#FFB400" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>
            {actionButtonLabels.leftButton}
          </Text>
        </TouchableOpacity>
        
        {/* Anfrage senden */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel={actionButtonLabels.middleButton}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(10, 132, 255, 0.15)' }]}>
            <Ionicons name="chatbubble-outline" size={22} color="#0A84FF" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>
            {actionButtonLabels.middleButton}
          </Text>
        </TouchableOpacity>
        
        {/* Dritter Button - variabel je nach Typ */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel={actionButtonLabels.rightButton}
        >
          <View style={[styles.iconContainer, { 
            backgroundColor: type === 'gig' 
              ? 'rgba(94, 92, 230, 0.15)' 
              : 'rgba(52, 199, 89, 0.15)' 
          }]}>
            <Ionicons 
              name={type === 'gig' ? "document-text-outline" : "bookmark-outline"} 
              size={22} 
              color={type === 'gig' ? "#5E5CE6" : "#34C759"} 
            />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>
            {actionButtonLabels.rightButton}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerMediaContainer: {
    position: 'relative',
  },
  imagePickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFFFFF',
    marginTop: 4,
    fontSize: typography.fontSize.s,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: spacing.m,
    paddingTop: 12, // Reduzierter Abstand für mehr Nähe zum Header
  },
  profileContainer: {
    marginBottom: spacing.m,
    marginTop: spacing.s,
  },
  profileMainSection: {
    width: '100%',
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  priceBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.s,
  },
  profileLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    borderWidth: 0,
  },
  userName: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.s,
  },
  priceContainer: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: ui.borderRadius.m,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
  },
  price: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.s,
  },
  titleInput: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.s,
    padding: 0,
  },
  interactionContainer: {
    marginHorizontal: -spacing.m, // Negatives Margin um über die Elternränder hinauszugehen
    marginBottom: spacing.m,
  },
  description: {
    fontSize: typography.fontSize.m,
    lineHeight: typography.lineHeight.l,
    marginBottom: spacing.l,
  },
  descriptionInput: {
    fontSize: typography.fontSize.m,
    lineHeight: typography.lineHeight.l,
    marginBottom: spacing.l,
    padding: 0,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.s,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: spacing.xs,
  },
  actionIconButton: {
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    flex: 1,
  },
  actionButtonLabel: {
    fontSize: typography.fontSize.s,
    fontWeight: '500',
  },
  footerDivider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    marginBottom: spacing.m,
  },
  footerContainer: {
    marginBottom: spacing.xl,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterCountHint: {
    fontSize: typography.fontSize.s,
    marginTop: spacing.xs,
  },
}); 