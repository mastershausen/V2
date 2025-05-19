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
import { GigCard } from '@/shared-components/cards/gig-card/GigCard';
import { GigData } from '@/shared-components/cards/gig-card/GigCard';
import { BaseTabbar, BaseTabConfig } from '@/shared-components/navigation/BaseTabbar';
import { ProfileImage, UserroleBadge, UserRole, HeaderMedia } from '@/shared-components/media';
import { useUserStore } from '@/stores';
import { UserProfile } from '@/types/userTypes';
import { createProfileInitialsFromName, ProfileImageData } from '@/utils/profileImageUtils';
import { ProfileTabListContainer } from '@/shared-components/ProfileTabListContainer';
import mockNuggets from '@/mock/data/mockNuggets';
import mockGigs from '@/mock/data/mockGigs';
import mockCasestudies from '@/mock/data/mockCasestudies';
import { ReviewCard } from '@/shared-components/cards/review-card/ReviewCard';
import mockReviews from '@/mock/data/mockReviews';

// Typ für Profile-Tabs
type ProfileTabId = 'nuggets' | 'gigs' | 'casestudies' | 'ratings';

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

// Demo-Nugget für den Demo-Modus
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

// Demo-Gigs für den Demo-Modus
const DEMO_GIGS: GigData[] = [
  {
    id: 'g1',
    title: 'Steuerberatung für Startups',
    description: 'Professionelle Steuerberatung speziell für junge Unternehmen. Von der Gründung bis zur ersten Bilanz - ich begleite dich durch alle steuerlichen Herausforderungen.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 299,
    rating: 4.9,
    currency: '€'
  },
  {
    id: 'g2',
    title: 'Steueroptimierung für Freiberufler',
    description: 'Maximiere deine Steuervorteile als Freiberufler. Ich zeige dir, wie du deine Abgaben legal minimierst und mehr vom verdienten Geld behältst.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 4.8,
    currency: 'Kostenlos'
  },
  {
    id: 'g3',
    title: 'Bilanzanalyse & Optimierung',
    description: 'Detaillierte Analyse deiner aktuellen Bilanz mit konkreten Optimierungsvorschlägen. Identifiziere versteckte Potenziale und spare bares Geld.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 399,
    rating: 5.0,
    currency: '€'
  },
  {
    id: 'g4',
    title: 'Erstgespräch für Gründer',
    description: 'Unverbindliches Kennenlernen und erste steuerliche Einschätzung für Gründer. Stelle deine Fragen und erhalte eine erste Orientierung.',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 4.7,
    currency: 'Kostenlos'
  },
  {
    id: 'g5',
    title: 'Jahresabschluss-Check',
    description: 'Lass deinen Jahresabschluss von einem Profi prüfen. Ich gebe dir Feedback und Hinweise auf Optimierungsmöglichkeiten.',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 4.6,
    currency: 'Auf Anfrage'
  },
  {
    id: 'g6',
    title: 'Steuerliche Kurzberatung',
    description: 'Du hast eine konkrete Frage? In der Kurzberatung bekommst du schnell und unkompliziert eine professionelle Antwort.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 4.5,
    currency: 'Kostenlos'
  },
];

// Mock-Fallstudien für den Demo-Modus
const DEMO_CASESTUDIES: GigData[] = [
  {
    id: 'c1',
    title: 'Steuerliche Optimierung eines Startups',
    description: 'Wie ein Tech-Startup durch gezielte Maßnahmen seine Steuerlast um 30% senken konnte. Einblicke in Strategie und Umsetzung.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 4.9,
    currency: ''
  },
  {
    id: 'c2',
    title: 'Erfolgreiche Betriebsprüfung',
    description: 'Fallstudie: Wie ein Freiberufler mit guter Vorbereitung und Beratung eine Betriebsprüfung ohne Nachzahlung gemeistert hat.',
    imageUrl: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 4.8,
    currency: ''
  },
  {
    id: 'c3',
    title: 'Gründerberatung: Von der Idee zur GmbH',
    description: 'Ein Gründer berichtet, wie die richtige steuerliche Begleitung den Weg zur eigenen GmbH erleichtert und Fehler vermieden hat.',
    imageUrl: 'https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 5.0,
    currency: ''
  },
];

