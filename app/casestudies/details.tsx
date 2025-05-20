import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import CasestudyDetailsScreen from '@/features/casestudy/screens/CasestudyDetailsScreen';

/**
 * Route für die Detailansicht einer Fallstudie
 */
export default function CasestudyDetailsRoute() {
  const params = useLocalSearchParams<{
    id: string;
    imageUrl: string;
    source?: string;
    userImageUrl?: string;
    userName?: string;
  }>();

  return <CasestudyDetailsScreen />;
} 