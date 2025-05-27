import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Linking, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
    topics: ['Tax Structure', 'Exit Planning', 'Digital Accounting'],
    // New statistics for the grid
    stats: {
      // Performance metrics
      caseStudiesCount: 12,
      verifiedCaseStudies: 8,
      receivedRequests: 24,
      // Communication metrics
      responseRatePercent: 98,
      avgResponseTime: '2.4h',
      activeSinceDate: '09/2023'
    }
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
                <VerifyBadge text="Verify Account now" />
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

        {/* Statistics Grid - Primary metrics (upper block with focus) */}
        <View style={[styles.statsGridContainer, styles.primaryStatsContainer, { backgroundColor: colors.pastel.primary, borderColor: colors.pastel.primaryBorder }]}>
          <Text style={[styles.statsGridTitle, { color: colors.primary }]}>
            {t('profile.stats.performanceTitle')}
          </Text>
          
          <View style={styles.statsGridRow}>
            {/* Uploaded Case Studies - Mit Klickfunktion */}
            <TouchableOpacity 
              style={[styles.clickableStatsItem, { backgroundColor: 'rgba(30, 107, 85, 0.08)', borderColor: 'rgba(30, 107, 85, 0.2)', borderWidth: 1 }]}
              onPress={handleShowCaseStudies}
              accessibilityLabel={t('profile.stats.caseStudies')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statsValue, { color: colors.textPrimary }]}>{profileData.stats.caseStudiesCount}</Text>
              <View style={styles.clickableLabel}>
                <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                  {t('profile.stats.caseStudies')}
                </Text>
              </View>
            </TouchableOpacity>
            
            {/* Verified Case Studies - Ohne Klickfunktion */}
            <View 
              style={styles.statsGridItem}
            >
              <Text style={[styles.statsValue, { color: colors.textPrimary }]}>{profileData.stats.verifiedCaseStudies}</Text>
              <View style={styles.clickableLabel}>
                <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                  {t('profile.stats.verified')}
                </Text>
              </View>
            </View>
            
            {/* Received Requests */}
            <View style={styles.statsGridItem}>
              <Text style={[styles.statsValue, { color: colors.textPrimary }]}>{profileData.stats.receivedRequests}</Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                {t('profile.stats.requests')}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Statistics Grid - Secondary metrics (communication behavior) */}
        <View style={[styles.statsGridContainer, styles.secondaryStatsContainer]}>
          <Text style={[styles.statsGridTitle, { color: colors.textSecondary }]}>
            {t('profile.stats.communicationTitle')}
          </Text>
          
          <View style={styles.statsGridRow}>
            {/* Response Rate */}
            <View style={styles.statsGridItem}>
              <Text style={[styles.statsValue, styles.secondaryStatsValue, { color: colors.textPrimary }]}>{profileData.stats.responseRatePercent}%</Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                {t('profile.stats.responseRate')}
              </Text>
            </View>
            
            {/* Average Response Time */}
            <View style={styles.statsGridItem}>
              <Text style={[styles.statsValue, styles.secondaryStatsValue, { color: colors.textPrimary }]}>{profileData.stats.avgResponseTime}</Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                {t('profile.stats.avgResponse')}
              </Text>
            </View>
            
            {/* Active Since */}
            <View style={styles.statsGridItem}>
              <Text style={[styles.statsValue, styles.secondaryStatsValue, { color: colors.textPrimary }]}>{profileData.stats.activeSinceDate}</Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                {t('profile.stats.activeSince')}
              </Text>
            </View>
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
        filterVerified={false}
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
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t('verification.modal.title')}</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[styles.modalSubtitle, { color: colors.textPrimary }]}>
                {t('verification.modal.subtitle')}
              </Text>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="trending-up" size={16} color="#00A041" style={styles.benefitIcon} />
                  <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                    {t('verification.modal.benefits.betterConversion')}
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="heart" size={16} color="#00A041" style={styles.benefitIcon} />
                  <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                    {t('verification.modal.benefits.increasedTrust')}
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="time" size={16} color="#00A041" style={styles.benefitIcon} />
                  <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                    {t('verification.modal.benefits.freeAndFast')}
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => {
                setShowVerificationInfo(false);
                // Hier würde die Verifizierung gestartet werden
                console.log('Verifizierung gestartet');
              }}
            >
              <LinearGradient
                colors={['#00A041', '#008F39']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.verifyButtonGradient}
              >
                <Ionicons name="checkmark-circle" size={18} color="white" style={styles.buttonIcon} />
                <Text style={styles.verifyButtonText}>{t('verification.modal.button')}</Text>
              </LinearGradient>
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
    borderRadius: ui.borderRadius.m,
    width: '100%',
    shadowColor: '#008F39',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  verifyButtonText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
    color: 'white',
  },
  verifyButtonGradient: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: ui.borderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.s,
  },
  statsGridContainer: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    marginBottom: spacing.m,
  },
  statsGridTitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.s,
  },
  statsGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsGridItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  clickableStatsItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.s,
    borderRadius: ui.borderRadius.s,
  },
  statsValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xs,
  },
  statsLabel: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xxs,
    paddingHorizontal: spacing.xs,
  },
  primaryStatsContainer: {
    borderWidth: 1,
    shadowColor: '#1E6B55',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryStatsContainer: {
    borderWidth: 0,
    backgroundColor: '#F9F9F9',
  },
  secondaryStatsValue: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.medium as any,
  },
  clickableLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxs,
  },
  clickableIcon: {
    marginLeft: spacing.xxs,
  },
});
