import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  View,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Imprint Settings Screen
 */
export default function ImprintScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('settings.imprint.title')}
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
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.imprint.companyInfo')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Solvbox GmbH{'\n'}
              Musterstraße 123{'\n'}
              10115 Berlin{'\n'}
              Germany
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.imprint.contact')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Phone: +49 30 123 456 789{'\n'}
              Email: info@solvbox.com{'\n'}
              Website: www.solvbox.com
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.imprint.legalReps')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.imprint.managingDirectors')}{'\n'}
              Max Mustermann{'\n'}
              Anna Schmidt
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.imprint.registration')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.imprint.commercialRegister')}{'\n'}
              {t('settings.imprint.registrationCourt')}{'\n'}
              {t('settings.imprint.vatId')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.imprint.responsibleContent')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.imprint.responsibleAccording')}{'\n'}
              Max Mustermann{'\n'}
              Solvbox GmbH{'\n'}
              Musterstraße 123{'\n'}
              10115 Berlin
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.imprint.disclaimer')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.imprint.disclaimerText')}
            </Text>
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
  },
  content: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.l,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.m,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 