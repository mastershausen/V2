import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { BaseTabScreen } from '@/shared-components/container/BaseTabScreen';
import { TileGrid } from '@/shared-components/container/TileGrid';
import { EmptyState } from '@/shared-components/ui/EmptyState';

import { useGrowTab } from '../hooks/useGrowTab';
import { GrowTileData, SolvboxTabId } from '../types';

/**
 * GrowTab-Komponente
 * 
 * Zeigt Kacheln für Wachstumsstrategien und Unternehmensexpansion an.
 */
export function GrowTab() {
  const { t } = useTranslation();
  const { 
    tiles, 
    handleTilePress, 
    isLoading, 
    error 
  } = useGrowTab();

  const renderErrorMessage = () => (
    <EmptyState
      title={t('errors.genericErrorTitle', 'Fehler aufgetreten')}
      message={t('mysolvbox.errorMessages.grow')}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      title={t('common.noResults', 'Keine Ergebnisse')}
      message={t('mysolvbox.emptyStates.grow')}
    />
  );

  return (
    <BaseTabScreen<GrowTileData>
      tabId="grow"
      isLoading={isLoading}
    >
      {isLoading ? (
        <EmptyState
          title={t('common.loading', 'Wird geladen')}
          message={t('common.pleaseWait', 'Bitte warten...')}
        />
      ) : (
        <TileGrid<GrowTileData>
          tiles={tiles}
          onTilePress={handleTilePress}
          errorFallback={error ? renderErrorMessage() : undefined}
          emptyComponent={renderEmptyState()}
          tilesPerRow={3}
        />
      )}
    </BaseTabScreen>
  );
} 