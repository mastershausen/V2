import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

// Verwende ein einfaches leeres Objekt als Fallback
const placeholderImage = {};
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage } from '@/shared-components/media';

import { styles } from './styles';
import { GigCardProps } from './types';




/**
 * Eine Karte zur Anzeige eines Gigs mit wichtigen Informationen
 * HINWEIS: Diese Komponente wird derzeit nicht außerhalb der gig-card verwendet.
 * Wenn sie in anderen Teilen der Anwendung benötigt wird, kann sie über eine index.ts Datei
 * exportiert werden.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {object} props.gig - Die Daten des anzuzeigenden Gigs
 * @param {Function} [props.onPress] - Callback bei Klick auf die Karte
 * @param {Function} [props.onLikePress] - Callback bei Klick auf Like-Button
 * @param {Function} [props.onUserPress] - Callback bei Klick auf Benutzer
 * @param {Function} [props.onSharePress] - Callback bei Klick auf Teilen-Button
 * @param {object} [props.style] - Benutzerdefinierte Styles für die Karte
 * @param {boolean} [props.compact] - Ob eine kompakte Darstellung verwendet werden soll
 * @returns {React.ReactElement} Die gerenderte GigCard-Komponente
 */
// Umbenannt zu _GigCard, um anzuzeigen, dass es eine interne Komponente ist
export function _GigCard({ 
  gig,
  onPress,
  onLikePress,
  onUserPress,
  onSharePress,
  style,
  compact = false,
}: GigCardProps): React.ReactElement {
  const colors = useThemeColor();
  
  // Formatiere den Preis je nach Währung
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'EUR') {
      return `${amount.toLocaleString('de-DE')} €`;
    } else if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US')}`;
    } else {
      return `${amount} ${currency}`;
    }
  };

  // Generiere Text für Ort/Arbeitsweise
  const getLocationText = () => {
    if (!gig.location) return 'Ortsunabhängig';
    
    if (gig.location.type === 'remote') {
      return 'Remote';
    } else if (gig.location.type === 'onsite') {
      return gig.location.city || 'Vor Ort';
    } else {
      return 'Hybrid' + (gig.location.city ? ` (${gig.location.city})` : '');
    }
  };

  // Handhabung für Klicks
  const handleCardPress = () => {
    if (onPress) {
      onPress(gig.id);
    }
  };

  const handleLikePress = () => {
    if (onLikePress) {
      onLikePress(gig.id);
    }
  };

  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress(gig.userId);
    }
  };

  const handleSharePress = () => {
    if (onSharePress) {
      onSharePress(gig.id);
    }
  };

  // Erstellung der kompakten Darstellung für Suchergebnisse oder Listen
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.container, styles.compactContainer, style]}
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: gig.coverImage }}
          style={styles.compactMedia}
          defaultSource={placeholderImage}
        />
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {gig.title}
          </Text>
          <Text style={[styles.compactPrice, { color: colors.textPrimary }]}>
            {formatPrice(gig.price.amount, gig.price.currency)}
            {gig.price.unit && <Text style={styles.priceUnit}> / {gig.price.unit}</Text>}
          </Text>
          <Text style={styles.compactDescription} numberOfLines={2}>
            {gig.shortDescription || gig.description}
          </Text>
          <View style={styles.userInfo}>
            <ProfileImage
              fallbackText={gig.userInfo.name}
              source={gig.userInfo.avatarUrl ? { uri: gig.userInfo.avatarUrl } : null}
              size={32}
            />
            <Text style={styles.userName}>{gig.userInfo.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Standard Gig-Karte (vollständige Ansicht)
  return (
    <View style={[styles.container, style]}>
      {/* Header mit Titel und Preis */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {gig.title}
          </Text>
          <Text style={styles.category}>
            {gig.category}{gig.subcategory ? ` | ${gig.subcategory}` : ''}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.textPrimary }]}>
            {formatPrice(gig.price.amount, gig.price.currency)}
          </Text>
          {gig.price.unit && (
            <Text style={styles.priceUnit}>pro {gig.price.unit}</Text>
          )}
        </View>
      </View>

      {/* Media (Bild des Gigs) */}
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
        <Image 
          source={{ uri: gig.coverImage }}
          style={styles.media}
          defaultSource={placeholderImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Tags und Ort */}
      <View style={styles.infoContainer}>
        {gig.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        
        <View style={styles.location}>
          <Ionicons 
            name={gig.location?.type === 'remote' ? 'globe-outline' : 'location-outline'} 
            size={14} 
            color="#666" 
          />
          <Text style={styles.locationText}>{getLocationText()}</Text>
        </View>
      </View>

      {/* Kurzbeschreibung */}
      <View style={styles.description}>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {gig.shortDescription || gig.description}
        </Text>
      </View>

      {/* Aktionsbuttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
          <Ionicons 
            name="heart-outline" 
            size={24} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
          <Ionicons 
            name="share-outline" 
            size={24} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Footer mit Benutzerinfo und Stats */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
          <ProfileImage
            fallbackText={gig.userInfo.name}
            source={gig.userInfo.avatarUrl ? { uri: gig.userInfo.avatarUrl } : null}
            size={32}
          />
          <View>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {gig.userInfo.name}
            </Text>
            {gig.userInfo.rating !== undefined && (
              <View style={styles.rating}>
                <Ionicons name="star" size={12} color="#FFC107" />
                <Text style={styles.ratingText}>
                  {gig.userInfo.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={16} color="#666" />
            <Text style={styles.statText}>{gig.stats.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#666" />
            <Text style={styles.statText}>{gig.stats.completedJobs}</Text>
          </View>
        </View>
      </View>
    </View>
  );
} 