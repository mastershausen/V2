import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { BaseTabScreen } from '@/shared-components/container/BaseTabScreen';
import { TileGrid } from '@/shared-components/container/TileGrid';
import { EmptyState } from '@/shared-components/ui/EmptyState';

import { useSaveTab } from '../hooks/useSaveTab';
import { SaveTileData, SolvboxTabId } from '../types';

/**
 * SaveTab-Komponente
 * 
 * Zeigt Kacheln für Kosteneinsparungen und finanzielle Optimierungen an.
 */
export function SaveTab() {
  const { t } = useTranslation();
  const { 
    tiles, 
    handleTilePress, 
    isLoading, 
    error 
  } = useSaveTab();

  const renderErrorMessage = () => (
    <EmptyState
      title={t('errors.genericErrorTitle', 'Fehler aufgetreten')}
      message={t('mysolvbox.errorMessages.save')}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      title={t('common.noResults', 'Keine Ergebnisse')}
      message={t('mysolvbox.emptyStates.save')}
    />
  );

  return (
    <BaseTabScreen<SaveTileData>
      tabId="save"
      isLoading={isLoading}
    >
      {isLoading ? (
        <EmptyState
          title={t('common.loading', 'Wird geladen')}
          message={t('common.pleaseWait', 'Bitte warten...')}
        />
      ) : (
        <TileGrid<SaveTileData>
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