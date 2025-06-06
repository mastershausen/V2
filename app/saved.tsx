/**
 * @file app/saved.tsx
 * @description Route für SavedScreen
 */

import React from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Text, 
  View,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { CasestudyListCard } from '@/shared-components/cards/CasestudyListCard';

/**
 * Saved Screen
 * Displays saved case studies in the same format as CasestudyListScreen
 */
export default function SavedScreen() {
  const colors = useThemeColor();
  const router = useRouter();

  // Mock data for saved case studies
  const SAVED_CASESTUDIES = [
    {
      id: '1',
      titel: 'Tax-efficient holding structure saves €84,000 annually',
      kurzbeschreibung: 'Digital holding setup for agency group, implemented in 3 months',
      compactSummary: 'Holding structure for digital agency group slashed annual tax burden by €84,000. Complete restructuring implemented in 3 months with improved liquidity for growth financing.',
      ergebnis: '€84,000 savings annually',
      context: 'An expanding digital agency with 4 locations and 45 employees had an inefficient corporate structure due to growth and organic development.',
      action: 'Complete restructuring with holding company, optimized tax planning and streamlined operations.',
      result: {
        text: 'Significant cost reduction and improved operational efficiency',
        bulletpoints: [
          'Annual tax savings of €84,000',
          'Restructuring completed in 3 months',
          'Improved cash flow for expansion',
          'Simplified administrative processes'
        ]
      }
    },
    {
      id: '2',
      titel: 'Digital accounting system cuts costs by 40%',
      kurzbeschreibung: 'Cloud-based solution for medium-sized manufacturing company',
      compactSummary: 'Fully digital accounting system cut administrative costs by 40% for manufacturer. Automated processes reduced manual work from 25 to 8 hours weekly.',
      ergebnis: '40% cost reduction',
      context: 'Manufacturing company with outdated paper-based accounting systems and high administrative overhead.',
      action: 'Implementation of cloud-based accounting software with automated workflows and digital invoice processing.',
      result: {
        text: 'Dramatic efficiency improvements and cost savings',
        bulletpoints: [
          '40% reduction in administrative costs',
          'Manual work reduced from 25 to 8 hours/week',
          'Real-time financial reporting implemented',
          'ROI achieved within 6 months'
        ]
      }
    },
    {
      id: '3',
      titel: 'Multi-stage succession strategy saves €325,000 in taxes',
      kurzbeschreibung: 'Family business transition with optimized tax planning',
      compactSummary: 'Multi-stage succession strategy for family business saved €325,000 in inheritance taxes. Smooth transition over 5 years preserved company value and family harmony.',
      ergebnis: '€325,000 tax savings',
      context: 'Family-owned business facing succession challenges with significant tax implications and complex ownership structure.',
      action: 'Development of phased succession plan with gift tax optimization and business valuation strategies.',
      result: {
        text: 'Successful family business transition with substantial savings',
        bulletpoints: [
          'Tax savings of €325,000',
          'Smooth 5-year transition timeline',
          'Preserved company operational stability',
          'Maintained family relationships throughout process'
        ]
      }
    },
    {
      id: '4',
      titel: 'Export expansion increases revenue by 150%',
      kurzbeschreibung: 'Strategic market entry for European expansion',
      compactSummary: 'Export expansion strategy boosted revenue by 150% within 18 months. Targeted European market entry with optimized logistics and regulatory compliance.',
      ergebnis: '150% revenue increase',
      context: 'Mid-sized technology company seeking international expansion but lacking expertise in European markets.',
      action: 'Comprehensive market analysis, regulatory compliance setup, and strategic partnership development for European expansion.',
      result: {
        text: 'Exceptional international growth results',
        bulletpoints: [
          '150% revenue increase in 18 months',
          'Successfully entered 5 European markets',
          'Established strategic partnerships in key regions',
          'Created sustainable international sales channels'
        ]
      }
    },
    {
      id: '5',
      titel: 'AI automation reduces operational costs by 60%',
      kurzbeschreibung: 'Process automation for service industry transformation',
      compactSummary: 'AI-powered automation reduced operational costs by 60% for service company. Customer service efficiency improved by 300% with 24/7 availability.',
      ergebnis: '60% cost reduction',
      context: 'Service company struggling with high operational costs and limited customer service availability.',
      action: 'Implementation of AI-powered customer service automation and process optimization across all departments.',
      result: {
        text: 'Revolutionary operational transformation',
        bulletpoints: [
          '60% reduction in operational costs',
          '300% improvement in customer service efficiency',
          '24/7 customer support availability',
          'Employee productivity increased by 40%'
        ]
      }
    }
  ];

  // Handle case study selection
  const handleSelectCasestudy = (casestudy: any) => {
    console.log('Selected saved case study:', casestudy.titel);
    // Navigate to case study detail or open modal
  };

  // Render individual case study item
  const renderCasestudyItem = ({ item }: { item: any }) => (
    <CasestudyListCard
      variant="compact"
      title={item.titel}
      description={item.kurzbeschreibung}
      result={item.result.text}
      compactSummary={item.compactSummary}
      onInfoPress={() => handleSelectCasestudy(item)}
      style={{ marginBottom: spacing.m }}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Saved Case Studies"
        showBackButton={true}
        onBackPress={() => router.back()}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerContainer}
      />
      
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Your Saved Case Studies
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Access your bookmarked solutions and expert insights
          </Text>
        </View>

        {/* Case Studies List */}
        <View style={styles.fallstudienContainer}>
          <FlatList
            data={SAVED_CASESTUDIES}
            renderItem={renderCasestudyItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.m,
  },
  headerSection: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  fallstudienContainer: {
    flex: 1,
    marginTop: spacing.l,
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
}); 