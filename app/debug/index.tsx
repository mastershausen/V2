import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isDevelopmentMode } from '@/config/app/env';
import { spacing } from '@/config/theme/spacing';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Debug-Seiten-Eintragstyp
 */
interface DebugPageItem {
  id: string;
  title: string;
  description: string;
}

/**
 * Liste aller Debug-Seiten
 */
const debugPages: DebugPageItem[] = [
  {
    id: 'app-mode',
    title: 'AppMode Store Test',
    description: 'Test des neuen appModeStore (Demo-Modus, App-Modus, etc.)',
  },
];

/**
 * Debug-Index-Seite
 * 
 * Zeigt eine Liste aller verfügbaren Debug-Seiten an
 */
export default function DebugIndexScreen() {
  const insets = useSafeAreaInsets();
  
  /**
   * Rendert ein einzelnes Debug-Item in der Liste
   * @param root0
   * @param root0.item
   */
  function renderDebugItem({ item }: { item: DebugPageItem }) {
    return (
      <Link href={`/debug/${item.id}` as any} asChild>
        <TouchableOpacity style={styles.item}>
          <View>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <HeaderNavigation title="Debug-Seiten" />
      
      <FlatList
        data={debugPages}
        keyExtractor={(item) => item.id}
        renderItem={renderDebugItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Keine Debug-Seiten verfügbar</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: spacing.m,
  },
  item: {
    padding: spacing.m,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: spacing.m,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
  },
}); 