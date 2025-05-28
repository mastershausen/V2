import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native';

import { updateProfileImageCacheGlobally } from '@/app/api/cache-update';
import { isDemoMode } from '@/config/app/env';
import { spacing } from '@/config/theme/spacing';
import Routes from '@/constants/routes';
import { useAppNavigation } from '@/hooks/navigation/useAppNavigation';
import { usePhotoSelection } from '@/hooks/usePhotoSelection';
import { useThemeColor } from '@/hooks/useThemeColor';
import MediaService from '@/services/MediaService';
import { PermissionService } from '@/services/permissions';
import { ProfileImage } from '@/shared-components/media';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { ThemedText } from '@/shared-components/theme/ThemedText';
import { useUserStore } from '@/stores/userStore';
import { UserProfile } from '@/types/userTypes';
import { logger } from '@/utils/logger';
import { ProfileImageData } from '@/utils/profileImageUtils';
import { isImageUrl } from '@/utils/stringUtils';
import { useThemedStyles } from '@/utils/styleHelpers/createThemedStyles';

import { EditProfileForms } from '../components/EditProfileForms';
import { HeaderMediaSelector } from '../components/HeaderMediaSelector';
import { ProfileImagePicker } from '../components/ProfileImagePicker';
import { SaveButton } from '../components/SaveButton';
import { useProfileForm } from '../hooks/useProfileForm';
import { useSaveProfile } from '../hooks/useSaveProfile';


