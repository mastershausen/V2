import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  PanResponder,
} from 'react-native';

import { spacing, borderRadius } from '@/config/theme';
import { useThemeColor } from '@/hooks/useThemeColor';


interface BottomScreenProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showHeaderLine?: boolean;
}

/**
 * Eine Komponente, die Inhalte in einem Bottom Sheet anzeigt,
 * das von unten nach oben eingeblendet wird und nur so hoch ist wie sein Inhalt.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {boolean} props.visible - Ob das Bottom Sheet angezeigt werden soll
 * @param {Function} props.onClose - Callback-Funktion zum Schließen des Sheets
 * @param {string} [props.title] - Optionaler Titel für das Bottom Sheet
 * @param {React.ReactNode} props.children - Inhalte, die im Sheet angezeigt werden
 * @param {boolean} [props.showHeaderLine] - Ob die Trennlinie unter dem Header angezeigt werden soll
 * @returns {React.ReactElement} Die gerenderte BottomScreen-Komponente
 */
export function BottomScreen({
  visible,
  onClose,
  title,
  children,
  showHeaderLine = true,
}: BottomScreenProps): React.ReactElement {
  const themeColors = useThemeColor();
  const [contentHeight, setContentHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * 0.9;
  const minHeight = screenHeight * 0.25; // Etwas höhere Mindesthöhe für bessere Benutzererfahrung
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Rücksetz-Threshold: Wenn der Nutzer mehr als 20% der Höhe nach unten zieht, schließen wir das Sheet
  const dismissThreshold = 0.2;
  
  // Pan Responder für Swipe-Geste
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Nur vertikale Bewegungen abfangen
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        // Nur nach unten swipen erlauben (positives dy)
        if (gestureState.dy > 0) {
          // Das Sheet proportional zur Swipe-Bewegung verschieben
          slideAnim.setValue(1 - gestureState.dy / (contentHeight || screenHeight / 2));
          
          // Hintergrund-Opacity proportional zur Swipe-Bewegung verringern
          const newOpacity = 1 - gestureState.dy / (contentHeight || screenHeight / 2);
          fadeAnim.setValue(Math.max(0, newOpacity));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Wenn weit genug nach unten gezogen wurde, schließen
        if (gestureState.dy > (contentHeight || screenHeight / 2) * dismissThreshold) {
          onClose();
        } else {
          // Sonst zurück zur Ausgangsposition animieren
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 40,
              friction: 8,
            }),
            Animated.spring(fadeAnim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 40,
              friction: 8,
            }),
          ]).start();
        }
      },
    })
  ).current;
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }),
        Animated.spring(fadeAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);
  
  const onContentLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    // Minimale Höhe verwenden, falls der Inhalt zu klein ist
    setContentHeight(Math.max(Math.min(height, maxHeight), minHeight));
  };
  
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [contentHeight > 0 ? contentHeight : screenHeight * 0.5, 0],
  });
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={[
            styles.backdrop, 
            { opacity: fadeAnim, backgroundColor: 'rgba(0, 0, 0, 0.6)' }
          ]}
        >
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.container,
                  {
                    backgroundColor: themeColors.backgroundPrimary,
                    transform: [{ translateY }],
                    maxHeight: maxHeight,
                    minHeight: minHeight,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 15,
                  },
                ]}
              >
                {/* Drag-Indicator mit Glow-Effekt */}
                <View style={styles.dragIndicatorContainer}>
                  <LinearGradient
                    colors={[themeColors.backgroundPrimary, themeColors.backgroundSecondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.dragIndicatorBackground}
                  >
                    <View style={styles.indicator} />
                  </LinearGradient>
                </View>
                
                {/* Header mit Titel und Schließen-Button */}
                <View style={[
                  styles.header, 
                  showHeaderLine && { 
                    borderBottomColor: themeColors.divider,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }
                ]}>
                  {title && (
                    <Text style={[styles.title, { color: themeColors.textPrimary }]}>
                      {title}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                  >
                    <Ionicons name="close" color={themeColors.textSecondary} size={24} />
                  </TouchableOpacity>
                </View>
                
                {/* Content mit Scroll-Bereich */}
                <ScrollView 
                  style={[styles.scrollContainer, { maxHeight: maxHeight - 120 }]}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  onLayout={onContentLayout}
                  bounces={false}
                >
                  <View style={styles.bodyContainer}>
                    {children}
                  </View>
                </ScrollView>
              </Animated.View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  dragIndicatorContainer: {
    paddingTop: spacing.s,
    paddingBottom: spacing.xs,
    alignItems: 'center',
    zIndex: 1,
    width: '100%',
  },
  dragIndicatorBackground: {
    width: '100%',
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  indicator: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.m,
    top: spacing.m,
  },
  bodyContainer: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.m,
    paddingBottom: spacing.xl * 2, // Mehr Padding am Ende für bessere Lesbarkeit und mehr Platz zum Scrollen
  },
}); 