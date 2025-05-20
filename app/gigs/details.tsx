import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo, useEffect } from 'react';
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

// Demo-Daten für den Gig
const DEMO_GIG = {
  // Kurzer Titel für die GigCard und HeaderNavigation
  cardTitle: 'Steuerberatung für Startups',
  // Ausführlicher Titel für den Details-Screen
  title: 'Steuerliche Rundumbetreuung für Startups & Gründer von der Planung bis zur ersten Bilanz',
  // Ausführliche und überzeugendere Beschreibung für den Details-Screen
  description: 'Als Gründer stehst du vor vielen Herausforderungen – die Steuern sollten nicht dein größtes Problem sein. Mit meiner speziell für Startups entwickelten Beratung helfe ich dir, von Anfang an alles richtig zu machen und gleichzeitig erheblich Steuern zu sparen.\n\n**Was dich erwartet:**\n\n• **Umfassende Erstberatung (90 Minuten)** – Wir analysieren deine individuellen Bedürfnisse und entwickeln eine maßgeschneiderte Strategie\n\n• **Rechtsformoptimierung** – Ich zeige dir, welche Unternehmensform steuerlich am günstigsten für dein Geschäftsmodell ist\n\n• **Investitions- und Förderberatung** – Erfahre, welche staatlichen Zuschüsse und Fördermittel du nutzen kannst\n\n• **Umsatzsteuer-Coaching** – Verstehe die wichtigsten Regeln und vermeide kostspielige Fehler\n\n• **Gewinnoptimierung** – Lerne legale Strategien zur Minimierung deiner Steuerlast kennen\n\n• **Digitale Buchhaltungseinrichtung** – Ich helfe dir, deine Finanzen von Anfang an digital und effizient zu organisieren\n\nMeine Kunden sparen durchschnittlich 40% ihrer Steuerlast im ersten Geschäftsjahr. Als ehemaliger Startup-Gründer kenne ich die Herausforderungen aus eigener Erfahrung und spreche deine Sprache – keine komplizierten Steuerfachbegriffe, sondern praxisnahe Lösungen.\n\nBuche jetzt dein Erstgespräch und starte mit einer soliden steuerlichen Grundlage in deine Selbstständigkeit.',
  price: '€299'
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
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
    lineHeight: typography.lineHeight.l,
    marginBottom: spacing.l,
  },
}); 