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
  Image,
  Modal,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { themeColors } from '@/config/theme/colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { changeLanguage } from '@/i18n/config';

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
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingDots = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  // Stelle die Sprache auf Englisch um
  useEffect(() => {
    changeLanguage('en');
  }, []);

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
          text: `${t('chat.greeting', { name: params.name })}`,
          time: '14:30',
          isUser: false,
          date: t('date.today')
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
          date: t('date.yesterday')
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
          date: t('date.today')
        },
        {
          id: '4-2',
          text: 'Ja, ich habe alle Dokumente zusammengestellt. Wann könnten wir einen Termin vereinbaren?',
          time: '14:30',
          isUser: true,
          date: t('date.today')
        },
        // Fallstudie-Verifizierungsbenachrichtigung
        ...(params.name === 'Laura Schmidt' ? [
          {
            id: '5-1',
            text: `📋 Case Study Verification: "Industrial Building-Use Transformation with High Requirements"\n\nMarkus Weber has listed you as a project partner in this case study. Please confirm your participation.`,
            time: '14:35',
            isUser: false,
            date: t('date.today'),
            isVerificationNotification: true
          }
        ] : [])
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
      date: t('date.today')
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
        t('chat.bot.responses.interesting'),
        t('chat.bot.responses.help'),
        t('chat.bot.responses.understand'),
        t('chat.bot.responses.information'),
        t('chat.bot.responses.thanks'),
      ];
      
      const randomIndex = Math.floor(Math.random() * responseOptions.length);
      
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: responseOptions[randomIndex],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        date: t('date.today')
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

  // Attachment-Menü Funktionen
  const handleAttachmentPress = () => {
    setShowAttachmentMenu(true);
  };

  const handleImagePicker = async () => {
    setShowAttachmentMenu(false);
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Hier würdest du das Bild verarbeiten
      Alert.alert('Image Selected', 'Image would be uploaded here');
    }
  };

  const handleDocumentPicker = async () => {
    setShowAttachmentMenu(false);
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // Hier würdest du das Dokument verarbeiten
        Alert.alert('Document Selected', `Document: ${result.assets[0].name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
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
  const renderMessage = ({ item, index }: { item: typeof chat.messages[0] & { isVerificationNotification?: boolean }, index: number }) => {
    const isUser = item.isUser;
    const isVerification = item.isVerificationNotification;
    
    if (isVerification) {
      return (
        <View style={[styles.messageContainer, styles.botMessageContainer]}>
          <View style={styles.messageContentContainer}>
            <View style={[styles.verificationBubble, { 
              backgroundColor: 'rgba(255, 165, 0, 0.1)',
              borderColor: 'rgba(255, 165, 0, 0.3)'
            }]}>
              <Text style={[styles.messageText, { color: colors.textPrimary }]}>
                {item.text}
              </Text>
              <View style={styles.verificationButtons}>
                <TouchableOpacity style={styles.viewCaseStudyButton}>
                  <LinearGradient
                    colors={['#FF8C00', '#FF6347']}
                    style={styles.verifyButtonGradient}
                  >
                    <Ionicons name="eye" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.verifyButtonText}>View Case Study</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {item.time}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
        <View style={styles.messageContentContainer}>
          <View style={[
            styles.messageBubble,
            isUser ? [styles.userBubble, { backgroundColor: 'rgba(30, 107, 85, 0.1)' }] : [styles.botBubble, { backgroundColor: 'rgba(241, 245, 249, 1)' }]
          ]}>
            <Text style={[styles.messageText, { color: colors.textPrimary }]}>
              {item.text}
            </Text>
          </View>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
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

    return (
      <View style={[styles.messageContainer, styles.botMessageContainer]}>
        <View style={styles.messageContentContainer}>
          <View style={[styles.typingContainer, { backgroundColor: 'rgba(30, 107, 85, 0.1)' }]}>
            <Animated.View style={[styles.typingDot, { backgroundColor: '#1E6B55', opacity: typingDots }]} />
            <Animated.View style={[styles.typingDot, { backgroundColor: '#1E6B55', opacity: typingDots }]} />
            <Animated.View style={[styles.typingDot, { backgroundColor: '#1E6B55', opacity: typingDots }]} />
          </View>
        </View>
      </View>
    );
  };

  // Attachment-Menü rendern
  const renderAttachmentMenu = () => (
    <Modal
      visible={showAttachmentMenu}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAttachmentMenu(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.attachmentMenuContainer, { 
          backgroundColor: colors.backgroundPrimary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
        }]}>
          <TouchableOpacity style={styles.attachmentOption} onPress={handleImagePicker}>
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#1E6B55' }]}>
              <Ionicons name="image" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachmentOptionText, { color: colors.textPrimary }]}>
              Photo & Video Library
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.attachmentOption} onPress={handleDocumentPicker}>
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#1E6B55' }]}>
              <Ionicons name="document-text" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachmentOptionText, { color: colors.textPrimary }]}>
              Document
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.attachmentCancelButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => setShowAttachmentMenu(false)}
          >
            <Text style={[styles.attachmentCancelButtonText, { color: colors.textPrimary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerTitleContainer}
          onPress={() => router.push({
            pathname: `/profile/${chat.id}`,
            params: { name: chat.name }
          })}
        >
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
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {isTyping ? t('chat.status.typing') : t('chat.status.online')}
            </Text>
          </View>
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
                  chat.isSolvboxChat ? colors.secondary + '40' : colors.secondary + '30', 
                  chat.isSolvboxChat ? colors.secondary + '10' : colors.secondary + '10'
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
                    ? t('chat.solvbox.welcome')
                    : t('chat.regular.welcome')
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={[styles.inputContainer, { borderTopColor: 'rgba(30, 107, 85, 0.1)' }]}>
          <TouchableOpacity style={[styles.attachButton, { backgroundColor: '#1E6B55' }]} onPress={handleAttachmentPress}>
            <Ionicons name="add-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={[styles.inputWrapper, { 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(30, 107, 85, 0.3)',
            borderWidth: 0.5
          }]}>
            <TextInput
              style={[styles.input, { color: '#1E293B' }]}
              value={message}
              onChangeText={setMessage}
              placeholder={t('chat.input.placeholder', { name: chat.name })}
              placeholderTextColor="rgba(30, 41, 59, 0.6)"
              multiline={false}
              maxLength={1000}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: message.trim() ? '#1E6B55' : 'rgba(30, 107, 85, 0.3)' }
            ]}
            onPress={handleSendMessage}
            disabled={message.trim() === ''}
          >
            <Ionicons 
              name="send" 
              size={16} 
              color={message.trim() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {renderAttachmentMenu()}
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
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 18,
    marginHorizontal: 8,
    minHeight: 36,
    maxHeight: 100,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  input: {
    color: '#1E293B',
    fontSize: 15,
    paddingVertical: 8,
    minHeight: 36,
    textAlignVertical: 'center',
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationBubble: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.l,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  verificationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.m,
  },
  viewCaseStudyButton: {
    borderRadius: ui.borderRadius.m,
    overflow: 'hidden',
    flex: 1,
  },
  verifyButtonGradient: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: ui.borderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  verifyButtonText: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  attachmentMenuContainer: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.m,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(30, 107, 85, 0.3)',
    borderRadius: ui.borderRadius.m,
    marginBottom: spacing.m,
  },
  attachmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  attachmentOptionText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  attachmentCancelButton: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    alignItems: 'center',
  },
  attachmentCancelButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
  },
}); 