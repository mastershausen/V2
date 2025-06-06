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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    // Here you would typically call an API to update the password
    Alert.alert(
      'Success', 
      'Your password has been updated successfully',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Change Password"
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
              Current Password
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.divider,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary
              }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter your current password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoComplete="current-password"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              New Password
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.divider,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary
              }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Confirm New Password
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.divider,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary
              }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={[styles.requirementsTitle, { color: colors.textPrimary }]}>
              Password Requirements:
            </Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              • At least 8 characters long
            </Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              • Include uppercase and lowercase letters
            </Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              • Include at least one number
            </Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              • Include at least one special character
            </Text>
          </View>

          <GradientButton
            label="Update Password"
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