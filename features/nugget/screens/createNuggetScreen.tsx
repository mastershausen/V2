import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import { themeColors } from '@/config/theme/colors';
import { layout } from '@/config/theme/layout';
import { sizes } from '@/config/theme/sizes';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useMode } from '@/hooks';
import { useThemeColor } from '@/hooks/ui/useThemeColor';
import { ProfileImage } from '@/shared-components/media';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { KeyboardToolbar, ToolbarAction } from '@/shared-components/navigation/KeyboardToolbar';
import { useUserStore } from '@/stores/userStore';
import { logger } from '@/utils/logger';

import { LinkManager, MediaSelector } from '../components';
import { useCreateNugget } from '../hooks';
import { NuggetCreationStatus, NuggetMediaType } from '../types';
import { getUserProfileImageUrl } from '../utils/mediaHelpers';

// Konstanten aus dem Theme-System
const MAX_CONTENT_LENGTH = 500;

/**
 * CreateNuggetScreen
 *
 * Hauptscreen zur Erstellung eines neuen Nuggets mit Text, Medien und Links.
 * Nutzt den useCreateNugget-Hook für die gesamte Geschäftslogik.
 * @returns {React.ReactElement} Die Screen-Komponente
 */
export default function CreateNuggetScreen(): React.ReactElement {
  const colors = useThemeColor();
  const router = useRouter();
  const { getCurrentUser } = useUserStore();
  const { currentUserMode } = useMode();
  
  // Hole aktuellen Benutzer
  const currentUser = getCurrentUser();
  
  // Profilbild-URL über die Hilfsfunktion
  const profileImageUrl = getUserProfileImageUrl(currentUser);
  
  // Nugget-Creation-Hook
  const {
    state,
    setContent,
    addMedia,
    removeMedia,
    setLink,
    toggleAddingLink,
    createNugget,
    uploadMedia
  } = useCreateNugget({
    options: {
      maxContentLength: MAX_CONTENT_LENGTH,
      maxMediaCount: 1,
      allowedMediaTypes: ['image', 'video', 'link'],
      autoFocus: true
    },
    onSuccess: () => {
      Alert.alert(
        'Nugget erstellt',
        'Dein Nugget wurde erfolgreich erstellt.',
        [{ 
          text: 'OK', 
          onPress: () => {
            router.replace('/(tabs)/profile');
          }
        }]
      );
    },
    onError: (error) => {
      logger.error('Fehler beim Erstellen des Nuggets:', error.message);
      Alert.alert('Fehler', error.message || 'Beim Erstellen des Nuggets ist ein Fehler aufgetreten.');
    }
  });
  
  // Theme-abhängige Styles mit useMemo
  const dynamicStyles = useMemo(() => ({
    createButtonText: {
      color: state.content.trim() && state.status !== NuggetCreationStatus.SAVING
        ? colors.primary 
        : colors.textSecondary 
    },
    container: {
      backgroundColor: colors.backgroundPrimary
    },
    userName: {
      color: colors.textPrimary
    },
    textInput: {
      color: colors.textPrimary
    },
    errorText: {
      color: colors.error
    },
    characterCountText: {
      color: state.content.length > 450 
        ? state.content.length > 480 
          ? colors.error 
          : colors.warning 
        : colors.textSecondary 
    },
    toolbar: {
      borderTopColor: colors.divider
    }
  }), [colors, state.content, state.status]);
  
  /**
   * Rendert den Erstellen-Button in der Header-Navigation
   * @returns {React.ReactElement} Der Button als JSX Element
   */
  const renderCreateButton = (): React.ReactElement => (
    <TouchableOpacity 
      onPress={createNugget}
      disabled={!state.content.trim() || state.status === NuggetCreationStatus.SAVING}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Nugget erstellen"
      accessibilityState={{ 
        disabled: !state.content.trim() || state.status === NuggetCreationStatus.SAVING 
      }}
    >
      <Text style={[styles.createButtonText, dynamicStyles.createButtonText]}>
        {state.status === NuggetCreationStatus.SAVING ? 'Wird erstellt...' : 'Erstellen'}
      </Text>
    </TouchableOpacity>
  );
  
  /**
   * Medien aus der Galerie auswählen
   */
  const pickMedia = async (): Promise<void> => {
    try {
      // Berechtigungen prüfen
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Berechtigung benötigt', 'Die App benötigt Zugriff auf deine Medienbibliothek.');
        return;
      }
      
      // Medienbibliothek öffnen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const mediaType: NuggetMediaType = asset.type === 'video' ? 'video' : 'image';
        
        // Hochladen des ausgewählten Mediums
        const mediaUrl = await uploadMedia(asset.uri);
        
        // Zum Nugget hinzufügen
        addMedia({
          type: mediaType,
          url: mediaUrl,
          thumbnailUrl: mediaType === 'video' ? mediaUrl : undefined,
          aspectRatio: asset.width && asset.height ? asset.width / asset.height : 1.5,
          localUri: asset.uri
        });
      }
    } catch (error) {
      logger.error('Fehler beim Auswählen des Mediums:', error instanceof Error ? error.message : String(error));
      Alert.alert('Fehler', 'Das Medium konnte nicht ausgewählt werden.');
    }
  };
  
  /**
   * Toolbar-Aktionen für die Tastatur-Toolbar
   */
  const toolbarActions: ToolbarAction[] = [
    {
      id: 'image',
      icon: 'image-outline',
      onPress: pickMedia,
      disabled: state.media.length >= 1,
      accessibilityLabel: 'Bild hinzufügen'
    },
    {
      id: 'link',
      icon: 'link-outline',
      onPress: () => toggleAddingLink(true),
      disabled: state.isAddingLink || state.link !== null,
      accessibilityLabel: 'Link hinzufügen'
    }
  ];
  
  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header mit Zurück- und Erstellen-Button */}
      <HeaderNavigation 
        title="Neues Nugget" 
        rightContent={renderCreateButton()}
        onBackPress={() => router.back()}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? layout.headerHeight : 0}
      >
        {/* Scrollbarer Inhaltsbereich */}
        <ScrollView 
          style={styles.scrollView} 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Benutzer-Informationen */}
          <View style={styles.userContainer}>
            <ProfileImage
              source={profileImageUrl ? { uri: profileImageUrl } : undefined}
              fallbackText={currentUser?.username?.charAt(0) || '?'}
              size={ui.avatar.m}
              variant="circle"
              isRealMode={currentUserMode === 'real'}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, dynamicStyles.userName]}>
                {currentUser?.name || currentUser?.username || 'Unbekannter Benutzer'}
              </Text>
            </View>
          </View>
          
          {/* Texteingabefeld */}
          <TextInput
            style={[styles.textInput, dynamicStyles.textInput]}
            value={state.content}
            onChangeText={setContent}
            placeholder="Was möchtest du teilen?"
            placeholderTextColor={colors.textSecondary}
            multiline
            autoFocus
            maxLength={MAX_CONTENT_LENGTH}
            accessible={true}
            accessibilityLabel="Nugget-Inhalt"
            accessibilityHint="Hier kannst du den Text für dein Nugget eingeben"
          />
          
          {/* MediaSelector-Komponente (wenn Medien vorhanden) */}
          {state.media.length > 0 && (
            <MediaSelector
              media={state.media}
              onAddMedia={addMedia}
              onRemoveMedia={removeMedia}
              maxMediaCount={1}
              allowedMediaTypes={['image', 'video']}
              error={state.errors?.media}
              style={styles.mediaSection}
            />
          )}
          
          {/* LinkManager-Komponente (wenn Link hinzugefügt wird oder vorhanden ist) */}
          {(state.isAddingLink || state.link) && (
            <LinkManager
              link={state.link}
              onLinkChange={setLink}
              isAddingLink={state.isAddingLink}
              onToggleAddingLink={toggleAddingLink}
              error={state.errors?.link}
              style={styles.linkSection}
            />
          )}
          
          {/* Fehleranzeige */}
          {state.errors?.content && (
            <Text 
              style={[styles.errorText, dynamicStyles.errorText]}
              accessible={true}
              accessibilityRole="alert"
            >
              {state.errors.content}
            </Text>
          )}
          
          {/* Zeichenzähler */}
          <View style={styles.characterCounter}>
            <Text style={[styles.characterCountText, dynamicStyles.characterCountText]}>
              {state.content.length}/{MAX_CONTENT_LENGTH}
            </Text>
          </View>
        </ScrollView>
        
        {/* Keyboard-Toolbar am unteren Bildschirmrand */}
        <KeyboardToolbar 
          actions={toolbarActions}
          style={[styles.toolbar, dynamicStyles.toolbar]}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.m,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  userInfo: {
    marginLeft: spacing.s,
  },
  userName: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold,
  },
  textInput: {
    fontSize: typography.fontSize.m,
    minHeight: sizes.xl * 3.75,
    lineHeight: typography.lineHeight.m,
    textAlignVertical: 'top',
    paddingTop: spacing.xs,
  },
  mediaSection: {
    marginTop: spacing.m,
  },
  linkSection: {
    marginTop: spacing.m,
  },
  errorText: {
    fontSize: typography.fontSize.s,
    marginTop: spacing.m,
  },
  characterCounter: {
    alignItems: 'flex-end',
    marginTop: spacing.s,
  },
  characterCountText: {
    fontSize: typography.fontSize.xs,
  },
  toolbar: {
    borderTopWidth: ui.border.thin,
  },
  createButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold,
  }
}); 
