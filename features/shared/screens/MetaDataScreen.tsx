import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCreateForm } from '@/features/shared/contexts/CreateFormContext';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * MetaDataScreen
 * 
 * Gemeinsamer Screen für zusätzliche Metadaten sowohl für Gigs als auch für Fallstudien.
 * Wird über getrennte Routen in verschiedenen Stacks angesteuert.
 */
export default function MetaDataScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { formData, goBackToDetailsScreen } = useCreateForm();
  
  // Handler für Erstellen-Button
  const handleCreatePress = () => {
    // Hier könnte später die tatsächliche Erstellung des Inhalts stattfinden
    
    // Erfolgsmeldung und Navigation zur Startseite
    Alert.alert(
      `${formData.type === 'gig' ? 'Gig' : 'Fallstudie'} erfolgreich erstellt`,
      `Dein ${formData.type === 'gig' ? 'Gig' : 'Deine Fallstudie'} wurde erfolgreich erstellt!`,
      [{ text: 'OK', onPress: () => router.push('/(tabs)/home') }]
    );
  };

  // Erstellungs-Button für die Header-Navigation
  const renderCreateButton = () => (
    <TouchableOpacity 
      style={styles.createButton}
      onPress={handleCreatePress}
    >
      <Text style={[styles.createButtonText, { color: colors.primary }]}>
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
      
      {/* HeaderNavigation-Komponente */}
      <HeaderNavigation
        title={formData.type === 'gig' ? 'Gig-Metadaten' : 'Fallstudien-Metadaten'}
        showBackButton={true}
        onBackPress={goBackToDetailsScreen}
        rightContent={renderCreateButton()}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {formData.type === 'gig' ? 'Gig-Metadaten' : 'Fallstudien-Metadaten'} hinzufügen
          </Text>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Hier kannst du weitere Informationen zu {formData.type === 'gig' ? 'deinem Gig' : 'deiner Fallstudie'} hinzufügen, 
            um {formData.type === 'gig' ? 'ihn' : 'sie'} besser auffindbar zu machen.
          </Text>
          
          {/* Platzhalter für künftige Metadaten-Eingabefelder */}
          <View style={styles.metadataContainer}>
            {/* Hier werden später die Metadaten-Eingabefelder eingefügt */}
            <View style={[styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
                {formData.type === 'gig' ? 'Gig-Metadaten-Eingabefelder' : 'Fallstudien-Metadaten-Eingabefelder'} werden hier angezeigt
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
  createButton: {
    padding: spacing.xs,
  },
  createButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.s,
  },
  description: {
    fontSize: typography.fontSize.m,
    marginBottom: spacing.l,
  },
  metadataContainer: {
    marginVertical: spacing.m,
  },
  placeholderContainer: {
    padding: spacing.l,
    borderRadius: ui.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  placeholderText: {
    textAlign: 'center',
  },
}); 