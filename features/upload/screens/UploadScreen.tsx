import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

interface FrameOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface UploadScreenProps {
  onOpenSidebar?: () => void;
}

export default function UploadScreen({ onOpenSidebar }: UploadScreenProps) {
  const colors = useThemeColor();
  const router = useRouter();

  const frameOptions: FrameOption[] = [
    {
      id: 'before-after',
      title: 'Before → After',
      description: 'Show a clear transformation with measurable results.',
      icon: 'refresh-outline',
      route: '/casestudies/create/NowThenFrame'
    },
    {
      id: 'thinking-outside',
      title: 'Thinking Outside the Box',
      description: 'Present a creative, unexpected solution approach.',
      icon: 'bulb-outline',
      route: '/casestudies/create/ThinkDifferentFrame'
    },
    {
      id: 'creating-new',
      title: 'Creating Something New',
      description: 'Present an innovative concept or a new solution.',
      icon: 'add-circle-outline',
      route: '/casestudies/create/NewStuffFrame'
    },
    {
      id: 'intelligent-investments',
      title: 'Intelligent Investments',
      description: 'Present strategic investments with high ROI and smart resource allocation.',
      icon: 'trending-up-outline',
      route: '/casestudies/create/IntelligentInvestmentsFrame'
    }
  ];

  const handleFrameSelection = (route: string) => {
    router.push(route as any);
  };

  const handleBackPress = () => {
    if (onOpenSidebar) {
      onOpenSidebar();
    } else {
      router.push('/');
    }
  };

  const renderFrameOption = (option: FrameOption) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.frameOption, { backgroundColor: colors.backgroundSecondary }]}
      onPress={() => handleFrameSelection(option.route)}
      activeOpacity={0.7}
    >
      <View style={styles.frameContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.backgroundTertiary }]}>
          <Ionicons 
            name={option.icon as any} 
            size={24} 
            color={colors.primary} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.frameTitle, { color: colors.textPrimary }]}>
            {option.title}
          </Text>
          <Text style={[styles.frameDescription, { color: colors.textSecondary }]}>
            {option.description}
          </Text>
        </View>
        
        <View style={styles.arrowContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={colors.textTertiary} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header Navigation */}
      <HeaderNavigation 
        title="Create Case Study"
        onBackPress={handleBackPress}
        showBackButton={true}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Content */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            What type of case study would you like to create?
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Choose the appropriate frame for your case study to best present your success.
          </Text>
        </View>

        {/* Frame Options */}
        <View style={styles.optionsContainer}>
          {frameOptions.map(renderFrameOption)}
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={styles.infoContent}>
            <Ionicons 
              name="information-circle-outline" 
              size={20} 
              color={colors.textSecondary} 
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Choosing the right frame helps to present your case study in a structured and convincing way.
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: spacing.l,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.m,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'left',
  },
  optionsContainer: {
    paddingHorizontal: spacing.l,
    gap: spacing.m,
  },
  frameOption: {
    borderRadius: 12,
    padding: spacing.l,
    marginBottom: spacing.s,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  frameContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  frameTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  frameDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: spacing.s,
  },
  infoBox: {
    margin: spacing.l,
    padding: spacing.m,
    borderRadius: 8,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: spacing.s,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
}); 