/**
 * SolvboxAITabbar - UI-Komponente für die SolvboxAI-Tabbar
 * 
 * Diese Komponente ist eine reine UI-Komponente, die die Struktur der Tabs anzeigt.
 * Sie verwendet den SolvboxAITabbarContainer für die eigentliche Geschäftslogik.
 * 
 * Beispiel für die Trennung von UI und Logik nach dem Goldstandard-Design-Pattern.
 */

import React from 'react';

import { TabbarComponentProps } from '@/shared-components/container/TabScreensContainer';

import SolvboxAITabbarContainer from './SolvboxAITabbarContainer';
import { SolvboxAITabbarProps } from '../../types';

/**
 * SolvboxAITabbar ist eine reine UI-Komponente, die den SolvboxAITabbarContainer verwendet,
 * um die Geschäftslogik von der Darstellung zu trennen.
 * @param props
 */
export function SolvboxAITabbar(props: SolvboxAITabbarProps) {
  return <SolvboxAITabbarContainer {...props} />;
}

// Stellt sicher, dass der Export den korrekten Typ für die Verwendung mit TabScreensContainer hat
export default SolvboxAITabbar as React.ComponentType<TabbarComponentProps>; 