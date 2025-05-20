import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { ReviewBadge, DateBadge } from '@/shared-components/badges';
import { ProfileImage } from '@/shared-components/media/ProfileImage';
import { useMode } from '@/features/mode/hooks/useMode';
import { HeaderMedia } from '@/shared-components/media/HeaderMedia';
import { NuggetCardInteraction } from '@/shared-components/cards/nugget-card/components/NuggetCardInteraction';

// Demo-Daten für den Benutzer
const DEMO_USER = {
  name: 'Alexander Becker',
  profileImage: null, // Wir nutzen Initialen
  rating: 5.0,
  ratingCount: 42
};

/**
 * Eigenständiger Screen für das Erstellen einer Fallstudie im WYSIWYG-Format
 */
export default function CreateCasestudyDetailsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { isDemoMode } = useMode();
  
  // Hole Parameter aus dem vorherigen Screen (nur für imageUrl)
  const params = useLocalSearchParams<{
    imageUrl?: string;
  }>();
  
  // State für die Bearbeitung mit festen Platzhaltern
  const [title, setTitle] = useState('Titel der Fallstudie');
  const [description, setDescription] = useState('Beschreibung der Fallstudie...');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
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
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Fehler beim Auswählen des Bildes:', error);
      Alert.alert('Fehler', 'Das Bild konnte nicht ausgewählt werden.');
    }
  };
  
  // Handlers für Interaktionsbuttons
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
  
  // Handler für Erstellen-Button (war vorher Weiter-Button)
  const handleErstellenPress = () => {
    // Fallstudie erstellen und zur Home-Seite navigieren
    Alert.alert(
      'Fallstudie erstellen',
      'Deine Fallstudie wurde erfolgreich erstellt!',
      [{ text: 'OK', onPress: () => router.push('/(tabs)/home') }]
    );
  };
  
  // Weiter-Button für HeaderNavigation
  const renderWeiterButton = () => (
    <TouchableOpacity onPress={handleErstellenPress}>
      <Text 
        style={[
          styles.erstellenButtonText, 
          { color: colors.primary }
        ]}
      >
        Weiter
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
      <HeaderNavigation 
        title="Fallstudie erstellen" 
        rightContent={renderWeiterButton()}
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
              <View style={styles.profileNameRow}>
                <View style={styles.profileLeftSection}>
                  <ProfileImage
                    source={null}
                    fallbackText={DEMO_USER.name}
                    size={40}
                    variant="circle"
                    isRealMode={!isDemoMode()}
                    style={styles.profileImage}
                  />
                  
                  <Text style={[styles.userName, { color: colors.textPrimary }]}>
                    {DEMO_USER.name}
                  </Text>
                </View>
                
                <View style={styles.ratingContainer}>
                  <ReviewBadge
                    rating={DEMO_USER.rating}
                    ratingCount={DEMO_USER.ratingCount}
                  />
                </View>
              </View>
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
              onBlur={() => setIsTitleEditing(false)}
            />
          ) : (
            <TouchableOpacity onPress={() => setIsTitleEditing(true)}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title || "Tippe hier, um einen Titel hinzuzufügen"}
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
        {/* Fallstudie bewerten */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel="Fallstudie bewerten"
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 180, 0, 0.15)' }]}>
            <Ionicons name="star-outline" size={22} color="#FFB400" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Bewerten</Text>
        </TouchableOpacity>
        
        {/* Anfrage senden */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel="Anfrage senden"
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(10, 132, 255, 0.15)' }]}>
            <Ionicons name="chatbubble-outline" size={22} color="#0A84FF" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Anfragen</Text>
        </TouchableOpacity>
        
        {/* Gig */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel="Gig anzeigen"
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(94, 92, 230, 0.15)' }]}>
            <Ionicons name="briefcase-outline" size={22} color="#5E5CE6" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Gig</Text>
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
  erstellenButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  interactionContainer: {
    marginHorizontal: -spacing.m, // Negatives Margin um über die Elternränder hinauszugehen
    marginBottom: spacing.m,
  },
  footerDivider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    marginBottom: spacing.m,
  },
  footerContainer: {
    marginBottom: spacing.xl,
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
});
