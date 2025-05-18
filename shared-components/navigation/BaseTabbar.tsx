import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle, LayoutChangeEvent } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Basis-Tab-Konfiguration
 */
export interface BaseTabConfig {
  id: string;
  label: string;
}

/**
 * Eigenschaften für die BaseTabbar-Komponente
 */
export interface BaseTabbarProps {
  tabs: BaseTabConfig[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  indicatorStyle?: 'line' | 'dot';
  showShadow?: boolean;
  scrollOffset?: number;
  screenWidth?: number;
  tabContainerStyle?: StyleProp<ViewStyle>;
  tabItemStyle?: StyleProp<ViewStyle>;
  tabLabelStyle?: StyleProp<TextStyle>;
  indicatorContainerStyle?: StyleProp<ViewStyle>;
  indicatorStripStyle?: StyleProp<ViewStyle>;
  indicatorDotStyle?: StyleProp<ViewStyle>;
}

/**
 * Basis-Tabbar-Komponente für alle Tab-basierten Screens
 * 
 * Stellt eine horizontal scrollbare Tab-Leiste mit Indikator für den aktiven Tab dar.
 * Unterstützt verschiedene Indikator-Stile und passt die Animation entsprechend an.
 * @param root0
 * @param root0.tabs
 * @param root0.activeTab
 * @param root0.onTabPress
 * @param root0.indicatorStyle
 * @param root0.showShadow
 * @param root0.scrollOffset
 * @param root0.screenWidth
 * @param root0.tabContainerStyle
 * @param root0.tabItemStyle
 * @param root0.tabLabelStyle
 * @param root0.indicatorContainerStyle
 * @param root0.indicatorStripStyle
 * @param root0.indicatorDotStyle
 */
export function BaseTabbar({ 
  tabs, 
  activeTab,
  onTabPress,
  indicatorStyle = 'line',
  showShadow = false,
  scrollOffset = 0,
  screenWidth = 0,
  tabContainerStyle,
  tabItemStyle,
  tabLabelStyle,
  indicatorContainerStyle,
  indicatorStripStyle,
  indicatorDotStyle
}: BaseTabbarProps): React.ReactElement {
  const colors = useThemeColor();
  const tabLayouts = useRef<{ [key: string]: { x: number, width: number } }>({});
  const tabContainerWidth = useRef<number>(0);
  
  // Animierte Position und Breite des Indikators
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  
  // Lokaler State, um sicherzustellen, dass wir auf Änderungen reagieren
  const [t, setT] = useState(0);

  // DEBUG: Tab-Anzeigeproblem - Prüfe, ob der activeTab korrekt übergeben wird und der Indikator aktualisiert wird
  console.log('BaseTabbar rendering with activeTab:', activeTab, 'tabLayouts:', Object.keys(tabLayouts.current));

  // Effekt, um die Tab-Position zu aktualisieren, wenn sich activeTab ändert
  useEffect(() => {
    const targetTab = tabLayouts.current[activeTab];
    if (targetTab) {
      // Animierter Übergang zu neuem Tab
      indicatorX.value = withTiming(targetTab.x, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      });
      
      indicatorWidth.value = withTiming(targetTab.width, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      });
    }
  }, [activeTab, indicatorX, indicatorWidth, t]);

  // Indikator-Animation basierend auf horizontalem Scrollen
  useEffect(() => {
    if (screenWidth <= 0) return;
    
    // Berechne aktuelle Scroll-Position als Index
    const currentPosition = scrollOffset / screenWidth;
    if (isNaN(currentPosition)) return;
    
    // Ermittle die benachbarten Tabs für die Interpolation
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex === -1) return;
    
    // Interpolation zwischen zwei Tabs könnte hier implementiert werden, wenn gewünscht
  }, [scrollOffset, screenWidth, tabs, activeTab]);

  // Animierter Style für den Indikator
  const indicatorAnimStyle = useAnimatedStyle(() => {
    if (indicatorStyle === 'line') {
      return {
        transform: [{ translateX: indicatorX.value }],
        width: indicatorWidth.value,
      };
    } else {
      // Dot-Stil: Zentriert unter dem Tab
      return {
        transform: [{ translateX: indicatorX.value + indicatorWidth.value / 2 - 4 }],
      };
    }
  });

  // Handler für das Messen der Tab-Positionen
  const handleTabLayout = (tabId: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    
    // Tab-Position speichern
    tabLayouts.current[tabId] = { x, width };
    
    // DEBUG: Tab-Position wurde gemessen
    console.log(`Tab '${tabId}' layout measured:`, { x, width, isActiveTab: tabId === activeTab });
    
    // Aktualisieren, wenn der aktive Tab gemessen wurde
    if (tabId === activeTab) {
      indicatorX.value = x;
      indicatorWidth.value = width;
      setT(prev => prev + 1); // Trigger Re-render
    }
  };

  // Handler für das Messen des Tab-Containers
  const handleTabContainerLayout = (event: LayoutChangeEvent) => {
    tabContainerWidth.current = event.nativeEvent.layout.width;
  };

  // Container-Stil mit optionalem Schatten
  const containerStyle = [
    styles.container,
    showShadow && styles.containerShadow,
    { borderBottomColor: colors.divider },
    tabContainerStyle,
  ];

  return (
    <View style={containerStyle} onLayout={handleTabContainerLayout}>
      {/* Tab-Buttons */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabItem, tabItemStyle]}
            onPress={() => onTabPress(tab.id)}
            onLayout={(e) => handleTabLayout(tab.id, e)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text 
              style={[
                styles.tabLabel, 
                { color: isActive ? colors.primary : colors.textSecondary },
                tabLabelStyle
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      
      {/* Indikator-Container */}
      <View style={[styles.indicatorContainer, indicatorContainerStyle]}>
        {/* Animierter Indikator */}
        <Animated.View 
          style={[
            indicatorStyle === 'line' 
              ? [styles.indicatorStrip, { backgroundColor: colors.primary }, indicatorStripStyle] 
              : [styles.indicatorDot, { backgroundColor: colors.primary }, indicatorDotStyle],
            indicatorAnimStyle
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: 0,
    justifyContent: 'space-around',
    paddingHorizontal: spacing.m,
  },
  containerShadow: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    minWidth: 80,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 1,
  },
  indicatorStrip: {
    height: 3,
    borderRadius: 1.5,
  },
  indicatorDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    bottom: -4,
  },
}); 