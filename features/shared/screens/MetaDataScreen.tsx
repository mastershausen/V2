import { useRouter } from 'expo-router';
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

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * MetaDataScreen
 * 
 * Gemeinsamer Screen für zusätzliche Metadaten sowohl für Gigs als auch für Fallstudien.
 * Dieser Screen kommt nach den Details-Screens von Gig-Erstellung und Fallstudien-Erstellung.
 */
export default function MetaDataScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Handler für Erstellen-Button
  const handleCreatePress = () => {
    // Hier könnte später die tatsächliche Erstellung des Inhalts stattfinden
    
    // Erfolgsmeldung und Navigation zur Startseite
    Alert.alert(
      'Erfolgreich erstellt',
      'Dein Inhalt wurde erfolgreich erstellt!',
      [{ text: 'OK', onPress: () => router.push('/(tabs)/home') }]
    );
  };

  // Erstellen-Button für HeaderNavigation
  const renderErstellenButton = () => (
    <TouchableOpacity onPress={handleCreatePress}>
      <Text 
        style={[
          styles.erstellenButtonText, 
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
        title="Metadaten" 
        rightContent={renderErstellenButton()}
        onBackPress={() => router.back()}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Metadaten hinzufügen
          </Text>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Hier kannst du weitere Informationen zu deinem Inhalt hinzufügen, 
            um ihn besser auffindbar zu machen.
          </Text>
          
          {/* Platzhalter für künftige Metadaten-Eingabefelder */}
          <View style={styles.metadataContainer}>
            {/* Hier werden später die Metadaten-Eingabefelder eingefügt */}
            <View style={[styles.placeholderContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
                Metadaten-Eingabefelder werden hier angezeigt
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
  erstellenButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 