import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Linking, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { ProfileImage } from '@/shared-components/media/ProfileImage';
import { VerifyBadge } from '@/shared-components/badges';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FallstudienListe } from './FallstudienListe';

// Window width for calculations
const windowWidth = Dimensions.get('window').width;

interface ChatProfileProps {
  id?: string;
  name?: string;
}

/**
 * ChatProfile Component
 * 
 * Displays detailed information about a chat contact.
 */
export function ChatProfile({ id, name = 'Chat' }: ChatProfileProps) {
  const colors = useThemeColor();
  const router = useRouter();
  const [showFallstudien, setShowFallstudien] = useState(false);
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  // Mock data for the profile
  const profileData = {
    name: name || 'Thomas Müller',
    verified: true,
    status: 'Online',
    specialization: 'Specialized in corporate structure, digital financial planning and tax-optimized exit strategies.',
    profileImage: 'https://placehold.co/600x400/1E6B55/FFFFFF?text=' + encodeURIComponent(name?.substring(0, 2) || 'TM'),
    activeSince: 'Sep 22, 2023',
    responseRate: '98%',
    lastCaseStudy: 'Holding structure saves €84,000 annually',
    lastCaseStudyDate: 'May 3, 2025',
    contactInfo: {
      email: 'contact@example.com',
      website: 'www.example.com',
      phone: '+49 123 456789'
    },
    topics: ['Tax Structure', 'Exit Planning', 'Digital Accounting']
  };

  // Navigate back to chat
  const handleBackPress = () => {
    router.back();
  };

  // Navigate to EditProfile screen
  const handleEditProfile = () => {
    router.push('/profile/edit-chat');
  };

  // Open the website
  const handleOpenWebsite = () => {
    Linking.openURL('https://' + profileData.contactInfo.website);
  };

  // Open an email
  const handleSendEmail = () => {
    Linking.openURL('mailto:' + profileData.contactInfo.email);
  };

  // Start phone call
  const handlePhoneCall = () => {
    Linking.openURL('tel:' + profileData.contactInfo.phone);
  };

  // Show all case studies
  const handleShowCaseStudies = () => {
    setShowFallstudien(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header with back button */}
      <HeaderNavigation
        title=""
        showBackButton={true}
        onBackPress={handleBackPress}
        rightContent={
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="pencil-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      {/* Profile image (larger and prominently positioned) */}
      <View style={styles.profileImageContainer}>
        <ProfileImage
          source={{ uri: profileData.profileImage }}
          fallbackText={profileData.name}
          size={90}
          variant="circle"
          borderWidth={3}
        />
      </View>

      {/* Profile content */}
      <ScrollView style={styles.contentContainer}>
        {/* Name and job title */}
        <View style={styles.nameContainer}>
          <Text style={[styles.nameText, { color: colors.textPrimary }]}>
            {profileData.name}
          </Text>
          
          {/* Verified Badge with Info Icon */}
          {profileData.verified && (
            <View style={styles.verifyContainer}>
              <View style={styles.badgeWrapper}>
                <VerifyBadge />
              </View>
              <TouchableOpacity 
                style={styles.infoIcon}
                onPress={() => setShowVerificationInfo(true)}
              >
                <Ionicons 
                  name="information-circle" 
                  size={20} 
                  color="#FF9500" 
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Specialization */}
        <View style={[styles.section, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.specializationText, { color: colors.textPrimary }]}>
            {profileData.specialization}
          </Text>
        </View>

        {/* Case studies button */}
        <TouchableOpacity 
          style={[styles.caseStudiesButton, { backgroundColor: colors.pastel.primary }]}
          onPress={handleShowCaseStudies}
        >
          <Ionicons name="search" size={18} color={colors.primary} />
          <Text style={[styles.caseStudiesButtonText, { color: colors.primary }]}>
            View All Case Studies
          </Text>
        </TouchableOpacity>

        {/* Statistics */}
        <View style={[styles.section, { borderBottomColor: colors.divider }]}>
          <View style={styles.statRow}>
            <Ionicons name="trending-up" size={20} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              Active on Solvbox since: {profileData.activeSince}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              Response rate: {profileData.responseRate}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              Latest case study: "{profileData.lastCaseStudy}" ({profileData.lastCaseStudyDate})
            </Text>
          </View>
        </View>

        {/* Contact */}
        <View style={[styles.section, { borderBottomColor: colors.divider }]}>
          <View style={styles.contactHeader}>
            <Ionicons name="mail" size={20} color={colors.primary} style={styles.contactIcon} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Contact:
            </Text>
          </View>
          <TouchableOpacity onPress={handlePhoneCall} style={styles.contactLink}>
            <Ionicons name="call-outline" size={18} color={colors.primary} style={styles.linkIcon} />
            <Text style={[styles.contactText, { color: colors.primary }]}>
              {profileData.contactInfo.phone}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSendEmail} style={styles.contactLink}>
            <Ionicons name="mail-outline" size={18} color={colors.primary} style={styles.linkIcon} />
            <Text style={[styles.contactText, { color: colors.primary }]}>
              {profileData.contactInfo.email}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenWebsite} style={styles.contactLink}>
            <Ionicons name="globe-outline" size={18} color={colors.primary} style={styles.linkIcon} />
            <Text style={[styles.contactText, { color: colors.primary }]}>
              {profileData.contactInfo.website}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Topic areas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            📊 Topic Areas:
          </Text>
          <View style={styles.topicsContainer}>
            {profileData.topics.map((topic, index) => (
              <View 
                key={index} 
                style={[styles.topicTag, { backgroundColor: colors.pastel.primary }]}
              >
                <Text style={[styles.topicText, { color: colors.primary }]}>
                  {topic}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Case studies modal */}
      <FallstudienListe 
        visible={showFallstudien}
        onClose={() => setShowFallstudien(false)}
        profileId={id}
      />

      {/* Verification info modal */}
      <Modal
        visible={showVerificationInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVerificationInfo(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowVerificationInfo(false)}
        >
          <TouchableOpacity style={[styles.modalContent, { backgroundColor: colors.backgroundPrimary }]} activeOpacity={1}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Account Verifizierung</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[styles.modalSubtitle, { color: colors.textPrimary }]}>
                Warum verifizieren?
              </Text>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="trending-up" size={16} color={colors.primary} style={styles.benefitIcon} />
                  <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                    12x bessere Kundenkonvertierung
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="heart" size={16} color={colors.primary} style={styles.benefitIcon} />
                  <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                    Massiv gesteigertes Vertrauen
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="time" size={16} color={colors.primary} style={styles.benefitIcon} />
                  <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                    Kostenlos in unter 60 Sekunden
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.verifyButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowVerificationInfo(false);
                // Hier würde die Verifizierung gestartet werden
                console.log('Verifizierung gestartet');
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color="white" style={styles.buttonIcon} />
              <Text style={styles.verifyButtonText}>Jetzt verifizieren</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.m,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  nameText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  titleText: {
    fontSize: typography.fontSize.m,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  statusContainer: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: typography.fontSize.s,
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    marginHorizontal: spacing.xs,
  },
  section: {
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  specializationText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
    textAlign: 'center',
  },
  caseStudiesButton: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    alignItems: 'center',
    marginVertical: spacing.m,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  caseStudiesButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.medium as any,
    marginLeft: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  statIcon: {
    marginRight: spacing.s,
    width: 24,
  },
  sectionTitle: {
    fontSize: typography.fontSize.m,
    marginBottom: spacing.s,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  contactIcon: {
    marginRight: spacing.xs,
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
    paddingVertical: spacing.xs,
  },
  linkIcon: {
    marginRight: spacing.s,
    width: 24,
  },
  infoText: {
    fontSize: typography.fontSize.m,
    marginBottom: spacing.s,
  },
  contactText: {
    fontSize: typography.fontSize.m,
    textDecorationLine: 'underline',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  topicTag: {
    borderRadius: ui.borderRadius.m,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  topicText: {
    fontSize: typography.fontSize.s,
  },
  editButton: {
    padding: spacing.xs,
  },
  verifyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeWrapper: {
    alignItems: 'center',
  },
  infoIcon: {
    padding: spacing.xs,
    position: 'absolute',
    right: -spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: spacing.m,
    paddingTop: spacing.l,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  modalTitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    textAlign: 'center',
  },
  modalBody: {
    width: '100%',
    marginBottom: spacing.m,
  },
  modalSubtitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.s,
    textAlign: 'left',
  },
  benefitsList: {
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  benefitIcon: {
    marginRight: spacing.s,
  },
  benefitText: {
    fontSize: typography.fontSize.m,
    flex: 1,
  },
  verifyButton: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: ui.borderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  verifyButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
    color: 'white',
  },
  buttonIcon: {
    marginRight: spacing.s,
  },
});
