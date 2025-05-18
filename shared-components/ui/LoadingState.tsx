import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

/**
 * LoadingState Komponente
 * 
 * Zeigt einen Ladezustand mit Animation und optionaler Nachricht an
 * @param {object} props - Die Komponenten-Properties
 * @param {string} [props.message] - Die anzuzeigende Nachricht
 * @param {('small'|'large')} [props.size] - Die Größe der Ladeanimation
 * @returns {React.ReactElement} Die gerenderte LoadingState-Komponente
 */
export function LoadingState({ 
  message = 'Wird geladen...', 
  size = 'large' 
}: LoadingStateProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#007AFF" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
}); 