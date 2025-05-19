/**
 * ProfileScreen
 * 
 * Ein komplett neu entwickelter Profilbildschirm mit sauberer Struktur
 * und klarer Trennung von Daten und UI-Komponenten.
 */

import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextStyle, Alert, Dimensions, TouchableOpacity } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import Routes from '@/constants/routes';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DoubleButton } from '@/shared-components/button/DoubleButton';
import { PlusButton } from '@/shared-components/button/PlusButton';
import { SettingsIcon } from '@/shared-components/button/SettingsIcon';
import { NuggetCard } from '@/shared-components/cards/nugget-card/NuggetCard';
import { NuggetData } from '@/shared-components/cards/nugget-card/types';
import { BaseTabbar, BaseTabConfig } from '@/shared-components/navigation/BaseTabbar';
import { ProfileImage, UserroleBadge, UserRole, HeaderMedia } from '@/shared-components/media';
import { useUserStore } from '@/stores';
import { UserProfile } from '@/types/userTypes';
import { createProfileInitialsFromName, ProfileImageData } from '@/utils/profileImageUtils';

// Typ für Profile-Tabs
type ProfileTabId = 'nuggets' | 'gigs' | 'casestudies' | 'ratings';

// ProfileTabbar-Props
interface ProfileTabbarProps {
  activeTab: ProfileTabId;
  onTabPress: (tabId: ProfileTabId) => void;
}

