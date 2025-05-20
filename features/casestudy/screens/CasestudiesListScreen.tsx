import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { CasestudyCard, CasestudyData } from '@/shared-components/cards/casestudy-card';
import mockCasestudies from '@/mock/data/mockCasestudies';

/**
 * Screen zur Anzeige aller verfügbaren Fallstudien
 */
export default function CasestudiesListScreen() {
  const colors = useThemeColor();
  const router = useRouter();

  /**
   * Handler für den Klick auf eine Fallstudienkarte
   */
  const handleCasestudyPress = (casestudy: CasestudyData) => {
    // Navigation zum Details-Screen mit den entsprechenden Parametern
    router.push({
      pathname: '/casestudies/details',
      params: {
        id: casestudy.id,
        imageUrl: casestudy.imageUrl,
        source: 'list' // Für die Zurück-Navigation
      }
    });
  };

  /**
   * Rendert eine einzelne Fallstudienkarte
   */
  const renderCasestudyItem = ({ item }: { item: CasestudyData }) => (
    <CasestudyCard
      casestudy={item}
      onPress={() => handleCasestudyPress(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      
      <HeaderNavigation 
        title="Fallstudien"
        onBackPress={() => router.back()}
      />
      
      <View style={styles.content}>
        {/* Überschrift */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Erfolgsgeschichten
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Entdecke, wie andere von unseren Lösungen profitiert haben
        </Text>
        
        {/* Liste der Fallstudien */}
        <FlatList
          data={mockCasestudies}
          renderItem={renderCasestudyItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Keine Fallstudien verfügbar
            </Text>
          }
        />
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
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.m,
    marginBottom: spacing.m,
  },
  listContainer: {
    paddingBottom: spacing.l,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: typography.fontSize.m,
  }
}); 