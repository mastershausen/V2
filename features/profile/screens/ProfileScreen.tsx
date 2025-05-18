/**
 * ProfileScreen
 * 
 * Ein komplett neu entwickelter Profilbildschirm mit sauberer Struktur
 * und klarer Trennung von Daten und UI-Komponenten.
 */

import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextStyle, Alert } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import Routes from '@/constants/routes';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DoubleButton } from '@/shared-components/button/DoubleButton';
import { PlusButton } from '@/shared-components/button/PlusButton';
import { SettingsIcon } from '@/shared-components/button/SettingsIcon';
import { ProfileImage, UserroleBadge, UserRole, HeaderMedia } from '@/shared-components/media';
import { useUserStore } from '@/stores';
import { createProfileInitialsFromName, ProfileImageData } from '@/utils/profileImageUtils';


type ProfileImageSource = ProfileImageData | { uri: string } | null;

// Demo-Benutzer Alexander Becker für den Demo-Modus
const DEMO_PROFILE = {
  id: 'u2',
  username: 'abecker',
  email: 'info@beckerundpartner.de',
  name: 'Alexander Becker',
  firstName: 'Alexander',
  lastName: 'Becker',
  role: 'free' as UserRole,
  profileImage: null, // Wir nutzen Initialen
  isVerified: true,
  description: 'Ich zeige Selbstständigen & Unternehmern, wie sie mit legaler Steueroptimierung 5-stellig sparen können – jedes Jahr.',
  headline: 'Steuern runter. Gewinn rauf.',
  companyName: 'Becker und Partner Steuerberatung',
  location: 'München',
  industry: 'Steuern & Finanzen',
  phone: '+49 89 98765432',
  website: 'https://beckerundpartner.de',
  rating: 5.0
};

/**
 * Hauptkomponente für den neuen Profilbildschirm
 * @returns {React.ReactNode} Der gerenderte ProfileScreen
 */
