import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

/**
 * EmptyState Komponente
 * 
 * Zeigt einen Leerzustand an, wenn keine Daten verfügbar sind
 * @param {object} props - Die Komponenten-Properties
 * @param {string} props.title - Der Titel des Leerzustands
 * @param {string} props.message - Die Nachricht, die angezeigt werden soll
 * @param {React.ReactNode} [props.icon] - Ein optionales Icon
 * @returns {React.ReactElement} Die gerenderte EmptyState-Komponente
 */
export function EmptyState({ 
  title, 
  message, 
  icon 
}: EmptyStateProps): React.ReactElement {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
  },
}); 