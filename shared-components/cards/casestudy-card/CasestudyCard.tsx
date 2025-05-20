import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage } from '@/shared-components/media';
import { ReviewBadge } from '@/shared-components/badges';

export interface CasestudyData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
}

interface CasestudyCardProps {
  casestudy: CasestudyData;
  onPress?: () => void;
}

/**
 * Eine Karte zur Anzeige einer Fallstudie mit wichtigen Informationen
 * @param {object} props - Die Komponenteneigenschaften
 * @param {object} props.casestudy - Die Daten der anzuzeigenden Fallstudie
 * @param {Function} [props.onPress] - Callback bei Klick auf die Karte
 * @returns {React.ReactElement} Die gerenderte CasestudyCard-Komponente
 */
export function CasestudyCard({ casestudy, onPress }: CasestudyCardProps): React.ReactElement {
  const colors = useThemeColor();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Bild im 4:3 Format */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: casestudy.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        {/* Text-Content */}
        <View style={styles.textContainer}>
          {/* Überschrift (1 Zeile) */}
          <Text 
            style={[styles.title, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {casestudy.title}
          </Text>
          {/* Beschreibung (3 Zeilen) */}
          <Text 
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={3}
          >
            {casestudy.description}
          </Text>
          {/* Fußzeile mit Fallstudie-Tag und Bewertung */}
          <View style={styles.footer}>
            <View style={[styles.tagContainer, { backgroundColor: 'rgba(94, 92, 230, 0.15)' }]}>
              <Text style={[styles.tag, { color: '#5E5CE6' }]}>Fallstudie</Text>
            </View>
            <ReviewBadge rating={casestudy.rating} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: ui.borderRadius.m,
    overflow: 'hidden',
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  content: {
    flexDirection: 'row',
    height: 130,
  },
  imageContainer: {
    width: 110,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    padding: spacing.s,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    marginBottom: spacing.s,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagContainer: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: ui.borderRadius.s,
  },
  tag: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
}); 