// Mock-Bewertungen für den Demo-Modus
const DEMO_RATINGS = [
  {
    id: 'r1',
    user: { name: 'Katrin Müller', profileImage: { initials: 'KM' } },
    rating: 5,
    text: 'Sehr kompetente Beratung, schnelle Rückmeldung und viele Steuertipps!'
  },
  {
    id: 'r2',
    user: { name: 'Jonas Weber', profileImage: { initials: 'JW' } },
    rating: 4.5,
    text: 'Freundlich, zuverlässig und sehr hilfreich bei der Steuererklärung.'
  },
  {
    id: 'r3',
    user: { name: 'Sophie Becker', profileImage: { initials: 'SB' } },
    rating: 5,
    text: 'Top Steuerberater! Ich konnte viel sparen und fühle mich bestens betreut.'
  },
];

// Bildschirmbreite für responsives Design
const SCREEN_WIDTH = Dimensions.get('window').width;

// Added type definition
type ProfileImageSource = ProfileImageData | { uri: string } | null;

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
  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId as ProfileTabId);
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
          <ProfileTabListContainer>
            {mockNuggets.map((nugget) => (
              <NuggetCard
                key={nugget.id}
                nugget={nugget}
                onHelpfulPress={() => Alert.alert('Hilfreich', 'Als hilfreich markiert')}
                onCommentPress={() => Alert.alert('Kommentar', 'Kommentarfunktion öffnen')}
                onSharePress={() => Alert.alert('Teilen', 'Teilen-Dialog öffnen')}
                onSavePress={() => Alert.alert('Speichern', 'Nugget gespeichert')}
                onUserPress={() => Alert.alert('Benutzer', 'Zum Benutzerprofil')}
              />
            ))}
          </ProfileTabListContainer>
        );
      case 'gigs':
        return (
          <ProfileTabListContainer>
            {mockGigs.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onPress={() => Alert.alert('Gig', 'Gig-Details öffnen')}
              />
            ))}
          </ProfileTabListContainer>
        );
      case 'casestudies':
        return (
          <ProfileTabListContainer>
            {mockCasestudies.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                showPrice={false}
                onPress={() => Alert.alert('Fallstudie', 'Fallstudien-Details werden angezeigt')}
              />
            ))}
          </ProfileTabListContainer>
        );
      case 'ratings':
        return (
          <ProfileTabListContainer>
            {mockReviews.map((r, idx) => (
              <ReviewCard
                key={r.id}
                name={r.user.name}
                initials={r.user.profileImage.initials}
                imageUrl={r.user.profileImage.imageUrl}
                rating={r.rating}
                text={r.text}
                date={idx === 0 ? 'vor 2 Wochen' : idx === 1 ? 'vor 3 Tagen' : 'vor 1 Monat'}
              />
            ))}
          </ProfileTabListContainer>
        );
      default:
        return null;
    }
  };
  
  // Tabs für das Profil
  const profileTabs: BaseTabConfig[] = [
    { id: 'nuggets', label: 'Nuggets' },
    { id: 'gigs', label: 'Gigs' },
    { id: 'casestudies', label: 'Fallstudien' },
    { id: 'ratings', label: 'Bewertungen' }
  ];
  
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
        
        {/* EINHEITLICHER SafeSpace-Container für alle Inhalte */}
        <View style={styles.safeSpaceContent}>
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
        </View>
        
        {/* Tabs außerhalb des SafeSpace-Containers für Full Width */}
        <View style={styles.tabbarContainer}>
          <BaseTabbar
            tabs={profileTabs}
            activeTab={activeTab}
            onTabPress={handleTabPress}
            indicatorStyle="line"
            showShadow={false}
            tabContainerStyle={{ width: '100%', justifyContent: 'center', backgroundColor: '#fff' }}
            tabItemStyle={{ alignItems: 'center', paddingHorizontal: 8 }}
            tabLabelStyle={{ fontSize: 14, fontWeight: '500' }}
          />
        </View>
        
        {/* Tab-Inhalte wieder im SafeSpace-Container */}
        <View style={[styles.safeSpaceContent, { marginTop: 20 }]}>
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
    bottom: -50,
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
  safeSpaceContent: {
    paddingHorizontal: 16,
    width: '100%',
  },
  content: {
    flex: 1,
    paddingTop: spacing.xxxl + 20,
  },
  userInfoContainer: {
    marginBottom: spacing.m,
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
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
}); 