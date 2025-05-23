import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { ProfileImage } from '@/shared-components/media/ProfileImage';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FallstudienListe } from './FallstudienListe';

// Fensterbreite für Berechnungen
const windowWidth = Dimensions.get('window').width;

interface ChatProfileProps {
  id?: string;
  name?: string;
}

/**
 * ChatProfile-Komponente
 * 
 * Zeigt detaillierte Informationen zu einem Chat-Kontakt an.
 */
export function ChatProfile({ id, name = 'Chat' }: ChatProfileProps) {
  const colors = useThemeColor();
  const router = useRouter();
  const [showFallstudien, setShowFallstudien] = useState(false);

  // Mock-Daten für das Profil
  const profileData = {
    name: name || 'Thomas Müller',
    verified: true,
    status: 'Online',
    specialization: 'Spezialisiert auf Unternehmensstruktur, digitale Finanzplanung und steueroptimierte Exitstrategien.',
    profileImage: 'https://placehold.co/600x400/1E6B55/FFFFFF?text=' + encodeURIComponent(name?.substring(0, 2) || 'TM'),
    activeSince: '22.09.2023',
    responseRate: '98%',
    lastCaseStudy: 'Holdingstruktur spart 84.000 € jährlich',
    lastCaseStudyDate: '03.05.2025',
    contactInfo: {
      email: 'kontakt@beispiel.de',
      website: 'www.beispiel.de',
      phone: '+49 123 456789'
    },
    topics: ['Steuerstruktur', 'Exitplanung', 'Digitale Buchhaltung']
  };

  // Navigiere zurück zum Chat
  const handleBackPress = () => {
    router.back();
  };

  // Navigiere zum EditProfilScreen
  const handleEditProfile = () => {
    router.push('/profile/edit-chat');
  };

  // Öffne die Website
  const handleOpenWebsite = () => {
    Linking.openURL('https://' + profileData.contactInfo.website);
  };

  // Öffne eine E-Mail
  const handleSendEmail = () => {
    Linking.openURL('mailto:' + profileData.contactInfo.email);
  };

  // Telefonanruf starten
  const handlePhoneCall = () => {
    Linking.openURL('tel:' + profileData.contactInfo.phone);
  };

  // Zeige alle Fallstudien
  const handleShowCaseStudies = () => {
    setShowFallstudien(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header mit Zurück-Button */}
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

      {/* Profilbild (größer und prominent positioniert) */}
      <View style={styles.profileImageContainer}>
        <ProfileImage
          source={{ uri: profileData.profileImage }}
          fallbackText={profileData.name}
          size={90}
          variant="circle"
          borderWidth={3}
        />
      </View>

      {/* Profil-Inhalt */}
      <ScrollView style={styles.contentContainer}>
        {/* Name und Berufsbezeichnung */}
        <View style={styles.nameContainer}>
          <Text style={[styles.nameText, { color: colors.textPrimary }]}>
            {profileData.name}
          </Text>
        </View>

        {/* Spezialisierung */}
        <View style={[styles.section, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.specializationText, { color: colors.textPrimary }]}>
            {profileData.specialization}
          </Text>
        </View>

        {/* Fallstudien-Button */}
        <TouchableOpacity 
          style={[styles.caseStudiesButton, { backgroundColor: colors.pastel.primary }]}
          onPress={handleShowCaseStudies}
        >
          <Ionicons name="search" size={18} color={colors.primary} />
          <Text style={[styles.caseStudiesButtonText, { color: colors.primary }]}>
            Alle Fallstudien anzeigen
          </Text>
        </TouchableOpacity>

        {/* Statistiken */}
        <View style={[styles.section, { borderBottomColor: colors.divider }]}>
          <View style={styles.statRow}>
            <Ionicons name="trending-up" size={20} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              Aktiv auf Solvbox seit: {profileData.activeSince}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              Antwortrate: {profileData.responseRate}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              Letzte Fallstudie: „{profileData.lastCaseStudy}" ({profileData.lastCaseStudyDate})
            </Text>
          </View>
        </View>

        {/* Kontakt */}
        <View style={[styles.section, { borderBottomColor: colors.divider }]}>
          <View style={styles.contactHeader}>
            <Ionicons name="mail" size={20} color={colors.primary} style={styles.contactIcon} />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Kontakt:
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

        {/* Themenbereiche */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            📊 Themenbereiche:
          </Text>
          <View style={styles.topicsContainer}>
            {profileData.topics.map((topic, index) => (
              <View 
                key={index} 
                style={[styles.topicTag, { backgroundColor: colors.pastel.primary }]}
              >
                <Text style={[styles.topicText, { color: colors.primary }]}>
                  [{topic}]
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fallstudien Modal */}
      <FallstudienListe 
        visible={showFallstudien}
        onClose={() => setShowFallstudien(false)}
        profileId={id}
      />
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
});
