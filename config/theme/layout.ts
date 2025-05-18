/**
 * Layout-System für die Solvbox App
 * 
 * Definiert Layout-Konstanten wie Höhen für Header, Tabs usw.
 */

import { sizes } from './sizes';
import { spacing } from './spacing';
import { ui } from './ui';

export const layout = {
  // Allgemeine Größen
  headerHeight: sizes.tabBar.default,
  tabBarHeight: sizes.tabBar.default,
  inputHeight: sizes.form.inputHeight,
  buttonHeight: sizes.elementSize.buttonHeight,
  
  // Icon-Größen aus ui.ts referenzieren
  iconSize: ui.icon,
  
  // Screen-spezifische Einstellungen
  screenMargins: spacing.screenPadding,
}; 