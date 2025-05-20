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

// Demo-Daten für die Fallstudie
const DEMO_CASESTUDY = {
  // Kurzer Titel für die Card und HeaderNavigation
  cardTitle: 'Steueroptimierung für Startup',
  // Ausführlicher Titel für den Details-Screen
  title: 'Wie ein Tech-Startup durch strategische Steuerplanung 78.000€ im ersten Jahr einsparte',
  // Ausführliche und überzeugendere Beschreibung für den Details-Screen
  description: 'Ein Münchner SaaS-Startup stand vor der Herausforderung, seine Steuerlast zu optimieren, ohne dabei Compliance-Risiken einzugehen. Die Gründer hatten bereits eine Seed-Finanzierung von 1,2 Mio. Euro erhalten und wollten ihre Ressourcen optimal einsetzen.\n\n**Ausgangssituation:**\n\n• Rapid-Growth-Phase mit schnell steigenden Umsätzen\n• Internationale Kunden in der EU und USA\n• Gemischtes Team aus Angestellten und Freelancern\n• Geplante Expansion nach Österreich und in die Schweiz\n\n**Lösungsansatz:**\n\nNach einer gründlichen Analyse ihrer Geschäftsprozesse und Finanzen entwickelte ich eine mehrstufige Strategie:\n\n1. **Optimierung der Unternehmensstruktur** – Einrichtung einer Holding-Struktur mit strategischen Tochtergesellschaften zur Risikominimierung und Steueroptimierung\n\n2. **IP-Box-Regelung** – Implementierung einer IP-Strategie zur Nutzung von Steuervergünstigungen für Forschung & Entwicklung\n\n3. **Internationales Steuermanagement** – Anpassung der Vertragsstrukturen für Auslandskunden zur Vermeidung von Doppelbesteuerung\n\n4. **Mitarbeiteroptionen** – Konzeption eines steueroptimalen Mitarbeiterbeteiligungsprogramms\n\n**Ergebnisse:**\n\n• Reduzierung der effektiven Steuerlast um 37% im ersten Jahr (Einsparung: 78.000€)\n• Aufbau einer skalierbaren Steuerstruktur für internationales Wachstum\n• Minimierung von Compliance-Risiken durch klare Dokumentation und Prozesse\n• Zusätzliche Liquidität für wichtige Investitionen in Produktentwicklung\n\nDas Startup konnte mit der eingesparten Steuerlast zwei zusätzliche Entwickler einstellen und seine Markteinführungszeit um 4 Monate verkürzen.',
  publishedAt: '18. Juli 2023'
};

/**
 * Detailansicht für eine Fallstudie
 * Zeigt detaillierte Informationen zu einer bestimmten Fallstudie an
 */
export default function CasestudyDetailsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { isDemoMode } = useMode();
  
  // State für Interaktionen
  const [isHelpful, setIsHelpful] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(isDemoMode() ? 38 : 0);
  const [commentCount, setCommentCount] = useState(isDemoMode() ? 5 : 0);
  
  // State für das Action Sheet
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  
  // Parameter aus der Navigation abrufen
  const params = useLocalSearchParams<{
    title?: string; // Optional, wird nicht mehr verwendet, nur für Rückwärtskompatibilität
    description?: string; // Optional, wird nicht mehr verwendet, nur für Rückwärtskompatibilität
    imageUrl: string;
    id: string;
    source?: string; // Quelle der Navigation (z.B. 'profile', 'search', 'tile')
    userImageUrl?: string; // Profilbild des Anbieters
    userName?: string; // Name des Anbieters
  }>();
  
  // Warnung ausgeben, falls alte Parameter verwendet werden
  useEffect(() => {
    if (params.title || params.description) {
      console.warn('CasestudyDetailsScreen: Die Parameter "title" und "description" werden nicht mehr verwendet. Diese werden jetzt direkt im CasestudyDetailsScreen definiert.');
    }
  }, [params.title, params.description]);
  
  // Verwende immer die festen Fallstudien-Daten
  const title = DEMO_CASESTUDY.title;
  const cardTitle = DEMO_CASESTUDY.cardTitle;
  const description = DEMO_CASESTUDY.description;
  
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
  
  // Handler für Aktionen
  const handleRatePress = () => {
    Alert.alert('Bewertung', 'Hier kannst du die Fallstudie bewerten.');
  };
  
  const handleMessagePress = () => {
    Alert.alert('Anfrage', 'Hier kannst du eine Anfrage an den Anbieter senden.');
  };
  
  const handleGigPress = () => {
    Alert.alert('Gig ansehen', 'Hier kannst du den zugehörigen Gig ansehen.');
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
            label: 'Fallstudie bewerten',
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
            id: 'gig',
            label: 'Gig ansehen',
            icon: 'briefcase-outline',
            color: '#5E5CE6',
            onPress: handleGigPress
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
                  <ReviewBadge
                    rating={DEMO_USER.rating}
                    ratingCount={DEMO_USER.ratingCount}
                  />
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
              date={DEMO_CASESTUDY.publishedAt}
              prefix="Veröffentlicht am"
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Footer mit drei Buttons */}
      <View style={[styles.footer, { borderTopColor: colors.divider, backgroundColor: colors.backgroundPrimary }]}>
        {/* Fallstudie bewerten */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel="Fallstudie bewerten"
          onPress={handleRatePress}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 180, 0, 0.15)' }]}>
            <Ionicons name="star-outline" size={22} color="#FFB400" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Bewerten</Text>
        </TouchableOpacity>
        
        {/* Anfrage senden */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel="Anfrage senden"
          onPress={handleMessagePress}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(10, 132, 255, 0.15)' }]}>
            <Ionicons name="chatbubble-outline" size={22} color="#0A84FF" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Anfragen</Text>
        </TouchableOpacity>
        
        {/* Gig */}
        <TouchableOpacity
          style={styles.actionIconButton}
          accessibilityLabel="Gig anzeigen"
          onPress={handleGigPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(94, 92, 230, 0.15)' }]}>
            <Ionicons name="briefcase-outline" size={22} color="#5E5CE6" />
          </View>
          <Text style={[styles.actionButtonLabel, { color: colors.textSecondary }]}>Gig</Text>
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
  },
  profileContainer: {
    marginBottom: spacing.m,
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
    marginTop: spacing.xs,
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
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.s,
  },
  description: {
    fontSize: typography.fontSize.m,
    lineHeight: typography.lineHeight.l,
    marginBottom: spacing.l,
  },
  interactionContainer: {
    marginHorizontal: -spacing.m, // Negatives Margin um über die Elternränder hinauszugehen
    marginBottom: spacing.m,
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