import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { BaseTabScreen } from '@/shared-components/container/BaseTabScreen';
import { TileGrid } from '@/shared-components/container/TileGrid';
import { EmptyState } from '@/shared-components/ui/EmptyState';

import { useForesightTab } from '../hooks/useForesightTab';
import { ForesightTileData, SolvboxTabId } from '../types';

/**
 * ForesightTab-Komponente
 * 
 * Zeigt Kacheln für langfristige Planung und strategische Entscheidungen an.
 */
export function ForesightTab() {
  const { t } = useTranslation();
  const { 
    tiles, 
    handleTilePress, 
    isLoading, 
    error 
  } = useForesightTab();

  const renderErrorMessage = () => (
    <EmptyState
      title={t('errors.genericErrorTitle', 'Fehler aufgetreten')}
      message={t('mysolvbox.errorMessages.foresight')}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      title={t('common.noResults', 'Keine Ergebnisse')}
      message={t('mysolvbox.emptyStates.foresight')}
    />
  );

  return (
    <BaseTabScreen<ForesightTileData>
      tabId="foresight"
      isLoading={isLoading}
    >
      {isLoading ? (
        <EmptyState
          title={t('common.loading', 'Wird geladen')}
          message={t('common.pleaseWait', 'Bitte warten...')}
        />
      ) : (
        <TileGrid<ForesightTileData>
          tiles={tiles}
          onTilePress={handleTilePress}
          errorFallback={error ? renderErrorMessage() : undefined}
          emptyComponent={renderEmptyState()}
        />
      )}
    </BaseTabScreen>
  );
} 