// Style-Creator-Funktion außerhalb der Komponente
const createStyles = (colors: typeof import('@/config/theme').themeColors.light) => ({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xxl,
  },
  profileImageContainer: {
    alignItems: 'center' as const,
    marginBottom: spacing.m,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: colors.pastel?.primaryBorder || 'rgba(0, 122, 255, 0.3)',
  },
  editIconContainer: {
    position: 'absolute' as const,
    bottom: spacing.s,
    right: '35%' as any,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.xs,
    width: 28,
    height: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

/**
 * Screen zum Bearbeiten des Benutzerprofils
 */
export default function EditProfileScreen() {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const { navigation, goBack } = useAppNavigation();
  const router = useRouter();
  
  // Verwende die StyleSheet-Factory mit den aktuellen Theme-Farben
  const styles = useThemedStyles(createStyles, colors);
  
  const { user, updateProfile } = useUserStore();
  const permissionService = new PermissionService();
  const mediaService = new MediaService();
  const { openImageLibrary, isLoading, setIsLoading, error, setError } = usePhotoSelection();

  // Formularverwaltung und -validierung
  const {
    formData,
    formErrors,
    hasChanges,
    updateFormData,
    validateForm,
    createUpdatePayload,
    handleSaveSuccess,
  } = useProfileForm(user);

  // Speicherfunktionalität
  const { saveProfile } = useSaveProfile({
    hasChanges,
    validateForm,
    createUpdatePayload,
    handleSaveSuccess,
  });

  // Vereinfachte Initialisierung beim Laden des Screens
  useEffect(() => {
    if (user?.id) {
      console.log(`[EditProfileScreen] Initialisiere Screen für Benutzer ${user.id} im ${isDemoMode() ? 'demo' : 'real'}-Modus`);
    }
    
    // Cleanup-Funktion
    return () => {
      if (user?.id) {
        console.log(`[EditProfileScreen] Screen wird verlassen für ${user.id}`);
      }
    };
  }, [user?.id]);

  // Zu Media-Edit-Screen navigieren
  const navigateToMediaEdit = () => {
    // Hier könnte die Navigation zum Media-Edit-Screen erfolgen
    // Im echten Projekt würde hier stehen: navigation.navigateTo(Routes.EDIT_PROFILE_MEDIA)
    Alert.alert(
      "Medien bearbeiten",
      "Hier würde der Screen zum Bearbeiten des Profilbilds und Header-Bilds geöffnet werden.",
      [{ text: "OK", style: "default" }]
    );
  };
  
  // Handler für Profilbild-Auswahl (vereinfacht)
  const handleProfileImageSelected = (imageUri: string) => {
    console.log(`[EditProfileScreen] Neues Profilbild ausgewählt:`, imageUri.substring(0, 30) + '...');
    
    // Timeout hinzufügen, um sicherzustellen, dass die UI-Updates nicht kollidieren
    setTimeout(() => {
      // Aktualisiere das Formular mit dem URI als String
      updateFormData({ profileImage: imageUri });
      
      // Wenn ein Benutzer existiert, aktualisiere sofort den globalen Cache
      if (user?.id) {
        console.log(`[EditProfileScreen] Aktualisiere globales Profilbild für ${user.id}`);
        updateProfileImageCacheGlobally(user.id, imageUri, isDemoMode() ? 'demo' : 'real');
      }
    }, 50);
  };

  const handleImageSelect = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log('[EditProfileScreen] Starte Bildauswahl-Prozess');
    
    try {
      // 1. Versuche die Berechtigung für die Medienbibliothek zu erhalten
      console.log('[EditProfileScreen] Prüfe Medienbibliothek-Berechtigung');
      const hasPermission = await permissionService.requestMediaLibraryPermission();
      
      // Berechtigungsstatus loggen, aber trotzdem fortfahren
      if (!hasPermission) {
        console.warn('[EditProfileScreen] Eingeschränkte oder keine Medienbibliothek-Berechtigung');
        // Achtung: Wir versuchen trotzdem den Image Picker zu öffnen, da einige iOS-Versionen
        // auch mit eingeschränkten Berechtigungen funktionieren
      } else {
        console.log('[EditProfileScreen] Medienbibliothek-Berechtigung erhalten');
      }
      
      // 2. Öffne die Bildauswahl unabhängig vom Berechtigungsstatus
      console.log('[EditProfileScreen] Öffne Bildauswahl');
      const result = await openImageLibrary();
      
      console.log('[EditProfileScreen] Bildauswahl-Ergebnis:', 
        result.canceled ? 'Abgebrochen' : `Bild ausgewählt: ${result.assets?.[0]?.uri?.substring(0, 30)}...`);
      
      // Wenn der Benutzer den Dialog abgebrochen hat oder keine Assets vorhanden sind
      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('[EditProfileScreen] Bildauswahl abgebrochen oder keine Assets');
        setIsLoading(false);
        return;
      }
      
      // 3. Verarbeite das ausgewählte Bild
      const { uri, fileName, type } = result.assets[0];
      
      if (!uri) {
        console.error('[EditProfileScreen] Keine URI im ausgewählten Bild gefunden');
        setError(t('profileEdit.assetError'));
        setIsLoading(false);
        return;
      }
      
      console.log(`[EditProfileScreen] Lade Bild hoch: ${uri.substring(0, 30)}...`);
      
      // Verwende MediaService mit aktiviertem DevMode für Entwicklungszwecke
      // Dies stellt sicher, dass der Upload auch ohne Backend funktioniert
      try {
        // 4. Bild auf den Server hochladen mit spezieller Fehlerbehandlung
        console.log(`[EditProfileScreen] Starte Bildupload mit Typ: ${type || 'image/jpeg'}`);
        
        // Bereite das MediaAsset-Objekt vor
        const mediaAsset = {
          uri,
          type: type || 'image/jpeg'
        };
        
        // Nutzerdaten aus dem user-Objekt extrahieren oder Fallback verwenden
        const userId = user?.id || 'temp-user-id';
        
        // Rufe uploadProfileImage auf, welches ein String zurückgibt
        const imageUrl = await mediaService.uploadProfileImage(
          mediaAsset,
          userId,
          isDemoMode() ? 'demo' : 'live'
        );
        
        console.log(`[EditProfileScreen] Upload-Ergebnis erhalten:`, imageUrl ? 'Erfolgreich' : 'Fehlgeschlagen');
        
        if (imageUrl) {
          console.log(`[EditProfileScreen] Upload erfolgreich: ${imageUrl.substring(0, 30)}...`);
          
          // 5. Lokalen Formzustand aktualisieren
          updateFormData({
            profileImage: imageUrl
          });
          
          // 6. Cache-Update (vereinfacht)
          if (user?.id) {
            console.log(`[EditProfileScreen] Aktualisiere Profilbild für ${user.id} im ${isDemoMode() ? 'demo' : 'real'}-Modus`);
            updateProfileImageCacheGlobally(user.id, imageUrl, isDemoMode() ? 'demo' : 'real');
          }
        } else {
          console.error('[EditProfileScreen] Fehler beim Upload: Keine Image-URL erhalten');
          setError(t('profileEdit.uploadFailed'));
        }
      } catch (uploadError) {
        // Separate Fehlerbehandlung für den Upload-Prozess
        console.error('[EditProfileScreen] Exception beim Bildupload:', 
          uploadError instanceof Error ? uploadError.message : String(uploadError));
        setError(t('profileEdit.uploadFailed'));
      }
    } catch (error) {
      // Typensicheres Error-Logging für den gesamten Prozess
      if (error instanceof Error) {
        console.error('[EditProfileScreen] Fehler beim Bildauswahl-Prozess:', error.message);
        logger.error('Fehler beim Bildupload', error.message);
      } else {
        console.error('[EditProfileScreen] Unbekannter Fehler beim Bildauswahl-Prozess');
        logger.error('Fehler beim Bildupload', String(error));
      }
      
      setError(t('profileEdit.uploadFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Profilupdates an den Server senden und State aktualisieren
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Daten an API senden/speichern
      const updateData: {
        name: string;
        email: string;
        profileImage?: string | ProfileImageData;
      } = {
        name: formData.name?.trim() || '',
        email: formData.email?.trim() || '',
        // Weitere Eigenschaften hier...
      };
      
      // ProfileImage-Handling - kann nun String oder ProfileImageData sein
      if (formData.profileImage) {
        updateData.profileImage = formData.profileImage;
      }
      
      // User-Store aktualisieren
      if (user?.id) {
        // Typecasting für updateProfile, da es als 'unknown' markiert wird
        await (updateProfile as (data: any) => Promise<void>)(updateData);
      }
      
      // Profilbild-Cache mit dem neuen Wert aktualisieren
      if (user?.id && updateData.profileImage) {
        console.log(`[EditProfileScreen] Aktualisiere Profilbild nach Speichern für ${user.id}`);
        
        // Extrahiere die URL basierend auf dem Typ des profileImage
        const imageUrl = typeof updateData.profileImage === 'string' 
          ? updateData.profileImage 
          : updateData.profileImage.imageUrl;
        
        if (imageUrl && isImageUrl(imageUrl)) {
          // Aktualisiere das globale Profilbild
          updateProfileImageCacheGlobally(user.id, imageUrl, isDemoMode() ? 'demo' : 'real');
        }
      }
      
      // Zurück zu Profil navigieren
      navigation.goBack();
    } catch (error) {
      logger.error('Fehler beim Speichern des Profils', String(error));
      setError(t('profileEdit.submitFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header mit Zurück-Button und Speichern-Link */}
      <HeaderNavigation 
        title={`${formData.firstName || ''} ${formData.lastName || ''} | ${t('profile.editProfile')}`.trim()}
        rightContent={<SaveButton onPress={saveProfile} hasChanges={hasChanges} />}
        onBackPress={() => router.push(Routes.MAIN.SETTINGS)}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profilbild-Bereich mit ProfileImage-Komponente */}
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleImageSelect}
            accessibilityLabel={t('profileEdit.changeProfilePicture')}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <ProfileImage
              source={typeof formData.profileImage === 'string' 
                ? { uri: formData.profileImage } 
                : formData.profileImage}
              fallbackText={formData.name}
              size={120}
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <FontAwesome name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>

          {/* Header-Bild-Bereich */}
          <HeaderMediaSelector onPress={navigateToMediaEdit} />
          
          {/* Formularinhalt */}
          <EditProfileForms 
            formData={formData}
            onUpdateFormData={updateFormData}
            formErrors={formErrors}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 