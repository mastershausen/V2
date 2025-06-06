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
 * Terms & Conditions Settings Screen
 */
export default function TermsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('settings.terms.title')}
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
          <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
            {t('settings.terms.lastUpdated')}
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.terms.acceptance')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.terms.acceptanceText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.terms.useLicense')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.terms.useLicenseText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.terms.disclaimer')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.terms.disclaimerText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.terms.limitations')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.terms.limitationsText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.terms.privacyPolicy')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.terms.privacyPolicyText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.terms.modifications')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.terms.modificationsText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.terms.contactInfo')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.terms.contactInfoText')}
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
  lastUpdated: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.m,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 