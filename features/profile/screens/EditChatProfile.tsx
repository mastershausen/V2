import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
export function EditChatProfile({ id, name = 'Max Weber' }: EditChatProfileProps) {
  const colors = useThemeColor();
  const router = useRouter();

  // State for all editable fields
  const [profileName, setProfileName] = useState(name || 'Max Weber');
  const [specialization, setSpecialization] = useState('Specialized in corporate structure, digital financial planning and tax-optimized exit strategies.');
  const [email, setEmail] = useState('contact@example.com');
  const [website, setWebsite] = useState('www.example.com');
  const [phone, setPhone] = useState('+49 123 456789');
  const [topics, setTopics] = useState(['Tax Structure', 'Exit Planning', 'Digital Accounting']);
  const [newTopicText, setNewTopicText] = useState('');

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

  // Submit new topic
  const handleSubmitTopic = () => {
    if (newTopicText.trim()) {
      setTopics([...topics, newTopicText.trim()]);
      setNewTopicText('');
    }
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

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <LinearGradient
          colors={['rgba(30, 107, 85, 0.08)', 'rgba(30, 107, 85, 0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.profileHeaderCard}
        >
          <TouchableOpacity onPress={handleChangeProfileImage} style={styles.profileImageContainer}>
            <View style={[styles.profileIconContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name="person-outline" size={32} color="white" />
            </View>
            <View style={[styles.editImageOverlay, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={14} color="white" />
            </View>
          </TouchableOpacity>

          {/* Name Input */}
          <View style={styles.nameInputContainer}>
            <TextInput
              style={[styles.nameInput, { 
                color: colors.textPrimary,
                borderBottomColor: colors.inputBorder,
                fontSize: 20,
                fontWeight: '600'
              }]}
              value={profileName}
              onChangeText={setProfileName}
              placeholder="Enter name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Specialization Input */}
          <View style={styles.specializationContainer}>
            <TextInput
              style={[styles.specializationInput, { 
                color: colors.textSecondary,
                borderColor: colors.inputBorder,
                backgroundColor: colors.backgroundSecondary
              }]}
              value={specialization}
              onChangeText={setSpecialization}
              placeholder="Description of specialization"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </LinearGradient>

        {/* Contact Information Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact Information</Text>
          
          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="mail-outline" size={18} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.contactInput, { 
                  color: colors.textPrimary,
                  borderBottomColor: colors.inputBorder 
                }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="globe-outline" size={18} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.contactInput, { 
                  color: colors.textPrimary,
                  borderBottomColor: colors.inputBorder 
                }]}
                value={website}
                onChangeText={setWebsite}
                placeholder="Website URL"
                placeholderTextColor={colors.textTertiary}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="call-outline" size={18} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.contactInput, { 
                  color: colors.textPrimary,
                  borderBottomColor: colors.inputBorder 
                }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Topic Areas Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Topic Areas</Text>
          
          {/* Topic Input Field */}
          <View style={[styles.topicInputContainer, { borderColor: colors.inputBorder }]}>
            <TextInput
              style={[styles.topicInput, { 
                color: colors.textPrimary,
                backgroundColor: colors.backgroundPrimary,
                borderColor: colors.inputBorder
              }]}
              value={newTopicText}
              onChangeText={setNewTopicText}
              placeholder="Enter new topic and press Enter..."
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={handleSubmitTopic}
              returnKeyType="done"
            />
          </View>
          
          <View style={styles.topicsContainer}>
            {topics.map((topic, index) => (
              <View 
                key={index} 
                style={[styles.topicTag, { backgroundColor: `${colors.primary}15` }]}
              >
                <Text style={[styles.topicText, { color: colors.primary }]}>
                  [{topic}]
                </Text>
                <TouchableOpacity 
                  onPress={() => handleRemoveTopic(index)}
                  style={styles.removeTopicButton}
                >
                  <Ionicons name="close-circle" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: spacing.m,
  },
  profileHeaderCard: {
    padding: spacing.m,
    marginTop: spacing.s,
    borderRadius: ui.borderRadius.m,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nameInputContainer: {
    marginTop: spacing.m,
    width: '100%',
  },
  nameInput: {
    textAlign: 'center',
    borderBottomWidth: 1,
    paddingVertical: spacing.xs,
    fontSize: 18,
    fontWeight: '600',
  },
  specializationContainer: {
    marginTop: spacing.s,
    width: '100%',
  },
  specializationInput: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.s,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    fontSize: 14,
    lineHeight: 18,
    minHeight: 60,
    textAlign: 'center',
  },
  sectionCard: {
    padding: spacing.m,
    marginTop: spacing.m,
    borderRadius: ui.borderRadius.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.s,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  contactGrid: {
    gap: spacing.s,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  contactIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.s,
  },
  contactInput: {
    flex: 1,
    fontSize: 14,
    borderBottomWidth: 1,
    paddingVertical: spacing.xs,
    paddingLeft: spacing.xs,
  },
  addButton: {
    padding: spacing.xs,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  topicTag: {
    borderRadius: ui.borderRadius.s,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 12,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '600',
  },
  topicInputContainer: {
    marginBottom: spacing.s,
  },
  topicInput: {
    fontSize: 14,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderWidth: 1,
    borderRadius: ui.borderRadius.s,
    minHeight: 36,
  },
}); 