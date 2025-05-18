import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { BaseTabScreen } from '@/shared-components/container/BaseTabScreen';
import { TileGrid } from '@/shared-components/container/TileGrid';
import { EmptyState } from '@/shared-components/ui/EmptyState';

import { useBonusTab } from '../hooks/useBonusTab';
import { BonusTileData, SolvboxTabId } from '../types';

/**
 * BonusTab-Komponente
 * 
 * Zeigt Kacheln für zusätzliche Optimierungen und Sonderangebote an.
 */
export function BonusTab() {
  const { t } = useTranslation();
  const { 
    tiles, 
    handleTilePress, 
    isLoading, 
    error 
  } = useBonusTab();

  const renderErrorMessage = () => (
    <EmptyState
      title={t('errors.genericErrorTitle', 'Fehler aufgetreten')}
      message={t('mysolvbox.errorMessages.bonus')}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      title={t('common.noResults', 'Keine Ergebnisse')}
      message={t('mysolvbox.emptyStates.bonus')}
    />
  );

  return (
    <BaseTabScreen<BonusTileData>
      tabId="bonus"
      isLoading={isLoading}
    >
      {isLoading ? (
        <EmptyState
          title={t('common.loading', 'Wird geladen')}
          message={t('common.pleaseWait', 'Bitte warten...')}
        />
      ) : (
        <TileGrid<BonusTileData>
          tiles={tiles}
          onTilePress={handleTilePress}
          errorFallback={error ? renderErrorMessage() : undefined}
          emptyComponent={renderEmptyState()}
        />
      )}
    </BaseTabScreen>
  );
} 