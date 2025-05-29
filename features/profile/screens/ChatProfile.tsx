import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Linking, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
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
    name: 'Max Weber',
    verified: true,
    status: 'Online',
    specialization: 'Expert in business setup, finance planning and smart tax strategies for growing companies. Helping clients save money and grow faster with proven methods.',
    profileImage: 'https://placehold.co/600x400/1E6B55/FFFFFF?text=MW',
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
      requestsSent: 17
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

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <LinearGradient
          colors={['rgba(30, 107, 85, 0.08)', 'rgba(30, 107, 85, 0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.profileHeaderCard}
        >
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileIconContainer, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              <Ionicons name="person-outline" size={40} color="white" />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.nameText, { color: colors.textPrimary }]}>
              {profileData.name}
            </Text>
            
            {profileData.verified && (
              <View style={styles.verifyContainer}>
                <VerifyBadge text="Verify Account now" />
                <TouchableOpacity 
                  style={styles.infoIcon}
                  onPress={() => setShowVerificationInfo(true)}
                >
                  <Ionicons name="information-circle" size={22} color="#FF9500" style={styles.infoIconStyle} />
                </TouchableOpacity>
              </View>
            )}

            <Text style={[styles.specializationText, { color: colors.textSecondary }]}>
              {profileData.specialization}
            </Text>
          </View>
        </LinearGradient>

        {/* Performance Metrics Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Performance</Text>
          
          <View style={styles.metricsGrid}>
            <TouchableOpacity 
              style={[styles.metricItem]}
              onPress={handleShowCaseStudies}
              activeOpacity={0.7}
            >
              <View style={[styles.metricIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
              </View>
              <View style={styles.metricContent}>
                <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                  {profileData.stats.caseStudiesCount}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  {t('profile.stats.caseStudies')}
                </Text>
              </View>
              {/* Chevron Overlay */}
              <View style={styles.chevronOverlay}>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>

            <View style={styles.metricItem}>
              <View style={[styles.metricIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              </View>
              <View style={styles.metricContent}>
                <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                  {profileData.stats.verifiedCaseStudies}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  {t('profile.stats.verified')}
                </Text>
              </View>
            </View>

            <View style={styles.metricItem}>
              <View style={[styles.metricIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="mail" size={20} color={colors.primary} />
              </View>
              <View style={styles.metricContent}>
                <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                  {profileData.stats.receivedRequests}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  {t('profile.stats.requests')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Communication Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Communication</Text>
          
          <View style={styles.communicationGrid}>
            <View style={styles.commMetric}>
              <Text style={[styles.commValue, { color: colors.primary }]}>
                {profileData.stats.responseRatePercent}%
              </Text>
              <Text style={[styles.commLabel, { color: colors.textSecondary }]}>
                {t('profile.stats.responseRate')}
              </Text>
            </View>
            
            <View style={styles.commMetric}>
              <Text style={[styles.commValue, { color: colors.primary }]}>
                {profileData.stats.avgResponseTime}
              </Text>
              <Text style={[styles.commLabel, { color: colors.textSecondary }]}>
                {t('profile.stats.avgResponse')}
              </Text>
            </View>
            
            <View style={styles.commMetric}>
              <Text style={[styles.commValue, { color: colors.primary }]}>
                {profileData.stats.requestsSent}
              </Text>
              <Text style={[styles.commLabel, { color: colors.textSecondary }]}>
                Requests Sent
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={styles.contactHeader}>
            <View style={[styles.contactHeaderIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="call" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact</Text>
          </View>
          
          <View style={styles.contactGrid}>
            <TouchableOpacity onPress={handlePhoneCall} style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="call" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.contactText, { color: colors.primary }]}>
                {profileData.contactInfo.phone}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSendEmail} style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="mail" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.contactText, { color: colors.primary }]}>
                {profileData.contactInfo.email}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleOpenWebsite} style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="globe" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.contactText, { color: colors.primary }]}>
                {profileData.contactInfo.website}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Topics Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Expertise</Text>
          <View style={styles.topicsContainer}>
            {profileData.topics.map((topic, index) => (
              <View 
                key={index} 
                style={[styles.topicTag, { backgroundColor: `${colors.primary}12` }]}
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: spacing.m,
  },
  profileHeaderCard: {
    padding: spacing.l,
    borderRadius: ui.borderRadius.xl,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: 4,
    textAlign: 'center',
  },
  specializationText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: spacing.s,
  },
  sectionCard: {
    padding: spacing.l,
    borderRadius: ui.borderRadius.xl,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.m,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.s,
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  metricValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold as any,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  metricLabel: {
    fontSize: typography.fontSize.s,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium as any,
    lineHeight: 16,
    paddingHorizontal: spacing.xs,
    minHeight: 32,
    textAlignVertical: 'center',
  },
  communicationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 107, 85, 0.04)',
    padding: spacing.m,
    borderRadius: ui.borderRadius.l,
  },
  commMetric: {
    alignItems: 'center',
    flex: 1,
  },
  commValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  commLabel: {
    fontSize: typography.fontSize.s,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium as any,
    lineHeight: 16,
    paddingHorizontal: spacing.xs,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  contactHeaderIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactGrid: {
    gap: spacing.s,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.s,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: ui.borderRadius.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  contactIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.medium as any,
    textDecorationLine: 'underline',
  },
  verifyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  infoIcon: {
    padding: spacing.xs,
    position: 'absolute',
    right: -spacing.xl,
  },
  infoIconStyle: {
    textShadowColor: 'rgba(255, 149, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: spacing.l,
    paddingTop: spacing.l,
    borderRadius: ui.borderRadius.l,
    width: '82%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    textAlign: 'center',
  },
  modalBody: {
    width: '100%',
    marginBottom: spacing.l,
  },
  modalSubtitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.m,
    textAlign: 'left',
  },
  benefitsList: {
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    paddingVertical: spacing.xs,
  },
  benefitIcon: {
    marginRight: spacing.m,
  },
  benefitText: {
    fontSize: typography.fontSize.m,
    flex: 1,
    lineHeight: 20,
  },
  verifyButton: {
    borderRadius: ui.borderRadius.m,
    width: '100%',
    shadowColor: '#008F39',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  verifyButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    color: 'white',
  },
  buttonIcon: {
    marginRight: spacing.s,
  },
  verifyButtonGradient: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: ui.borderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronOverlay: {
    position: 'absolute',
    left: '50%',
    top: 69,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  topicTag: {
    borderRadius: ui.borderRadius.xl,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  topicText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as any,
  },
  editButton: {
    padding: spacing.s,
  },
  profileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
