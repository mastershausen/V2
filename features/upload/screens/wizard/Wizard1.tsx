import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';

interface Wizard1Props {
  onOpenSidebar?: () => void;
}

export default function Wizard1({ onOpenSidebar }: Wizard1Props) {
  const colors = useThemeColor();
  const router = useRouter();

  const handleBackPress = () => {
    if (onOpenSidebar) {
      onOpenSidebar();
    } else {
      router.push('/');
    }
  };

  const handleNext = () => {
    // Navigation zum nächsten Wizard-Screen
    console.log('🚀 Weiter zu Wizard 2');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header Navigation */}
      <HeaderNavigation 
        title="Wizard 1/8"
        onBackPress={handleBackPress}
        showBackButton={true}
      />
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Wizard Screen 1
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Hier kommt der Inhalt für Schritt 1
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 