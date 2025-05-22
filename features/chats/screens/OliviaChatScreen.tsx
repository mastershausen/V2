import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { logger } from '@/utils/logger';

// Avatar-Bild importieren
const oliviaAvatar = require('@/assets/small rounded Icon.png') as ImageSourcePropType;

/**
 * Olivia Chat Screen - Eigenständige Komponente für den Olivia-Chatbot
 * 
 * Diese Komponente implementiert einen spezialisierten Chat mit Olivia
 * und bietet eine maßgeschneiderte Benutzeroberfläche und Interaktion.
 */
export default function OliviaChatScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingDots = useRef(new Animated.Value(0)).current;

  // Mock-Daten für den Olivia-Chat
  const [chat, setChat] = useState({
    id: 'olivia-assistant',
    name: 'Olivia',
    messages: [
      {
        id: '1',
        text: 'Hallo! Ich bin Olivia. Wie kann ich Ihnen heute helfen?',
        time: '14:30',
        isUser: false,
        date: 'Heute'
      }
    ]
  });

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
    }, 300); // Mehr Verzögerung für sanfteres Scrollen
  }, [chat.messages]);

  // Nachricht senden
  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;

    // Lokales Senden der Nachricht
    const newUserMessage = {
      id: `u-${Date.now()}`,
      text: message,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      date: 'Heute'
    };

    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, newUserMessage]
    }));

    setMessage('');
    setIsTyping(true);

    // Simulierte Antwort des Assistenten (kann später durch API-Aufruf ersetzt werden)
    setTimeout(() => {
      const assistantResponses = [
        "Natürlich, ich helfe Ihnen gerne bei dieser Frage. Lassen Sie mich das recherchieren.",
        "Das ist eine interessante Fragestellung. Aus meiner Analyse würde ich folgendes vorschlagen...",
        "Basierend auf den aktuellen Markttrends kann ich Ihnen folgende Informationen geben...",
        "Ich habe verschiedene Lösungsansätze für dieses Problem. Hier ist meine Empfehlung...",
        "Für Ihre Situation würde ich einen strukturierten Ansatz empfehlen. Beginnen wir mit..."
      ];
      
      const randomResponse = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      
      const newAssistantMessage = {
        id: `a-${Date.now()}`,
        text: randomResponse,
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        date: 'Heute'
      };

      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, newAssistantMessage]
      }));
      
      setIsTyping(false);
    }, 1500);
  }, [message]);

  // Zurück-Navigation
  const handleGoBack = useCallback(() => {
    // Navigiere zum ChatTab anstatt zurück
    router.navigate('/(tabs)/chats');
  }, [router]);

  // Nachrichten nach Datum gruppieren
  const groupMessagesByDate = useCallback(() => {
    const messagesByDate: Record<string, typeof chat.messages> = {};
    
    chat.messages.forEach(msg => {
      if (!messagesByDate[msg.date]) {
        messagesByDate[msg.date] = [];
      }
      messagesByDate[msg.date].push(msg);
    });
    
    return messagesByDate;
  }, [chat.messages]);

  // Einzelne Nachricht rendern
  const renderMessage = useCallback(({ item, index }: { item: (typeof chat.messages)[0], index: number }) => {
    const isLastInGroup = index === chat.messages.length - 1 || 
                          chat.messages[index + 1].date !== item.date || 
                          chat.messages[index + 1].isUser !== item.isUser;
    
    // Farbvariablen für die Textfarben
    const userTextColor = '#FFFFFF';  // Weiß für Benutzer-Nachrichten
    const otherTextColor = colors.textPrimary;
    const timeUserColor = '#FFFFFF';  // Weiß für Zeitstempel in Benutzer-Nachrichten
    const timeOtherColor = colors.textSecondary;

    return (
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.otherMessageContainer,
        !isLastInGroup && (item.isUser ? styles.userMessageGrouped : styles.otherMessageGrouped)
      ]}>
        {!item.isUser && (
          <View style={styles.avatarContainer}>
            <Image source={oliviaAvatar} style={styles.avatar} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          item.isUser ? 
            [styles.userBubble, { backgroundColor: colors.primary }] : 
            [styles.otherBubble, { backgroundColor: colors.backgroundSecondary }]
        ]}>
          <Text style={[
            styles.messageText,
            { color: item.isUser ? userTextColor : otherTextColor }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timeText,
            { color: item.isUser ? timeUserColor : timeOtherColor }
          ]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  }, [colors]);

  // Datumstrenner rendern
  const renderDateSeparator = useCallback((date: string) => (
    <View key={date} style={styles.dateSeparator}>
      <View style={[styles.dateContainer, { backgroundColor: colors.backgroundTertiary }]}>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>{date}</Text>
      </View>
    </View>
  ), [colors]);

  // Tipp-Indikator rendern
  const renderTypingIndicator = useCallback(() => {
    if (!isTyping) return null;
    
    return (
      <View style={styles.typingContainer}>
        <View style={styles.avatarContainer}>
          <Image source={oliviaAvatar} style={styles.avatar} />
        </View>
        <View style={[
          styles.typingBubble,
          { backgroundColor: colors.backgroundSecondary }
        ]}>
          <Animated.View style={[styles.typingDot, { opacity: typingDots }]} />
          <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4 }]} />
          <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4 }]} />
        </View>
      </View>
    );
  }, [isTyping, typingDots, colors]);

  // Gruppierte Nachrichten mit Datumstrennern
  const renderGroupedMessages = useCallback(() => {
    const messagesByDate = groupMessagesByDate();
    const dates = Object.keys(messagesByDate);
    
    return dates.map(date => [
      renderDateSeparator(date),
      ...messagesByDate[date].map((item, index) => (
        <View key={item.id}>
          {renderMessage({ item, index })}
        </View>
      ))
    ]);
  }, [groupMessagesByDate, renderDateSeparator, renderMessage]);

  // Header und Nachrichten zusammen rendern
  const renderHeaderAndMessages = useCallback(() => {
    return (
      <View style={styles.messagesContainer}>
        {/* Solvbox-Style Header als Teil des scrollbaren Inhalts */}
        <View style={[styles.solvboxHeaderContainer, chat.messages.length === 1 ? styles.solvboxHeaderContainerNoChat : null]}>
          {/* Hintergrund-Gradient mit absoluter Positionierung */}
          <LinearGradient
            colors={[
              'rgba(0, 170, 110, 0.25)', 
              'rgba(0, 170, 110, 0.15)', 
              'rgba(0, 170, 110, 0.05)', 
              'rgba(0, 170, 110, 0)'
            ]}
            locations={[0, 0.3, 0.6, 0.9]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.solvboxHeaderGradient}
          />
          
          {/* Inhalt-Container, der unabhängig vom Gradient zentriert ist */}
          <View style={styles.solvboxContentContainer}>
            <Image source={oliviaAvatar} style={styles.solvboxLogo} />
            <View style={styles.solvboxTextContainer}>
              <Text style={[styles.solvboxHeaderSubtitle, { color: colors.textSecondary }]}>
                Ich bin Olivia und mein Job ist es neue Möglichkeiten zu entdecken, wie Sie Ihre Liquidität steigern können. Sollten Sie Fragen oder ungelöste Probleme in Ihrem Unternehmen haben bin ich immer für Sie da und suche innerhalb von wenigen Sekunden nach der besten Lösung.
              </Text>
              <Text style={[styles.solvboxHeaderSignature, { color: colors.textSecondary }]}>
                Auf eine gute Zusammenarbeit!
              </Text>
              <View style={styles.solvboxHeaderDivider} />
            </View>
          </View>
        </View>
        
        {/* Chat-Nachrichten in einem Container mit Padding */}
        <View style={styles.chatMessagesContainer}>
          {renderGroupedMessages()}
        </View>
      </View>
    );
  }, [colors, renderGroupedMessages, chat.messages.length]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.chatAvatarContainer}>
            <Image source={oliviaAvatar} style={styles.chatAvatar} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Olivia
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Online
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Chat-Nachrichten */}
      <FlatList
        ref={flatListRef}
        data={[]} // Leere Daten, da wir einen benutzerdefinierten Renderer verwenden
        renderItem={() => null}
        ListHeaderComponent={renderHeaderAndMessages()}
        ListFooterComponent={renderTypingIndicator()}
        style={styles.chatList}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
      />
      
      {/* Eingabebereich */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.inputContainer}
      >
        <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundSecondary }]}>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Nachricht an Olivia..."
            placeholderTextColor={colors.textTertiary}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: colors.primary }]} 
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    borderBottomWidth: 1,
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
  chatAvatarContainer: {
    marginRight: spacing.s,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
  },
  menuButton: {
    padding: spacing.xs,
  },
  assistantBanner: {
    flexDirection: 'row',
    padding: spacing.m,
    alignItems: 'center',
    marginVertical: spacing.m,
    marginHorizontal: spacing.m,
    borderRadius: ui.borderRadius.l,
  },
  assistantLogoContainer: {
    marginRight: spacing.m,
  },
  assistantLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  assistantTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  assistantSubtitle: {
    fontSize: typography.fontSize.s,
    lineHeight: 20,
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    flexGrow: 1, // Wichtig, damit der Inhalt den verfügbaren Platz einnimmt
    paddingBottom: spacing.m,
  },
  messagesContainer: {
    minHeight: '100%', // Stellt sicher, dass der Container die volle Höhe einnimmt
  },
  chatMessagesContainer: {
    paddingHorizontal: spacing.m, // Nur die Chat-Nachrichten bekommen horizontale Paddings
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: spacing.m,
  },
  dateContainer: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: ui.borderRadius.pill,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
  },
  messageContainer: {
    marginBottom: spacing.s,
    flexDirection: 'row',
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageGrouped: {
    marginBottom: 2,
  },
  otherMessageGrouped: {
    marginBottom: 2,
  },
  avatarContainer: {
    marginRight: spacing.xs,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  messageBubble: {
    borderRadius: ui.borderRadius.l,
    padding: spacing.s,
    marginBottom: 2,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: typography.fontSize.m,
    lineHeight: 20,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.s,
    paddingHorizontal: spacing.m,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ui.borderRadius.l,
    borderBottomLeftRadius: 4,
    padding: spacing.s,
    height: 40,
    width: 60,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
  },
  inputContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
    paddingTop: spacing.s,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: ui.borderRadius.l,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.m,
    maxHeight: 100,
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.s,
    marginBottom: 2,
  },
  solvboxHeaderContainer: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: spacing.m,
    position: 'relative',
  },
  solvboxHeaderContainerNoChat: {
    marginBottom: spacing.xl * 2, // Mehr Abstand wenn keine Chat-Nachrichten vorhanden sind
    paddingBottom: spacing.xl,
  },
  solvboxHeaderGradient: {
    position: 'absolute',
    left: -spacing.m * 2, // Weit über den linken Rand hinaus
    right: -spacing.m * 2, // Weit über den rechten Rand hinaus
    top: 0,
    bottom: 0,
    width: '150%', // Deutlich breiter als der Bildschirm
  },
  solvboxContentContainer: {
    paddingTop: spacing.xl * 0.8, // Reduziertes Padding oben, damit das Icon höher erscheint
    paddingBottom: spacing.xl * 2,
    alignItems: 'center',
    zIndex: 1, // Stellt sicher, dass der Inhalt über dem Gradient liegt
  },
  solvboxLogo: {
    width: 80,
    height: 80,
    marginBottom: spacing.m,
  },
  solvboxTextContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    maxWidth: '90%',
  },
  solvboxHeaderTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  solvboxHeaderSubtitle: {
    fontSize: typography.fontSize.s,
    marginTop: spacing.xs,
    marginBottom: spacing.s,
    textAlign: 'center',
    lineHeight: 18,
  },
  solvboxHeaderSignature: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as any,
    marginBottom: spacing.s,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  solvboxHeaderDivider: {
    width: 40,
    height: 3,
    backgroundColor: 'rgba(0, 170, 110, 0.7)',
    borderRadius: 1.5,
    marginTop: spacing.xs,
  },
}); 