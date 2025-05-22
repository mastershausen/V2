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
import FallstudieDetail from '../components/FallstudieDetail';

// Avatar-Bild importieren
const oliviaAvatar = require('@/assets/small rounded Icon.png') as ImageSourcePropType;

// Keine Konvertierungsfunktion mehr notwendig, da wir direkt mit ChatCardData arbeiten

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
  const [showFallstudieDetail, setShowFallstudieDetail] = useState(false);
  const [selectedFallstudie, setSelectedFallstudie] = useState<any>(null);
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

  // Fallstudien-Daten für die Chat-Bubble
  const fallstudienErgebnisse = [
    {
      id: '1',
      titel: 'Statik-Expertise für Mehrfamilienhäuser',
      kurzbeschreibung: 'Erfolgreiche Sanierung von komplexen Wohngebäuden mit statischen Herausforderungen',
      context: 'Ein denkmalgeschütztes Mehrfamilienhaus in München-Schwabing sollte umfassend saniert werden. Die Bausubstanz wies erhebliche statische Mängel auf, die Eigentümergemeinschaft stand unter Zeitdruck und die Kosten mussten im Rahmen bleiben.',
      action: 'Unser Team führte eine umfassende Analyse der Baustruktur durch, erstellte ein detailliertes Sanierungskonzept mit BIM-Technologie und koordinierte die Arbeiten mit lokalen Handwerksbetrieben. Durch innovative Lösungsansätze konnten wir die statischen Probleme beheben, ohne die historische Substanz zu beeinträchtigen.',
      result: {
        text: 'Das Projekt wurde termingerecht und innerhalb des Budgetrahmens abgeschlossen. Konkrete Ergebnisse:',
        bulletpoints: [
          'Erhaltung von 90% der historischen Bausubstanz bei gleichzeitiger Modernisierung',
          'Kosteneinsparung von 18% gegenüber vergleichbaren Projekten',
          'Energetische Optimierung mit Einsparung von 35% der Heizkosten',
          'Abschluss der Hauptarbeiten 2 Wochen vor dem Zeitplan'
        ]
      },
      anbieter: {
        name: 'Baustatik München GmbH',
        erfahrung: '15 Jahre Spezialisierung auf Altbausanierung',
        erfolgsrate: '96% termingerechte Projektabschlüsse',
        kontakt: {
          email: 'kontakt@baustatik-muenchen.de',
          telefon: '+49 89 12345678'
        }
      }
    },
    {
      id: '2',
      titel: 'Industriegebäude-Umnutzung mit hohen Anforderungen',
      kurzbeschreibung: 'Transformation eines Industriegebäudes zu modernen Wohnlofts bei Erhalt der historischen Fassade',
      context: 'Ein ehemaliges Industriegebäude aus den 1920er Jahren in München sollte zu hochwertigen Wohnlofts umgebaut werden. Die Bausubstanz war teilweise marode, die Stahlträger korrodiert, doch die charakteristische Fassade sollte unbedingt erhalten bleiben. Der Bauherr hatte ein ambitioniertes Zeitfenster von nur 14 Monaten vorgegeben.',
      action: 'Wir entwickelten ein zweistufiges Sanierungskonzept mit Fokus auf die statische Ertüchtigung der Tragkonstruktion bei gleichzeitigem Erhalt der Fassade. Durch den Einsatz moderner Materialverbundtechniken konnten wir die vorhandene Struktur verstärken, ohne den industriellen Charakter zu verlieren. Parallel wurden maßgeschneiderte Lösungen für Schall- und Wärmeschutz entwickelt.',
      result: {
        text: 'Die Umnutzung wurde erfolgreich abgeschlossen mit folgenden Ergebnissen:',
        bulletpoints: [
          'Vollständiger Erhalt der historischen Industriefassade',
          'Schaffung von 24 individuellen Loftwohnungen mit modernstem Standard',
          'Unterschreitung des Zeitplans um 6 Wochen',
          'Einhaltung des Budgets trotz unvorhergesehener Herausforderungen',
          'Auszeichnung mit dem lokalen Architekturpreis für gelungene Umnutzung'
        ]
      },
      anbieter: {
        name: 'Industriebau Umnutzung GmbH',
        erfahrung: '20+ Jahre Spezialisierung auf Umnutzungsprojekte',
        erfolgsrate: '92% positive Kundenbewertungen',
        kontakt: {
          email: 'info@industriebau-umnutzung.de',
          telefon: '+49 89 98765432'
        }
      }
    },
    {
      id: '3',
      titel: 'Kostengünstige Sanierung eines Wohnkomplexes',
      kurzbeschreibung: 'Budgetorientierte Sanierung eines 70er-Jahre Wohnkomplexes mit neuem Nutzungskonzept',
      context: 'Ein Wohnkomplex aus den 1970er Jahren mit 42 Wohneinheiten in München-Pasing wies erhebliche bauliche und statische Mängel auf. Die Eigentümergemeinschaft verfügte über ein begrenztes Budget und wünschte eine wirtschaftliche Sanierungslösung ohne Beeinträchtigung der Wohnqualität.',
      action: 'Unser Team entwickelte ein maßgeschneidertes, kostenbewusstes Sanierungskonzept mit Schwerpunkt auf die statische Ertüchtigung des Gebäudes. Durch digitale Bauwerkserfassung konnten wir präzise Schwachstellen identifizieren und gezielt beheben. Wir koordinierten die Arbeiten unter laufendem Betrieb mit minimaler Beeinträchtigung der Bewohner und implementierten kosteneffiziente, aber langlebige Lösungen.',
      result: {
        text: 'Die Sanierung wurde erfolgreich abgeschlossen mit hervorragenden Ergebnissen:',
        bulletpoints: [
          'Kostenersparnis von 22% gegenüber vergleichbaren Sanierungsprojekten',
          'Verlängerung der Gebäudelebensdauer um mindestens 30 Jahre',
          'Steigerung der Energieeffizienz um 48% mit entsprechender Heizkostenreduzierung',
          'Minimale Beeinträchtigung der Bewohner während der Bauphase durch effiziente Planung',
          'Wertsteigerung der Immobilie um durchschnittlich 31% nach Abschluss der Maßnahmen'
        ]
      },
      anbieter: {
        name: 'Effiziente Bausanierung GmbH',
        erfahrung: '12 Jahre Spezialisierung auf kostenbewusste Sanierungen',
        erfolgsrate: '97% Budgeteinhaltung',
        kontakt: {
          email: 'kontakt@effiziente-bausanierung.de',
          telefon: '+49 172 3456789'
        }
      }
    },
  ];

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
    
    // Einheitliche Textfarbe für alle Nachrichten
    const textColor = '#F1F5F9';
    const timeColor = 'rgba(241, 245, 249, 0.7)';

    // Wenn es sich um die letzte Nachricht von Olivia handelt, zeige die GigCards an
    if (item.id === '9' && !item.isUser) {
      return (
        <View style={[
          styles.messageContainer,
          styles.otherMessageContainer,
          !isLastInGroup && styles.otherMessageGrouped
        ]}>
          <View style={styles.avatarContainer}>
            <Image source={oliviaAvatar} style={styles.avatar} />
          </View>
          {renderMessageWithResults(item, item.text)}
        </View>
      );
    }

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
          item.isUser ? styles.userBubble : styles.otherBubble,
          { backgroundColor: item.isUser ? '#2C5063' : '#1F3949' }
        ]}>
          <Text style={[
            styles.messageText,
            { color: '#F1F5F9' }
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
              <Text style={[styles.linkText, { color: '#63C0C8' }]}>
                {item.link}
              </Text>
            </TouchableOpacity>
          )}
          
          <Text style={[
            styles.timeText,
            { color: timeColor }
          ]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  }, []);

  // Nachricht mit Fallstudien-Ergebnissen anzeigen
  const renderMessageWithResults = (item: any, messageText: string) => {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <View style={[
          styles.messageBubble,
          styles.otherBubble,
          { backgroundColor: '#1F3949' }
        ]}>
          <Text style={[
            styles.messageText,
            { color: '#F1F5F9' }
          ]}>
            {messageText}
          </Text>
          
          {/* Fallstudien-Ergebnisse */}
          <View style={styles.fallstudienContainer}>
            {fallstudienErgebnisse.map((studie) => (
              <View key={studie.id} style={styles.fallstudieItem}>
                <View style={styles.fallstudieHeader}>
                  <Text style={styles.fallstudieTitle}>
                    Fallstudie {studie.id}: {studie.titel}
                  </Text>
                  <TouchableOpacity 
                    style={styles.infoButton}
                    onPress={() => {
                      setSelectedFallstudie(studie);
                      setShowFallstudieDetail(true);
                    }}
                  >
                    <Text style={styles.infoButtonText}>i</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.fallstudieErgebnis}>
                  {studie.kurzbeschreibung}
                </Text>
              </View>
            ))}
          </View>
          
          <Text style={[
            styles.timeText,
            { color: 'rgba(241, 245, 249, 0.7)' }
          ]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

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
          { backgroundColor: '#1F3949' }
        ]}>
          <Animated.View style={[styles.typingDot, { opacity: typingDots, backgroundColor: '#63C0C8' }]} />
          <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4, backgroundColor: '#63C0C8' }]} />
          <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4, backgroundColor: '#63C0C8' }]} />
        </View>
      </View>
    );
  }, [isTyping, typingDots]);

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
              <Text style={[styles.solvboxHeaderSubtitle, { color: '#F1F5F9' }]}>
                Ich bin Olivia und mein Job ist es neue Möglichkeiten zu entdecken, wie Sie Ihre Liquidität steigern können. Sollten Sie Fragen oder ungelöste Probleme in Ihrem Unternehmen haben bin ich immer für Sie da und suche innerhalb von wenigen Sekunden nach der besten Lösung.
              </Text>
              <Text style={[styles.solvboxHeaderSignature, { color: '#F1F5F9' }]}>
                Auf eine gute Zusammenarbeit!
              </Text>
              <View style={[styles.solvboxHeaderDivider, { backgroundColor: '#63C0C8' }]} />
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Futuristischer Gradient-Hintergrund */}
      <LinearGradient
        colors={['#1E5B4E', '#1E4B5B', '#1E3B6B', '#0A1828']}
        locations={[0, 0.3, 0.6, 1.0]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header]}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.chatAvatarContainer}>
              <Image source={oliviaAvatar} style={styles.chatAvatar} />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
                Olivia
              </Text>
              <Text style={[styles.headerSubtitle, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                Online
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={handleExploreNavigation}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          style={styles.keyboardView}
        >
          {renderAttachmentPreview()}
          {renderRecordingView()}
          
          {!isRecording && (
            <View style={styles.inputContainer}>
              <TouchableOpacity 
                style={styles.attachButton} 
                onPress={() => setShowAttachmentMenu(true)}
              >
                <Ionicons name="add-outline" size={20} color="rgba(255, 255, 255, 0.9)" />
              </TouchableOpacity>
              
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nachricht an Olivia..."
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={message}
                  onChangeText={setMessage}
                  multiline={false}
                />
              </View>
              
              {message.trim() || attachedImage || attachedLink ? (
                <TouchableOpacity 
                  style={styles.sendButton} 
                  onPress={handleSendMessage}
                >
                  <Ionicons name="send" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.voiceButton} 
                  onPress={handleVoiceInput}
                >
                  <Ionicons name="mic" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
      
      {/* Anhang-Menü Modal */}
      {renderAttachmentMenu()}
      
      {/* Fallstudie Detail Modal */}
      <FallstudieDetail 
        visible={showFallstudieDetail}
        onClose={() => setShowFallstudieDetail(false)}
        fallstudie={selectedFallstudie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallstudienContainer: {
    width: '100%',
    marginTop: 12,
    marginBottom: 8,
  },
  fallstudieItem: {
    marginBottom: 12,
    backgroundColor: 'rgba(99, 192, 200, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  fallstudieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fallstudieTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#F1F5F9',
    flex: 1,
  },
  fallstudieErgebnis: {
    fontSize: 13,
    color: '#F1F5F9',
    opacity: 0.9,
  },
  infoButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 192, 200, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoButtonText: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: 'bold',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
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
    borderRadius: 14,
    padding: 10,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    fontWeight: '300',
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
    borderRadius: 14,
    borderBottomLeftRadius: 4,
    padding: spacing.s,
    height: 40,
    width: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7AEEFF',
  },
  keyboardView: {
    width: '100%',
    marginTop: 'auto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  inputFieldContainer: {
    flex: 1,
    borderRadius: 18,
    marginHorizontal: 8,
    height: 36,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(10, 24, 40, 0.4)',
    justifyContent: 'center',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 36,
  },
  sendButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
    maxWidth: '92%',
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
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  solvboxHeaderSignature: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as any,
    marginBottom: spacing.s,
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  solvboxHeaderDivider: {
    width: 40,
    height: 3,
    backgroundColor: '#7AEEFF',
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
  // Die Styles für die Chat-Karten wurden in die ChatCard- und ChatCardContainer-Komponenten verschoben
}); 