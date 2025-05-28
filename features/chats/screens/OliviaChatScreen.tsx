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
  Alert,
  Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientButton } from '@/shared-components/button';
import SidebarContainer from '@/shared-components/navigation/SidebarContainer';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { themeColors } from '@/config/theme/colors';
import { logger } from '@/utils/logger';
import FallstudieDetail from '../components/FallstudieDetail';

// Import avatar image
const oliviaAvatar = require('@/assets/small rounded Icon.png') as ImageSourcePropType;

// No conversion function necessary anymore since we work directly with ChatCardData

/**
 * Olivia Chat Screen - Independent component for the Olivia chatbot
 * 
 * This component implements a specialized chat with Olivia
 * and offers a customized user interface and interaction.
 */
export default function OliviaChatScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedLink, setAttachedLink] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showFallstudieDetail, setShowFallstudieDetail] = useState(false);
  const [selectedFallstudie, setSelectedFallstudie] = useState<any>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showPreferencesPopup, setShowPreferencesPopup] = useState(false);
  const [userPreferences, setUserPreferences] = useState('Here you can tell me everything I should consider for future search suggestions.\n\nFor example: "I prefer to work with regional partners", "I am very conservative with tax matters", or "I am open to unconventional solutions."');
  const [isPrefilledText, setIsPrefilledText] = useState(true);
  const [messageRating, setMessageRating] = useState<'up' | 'down' | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const preferencesInputRef = useRef<TextInput>(null);
  const typingDots = useRef(new Animated.Value(0)).current;
  const recordingAnimation = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Mock-Daten für den Olivia-Chat
  const [chat, setChat] = useState({
    id: 'olivia-assistant',
    name: 'Olivia',
    messages: [
      {
        id: '1',
        text: 'Hello! I am Olivia. How can I help you today?',
        time: '14:30',
        isUser: false,
        date: 'Today'
      },
      {
        id: '2',
        text: 'I need a civil engineer urgently.',
        time: '14:32',
        isUser: true,
        date: 'Today'
      },
      {
        id: '3',
        text: 'Understood, you need a civil engineer urgently. To help you in the best possible way, I would need some more information:\n\n1. Is this a temporary or long-term need?\n2. What type of project do you need the civil engineer for?\n3. What special qualifications should the engineer have?\n4. What budget range are we working with?\n5. When is the engineer needed by?',
        time: '14:33',
        isUser: false,
        date: 'Today'
      },
      {
        id: '4',
        text: 'It is a temporary need for about 3 months. We have a renovation project for an apartment building and need someone with experience in structural engineering. Budget is max. €15,000 per month. The engineer should ideally be able to start next week.',
        time: '14:35',
        isUser: true,
        date: 'Today'
      },
      {
        id: '5',
        text: 'Thank you for the information. Is this a project in Germany? And are there preferences regarding the working style - remote, on-site, or hybrid?',
        time: '14:36',
        isUser: false,
        date: 'Today'
      },
      {
        id: '6',
        text: 'Yes, the project is in Munich. We need someone who can be on-site at least 3 days per week. The rest of the time can be worked remotely.',
        time: '14:37',
        isUser: true,
        date: 'Today'
      },
      {
        id: '7',
        text: 'Should the civil engineer be hired as a freelancer or as a temporary employee? And do you have special requirements for professional experience?',
        time: '14:38',
        isUser: false,
        date: 'Today'
      },
      {
        id: '8',
        text: 'Freelancer would be preferred. The person should have at least 5 years of professional experience, ideally with similar renovation projects.',
        time: '14:39',
        isUser: true,
        date: 'Today'
      },
      {
        id: '9',
        text: 'Very good. I now have all the information I need. I have found three case studies that perfectly match your current situation. Choose one:',
        time: '14:40',
        isUser: false,
        date: 'Today'
      }
    ]
  });

  // Fallstudien-Daten für die Chat-Bubble
  const fallstudienErgebnisse: Array<{
    id: string;
    titel: string;
    kurzbeschreibung: string;
    context: string;
    action: string;
    result: {
      text: string;
      bulletpoints: string[];
    };
    anbieter: {
      name: string;
      erfahrung: string;
      erfolgsrate: string;
      kontakt: {
        email: string;
        telefon: string;
      }
    },
    isVerified?: boolean;
    needsVerification?: boolean;
  }> = [
    {
      id: '1',
      titel: 'Statik-Expertise for Multi-Family Homes',
      kurzbeschreibung: 'Successful renovation of complex residential buildings with static challenges',
      context: 'A listed multi-family house in Munich-Schwabing should be comprehensively renovated. The building structure had significant static defects, and the owner community was under time pressure and had to keep costs within the budget.',
      action: 'Our team conducted a comprehensive analysis of the building structure, created a detailed renovation concept with BIM technology, and coordinated the work with local craftsmen. Through innovative solutions, we were able to resolve the static problems without affecting the historical structure.',
      result: {
        text: 'The project was completed on time and within the budget.',
        bulletpoints: [
          'Preservation of 90% of the historical building structure while modernizing',
          'Cost savings of 18% compared to similar projects',
          'Energy optimization with a 35% reduction in heating costs',
          'Completion of the main work 2 weeks ahead of schedule'
        ]
      },
      anbieter: {
        name: 'Baustatik München GmbH',
        erfahrung: '15 years of specialization in building renovation',
        erfolgsrate: '96% timely project completions',
        kontakt: {
          email: 'kontakt@baustatik-muenchen.de',
          telefon: '+49 89 12345678'
        }
      }
    },
    {
      id: '2',
      titel: 'Industrial Building-Use Transformation with High Requirements',
      kurzbeschreibung: 'Transformation of an industrial building into modern lofts while preserving the historical facade',
      context: 'An old industrial building from the 1920s in Munich should be converted into high-quality lofts. The building structure was partially worn out, the steel beams corroded, but the characteristic facade had to be preserved. The building owner had a very ambitious time window of only 14 months.',
      action: 'We developed a two-stage renovation concept with focus on the static strengthening of the load-bearing structure while preserving the facade. Through the use of modern material bonding techniques, we were able to strengthen the existing structure without losing the industrial character. Parallel, tailor-made solutions were developed for sound and thermal insulation.',
      result: {
        text: 'The transformation was completed successfully with the following results:',
        bulletpoints: [
          'Complete preservation of the historical industrial facade',
          'Creation of 24 individual loft apartments with modern standard',
          'Underachievement of the time plan by 6 weeks',
          'Budget adherence despite unforeseen challenges',
          'Awarded the local architecture prize for successful transformation'
        ]
      },
      anbieter: {
        name: 'Industriebau Umnutzung GmbH',
        erfahrung: '20+ years of specialization in transformation projects',
        erfolgsrate: '92% positive customer reviews',
        kontakt: {
          email: 'info@industriebau-umnutzung.de',
          telefon: '+49 89 98765432'
        }
      }
    },
    {
      id: '3',
      titel: 'Cost-Effective Renovation of a Residential Complex',
      kurzbeschreibung: 'Cost-oriented renovation of a 70s residential complex with new usage concept',
      context: 'A residential complex from the 1970s with 42 residential units in Munich-Pasing had significant structural and static defects. The owner community had a limited budget and wanted a cost-effective renovation solution without affecting the living quality.',
      action: 'Our team developed a tailored, cost-conscious renovation concept with focus on the static strengthening of the building. Through digital building inspection, we were able to identify and target weak points precisely and implement cost-efficient, but durable solutions.',
      result: {
        text: 'The renovation was completed successfully with outstanding results:',
        bulletpoints: [
          'Cost savings of 22% compared to similar renovation projects',
          'Extension of the building life expectancy by at least 30 years',
          'Energy efficiency increase by 48% with corresponding heating cost reduction',
          'Minimal disturbance of the residents during the construction phase through efficient planning',
          'Property value increase by an average of 31% after completion of the measures'
        ]
      },
      anbieter: {
        name: 'Effiziente Bausanierung GmbH',
        erfahrung: '12 years of specialization in cost-conscious renovations',
        erfolgsrate: '97% budget adherence',
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

  // Vorfüllen des Textfelds wenn Parameter vorhanden
  useEffect(() => {
    if (params.prefillText && typeof params.prefillText === 'string') {
      setMessage(params.prefillText);
    }
  }, [params.prefillText]);

  // Auto-focus TextInput when preferences popup opens
  useEffect(() => {
    if (showPreferencesPopup) {
      setTimeout(() => {
        preferencesInputRef.current?.focus();
      }, 100);
    }
  }, [showPreferencesPopup]);

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

  // Add link
  const handleAddLink = useCallback(() => {
    // Show dialog to enter a link
    Alert.prompt(
      "Add Link",
      "Enter the URL:",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: (url) => {
            if (url && url.trim()) {
              // Simple URL validation
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

  // Remove attachments
  const handleClearAttachments = useCallback(() => {
    setAttachedImage(null);
    setAttachedLink(null);
  }, []);

  // Start/stop voice input
  const handleVoiceInput = useCallback(() => {
    if (isRecording) {
      // End recording (visual only, no real functionality)
      setIsRecording(false);
    } else {
      // Start recording (visual only, no real functionality)
      setIsRecording(true);
    }
  }, [isRecording]);

  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Send message with attachments
  const handleSendMessage = useCallback(() => {
    if (!message.trim() && !attachedImage && !attachedLink) return;

    let messageText = message;
    
    // Add link to message
    if (attachedLink) {
      messageText += messageText ? `\n${attachedLink}` : attachedLink;
    }

    // Local sending of message
    const newUserMessage = {
      id: `u-${Date.now()}`,
      text: messageText,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      date: 'Today',
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

    // Simulated assistant response (can be replaced by API call later)
    setTimeout(() => {
      const assistantResponses = [
        "Of course, I'm happy to help you with that. I'll look into it.",
        "That's an interesting question. Based on my analysis, I would suggest...",
        "Based on the current market trends, I can give you some information...",
        "I have several solutions for this problem. Here's my recommendation...",
        "For your situation, I would recommend a structured approach. Let's start with..."
      ];
      
      const randomResponse = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      
      const newAssistantMessage = {
        id: `a-${Date.now()}`,
        text: randomResponse,
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        date: 'Today'
      };

      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, newAssistantMessage]
      }));
      
      setIsTyping(false);
    }, 1500);
  }, [message, attachedImage, attachedLink]);

  // Back navigation - öffnet jetzt die Sidebar
  const handleGoBack = useCallback(() => {
    setSidebarVisible(true);
  }, []);

  // Navigate to Explore tab
  const handleExplore = useCallback(() => {
    router.push('/(tabs)/explore');
  }, []);

  // Navigate to Upload screen
  const handleUploadNavigation = useCallback(() => {
    router.push('/upload');
  }, [router]);

  // Save chat
  const handleSaveNavigation = useCallback(() => {
    // You can implement save logic later
    console.log('Chat is being saved...');
  }, []);

  // Group messages by date
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

  // Render individual message
  const renderMessage = useCallback(({ item, index }: { item: (typeof chat.messages)[0] & {image?: string | null, link?: string | null}, index: number }) => {
    const isLastInGroup = index === chat.messages.length - 1 || 
                          chat.messages[index + 1].date !== item.date || 
                          chat.messages[index + 1].isUser !== item.isUser;
    
    // Dynamic text color based on theme
    const textColor = colors.textPrimary;
    const timeColor = colors.textSecondary;

    // If this is the last message from Olivia, show the GigCards
    if (item.id === '9' && !item.isUser) {
      return (
        <View style={[
          styles.messageContainer,
          styles.otherMessageContainer,
          !isLastInGroup && styles.otherMessageGrouped
        ]}>
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
        {item.isUser ? (
          // User messages with theme-based bubble styling
          <View style={[
            styles.messageBubble,
            styles.userBubble,
            { 
              backgroundColor: colors === themeColors.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
            }
          ]}>
            <Text style={[
              styles.messageText,
              { 
                color: colors.textPrimary
              }
            ]}>
              {item.text}
            </Text>
            
            {/* Display images */}
            {item.image && (
              <View style={styles.attachmentContainer}>
                <Image source={{ uri: item.image }} style={styles.attachedImage} />
              </View>
            )}
            
            {/* Display links */}
            {item.link && !item.text.includes(item.link) && (
              <TouchableOpacity 
                style={[styles.linkContainer]}
                onPress={() => Linking.openURL(item.link || '')}
              >
                <Text style={[styles.linkText, { color: '#1E6B55' }]}>
                  {item.link}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // Olivia messages without bubble - just text with dynamic color
          <View style={styles.oliviaMessageContainer}>
            <Text style={[
              styles.oliviaMessageText,
              { color: textColor }
            ]}>
              {item.text}
            </Text>
            
            {/* Display images */}
            {item.image && (
              <View style={styles.attachmentContainer}>
                <Image source={{ uri: item.image }} style={styles.attachedImage} />
              </View>
            )}
            
            {/* Display links */}
            {item.link && !item.text.includes(item.link) && (
              <TouchableOpacity 
                style={[styles.linkContainer]}
                onPress={() => Linking.openURL(item.link || '')}
              >
                <Text style={[styles.linkText, { color: '#1E6B55' }]}>
                  {item.link}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }, [colors]);

  // Display message with case study results
  const renderMessageWithResults = (item: any, messageText: string) => {
    return (
      <View style={styles.caseStudyContainer}>
        {/* Olivia's message text without bubble */}
        <Text style={[
          styles.oliviaMessageText,
          { color: colors.textPrimary, marginBottom: spacing.m }
        ]}>
          {messageText}
        </Text>
        
        {/* Case study results */}
        <View style={styles.fallstudienContainer}>
          {fallstudienErgebnisse.map((studie) => (
            <View key={studie.id} style={styles.fallstudieItem}>
              <View style={styles.fallstudieHeader}>
                <Text style={[styles.fallstudieTitle, { color: colors.textPrimary }]}>
                  Case Study {studie.id}: {studie.titel}
                </Text>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => {
                    // Case Study 1 bekommt isVerified-Flag
                    // Case Study 2 bekommt needsVerification-Flag
                    let studieWithFlags = studie;
                    
                    if (studie.id === '1') {
                      studieWithFlags = {...studie, isVerified: true};
                    } else if (studie.id === '2') {
                      studieWithFlags = {...studie, needsVerification: true};
                    }
                    
                    setSelectedFallstudie(studieWithFlags);
                    setShowFallstudieDetail(true);
                  }}
                >
                  <Text style={[styles.infoButtonText, { color: colors.textPrimary }]}>i</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.fallstudieErgebnis, { color: colors.textPrimary }]}>
                {studie.kurzbeschreibung}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Rating buttons */}
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Was this helpful?</Text>
          <View style={styles.ratingButtons}>
            <TouchableOpacity
              style={[
                styles.ratingButton,
                messageRating === 'up' && styles.ratingButtonActive
              ]}
              onPress={() => handleRatingPress('up')}
            >
              <MaterialCommunityIcons 
                name={messageRating === 'up' ? "thumb-up" : "thumb-up-outline"} 
                size={20} 
                color={messageRating === 'up' ? '#1E6B55' : colors.textSecondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ratingButton,
                messageRating === 'down' && styles.ratingButtonActive
              ]}
              onPress={() => handleRatingPress('down')}
            >
              <MaterialCommunityIcons 
                name={messageRating === 'down' ? "thumb-down" : "thumb-down-outline"} 
                size={20} 
                color={messageRating === 'down' ? '#E53935' : colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
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

  // Render typing indicator
  const renderTypingIndicator = useCallback(() => {
    if (!isTyping) return null;
    
    return (
      <View style={styles.typingContainer}>
        <View style={[
          styles.typingBubble,
          { backgroundColor: '#1F3949' }
        ]}>
          <Animated.View style={[styles.typingDot, { opacity: typingDots, backgroundColor: '#1E6B55' }]} />
          <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4, backgroundColor: '#1E6B55' }]} />
          <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4, backgroundColor: '#1E6B55' }]} />
        </View>
      </View>
    );
  }, [isTyping, typingDots]);

  // Grouped messages with date separators
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

  // Render header and messages together
  const renderHeaderAndMessages = useCallback(() => {
    return (
      <View style={styles.messagesContainer}>
        {/* Solvbox-style header as part of scrollable content */}
        <View style={[styles.solvboxHeaderContainer, chat.messages.length === 1 ? styles.solvboxHeaderContainerNoChat : null]}>
          {/* Content container that is centered independently of the gradient */}
          <View style={styles.solvboxContentContainer}>
            <MaterialCommunityIcons 
              name="semantic-web" 
              size={80} 
              color="#FFFFFF" 
              style={styles.solvboxLogo}
            />
            <View style={styles.solvboxTextContainer}>
              <Text style={[styles.solvboxHeaderSubtitle, { color: colors.textPrimary }]}>
                I'm Olivia and my job is to discover new opportunities for you to increase your liquidity. If you have questions or unresolved problems in your company, I'm always here for you and I'll find the best solution within a few seconds.
              </Text>
              <Text style={[styles.solvboxHeaderSignature, { color: colors.textPrimary }]}>
                Looking forward to a good collaboration!
              </Text>
              <View style={[styles.solvboxHeaderDivider, { backgroundColor: '#1E6B55' }]} />
            </View>
          </View>
        </View>
        
        {/* Chat messages in a container with padding */}
        <View style={styles.chatMessagesContainer}>
          {renderGroupedMessages()}
        </View>
      </View>
    );
  }, [colors, renderGroupedMessages, chat.messages.length]);

  // Render attachment menu
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
            <Text style={[styles.attachmentOptionText, { color: colors.textPrimary }]}>Send Image</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentOption} 
            onPress={handleAddLink}
          >
            <View style={[styles.attachmentIconContainer, { backgroundColor: '#9C27B0' }]}>
              <Ionicons name="link-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachmentOptionText, { color: colors.textPrimary }]}>Send Link</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.attachmentCancelButton, { backgroundColor: colors.backgroundSecondary }]} 
            onPress={() => setShowAttachmentMenu(false)}
          >
            <Text style={[styles.attachmentCancelButtonText, { color: colors.textPrimary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Display selected attachments
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

  // Render function for recording view
  const renderRecordingView = () => {
    if (!isRecording) return null;
    
    return (
      <View style={styles.recordingContainer}>
        <Animated.View style={[
          styles.recordingIndicator,
          { opacity: recordingAnimation, backgroundColor: '#E53935' }
        ]} />
        <Text style={styles.recordingText}>Recording... {formatRecordingTime(recordingDuration)}</Text>
        <TouchableOpacity 
          style={styles.stopRecordingButton}
          onPress={handleVoiceInput}
        >
          <Ionicons name="square" size={18} color="#E53935" />
        </TouchableOpacity>
      </View>
    );
  };

  // Handler for opening preferences popup
  const handleOpenPreferences = () => {
    setIsPrefilledText(true);
    setShowPreferencesPopup(true);
  };

  // Handler for saving user preferences
  const handleSavePreferences = () => {
    // TODO: Save to AsyncStorage or backend
    console.log('Saved preferences:', userPreferences);
    setShowPreferencesPopup(false);
  };

  // Handler for preferences text change
  const handlePreferencesTextChange = (text: string) => {
    if (isPrefilledText) {
      // Clear prefilled text and start fresh when user begins typing
      setUserPreferences(text);
      setIsPrefilledText(false);
    } else {
      setUserPreferences(text);
    }
  };

  // Handler for message rating
  const handleRatingPress = (rating: 'up' | 'down') => {
    setMessageRating(rating);
    // TODO: Send rating to backend/analytics
    console.log('Message rated:', rating);
  };

  // Dynamischer Gradient basierend auf Theme
  const getBackgroundGradient = () => {
    const petrolColor = '#1E6B55'; // Markenfarbe Petrol bleibt konstant
    
    if (colors === themeColors.dark) {
      // Dark Mode: Petrol zu Schwarz
      return {
        colors: [petrolColor, '#000000'] as const,
        locations: [0, 1.0] as const,
      };
    } else {
      // Light Mode: Petrol zu Weiß
      return {
        colors: [petrolColor, '#FFFFFF'] as const,
        locations: [0, 1.0] as const,
      };
    }
  };

  const backgroundGradient = getBackgroundGradient();

  return (
    <SidebarContainer
      sidebarVisible={sidebarVisible}
      onCloseSidebar={() => setSidebarVisible(false)}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Clean Petrol-zu-Schwarz/Weiß Gradient-Hintergrund */}
        <LinearGradient
          colors={backgroundGradient.colors}
          locations={backgroundGradient.locations}
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
            <TouchableOpacity style={styles.headerTitleContainer} onPress={handleOpenPreferences}>
              <View style={styles.chatAvatarContainer}>
                <MaterialCommunityIcons 
                  name="semantic-web" 
                  size={36} 
                  color="#FFFFFF" 
                  style={styles.chatAvatar}
                />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
                  Olivia
                </Text>
                <Text style={[styles.headerSubtitle, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                  Online
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={handleSaveNavigation}>
              <Ionicons name="bookmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuButton, styles.searchButton]} onPress={handleUploadNavigation}>
              <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuButton, styles.searchButton]} onPress={handleExplore}>
              <Ionicons name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Chat messages */}
          <FlatList
            ref={flatListRef}
            data={[]} // Empty data since we use a custom renderer
            renderItem={() => null}
            ListHeaderComponent={renderHeaderAndMessages()}
            ListFooterComponent={renderTypingIndicator()}
            style={styles.chatList}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
          />
          
        </SafeAreaView>
        
        {/* Input area outside SafeAreaView */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? -35 : 0}
          style={styles.keyboardView}
        >
          {renderAttachmentPreview()}
          {renderRecordingView()}
          
          {!isRecording && (
            <View style={[
              styles.inputContainer,
              {
                paddingBottom: keyboardVisible ? 0 : 8 + insets.bottom,
              }
            ]}>
              <TouchableOpacity 
                style={styles.attachButton} 
                onPress={() => setShowAttachmentMenu(true)}
              >
                <Ionicons name="add-outline" size={20} color="rgba(255, 255, 255, 0.9)" />
              </TouchableOpacity>
              
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Message to Olivia..."
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={message}
                  onChangeText={setMessage}
                  multiline={false}
                  keyboardAppearance="dark"
                  ref={preferencesInputRef}
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
        
        {/* Attachment menu modal */}
        {renderAttachmentMenu()}
        
        {/* Case study detail modal */}
        <FallstudieDetail 
          visible={showFallstudieDetail}
          onClose={() => setShowFallstudieDetail(false)}
          fallstudie={selectedFallstudie}
        />

        {/* User Preferences Popup */}
        <Modal
          visible={showPreferencesPopup}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPreferencesPopup(false)}
        >
          <KeyboardAvoidingView
            style={styles.popupOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Same gradient background as main screen */}
            <LinearGradient
              colors={backgroundGradient.colors}
              locations={backgroundGradient.locations}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.popupBackgroundGradient}
            />
            
            <View style={styles.preferencesPopup}>
              <View style={styles.popupHeader}>
                <Text style={[styles.popupTitle, { color: colors.textPrimary }]}>
                  Personal Preferences
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowPreferencesPopup(false)}
                  style={styles.popupCloseButton}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.popupContent}>
                <TextInput
                  style={[
                    styles.popupInput,
                    {
                      color: isPrefilledText ? colors.textSecondary : colors.textPrimary,
                      fontSize: isPrefilledText ? 14 : 16,
                      fontStyle: isPrefilledText ? 'italic' : 'normal',
                    }
                  ]}
                  ref={preferencesInputRef}
                  placeholder="Here you can tell me everything I should consider for future search suggestions..."
                  placeholderTextColor={colors.textTertiary}
                  value={userPreferences}
                  onChangeText={handlePreferencesTextChange}
                  multiline={true}
                  numberOfLines={8}
                  textAlignVertical="top"
                  keyboardAppearance="dark"
                />
              </View>
              
              <View style={styles.popupActions}>
                <GradientButton
                  label="Save Preferences"
                  variant="primary"
                  icon="checkmark-circle-outline"
                  iconSize={20}
                  onPress={handleSavePreferences}
                  containerStyle={styles.saveButtonContainer}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SidebarContainer>
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
    backgroundColor: 'rgba(30, 107, 85, 0.1)',
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
    flex: 1,
  },
  fallstudieErgebnis: {
    fontSize: 13,
    opacity: 0.9,
  },
  infoButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(30, 107, 85, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '45%', // Nur bis 45% der Bildschirmhöhe - noch höher
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
  searchButton: {
    marginLeft: spacing.s,
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
    maxWidth: '95%',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
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
  attachmentCancelButton: {
    borderRadius: ui.borderRadius.l,
    padding: spacing.m,
    alignItems: 'center',
    marginTop: spacing.m,
  },
  attachmentCancelButtonText: {
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
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },
  popupBackgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  preferencesPopup: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.l,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
    width: '100%',
    maxHeight: '85%',
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  popupTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: '600',
  },
  popupCloseButton: {
    padding: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  popupContent: {
    marginBottom: spacing.l,
  },
  popupInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: spacing.l,
    fontSize: 16,
    minHeight: 160,
    backgroundColor: 'rgba(10, 24, 40, 0.6)',
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButton: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#1E6B55',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonContainer: {
    width: '100%',
  },
  saveButtonText: {
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 16,
  },
  saveButtonIcon: {
    marginRight: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.m,
    paddingTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: 'rgba(241, 245, 249, 0.1)',
    backgroundColor: 'rgba(30, 107, 85, 0.1)',
    borderRadius: 8,
    padding: spacing.s,
  },
  ratingLabel: {
    fontSize: typography.fontSize.s,
    fontWeight: '600',
    marginRight: spacing.s,
  },
  ratingButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingButton: {
    padding: spacing.xs,
  },
  ratingButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  oliviaMessageContainer: {
    marginBottom: spacing.s,
    flexDirection: 'row',
    maxWidth: '95%',
  },
  oliviaMessageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  caseStudyContainer: {
    marginBottom: spacing.m,
    width: '100%',
  },
}); 