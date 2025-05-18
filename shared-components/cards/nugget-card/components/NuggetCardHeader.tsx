import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';

import { spacing, typography } from '@/config/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage } from '@/shared-components/media';
import { useUserStore } from '@/stores/userStore';
import { formatRelativeTime } from '@/utils/dateUtils';
import { ProfileImageData, createProfileInitialsFromName } from '@/utils/profileImageUtils';

import { NuggetUser } from '../types';

// Hilfsfunktion, um Initialen zu extrahieren
const getInitials = (name: string): string => {
  if (!name) return 'UN';
  return name.split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export interface NuggetCardHeaderProps {
  user: NuggetUser;
  timestamp: string | Date;
  onUserPress?: () => void;
}

/**
 * Header-Komponente für die NuggetCard
 * Zeigt Profilbild, Benutzerinformationen und Zeitstempel an.
 * Lädt dynamisch aktuelle Benutzerdaten aus dem UserStore und kann zwischen
 * eingeloggtem Benutzer und anderen Benutzern unterscheiden.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {NuggetUser} props.user - Benutzerdaten des Nugget-Autors
 * @param {string|Date} props.timestamp - Zeitstempel der Veröffentlichung
 * @param {Function} [props.onUserPress] - Callback für Klicks auf den Benutzer
 * @returns {React.ReactElement} Die gerenderte NuggetCardHeader-Komponente
 */
export function NuggetCardHeader({
  user,
  timestamp,
  onUserPress,
}: NuggetCardHeaderProps) {
  const colors = useThemeColor();
  const { getCurrentUser, getMockUserById } = useUserStore();
  
  // Aktuelle Benutzerdaten laden - entweder vom aktuellen Benutzer oder aus den Mock-Daten
  const currentUser = getCurrentUser();
  
  // Prüfen, ob es sich um den aktuellen Benutzer handelt
  const isCurrentUser = currentUser?.id === user.id;
  
  // Benutzerdaten dynamisch abrufen und React State für forciertes Re-Rendering verwenden
  const [userData, setUserData] = useState<NuggetUser>({ ...user });
  
  // Nach Änderungen in den Abhängigkeiten aktualisieren
  useEffect(() => {
    const updatedData = { ...user };
    
    // Wenn es der aktuelle angemeldete Benutzer ist, verwende die aktuellen Daten
    if (isCurrentUser && currentUser) {
      updatedData.name = currentUser.name;
      updatedData.username = currentUser.username;
      
      // Verwende die Profilbild-Daten vom aktuellen Benutzer (IMMER frisch)
      if (currentUser.profileImage) {
        if (typeof currentUser.profileImage === 'string') {
          // Wenn es ein String ist, konvertiere es in ProfileImageData
          updatedData.profileImage = {
            initials: getInitials(currentUser.name || currentUser.username || 'UN'),
            imageUrl: currentUser.profileImage
          };
        } else {
          // Wenn es bereits ProfileImageData ist, verwende es direkt
          updatedData.profileImage = currentUser.profileImage as ProfileImageData;
        }
      }
    } 
    // Ansonsten versuche, Benutzer aus den Mock-Daten zu holen, falls nötig
    else if (!updatedData.name || !updatedData.profileImage) {
      const mockUser = getMockUserById?.(user.id);
      if (mockUser) {
        updatedData.name = mockUser.name || updatedData.name;
        updatedData.username = mockUser.username || updatedData.username;
        
        // Verwende die Profilbild-Daten vom Mock-Benutzer
        if (mockUser.profileImage) {
          if (typeof mockUser.profileImage === 'string') {
            // Wenn es ein String ist, konvertiere es in ProfileImageData
            updatedData.profileImage = {
              initials: getInitials(mockUser.name || mockUser.username || 'UN'),
              imageUrl: mockUser.profileImage
            };
          } else {
            // Wenn es bereits ProfileImageData ist, verwende es direkt
            updatedData.profileImage = mockUser.profileImage as ProfileImageData;
          }
        }
      }
    }
    
    // State aktualisieren, nur wenn sich tatsächlich etwas geändert hat
    if (JSON.stringify(updatedData) !== JSON.stringify(userData)) {
      setUserData(updatedData);
    }
  }, [user, currentUser, isCurrentUser, getMockUserById, userData]);
  
  // Stelle sicher, dass wir gültige Profilbild-Daten haben
  const profileImage = userData.profileImage || createProfileInitialsFromName(userData.name || userData.username || 'UN');

  // Formatiere den Zeitstempel relativ (z.B. "Heute", "Gestern", "Vor 2 Tagen")
  const formattedTime = typeof timestamp === 'string' 
    ? formatRelativeTime(new Date(timestamp)) 
    : formatRelativeTime(timestamp);
  
  // Anzeigename für Benutzer
  const displayName = userData.name || userData.username || 'Anonym';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onUserPress}
        disabled={!onUserPress}
        style={styles.userContainer}
        accessibilityRole="button"
        accessibilityLabel={`Profil von ${displayName} anzeigen`}
      >
        {profileImage.imageUrl ? (
          <ProfileImage 
            source={{ uri: profileImage.imageUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              {profileImage.initials}
            </Text>
          </View>
        )}
        
        <View style={styles.userInfoContainer}>
          <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* Zeitstempel nach rechts verschoben */}
      <View style={styles.timestampContainer}>
        <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfoContainer: {
    marginLeft: spacing.s,
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'],
  },
  timestampContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
}); 