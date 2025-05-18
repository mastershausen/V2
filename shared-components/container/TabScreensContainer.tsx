import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, useWindowDimensions, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { TabSwipe, TabSwipeRef } from '@/shared-components/gesture/TabSwipe';
import { BaseTabConfig } from '@/shared-components/navigation/BaseTabbar';
import { SearchInput } from '@/shared-components/searchinput/SearchInput';

/**
 * Erweiterte Tab-Konfiguration mit Komponenten-Information
 */
export interface TabConfig extends BaseTabConfig {
  component: React.ComponentType;
}

/**
 * Gemeinsame Interface-Definition für Tab-Leisten
 */
export interface TabbarProps {
  tabs: Array<TabConfig | BaseTabConfig>;
  activeTab: string;
  onTabPress: (tabId: string) => void;
  scrollOffset?: number;
  screenWidth?: number;
  style?: StyleProp<ViewStyle>;
  tabItemStyle?: StyleProp<ViewStyle>;
  tabLabelStyle?: StyleProp<TextStyle>;
}

/**
 * Basis-Eigenschaften für eine Tabbar-Komponente
 */
export interface TabbarComponentProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  scrollOffset?: number;
  screenWidth?: number;
  tabs?: Array<TabConfig | BaseTabConfig>;
  style?: StyleProp<ViewStyle>;
  tabItemStyle?: StyleProp<ViewStyle>;
  tabLabelStyle?: StyleProp<TextStyle>;
}

/**
 * Eigenschaften für den TabScreensContainer
 */
export interface TabScreensContainerProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  showSearch?: boolean;
  onSearchChange?: (query: string) => void;
  TabbarComponent: React.ComponentType<TabbarComponentProps>;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  searchPlaceholder?: string;
  compactSearch?: boolean;
  subtleSearch?: boolean;
}

/**
 * Container für Tab-basierte Screens mit Swipe-Funktionalität und optionaler Suchleiste
 * Ermöglicht die Navigation zwischen verschiedenen Tabs durch Tippen oder horizontales Wischen.
 * @param root0
 * @param root0.tabs
 * @param root0.activeTab
 * @param root0.onTabChange
 * @param root0.showSearch
 * @param root0.onSearchChange
 * @param root0.TabbarComponent
 * @param root0.style
 * @param root0.headerStyle
 * @param root0.searchPlaceholder
 * @param root0.compactSearch
 * @param root0.subtleSearch
 */
export function TabScreensContainer({
  tabs,
  activeTab,
  onTabChange,
  showSearch = true,
  onSearchChange,
  TabbarComponent,
  style,
  headerStyle,
  searchPlaceholder = "Suchen...",
  compactSearch,
  subtleSearch
}: TabScreensContainerProps): React.ReactElement {
  const colors = useThemeColor();
  
  // Anhand der Prop-Übergabe entscheiden, ob wir kompakte Darstellung verwenden
  const useCompactSearch = compactSearch !== undefined ? compactSearch : true;
  const useSubtleSearch = subtleSearch !== undefined ? subtleSearch : true;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const { width } = useWindowDimensions();
  const swipeRef = useRef<TabSwipeRef>(null);

  // Kombinierte Styles
  const containerStyles = [
    styles.container, 
    { backgroundColor: colors.backgroundPrimary },
    style
  ];

  const headerStyles = [
    { backgroundColor: colors.backgroundSecondary },
    headerStyle
  ];

  // Spezielle Styles für kompakteres und dezenteres Suchfeld
  const searchContainerStyle = useCompactSearch ? styles.compactSearchContainer : undefined;
  const searchInputStyle = useCompactSearch ? styles.compactSearchInput : undefined;
  // shadow-Level für das Suchfeld
  const searchShadowLevel = useSubtleSearch ? 'none' : 'medium';

  // Event Handler
  const handleTabPress = (tabId: string): void => {
    if (tabId !== activeTab) {
      // DEBUG: Tab-Wechsel im Container
      console.log('TabScreensContainer: Tab pressed -', tabId, '(previous was', activeTab, ')');
      onTabChange(tabId);
      if (swipeRef.current) {
        swipeRef.current.scrollToTab(tabId);
      }
    }
  };

  const handleScroll = (offset: number): void => {
    setScrollOffset(offset);
  };

  const handleSearchChange = (text: string): void => {
    setSearchQuery(text);
    onSearchChange?.(text);
  };

  return (
    <View 
      style={containerStyles}
      accessible={true}
    >
      <SafeAreaView style={headerStyles}>
        {showSearch && (
          <SearchInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder={searchPlaceholder}
            containerStyle={searchContainerStyle}
            inputStyle={searchInputStyle}
            shadowLevel={searchShadowLevel}
          />
        )}
        
        <TabbarComponent
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={handleTabPress}
          scrollOffset={scrollOffset}
          screenWidth={width}
        />
      </SafeAreaView>
      
      <TabSwipe
        ref={swipeRef}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabPress}
        onScroll={handleScroll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  compactSearchContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  compactSearchInput: {
    fontSize: 14,
    height: 38, // Niedrigere Höhe für kompakteres Suchfeld
  },
}); 