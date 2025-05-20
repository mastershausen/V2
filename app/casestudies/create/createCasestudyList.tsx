import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import CreateCasestudyListScreen from '@/features/Casestudies/screens/createCasestudyListScreen';

/**
 * Fallstudien-Erstellungs-Route mit direkter Header-Kontrolle
 */
export default function CreateCasestudyListRoute() {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Stack.Screen options={{ 
        headerShown: false,
        title: '',
        headerTitle: ''
      }} />
      <CreateCasestudyListScreen />
    </>
  );
} 