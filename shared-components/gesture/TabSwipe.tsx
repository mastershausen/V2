import React, { useImperativeHandle, useRef, useCallback, useEffect, useMemo, forwardRef } from 'react';
import { View, StyleSheet, useWindowDimensions, FlatList, ListRenderItem, StyleProp, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  runOnJS
} from 'react-native-reanimated';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TabConfig } from '@/shared-components/container/TabScreensContainer';

/**
 * Eigenschaften für die TabSwipe-Komponente
 */
interface TabSwipeProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onScroll?: (offset: number) => void;
  style?: StyleProp<ViewStyle>;
  screenStyle?: StyleProp<ViewStyle>;
  tabbarComponent?: React.ReactNode;
}

/**
 * Öffentliche API für die TabSwipe-Komponente
 */
export interface TabSwipeRef {
  scrollToTab: (tabId: string) => void;
}

/**
 * Komponente für horizontales Swipen zwischen Tabs mit Animation
 * Verwendet FlatList mit react-native-reanimated für flüssige native Animationen.
 * @returns {React.ComponentType} Eine React-Komponente, die einen animierten FlatList erstellt
 */
function createAnimatedFlatList<T>(): React.ComponentType<React.ComponentPropsWithRef<typeof FlatList<T>>> {
  return Animated.createAnimatedComponent(FlatList) as unknown as React.ComponentType<React.ComponentPropsWithRef<typeof FlatList<T>>>;
}

/**
 * Swipeable-Container für Tab-Inhalte
 * @param {TabSwipeProps} props - Die Eigenschaften der Komponente
 * @param {React.ForwardedRef<TabSwipeRef>} ref - Ref-Objekt zum programmatischen Zugriff auf die TabSwipe-Funktionen
 * @returns {React.ReactElement} Ein React-Element, das den TabSwipe darstellt
 */
function TabSwipeComponent(
  {
    tabs,
    activeTab,
    onTabChange,
    onScroll,
    style,
    screenStyle,
    tabbarComponent
  }: TabSwipeProps,
  ref: React.ForwardedRef<TabSwipeRef>
): React.ReactElement {
  const colors = useThemeColor();
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const AnimatedFlatList = useMemo(() => createAnimatedFlatList<TabConfig>(), []);
  const flatListRef = useRef<FlatList<TabConfig>>(null);
  
  // Aktuelle Index-Position basierend auf activeTab
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  // Initialisiere scrollX mit useEffect statt direkter Zuweisung
  useEffect(() => {
    scrollX.value = currentIndex * width;
  }, [currentIndex, width, scrollX]);

  // Kombinierte Styles mit useMemo
  const containerStyles = useMemo(() => [
    styles.container,
    { backgroundColor: colors.backgroundPrimary },
    style
  ], [colors.backgroundPrimary, style]);

  const screenStyles = useMemo(() => [
    styles.screen, 
    { width },
    screenStyle
  ], [width, screenStyle]);

  useImperativeHandle(ref, () => ({
    scrollToTab: (tabId: string) => {
      const tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex !== -1 && flatListRef.current) {
        isDragging.value = false;
        flatListRef.current.scrollToIndex({
          index: tabIndex,
          animated: true,
        });
      }
    }
  }), [tabs, isDragging]);

  // Handler für externe Kommunikation
  const updateActiveTab = useCallback((index: number): void => {
    if (index >= 0 && index < tabs.length) {
      const newTabId = tabs[index].id;
      if (newTabId !== activeTab) {
        // DEBUG: Tab-Wechsel in TabSwipe erkannt
        console.log('TabSwipe updating active tab from', activeTab, 'to', newTabId, 'at index', index);
        onTabChange(newTabId);
      }
    }
  }, [tabs, activeTab, onTabChange]);

  // Handler für externes Scroll-Tracking  
  const reportScrollPosition = useCallback((x: number): void => {
    if (onScroll) {
      onScroll(x);
    }
  }, [onScroll]);

  // Animierter Scroll-Handler mit nativem Treiber - vereinfachte Version
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      
      // Nach außen kommunizieren (für Tab-Indikator)
      if (onScroll) {
        runOnJS(reportScrollPosition)(event.contentOffset.x);
      }
    },
    onBeginDrag: () => {
      isDragging.value = true;
    },
    onMomentumEnd: (event) => {
      isDragging.value = false;
      const index = Math.round(event.contentOffset.x / width);
      runOnJS(updateActiveTab)(index);
    },
  });

  // Zusätzlicher JS-Handler für native Events
  const handleMomentumScrollEnd = useCallback((event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    updateActiveTab(index);
  }, [width, updateActiveTab]);

  const renderScreen: ListRenderItem<TabConfig> = useCallback(({ item }) => {
    const Component = item.component;
    return (
      <View style={screenStyles}>
        <Component />
      </View>
    );
  }, [screenStyles]);

  const getItemLayout = useCallback((_data: unknown, index: number) => ({
    length: width,
    offset: width * index,
    index,
  }), [width]);

  return (
    <View style={containerStyles}>
      {tabbarComponent}
      <AnimatedFlatList
        ref={flatListRef}
        data={tabs}
        renderItem={renderScreen}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16} 
        getItemLayout={getItemLayout}
        initialScrollIndex={currentIndex}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews={false}
        style={styles.flatList}
        accessible={true}
        accessibilityRole="tablist"
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

// Die eigentliche exportierte Komponente mit korrektem forwardRef
export const TabSwipe = forwardRef(TabSwipeComponent);

// Die display name muss für die Komponenten-Funktion gesetzt werden
TabSwipeComponent.displayName = 'TabSwipe';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    // Leichtes Padding für sicheres Scrollen
    paddingBottom: spacing.m,
  },
}); 