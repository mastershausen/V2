import React, { ReactElement } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

import { spacing } from '../../../../config/theme';
import { useThemeColor } from '../../../../hooks/useThemeColor';
import { NuggetCard } from '../NuggetCard';
import { NuggetData } from '../types';

// Typ für die leeren Listen-Komponenten
type ReactComponent = React.ComponentType<unknown> | ReactElement | null;

export interface NuggetContainerProps {
  nuggets: NuggetData[];
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onHelpfulPress?: (nuggetId: string) => void;
  onCommentPress?: (nuggetId: string) => void;
  onSharePress?: (nuggetId: string) => void;
  onSavePress?: (nuggetId: string) => void;
  onUserPress?: (userId: string) => void;
  ListEmptyComponent?: ReactComponent;
  ListHeaderComponent?: ReactComponent;
  ListFooterComponent?: ReactComponent;
}

/**
 * NuggetContainer - Container für die Anzeige einer Liste von Nuggets
 * Kümmert sich um das Rendern und die Interaktionen mit Nuggets.
 * Vermeidet VirtualizedList für bessere Kompatibilität mit äußeren ScrollViews.
 * Unterstützt benutzerdefinierte Header, Footer und EmptyState-Komponenten.
 * @param {object} props - Die Komponenteneigenschaften
 * @param {NuggetData[]} props.nuggets - Array von Nugget-Daten, die angezeigt werden sollen
 * @param {boolean} [props.isLoading] - Gibt an, ob gerade Daten geladen werden
 * @param {Function} [props.onHelpfulPress] - Callback bei Klick auf "Das hilft" mit nuggetId
 * @param {Function} [props.onCommentPress] - Callback bei Klick auf Kommentieren mit nuggetId
 * @param {Function} [props.onSharePress] - Callback bei Klick auf Teilen mit nuggetId
 * @param {Function} [props.onSavePress] - Callback bei Klick auf Speichern mit nuggetId
 * @param {Function} [props.onUserPress] - Callback bei Klick auf Benutzer mit userId
 * @param {React.ComponentType<any>|React.ReactElement|null} [props.ListEmptyComponent] - Komponente bei leerer Liste
 * @param {React.ComponentType<any>|React.ReactElement|null} [props.ListHeaderComponent] - Kopfkomponente der Liste
 * @param {React.ComponentType<any>|React.ReactElement|null} [props.ListFooterComponent] - Fußkomponente der Liste
 * @returns {React.ReactElement} Die gerenderte NuggetContainer-Komponente
 */
export function NuggetContainer({
  nuggets,
  isLoading = false,
  onHelpfulPress,
  onCommentPress,
  onSharePress,
  onSavePress,
  onUserPress,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent
}: NuggetContainerProps) {
  const colors = useThemeColor();

  // Default leerer Zustand wenn keine Nuggets und kein benutzerdefinierter ListEmptyComponent
  function DefaultEmptyComponent() {
  return <View style={[styles.emptyContainer, { backgroundColor: colors.backgroundPrimary }]}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Keine Nuggets vorhanden.
      </Text>
    </View>
}

  // Default Footer mit Ladeindikator
  function DefaultFooterComponent() {
  return isLoading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    ) : null
}

  // Render EmptyComponent
  const renderEmptyComponent = () => {
    if (ListEmptyComponent) {
      if (React.isValidElement(ListEmptyComponent)) {
        return ListEmptyComponent;
      } 
      if (typeof ListEmptyComponent === 'function') {
        return <ListEmptyComponent />;
      }
    }
    return <DefaultEmptyComponent />;
  };

  // Render HeaderComponent
  const renderHeaderComponent = () => {
    if (ListHeaderComponent) {
      if (React.isValidElement(ListHeaderComponent)) {
        return ListHeaderComponent;
      }
      if (typeof ListHeaderComponent === 'function') {
        return <ListHeaderComponent />;
      }
    }
    return null;
  };

  // Render FooterComponent
  const renderFooterComponent = () => {
    if (ListFooterComponent) {
      if (React.isValidElement(ListFooterComponent)) {
        return ListFooterComponent;
      }
      if (typeof ListFooterComponent === 'function') {
        return <ListFooterComponent />;
      }
    }
    return <DefaultFooterComponent />;
  };

  // Wenn keine Nuggets vorhanden, zeige Leer-Zustand
  if (nuggets.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeaderComponent()}
        {renderEmptyComponent()}
        {renderFooterComponent()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {renderHeaderComponent()}
      
      <View style={styles.contentContainer}>
        {nuggets.map(nugget => (
          <NuggetCard
            key={nugget.id}
            nugget={nugget}
            onHelpfulPress={onHelpfulPress ? () => onHelpfulPress(nugget.id) : undefined}
            onCommentPress={onCommentPress ? () => onCommentPress(nugget.id) : undefined}
            onSharePress={onSharePress ? () => onSharePress(nugget.id) : undefined}
            onSavePress={onSavePress ? () => onSavePress(nugget.id) : undefined}
            onUserPress={onUserPress ? () => onUserPress(nugget.user.id) : undefined}
          />
        ))}
      </View>
      
      {renderFooterComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    padding: spacing.s,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 200,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  loaderContainer: {
    padding: spacing.m,
    alignItems: 'center',
  },
}); 