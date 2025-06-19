import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface EditCasestudyDetailsViewProps {
  visible: boolean;
  fallstudie: any;
  onSave: (editedData: {
    titel: string;
    kurzbeschreibung: string;
    storyText: string;
  }) => void;
  onCancel: () => void;
}

export default function EditCasestudyDetailsView({
  visible,
  fallstudie,
  onSave,
  onCancel,
}: EditCasestudyDetailsViewProps) {
  const { t } = useTranslation();
  
  // Bearbeitbare Felder
  const [editedTitel, setEditedTitel] = useState(fallstudie?.titel || '');
  const [editedKurzbeschreibung, setEditedKurzbeschreibung] = useState(fallstudie?.kurzbeschreibung || '');
  const [editedStoryText, setEditedStoryText] = useState(() => {
    // Generiere einen zusammenhängenden Story-Text aus den bestehenden Daten
    if (!fallstudie) return '';
    
    let storyText = `${fallstudie.context}\n\n${fallstudie.action}\n\n${fallstudie.result.text}`;
    
    // Füge Bullet Points hinzu, falls vorhanden
    if (fallstudie.result.bulletpoints && fallstudie.result.bulletpoints.length > 0) {
      storyText += '\n\nWichtigste Ergebnisse:\n';
      fallstudie.result.bulletpoints.forEach((point: string, index: number) => {
        storyText += `${index + 1}. ${point}\n`;
      });
    }
    
    return storyText;
  });

  const handleSave = () => {
    if (!editedTitel.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Titel ein.');
      return;
    }
    
    if (!editedStoryText.trim()) {
      Alert.alert('Fehler', 'Bitte fülle den Story-Text aus.');
      return;
    }

    onSave({
      titel: editedTitel,
      kurzbeschreibung: editedKurzbeschreibung,
      storyText: editedStoryText,
    });
  };

  const handleReload = () => {
    // Zurücksetzen auf ursprüngliche Werte
    setEditedTitel(fallstudie?.titel || '');
    setEditedKurzbeschreibung(fallstudie?.kurzbeschreibung || '');
    
    let originalStoryText = `${fallstudie.context}\n\n${fallstudie.action}\n\n${fallstudie.result.text}`;
    if (fallstudie.result.bulletpoints && fallstudie.result.bulletpoints.length > 0) {
      originalStoryText += '\n\nWichtigste Ergebnisse:\n';
      fallstudie.result.bulletpoints.forEach((point: string, index: number) => {
        originalStoryText += `${index + 1}. ${point}\n`;
      });
    }
    setEditedStoryText(originalStoryText);
  };

  if (!fallstudie) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.contentOuterContainer}>
          {/* Subtiler Hintergrundverlauf */}
          <LinearGradient
            colors={['rgba(30, 91, 78, 0.05)', 'rgba(30, 75, 91, 0.07)', 'rgba(10, 24, 40, 0.1)']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Header mit Titel und Schließen-Button - EXAKT wie im Screenshot */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <View style={styles.titleLabelRow}>
                <Text style={styles.titleLabel}>{t('casestudy.header.title')}</Text>
              </View>
              <TextInput
                style={[styles.title, styles.editableTitle]}
                value={editedTitel}
                onChangeText={setEditedTitel}
                placeholder="Titel eingeben..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
              />
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onCancel}
            >
              <Ionicons name="close" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {/* Scroll-Container für den Inhalt - EXAKT wie im Screenshot */}
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Kurzbeschreibung als ListCard-Preview - WYSIWYG */}
            <View style={styles.kurzbeschreibungContainer}>
              <View style={styles.kurzbeschreibungContent}>
                {/* ListCard Preview Container */}
                <View style={styles.listCardPreview}>
                  <TextInput
                    style={styles.listCardDescription}
                    value={editedKurzbeschreibung}
                    onChangeText={setEditedKurzbeschreibung}
                    placeholder="Short description for the list view..."
                    placeholderTextColor="rgba(51, 51, 51, 0.5)"
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                <Text style={styles.hintText}>
                  This short version is only displayed in Olivia chat
                </Text>
              </View>
            </View>
            
            {/* Story-Text - EXAKT wie im Screenshot */}
            <View style={styles.storyTextContainer}>
              <TextInput
                style={[styles.storyText, styles.editableStoryText]}
                value={editedStoryText}
                onChangeText={setEditedStoryText}
                placeholder="Erzähle die Geschichte deiner Fallstudie... Beschreibe die Ausgangssituation, was unternommen wurde und welche Ergebnisse erzielt wurden.&#10;&#10;Du kannst auch Auflistungen verwenden:&#10;1. Erstes Ergebnis&#10;2. Zweites Ergebnis&#10;• Weitere Punkte"
                placeholderTextColor="rgba(51, 51, 51, 0.5)"
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
          
          {/* Footer mit Aktions-Buttons - EXAKT wie im Screenshot */}
          <BlurView intensity={20} tint="light" style={styles.footerBlur}>
            <View style={styles.footer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginRight: 8 }]}
                  onPress={handleReload}
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
                      <Text style={[styles.primaryButtonText, styles.verifyButtonText]}>Reload</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1 }]}
                  onPress={handleSave}
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
                      <Text style={[styles.primaryButtonText, styles.verifyButtonText]}>Upload</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

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
    borderWidth: 1,
    borderColor: 'rgba(30, 107, 85, 0.2)',
    shadowColor: '#1E6B55',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
  editableTitle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  kurzbeschreibungContent: {
    flex: 1,
  },
  listCardPreview: {
    backgroundColor: '#FAFBFC',
    borderLeftWidth: 3,
    borderLeftColor: '#1E6B55',
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  listCardDescription: {
    fontSize: 14,
    color: '#333333',
    opacity: 0.8,
    lineHeight: 20,
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(51, 51, 51, 0.5)',
    marginTop: 4,
  },
  storyTextContainer: {
    padding: 24,
  },
  storyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
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
    borderWidth: 1,
    borderColor: 'rgba(30, 107, 85, 0.2)',
    minHeight: 80,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
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
}); 