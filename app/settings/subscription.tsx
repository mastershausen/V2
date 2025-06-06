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

  const handleUpgradePlan = () => {
    Alert.alert('Upgrade Plan', 'Upgrade functionality coming soon!');
  };

  const handleBillingHistory = () => {
    Alert.alert('Billing History', 'Billing history coming soon!');
  };

  const handlePaymentMethod = () => {
    Alert.alert('Payment Method', 'Payment method management coming soon!');
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Subscription & Payments"
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
            Current Plan
          </Text>
          <View style={styles.planCard}>
            <Text style={[styles.planName, { color: '#1E6B55' }]}>
              Free Plan
            </Text>
            <Text style={[styles.planPrice, { color: colors.textPrimary }]}>
              €0 / month
            </Text>
            <Text style={[styles.planDescription, { color: colors.textSecondary }]}>
              Access to basic features and case studies
            </Text>
          </View>
          
          <GradientButton
            label="Upgrade to Premium"
            variant="success"
            onPress={handleUpgradePlan}
            style={styles.upgradeButton}
          />
        </View>

        <SettingsSection title="Plan Features">
          <SettingsItem
            label="Case Studies"
            value="Limited access"
            icon="library"
          />
          <SettingsItem
            label="Expert Consultations"
            value="Not available"
            icon="people"
          />
          <SettingsItem
            label="Priority Support"
            value="Not available"
            icon="flash"
          />
        </SettingsSection>

        <SettingsSection title="Billing & Payments">
          <SettingsItem
            label="Billing History"
            icon="receipt"
            onPress={handleBillingHistory}
            showArrow={true}
          />
          <SettingsItem
            label="Payment Method"
            value="No payment method"
            icon="card"
            onPress={handlePaymentMethod}
            showArrow={true}
          />
        </SettingsSection>

        <SettingsSection title="Subscription Management">
          <SettingsItem
            label="Cancel Subscription"
            icon="close-circle"
            onPress={handleCancelSubscription}
            showArrow={true}
          />
        </SettingsSection>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Upgrade to Premium for unlimited access to expert insights, 
            priority support, and exclusive business solutions.
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