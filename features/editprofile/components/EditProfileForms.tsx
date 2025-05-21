import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';


import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FormField } from '@/shared-components/form/FormField';

import { EditProfileFormData } from '../types/EditProfileTypes';



interface EditProfileFormsProps {
  formData: EditProfileFormData;
  onUpdateFormData: (data: Partial<EditProfileFormData>) => void;
  formErrors?: Record<string, string>;
}

/**
 * Komponente für den Formular-Bereich der Profilbearbeitung
 * @param root0
 * @param root0.formData
 * @param root0.onUpdateFormData
 * @param root0.formErrors
 */
export function EditProfileForms({
  formData,
  onUpdateFormData,
  formErrors = {},
}: EditProfileFormsProps) {
  const colors = useThemeColor();
  const { t } = useTranslation();

  return (
    <View style={styles.formContainer}>
      {/* Name (ohne Überschrift) */}
      <View style={styles.nameSection}>
        <View style={styles.formRow}>
          <FormField
            label={t('profile.firstName')}
            value={formData.firstName}
            onChangeText={(text) => onUpdateFormData({
              firstName: text,
              name: text + ' ' + (formData.lastName || '')
            })}
            placeholder={t('profile.firstNamePlaceholder')}
            containerStyle={styles.inputHalf}
            error={formErrors.firstName}
          />
          
          <FormField
            label={t('profile.lastName')}
            value={formData.lastName}
            onChangeText={(text) => onUpdateFormData({
              lastName: text,
              name: (formData.firstName || '') + ' ' + text
            })}
            placeholder={t('profile.lastNamePlaceholder')}
            containerStyle={styles.inputHalf}
            error={formErrors.lastName}
          />
        </View>
      </View>
      
      {/* Profil-Informationen */}
      <View style={styles.formSection}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('profile.profileInfo')}
        </Text>
        
        <FormField
          label={t('profile.headline')}
          infoText={t('profileEdit.headlineInfoText', { firstName: formData.firstName, lastName: formData.lastName })}
          value={formData.headline}
          onChangeText={(text) => onUpdateFormData({ headline: text })}
          placeholder={t('profile.headlinePlaceholder')}
          error={formErrors.headline}
        />
        
        <FormField
          label={t('profile.description')}
          value={formData.description}
          onChangeText={(text) => onUpdateFormData({ description: text })}
          placeholder={t('profile.descriptionPlaceholder')}
          multiline
          numberOfLines={4}
          error={formErrors.description}
        />
        
        <FormField
          label={t('profile.website')}
          value={formData.website}
          onChangeText={(text) => onUpdateFormData({ website: text })}
          placeholder={t('profile.websitePlaceholder')}
          keyboardType="url"
          autoCapitalize="none"
          error={formErrors.website}
        />
      </View>
      
      {/* Kontaktinfo */}
      <View style={styles.formSection}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('profile.contactInfo')}
        </Text>
        
        <FormField
          label={t('profile.company')}
          value={formData.company}
          onChangeText={(text) => onUpdateFormData({ company: text })}
          placeholder={t('profile.companyPlaceholder')}
          error={formErrors.company}
        />
        
        <FormField
          label={t('profile.location')}
          value={formData.location}
          onChangeText={(text) => onUpdateFormData({ location: text })}
          placeholder={t('profile.locationPlaceholder')}
          error={formErrors.location}
        />
        
        <FormField
          label={t('profile.industry')}
          value={formData.industry}
          onChangeText={(text) => onUpdateFormData({ industry: text })}
          placeholder={t('profile.industryPlaceholder')}
          error={formErrors.industry}
        />
        
        <FormField
          label={t('profile.email')}
          value={formData.email}
          onChangeText={(text) => onUpdateFormData({ email: text })}
          placeholder={t('profile.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={formErrors.email}
        />
        
        <FormField
          label={t('profile.phone')}
          value={formData.phone}
          onChangeText={(text) => onUpdateFormData({ phone: text })}
          placeholder={t('profile.phonePlaceholder')}
          keyboardType="phone-pad"
          error={formErrors.phone}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: spacing.m,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.m,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  nameSection: {
    marginBottom: spacing.xl,
    marginTop: spacing.m,
  },
}); 