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
 * Change Email Settings Screen
 */
export default function ChangeEmailScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const [currentEmail, setCurrentEmail] = useState('max.weber@example.com');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSaveChanges = () => {
    if (!newEmail || !confirmEmail || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newEmail !== confirmEmail) {
      Alert.alert('Error', 'Email addresses do not match');
      return;
    }

    // Here you would typically call an API to update the email
    Alert.alert(
      'Success', 
      'Your email address has been updated successfully',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Change Email"
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
              Current Email
            </Text>
            <Text style={[styles.currentEmail, { color: colors.textSecondary }]}>
              {currentEmail}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              New Email Address
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.divider,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary
              }]}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Enter new email address"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Confirm Email Address
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.divider,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary
              }]}
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              placeholder="Confirm new email address"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

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
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your current password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoComplete="current-password"
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              You will receive a verification email at your new address to confirm the change.
            </Text>
          </View>

          <GradientButton
            label="Save Changes"
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
  currentEmail: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    fontSize: 16,
  },
  infoContainer: {
    marginTop: spacing.l,
    marginBottom: spacing.xl,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: spacing.l,
  },
}); 