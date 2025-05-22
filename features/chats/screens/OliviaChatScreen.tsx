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
  Image,
  Modal,
  ScrollView,
  Linking,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

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
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedLink, setAttachedLink] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const typingDots = useRef(new Animated.Value(0)).current;
  const recordingAnimation = useRef(new Animated.Value(1)).current;

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
      },
      {
        id: '2',
        text: 'Ich brauche kurzfristig einen Bauingenieur.',
        time: '14:32',
        isUser: true,
        date: 'Heute'
      },
      {
        id: '3',
        text: 'Verstanden, Sie benötigen kurzfristig einen Bauingenieur. Um Ihnen bestmöglich helfen zu können, bräuchte ich noch einige Informationen:\n\n1. Handelt es sich um einen temporären oder langfristigen Bedarf?\n2. Für welche Art von Projekt benötigen Sie den Bauingenieur?\n3. Welche speziellen Qualifikationen sollte der Ingenieur mitbringen?\n4. In welchem Budgetrahmen bewegen wir uns?\n5. Bis wann wird der Ingenieur benötigt?',
        time: '14:33',
        isUser: false,
        date: 'Heute'
      },
      {
        id: '4',
        text: 'Es ist ein temporärer Bedarf für ca. 3 Monate. Wir haben ein Sanierungsprojekt für ein Mehrfamilienhaus und brauchen jemanden mit Erfahrung in der Statik. Budget liegt bei max. 15.000€ pro Monat. Der Ingenieur sollte idealerweise nächste Woche anfangen können.',
        time: '14:35',
        isUser: true,
        date: 'Heute'
      },
      {
        id: '5',
        text: 'Danke für die Informationen. Handelt es sich um ein Projekt in Deutschland? Und gibt es Präferenzen bezüglich der Arbeitsweise - remote, vor Ort oder hybrid?',
        time: '14:36',
        isUser: false,
        date: 'Heute'
      },
      {
        id: '6',
        text: 'Ja, das Projekt ist in München. Wir benötigen jemanden, der mindestens 3 Tage pro Woche vor Ort sein kann. Die restliche Zeit kann remote gearbeitet werden.',
        time: '14:37',
        isUser: true,
        date: 'Heute'
      },
      {
        id: '7',
        text: 'Soll der Bauingenieur als Freelancer oder als temporärer Angestellter eingestellt werden? Und haben Sie besondere Anforderungen an die Berufserfahrung?',
        time: '14:38',
        isUser: false,
        date: 'Heute'
      },
      {
        id: '8',
        text: 'Freelancer wäre bevorzugt. Die Person sollte mindestens 5 Jahre Berufserfahrung haben, idealerweise mit ähnlichen Sanierungsprojekten.',
        time: '14:39',
        isUser: true,
        date: 'Heute'
      },
      {
        id: '9',
        text: 'Sehr gut. Ich habe jetzt alle Infos, die ich brauche. Ich habe drei Fallstudien gefunden, die perfekt zu Ihrer aktuellen Situation passen. Wählen Sie eine aus:',
        time: '14:40',
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

  // Animation für die Aufnahme starten
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Timer für die Aufnahmedauer
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      recordingAnimation.setValue(1);
      setRecordingDuration(0);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording, recordingAnimation]);

  // Bild auswählen
  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAttachedImage(result.assets[0].uri);
      setShowAttachmentMenu(false);
    }
  }, []);

  // Link hinzufügen
  const handleAddLink = useCallback(() => {
    // Dialog zum Eingeben eines Links anzeigen
    Alert.prompt(
      "Link hinzufügen",
      "Geben Sie die URL ein:",
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: (url) => {
            if (url && url.trim()) {
              // Einfache URL-Validierung
              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
              }
              setAttachedLink(url);
              setShowAttachmentMenu(false);
            }
          }
        }
      ],
      "plain-text"
    );
  }, []);

  // Anhänge entfernen
  const handleClearAttachments = useCallback(() => {
    setAttachedImage(null);
    setAttachedLink(null);
  }, []);

  // Spracheingabe starten/stoppen
  const handleVoiceInput = useCallback(() => {
    if (isRecording) {
      // Aufnahme beenden (nur visuell, keine echte Funktionalität)
      setIsRecording(false);
    } else {
      // Aufnahme starten (nur visuell, keine echte Funktionalität)
      setIsRecording(true);
    }
  }, [isRecording]);

  // Formatiere die Aufnahmezeit
  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Nachricht mit Anhängen senden
  const handleSendMessage = useCallback(() => {
    if (!message.trim() && !attachedImage && !attachedLink) return;

    let messageText = message;
    
    // Füge Link zur Nachricht hinzu
    if (attachedLink) {
      messageText += messageText ? `\n${attachedLink}` : attachedLink;
    }

    // Lokales Senden der Nachricht
    const newUserMessage = {
      id: `u-${Date.now()}`,
      text: messageText,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      date: 'Heute',
      image: attachedImage,
      link: attachedLink,
    };

    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, newUserMessage]
    }));

    setMessage('');
    setIsTyping(true);
    handleClearAttachments();

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
  }, [message, attachedImage, attachedLink]);

  // Zurück-Navigation
  const handleGoBack = useCallback(() => {
    // Navigiere zum ChatTab anstatt zurück
    router.navigate('/(tabs)/chats');
  }, [router]);

  // Zum Explore-Tab navigieren
  const handleExploreNavigation = useCallback(() => {
    router.navigate('/(tabs)/mysolvbox');
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
  const renderMessage = useCallback(({ item, index }: { item: (typeof chat.messages)[0] & {image?: string | null, link?: string | null}, index: number }) => {
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
            [styles.userBubble, { backgroundColor: colors.secondary }] : 
            [styles.otherBubble, { backgroundColor: colors.backgroundSecondary }]
        ]}>
          <Text style={[
            styles.messageText,
            { color: item.isUser ? userTextColor : otherTextColor }
          ]}>
            {item.text}
          </Text>
          
          {/* Anzeige von Bildern */}
          {item.image && (
            <View style={styles.attachmentContainer}>
              <Image source={{ uri: item.image }} style={styles.attachedImage} />
            </View>
          )}
          
          {/* Anzeige von Links */}
          {item.link && !item.text.includes(item.link) && (
            <TouchableOpacity 
              style={[styles.linkContainer]}
              onPress={() => Linking.openURL(item.link || '')}
            >
              <Text style={[styles.linkText, { color: item.isUser ? '#FFFFFF' : colors.secondary }]}>
                {item.link}
              </Text>
            </TouchableOpacity>
          )}
          
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
              'rgba(52, 199, 89, 0.25)', 
              'rgba(52, 199, 89, 0.15)', 
              'rgba(52, 199, 89, 0.05)', 
              'rgba(52, 199, 89, 0)'
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
              <View style={[styles.solvboxHeaderDivider, { backgroundColor: colors.secondary }]} />
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

  // Anhang-Menü rendern
  const renderAttachmentMenu = () => (
    <Modal
      visible={showAttachmentMenu}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAttachmentMenu(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={() => setShowAttachmentMenu(false)}
      >
        <View style={[styles.attachmentMenuContainer, { backgroundColor: colors.backgroundPrimary }]}>
          <TouchableOpacity 
            style={styles.attachmentOption} 
            onPress={handlePickImage}
          >
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="image-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachmentOptionText, { color: colors.textPrimary }]}>Bild senden</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentOption} 
            onPress={handleAddLink}
          >
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#9C27B0' }]}>
              <Ionicons name="link-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachmentOptionText, { color: colors.textPrimary }]}>Link senden</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: colors.backgroundSecondary }]} 
            onPress={() => setShowAttachmentMenu(false)}
          >
            <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>Abbrechen</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Anzeige der ausgewählten Anhänge
  const renderAttachmentPreview = () => {
    if (!attachedImage && !attachedLink) return null;
    
    return (
      <View style={styles.attachmentPreviewContainer}>
        {attachedImage && (
          <View style={styles.previewItem}>
            <Image source={{ uri: attachedImage }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeAttachmentButton} onPress={() => setAttachedImage(null)}>
              <Ionicons name="close-circle" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
        
        {attachedLink && (
          <View style={styles.previewItem}>
            <View style={styles.linkPreview}>
              <Ionicons name="link-outline" size={20} color={colors.secondary} />
              <Text style={[styles.linkPreviewText, { color: colors.secondary }]} numberOfLines={1}>
                {attachedLink}
              </Text>
            </View>
            <TouchableOpacity style={styles.removeAttachmentButton} onPress={() => setAttachedLink(null)}>
              <Ionicons name="close-circle" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Renderingfunktion für die Aufnahmeansicht
  const renderRecordingView = () => {
    if (!isRecording) return null;
    
    return (
      <View style={styles.recordingContainer}>
        <Animated.View style={[
          styles.recordingIndicator,
          { opacity: recordingAnimation, backgroundColor: '#E53935' }
        ]} />
        <Text style={styles.recordingText}>Aufnahme läuft... {formatRecordingTime(recordingDuration)}</Text>
        <TouchableOpacity 
          style={styles.stopRecordingButton}
          onPress={handleVoiceInput}
        >
          <Ionicons name="square" size={18} color="#E53935" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color={colors.secondary} />
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
        <TouchableOpacity style={styles.menuButton} onPress={handleExploreNavigation}>
          <Ionicons name="search" size={24} color={colors.textSecondary} />
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
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.backgroundPrimary,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
          }
        ]}
      >
        {renderAttachmentPreview()}
        {renderRecordingView()}
        
        {!isRecording && (
          <View style={[
            styles.inputWrapper, 
            { 
              backgroundColor: colors.backgroundSecondary,
              borderWidth: 1,
              borderColor: colors.divider,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }
          ]}>
            <TouchableOpacity 
              style={styles.attachButton} 
              onPress={() => setShowAttachmentMenu(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Nachricht an Olivia..."
              placeholderTextColor={colors.textTertiary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            
            {message.trim() || attachedImage || attachedLink ? (
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: colors.secondary }]} 
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.voiceButton, { backgroundColor: colors.secondary }]} 
                onPress={handleVoiceInput}
              >
                <Ionicons name="mic" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
      
      {/* Anhang-Menü Modal */}
      {renderAttachmentMenu()}
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
    alignSelf: 'center',
    marginTop: 0,
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
    marginVertical: spacing.xs,
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
  attachButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: 2,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.s,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  attachmentMenuContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  attachmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  attachmentOptionText: {
    fontSize: typography.fontSize.m,
    fontWeight: '500',
  },
  cancelButton: {
    borderRadius: ui.borderRadius.l,
    padding: spacing.m,
    alignItems: 'center',
    marginTop: spacing.m,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  attachmentContainer: {
    marginTop: spacing.s,
    marginBottom: spacing.s,
    borderRadius: ui.borderRadius.m,
    overflow: 'hidden',
  },
  attachedImage: {
    width: '100%',
    height: 200,
    borderRadius: ui.borderRadius.m,
    resizeMode: 'cover',
  },
  linkContainer: {
    marginTop: spacing.s,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  attachmentPreviewContainer: {
    marginBottom: spacing.xs,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    position: 'relative',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: ui.borderRadius.s,
  },
  linkPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: ui.borderRadius.s,
    maxWidth: '85%',
  },
  linkPreviewText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.s,
    textDecorationLine: 'underline',
    maxWidth: '90%',
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
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
    backgroundColor: 'rgba(41, 121, 255, 0.7)',
    borderRadius: 1.5,
    marginTop: spacing.xs,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    borderRadius: ui.borderRadius.l,
    padding: spacing.s,
    marginVertical: spacing.xs,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.s,
  },
  recordingText: {
    flex: 1,
    color: '#E53935',
    fontSize: typography.fontSize.s,
  },
  stopRecordingButton: {
    padding: spacing.xs,
  },
}); 