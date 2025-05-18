import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Keyboard,
  SafeAreaView,
  Animated,
  ImageSourcePropType,
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

// Avatar-Bild importieren
const solvboxAvatar = require('@/assets/small rounded Icon.png') as ImageSourcePropType;

// Mock-Daten für einen Chat
const MOCK_CHAT = {
  id: '1',
  name: 'Solvbox-Assistent',
  avatar: solvboxAvatar,
  isBot: true,
  messages: [
    {
      id: '1',
      text: 'Hallo! Ich bin der Solvbox-Assistent. Wie kann ich dir heute helfen?',
      time: '14:30',
      isUser: false,
      date: 'Heute'
    },
    {
      id: '2',
      text: 'Ich interessiere mich für Steueroptimierung für mein kleines Unternehmen. Kannst du mir Tipps geben?',
      time: '14:32',
      isUser: true,
      date: 'Heute'
    },
    {
      id: '3',
      text: 'Natürlich! Hier sind einige wichtige Punkte zur Steueroptimierung für kleine Unternehmen:\n\n1. Überlege, ob eine GmbH oder eine Personengesellschaft steuerlich vorteilhafter ist\n2. Achte auf abzugsfähige Betriebsausgaben\n3. Optimiere deine Gehaltsstruktur bei einer GmbH\n4. Nutze steuerliche Vorteile durch Investitionen\n5. Plane Entnahmen und Ausschüttungen strategisch\n\nMöchtest du mehr Details zu einem dieser Punkte?',
      time: '14:33',
      isUser: false,
      date: 'Heute'
    },
  ]
};

/**
 * Chat-Detail Screen zur Anzeige einer Konversation
 */
export default function ChatDetailScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(MOCK_CHAT);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingDots = useRef(new Animated.Value(0)).current;

  // Animiere die Schreibindikator-Punkte
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingDots, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingDots, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingDots.setValue(0);
    }
  }, [isTyping, typingDots]);

  // Zum Ende der Liste scrollen wenn neue Nachrichten ankommen
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chat.messages]);

  // Nachricht senden
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Neue Nutzernachricht hinzufügen
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      date: 'Heute'
    };
    
    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
    setMessage('');
    
    // Simulierte Bot-Antwort
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Das ist eine sehr interessante Frage. Ich habe einige hilfreiche Informationen zu diesem Thema, die ich gerne mit dir teilen möchte. Lass mich das für dich recherchieren...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        date: 'Heute'
      };
      
      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, botResponse]
      }));
      setIsTyping(false);
    }, 2000);
  };

  // Zurück zur Chat-Übersicht
  const handleGoBack = () => {
    router.back();
  };

  // Gruppiere Nachrichten nach Datum
  const groupMessagesByDate = () => {
    const grouped: { [key: string]: typeof chat.messages } = {};
    
    chat.messages.forEach(message => {
      if (!grouped[message.date]) {
        grouped[message.date] = [];
      }
      grouped[message.date].push(message);
    });
    
    return Object.entries(grouped).map(([date, messages]) => ({
      date,
      data: messages
    }));
  };

  // Rendert eine einzelne Nachricht
  const renderMessage = ({ item }: { item: typeof chat.messages[0] }) => {
    const isUser = item.isUser;
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.botMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Image source={solvboxAvatar} style={styles.avatarImage} />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser 
            ? [styles.userBubble, { backgroundColor: colors.primary }] 
            : [styles.botBubble, { backgroundColor: colors.backgroundSecondary }]
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? 'white' : colors.textPrimary }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timeText,
            { color: isUser ? 'rgba(255, 255, 255, 0.7)' : colors.textTertiary }
          ]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  // Rendert einen Datumstrenner
  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <View style={[styles.dateLine, { backgroundColor: colors.divider }]} />
      <Text style={[styles.dateText, { color: colors.textTertiary, backgroundColor: colors.backgroundPrimary }]}>
        {date}
      </Text>
      <View style={[styles.dateLine, { backgroundColor: colors.divider }]} />
    </View>
  );

  // "Bot tippt..."-Indikator
  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    // Animierte Position der drei Punkte
    const dot1Opacity = typingDots.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3]
    });
    
    const dot2Opacity = typingDots.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 0.3, 0.5]
    });
    
    const dot3Opacity = typingDots.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.5, 1]
    });
    
    return (
      <View style={styles.messageContainer}>
        <View style={styles.avatarContainer}>
          <Image source={solvboxAvatar} style={styles.avatarImage} />
        </View>
        
        <View style={[styles.typingContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Animated.View style={[styles.typingDot, { opacity: dot1Opacity, backgroundColor: colors.textTertiary }]} />
          <Animated.View style={[styles.typingDot, { opacity: dot2Opacity, backgroundColor: colors.textTertiary }]} />
          <Animated.View style={[styles.typingDot, { opacity: dot3Opacity, backgroundColor: colors.textTertiary }]} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerAvatarContainer}>
            <Image source={solvboxAvatar} style={styles.headerAvatarImage} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              {chat.name}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
              {isTyping ? 'Schreibt...' : 'Online'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Chat-Verlauf */}
      <FlatList
        ref={flatListRef}
        data={chat.messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.chatStartContainer}>
            <LinearGradient
              colors={[colors.secondary + '40', colors.secondary + '10']}
              style={styles.chatStartBackground}
            >
              <View style={styles.chatStartAvatarContainer}>
                <Image source={solvboxAvatar} style={styles.chatStartAvatarImage} />
              </View>
              <Text style={[styles.chatStartTitle, { color: colors.textPrimary }]}>
                {chat.name}
              </Text>
              <Text style={[styles.chatStartSubtitle, { color: colors.textSecondary }]}>
                Dein persönlicher Assistent für Unternehmensberatung und Problemlösungen.
              </Text>
            </LinearGradient>
          </View>
        )}
        ListFooterComponent={renderTypingIndicator}
      />
      
      {/* Eingabebereich */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { borderTopColor: colors.divider }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundSecondary }]}>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              value={message}
              onChangeText={setMessage}
              placeholder="Frage den Solvbox-Assistenten..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={1000}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: message.trim() ? colors.primary : colors.backgroundSecondary }
            ]}
            onPress={handleSendMessage}
            disabled={message.trim() === ''}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={message.trim() ? 'white' : colors.textTertiary} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.s,
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  headerAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
  },
  moreButton: {
    padding: spacing.s,
  },
  chatContent: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.xl,
  },
  chatStartContainer: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
    alignItems: 'center',
  },
  chatStartBackground: {
    width: '100%',
    borderRadius: ui.borderRadius.xl,
    padding: spacing.l,
    alignItems: 'center',
  },
  chatStartAvatarContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  chatStartAvatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  chatStartTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  chatStartSubtitle: {
    fontSize: typography.fontSize.s,
    textAlign: 'center',
    lineHeight: 20,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.m,
  },
  dateLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    paddingHorizontal: spacing.m,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.m,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.m,
    borderRadius: ui.borderRadius.l,
  },
  userBubble: {
    marginLeft: 'auto',
    borderBottomRightRadius: 0,
  },
  botBubble: {
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    flexDirection: 'row',
    padding: spacing.s,
    borderRadius: ui.borderRadius.l,
    marginLeft: spacing.xs,
    borderBottomLeftRadius: 0,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: ui.borderRadius.l,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.s,
    minHeight: 40,
    maxHeight: 120,
  },
  input: {
    fontSize: typography.fontSize.m,
    maxHeight: 100,
  },
  attachButton: {
    padding: spacing.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 