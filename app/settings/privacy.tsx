import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  View,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Privacy Policy Settings Screen
 */
export default function PrivacyScreen() {
  const colors = useThemeColor();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Privacy Policy"
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
            Last updated: December 2024
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              1. Information We Collect
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              We collect information you provide directly to us, such as when you create 
              an account, use our services, or contact us for support. This may include:
              {'\n\n'}
              • Name and contact information
              {'\n'}
              • Account credentials
              {'\n'}
              • Professional information
              {'\n'}
              • Usage data and preferences
              {'\n'}
              • Device and technical information
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              2. How We Use Your Information
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              We use the information we collect to:
              {'\n\n'}
              • Provide, maintain, and improve our services
              {'\n'}
              • Process transactions and send related information
              {'\n'}
              • Send technical notices and support messages
              {'\n'}
              • Respond to your comments and questions
              {'\n'}
              • Personalize your experience
              {'\n'}
              • Monitor and analyze usage patterns
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              3. Information Sharing
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              We do not sell, trade, or otherwise transfer your personal information to 
              third parties without your consent, except as described in this policy. 
              We may share your information:
              {'\n\n'}
              • With service providers who assist us in operating our platform
              {'\n'}
              • When required by law or to protect our rights
              {'\n'}
              • In connection with a business transfer or acquisition
              {'\n'}
              • With your explicit consent
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              4. Data Security
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              We implement appropriate technical and organizational measures to protect 
              your personal information against unauthorized access, alteration, disclosure, 
              or destruction. However, no method of transmission over the internet or 
              electronic storage is 100% secure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              5. Your Rights (GDPR)
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              If you are located in the European Union, you have certain rights regarding 
              your personal data:
              {'\n\n'}
              • Right to access your personal data
              {'\n'}
              • Right to rectify inaccurate data
              {'\n'}
              • Right to erase your data
              {'\n'}
              • Right to restrict processing
              {'\n'}
              • Right to data portability
              {'\n'}
              • Right to object to processing
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              6. Cookies and Tracking
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              We use cookies and similar tracking technologies to collect information 
              about your browsing activities and to provide personalized content. 
              You can control cookie settings through your browser preferences.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              7. Children's Privacy
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Our services are not directed to children under 16. We do not knowingly 
              collect personal information from children under 16. If we become aware 
              that we have collected such information, we will take steps to delete it.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              8. Contact Us
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              If you have any questions about this Privacy Policy, please contact us:
              {'\n\n'}
              Email: privacy@solvbox.com{'\n'}
              Phone: +49 30 123 456 789{'\n'}
              Address: Musterstraße 123, 10115 Berlin, Germany
              {'\n\n'}
              Data Protection Officer: dpo@solvbox.com
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