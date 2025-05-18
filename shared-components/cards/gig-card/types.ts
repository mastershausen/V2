import { StyleProp, ViewStyle } from 'react-native';

/**
 * Datenstruktur für einen Gig
 */
export interface GigData {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: {
    amount: number;
    currency: string;
    unit?: string; // z.B. "pro Stunde", "pauschal"
  };
  category: string;
  subcategory?: string;
  tags: string[];
  location?: {
    type: 'remote' | 'onsite' | 'hybrid';
    city?: string;
    country?: string;
  };
  deliveryTime?: {
    value: number;
    unit: 'Stunden' | 'Tage' | 'Wochen';
  };
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userInfo: {
    name: string;
    avatarUrl: string;
    rating?: number;
  };
  stats: {
    views: number;
    likes: number;
    completedJobs: number;
  };
  status: 'active' | 'draft' | 'archived';
  coverImage?: string;
  gallery?: string[];
}

/**
 * Props für die GigCard-Komponente
 */
export interface GigCardProps {
  gig: GigData;
  onPress?: (gigId: string) => void;
  onLikePress?: (gigId: string) => void;
  onUserPress?: (userId: string) => void;
  onSharePress?: (gigId: string) => void;
  style?: StyleProp<ViewStyle>;
  compact?: boolean; // Für eine kompaktere Darstellung
}

/**
 * Status für Interaktionen mit der GigCard
 */
export interface GigInteractionState {
  isLiked: boolean;
  isSaved: boolean;
} 