import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Über Solvbox Screen
 * Informationen über die App, Vision und Team
 */
export default function AboutScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // Handler für externe Links
  const handleOpenWebsite = () => {
    Linking.openURL('https://solvbox.de');
  };
  
  const handleOpenEmail = () => {
    Linking.openURL('mailto:info@solvbox.de');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Über Solvbox"
        showBackButton={true}
        onBackPress={() => router.back()}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerContainer}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo & App Info */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="semantic-web" size={48} color="white" />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>
            Solvbox
          </Text>
          <Text style={[styles.version, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
        
        {/* Vision */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Unsere Vision
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            Solvbox verbindet Unternehmer und Experten durch intelligente Matching-Technologie. 
            Wir glauben daran, dass jedes geschäftliche Problem eine Lösung hat – man muss nur 
            die richtigen Menschen zusammenbringen.
          </Text>
        </View>
        
        {/* Mission */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Was wir tun
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            Unsere KI-basierte Plattform analysiert Geschäftsprobleme und bringt Sie mit den 
            passenden Experten zusammen. Durch strukturierte Fallstudien und intelligente 
            Algorithmen finden wir die optimalen Lösungsansätze für Ihr Unternehmen.
          </Text>
        </View>
        
        {/* Team */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Das Team
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            Solvbox wurde von einem Team aus erfahrenen Unternehmern, Entwicklern und 
            KI-Experten entwickelt, die selbst die Herausforderungen des Unternehmertums 
            kennen und verstehen.
          </Text>
        </View>
        
        {/* Links */}
        <View style={styles.linksContainer}>
          <TouchableOpacity
            style={[styles.linkButton, { borderColor: colors.divider }]}
            onPress={handleOpenWebsite}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={24} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Website besuchen
            </Text>
            <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.linkButton, { borderColor: colors.divider }]}
            onPress={handleOpenEmail}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={24} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Kontakt aufnehmen
            </Text>
            <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {/* Copyright */}
        <View style={styles.copyrightContainer}>
          <Text style={[styles.copyrightText, { color: colors.textTertiary }]}>
            © 2024 Solvbox GmbH
          </Text>
          <Text style={[styles.copyrightText, { color: colors.textTertiary }]}>
            Alle Rechte vorbehalten
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
    height: 56,
    paddingTop: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.m,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  appName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  version: {
    fontSize: typography.fontSize.s,
  },
  sectionContainer: {
    paddingVertical: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: '600',
    marginBottom: spacing.s,
  },
  sectionText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
  },
  linksContainer: {
    paddingVertical: spacing.l,
    gap: spacing.m,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
  },
  linkText: {
    flex: 1,
    fontSize: typography.fontSize.m,
    fontWeight: '500',
    marginLeft: spacing.m,
  },
  copyrightContainer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.m,
  },
  copyrightText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
}); 