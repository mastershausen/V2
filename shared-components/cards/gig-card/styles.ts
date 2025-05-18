import { StyleSheet, Platform } from 'react-native';

import { borderRadius } from '@/config/theme/borderRadius';
import { shadows } from '@/config/theme/shadows';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';

/**
 * Styles für die GigCard-Komponente
 */
export const styles = StyleSheet.create({
  // Hauptcontainer
  container: {
    borderRadius: borderRadius.m,
    marginBottom: spacing.m,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? shadows.ios.small : shadows.android.small),
  },
  
  // Header mit Titel und Preis
  header: {
    padding: spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  // Titelbereich
  titleContainer: {
    flex: 1,
    marginRight: spacing.s,
  },
  title: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xxs,
  },
  category: {
    fontSize: typography.fontSize.s,
    color: '#666',
    marginBottom: spacing.xxs,
  },
  
  // Preisbereich
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
  },
  priceUnit: {
    fontSize: typography.fontSize.xs,
    color: '#666',
  },
  
  // Mediendarstellung
  media: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  
  // Tags und Ort
  infoContainer: {
    flexDirection: 'row',
    padding: spacing.s,
    paddingTop: spacing.xs,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    backgroundColor: '#f0f0f0',
    borderRadius: borderRadius.s,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: typography.fontSize.xs,
    color: '#666',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  locationText: {
    fontSize: typography.fontSize.xs,
    color: '#666',
    marginLeft: spacing.xxs,
  },
  
  // Beschreibung
  description: {
    padding: spacing.m,
    paddingTop: 0,
    paddingBottom: spacing.s,
  },
  descriptionText: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.fontSize.s * 1.5,
    color: '#333',
  },
  
  // Footer mit Benutzerinfo und Stats
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  
  // Benutzerinformationen
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.s,
  },
  userName: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium as any,
  },
  
  // Statistiken
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.s,
  },
  statText: {
    fontSize: typography.fontSize.xs,
    color: '#666',
    marginLeft: spacing.xxs,
  },
  
  // Rating
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: typography.fontSize.xs,
    color: '#666',
    marginLeft: spacing.xxs,
  },
  
  // Styles für kompakte Darstellung
  compactContainer: {
    flexDirection: 'row',
    height: 100,
  },
  compactMedia: {
    width: 100,
    height: 100,
  },
  compactContent: {
    flex: 1,
    padding: spacing.s,
  },
  compactTitle: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xxs,
  },
  compactPrice: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xxs,
  },
  compactDescription: {
    fontSize: typography.fontSize.xs,
    color: '#666',
    marginBottom: spacing.xs,
  },
  
  // Interaktionsbereich
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
  },
  actionButton: {
    padding: spacing.s,
  },
}); 