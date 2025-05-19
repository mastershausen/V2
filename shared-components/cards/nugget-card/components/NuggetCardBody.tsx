import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';


import { spacing, typography, borderRadius } from '@/config/theme';
import { useThemeColor } from '@/hooks/useThemeColor';

import { NuggetMedia } from '../types';


export interface NuggetCardBodyProps {
  content: string;
  media?: NuggetMedia[];
}

/**
 * Body-Komponente für die NuggetCard
 * Zeigt den Hauptinhalt (Text) und optional Medien (Bilder, Videos, Links) an.
 * Unterstützt verschiedene Medientypen mit entsprechender Darstellung.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {string} props.content - Der Textinhalt des Nuggets
 * @param {NuggetMedia[]} [props.media] - Optionale Medienelemente (Bilder, Videos, Links)
 * @returns {React.ReactElement} Die gerenderte NuggetCardBody-Komponente
 */
export function NuggetCardBody({
  content,
  media,
}: NuggetCardBodyProps): React.ReactElement {
  const colors = useThemeColor();
  const screenWidth = Dimensions.get('window').width;
  // Angepasste Berechnung der Medienbreite, um volle Breite zu erzielen
  const mediaWidth = screenWidth - 2 * spacing.m;

  // Rendert einen klickbaren Link mit Icon
  function renderLink(url: string) {
    return (
      <TouchableOpacity style={styles.linkContainer}>
        <MaterialCommunityIcons name="web" size={24} color={colors.primary} />
        <Text style={[styles.linkText, { color: colors.primary }]}>{url}</Text>
        <Ionicons name="open-outline" size={16} color={colors.primary} />
      </TouchableOpacity>
    );
  }

  // Rendert ein Medienitem basierend auf dem Typ
  function renderMediaItem(item: NuggetMedia, index: number) {
    const key = `media-${index}`;

    switch (item.type) {
      case 'image':
        return (
          <Image
            key={key}
            source={{ uri: item.url }}
            style={[styles.mediaImage, { width: mediaWidth }]}
            resizeMode="cover"
          />
        );
      case 'video':
        return (
          <View key={key} style={[styles.videoContainer, { width: mediaWidth }]}>
            <Image
              source={{ uri: item.thumbnailUrl || item.url }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <View style={styles.playButtonContainer}>
              <Ionicons name="play" size={24} color="#FFFFFF" />
            </View>
          </View>
        );
      case 'link':
        return (
          <View key={key} style={styles.linkWrapper}>
            {renderLink(item.url)}
          </View>
        );
      default:
        return null;
    }
  }

  return (
    <View style={styles.container}>
      {/* Content section */}
      <Text style={[styles.contentText, { color: colors.textPrimary }]}>{content}</Text>

      {/* Media section */}
      {media && media.length > 0 && (
        <View style={styles.mediaContainer}>
          {media.map((item, index) => renderMediaItem(item, index))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  contentText: {
    fontSize: typography.fontSize.m,
    lineHeight: typography.fontSize.m * 1.5,
    paddingBottom: spacing.s,
    paddingHorizontal: spacing.m,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: borderRadius.m,
  },
  linkText: {
    fontSize: typography.fontSize.s,
    marginLeft: spacing.s,
  },
  mediaContainer: {
    marginTop: spacing.s,
    marginBottom: spacing.s,
  },
  mediaImage: {
    height: 200,
    borderRadius: 0,
    marginTop: spacing.s,
    width: '100%',
  },
  videoContainer: {
    position: 'relative',
    marginTop: spacing.s,
    height: 200,
    width: '100%',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 0,
  },
  linkWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: borderRadius.m,
    marginTop: spacing.s,
    marginHorizontal: spacing.m,
    overflow: 'hidden',
  },
}); 