import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, TouchableWithoutFeedback, Animated, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { borderRadius } from '@/config/theme';

export interface CreateContentOption {
  id: string;
  label: string;
  icon: string;
  route: string;
  color?: string;
}

interface CreateContentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const DEFAULT_OPTIONS: CreateContentOption[] = [
  {
    id: 'nugget',
    label: 'Nugget erstellen',
    icon: 'document-text-outline',
    route: '/nuggets/create/createNugget'
  },
  {
    id: 'gig',
    label: 'Gig erstellen',
    icon: 'briefcase-outline',
    route: '/gigs/create/createGigList'
  },
  {
    id: 'casestudy',
    label: 'Fallstudie erstellen',
    icon: 'folder-open-outline',
    route: '/casestudies/create/createCasestudyList'
  }
];

/**
 * iOS-ähnliches Popup für die Auswahl zum Erstellen verschiedener Inhalte
 */
export function CreateContentBottomSheet({ 
  visible, 
  onClose 
}: CreateContentBottomSheetProps) {
  const colors = useThemeColor();
  const { height } = useWindowDimensions();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(100)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, opacity, translateY]);

  const handleOptionPress = (option: CreateContentOption) => {
    onClose();
    router.push(option.route);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[
          styles.overlay,
          { opacity }
        ]}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.popupContainer,
                { 
                  backgroundColor: Platform.OS === 'ios' ? 'rgba(240, 240, 240, 0.92)' : colors.backgroundPrimary,
                  transform: [{ translateY }],
                  marginBottom: height * 0.1 // Positionierung etwas höher auf dem Bildschirm
                }
              ]}
            >
              {Platform.OS === 'ios' && (
                <BlurView 
                  intensity={50} 
                  tint="light"
                  style={StyleSheet.absoluteFill}
                />
              )}
              
              <View style={styles.content}>
                <View style={styles.headerContainer}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Inhalt erstellen
                  </Text>
                </View>
                
                <View style={styles.optionsContainer}>
                  {DEFAULT_OPTIONS.map((option, index) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        index < DEFAULT_OPTIONS.length - 1 && { 
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: colors.divider 
                        }
                      ]}
                      onPress={() => handleOptionPress(option)}
                    >
                      <View style={[
                        styles.iconContainer,
                        { backgroundColor: option.color || colors.pastel.primary }
                      ]}>
                        <Ionicons 
                          name={option.icon as any} 
                          size={22} 
                          color={colors.primary} 
                        />
                      </View>
                      <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>
                        {option.label}
                      </Text>
                      <Ionicons 
                        name="chevron-forward" 
                        size={18} 
                        color={colors.textTertiary} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  popupContainer: {
    overflow: 'hidden',
    marginHorizontal: 8,
    borderRadius: 14,
    marginTop: 'auto',
  },
  content: {
    // Überlappt das BlurView
    position: 'relative',
    zIndex: 1,
  },
  headerContainer: {
    paddingVertical: 14,
    paddingHorizontal: spacing.m,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionsContainer: {
    backgroundColor: 'transparent',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.m,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '400',
    flex: 1,
  }
}); 