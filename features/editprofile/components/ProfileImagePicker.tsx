import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Alert,
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImageData } from '@/utils/profileImageUtils';

// Konstanten für Styled-Elemente
const OVERLAY_BG = 'rgba(0,0,0,0.5)'; // Dark overlay für Hover-Effekte

interface ProfileImagePickerProps {
  profileImage: ProfileImageData | string | null;
  firstName: string;
  lastName: string;
  onImageSelected: (imageUri: string) => void;
}

/**
 * Komponente zum Auswählen und Anzeigen des Profilbilds
 */
export function ProfileImagePicker({
  profileImage,
  firstName,
  lastName,
  onImageSelected,
}: ProfileImagePickerProps) {
  const colors = useThemeColor();
  const { t } = useTranslation();

  // Extrahiere die tatsächliche Bild-URL aus dem profileImage
  const imageUrl = typeof profileImage === 'string' 
    ? profileImage 
    : profileImage?.imageUrl || null;

  const handleSelectProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking profile image:', error);
      Alert.alert(t('errors.mediaPickerError'));
    }
  };

  return (
    <View style={styles.profileImageContainer}>
      <Pressable 
        style={({ pressed }) => [
          styles.profileImageWrapper,
          { borderColor: pressed ? colors.primary : colors.dividerLight }
        ]}
        onPress={handleSelectProfileImage}
        accessible={true}
        accessibilityLabel={t('profile.changeProfilePicture')}
        accessibilityRole="button"
      >
        {({ pressed }) => (
          <>
            {imageUrl ? (
              <View style={styles.profileImageContent}>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.profileImage} 
                />
                {pressed && (
                  <View style={styles.editOverlay}>
                    <Ionicons name="camera" size={28} color="white" />
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.profileImagePlaceholderText}>
                  {firstName && lastName 
                    ? `${firstName.charAt(0)}${lastName.charAt(0)}` 
                    : 'A'}
                </Text>
                {pressed && (
                  <View style={styles.editOverlay}>
                    <Ionicons name="camera" size={28} color="white" />
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </Pressable>
      <Text style={[styles.profileImageHint, { color: colors.textSecondary }]}>
        Tippen zum Ändern
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.m,
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    ...ui.shadow.profile,
  },
  profileImageContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: OVERLAY_BG,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    color: 'white',
  },
  profileImageHint: {
    marginTop: spacing.s,
    fontSize: typography.fontSize.s,
  },
}); 