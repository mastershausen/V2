import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage } from '@/shared-components/media';
import { ReviewBadge } from '@/shared-components/badges';

export interface GigData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
  currency?: string;
}

interface GigCardProps {
  gig: GigData;
  onPress?: () => void;
  showPrice?: boolean;
}

/**
 * Eine Karte zur Anzeige eines Gigs mit wichtigen Informationen
 * HINWEIS: Diese Komponente wird derzeit nicht außerhalb der gig-card verwendet.
 * Wenn sie in anderen Teilen der Anwendung benötigt wird, kann sie über eine index.ts Datei
 * exportiert werden.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {object} props.gig - Die Daten des anzuzeigenden Gigs
 * @param {Function} [props.onPress] - Callback bei Klick auf die Karte
 * @param {boolean} [props.showPrice=true] - Ob der Preis angezeigt werden soll
 * @param {Function} [props.onLikePress] - Callback bei Klick auf Like-Button
 * @param {Function} [props.onUserPress] - Callback bei Klick auf Benutzer
 * @param {Function} [props.onSharePress] - Callback bei Klick auf Teilen-Button
 * @param {object} [props.style] - Benutzerdefinierte Styles für die Karte
 * @param {boolean} [props.compact] - Ob eine kompakte Darstellung verwendet werden soll
 * @returns {React.ReactElement} Die gerenderte GigCard-Komponente
 */
// Umbenannt zu _GigCard, um anzuzeigen, dass es eine interne Komponente ist
export function GigCard({ gig, onPress, showPrice = true }: GigCardProps): React.ReactElement {
  const colors = useThemeColor();

  // Hilfsfunktion für Preis-Rendering
  const renderPrice = () => {
    if (!showPrice) return null;
    
    if (gig.currency === 'Kostenlos' || gig.currency === 'Auf Anfrage') {
      return (
        <Text style={[styles.price, { color: colors.textPrimary, fontWeight: 'bold' }]}> 
          {gig.currency}
        </Text>
      );
    }
    return (
      <Text style={[styles.price, { color: colors.textPrimary }]}> 
        {gig.currency || '€'}{gig.price.toLocaleString('de-DE')}
      </Text>
    );
  };

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
            source={{ uri: gig.imageUrl }}
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
            {gig.title}
          </Text>
          {/* Beschreibung (3 Zeilen) */}
          <Text 
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={3}
          >
            {gig.description}
          </Text>
          {/* Fußzeile mit Preis und Bewertung */}
          <View style={styles.footer}>
            {showPrice ? (
              renderPrice()
            ) : (
              <View style={{ width: 48 }} />
            )}
            <ReviewBadge rating={gig.rating} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: ui.borderRadius.m,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    maxHeight: 130,
    minHeight: 130,
    marginBottom: spacing.m,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    transform: [{ translateY: -4 }],
  },
  content: {
    flexDirection: 'row',
    paddingRight: spacing.m,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: '100%',
    borderTopLeftRadius: ui.borderRadius.m,
    borderBottomLeftRadius: ui.borderRadius.m,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    marginRight: spacing.m,
    backgroundColor: '#eee',
    marginLeft: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    marginLeft: spacing.s,
    paddingRight: spacing.s,
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
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
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: ui.borderRadius.s,
  },
  rating: {
    fontSize: typography.fontSize.s,
    marginLeft: spacing.xxs,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.xs,
  },
}); 