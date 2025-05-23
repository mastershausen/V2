import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { InfoBox } from '@/shared-components/ui/InfoBox';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

const windowWidth = Dimensions.get('window').width;

// Frame-Typen
enum FrameType {
  BEFORE_AFTER = 'BEFORE_AFTER',
  OUTSIDE_BOX = 'OUTSIDE_BOX',
  CREATE_NEW = 'CREATE_NEW'
}

interface FrameOption {
  id: FrameType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

/**
 * Upload Screen for Case Studies
 * Allows selection of different frame types for the upload process
 */
export default function UploadScreen() {
  const colors = useThemeColor();
  const [selectedFrame, setSelectedFrame] = useState<FrameType | null>(null);

  // Frame options
  const frameOptions: FrameOption[] = [
    {
      id: FrameType.BEFORE_AFTER,
      title: 'Before → After',
      description: 'Show a clear transformation with measurable results.',
      icon: 'sync-outline',
      color: colors.primary
    },
    {
      id: FrameType.OUTSIDE_BOX,
      title: 'Thinking Outside the Box',
      description: 'Present a creative, unexpected solution approach.',
      icon: 'bulb-outline',
      color: '#6B5C1E' // Alternative color for distinction
    },
    {
      id: FrameType.CREATE_NEW,
      title: 'Creating Something New',
      description: 'Present an innovative concept or a new solution.',
      icon: 'add-circle-outline',
      color: '#3E1E6B' // Alternative color for distinction
    }
  ];

  // Select frame and go to next step
  const handleSelectFrame = (frameType: FrameType) => {
    setSelectedFrame(frameType);
    
    // Navigation based on selected frame type
    switch (frameType) {
      case FrameType.BEFORE_AFTER:
        router.push('/casestudies/create/NowThenFrame');
        break;
      case FrameType.OUTSIDE_BOX:
        router.push('/casestudies/create/ThinkDifferentFrame');
        break;
      case FrameType.CREATE_NEW:
        router.push('/casestudies/create/NewStuffFrame');
        break;
    }
  };

  // Render a single frame option
  const renderFrameOption = (option: FrameOption) => {
    const isSelected = selectedFrame === option.id;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.frameOption,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: isSelected ? option.color : 'transparent',
            borderWidth: isSelected ? 2 : 0,
          }
        ]}
        onPress={() => handleSelectFrame(option.id)}
      >
        <View style={[styles.frameIconContainer, { backgroundColor: `${option.color}20` }]}>
          <Ionicons name={option.icon} size={36} color={option.color} />
        </View>
        <View style={styles.frameTextContainer}>
          <Text style={[styles.frameTitle, { color: colors.textPrimary }]}>
            {option.title}
          </Text>
          <Text style={[styles.frameDescription, { color: colors.textSecondary }]}>
            {option.description}
          </Text>
        </View>
        <View style={styles.frameArrow}>
          <Ionicons 
            name={isSelected ? "checkmark-circle" : "arrow-forward-circle-outline"} 
            size={24} 
            color={isSelected ? option.color : colors.textTertiary} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.backgroundPrimary }]}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
        <Stack.Screen 
          options={{ 
            headerShown: false,
          }} 
        />
        
        {/* Header - fully visible */}
        <View style={styles.headerContainer}>
          <HeaderNavigation
            title="Create Case Study"
            showBackButton={false}
            containerStyle={styles.headerNavStyle}
          />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Introduction */}
          <View style={styles.introContainer}>
            <Text style={[styles.introTitle, { color: colors.textPrimary }]}>
              What type of case study would you like to create?
            </Text>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Choose the appropriate frame for your case study to best present your success.
            </Text>
          </View>

          {/* Frame options */}
          <View style={styles.framesContainer}>
            {frameOptions.map(renderFrameOption)}
          </View>

          {/* Additional information */}
          <View style={styles.infoContainer}>
            <InfoBox 
              text="Choosing the right frame helps to present your case study in a structured and convincing way."
              backgroundColor={`${colors.primary}10`}
              iconColor={colors.primary}
              textColor={colors.textSecondary}
            />
          </View>
        </ScrollView>

        {/* Footer button was removed */}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? spacing.m : spacing.xl,
    paddingBottom: spacing.xs,
    marginBottom: spacing.s,
    zIndex: 10,
  },
  headerNavStyle: {
    height: 56,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.m,
  },
  introContainer: {
    marginBottom: spacing.l,
  },
  introTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.s,
  },
  introText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
  },
  framesContainer: {
    marginBottom: spacing.xl,
  },
  frameOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  frameIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  frameTextContainer: {
    flex: 1,
  },
  frameTitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
    marginBottom: spacing.xs,
  },
  frameDescription: {
    fontSize: typography.fontSize.s,
    lineHeight: 18,
  },
  frameArrow: {
    marginLeft: spacing.s,
  },
  infoContainer: {
    marginBottom: spacing.xl,
  },
}); 