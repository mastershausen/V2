import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';

interface ChatItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

export default function ChatsScreen() {
  const colors = useThemeColor();

  const chats: ChatItem[] = [
    {
      id: 'olivia',
      title: 'Olivia',
      lastMessage: 'Understood, you need a civil engineer urgently...',
      timestamp: '14:32',
      unread: true,
    },
    {
      id: 'pre-launch',
      title: 'Solvbox Pre-Launch Taktik',
      lastMessage: 'Die Marketing-Strategie sieht gut aus',
      timestamp: 'Gestern',
    },
    {
      id: 'multisport',
      title: 'Multisportplatz Planung Tipps',
      lastMessage: 'Haben Sie die Genehmigungen geprüft?',
      timestamp: 'Mo',
    },
    {
      id: 'iphone',
      title: 'iPhone 13 vs 14 Upgrade',
      lastMessage: 'Die Kamera-Verbesserungen sind minimal',
      timestamp: 'So',
    },
  ];

  const handleChatPress = (chatId: string) => {
    if (chatId === 'olivia') {
      router.push('/chats/olivia');
    }
    // Weitere Chat-Routen können hier hinzugefügt werden
  };

  const renderChatItem = (chat: ChatItem) => (
    <TouchableOpacity
      key={chat.id}
      style={[styles.chatItem, { borderBottomColor: colors.divider }]}
      onPress={() => handleChatPress(chat.id)}
      activeOpacity={0.7}
    >
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatTitle, { color: colors.textPrimary }]}>
            {chat.title}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {chat.timestamp}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text 
            style={[styles.lastMessage, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {chat.lastMessage}
          </Text>
          {chat.unread && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Chats',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.ui.headerBackground,
          },
          headerTintColor: colors.ui.headerText,
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="add" size={24} color={colors.ui.headerText} />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar style="auto" />
      <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
        <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
          {chats.map(renderChatItem)}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    borderBottomWidth: 0.5,
  },
  chatContent: {
    padding: spacing.m,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 14,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    marginRight: spacing.s,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerButton: {
    padding: spacing.s,
  },
}); 