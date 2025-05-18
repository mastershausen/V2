/**
 * MediaSelector-Komponente
 * 
 * Komponente zur Auswahl und Anzeige von Medien (Bilder/Videos) für Nuggets.
 * Unterstützt das Hinzufügen und Entfernen von Medien mit Vorschau.
 */
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  StyleProp, 
  ViewStyle, 
  Alert,
  ActivityIndicator
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { logger } from '@/utils/logger';

import { NuggetMediaItem, NuggetMediaType } from '../types';

interface MediaSelectorProps {
  /**
   * Aktuelle Medien
   */
  media: NuggetMediaItem[];
  
  /**
   * Callback zum Hinzufügen eines Mediums
   */
  onAddMedia: (media: Omit<NuggetMediaItem, 'id'>) => void;
  
  /**
   * Callback zum Entfernen eines Mediums
   */
  onRemoveMedia: (indexOrId: number | string) => void;
  
  /**
   * Maximal erlaubte Anzahl an Medien
   */
  maxMediaCount?: number;
  
  /**
   * Erlaubte Medientypen
   */
  allowedMediaTypes?: Array<NuggetMediaType>;
  
  /**
   * Funktion zum Hochladen von Medien
   */
  uploadMedia?: (uri: string) => Promise<string>;
  
  /**
   * Aktueller Validierungsfehler
   */
  error?: string;
  
  /**
   * Ob die Komponente deaktiviert sein soll
   */
  disabled?: boolean;
  
  /**
   * Benutzerdefinierte Styles für den Container
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Komponente zur Auswahl und Anzeige von Medien für Nuggets
 * @param {object} props - Die Komponenten-Properties
 * @param {NuggetMediaItem[]} props.media - Aktuelle Medien
 * @param {Function} props.onAddMedia - Callback zum Hinzufügen eines Mediums
 * @param {Function} props.onRemoveMedia - Callback zum Entfernen eines Mediums
 * @param {number} props.maxMediaCount - Maximal erlaubte Anzahl an Medien
 * @param {NuggetMediaType[]} props.allowedMediaTypes - Erlaubte Medientypen
 * @param {Function} props.uploadMedia - Funktion zum Hochladen von Medien
 * @param {string} props.error - Aktueller Validierungsfehler
 * @param {boolean} props.disabled - Ob die Komponente deaktiviert sein soll
 * @param {StyleProp<ViewStyle>} props.style - Benutzerdefinierte Styles für den Container
 * @returns {React.ReactElement} Die MediaSelector-Komponente
 */
function MediaSelector({
  media,
  onAddMedia,
  onRemoveMedia,
  maxMediaCount = 1,
  allowedMediaTypes = ['image', 'video'],
  uploadMedia,
  error,
  disabled = false,
  style
}: MediaSelectorProps): React.ReactElement {
  const colors = useThemeColor();
  
  // Prüfe, ob weitere Medien hinzugefügt werden können
  const canAddMoreMedia = media.length < maxMediaCount;
  
  // Funktion zum Auswählen von Medien aus der Galerie
  const handlePickMedia = useCallback(async () => {
    if (disabled || !canAddMoreMedia) return;
    
    try {
      // Berechtigungen prüfen
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Berechtigung benötigt', 'Die App benötigt Zugriff auf deine Medienbibliothek.');
        return;
      }
      
      // Medienbibliothek öffnen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowedMediaTypes.includes('video') 
          ? ImagePicker.MediaTypeOptions.All 
          : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      
      // Verarbeite die Ergebnisse
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const mediaType: NuggetMediaType = asset.type === 'video' ? 'video' : 'image';
        
        // Wenn der Medientyp nicht erlaubt ist, abbrechen
        if (!allowedMediaTypes.includes(mediaType)) {
          Alert.alert('Nicht unterstützt', `${mediaType === 'video' ? 'Videos' : 'Bilder'} werden nicht unterstützt.`);
          return;
        }
        
        let mediaUrl = asset.uri;
        
        // Wenn eine Upload-Funktion vorhanden ist, das Medium hochladen
        if (uploadMedia) {
          try {
            mediaUrl = await uploadMedia(asset.uri);
          } catch (error) {
            logger.error('Fehler beim Hochladen des Mediums:', error instanceof Error ? error.message : String(error));
            Alert.alert('Fehler', 'Das Medium konnte nicht hochgeladen werden.');
            return;
          }
        }
        
        // Zum Nugget hinzufügen
        onAddMedia({
          type: mediaType,
          url: mediaUrl,
          thumbnailUrl: mediaType === 'video' ? mediaUrl : undefined,
          aspectRatio: asset.width && asset.height ? asset.width / asset.height : 1.5,
          localUri: mediaUrl !== asset.uri ? asset.uri : undefined
        });
      }
    } catch (error) {
      logger.error('Fehler beim Auswählen der Medien:', error instanceof Error ? error.message : String(error));
      Alert.alert('Fehler', 'Die Medien konnten nicht ausgewählt werden.');
    }
  }, [disabled, canAddMoreMedia, allowedMediaTypes, uploadMedia, onAddMedia]);
  
  // Rendere Medien-Vorschau
  const renderMediaPreview = () => {
    if (media.length === 0) return null;
    
    return (
      <View style={styles.mediaContainer}>
        {media.map((item, index) => (
          <View key={item.id || index} style={styles.mediaItemContainer}>
            <Image 
              source={{ uri: item.localUri || item.url }} 
              style={[
                styles.mediaPreview, 
                { aspectRatio: item.aspectRatio || 1.5 }
              ]} 
              resizeMode="cover"
            />
            
            {/* Upload-Indikator */}
            {item.isUploading && (
              <View style={[styles.uploadOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                {item.uploadProgress !== undefined && (
                  <Text style={[styles.uploadProgressText, { color: 'white' }]}>
                    {Math.round(item.uploadProgress)}%
                  </Text>
                )}
              </View>
            )}
            
            {/* Entfernen-Button */}
            <TouchableOpacity 
              style={[styles.removeButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => onRemoveMedia(item.id || index)}
              disabled={disabled}
            >
              <Ionicons 
                name="close" 
                size={18} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };
  
  // Rendere Medien-Auswahl-Button oder leeren Zustand
  const renderMediaSelector = () => {
    if (!canAddMoreMedia) return null;
    
    return (
      <TouchableOpacity 
        style={[
          styles.addMediaButton, 
          { 
            borderColor: colors.divider,
            opacity: disabled ? 0.5 : 1
          }
        ]}
        onPress={handlePickMedia}
        disabled={disabled}
      >
        <Ionicons 
          name="image" 
          size={32} 
          color={colors.textSecondary} 
        />
        <Text style={[styles.addMediaText, { color: colors.textSecondary }]}>
          {allowedMediaTypes.includes('video') 
            ? 'Bild oder Video hinzufügen' 
            : 'Bild hinzufügen'}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {renderMediaPreview()}
      {renderMediaSelector()}
      
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.m,
  },
  mediaContainer: {
    marginBottom: spacing.s,
  },
  mediaItemContainer: {
    position: 'relative',
    marginBottom: spacing.s,
  },
  mediaPreview: {
    width: '100%',
    borderRadius: ui.borderRadius.m,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: ui.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadProgressText: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.m,
    fontWeight: 'bold',
  },
  addMediaButton: {
    width: '100%',
    height: 120,
    borderRadius: ui.borderRadius.m,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMediaText: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.s,
  },
  errorText: {
    fontSize: typography.fontSize.s,
    marginTop: spacing.xs,
  }
});

export { MediaSelector }; 