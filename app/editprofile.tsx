import { Stack } from 'expo-router';
import React from 'react';

import EditProfileScreen from '@/features/editprofile/screens/EditProfileScreen';

/**
 * EditProfile-Route (nur im Real-Mode verfügbar)
 * Im Demo-Mode wird diese Route gar nicht erst registriert.
 */
export default function EditProfilePage() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
          title: ''
        }}
      />
      <EditProfileScreen />
    </>
  );
} 