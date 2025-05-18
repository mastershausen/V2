import { useRouter } from 'expo-router';
import React from "react";

import AccountSettingsScreen from '@/features/settings/screens/AccountSettingsScreen';

/**
 *
 */
export default function AccountSettingsRoute() {
  const router = useRouter();
  
  return (
    <AccountSettingsScreen onClose={() => router.back()} />
  );
} 