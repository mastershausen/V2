import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 *
 */
export default function CreateGigListScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // State für Gig
  const [title, setTitle] = useState('');
  
  // Gig erstellen
  const createGig = () => {
    // Hier würde die tatsächliche Gig-Erstellung erfolgen
    Alert.alert(
      'Gig erstellt',
      'Dein Gig wurde erfolgreich erstellt.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  // Erstellen-Button für HeaderNavigation
  const renderErstellenButton = () => (
    <TouchableOpacity 
      onPress={createGig}
      disabled={!title.trim()}
    >
      <Text 
        style={[
          styles.createButtonText, 
          { color: title.trim() ? colors.primary : colors.textSecondary }
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
        title="Neues Gig" 
        rightContent={renderErstellenButton()}
        onBackPress={() => router.back()}
      />
      <View style={styles.content}>
        <View style={styles.centeredContent}>
          <Text style={[styles.comingSoonText, { color: colors.textPrimary }]}>
            Gig-Erstellung (Coming Soon)
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  comingSoonText: {
    fontSize: 18,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
