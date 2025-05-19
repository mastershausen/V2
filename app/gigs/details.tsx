import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderMedia } from '@/shared-components/media/HeaderMedia';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Detailansicht für einen Gig
 * Zeigt detaillierte Informationen zu einem bestimmten Gig an
 */
export default function GigDetailsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Parameter aus der Navigation abrufen
  const params = useLocalSearchParams<{
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    id: string;
    source?: string; // Quelle der Navigation (z.B. 'profile', 'search', 'tile')
  }>();
  
  // Daten aus den Parametern sichern (mit Fallbacks)
  const title = params.title || 'Gig Titel';
  const description = params.description || 'Keine Beschreibung verfügbar';
  const imageUrl = params.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';
  const price = params.price || '€0';
  const id = params.id || '0';
  const source = params.source || '';

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
      
      {/* Header Media (Titelbild) */}
      <HeaderMedia 
        imageUrl={imageUrl}
        borderRadius={0}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.m,
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