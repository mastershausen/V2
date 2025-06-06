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
 * Imprint Settings Screen
 */
export default function ImprintScreen() {
  const colors = useThemeColor();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Imprint"
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
              Company Information
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
              Contact
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Phone: +49 30 123 456 789{'\n'}
              Email: info@solvbox.com{'\n'}
              Website: www.solvbox.com
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Legal Representatives
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Managing Directors:{'\n'}
              Max Mustermann{'\n'}
              Anna Schmidt
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Registration
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              Commercial Register: HRB 12345 B{'\n'}
              Registration Court: Amtsgericht Berlin-Charlottenburg{'\n'}
              VAT ID: DE123456789
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Responsible for Content
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              According to § 55 Abs. 2 RStV:{'\n'}
              Max Mustermann{'\n'}
              Solvbox GmbH{'\n'}
              Musterstraße 123{'\n'}
              10115 Berlin
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Disclaimer
            </Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>
              The content of our pages has been created with the utmost care. 
              However, we cannot guarantee the accuracy, completeness, or timeliness of the content.
              {'\n\n'}
              As a service provider, we are responsible for our own content on these pages 
              according to general law pursuant to § 7 para. 1 TMG. However, pursuant to 
              §§ 8 to 10 TMG, we are not under obligation to monitor transmitted or stored 
              third-party information or to investigate circumstances indicating illegal activity.
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