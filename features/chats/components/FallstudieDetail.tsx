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
                {fallstudie.isVerified && (
                  <VerifyBadge 
                    text={t('verification.badge.verified')}
                    iconName="checkmark-circle"
                    iconSize={12}
                    style={styles.verifiedBadgeContainer}
                  />
                )}
              </View>
              <Text style={[
                styles.title,
                fallstudie.isVerified && styles.verifiedTitle
              ]}>{fallstudie.titel}</Text>
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
              <Text style={styles.kurzbeschreibungText}>{fallstudie.kurzbeschreibung}</Text>
            </View>
            
            {/* STAR Sektionen */}
            <View style={styles.starContainer}>
              {/* Context */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="document-text-outline" size={20} color="#1E6B55" />
                  </View>
                  <Text style={styles.sectionTitle}>{t('casestudy.sections.context.title')}</Text>
                </View>
                <Text style={styles.sectionText}>{fallstudie.context}</Text>
                <Text style={styles.sectionHint}>{t('casestudy.sections.context.subtitle')}</Text>
              </View>

              {/* Action */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="cog-outline" size={20} color="#1E6B55" />
                  </View>
                  <Text style={styles.sectionTitle}>{t('casestudy.sections.action.title')}</Text>
                </View>
                <Text style={styles.sectionText}>{fallstudie.action}</Text>
                <Text style={styles.sectionHint}>{t('casestudy.sections.action.subtitle')}</Text>
              </View>

              {/* Result */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="trophy-outline" size={20} color="#1E6B55" />
                  </View>
                  <Text style={styles.sectionTitle}>{t('casestudy.sections.result.title')}</Text>
                </View>
                <Text style={styles.sectionText}>{fallstudie.result.text}</Text>
                
                {fallstudie.result.bulletpoints && fallstudie.result.bulletpoints.length > 0 && (
                  <View style={styles.bulletpointContainer}>
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
                
                <Text style={styles.sectionHint}>{t('casestudy.sections.result.subtitle')}</Text>
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
            </View>
          </ScrollView>
          
          {/* Footer mit Aktions-Button */}
          <BlurView intensity={20} tint="dark" style={styles.footerBlur}>
            <View style={styles.footer}>
              {!fallstudie.needsVerification && fallstudie.id !== '3' && (
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
                      styles.verifyButton,
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
                  icon={fallstudie.needsVerification || fallstudie.id === '3' ? 'checkmark-circle-outline' : undefined}
                  iconSize={17}
                  containerStyle={
                    (fallstudie.needsVerification || fallstudie.id === '3') 
                      ? styles.fullWidthButton 
                      : undefined
                  }
                  onPress={() => {
                    if (fallstudie.needsVerification) {
                      setShowVerificationModal(true);
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
    backgroundColor: 'rgba(10, 24, 40, 0.85)',
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
    backgroundColor: '#1E4B5B',
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
  starContainer: {
    padding: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E4B5B',
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 16,
  },
  sectionHint: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
  bulletpointContainer: {
    marginVertical: 16,
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
    color: '#333333',
    lineHeight: 21,
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
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: '#00A041',
  },
  verifiedTitleLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  verifiedTitle: {
    color: '#FFFFFF',
  },
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
  actionVerifyButton: {
    backgroundColor: '#FFD700',
  },
  buttonIcon: {
    marginRight: 8,
    marginTop: 1,
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
});

export default FallstudieDetail; 