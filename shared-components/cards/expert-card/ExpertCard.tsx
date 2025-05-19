import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage } from '@/shared-components/media';
import { UserRole, UserroleBadge } from '@/shared-components/media';

// Expertentyp für die Karte
export interface ExpertData {
  id: string;
  name: string;
  profileImage?: { uri: string } | { initials: string } | null;
  role: UserRole;
  headline?: string;
  specialties?: string[];
  rating?: number;
  verified?: boolean;
  company?: string;
}

// Props für die ExpertCard-Komponente
interface ExpertCardProps {
  expert: ExpertData;
  onPress?: () => void;
}

/**
 * ExpertCard-Komponente
 * 
 * Zeigt Informationen über einen Experten in einer Karte an.
 */
export function ExpertCard({ expert, onPress }: ExpertCardProps) {
  const colors = useThemeColor();
  
  // Profilbild
  const profileImageSource = expert.profileImage || { initials: expert.name.substring(0, 2).toUpperCase() };
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.imageContainer}>
          <ProfileImage
            source={profileImageSource}
            size={60}
            variant="circle"
            fallbackText={expert.name}
            isRealMode={true}
          />
          
          {expert.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>
              {expert.name}
            </Text>
            <UserroleBadge
              userRole={expert.role}
              position="topRight"
              size="small"
            />
          </View>
          
          {expert.headline && (
            <Text style={[styles.headline, { color: colors.textSecondary }]} numberOfLines={2}>
              {expert.headline}
            </Text>
          )}
          
          {expert.company && (
            <Text style={[styles.company, { color: colors.textTertiary }]}>
              {expert.company}
            </Text>
          )}
        </View>
      </View>
      
      {expert.specialties && expert.specialties.length > 0 && (
        <View style={styles.specialtiesContainer}>
          {expert.specialties.map((specialty, index) => (
            <View 
              key={index} 
              style={[styles.specialtyTag, { backgroundColor: colors.backgroundTertiary }]}
            >
              <Text style={[styles.specialtyText, { color: colors.textSecondary }]}>
                {specialty}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {expert.rating !== undefined && (
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
            {expert.rating.toFixed(1)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    marginBottom: spacing.m,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.m,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxs,
  },
  name: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold,
    flexShrink: 1,
  },
  headline: {
    fontSize: typography.fontSize.s,
    marginBottom: spacing.xxs,
  },
  company: {
    fontSize: typography.fontSize.xs,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.s,
  },
  specialtyTag: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: ui.borderRadius.s,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  specialtyText: {
    fontSize: typography.fontSize.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  ratingText: {
    fontSize: typography.fontSize.s,
    marginLeft: spacing.xxs,
  },
}); 