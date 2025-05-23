import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { ProfileImage } from '@/shared-components/media/ProfileImage';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface EditChatProfileProps {
  id?: string;
  name?: string;
}

/**
 * EditChatProfile-Komponente
 * 
 * Ermöglicht die Bearbeitung der Chat-Profil-Informationen.
 */
export function EditChatProfile({ id, name = 'Chat' }: EditChatProfileProps) {
  const colors = useThemeColor();
  const router = useRouter();

  // State für alle bearbeitbaren Felder
  const [profileName, setProfileName] = useState(name || 'Thomas Müller');
  const [specialization, setSpecialization] = useState('Spezialisiert auf Unternehmensstruktur, digitale Finanzplanung und steueroptimierte Exitstrategien.');
  const [email, setEmail] = useState('kontakt@beispiel.de');
  const [website, setWebsite] = useState('www.beispiel.de');
  const [phone, setPhone] = useState('+49 123 456789');
  const [topics, setTopics] = useState(['Steuerstruktur', 'Exitplanung', 'Digitale Buchhaltung']);

  // Mock-Profilbild
  const profileImage = 'https://placehold.co/600x400/1E6B55/FFFFFF?text=' + encodeURIComponent(profileName.substring(0, 2));

  // Navigation zurück
  const handleBackPress = () => {
    router.back();
  };

  // Speichern der Änderungen
  const handleSave = () => {
    Alert.alert(
      'Erfolgreich gespeichert',
      'Die Profil-Änderungen wurden erfolgreich gespeichert.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  // Profilbild ändern
  const handleChangeProfileImage = () => {
    Alert.alert(
      'Profilbild ändern',
      'Diese Funktion wird in einer zukünftigen Version verfügbar sein.',
      [{ text: 'OK' }]
    );
  };

  // Thema hinzufügen
  const handleAddTopic = () => {
    Alert.alert(
      'Thema hinzufügen',
      'Geben Sie ein neues Thema ein:',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Hinzufügen',
          onPress: (text) => {
            if (text && text.trim()) {
              setTopics([...topics, text.trim()]);
            }
          }
        }
      ]
    );
  };

  // Thema entfernen
  const handleRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header */}
      <HeaderNavigation
        title="Profil bearbeiten"
        showBackButton={true}
        onBackPress={handleBackPress}
        rightContent={
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={[styles.saveButtonText, { color: colors.primary }]}>
              Speichern
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Profilbild */}
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handleChangeProfileImage}>
          <ProfileImage
            source={{ uri: profileImage }}
            fallbackText={profileName}
            size={90}
            variant="circle"
            borderWidth={3}
          />
          <View style={[styles.editImageOverlay, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={18} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Bearbeitbare Felder */}
      <ScrollView style={styles.contentContainer}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.divider,
              color: colors.textPrimary
            }]}
            value={profileName}
            onChangeText={setProfileName}
            placeholder="Name eingeben"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Spezialisierung */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Spezialisierung</Text>
          <TextInput
            style={[styles.textArea, { 
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.divider,
              color: colors.textPrimary
            }]}
            value={specialization}
            onChangeText={setSpecialization}
            placeholder="Beschreibung der Spezialisierung"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Kontaktinformationen */}
        <View style={[styles.section, { borderTopColor: colors.divider }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Kontaktinformationen</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>E-Mail</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.divider,
                color: colors.textPrimary
              }]}
              value={email}
              onChangeText={setEmail}
              placeholder="E-Mail-Adresse"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Website</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.divider,
                color: colors.textPrimary
              }]}
              value={website}
              onChangeText={setWebsite}
              placeholder="Website-URL"
              placeholderTextColor={colors.textSecondary}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Telefon</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.divider,
                color: colors.textPrimary
              }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Telefonnummer"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Themenbereiche */}
        <View style={[styles.section, { borderTopColor: colors.divider }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Themenbereiche</Text>
            <TouchableOpacity onPress={handleAddTopic} style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.topicsContainer}>
            {topics.map((topic, index) => (
              <View 
                key={index} 
                style={[styles.topicTag, { backgroundColor: colors.pastel.primary }]}
              >
                <Text style={[styles.topicText, { color: colors.primary }]}>
                  [{topic}]
                </Text>
                <TouchableOpacity 
                  onPress={() => handleRemoveTopic(index)}
                  style={styles.removeTopicButton}
                >
                  <Ionicons name="close-circle" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Abstand für bessere Scrollbarkeit */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.m,
  },
  inputGroup: {
    marginBottom: spacing.m,
  },
  label: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as any,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    fontSize: typography.fontSize.m,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    fontSize: typography.fontSize.m,
    minHeight: 80,
  },
  section: {
    paddingTop: spacing.l,
    marginTop: spacing.l,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as any,
  },
  addButton: {
    padding: spacing.xs,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicTag: {
    borderRadius: ui.borderRadius.m,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicText: {
    fontSize: typography.fontSize.s,
    marginRight: spacing.xs,
  },
  removeTopicButton: {
    marginLeft: spacing.xs,
  },
  saveButton: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  saveButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.medium as any,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
}); 