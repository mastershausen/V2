import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderMedia } from '@/shared-components/media/HeaderMedia';
import { ProfileImage } from '@/shared-components/media/ProfileImage';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { FooterActionButton } from '@/shared-components/navigation/FooterActionButton';
import { NuggetCardInteraction } from '@/shared-components/cards/nugget-card/components/NuggetCardInteraction';
import { GigActionBottomSheet } from '@/shared-components/bottomsheet/GigActionBottomSheet';
import { DateBadge, ReviewBadge } from '@/shared-components/badges';

// Demo-Daten von Alexander Becker
const DEMO_USER = {
  name: 'Alexander Becker',
  profileImage: null, // Wir nutzen Initialen
  description: 'Ich zeige Selbstständigen & Unternehmern, wie sie mit legaler Steueroptimierung 5-stellig sparen können – jedes Jahr.',
  headline: 'Steuern runter. Gewinn rauf.',
  rating: 5.0,
  ratingCount: 42
};

// Demo-Daten für den Gig
const DEMO_GIG = {
  // Kurzer Titel für die GigCard und HeaderNavigation
  cardTitle: 'Steuerberatung für Startups',
  // Ausführlicher Titel für den Details-Screen
  title: 'Steuerliche Rundumbetreuung für Startups & Gründer von der Planung bis zur ersten Bilanz',
  // Ausführliche und überzeugendere Beschreibung für den Details-Screen
  description: 'Als Gründer stehst du vor vielen Herausforderungen – die Steuern sollten nicht dein größtes Problem sein. Mit meiner speziell für Startups entwickelten Beratung helfe ich dir, von Anfang an alles richtig zu machen und gleichzeitig erheblich Steuern zu sparen.\n\n**Was dich erwartet:**\n\n• **Umfassende Erstberatung (90 Minuten)** – Wir analysieren deine individuellen Bedürfnisse und entwickeln eine maßgeschneiderte Strategie\n\n• **Rechtsformoptimierung** – Ich zeige dir, welche Unternehmensform steuerlich am günstigsten für dein Geschäftsmodell ist\n\n• **Investitions- und Förderberatung** – Erfahre, welche staatlichen Zuschüsse und Fördermittel du nutzen kannst\n\n• **Umsatzsteuer-Coaching** – Verstehe die wichtigsten Regeln und vermeide kostspielige Fehler\n\n• **Gewinnoptimierung** – Lerne legale Strategien zur Minimierung deiner Steuerlast kennen\n\n• **Digitale Buchhaltungseinrichtung** – Ich helfe dir, deine Finanzen von Anfang an digital und effizient zu organisieren\n\nMeine Kunden sparen durchschnittlich 40% ihrer Steuerlast im ersten Geschäftsjahr. Als ehemaliger Startup-Gründer kenne ich die Herausforderungen aus eigener Erfahrung und spreche deine Sprache – keine komplizierten Steuerfachbegriffe, sondern praxisnahe Lösungen.\n\nBuche jetzt dein Erstgespräch und starte mit einer soliden steuerlichen Grundlage in deine Selbstständigkeit.',
  price: '€299',
  publishedAt: '12. Mai 2023'
};

/**
 * Detailansicht für einen Gig
 * Zeigt detaillierte Informationen zu einem bestimmten Gig an
 */
