/**
 * Einstellungen-Tab-Screen
 * 
 * Dieser Screen dient als Container für die Einstellungen-Funktionalität.
 */
import { Stack } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';

/**
 * Tab-Screen für die Einstellungen
 */
export default function Settings() {
  const { t } = useTranslation();
  const colors = useThemeColor();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.backgroundPrimary,
          },
          headerTintColor: colors.textPrimary,
          title: 'Einstellungen',
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Allgemein</Text>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="person-outline" size={22} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Mein Profil</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="notifications-outline" size={22} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Benachrichtigungen</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="moon-outline" size={22} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Erscheinungsbild</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>App</Text>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="language-outline" size={22} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Sprache</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="help-circle-outline" size={22} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Hilfe & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="information-circle-outline" size={22} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Über Solvbox</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error + '10' }]}>
            <Text style={[styles.logoutText, { color: colors.error }]}>Abmelden</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.l,
    paddingHorizontal: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.fontSize.s,
    fontWeight: '600',
    marginVertical: spacing.s,
    marginLeft: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    marginBottom: spacing.xs,
  },
  menuIcon: {
    marginRight: spacing.m,
  },
  menuText: {
    fontSize: typography.fontSize.m,
    flex: 1,
  },
  logoutButton: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    alignItems: 'center',
    marginTop: spacing.m,
  },
  logoutText: {
    fontSize: typography.fontSize.m,
    fontWeight: '600',
  }
}); 