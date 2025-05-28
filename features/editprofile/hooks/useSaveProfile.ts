import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, ToastAndroid } from 'react-native';

import { updateProfileImageCacheGlobally } from '@/app/api/cache-update';
import Routes, { useAppNavigation } from '@/constants/routes';
import { UserProfile } from '@/stores/types/userTypes';
import { useUserStore } from '@/stores/userStore';
import { ProfileImageData } from '@/utils/profileImageUtils';

interface UseSaveProfileProps {
  hasChanges: boolean;
  createUpdatePayload: () => Partial<UserProfile>;
  validateForm: () => { isValid: boolean; errors: string[] };
  handleSaveSuccess: () => void;
}

/**
 * Hook für die Speicherfunktionalität des Profilformulars
 */
export function useSaveProfile({
  hasChanges,
  createUpdatePayload,
  validateForm,
  handleSaveSuccess,
}: UseSaveProfileProps) {
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const { updateProfile, user } = useUserStore();

  const saveProfile = useCallback(async () => {
    try {
      if (!hasChanges) {
        console.log("[useSaveProfile] Keine Änderungen zum Speichern");
        return; // Nichts zu speichern
      }
      
      // Formular validieren
      const { isValid, errors } = validateForm();
      if (!isValid) {
        // Zusammenfassung als Alert anzeigen
        Alert.alert('Fehler', errors.join('\n'));
        return false;
      }
      
      // Benutzerprofil aktualisieren
      const updatePayload = createUpdatePayload();
      console.log("[useSaveProfile] Speichere Profil", updatePayload);
      
      // Speichere Profilbild-URL für späteres Cache-Update
      const profileImageData = updatePayload.profileImage;
      const userId = user?.id;
      
      // Update-Prozess
      const success = await updateProfile(updatePayload);

      if (success) {
        // Lokalen Zustand aktualisieren
        handleSaveSuccess();
        
        // Globales Profilbild-Cache-Update erzwingen
        if (userId && profileImageData) {
          // Extrahiere die URL je nach Typ des profileImage
          const imageUrl = typeof profileImageData === 'string' 
            ? profileImageData 
            : (profileImageData as ProfileImageData).imageUrl;
            
          if (imageUrl) {
            updateProfileImageCacheGlobally(userId, imageUrl, 'real');
          }
        }
        
        // Erfolgsmeldung
        if (Platform.OS === 'android') {
          ToastAndroid.show('Änderungen erfolgreich gespeichert', ToastAndroid.SHORT);
        } else {
          Alert.alert(
            "Profil aktualisiert",
            "Ihre Änderungen wurden erfolgreich gespeichert.",
            [{ 
              text: "OK",
              onPress: () => {
                // Nach dem Schließen des Alerts navigieren, um sicherzustellen,
                // dass der Root-Navigator vollständig gemountet ist
                setTimeout(() => {
                  navigation.navigateTo(Routes.MAIN.SETTINGS);
                }, 300);
              }
            }]
          );
        }
        
        return true;
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(
        t('errors.updateFailed'),
        t('errors.tryAgainLater')
      );
      return false;
    }
  }, [hasChanges, validateForm, createUpdatePayload, updateProfile, handleSaveSuccess, navigation, t, user]);

  return { saveProfile };
} 