export default function ProfileScreen() {
  // Hole die Theme-Farben für die Komponente
  const colors = useThemeColor();
  const router = useRouter();
  const { getCurrentUser } = useUserStore();
  
  // Verwende den neuen useMode-Hook für Modusinformationen
  const { isDemoMode } = useMode();
  
  // Aktive Benutzerdaten abhängig vom Modus
  const profile = useMemo(() => {
    // Im Demo-Modus verwenden wir immer Alexander Becker
    if (isDemoMode()) {
      return DEMO_PROFILE;
    }
    
    // Im Live-Modus den aktuellen Benutzer aus dem Store verwenden
    const currentUser = getCurrentUser();
    return currentUser || {
      name: 'Unbekannter Benutzer',
      role: 'free' as UserRole
    };
  }, [isDemoMode, getCurrentUser]);
  
  // State für Button-Text und Icon mit useMemo, um Render-Loops zu vermeiden
  const buttonConfig = useMemo(() => ({
    label: isDemoMode() ? "Nachricht senden" : "Profil bearbeiten",
    icon: isDemoMode() ? "chatbubble-outline" : "create-outline"
  }), [isDemoMode]);
  
  // Erstelle Profilbild-Daten (entweder aus vorhandenem Bild oder Fallback mit Initialen)
  let profileImageData: ProfileImageSource = null;
  if (profile?.profileImage) {
    if (typeof profile.profileImage === 'string') {
      profileImageData = { uri: profile.profileImage };
    } else {
      profileImageData = profile.profileImage as ProfileImageData;
    }
  }
    
  // Initialen als Fallback vorbereiten
  const fallbackInitials = createProfileInitialsFromName(profile?.name || 'Unbekannter Benutzer');
  
  // Button-Aktionen basierend auf dem Modus
  const handlePrimaryButtonPress = () => {
    if (isDemoMode()) {
      Alert.alert('Nachricht', 'Nachrichtenfunktion wird geöffnet');
    } else {
      // Im Live-Mode navigieren wir zum Profil-Bearbeitungsbildschirm
      router.push(Routes.EDIT_PROFILE);
    }
  };
  
  const handleSecondaryButtonPress = () => {
    Alert.alert('Kontakt', 'Kontaktinformationen werden angezeigt');
  };
  
  // Handler für PlusButton
  const handlePlusButtonPress = () => {
    // Navigiere zum CreateNuggetScreen
    router.push('/nuggets/create/createNugget');
  };
  
  // Zusätzliche Profilinformationen nur für Demo-Modus anzeigen
  const renderAdditionalInfo = () => {
    if (!isDemoMode()) return null;
    
    return (
      <View style={styles.additionalInfoContainer}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Über mich
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {profile.description}
        </Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Branche:</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{profile.industry}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Standort:</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{profile.location}</Text>
        </View>
        
        {profile.website && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Website:</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>{profile.website}</Text>
          </View>
        )}
        
        <Text style={[styles.demoHint, { color: colors.textTertiary }]}>
          Hinweis: Im Demo-Modus werden Beispieldaten von Alexander Becker angezeigt.
        </Text>
      </View>
    );
  };
  
  // KEINE LOADING/ERROR STATES MEHR - NUR DIE HAUPTANSICHT
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Container für Header und Profilbild mit relativer Positionierung */}
        <View style={styles.headerProfileContainer}>
          {/* 16:9 Header-Bereich mit HeaderMedia */}
          <View style={styles.headerContainer}>
            <HeaderMedia 
              imageUrl=""
              borderRadius={0}
            />
            
            {/* UserRole Badge rechts oben auf dem Header */}
            <View style={styles.badgeOverlay}>
              <UserroleBadge 
                userRole={profile.role} 
                position="topRight" 
                size="medium" 
              />
            </View>
          </View>
          
          {/* Profilbild links am Rand überlappend mit dem Header */}
          <View style={styles.profileImageContainer}>
            <ProfileImage
              source={profileImageData || fallbackInitials}
              size={100}
              variant="circle"
              fallbackText={profile.name || profile.username}
              isRealMode={!isDemoMode()}
              style={styles.profileImage}
            />
          </View>
          
          {/* SettingsIcon rechts unter der HeaderMedia */}
          <View style={styles.settingsIconContainer}>
            <SettingsIcon size={26} />
          </View>
        </View>
        
        {/* Hauptinhalt */}
        <View style={styles.content}>
          {/* Name und Info */}
          <View style={styles.userInfoContainer}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {profile.firstName && profile.lastName 
                ? `${profile.firstName} ${profile.lastName}`
                : profile.name || profile.username}
            </Text>
            
            {profile.headline && (
              <Text style={[styles.headline, { color: colors.textSecondary }]}>
                {profile.headline}
              </Text>
            )}
            
            {profile.companyName && (
              <Text style={[styles.company, { color: colors.textSecondary }]}>
                {profile.companyName}
              </Text>
            )}
            
            {/* DoubleButton für Nachricht senden und Kontaktinformationen */}
            <View style={styles.actionButtonsContainer}>
              <DoubleButton 
                primaryLabel={buttonConfig.label}
                secondaryLabel="Kontaktinfo"
                onPrimaryPress={handlePrimaryButtonPress}
                onSecondaryPress={handleSecondaryButtonPress}
                primaryIcon={buttonConfig.icon}
                secondaryIcon="information-circle-outline"
              />
            </View>
          </View>
          
          {/* Zusätzliche Profilinformationen (nur im Demo-Modus) */}
          {renderAdditionalInfo()}
        </View>
      </ScrollView>
      
      {/* PlusButton in der unteren rechten Ecke */}
      <PlusButton
        onPress={handlePlusButtonPress}
        bottomOffset={100} // Höher positioniert, um über der BottomTabBar zu sein
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerProfileContainer: {
    position: 'relative',
    width: '100%',
  },
  headerContainer: {
    width: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  profileImageContainer: {
    position: 'absolute',
    left: spacing.l,
    bottom: -50, // Negative Wert für Überlappung mit dem Header
    backgroundColor: 'transparent',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileImage: {
    borderWidth: 0,
  },
  content: {
    flex: 1,
    padding: spacing.l,
    paddingTop: spacing.xxxl + 20, // Extra Platz für das Profilbild
  },
  userInfoContainer: {
    marginBottom: spacing.m,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'],
    marginBottom: spacing.xs,
  },
  headline: {
    fontSize: typography.fontSize.m,
    marginBottom: spacing.xs,
  },
  company: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.s,
  },
  actionButtonsContainer: {
    marginTop: spacing.m,
  },
  settingsIconContainer: {
    position: 'absolute',
    bottom: -30,
    right: 20,
    zIndex: 10,
  },
  additionalInfoContainer: {
    marginTop: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.semiBold as TextStyle['fontWeight'],
    marginBottom: spacing.m,
  },
  description: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
    marginBottom: spacing.l,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  infoLabel: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as TextStyle['fontWeight'],
    width: 80,
  },
  infoValue: {
    fontSize: typography.fontSize.s,
    flex: 1,
  },
  demoHint: {
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
    marginTop: spacing.l,
    opacity: 0.7,
  }
}); 