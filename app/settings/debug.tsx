import { useRouter } from 'expo-router';
import React from "react";

import DebugSettingsScreen from '@/features/settings/screens/DebugSettingsScreen';

/**
 *
 */
export default function DebugSettingsRoute() {
  const router = useRouter();
  
  return (
    <DebugSettingsScreen onClose={() => router.back()} />
  );
} 