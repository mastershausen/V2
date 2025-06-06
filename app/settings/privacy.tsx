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
 * Privacy Policy Settings Screen
 */
export default function PrivacyScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('settings.privacy.title')}
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
            {t('settings.privacy.lastUpdated')}
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.privacy.infoWeCollect')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.privacy.infoWeCollectText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.privacy.howWeUse')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.privacy.howWeUseText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.privacy.infoSharing')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.privacy.infoSharingText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.privacy.dataSecurity')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.privacy.dataSecurityText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.privacy.yourRights')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.privacy.yourRightsText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.privacy.cookiesTracking')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.privacy.cookiesTrackingText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.privacy.childrensPrivacy')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.privacy.childrensPrivacyText')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.privacy.contactUs')}
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              {t('settings.privacy.contactUsText')}
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