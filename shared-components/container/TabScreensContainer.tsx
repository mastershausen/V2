import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, useWindowDimensions, StyleProp, ViewStyle, TextStyle, TouchableOpacity, Text, TextInput, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';
import { TabSwipe, TabSwipeRef } from '@/shared-components/gesture/TabSwipe';
import { BaseTabConfig } from '@/shared-components/navigation/BaseTabbar';
import { SearchInput } from '@/shared-components/searchinput/SearchInput';
import { BottomScreen } from '@/shared-components/navigation/BottomScreen';
import { FloatingChatButton } from '@/shared-components/button';
import { navigateToAssistantChat, isOnChatScreen } from '@/shared-components/navigation/ChatNavigation';

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
  const router = useRouter();
  const pathname = usePathname();
  
  // Überprüfen, ob wir uns auf einer Chat-Seite befinden
  const showChatButton = !isOnChatScreen(pathname);
  
  // Anhand der Prop-Übergabe entscheiden, ob wir kompakte Darstellung verwenden
  const useCompactSearch = compactSearch !== undefined ? compactSearch : true;
  const useSubtleSearch = subtleSearch !== undefined ? subtleSearch : true;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const { width } = useWindowDimensions();
  const swipeRef = useRef<TabSwipeRef>(null);
  
  // State für den Assistenten-Chat
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { 
      id: '1', 
      type: 'assistant', 
      message: 'Hallo! Ich bin der Solvbox-Assistent. Wie kann ich dir heute helfen?'
    }
  ]);

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

  // Event Handler für den Chat: Direkte Navigation zum Assistenten-Chat
  const handleChatButtonPress = () => {
    // Statt das Modal zu öffnen, navigieren wir direkt zum Solvbox-Assistenten Chat
    navigateToAssistantChat(router);
  };

  const handleCloseChatModal = () => {
    setChatVisible(false);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() === '') return;
    
    // Nachricht des Nutzers hinzufügen
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: chatMessage
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    
    // Simulierte Antwort des Assistenten
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        message: `Ich verstehe deine Frage zu "${chatMessage}". Kann ich dir noch etwas anderes erklären?`
      };
      setChatHistory(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  // Rendering der Chat-Nachricht
  const renderChatMessage = ({ item }: any) => {
    const isUser = item.type === 'user';
    return (
      <View style={[
        styles.chatMessageContainer, 
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.assistantAvatarContainer}>
            <View style={styles.assistantAvatar}>
              <Ionicons name="laptop" size={16} color="white" />
            </View>
          </View>
        )}
        <View style={[
          styles.chatMessage, 
          isUser ? [styles.userMessage, { backgroundColor: colors.primary }] : 
          [styles.assistantMessage, { backgroundColor: colors.backgroundSecondary }]
        ]}>
          <Text style={[
            styles.messageText, 
            { color: isUser ? 'white' : colors.textPrimary }
          ]}>
            {item.message}
          </Text>
        </View>
      </View>
    );
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

      {/* Floating Action Button für Chat - nur anzeigen, wenn wir nicht im Chat-Bereich sind */}
      {showChatButton && (
        <FloatingChatButton
          onPress={handleChatButtonPress}
        />
      )}
      
      {/* Chat Popup Modal */}
      <BottomScreen
        visible={chatVisible}
        onClose={handleCloseChatModal}
        title=""
      >
        {/* Benutzerdefinierter Titel mit Logo */}
        <View style={styles.customHeaderContainer}>
          <View style={[styles.logoContainer, { backgroundColor: colors.secondary }]}>
            <Ionicons name="cube-outline" size={20} color="white" />
          </View>
          <Text style={[styles.customHeaderTitle, { color: colors.textPrimary }]}>
            Solvbox-Assistent
          </Text>
        </View>
        
        <View style={styles.chatContainer}>
          {/* Chat-Verlauf */}
          <FlatList
            data={chatHistory}
            renderItem={renderChatMessage}
            keyExtractor={item => item.id}
            style={styles.chatList}
            contentContainerStyle={styles.chatListContent}
          />
          
          {/* Eingabebereich */}
          <View style={[styles.inputContainer, { borderTopColor: colors.divider }]}>
            <TextInput
              style={[styles.chatInput, { 
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary,
                borderColor: colors.divider
              }]}
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholder="Frage den Solvbox-Assistenten..."
              placeholderTextColor={colors.textTertiary}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={handleSendMessage}
              disabled={chatMessage.trim() === ''}
            >
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </BottomScreen>
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
  // chatButton wurde in eine separate Komponente ausgelagert
  // Chat Styles
  chatContainer: {
    flex: 1,
    height: 500, // Höhe des Chat-Containers
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  chatMessageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  chatMessage: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  assistantMessage: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  assistantAvatarContainer: {
    marginRight: 8,
  },
  assistantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Neue Styles für den Header
  customHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 