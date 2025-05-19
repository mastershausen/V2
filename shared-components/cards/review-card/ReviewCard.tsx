import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface ReviewCardProps {
  name: string;
  initials: string;
  rating: number;
  text: string;
  date?: string; // z.B. 'vor 2 Wochen'
  imageUrl?: string;
}

export function ReviewCard({ name, initials, rating, text, date, imageUrl }: ReviewCardProps) {
  const colors = useThemeColor();

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F1F3F6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.row}>
          {imageUrl ? (
            <View style={styles.avatar}>
              <View style={styles.avatarImageWrapper}>
                <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
              </View>
            </View>
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}> 
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
          <View style={styles.headerContent}>
            <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD600" style={{ marginRight: 2 }} />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        {date && (
          <Text style={[styles.date, { color: colors.textSecondary }]} numberOfLines={1}>{date}</Text>
        )}
      </View>
      <Text style={[styles.text, { color: colors.textSecondary }]} numberOfLines={4}>{text}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: ui.borderRadius.l,
    padding: spacing.m,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  avatarImageWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    resizeMode: 'cover',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  name: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: typography.fontSize.s,
    color: '#FFD600',
    fontWeight: 'bold',
  },
  date: {
    fontSize: typography.fontSize.xs,
    textAlign: 'right',
    marginLeft: spacing.s,
    marginTop: 2,
    flexShrink: 0,
    minWidth: 60,
    maxWidth: 90,
  },
  text: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    marginTop: spacing.xs,
  },
}); 