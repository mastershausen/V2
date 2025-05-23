import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Profil-Einstellungen Screen
 * Bearbeitung von Profilbild, Name und Unternehmensbezeichnung
 */
export default function ProfileScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // State für Profilfelder
  const [name, setName] = useState('Max Mustermann');
  const [company, setCompany] = useState('Musterfirma GmbH');
  const [hasProfileImage, setHasProfileImage] = useState(false);
  
  // Handler für Profilbild-Auswahl
  const handleSelectProfileImage = () => {
    Alert.alert(
      'Profilbild auswählen',
      'Wählen Sie eine Option:',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Kamera', onPress: () => console.log('Kamera öffnen') },
        { text: 'Galerie', onPress: () => console.log('Galerie öffnen') },
        ...(hasProfileImage ? [{ text: 'Entfernen', style: 'destructive' as const, onPress: () => setHasProfileImage(false) }] : [])
      ]
    );
  };
  
  // Handler für Speichern
  const handleSave = () => {
    // Hier würde die Speicherung der Profildaten erfolgen
    Alert.alert(
      'Profil gespeichert',
      'Ihre Änderungen wurden erfolgreich gespeichert.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Mein Profil"
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
        {/* Profilbild */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            style={[styles.profileImageButton, { borderColor: colors.divider }]}
            onPress={handleSelectProfileImage}
            activeOpacity={0.7}
          >
            {hasProfileImage ? (
              <Image
                source={{ uri: 'https://via.placeholder.com/120' }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name="person-outline" size={40} color={colors.textSecondary} />
              </View>
            )}
            <View style={[styles.editIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera-outline" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileImageHint, { color: colors.textSecondary }]}>
            Tippen Sie, um ein Profilbild hinzuzufügen (optional)
          </Text>
        </View>
        
        {/* Eingabefelder */}
        <View style={styles.formContainer}>
          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Name *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                }
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Ihr vollständiger Name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          
          {/* Unternehmensbezeichnung */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Unternehmensbezeichnung
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText,
                }
              ]}
              value={company}
              onChangeText={setCompany}
              placeholder="Name Ihres Unternehmens (optional)"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
        
        {/* Speichern Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              Änderungen speichern
            </Text>
          </TouchableOpacity>
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
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  profileImageButton: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: spacing.s,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImageHint: {
    fontSize: typography.fontSize.s,
    textAlign: 'center',
    marginTop: spacing.s,
  },
  formContainer: {
    paddingVertical: spacing.m,
  },
  inputContainer: {
    marginBottom: spacing.l,
  },
  inputLabel: {
    fontSize: typography.fontSize.s,
    fontWeight: '500',
    marginBottom: spacing.s,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    fontSize: typography.fontSize.m,
    minHeight: 48,
  },
  saveContainer: {
    paddingTop: spacing.xl,
  },
  saveButton: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: ui.borderRadius.m,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: typography.fontSize.m,
    fontWeight: '600',
  },
}); 