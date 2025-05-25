/**
 * KeyboardToolbar-Komponente
 * 
 * Anpassbare Werkzeugleiste, die über der Tastatur angezeigt wird.
 * Bietet verschiedene Aktionen für die Texteingabe und Medien.
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle, 
  Platform,
  KeyboardAvoidingView,
  Text,
  Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/ui/useThemeColor';

export interface ToolbarAction {
  /**
   * Symbol für die Aktion
   */
  icon: string;
  
  /**
   * Callback-Funktion bei Klick
   */
  onPress: () => void;
  
  /**
   * Ob die Aktion ausgewählt ist
   */
  selected?: boolean;
  
  /**
   * Ob die Aktion deaktiviert ist
   */
  disabled?: boolean;
  
  /**
   * Eindeutige ID für die Aktion
   */
  id: string;
  
  /**
   * Beschreibung für Screenreader (Barrierefreiheit)
   */
  accessibilityLabel?: string;
  
  /**
   * Text-Label, das unter dem Icon angezeigt wird
   */
  label?: string;
}

interface KeyboardToolbarProps {
  /**
   * Array von Aktionen, die in der Toolbar angezeigt werden
   */
  actions: ToolbarAction[];
  
  /**
   * Ob die Toolbar angezeigt werden soll
   */
  visible?: boolean;
  
  /**
   * Benutzerdefinierte Styles für den Container
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Komponente für eine anpassbare Werkzeugleiste über der Tastatur
 * @param {object} props - Die Komponenten-Properties
 * @param {ToolbarAction[]} props.actions - Array von Aktionen, die in der Toolbar angezeigt werden
 * @param {boolean} props.visible - Ob die Toolbar angezeigt werden soll
 * @param {StyleProp<ViewStyle>} props.style - Benutzerdefinierte Styles für den Container
 * @returns {React.ReactElement | null} Die KeyboardToolbar-Komponente oder null wenn nicht sichtbar
 */
function KeyboardToolbar({
  actions,
  visible = true,
  style
}: KeyboardToolbarProps): React.ReactElement | null {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);
  
  // Wenn die Toolbar nicht sichtbar sein soll, nichts rendern
  if (!visible) return null;
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.divider,
          paddingBottom: keyboardVisible ? spacing.xs : spacing.xs + insets.bottom,
        },
        style
      ]}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={[
            styles.actionButton,
            {
              backgroundColor: action.disabled 
                ? colors.backgroundTertiary
                : action.id === 'save'
                  ? colors.primary
                  : action.id === 'pricing' 
                    ? action.selected 
                      ? colors.primary 
                      : colors.backgroundTertiary  // Ausgegraut wenn nicht selected
                    : 'transparent',
              borderWidth: 1,
              borderColor: action.disabled
                ? colors.divider
                : action.id === 'pricing' && !action.selected
                  ? colors.divider  // Grauer Rahmen für nicht ausgewählten Pricing-Button
                  : colors.primary,
            },
            action.selected && {
              backgroundColor: colors.primary,
            }
          ]}
          onPress={action.onPress}
          disabled={action.disabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel || action.label || action.id}
          accessibilityState={{ 
            disabled: action.disabled,
            selected: action.selected
          }}
        >
          <Ionicons 
            name={action.icon as keyof typeof Ionicons.glyphMap} 
            size={16} 
            color={action.disabled 
              ? colors.textTertiary 
              : action.id === 'save' || (action.id === 'pricing' && action.selected) || action.selected
                ? '#FFFFFF'
                : action.id === 'pricing' && !action.selected
                  ? colors.textTertiary  // Graue Schrift für nicht ausgewählten Pricing-Button
                  : colors.primary
            } 
          />
          {action.label && (
            <Text style={[
              styles.label,
              {
                color: action.disabled 
                  ? colors.textTertiary 
                  : action.id === 'save' || (action.id === 'pricing' && action.selected) || action.selected
                    ? '#FFFFFF'
                    : action.id === 'pricing' && !action.selected
                      ? colors.textTertiary  // Graue Schrift für nicht ausgewählten Pricing-Button
                      : colors.primary
              }
            ]}>
              {action.label}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.s,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: 18,
    minHeight: 32,
    flex: 1,
    marginHorizontal: spacing.xs,
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.fontSize.s,
    marginLeft: spacing.xs,
    flexShrink: 1,
    fontWeight: typography.fontWeight.semiBold as any,
  }
});

export { KeyboardToolbar }; 