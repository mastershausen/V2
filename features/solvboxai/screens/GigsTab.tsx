import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";

import { sizes } from '@/config/theme/sizes';
import { spacing } from '@/config/theme/spacing';
import { withOpacity } from '@/config/theme/styleUtils';
import { ui } from '@/config/theme/ui';
import { TileData } from '@/features/mysolvbox/types';
import { useErrorHandler, ErrorNotificationType } from '@/hooks/useErrorHandler';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BaseTabScreen } from '@/shared-components/container/BaseTabScreen';
import { TileGrid } from '@/shared-components/container/TileGrid';
import { EmptyState } from '@/shared-components/ui/EmptyState';
import { ErrorBoundary } from '@/shared-components/utils/ErrorBoundary';
import { createLogger } from '@/utils/logger';

import { useGigsTab } from "../hooks/useGigsTab";
import { GigTileData } from "../types";
import { toTileGridId } from "../utils/tileIds";

// Erstelle einen spezialisierten Logger für diese Komponente
const logger = createLogger({ prefix: '🧩 GigsTab' });

/**
 * Fallback-Komponente für Fehler im Tab
 * Diese Komponente wird angezeigt, wenn im GigsTab ein nicht abgefangener Fehler auftritt
 * @returns {JSX.Element} Die Fehleranzeige-Komponente
 */
function GigsErrorFallback(): JSX.Element {
  const { t } = useTranslation();
  const colors = useThemeColor();
  
  return (
    <BaseTabScreen>
      <View style={styles.errorContainer}>
        <View style={[styles.errorBox, { backgroundColor: withOpacity(colors.error, 0.15) }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {t('solvboxai.errorMessages.gigs')}
          </Text>
        </View>
      </View>
    </BaseTabScreen>
  );
}

/**
 * Tab für verfügbare Gigs in SolvboxAI
 * Zeigt eine Liste von Gig-Kacheln an, die der Benutzer auswählen kann.
 * Enthält integrierte Fehlerbehandlung und Anzeige von Leerzuständen.
 * @returns {JSX.Element} Die GigsTab-Komponente
 */
export function GigsTab(): JSX.Element {
  const { t } = useTranslation();
  const colors = useThemeColor();
  
  // Verwende den spezialisierten Hook für die Geschäftslogik
  const {
    filteredTiles,
    handleTilePress,
    isLoading,
    error,
  } = useGigsTab();

  // Wir verwenden den StandardErrorHandler nur noch für die UI-Darstellung
  // Die eigentliche Fehlerlogik ist im SolvboxAIService und useGigsTab-Hook
  const { 
    notificationType
  } = useErrorHandler({ 
    loggerPrefix: '🧩 GigsTab',
    defaultNotificationType: ErrorNotificationType.INLINE
  });

  /**
   * Rendert die passende Fehlermeldung basierend auf dem Fehlertyp
   * @param {Error | any} err - Der aufgetretene Fehler
   * @returns {JSX.Element} Die Fehleranzeige-Komponente
   */
  const renderError = useCallback((err: Error | any | null) => {
    if (!err) return null;

    // Prüfe, ob der Fehler die Eigenschaften eines SolvboxAIError hat
    if (err && typeof err === 'object' && 'type' in err && 'shouldDisplay' in err && err.shouldDisplay) {
      // Je nach Fehlertyp unterschiedliche Fehlermeldung
      switch (err.type) {
        case 'network': // SolvboxAIErrorType.NETWORK
          return (
            <EmptyState
              title={t('errors.networkErrorTitle', 'Netzwerkfehler')}
              message={t('errors.networkErrorMessage', 'Bitte überprüfe deine Internetverbindung und versuche es später erneut.')}
            />
          );
        case 'not_found': // SolvboxAIErrorType.NOT_FOUND
          return (
            <EmptyState
              title={t('errors.notFoundTitle', 'Daten nicht gefunden')}
              message={t('errors.notFoundMessage', 'Die angeforderten Gigs konnten nicht gefunden werden.')}
            />
          );
        case 'server': // SolvboxAIErrorType.SERVER
          return (
            <EmptyState
              title={t('errors.serverErrorTitle', 'Serverfehler')}
              message={t('errors.serverErrorMessage', 'Es ist ein Serverfehler aufgetreten. Unser Team wurde informiert.')}
            />
          );
        default:
          return (
            <EmptyState
              title={t('errors.genericErrorTitle', 'Fehler aufgetreten')}
              message={t('solvboxai.errorMessages.gigs')}
            />
          );
      }
    }

    // Standardfehleranzeige
    return (
      <EmptyState
        title={t('errors.genericErrorTitle', 'Fehler aufgetreten')}
        message={t('solvboxai.errorMessages.gigs')}
      />
    );
  }, [t]);
  
  // Erstelle benutzerdefinierte Fallback-Komponenten für die TileGrid
  const errorFallback = error ? renderError(error) : undefined;
  const emptyComponent = (
    <EmptyState
      title={t('common.noResults', 'Keine Ergebnisse')}
      message={t('solvboxai.emptyStates.gigs')}
    />
  );
  
  // Wrapper-Funktion für handleTilePress, um ID-Konvertierung sicherzustellen
  const handleTilePressWithIdConversion = useCallback((id: number) => {
    handleTilePress(id);
  }, [handleTilePress]);

  // Konvertiere die Gig-Daten für die TileGrid-Komponente
  const tileGridCompatibleData = filteredTiles.map(tile => ({
    ...tile,
    id: toTileGridId(tile.id)
  }));

  return (
    <ErrorBoundary 
      fallback={<GigsErrorFallback />}
      onError={(catchError) => {
        // Log des Fehlers, aber keine weitere Behandlung nötig
        logger.error('Unerwarteter Fehler in GigsTab:', catchError);
      }}
    >
      <BaseTabScreen isLoading={isLoading}>
        {isLoading ? (
          <EmptyState
            title={t('common.loading', 'Wird geladen')}
            message={t('common.pleaseWait', 'Bitte warten...')}
          />
        ) : (
          <TileGrid
            tiles={tileGridCompatibleData}
            onTilePress={handleTilePressWithIdConversion}
            errorFallback={errorFallback}
            emptyComponent={emptyComponent}
          />
        )}
      </BaseTabScreen>
    </ErrorBoundary>
  );
}

// Standardexport für die Nutzung in anderen Komponenten
export default GigsTab;

const styles = StyleSheet.create({
  errorContainer: {
    padding: spacing.m,
    width: '100%',
  },
  errorBox: {
    borderRadius: ui.borderRadius.s,
    padding: spacing.m,
  },
  errorText: {
    textAlign: 'center',
  }
}); 