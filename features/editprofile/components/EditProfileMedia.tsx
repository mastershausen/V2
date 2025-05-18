import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage } from '@/shared-components/media';
import { ProfileImageData } from '@/utils/profileImageUtils';

import { EditProfileFormData } from '../types/EditProfileTypes';


interface EditProfileMediaProps {
  formData: EditProfileFormData;
  onUpdateFormData: (data: Partial<EditProfileFormData>) => void;
  onSelectProfileImage: () => void;
  onSelectCoverImage: () => void;
}

/**
 * Komponente für den Medien-Bereich der Profilbearbeitung
 * @param root0
 * @param root0.formData
 * @param root0.onUpdateFormData
 * @param root0.onSelectProfileImage
 * @param root0.onSelectCoverImage
 */
export function EditProfileMedia({
  formData,
  onUpdateFormData,
  onSelectProfileImage,
  onSelectCoverImage,
}: EditProfileMediaProps) {
  const colors = useThemeColor();
  const { t } = useTranslation();

  return (
    <View style={styles.mediaContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {t('profile.media')}
      </Text>

      {/* Profilbild-Bereich */}
      <View style={styles.mediaSection}>
        <Text style={[styles.mediaLabel, { color: colors.textSecondary }]}>
          {t('profile.profilePicture')}
        </Text>
        
        <View style={styles.mediaPreviewContainer}>
          <TouchableOpacity 
            style={[
              styles.profileImageContainer, 
              { 
                backgroundColor: colors.backgroundTertiary,
                borderColor: colors.divider 
              }
            ]}
            onPress={onSelectProfileImage}
          >
            <ProfileImage 
              source={typeof formData.profileImage === 'string' 
                ? { uri: formData.profileImage } 
                : formData.profileImage}
              fallbackText={formData.name}
              style={styles.profileImage}
            />
            
            <View style={[
              styles.editIconContainer, 
              { backgroundColor: colors.backgroundPrimary }
            ]}>
              <Ionicons 
                name="pencil" 
                size={16} 
                color={colors.textSecondary} 
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.mediaInfo}>
            <Text style={[styles.mediaInfoText, { color: colors.textSecondary }]}>
              {t('profile.profilePictureInfo')}
            </Text>
            <Text style={[styles.mediaInfoSecondary, { color: colors.textTertiary }]}>
              {t('profile.imageRecommendation')}
            </Text>
          </View>
        </View>
      </View>

      {/* Titelbild-Bereich */}
      <View style={styles.mediaSection}>
        <Text style={[styles.mediaLabel, { color: colors.textSecondary }]}>
          {t('profile.coverImage')}
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.coverImageContainer, 
            { 
              backgroundColor: colors.backgroundTertiary,
              borderColor: colors.divider 
            }
          ]}
          onPress={onSelectCoverImage}
        >
          {formData.headerImage ? (
            <ProfileImage 
              source={{ uri: formData.headerImage as string }}
              style={styles.coverImage}
              variant="rounded"
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons 
                name="image-outline" 
                size={40} 
                color={colors.textTertiary} 
              />
              <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
                {t('profile.addCoverImage')}
              </Text>
            </View>
          )}
          
          <View style={[
            styles.editIconContainer, 
            styles.coverEditIcon,
            { backgroundColor: colors.backgroundPrimary }
          ]}>
            <Ionicons 
              name="pencil" 
              size={16} 
              color={colors.textSecondary} 
            />
          </View>
        </TouchableOpacity>
        
        <Text style={[styles.mediaInfoSecondary, { color: colors.textTertiary, marginTop: spacing.s }]}>
          {t('profile.coverImageInfo')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    paddingHorizontal: spacing.m,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.m,
  },
  mediaSection: {
    marginBottom: spacing.l,
  },
  mediaLabel: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.s,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  mediaInfo: {
    flex: 1,
    marginLeft: spacing.m,
  },
  mediaInfoText: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.xs,
  },
  mediaInfoSecondary: {
    fontSize: typography.fontSize.xs,
  },
  coverImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.s,
  },
  coverEditIcon: {
    bottom: spacing.xs,
    right: spacing.xs,
  },
}); 