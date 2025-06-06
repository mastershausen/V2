import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  View,
  Text,
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { GradientButton } from '@/shared-components/button/GradientButton';

/**
 * Change Password Settings Screen
 */
export default function ChangePasswordScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), t('settings.changePassword.errors.fillAllFields'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('settings.changePassword.errors.passwordMismatch'));
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(t('common.error'), t('settings.changePassword.errors.passwordTooShort'));
      return;
    }

    // Here you would typically call an API to update the password
    Alert.alert(
      t('common.success'), 
      t('settings.changePassword.success'),
      [{ text: t('common.ok'), onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('settings.changePassword.title')}
        showBackButton={true}
        onBackPress={() => router.back()}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerContainer}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              {t('settings.changePassword.currentPassword')}
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.divider,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary
              }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder={t('settings.changePassword.currentPasswordPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoComplete="current-password"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              {t('settings.changePassword.newPassword')}
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.divider,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary
              }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('settings.changePassword.newPasswordPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              {t('settings.changePassword.confirmPassword')}
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.divider,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary
              }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('settings.changePassword.confirmPasswordPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={[styles.requirementsTitle, { color: colors.textPrimary }]}>
              {t('settings.changePassword.requirements')}
            </Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              {t('settings.changePassword.requirementLength')}
            </Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              {t('settings.changePassword.requirementCase')}
            </Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              {t('settings.changePassword.requirementNumber')}
            </Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              {t('settings.changePassword.requirementSpecial')}
            </Text>
          </View>

          <GradientButton
            label={t('settings.changePassword.updatePassword')}
            onPress={handleSaveChanges}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 56,
    paddingTop: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.m,
  },
  formContainer: {
    marginTop: spacing.l,
  },
  fieldContainer: {
    marginBottom: spacing.l,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.s,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    fontSize: 16,
  },
  requirementsContainer: {
    marginTop: spacing.l,
    marginBottom: spacing.xl,
    padding: spacing.m,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 107, 85, 0.1)',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.s,
  },
  requirementText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.l,
  },
}); 