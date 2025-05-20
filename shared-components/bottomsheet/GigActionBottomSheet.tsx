import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Animated, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { typography } from '@/config/theme/typography';

export interface GigActionOption {
  id: string;
  label: string;
  icon: string;
  isPremium?: boolean;
  color?: string;
  onPress: () => void;
}

interface GigActionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  options?: GigActionOption[];
}

const DEFAULT_OPTIONS: Omit<GigActionOption, 'onPress'>[] = [
  {
    id: 'rate',
    label: 'Gig bewerten',
    icon: 'star-outline',
    color: '#FFB400' // Gelb für Bewertungen
  },
  {
    id: 'message',
    label: 'Anfrage senden',
    icon: 'chatbubble-outline',
    color: '#0A84FF' // Blau für Nachrichten
  },
  {
    id: 'reference',
    label: 'Fallstudie referenzieren',
    icon: 'link-outline',
    isPremium: true,
    color: '#5E5CE6' // Lila für Premium-Funktion
  }
];

/**
 * iOS-ähnliches Aktionsblatt für Gig-Interaktionen
 */
export function GigActionBottomSheet({ 
  visible, 
  onClose,
  options
}: GigActionBottomSheetProps) {
  const colors = useThemeColor();
  const { height } = useWindowDimensions();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(100)).current;
  
  // Kombiniere die Standard-Optionen mit benutzerdefinierten Optionen
  const actionOptions = options || DEFAULT_OPTIONS;
  
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
                  <View style={styles.handle} />
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Gig-Aktionen
                  </Text>
                </View>
                
                <View style={styles.optionsContainer}>
                  {actionOptions.map((option, index) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        index < actionOptions.length - 1 && { 
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: colors.divider 
                        }
                      ]}
                      onPress={() => {
                        onClose();
                        if ('onPress' in option && typeof option.onPress === 'function') {
                          option.onPress();
                        }
                      }}
                    >
                      <View style={[
                        styles.iconContainer,
                        { backgroundColor: option.color || colors.pastel.primary }
                      ]}>
                        <Ionicons 
                          name={option.icon as any} 
                          size={22} 
                          color="#FFFFFF" 
                        />
                      </View>
                      <View style={styles.labelContainer}>
                        <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>
                          {option.label}
                        </Text>
                        {option.isPremium && (
                          <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.premiumText}>Premium</Text>
                          </View>
                        )}
                      </View>
                      <Ionicons 
                        name={option.isPremium ? "lock-closed" : "chevron-forward"} 
                        size={18} 
                        color={option.isPremium ? colors.primary : colors.textTertiary} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Abbrechen-Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                >
                  <Text style={[styles.cancelText, { color: colors.primary }]}>
                    Abbrechen
                  </Text>
                </TouchableOpacity>
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
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 10,
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
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '400',
  },
  premiumBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: spacing.s,
  },
  premiumText: {
    color: 'white',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 6,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
  }
}); 