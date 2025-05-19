import React from 'react';
import { View, StyleSheet } from 'react-native';


import { spacing, borderRadius } from '@/config/theme';
import { useThemeColor } from '@/hooks/useThemeColor';

import { NuggetCardBody } from './components/NuggetCardBody';
import { NuggetCardHeader } from './components/NuggetCardHeader';
import { NuggetCardInteraction } from './components/NuggetCardInteraction';
import { NuggetData } from './types';


export interface NuggetCardProps {
  nugget: NuggetData;
  onHelpfulPress?: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onSavePress?: () => void;
  onUserPress?: () => void;
}

/**
 * NuggetCard - Eine Karte zur Anzeige von Nuggets (informative Beiträge)
 * Besteht aus Header (Benutzerinfo), Body (Inhalt) und Interaktionsleiste mit Like-, 
 * Kommentar-, Teilen- und Speichern-Funktionen.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {NuggetData} props.nugget - Die Nugget-Daten, die angezeigt werden sollen
 * @param {Function} [props.onHelpfulPress] - Callback für den Hilfreich-Button
 * @param {Function} [props.onCommentPress] - Callback für den Kommentar-Button
 * @param {Function} [props.onSharePress] - Callback für den Teilen-Button
 * @param {Function} [props.onSavePress] - Callback für den Speichern-Button
 * @param {Function} [props.onUserPress] - Callback für Benutzerprofilklicks
 * @returns {React.ReactElement} Die gerenderte NuggetCard-Komponente
 */
export function NuggetCard({
  nugget,
  onHelpfulPress,
  onCommentPress,
  onSharePress,
  onSavePress,
  onUserPress,
}: NuggetCardProps) {
  const colors = useThemeColor();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.backgroundSecondary,
          borderColor: 'rgba(0, 0, 0, 0.08)' 
        }
      ]}
    >
      <NuggetCardHeader 
        user={nugget.user}
        timestamp={nugget.timestamp}
        onUserPress={onUserPress}
      />
      <NuggetCardBody 
        content={nugget.content}
        media={nugget.media}
      />
      <NuggetCardInteraction 
        helpfulCount={nugget.helpfulCount}
        commentCount={nugget.commentCount}
        isHelpful={nugget.isHelpful}
        isSaved={nugget.isSaved}
        onHelpfulPress={onHelpfulPress}
        onCommentPress={onCommentPress}
        onSharePress={onSharePress}
        onSavePress={onSavePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.m,
    overflow: 'hidden',
    borderWidth: 0.5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
    marginBottom: spacing.m,
    padding: spacing.s,
    position: 'relative',
  },
}); 