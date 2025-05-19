import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Zweiter Schritt bei der Fallstudien-Erstellung
 * Zeigt Details und ermöglicht die finale Erstellung
 */
export default function CreateCasestudyDetailsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Parameter aus dem vorherigen Screen abrufen
  const params = useLocalSearchParams<{
    title: string;
    description: string;
    imageUrl: string;
  }>();
  
  // Daten aus den Parametern sichern (mit Fallbacks)
  const title = params.title || '';
  const description = params.description || '';
  const imageUrl = params.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

  // Fallstudie erstellen
  const createCaseStudy = () => {
    // Hier würde die tatsächliche Fallstudie-Erstellung erfolgen
    const caseStudyData = {
      title,
      description,
      imageUrl,
      rating: 5.0,
    };
    
    // Erfolgs-Nachricht und zurück zum Profile-Screen navigieren
    Alert.alert(
      'Fallstudie erstellt',
      'Deine Fallstudie wurde erfolgreich erstellt.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/profile') }]
    );
  };

  // Erstellen-Button für HeaderNavigation
  const renderErstellenButton = () => (
    <TouchableOpacity onPress={createCaseStudy}>
      <Text 
        style={[
          styles.createButtonText, 
          { color: colors.primary }
        ]}
      >
        Erstellen
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <HeaderNavigation 
        title="Fallstudie erstellen" 
        rightContent={renderErstellenButton()}
        onBackPress={() => router.back()}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Vorschau der Fallstudie */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Vorschau deiner Fallstudie
          </Text>
          
          <View style={[styles.previewCard, { backgroundColor: colors.backgroundSecondary }]}>
            {/* Bild */}
            {imageUrl && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
            
            {/* Titel */}
            <Text style={[styles.previewTitle, { color: colors.textPrimary }]}>
              {title || "Wert"}
            </Text>
            
            {/* Beschreibung */}
            <Text style={[styles.previewDescription, { color: colors.textSecondary }]}>
              {description || "wertwert"}
            </Text>
          </View>
          
          {/* Erklärung */}
          <View style={styles.infoBox}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Deine Fallstudie wird nach der Erstellung in deinem Profil angezeigt und kann von anderen Nutzern gefunden werden.
            </Text>
          </View>
          
          {/* Erstellen-Button im Content */}
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={createCaseStudy}
          >
            <Text style={[styles.createButtonLabel, { color: '#FFFFFF' }]}>
              Fallstudie erstellen
            </Text>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginVertical: spacing.m,
  },
  previewCard: {
    borderRadius: ui.borderRadius.m,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.l,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  previewTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    padding: spacing.m,
    paddingBottom: spacing.xs,
  },
  previewDescription: {
    fontSize: typography.fontSize.m,
    lineHeight: typography.lineHeight.m,
    padding: spacing.m,
    paddingTop: 0,
  },
  infoBox: {
    padding: spacing.m,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: ui.borderRadius.m,
    marginBottom: spacing.l,
  },
  infoText: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    textAlign: 'center',
  },
  createButton: {
    paddingVertical: spacing.m,
    borderRadius: ui.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.m,
  },
  createButtonLabel: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
