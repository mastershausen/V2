import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderMedia } from '@/shared-components/media/HeaderMedia';
import { ProfileImage } from '@/shared-components/media/ProfileImage';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { NuggetCardInteraction } from '@/shared-components/cards/nugget-card/components/NuggetCardInteraction';

// Demo-Daten von Alexander Becker
const DEMO_USER = {
  name: 'Alexander Becker',
  profileImage: null, // Wir nutzen Initialen
  description: 'Ich zeige Selbstständigen & Unternehmern, wie sie mit legaler Steueroptimierung 5-stellig sparen können – jedes Jahr.',
  headline: 'Steuern runter. Gewinn rauf.'
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
  
  // Parameter aus der Navigation abrufen
  const params = useLocalSearchParams<{
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    id: string;
    source?: string; // Quelle der Navigation (z.B. 'profile', 'search', 'tile')
    userImageUrl?: string; // Profilbild des Anbieters
    userName?: string; // Name des Anbieters
  }>();
  
  // Daten aus den Parametern oder Demo-Daten verwenden
  const title = params.title || 'Gig Titel';
  const description = params.description || 'Keine Beschreibung verfügbar';
  const imageUrl = params.imageUrl || '';
  const price = params.price || '€0';
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header Navigation */}
      <HeaderNavigation 
        title={title}
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
      
      <View style={styles.headerContainer}>
        {/* Header Media (ohne Bild, nur mit Farbhintergrund) */}
        <HeaderMedia 
          imageUrl={null}
          borderRadius={0}
        />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profilbild - jetzt noch kleiner und näher am Header */}
          <View style={styles.profileContainer}>
            <ProfileImage
              source={userImageUrl ? { uri: userImageUrl } : null}
              fallbackText={userName}
              size={50}
              variant="circle"
              isRealMode={!isDemoMode()}
              style={styles.profileImage}
            />
            
            {/* Name des Anbieters direkt neben dem Profilbild */}
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {userName}
            </Text>
          </View>
          
          {/* Preis */}
          <View style={[styles.priceContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.price, { color: colors.textPrimary }]}>
              {price}
            </Text>
          </View>
          
          {/* Titel (als Backup, falls er nicht in der Header-Navigation angezeigt wird) */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          
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
            />
          </View>
          
          {/* Beschreibung */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {description}
          </Text>
          
          {/* Weitere Details können hier hinzugefügt werden */}
          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Details
            </Text>
            
            <View style={[styles.detailCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                Hier können weitere Details zum Gig angezeigt werden, wie zum Beispiel Kategorien, 
                Bewertungen, Kontaktinformationen oder andere relevante Informationen.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    marginTop: 0, // Kein zusätzlicher Abstand nach oben
  },
  profileImage: {
    borderWidth: 0,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.s,
  },
  priceContainer: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    borderRadius: ui.borderRadius.m,
    marginVertical: spacing.m,
  },
  price: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
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
    lineHeight: typography.lineHeight.m,
    marginBottom: spacing.l,
  },
  detailsSection: {
    marginTop: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.m,
  },
  detailCard: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    marginBottom: spacing.m,
  },
  detailText: {
    fontSize: typography.fontSize.m,
    lineHeight: typography.lineHeight.m,
  },
}); 