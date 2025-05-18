import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';

import { ui } from '@/config/theme/ui';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage } from '@/shared-components/media';
import { DEMO_USER } from '@/stores/constants/userConstants';
import { ProfileImageData, createProfileInitialsFromName } from '@/utils/profileImageUtils';

// Konstante Größe des Profilbilds
const AVATAR_SIZE = 33;

// Demo-User-Name (explizit gesetzt, um konsistent zu sein)
const DEMO_USER_NAME = 'Alexander Becker';
const DEMO_USER_INITIALS = 'AB';

interface ProfileTabIconProps {
  /**
   * Name des Benutzers für Initialen
   * @type {string}
   */
  name: string;
  
  /**
   * Optional: URL zum Profilbild
   * @type {string}
   * @deprecated Verwende stattdessen profileImage
   */
  imageUrl?: string;
  
  /**
   * Optional: Profilbild-Daten mit Initialen und optionaler Bild-URL
   * @type {ProfileImageData}
   */
  profileImage?: ProfileImageData;
  
  /**
   * Optional: Benutzer-ID für konsistentes Profilbild
   * @type {string}
   */
  userId?: string;
  
  /**
   * Größe des Icons
   * @type {number}
   */
  size?: number;
  
  /**
   * Ob der Tab aktiv ist
   * @type {boolean}
   */
  isActive?: boolean;
  
  /**
   * Zusätzliche Styles
   * @type {StyleProp<ViewStyle>}
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Spezielle Icon-Komponente für den Profil-Tab
 * Verwendet eine vereinfachte Profilbild-Darstellung mit Mode-Integration
 * @param root0 - Die Props für die Komponente
 * @param root0.name - Name des Benutzers für Initialen
 * @param root0.imageUrl - URL zum Profilbild
 * @param root0.profileImage - Profilbild-Daten mit Initialen und optionaler Bild-URL
 * @param root0.userId - Benutzer-ID für konsistentes Profilbild
 * @param root0.size - Größe des Icons
 * @param root0.isActive - Ob der Tab aktiv ist
 * @param root0.style - Zusätzliche Styles
 * @returns Die gerenderte ProfileTabIcon-Komponente
 */
export function ProfileTabIcon({
  name,
  imageUrl,
  profileImage,
  userId,
  size = ui.icon.large,
  isActive = false,
  style
}: ProfileTabIconProps) {
  const colors = useThemeColor();
  
  // Verwende den neuen useMode Hook
  const { isDemoMode } = useMode();
  
  // Demo-Benutzer holen, wenn wir im Demo-Modus sind
  const demoUser = isDemoMode() ? DEMO_USER : null;
  
  // Der tatsächlich anzuzeigende Name (im Demo-Modus fest den Demo-Namen)
  const displayName = isDemoMode() ? DEMO_USER_NAME : name;
  
  // Initialen für Fallback (im Demo-Modus fest die Demo-Initialen)
  const initialen = isDemoMode() ? DEMO_USER_INITIALS : createProfileInitialsFromName(name).initials;
  
  // Berechne den Render-Key basierend auf dem aktuellen Modus
  const renderKey = useMemo(() => {
    const demoActive = isDemoMode();
    return `${demoActive ? 'demo' : 'real'}-profile`;
  }, [isDemoMode]);
  
  // Priorisiere die Bild-Quelle
  const imageSource = isDemoMode() 
    ? (typeof demoUser?.profileImage === 'string' ? demoUser.profileImage : undefined)
    : (imageUrl || (typeof profileImage === 'object' && profileImage?.imageUrl) || undefined);

  return (
    <View 
      style={[
        styles.wrapper, 
        style
      ]} 
      accessible={true} 
      accessibilityRole="image" 
      accessibilityLabel={`Profilbild von ${displayName}`}
      testID={`profiletab-${isDemoMode() ? 'demo' : 'real'}`}
    >
      <View style={styles.positionContainer}>
        <View 
          style={[
            styles.avatarContainer,
            {
              borderWidth: isActive ? ui.border.thick : 0,
              borderColor: isActive ? colors.primary : 'transparent',
            }
          ]}
        >
          {imageSource ? (
            <ProfileImage
              key={renderKey}
              source={{ uri: imageSource }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: 'white', fontSize: 16 }}>
                {initialen}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
  positionContainer: {
    position: 'relative',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
  avatarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AVATAR_SIZE / 2,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  }
}); 