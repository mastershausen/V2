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

/**
 * Chat-Detail Screen zur Anzeige einer Konversation
 */
export default function ChatDetailScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string, name: string }>();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingDots = useRef(new Animated.Value(0)).current;

  // Bestimme, ob es sich um einen Solvbox-Chat handelt
  const isSolvboxChat = params.name?.includes('Solvbox-');

  // Mock-Daten für den aktuellen Chat
  const [chat, setChat] = useState({
    id: params.id || '1',
    name: params.name || 'Chat',
    isSolvboxChat: isSolvboxChat,
    messages: isSolvboxChat ? 
      // Nachrichten für Solvbox-Chats
      [
        {
          id: '1',
          text: `Hallo! Ich bin der ${params.name}. Wie kann ich Ihnen heute helfen?`,
          time: '14:30',
          isUser: false,
          date: 'Heute'
        }
      ] : 
      // Ausführlichere Nachrichten für reguläre Chats (wie Thomas Müller)
      [
        {
          id: '0-1',
          text: 'Guten Tag, ich freue mich, dass Sie unseren Steuerberatungsservice in Anspruch nehmen möchten.',
          time: '14:15',
          isUser: false,
          date: '15.09.2023'
        },
        {
          id: '0-2',
          text: 'Vielen Dank! Ich würde gerne einen Termin für eine erste Beratung vereinbaren.',
          time: '14:30',
          isUser: true,
          date: '15.09.2023'
        },
        {
          id: '0-3',
          text: 'Natürlich. Ich kann Ihnen den 22. September um 10 Uhr anbieten. Würde das passen?',
          time: '14:45',
          isUser: false,
          date: '15.09.2023'
        },
        {
          id: '0-4',
          text: 'Ja, der Termin passt mir gut. Welche Unterlagen sollte ich mitbringen?',
          time: '15:20',
          isUser: true,
          date: '15.09.2023'
        },
        {
          id: '1-1',
          text: 'Guten Morgen, ich hoffe, Sie hatten ein schönes Wochenende. Für unseren Termin morgen bringen Sie bitte Ihre letzte Steuererklärung und aktuelle Einkommensunterlagen mit.',
          time: '09:20',
          isUser: false,
          date: '21.09.2023'
        },
        {
          id: '1-2',
          text: 'Guten Morgen, danke der Nachfrage. Ich werde die Unterlagen zusammenstellen.',
          time: '10:15',
          isUser: true,
          date: '21.09.2023'
        },
        {
          id: '2-1',
          text: 'Vielen Dank für das Gespräch heute. Ich habe Ihre Unterlagen durchgesehen und werde in den nächsten Tagen einen ersten Entwurf Ihrer Steuererklärung erstellen.',
          time: '15:10',
          isUser: false,
          date: '22.09.2023'
        },
        {
          id: '2-2',
          text: 'Das Gespräch war sehr hilfreich, danke. Ich freue mich auf Ihren Entwurf.',
          time: '16:40',
          isUser: true,
          date: '22.09.2023'
        },
        {
          id: '3-1',
          text: 'Hallo! Wie kann ich Ihnen helfen?',
          time: '10:15',
          isUser: false,
          date: 'Gestern'
        },
        {
          id: '3-2',
          text: 'Guten Tag Herr Müller, ich hätte eine Frage zu meiner letzten Steuererklärung.',
          time: '10:22',
          isUser: true,
          date: 'Gestern'
        },
        {
          id: '3-3',
          text: 'Natürlich, worum geht es genau? Haben Sie Fragen zu bestimmten Abschreibungen oder Angaben?',
          time: '10:30',
          isUser: false,
          date: 'Gestern'
        },
        {
          id: '3-4',
          text: 'Ich bin unsicher, ob ich alle meine Homeoffice-Kosten korrekt angegeben habe. Können Sie mir erklären, welche Kosten genau absetzbar sind?',
          time: '10:45',
          isUser: true,
          date: 'Gestern'
        },
        {
          id: '3-5',
          text: 'Gerne. Bei Homeoffice-Kosten können Sie folgende Ausgaben berücksichtigen:\n\n1. Pauschale von 5€ pro Tag (max. 600€ im Jahr)\n2. Anteilige Mietkosten bei separatem Arbeitszimmer\n3. Internetkosten (anteilig)\n4. Büromaterial\n5. Arbeitsmittel wie PC, Drucker, etc.\n\nHaben Sie diese Posten in Ihrer Steuererklärung berücksichtigt?',
          time: '11:03',
          isUser: false,
          date: 'Gestern'
        },
        {
          id: '3-6',
          text: 'Die Pauschale und Arbeitsmittel ja, aber die anteiligen Mietkosten hatte ich nicht angegeben. Kann ich das noch nachträglich korrigieren?',
          time: '11:10',
          isUser: true,
          date: 'Gestern'
        },
        {
          id: '4-1',
          text: 'Guten Morgen. Haben Sie Ihre Unterlagen für die Steuererklärung schon vorbereitet?',
          time: '09:20',
          isUser: false,
          date: 'Heute'
        },
        {
          id: '4-2',
          text: 'Ja, ich habe alle Dokumente zusammengestellt. Wann könnten wir einen Termin vereinbaren?',
          time: '14:30',
          isUser: true,
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
      const responseOptions = [
        "Das ist eine interessante Frage. Ich habe einige Informationen für Sie zu diesem Thema.",
        "Gerne helfe ich Ihnen dabei. Hier sind einige relevante Informationen.",
        "Ich verstehe Ihr Anliegen. Lassen Sie mich nachschauen.",
        "Ich habe zu diesem Thema verschiedene Informationen für Sie zusammengestellt.",
        "Vielen Dank für Ihre Anfrage. Ich schaue gleich nach den passenden Informationen.",
      ];
      
      const randomIndex = Math.floor(Math.random() * responseOptions.length);
      
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: responseOptions[randomIndex],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        date: 'Heute'
      };
      
      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, botResponse]
      }));
      setIsTyping(false);
    }, 1500);
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
  const renderMessage = ({ item, index }: { item: typeof chat.messages[0], index: number }) => {
    const isUser = item.isUser;
    
    // Überprüfen, ob eine Datumstrenner-Linie angezeigt werden soll
    const shouldShowDateSeparator = index > 0 && 
      chat.messages[index].date !== chat.messages[index-1].date;
    
    return (
      <>
        {shouldShowDateSeparator && renderDateSeparator(item.date)}
        <View style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer
        ]}>
          <View style={styles.messageContentContainer}>
            <View style={[
              styles.messageBubble,
              isUser 
                ? [styles.userBubble, { backgroundColor: colors.primary }] 
                : [styles.botBubble, { backgroundColor: colors.divider + '30' }]
            ]}>
              <Text style={[
                styles.messageText,
                { color: isUser ? 'white' : colors.textPrimary }
              ]}>
                {item.text}
              </Text>
            </View>
            <Text style={[
              styles.timeText, 
              { 
                color: colors.textTertiary,
                alignSelf: isUser ? 'flex-end' : 'flex-start' 
              }
            ]}>
              {item.time}
            </Text>
          </View>
        </View>
      </>
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
            {chat.isSolvboxChat ? (
              <Image source={solvboxAvatar} style={styles.headerAvatarImage} />
            ) : (
              <View style={[styles.headerAvatar, { backgroundColor: colors.primary }]}>
                <Ionicons name="person-outline" size={20} color="white" />
              </View>
            )}
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
          chat.isSolvboxChat ? (
            <View style={styles.chatStartContainer}>
              <LinearGradient
                colors={[
                  chat.isSolvboxChat ? colors.secondary + '40' : colors.primary + '30', 
                  chat.isSolvboxChat ? colors.secondary + '10' : colors.primary + '10'
                ]}
                style={styles.chatStartBackground}
              >
                <View style={styles.chatStartAvatarContainer}>
                  {chat.isSolvboxChat ? (
                    <Image source={solvboxAvatar} style={styles.chatStartAvatarImage} />
                  ) : (
                    <View style={[styles.chatStartAvatar, { backgroundColor: colors.primary }]}>
                      <Ionicons name="person-outline" size={28} color="white" />
                    </View>
                  )}
                </View>
                <Text style={[styles.chatStartTitle, { color: colors.textPrimary }]}>
                  {chat.name}
                </Text>
                <Text style={[styles.chatStartSubtitle, { color: colors.textSecondary }]}>
                  {chat.isSolvboxChat 
                    ? 'Ihr persönlicher Assistent für Unternehmensberatung und Problemlösungen.'
                    : 'Willkommen im Chat. Wie kann ich Ihnen heute helfen?'
                  }
                </Text>
              </LinearGradient>
            </View>
          ) : null
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
              placeholder={`Nachricht an ${chat.name}...`}
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
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  chatStartAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  messageContentContainer: {
    flexDirection: 'column',
    maxWidth: '80%',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.l,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    marginTop: 4,
    marginHorizontal: 4,
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