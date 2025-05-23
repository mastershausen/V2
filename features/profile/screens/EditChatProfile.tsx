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
 * EditChatProfile Component
 * 
 * Allows editing of chat profile information.
 */
export function EditChatProfile({ id, name = 'Chat' }: EditChatProfileProps) {
  const colors = useThemeColor();
  const router = useRouter();

  // State for all editable fields
  const [profileName, setProfileName] = useState(name || 'Thomas Müller');
  const [specialization, setSpecialization] = useState('Specialized in corporate structure, digital financial planning and tax-optimized exit strategies.');
  const [email, setEmail] = useState('contact@example.com');
  const [website, setWebsite] = useState('www.example.com');
  const [phone, setPhone] = useState('+49 123 456789');
  const [topics, setTopics] = useState(['Tax Structure', 'Exit Planning', 'Digital Accounting']);

  // Mock profile image
  const profileImage = 'https://placehold.co/600x400/1E6B55/FFFFFF?text=' + encodeURIComponent(profileName.substring(0, 2));

  // Navigate back
  const handleBackPress = () => {
    router.back();
  };

  // Save changes
  const handleSave = () => {
    Alert.alert(
      'Successfully Saved',
      'The profile changes have been saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  // Change profile image
  const handleChangeProfileImage = () => {
    Alert.alert(
      'Change Profile Image',
      'This feature will be available in a future version.',
      [{ text: 'OK' }]
    );
  };

  // Add topic
  const handleAddTopic = () => {
    Alert.alert(
      'Add Topic',
      'Enter a new topic:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (text) => {
            if (text && text.trim()) {
              setTopics([...topics, text.trim()]);
            }
          }
        }
      ]
    );
  };

  // Remove topic
  const handleRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header */}
      <HeaderNavigation
        title="Edit Profile"
        showBackButton={true}
        onBackPress={handleBackPress}
        rightContent={
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={[styles.saveButtonText, { color: colors.primary }]}>
              Save
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Profile image */}
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

      {/* Editable fields */}
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
            placeholder="Enter name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Specialization */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Specialization</Text>
          <TextInput
            style={[styles.textArea, { 
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.divider,
              color: colors.textPrimary
            }]}
            value={specialization}
            onChangeText={setSpecialization}
            placeholder="Description of specialization"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Contact information */}
        <View style={[styles.section, { borderTopColor: colors.divider }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.divider,
                color: colors.textPrimary
              }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
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
              placeholder="Website URL"
              placeholderTextColor={colors.textSecondary}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.divider,
                color: colors.textPrimary
              }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Topic areas */}
        <View style={[styles.section, { borderTopColor: colors.divider }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Topic Areas</Text>
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

        {/* Spacing for better scrollability */}
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