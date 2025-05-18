/**
 * ProfileScreen
 * 
 * Ein komplett neu entwickelter Profilbildschirm mit sauberer Struktur
 * und klarer Trennung von Daten und UI-Komponenten.
 */

import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextStyle, Alert, Dimensions } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import Routes from '@/constants/routes';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DoubleButton } from '@/shared-components/button/DoubleButton';
import { PlusButton } from '@/shared-components/button/PlusButton';
import { SettingsIcon } from '@/shared-components/button/SettingsIcon';
import { ProfileImage, UserroleBadge, UserRole, HeaderMedia } from '@/shared-components/media';
import { useUserStore } from '@/stores';
import { UserProfile } from '@/types/userTypes';
import { createProfileInitialsFromName, ProfileImageData } from '@/utils/profileImageUtils';


type ProfileImageSource = ProfileImageData | { uri: string } | null;

// Erweiterter Profiltyp mit allen benötigten Eigenschaften
interface ExtendedUserProfile extends Partial<Omit<UserProfile, 'profileImage'>> {
  name?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  profileImage?: string | ProfileImageData | null;
  headline?: string;
  companyName?: string;
  description?: string;
  industry?: string;
  location?: string;
  website?: string;
  phone?: string;
  rating?: number;
}

// Demo-Benutzer Alexander Becker für den Demo-Modus
const DEMO_PROFILE: ExtendedUserProfile = {
  id: 'u2',
  username: 'abecker',
  email: 'info@beckerundpartner.de',
  name: 'Alexander Becker',
  firstName: 'Alexander',
  lastName: 'Becker',
  role: 'free',
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

// Bildschirmbreite für responsives Design
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Hauptkomponente für den neuen Profilbildschirm
 * @returns {React.ReactNode} Der gerenderte ProfileScreen
 */
export default function ProfileScreen() {
  // Hole die Theme-Farben für die Komponente
  const colors = useThemeColor();
  const router = useRouter();
  const userStore = useUserStore();
  
  // Verwende den neuen useMode-Hook für Modusinformationen
  const { isDemoMode } = useMode();
  
  // Aktive Benutzerdaten abhängig vom Modus
  const profile = useMemo<ExtendedUserProfile>(() => {
    // Im Demo-Modus verwenden wir immer Alexander Becker
    if (isDemoMode()) {
      return DEMO_PROFILE;
    }
    
    // Im Live-Modus den aktuellen Benutzer aus dem Store verwenden
    return userStore.user as ExtendedUserProfile || {
      name: 'Unbekannter Benutzer',
      role: 'free'
    };
  }, [isDemoMode, userStore.user]);
  
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
    // Keine zusätzlichen Informationen anzeigen
    return null;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Container für Header und Profilbild mit relativer Positionierung */}
        <View style={styles.headerProfileContainer}>
          {/* Header-Bereich mit HeaderMedia */}
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
          
          {/* Profilbild leicht überlappend mit dem Header */}
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
          
          {/* SettingsIcon rechts am Rand */}
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 50,
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
    marginBottom: spacing.l,
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }
}); 