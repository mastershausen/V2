import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { GradientButton } from '@/shared-components/button';

import { VerifyBadge } from '@/shared-components/badges';

// Festlegen der Fensterbreite für Berechnungen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface FallstudieDetailProps {
  visible: boolean;
  onClose: () => void;
  fallstudie: {
    id: string;
    titel: string;
    kurzbeschreibung: string;
    context: string;
    action: string;
    result: {
      text: string;
      bulletpoints?: string[];
    };
    anbieter?: {
      name: string;
      erfahrung?: string;
      erfolgsrate?: string;
      kontakt?: {
        email?: string;
        telefon?: string;
      }
    }
    isVerified?: boolean;
    needsVerification?: boolean;
  } | null;
}

const FallstudieDetail: React.FC<FallstudieDetailProps> = ({
  visible,
  onClose,
  fallstudie
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [username, setUsername] = useState('@');
  const { t } = useTranslation();

  // Bearbeitbare Felder für KI-generierte Fallstudie
  const [editedTitel, setEditedTitel] = useState(fallstudie?.titel || '');
  const [editedKurzbeschreibung, setEditedKurzbeschreibung] = useState(fallstudie?.kurzbeschreibung || '');
  const [editedStoryText, setEditedStoryText] = useState(() => {
    // Generiere einen zusammenhängenden Story-Text aus den bestehenden Daten
    if (!fallstudie) return '';
    
    const storyText = `${fallstudie.context}\n\n${fallstudie.action}\n\n${fallstudie.result.text}`;
    return storyText;
  });

  // Ist das die bearbeitbare KI-generierte Fallstudie?
  const isEditable = fallstudie?.id === 'ki-generated-1';

  if (!fallstudie) return null;
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    // Here you could implement actual save logic
    console.log(`Case study ${isSaved ? 'unsaved' : 'saved'}:`, fallstudie.titel);
  };

  const handleUsernameChange = (text: string) => {
    // Stelle sicher, dass das '@' immer am Anfang bleibt
    if (!text.startsWith('@')) {
      setUsername('@' + text.replace('@', ''));
    } else {
      setUsername(text);
    }
  };

  // Generiere einen fließenden Story-Text für nicht-editierbare Fallstudien
  const generateStoryText = (fallstudie: any) => {
    if (!fallstudie) return '';
    
    // Erstelle eine zusammenhängende Story aus Context, Action und Result
    let storyParts = [];
    
    if (fallstudie.context) {
      storyParts.push(fallstudie.context);
    }
    
    if (fallstudie.action) {
      storyParts.push(fallstudie.action);
    }
    
    if (fallstudie.result?.text) {
      storyParts.push(fallstudie.result.text);
    }
    
    return storyParts.join('\n\n');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.modalContainer}>
        <View style={[
          styles.contentOuterContainer,
          fallstudie.isVerified && styles.verifiedContentContainer
        ]}>
          {/* Subtiler Hintergrundverlauf */}
          <LinearGradient
            colors={fallstudie.isVerified 
              ? ['rgba(0, 160, 65, 0.05)', 'rgba(0, 143, 57, 0.07)', 'rgba(0, 107, 47, 0.1)'] 
              : ['rgba(30, 91, 78, 0.05)', 'rgba(30, 75, 91, 0.07)', 'rgba(10, 24, 40, 0.1)']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Header mit Titel und Schließen-Button */}
          <View style={[
            styles.header, 
            fallstudie.isVerified && styles.verifiedHeader
          ]}>
            <View style={styles.titleContainer}>
              <View style={styles.titleLabelRow}>
                <Text style={[
                  styles.titleLabel,
                  fallstudie.isVerified && styles.verifiedTitleLabel
                ]}>{t('casestudy.header.title')}</Text>
              </View>
              {isEditable ? (
                <TextInput
                  style={[
                    styles.title,
                    fallstudie.isVerified && styles.verifiedTitle,
                    styles.editableTitle
                  ]}
                  value={editedTitel}
                  onChangeText={setEditedTitel}
                  placeholder="Titel eingeben..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  multiline
                />
              ) : (
                <Text style={[
                  styles.title,
                  fallstudie.isVerified && styles.verifiedTitle
                ]}>{fallstudie.titel}</Text>
              )}
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {/* Scroll-Container für den Inhalt */}
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Kurzbeschreibung mit Akzentlinie */}
            <View style={styles.kurzbeschreibungContainer}>
              <View style={styles.accentLine} />
              {isEditable ? (
                <TextInput
                  style={[styles.kurzbeschreibungText, styles.editableText]}
                  value={editedKurzbeschreibung}
                  onChangeText={setEditedKurzbeschreibung}
                  placeholder="Kurzbeschreibung eingeben..."
                  placeholderTextColor="rgba(51, 51, 51, 0.5)"
                  multiline
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.kurzbeschreibungText}>{fallstudie.kurzbeschreibung}</Text>
              )}
            </View>
            
            {/* Story-Text */}
            <View style={styles.storyTextContainer}>
              {isEditable ? (
                <TextInput
                  style={[styles.storyText, styles.editableStoryText]}
                  value={editedStoryText}
                  onChangeText={setEditedStoryText}
                  placeholder="Erzähle die Geschichte deiner Fallstudie... Beschreibe die Ausgangssituation, was unternommen wurde und welche Ergebnisse erzielt wurden."
                  placeholderTextColor="rgba(51, 51, 51, 0.5)"
                  multiline
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.storyText}>{generateStoryText(fallstudie)}</Text>
              )}
              
              {/* Bullet Points für Ergebnisse (falls vorhanden) */}
              {fallstudie.result.bulletpoints && fallstudie.result.bulletpoints.length > 0 && (
                <View style={styles.bulletpointContainer}>
                  <Text style={styles.bulletpointHeader}>Wichtigste Ergebnisse:</Text>
                  {fallstudie.result.bulletpoints.map((point, index) => (
                    <View key={index} style={styles.bulletpointItem}>
                      <LinearGradient
                        colors={['#1E6B55', '#15503F']}
                        style={styles.bulletGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                      <Text style={styles.bulletpointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Anbieter/Vermittler Informationen */}
            {fallstudie.anbieter && (
              <View style={styles.anbieterSection}>
                <LinearGradient
                  colors={['rgba(30, 107, 85, 0.1)', 'rgba(30, 107, 85, 0.05)']}
                  style={styles.anbieterGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.anbieterHeader}>
                    <Ionicons name="business-outline" size={18} color="#1E6B55" />
                    <Text style={styles.anbieterName}>{fallstudie.anbieter.name}</Text>
                  </View>
                  
                  <View style={styles.anbieterDetails}>
                    {fallstudie.anbieter.erfahrung && (
                      <View style={styles.anbieterItem}>
                        <Ionicons name="time-outline" size={16} color="#1E6B55" style={styles.anbieterIcon} />
                        <Text style={styles.anbieterText}>{fallstudie.anbieter.erfahrung}</Text>
                      </View>
                    )}
                    
                    {fallstudie.anbieter.erfolgsrate && (
                      <View style={styles.anbieterItem}>
                        <Ionicons name="trending-up-outline" size={16} color="#1E6B55" style={styles.anbieterIcon} />
                        <Text style={styles.anbieterText}>{fallstudie.anbieter.erfolgsrate}</Text>
                      </View>
                    )}
                    
                    {fallstudie.anbieter.kontakt?.email && (
                      <View style={styles.anbieterItem}>
                        <Ionicons name="mail-outline" size={16} color="#1E6B55" style={styles.anbieterIcon} />
                        <Text style={styles.anbieterText}>{fallstudie.anbieter.kontakt.email}</Text>
                      </View>
                    )}
                    
                    {fallstudie.anbieter.kontakt?.telefon && (
                      <View style={styles.anbieterItem}>
                        <Ionicons name="call-outline" size={16} color="#1E6B55" style={styles.anbieterIcon} />
                        <Text style={styles.anbieterText}>{fallstudie.anbieter.kontakt.telefon}</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </View>
            )}
          </ScrollView>
          
          {/* Footer mit Aktions-Button */}
          <BlurView intensity={20} tint="dark" style={styles.footerBlur}>
            <View style={styles.footer}>
              {!fallstudie.needsVerification && fallstudie.id !== '3' && fallstudie.id !== 'ki-generated-1' && (
                <TouchableOpacity 
                  style={styles.iconButton} 
                  onPress={handleSave}
                >
                  <Ionicons 
                    name={isSaved ? "bookmark" : "bookmark-outline"} 
                    size={24} 
                    color="#1E6B55" 
                  />
                </TouchableOpacity>
              )}
              
              {fallstudie.id === '3' ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      styles.rejectButton,
                      { flex: 1, marginRight: 8 }
                    ]}
                    onPress={() => {
                      onClose();
                    }}
                  >
                    <LinearGradient
                      colors={['#E53935', '#C62828']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.buttonContentContainer}>
                        <Ionicons 
                          name="close-circle-outline" 
                          size={17} 
                          color="#FFFFFF"
                          style={styles.buttonIcon}
                        />
                        <Text style={[
                          styles.primaryButtonText,
                          styles.verifyButtonText
                        ]}>Reject</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      { flex: 1 }
                    ]}
                    onPress={() => {
                      onClose();
                    }}
                  >
                    <LinearGradient
                      colors={['#00A041', '#008F39']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.buttonContentContainer}>
                        <Ionicons 
                          name="checkmark-circle-outline" 
                          size={17} 
                          color="#FFFFFF"
                          style={styles.buttonIcon}
                        />
                        <Text style={[
                          styles.primaryButtonText,
                          styles.verifyButtonText
                        ]}>{t('verification.button.confirm')}</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : isEditable ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      { flex: 1, marginRight: 8 }
                    ]}
                    onPress={() => {
                      // Reload - zurücksetzen auf ursprüngliche Werte
                      setEditedTitel(fallstudie?.titel || '');
                      setEditedKurzbeschreibung(fallstudie?.kurzbeschreibung || '');
                      setEditedStoryText(generateStoryText(fallstudie));
                    }}
                  >
                    <LinearGradient
                      colors={['#666666', '#555555']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.buttonContentContainer}>
                        <Ionicons 
                          name="refresh-outline" 
                          size={17} 
                          color="#FFFFFF"
                          style={styles.buttonIcon}
                        />
                        <Text style={[
                          styles.primaryButtonText,
                          styles.verifyButtonText
                        ]}>Reload</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      { flex: 1 }
                    ]}
                    onPress={() => {
                      // Speichern der editierten Fallstudie
                      const editedFallstudie = {
                        ...fallstudie,
                        titel: editedTitel,
                        kurzbeschreibung: editedKurzbeschreibung,
                        context: editedStoryText.split('\n\n')[0],
                        action: editedStoryText.split('\n\n')[1],
                        result: {
                          ...fallstudie.result,
                          text: editedStoryText.split('\n\n')[2]
                        }
                      };
                      console.log('Fallstudie gespeichert:', editedFallstudie);
                      // Hier könnte eine Save-API-Call oder lokale Speicherung implementiert werden
                      onClose();
                    }}
                  >
                    <LinearGradient
                      colors={['#1E6B55', '#15503F']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.buttonContentContainer}>
                        <Ionicons 
                          name="cloud-upload-outline" 
                          size={17} 
                          color="#FFFFFF"
                          style={styles.buttonIcon}
                        />
                        <Text style={[
                          styles.primaryButtonText,
                          styles.verifyButtonText
                        ]}>Upload</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <GradientButton
                  label={fallstudie.needsVerification 
                    ? t('verification.modal.button') 
                    : fallstudie.id === '3' 
                      ? t('verification.button.confirm')
                      : t('casestudy.footer.actionButton')
                  }
                  variant={fallstudie.needsVerification 
                    ? 'attention' 
                    : fallstudie.id === '3' 
                      ? 'success'
                      : 'primary'
                  }
                  icon={fallstudie.needsVerification || fallstudie.id === '3' 
                    ? 'checkmark-circle-outline' 
                    : 'checkmark-circle-outline'}
                  iconSize={17}
                  containerStyle={
                    (fallstudie.needsVerification || fallstudie.id === '3' || fallstudie.id === 'ki-generated-1') 
                      ? styles.fullWidthButton 
                      : undefined
                  }
                  onPress={() => {
                    if (fallstudie.needsVerification) {
                      setShowVerificationModal(true);
                    } else if (isEditable) {
                      // Speichern der editierten Fallstudie
                      const editedFallstudie = {
                        ...fallstudie,
                        titel: editedTitel,
                        kurzbeschreibung: editedKurzbeschreibung,
                        context: editedStoryText.split('\n\n')[0],
                        action: editedStoryText.split('\n\n')[1],
                        result: {
                          ...fallstudie.result,
                          text: editedStoryText.split('\n\n')[2]
                        }
                      };
                      console.log('Fallstudie gespeichert:', editedFallstudie);
                      // Hier könnte eine Save-API-Call oder lokale Speicherung implementiert werden
                      onClose();
                    } else {
                      // Hier könnte eine Aktion wie "Auswählen" oder "Kontakt" implementiert werden
                      onClose();
                    }
                  }}
                />
              )}
            </View>
          </BlurView>
        </View>
      </SafeAreaView>

      {/* Verification modal */}
      <Modal
        visible={showVerificationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{flex: 1}}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowVerificationModal(false)}
          >
            <TouchableOpacity 
              style={styles.modalContent} 
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('verification.notification.title')}</Text>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={styles.inputLabel}>
                  {t('verification.modal.usernamePrompt')}
                </Text>
                
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="@benutzername"
                  placeholderTextColor="rgba(0, 0, 0, 0.35)"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              
              <GradientButton
                label={t('verification.modal.button')}
                variant="success"
                icon="checkmark-circle-outline"
                iconSize={18}
                containerStyle={styles.verifyButtonContainer}
                onPress={() => {
                  setShowVerificationModal(false);
                  // Hier würde die Verifizierung mit dem Benutzernamen durchgeführt werden
                  console.log('Verifizierung mit Benutzername:', username);
                  setUsername('@'); // Zurücksetzen auf @ für die nächste Verwendung
                  onClose();
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 45, 45, 0.85)',
  },
  contentOuterContainer: {
    width: windowWidth * 0.92,
    height: windowHeight * 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#1E6B55',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  titleLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  kurzbeschreibungContainer: {
    padding: 24,
    paddingTop: 24,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  accentLine: {
    width: 3,
    backgroundColor: '#1E6B55',
    borderRadius: 2,
    marginRight: 12,
  },
  kurzbeschreibungText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    flex: 1,
    fontWeight: '500',
  },
  storyTextContainer: {
    padding: 24,
  },
  storyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
  },
  footerBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  iconButton: {
    padding: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContentContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: '100%',
  },
  buttonIcon: {
    position: 'absolute',
    left: '50%',
    marginLeft: -55,
    marginTop: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  verifiedBadgeContainer: {
    marginLeft: 8,
    marginTop: 0,
    transform: [{ scale: 0.8 }],
  },
  verifiedContentContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0, 160, 65, 0.2)',
    shadowColor: '#00A041',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  verifiedHeader: {
    backgroundColor: '#1E6B55',
  },
  verifiedTitleLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  verifiedTitle: {
    color: '#FFFFFF',
  },
  fullWidthButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '45%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E4B5B',
    textAlign: 'center',
  },
  modalBody: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    marginBottom: 24,
    color: '#333333',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  verifyButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonContainer: {
    marginTop: 20,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  rejectButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#C62828',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  editableTitle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editableText: {
    backgroundColor: 'rgba(51, 51, 51, 0.03)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(30, 107, 85, 0.2)',
    minHeight: 80,
  },
  editableStoryText: {
    backgroundColor: 'rgba(51, 51, 51, 0.03)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(30, 107, 85, 0.2)',
    minHeight: 80,
  },
  bulletpointContainer: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  bulletpointHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  bulletpointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletGradient: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 12,
  },
  bulletpointText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    flex: 1,
  },
  anbieterSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  anbieterGradient: {
    padding: 16,
    borderRadius: 12,
  },
  anbieterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 107, 85, 0.1)',
  },
  anbieterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E4B5B',
    marginLeft: 8,
  },
  anbieterDetails: {
    flexDirection: 'column',
  },
  anbieterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  anbieterIcon: {
    width: 20,
  },
  anbieterText: {
    fontSize: 14,
    color: '#555555',
  },
});

export default FallstudieDetail; 