import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Text, 
  View,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * About Solvbox Screen
 * Story behind the project and what users can expect
 */
export default function AboutSolvboxScreen() {
  const colors = useThemeColor();
  const router = useRouter();

  const features = [
    {
      icon: 'bulb-outline',
      title: 'Expert Network',
      description: 'Access to 500+ verified business consultants and industry experts'
    },
    {
      icon: 'flash-outline',
      title: '48h Solutions',
      description: 'Get tailored solutions for your business challenges within 48 hours'
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Proven Results',
      description: 'Real case studies with measurable outcomes from successful projects'
    },
    {
      icon: 'trending-up-outline',
      title: 'Business Growth',
      description: 'Strategies that have helped businesses save costs and increase revenue'
    }
  ];

  const stats = [
    { number: '500+', label: 'Expert Consultants' },
    { number: '10,000+', label: 'Solved Challenges' },
    { number: '95%', label: 'Success Rate' },
    { number: '€50M+', label: 'Client Savings' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="About Solvbox"
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
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            Your Business Success Platform
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Connecting entrepreneurs with proven solutions for every business challenge
          </Text>
        </View>

        {/* Mission Section */}
        <View style={[styles.section, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Our Mission
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            Every entrepreneur faces challenges that seem impossible to solve alone. Solvbox bridges the gap between ambitious business owners and expert solutions that have been proven to work.
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            We believe that no business problem should remain unsolved when there's someone out there who has already cracked it.
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Impact by Numbers
          </Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#1E6B55' }]}>
                  {stat.number}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={[styles.section, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            What Makes Us Different
          </Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(30, 107, 85, 0.1)' }]}>
                <Ionicons name={feature.icon as any} size={24} color="#1E6B55" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            The Story Behind Solvbox
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            Founded by entrepreneurs who experienced firsthand the struggle of finding reliable business solutions, Solvbox was born from a simple frustration: Why is it so hard to find someone who has already solved the exact problem you're facing?
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            We've built a platform where proven expertise meets real business challenges. Every solution in our network has been tested in the real world and delivered measurable results.
          </Text>
        </View>

        {/* Value Proposition */}
        <View style={[styles.section, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            What You Can Expect
          </Text>
          <View style={styles.expectationItem}>
            <Ionicons name="checkmark-circle" size={20} color="#1E6B55" style={styles.checkIcon} />
            <Text style={[styles.expectationText, { color: colors.textSecondary }]}>
              Solutions backed by real case studies and proven results
            </Text>
          </View>
          <View style={styles.expectationItem}>
            <Ionicons name="checkmark-circle" size={20} color="#1E6B55" style={styles.checkIcon} />
            <Text style={[styles.expectationText, { color: colors.textSecondary }]}>
              Direct access to experts who have solved similar challenges
            </Text>
          </View>
          <View style={styles.expectationItem}>
            <Ionicons name="checkmark-circle" size={20} color="#1E6B55" style={styles.checkIcon} />
            <Text style={[styles.expectationText, { color: colors.textSecondary }]}>
              Personalized recommendations based on your specific needs
            </Text>
          </View>
          <View style={styles.expectationItem}>
            <Ionicons name="checkmark-circle" size={20} color="#1E6B55" style={styles.checkIcon} />
            <Text style={[styles.expectationText, { color: colors.textSecondary }]}>
              Transparent pricing and clear project timelines
            </Text>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={[styles.ctaTitle, { color: colors.textPrimary }]}>
            Ready to Solve Your Next Challenge?
          </Text>
          <Text style={[styles.ctaText, { color: colors.textSecondary }]}>
            Join thousands of entrepreneurs who have transformed their businesses with proven solutions.
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
  },
  heroSection: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    marginVertical: spacing.s,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.l,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.m,
  },
  statsSection: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: spacing.l,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  expectationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  checkIcon: {
    marginRight: spacing.s,
    marginTop: 2,
  },
  expectationText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  ctaText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 