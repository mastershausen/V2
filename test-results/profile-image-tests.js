/**
 * ProfileImage - Komponentenüberprüfung
 * 
 * Dieses Skript ist ein einfacher Testbereich, der zur manuellen Überprüfung
 * der ProfileImage-Komponente dient. Es zeigt verschiedene Konfigurationen an.
 * 
 * Verwendung:
 * 1. Kopiere diesen Code in eine temporäre Komponente
 * 2. Importiere diese Komponente in einem App-Screen
 * 3. Überprüfe visuell die Darstellung unter verschiedenen Bedingungen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Switch } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage } from '@/shared-components/media';
import { createProfileInitials } from '@/utils/profileImageUtils';

export function ProfileImageTests() {
  const colors = useThemeColor();
  const [isLoading, setIsLoading] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  
  // Beispiel-Bilder für Tests
  const validImageUrl = 'https://picsum.photos/200';
  const invalidImageUrl = 'https://invalid-url-for-testing.com/image.jpg';
  
  // Test für onPress
  const handlePress = () => {
    alert('ProfileImage wurde angeklickt!');
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        ProfileImage Komponenten-Tests
      </Text>
      
      <View style={styles.controls}>
        <View style={styles.controlItem}>
          <Text>Loading-Zustand:</Text>
          <Switch value={isLoading} onValueChange={setIsLoading} />
        </View>
        <View style={styles.controlItem}>
          <Text>Badge anzeigen:</Text>
          <Switch value={showBadge} onValueChange={setShowBadge} />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Grundlegende Darstellung</Text>
        
        <View style={styles.testRow}>
          <View style={styles.testItem}>
            <Text style={styles.label}>Nur Initialen:</Text>
            <ProfileImage 
              fallbackText="Max Mustermann" 
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Mit Bild:</Text>
            <ProfileImage 
              fallbackText="Max Mustermann" 
              imageUrl={validImageUrl}
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Ungültiges Bild:</Text>
            <ProfileImage 
              fallbackText="Max Mustermann" 
              imageUrl={invalidImageUrl}
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Größen-Varianten</Text>
        
        <View style={styles.testRow}>
          <View style={styles.testItem}>
            <Text style={styles.label}>XSmall:</Text>
            <ProfileImage 
              fallbackText="AB" 
              size="xsmall"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Small:</Text>
            <ProfileImage 
              fallbackText="AB" 
              size="small"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Medium:</Text>
            <ProfileImage 
              fallbackText="AB" 
              size="medium"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Large:</Text>
            <ProfileImage 
              fallbackText="AB" 
              size="large"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>XLarge:</Text>
            <ProfileImage 
              fallbackText="AB" 
              size="xlarge"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Custom (50):</Text>
            <ProfileImage 
              fallbackText="AB" 
              size={50}
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Formvarianten</Text>
        
        <View style={styles.testRow}>
          <View style={styles.testItem}>
            <Text style={styles.label}>Circle:</Text>
            <ProfileImage 
              fallbackText="AB" 
              size="large"
              variant="circle"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Rounded:</Text>
            <ProfileImage 
              fallbackText="AB" 
              size="large"
              variant="rounded"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Square:</Text>
            <ProfileImage 
              fallbackText="AB" 
              size="large"
              variant="square"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Interaktivität</Text>
        
        <View style={styles.testRow}>
          <View style={styles.testItem}>
            <Text style={styles.label}>Klickbar:</Text>
            <ProfileImage 
              fallbackText="AB"
              size="large" 
              onPress={handlePress}
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>Mit Bild + Klickbar:</Text>
            <ProfileImage 
              fallbackText="AB"
              imageUrl={validImageUrl}
              size="large" 
              onPress={handlePress}
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. ProfileData-Objekt</Text>
        
        <View style={styles.testRow}>
          <View style={styles.testItem}>
            <Text style={styles.label}>profileData-Objekt:</Text>
            <ProfileImage 
              profileData={createProfileInitials('AB')}
              size="large"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
          
          <View style={styles.testItem}>
            <Text style={styles.label}>profileData mit Bild:</Text>
            <ProfileImage 
              profileData={{
                initials: 'AB',
                imageUrl: validImageUrl
              }}
              size="large"
              isLoading={isLoading}
              showBadge={showBadge}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.l,
    padding: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  controlItem: {
    alignItems: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.m,
  },
  testRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  testItem: {
    alignItems: 'center',
    marginRight: spacing.l,
    marginBottom: spacing.l,
    minWidth: 100,
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: typography.fontSize.s,
  },
}); 