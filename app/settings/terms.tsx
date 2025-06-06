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
 * Terms & Conditions Settings Screen
 */
export default function TermsScreen() {
  const colors = useThemeColor();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Terms & Conditions"
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
              1. Acceptance of Terms
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              By accessing and using the Solvbox application, you accept and agree to be 
              bound by the terms and provision of this agreement. If you do not agree 
              to abide by the above, please do not use this service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              2. Use License
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Permission is granted to temporarily download one copy of Solvbox per device 
              for personal, non-commercial transitory viewing only. This is the grant of a 
              license, not a transfer of title, and under this license you may not:
              {'\n\n'}
              • modify or copy the materials
              {'\n'}
              • use the materials for any commercial purpose or for any public display
              {'\n'}
              • attempt to reverse engineer any software contained in Solvbox
              {'\n'}
              • remove any copyright or other proprietary notations from the materials
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              3. Disclaimer
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              The materials in Solvbox are provided on an 'as is' basis. Solvbox makes 
              no warranties, expressed or implied, and hereby disclaims and negates all 
              other warranties including without limitation, implied warranties or 
              conditions of merchantability, fitness for a particular purpose, or 
              non-infringement of intellectual property or other violation of rights.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              4. Limitations
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              In no event shall Solvbox or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or 
              due to business interruption) arising out of the use or inability to use 
              the materials in Solvbox, even if Solvbox or a Solvbox authorized 
              representative has been notified orally or in writing of the possibility 
              of such damage.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              5. Privacy Policy
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Your privacy is important to us. Please review our Privacy Policy, which 
              also governs your use of the Service, to understand our practices.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              6. Modifications
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Solvbox may revise these terms of service at any time without notice. 
              By using this application, you are agreeing to be bound by the then 
              current version of these terms of service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              7. Contact Information
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              If you have any questions about these Terms & Conditions, please contact us at:
              {'\n\n'}
              Email: legal@solvbox.com{'\n'}
              Phone: +49 30 123 456 789{'\n'}
              Address: Musterstraße 123, 10115 Berlin, Germany
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