import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Einfache Komponente zur Anzeige von Informationselementen im Debug-Bereich
 * @param {object} props - Komponenten-Props
 * @param {string} props.label - Beschriftung des Informationselements
 * @param {string} props.value - Wert des Informationselements
 */
export function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 14,
  }
}); 