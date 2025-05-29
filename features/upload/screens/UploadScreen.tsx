import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Text,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';

interface UploadScreenProps {
  onOpenSidebar?: () => void;
}

export default function UploadScreen({ onOpenSidebar }: UploadScreenProps) {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();

  // Demo Premium User Data
  const userStatus = 'premium'; // premium, pro, free
  const usedCaseStudies = 3;
  const totalCaseStudies = 10;
  const remainingCaseStudies = totalCaseStudies - usedCaseStudies;

  // Dropdown State
  const [isPricingDropdownOpen, setIsPricingDropdownOpen] = useState(false);

  // Pricing Packages (Premium = 50% off)
  const pricingPackages = [
    {
      size: '1',
      normalPrice: 4.90,
      premiumPrice: 2.45,
      pricePerUpload: 2.45,
      popular: false
    },
    {
      size: '10',
      normalPrice: 39.90,
      premiumPrice: 19.95,
      pricePerUpload: 1.99,
      popular: true
    },
    {
      size: '25',
      normalPrice: 84.90,
      premiumPrice: 42.45,
      pricePerUpload: 1.70,
      popular: false
    },
    {
      size: '50',
      normalPrice: 139.90,
      premiumPrice: 69.95,
      pricePerUpload: 1.40,
      popular: false
    },
    {
      size: '100',
      normalPrice: 199.00,
      premiumPrice: 99.45,
      pricePerUpload: 0.99,
      popular: false
    }
  ];

  const handleCreateCaseStudy = () => {
    // Navigation zu Wizard1
    router.push('/wizard1');
  };

  const handleBackPress = () => {
    if (onOpenSidebar) {
      onOpenSidebar();
    } else {
      router.push('/');
    }
  };

  const progressPercentage = (usedCaseStudies / totalCaseStudies) * 100;

  const benefits = [
    {
      icon: 'people-outline' as const,
      title: t('upload.benefits.qualifiedLeads.title'),
      description: t('upload.benefits.qualifiedLeads.description')
    },
    {
      icon: 'trending-up-outline' as const,
      title: t('upload.benefits.provenExpertise.title'),
      description: t('upload.benefits.provenExpertise.description')
    },
    {
      icon: 'rocket-outline' as const,
      title: t('upload.benefits.passiveLeads.title'),
      description: t('upload.benefits.passiveLeads.description')
    },
    {
      icon: 'checkmark-circle-outline' as const,
      title: t('upload.benefits.aiMatching.title'),
      description: t('upload.benefits.aiMatching.description')
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header Navigation */}
      <HeaderNavigation 
        title={t('upload.header.title')}
        onBackPress={handleBackPress}
        showBackButton={true}
        rightContent={
          <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.premiumBadgeText}>{t('upload.header.premiumBadge')}</Text>
          </View>
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            {t('upload.hero.title')}
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            {t('upload.hero.subtitle')}
          </Text>
        </View>

        {/* Kontingent Section */}
        <View style={[styles.quotaSection, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={styles.quotaHeader}>
            <Text style={[styles.quotaTitle, { color: colors.textPrimary }]}>
              {t('upload.quota.title')}
            </Text>
            <View style={[styles.launchOfferBadge, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.launchOfferText, { color: colors.primary }]}>
                {t('upload.quota.launchOffer')}
              </Text>
            </View>
          </View>
          
          <View style={styles.quotaProgress}>
            <View style={styles.quotaNumbers}>
              <Text style={[styles.quotaUsed, { color: colors.textPrimary }]}>
                {usedCaseStudies}
              </Text>
              <Text style={[styles.quotaTotal, { color: colors.textSecondary }]}>
                / {totalCaseStudies} {t('upload.quota.used')}
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.inputBorder }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${progressPercentage}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.remainingText, { color: colors.primary }]}>
              {remainingCaseStudies} {t('upload.quota.remaining')}
            </Text>
          </View>
        </View>

        {/* CTA Section - MOVED UP */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleCreateCaseStudy}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, '#15503F']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Ionicons name="add-circle-outline" size={24} color="white" style={styles.ctaIcon} />
              <Text style={styles.ctaButtonText}>
                {t('upload.cta.buttonText')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={[styles.benefitsTitle, { color: colors.textPrimary }]}>
            {t('upload.benefits.title')}
          </Text>
          
          <View style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <View key={index} style={[styles.benefitItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.benefitIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Ionicons name={benefit.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={[styles.benefitTitle, { color: colors.textPrimary }]}>
                    {benefit.title}
                  </Text>
                  <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                    {benefit.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Teaser */}
        <View style={styles.pricingTeaser}>
          <TouchableOpacity 
            style={[
              styles.pricingHeader, 
              { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.inputBorder,
                shadowColor: colors.primary 
              }
            ]}
            onPress={() => setIsPricingDropdownOpen(!isPricingDropdownOpen)}
            activeOpacity={0.7}
          >
            <View style={styles.pricingHeaderLeft}>
              <Ionicons 
                name="pricetags-outline" 
                size={20} 
                color={colors.primary} 
                style={styles.pricingHeaderIcon}
              />
              <View style={styles.pricingTextContent}>
                <Text style={[styles.pricingTitle, { color: colors.textPrimary }]}>
                  {t('upload.pricing.title')}
                </Text>
                <Text style={[styles.pricingSubtitle, { color: colors.textSecondary }]}>
                  {t('upload.pricing.subtitle')}
                </Text>
              </View>
            </View>
            <Ionicons 
              name={isPricingDropdownOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.primary} 
              style={styles.chevronIcon}
            />
          </TouchableOpacity>

          {isPricingDropdownOpen && (
            <View style={[styles.pricingDropdown, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={[styles.premiumDiscountBanner, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="pricetag" size={16} color={colors.primary} />
                <Text style={[styles.discountText, { color: colors.primary }]}>
                  {t('upload.pricing.premiumDiscount')}
                </Text>
              </View>

              <View style={styles.packagesContainer}>
                {pricingPackages.map((pkg, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.pricingPackage,
                      { 
                        backgroundColor: pkg.popular ? `${colors.primary}08` : 'transparent',
                        borderColor: pkg.popular ? colors.primary : colors.inputBorder 
                      }
                    ]}
                  >
                    {pkg.popular && (
                      <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.popularBadgeText}>{t('upload.pricing.popular')}</Text>
                      </View>
                    )}
                    
                    <View style={styles.packageHeader}>
                      <Text style={[styles.packageSize, { color: colors.textPrimary }]}>
                        {pkg.size} {t('upload.pricing.caseStudies')}
                      </Text>
                      <View style={styles.priceContainer}>
                        <Text style={[styles.normalPrice, { color: colors.textTertiary }]}>
                          {pkg.normalPrice.toFixed(2)}€
                        </Text>
                        <Text style={[styles.premiumPrice, { color: colors.primary }]}>
                          {pkg.premiumPrice.toFixed(2)}€
                        </Text>
                        <Text style={[styles.perMonthText, { color: colors.textSecondary }]}>
                          /{t('upload.pricing.perMonth')}
                        </Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={[
                        styles.buyButton,
                        { 
                          backgroundColor: pkg.popular ? colors.primary : colors.backgroundPrimary,
                          borderColor: pkg.popular ? colors.primary : colors.inputBorder
                        }
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.buyButtonText,
                        { color: pkg.popular ? 'white' : colors.textPrimary }
                      ]}>
                        {t('upload.pricing.buyNow')}
                      </Text>
                      <Text style={[
                        styles.buyButtonSubtext,
                        { color: pkg.popular ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                      ]}>
                        {pkg.pricePerUpload.toFixed(2)}€ {t('upload.pricing.perUpload')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },
  premiumBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  heroSection: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.m,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.m,
  },
  quotaSection: {
    padding: spacing.l,
    borderRadius: 16,
    marginBottom: spacing.xl,
  },
  quotaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  quotaTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  launchOfferBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  launchOfferText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quotaProgress: {
    gap: spacing.s,
  },
  quotaNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  quotaUsed: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  quotaTotal: {
    fontSize: 16,
    marginLeft: spacing.xs,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  benefitsSection: {
    marginBottom: spacing.xl,
  },
  benefitsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  benefitsList: {
    gap: spacing.m,
  },
  benefitItem: {
    flexDirection: 'row',
    padding: spacing.m,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaSection: {
    marginBottom: spacing.xl,
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.xl,
  },
  ctaIcon: {
    marginRight: spacing.s,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pricingTeaser: {
    marginBottom: spacing.xl,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.xs,
  },
  pricingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pricingHeaderIcon: {
    marginRight: spacing.s,
  },
  pricingTextContent: {
    flex: 1,
  },
  pricingTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  pricingSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  chevronIcon: {
    marginLeft: spacing.s,
  },
  pricingDropdown: {
    padding: spacing.m,
    borderRadius: 8,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'transparent',
    marginTop: -spacing.xs,
  },
  premiumDiscountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
    borderRadius: 8,
    marginBottom: spacing.m,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  pricingPackage: {
    padding: spacing.l,
    borderWidth: 1,
    borderRadius: 12,
    position: 'relative',
    width: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: spacing.m,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  packageSize: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  normalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: spacing.xs,
  },
  premiumPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyButton: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  buyButtonSubtext: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  packagesContainer: {
    gap: spacing.l,
    width: '100%',
  },
  perMonthText: {
    fontSize: 12,
    marginLeft: spacing.xs,
  },
}); 