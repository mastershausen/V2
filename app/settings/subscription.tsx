import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  View,
  Text,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/config/theme/spacing';
import { SettingsItem } from '@/features/settings/components/SettingsItem';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { GradientButton } from '@/shared-components/button/GradientButton';

/**
 * Subscription & Payments Settings Screen
 */
export default function SubscriptionScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();

  const handleUpgradePlan = () => {
    Alert.alert(t('settings.subscription.upgradeToPremium'), t('settings.subscription.alerts.upgradeComingSoon'));
  };

  const handleBillingHistory = () => {
    Alert.alert(t('settings.subscription.billingHistory'), t('settings.subscription.alerts.billingComingSoon'));
  };

  const handlePaymentMethod = () => {
    Alert.alert(t('settings.subscription.paymentMethod'), t('settings.subscription.alerts.paymentComingSoon'));
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      t('settings.subscription.cancelSubscription'),
      t('settings.subscription.alerts.cancelConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.yes'), style: 'destructive' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('settings.subscription.title')}
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
        {/* Current Plan */}
        <View style={styles.currentPlanContainer}>
          <Text style={[styles.currentPlanTitle, { color: colors.textPrimary }]}>
            {t('settings.subscription.currentPlan')}
          </Text>
          <View style={styles.planCard}>
            <Text style={[styles.planName, { color: '#1E6B55' }]}>
              {t('settings.subscription.freePlan')}
            </Text>
            <Text style={[styles.planPrice, { color: colors.textPrimary }]}>
              {t('settings.subscription.freePrice')}
            </Text>
            <Text style={[styles.planDescription, { color: colors.textSecondary }]}>
              {t('settings.subscription.freePlanDescription')}
            </Text>
          </View>
          
          <GradientButton
            label={t('settings.subscription.upgradeToPremium')}
            variant="success"
            onPress={handleUpgradePlan}
            style={styles.upgradeButton}
          />
        </View>

        <SettingsSection title={t('settings.subscription.planFeatures')}>
          <SettingsItem
            label={t('settings.subscription.caseStudies')}
            value={t('settings.subscription.limitedAccess')}
            icon="library"
          />
          <SettingsItem
            label={t('settings.subscription.expertConsultations')}
            value={t('settings.subscription.notAvailable')}
            icon="people"
          />
          <SettingsItem
            label={t('settings.subscription.prioritySupport')}
            value={t('settings.subscription.notAvailable')}
            icon="flash"
          />
        </SettingsSection>

        <SettingsSection title={t('settings.subscription.billingPayments')}>
          <SettingsItem
            label={t('settings.subscription.billingHistory')}
            icon="receipt"
            onPress={handleBillingHistory}
            showArrow={true}
          />
          <SettingsItem
            label={t('settings.subscription.paymentMethod')}
            value={t('settings.subscription.noPaymentMethod')}
            icon="card"
            onPress={handlePaymentMethod}
            showArrow={true}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.subscription.subscriptionManagement')}>
          <SettingsItem
            label={t('settings.subscription.cancelSubscription')}
            icon="close-circle"
            onPress={handleCancelSubscription}
            showArrow={true}
          />
        </SettingsSection>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('settings.subscription.upgradeInfo')}
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
  currentPlanContainer: {
    marginTop: spacing.l,
    marginBottom: spacing.xl,
  },
  currentPlanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.m,
  },
  planCard: {
    padding: spacing.l,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 107, 85, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(30, 107, 85, 0.2)',
    marginBottom: spacing.l,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.s,
  },
  planDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  upgradeButton: {
    marginBottom: spacing.l,
  },
  infoContainer: {
    marginTop: spacing.l,
    paddingHorizontal: spacing.m,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
}); 