export default function GigDetailsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { isDemoMode } = useMode();
  
  // State für Interaktionen
  const [isHelpful, setIsHelpful] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(isDemoMode() ? 42 : 0);
  const [commentCount, setCommentCount] = useState(isDemoMode() ? 7 : 0);
  
  // State für das Action Sheet
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  
  // Parameter aus der Navigation abrufen
  const params = useLocalSearchParams<{
    title?: string; // Optional, wird nicht mehr verwendet, nur für Rückwärtskompatibilität
    description?: string; // Optional, wird nicht mehr verwendet, nur für Rückwärtskompatibilität
    price?: string; // Optional, wird nicht mehr verwendet, nur für Rückwärtskompatibilität
    imageUrl: string;
    id: string;
    source?: string; // Quelle der Navigation (z.B. 'profile', 'search', 'tile')
    userImageUrl?: string; // Profilbild des Anbieters
    userName?: string; // Name des Anbieters
  }>();
  
  // Warnung ausgeben, falls alte Parameter verwendet werden
  useEffect(() => {
    if (params.title || params.description || params.price) {
      console.warn('GigDetailsScreen: Die Parameter "title", "description" und "price" werden nicht mehr verwendet. Diese werden jetzt direkt im GigDetailsScreen definiert.');
    }
  }, [params.title, params.description, params.price]);
  
  // Verwende immer die festen Gig-Daten
  const title = DEMO_GIG.title;
  const cardTitle = DEMO_GIG.cardTitle;
  const description = DEMO_GIG.description;
  const price = DEMO_GIG.price;
  
  // Weitere Parameter aus der Navigation
  const imageUrl = params.imageUrl || '';
  const id = params.id || '0';
  const source = params.source || '';
  
  // Verwende im Demo-Modus immer die Alexander Becker Daten
  const userName = useMemo(() => {
    return isDemoMode() ? DEMO_USER.name : (params.userName || 'Anbieter');
  }, [isDemoMode, params.userName]);
  
  const userImageUrl = useMemo(() => {
    return isDemoMode() ? null : (params.userImageUrl || '');
  }, [isDemoMode, params.userImageUrl]);
  
  // Handlers für Interaktionsbuttons
  const handleHelpfulPress = () => {
    setIsHelpful(!isHelpful);
    setHelpfulCount(prev => isHelpful ? prev - 1 : prev + 1);
  };
  
  const handleCommentPress = () => {
    // Hier könnte später eine Navigation zu Kommentaren erfolgen
    console.log('Kommentar-Funktion');
  };
  
  const handleSharePress = () => {
    // Hier könnte später eine Share-Funktion implementiert werden
    console.log('Share-Funktion');
  };
  
  const handleSavePress = () => {
    setIsSaved(!isSaved);
  };
  
  // Handler für den Buchen-Button
  const handleBookPress = () => {
    Alert.alert(
      'Gig buchen',
      `Möchtest du "${cardTitle}" für ${price} buchen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Buchen', onPress: () => console.log('Gig gebucht!') }
      ]
    );
  };
  
  // Handler für Aktionen
  const handleRatePress = () => {
    Alert.alert('Bewertung', 'Hier kannst du den Gig bewerten.');
  };
  
  const handleMessagePress = () => {
    Alert.alert('Anfrage', 'Hier kannst du eine Anfrage an den Anbieter senden.');
  };
  
  const handlePinPress = () => {
    Alert.alert('Premium-Funktion', 'Diese Funktion ist nur für Premium-Nutzer verfügbar. Möchtest du Premium aktivieren?');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Action Sheet für weitere Aktionen */}
      <GigActionBottomSheet 
        visible={isActionSheetVisible}
        onClose={() => setIsActionSheetVisible(false)}
        options={[
          {
            id: 'rate',
            label: 'Gig bewerten',
            icon: 'star-outline',
            color: '#FFB400',
            onPress: handleRatePress
          },
          {
            id: 'message',
            label: 'Anfrage senden',
            icon: 'chatbubble-outline',
            color: '#0A84FF',
            onPress: handleMessagePress
          },
          {
            id: 'pin',
            label: 'Fallstudie anpinnen',
            icon: 'folder-open-outline',
            isPremium: true,
            color: '#5E5CE6',
            onPress: handlePinPress
          }
        ]}
      />
      
      {/* Header Navigation */}
      <HeaderNavigation 
        title={cardTitle}
        onBackPress={() => {
          // Intelligente Zurück-Navigation basierend auf der Quelle
          if (source === 'profile') {
            router.push('/(tabs)/profile');
          } else if (source === 'search') {
            router.push('/search-results');
          } else if (source === 'tile') {
            router.push('/mysolvbox/tile-results');
          } else {
            // Fallback: zurück zum letzten Screen in der Historie
            router.back();
          }
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Header Media (ohne Bild, nur mit Farbhintergrund) */}
        <HeaderMedia 
          imageUrl={null}
          borderRadius={0}
        />
        
        <View style={styles.content}>
          {/* Profilbereich mit Name und Bewertung */}
          <View style={styles.profileContainer}>
            <View style={styles.profileMainSection}>
              {/* Zeile für Name und Bewertung */}
              <View style={styles.profileNameRow}>
                {/* Profilbild und Name links */}
                <View style={styles.profileLeftSection}>
                  <ProfileImage
                    source={userImageUrl ? { uri: userImageUrl } : null}
                    fallbackText={userName}
                    size={40}
                    variant="circle"
                    isRealMode={!isDemoMode()}
                    style={styles.profileImage}
                  />
                  
                  {/* Name des Anbieters */}
                  <Text style={[styles.userName, { color: colors.textPrimary }]}>
                    {userName}
                  </Text>
                </View>
                
                {/* Bewertung rechts neben dem Namen */}
                <View style={styles.ratingContainer}>
                  <Text style={[styles.ratingCountText, { color: colors.textSecondary }]}>
                  <ReviewBadge
                    rating={DEMO_USER.rating}
                    ratingCount={DEMO_USER.ratingCount}
                  />
                </View>
              </View>
              
              {/* Zweite Zeile: Preisbadge rechts ausgerichtet */}
              <View style={styles.priceBadgeRow}>
                <View style={{flex: 1}} />
                <View style={[styles.priceContainer, { 
                  backgroundColor: colors.backgroundSecondary, 
                  borderWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.05)',
                }]}>
                  <Text style={[styles.price, { color: colors.textPrimary }]}>
                    {price}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Interaktionsleiste in voller Breite */}
          <View style={styles.interactionContainer}>
            <NuggetCardInteraction
              helpfulCount={helpfulCount}
              commentCount={commentCount}
              isHelpful={isHelpful}
              isSaved={isSaved}
              onHelpfulPress={handleHelpfulPress}
              onCommentPress={handleCommentPress}
              onSharePress={handleSharePress}
              onSavePress={handleSavePress}
              hideCommentButton={true}
            />
          </View>
          
          {/* Titel (jetzt unter der Interaktionsleiste) */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          
          {/* Beschreibung */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {description}
          </Text>
          
          {/* Trennlinie und Veröffentlichungsdatum */}
          <View style={[styles.footerDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.footerContainer}>
            <DateBadge
              date={DEMO_GIG.publishedAt}
              prefix="Veröffentlicht am"
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Footer mit drei Buttons */}
      <View style={[styles.footer, { borderTopColor: colors.divider, backgroundColor: colors.backgroundPrimary }]}>
        {/* Gig bewerten */}
        <TouchableOpacity
          style={styles.actionIconButton}
          onPress={handleRatePress}
          accessibilityLabel="Gig bewerten"
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 180, 0, 0.15)' }]}>
            <Ionicons name="star-outline" size={22} color="#FFB400" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Bewerten</Text>
        </TouchableOpacity>
        
        {/* Anfrage senden */}
        <TouchableOpacity
          style={styles.actionIconButton}
          onPress={handleMessagePress}
          accessibilityLabel="Anfrage senden"
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(10, 132, 255, 0.15)' }]}>
            <Ionicons name="chatbubble-outline" size={22} color="#0A84FF" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Anfragen</Text>
        </TouchableOpacity>
        
        {/* Fallstudie */}
        <TouchableOpacity
          style={styles.actionIconButton}
          onPress={handlePinPress}
          accessibilityLabel="Fallstudie anzeigen"
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(94, 92, 230, 0.15)' }]}>
            <Ionicons name="document-text-outline" size={22} color="#5E5CE6" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Fallstudie</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: spacing.m,
    paddingTop: 12, // Reduzierter Abstand für mehr Nähe zum Header
  },
  profileContainer: {
    marginBottom: spacing.m,
    marginTop: spacing.s,
  },
  profileMainSection: {
    width: '100%',
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  priceBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.s,
  },
  profileLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    borderWidth: 0,
  },
  userName: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.s,
  },
  priceContainer: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: ui.borderRadius.m,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
  },
  price: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.bold,
  },
  ratingIcon: {
    marginLeft: spacing.xxs,
    marginRight: spacing.xxs,
  },
  ratingCountText: {
    fontSize: typography.fontSize.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.s,
  },
  interactionContainer: {
    marginHorizontal: -spacing.m, // Negatives Margin um über die Elternränder hinauszugehen
    marginBottom: spacing.m,
  },
  description: {
    fontSize: typography.fontSize.m,
    lineHeight: typography.lineHeight.l,
    marginBottom: spacing.l,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.s,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: spacing.xs,
  },
  actionIconButton: {
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    flex: 1,
  },
  actionButtonLabel: {
    fontSize: typography.fontSize.s,
    fontWeight: '500',
  },
  footerDivider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    marginBottom: spacing.m,
  },
  footerContainer: {
    marginBottom: spacing.xl,
  },
}); 