// ProfileTabbar-Komponente
function ProfileTabbar({ activeTab, onTabPress }: ProfileTabbarProps) {
  const colors = useThemeColor();
  
  const tabs: BaseTabConfig[] = [
    { id: 'nuggets', label: 'Nuggets' },
    { id: 'gigs', label: 'Gigs' },
    { id: 'casestudies', label: 'Fallstudien' },
    { id: 'ratings', label: 'Bewertungen' }
  ];

  return (
    <View style={styles.tabbarOuterContainer}>
      <View style={styles.tabbarInnerContainer}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity 
              key={tab.id}
              style={styles.tabItem}
              onPress={() => onTabPress(tab.id as ProfileTabId)}
            >
              <Text 
                style={[
                  styles.tabLabel, 
                  { color: isActive ? colors.primary : colors.textSecondary }
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

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

// Demo-Nugget für den Demo-Modus
const DEMO_NUGGET: NuggetData = {
  id: 'n1',
  user: {
    id: 'u2',
    name: 'Alexander Becker',
    profileImage: {
      initials: 'AB'
    }
  },
  timestamp: new Date(2023, 5, 15),
  content: 'Mit diesen 3 Steuertipps können Selbstständige jährlich bis zu 5.000€ sparen. Besonders Tipp #2 wird oft übersehen!',
  helpfulCount: 42,
  commentCount: 7,
  isHelpful: true,
  isSaved: false,
  tags: ['Steuern', 'Selbstständige', 'Tipps']
};

// Zusätzliche Mock-Nuggets
const DEMO_NUGGET_2: NuggetData = {
  id: 'n2',
  user: {
    id: 'u2',
    name: 'Alexander Becker',
    profileImage: {
      initials: 'AB'
    }
  },
  timestamp: new Date(2023, 6, 20),
  content: 'Wusstet ihr, dass ihr als Freiberufler bis zu 50% eurer Büromiete als Betriebsausgabe absetzen könnt? Hier sind die wichtigsten Voraussetzungen...',
  helpfulCount: 28,
  commentCount: 5,
  isHelpful: false,
  isSaved: true,
  tags: ['Freiberufler', 'Büromiete', 'Betriebsausgaben']
};

const DEMO_NUGGET_3: NuggetData = {
  id: 'n3',
  user: {
    id: 'u2',
    name: 'Alexander Becker',
    profileImage: {
      initials: 'AB'
    }
  },
  timestamp: new Date(2023, 7, 5),
  content: 'Die neue Regelung zur Umsatzsteuer für digitale Dienstleistungen ab 2024: Was ihr jetzt schon wissen und vorbereiten solltet.',
  helpfulCount: 35,
  commentCount: 12,
  isHelpful: true,
  isSaved: false,
  tags: ['Umsatzsteuer', 'Digitale Dienstleistungen', '2024']
};

const DEMO_NUGGET_4: NuggetData = {
  id: 'n4',
  user: {
    id: 'u2',
    name: 'Alexander Becker',
    profileImage: {
      initials: 'AB'
    }
  },
  timestamp: new Date(2023, 8, 10),
  content: 'Meine Top 5 Steuerspar-Tipps für Gründer im ersten Jahr. Besonders wichtig: Die richtige Rechtsform wählen und Investitionsabzugsbetrag nutzen!',
  helpfulCount: 56,
  commentCount: 8,
  isHelpful: true,
  isSaved: true,
  tags: ['Gründer', 'Steuersparen', 'Rechtsform']
};

// Bildschirmbreite für responsives Design
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Hauptkomponente für den neuen Profilbildschirm
 * @returns {React.ReactNode} Der gerenderte ProfileScreen
 */
export default function ProfileScreen() {
  // State für den aktiven Tab
  const [activeTab, setActiveTab] = useState<ProfileTabId>('nuggets');
  
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
  
  // Tab-Wechsel-Handler
  const handleTabPress = (tabId: ProfileTabId) => {
    setActiveTab(tabId);
  };
  
  // Zusätzliche Profilinformationen nur für Demo-Modus anzeigen
  const renderAdditionalInfo = () => {
    // Keine zusätzlichen Informationen anzeigen
    return null;
  };
  
  // Tab-Inhalte rendern basierend auf aktivem Tab
  const renderTabContent = () => {
    // Wenn nicht im Demo-Modus, zeigen wir keine Inhalte an
    if (!isDemoMode()) {
      return null;
    }
    
    switch (activeTab) {
      case 'nuggets':
        return (
          <View style={[styles.tabContentContainer, { marginTop: spacing.s }]}>
            <NuggetCard 
              nugget={DEMO_NUGGET}
              onHelpfulPress={() => Alert.alert('Hilfreich', 'Als hilfreich markiert')}
              onCommentPress={() => Alert.alert('Kommentar', 'Kommentarfunktion öffnen')}
              onSharePress={() => Alert.alert('Teilen', 'Teilen-Dialog öffnen')}
              onSavePress={() => Alert.alert('Speichern', 'Nugget gespeichert')}
              onUserPress={() => Alert.alert('Benutzer', 'Zum Benutzerprofil')}
            />
            <View style={{ height: spacing.m }} />
            <NuggetCard 
              nugget={DEMO_NUGGET_2}
              onHelpfulPress={() => Alert.alert('Hilfreich', 'Als hilfreich markiert')}
              onCommentPress={() => Alert.alert('Kommentar', 'Kommentarfunktion öffnen')}
              onSharePress={() => Alert.alert('Teilen', 'Teilen-Dialog öffnen')}
              onSavePress={() => Alert.alert('Speichern', 'Nugget gespeichert')}
              onUserPress={() => Alert.alert('Benutzer', 'Zum Benutzerprofil')}
            />
            <View style={{ height: spacing.m }} />
            <NuggetCard 
              nugget={DEMO_NUGGET_3}
              onHelpfulPress={() => Alert.alert('Hilfreich', 'Als hilfreich markiert')}
              onCommentPress={() => Alert.alert('Kommentar', 'Kommentarfunktion öffnen')}
              onSharePress={() => Alert.alert('Teilen', 'Teilen-Dialog öffnen')}
              onSavePress={() => Alert.alert('Speichern', 'Nugget gespeichert')}
              onUserPress={() => Alert.alert('Benutzer', 'Zum Benutzerprofil')}
            />
            <View style={{ height: spacing.m }} />
            <NuggetCard 
              nugget={DEMO_NUGGET_4}
              onHelpfulPress={() => Alert.alert('Hilfreich', 'Als hilfreich markiert')}
              onCommentPress={() => Alert.alert('Kommentar', 'Kommentarfunktion öffnen')}
              onSharePress={() => Alert.alert('Teilen', 'Teilen-Dialog öffnen')}
              onSavePress={() => Alert.alert('Speichern', 'Nugget gespeichert')}
              onUserPress={() => Alert.alert('Benutzer', 'Zum Benutzerprofil')}
            />
          </View>
        );
      default:
        return null;
    }
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
          
          {/* Tabs unter den Buttons */}
          <View style={styles.tabbarContainer}>
            <ProfileTabbar 
              activeTab={activeTab}
              onTabPress={handleTabPress}
            />
          </View>
          
          {/* Tab-Inhalte */}
          {renderTabContent()}
          
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
    paddingTop: spacing.xxxl + 20, // Extra Platz für das Profilbild
    paddingHorizontal: spacing.m, // Mittlerer horizontaler Abstand wie im Chat-Screen
  },
  userInfoContainer: {
    marginBottom: spacing.m,
    paddingHorizontal: 0, // Kein zusätzlicher Padding, da bereits im content definiert
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'],
    marginBottom: spacing.xs,
  },
  actionButtonsContainer: {
    marginTop: spacing.m,
    marginBottom: spacing.m,
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
  },
  tabbarContainer: {
    marginTop: spacing.l,
    marginBottom: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    paddingHorizontal: 0,
    marginHorizontal: -spacing.m, // Negativer Margin um den Header in voller Breite zu zeigen
  },
  tabbarOuterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  tabbarInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  tabItem: {
    padding: spacing.s,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: typography.fontWeight.medium as TextStyle['fontWeight'],
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    marginTop: spacing.xs,
  },
  tabContentContainer: {
    paddingHorizontal: 0, // Kein zusätzlicher Padding, da bereits im content definiert
    width: '100%',
  },
}); 