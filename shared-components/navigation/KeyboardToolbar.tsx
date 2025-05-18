/**
 * KeyboardToolbar-Komponente
 * 
 * Anpassbare Werkzeugleiste, die über der Tastatur angezeigt wird.
 * Bietet verschiedene Aktionen für die Texteingabe und Medien.
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle, 
  Platform,
  KeyboardAvoidingView
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
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
  
  // Wenn die Toolbar nicht sichtbar sein soll, nichts rendern
  if (!visible) return null;
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <View 
        style={[
          styles.container, 
          { 
            backgroundColor: colors.backgroundSecondary,
            borderTopColor: colors.divider,
          },
          style
        ]}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionButton,
              action.selected && {
                backgroundColor: colors.backgroundTertiary,
                borderRadius: ui.borderRadius.m,
              }
            ]}
            onPress={action.onPress}
            disabled={action.disabled}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel || action.id}
            accessibilityState={{ 
              disabled: action.disabled,
              selected: action.selected
            }}
          >
            <Ionicons 
              name={action.icon as keyof typeof Ionicons.glyphMap} 
              size={24} 
              color={action.disabled 
                ? colors.textTertiary 
                : action.selected 
                  ? colors.primary 
                  : colors.textSecondary
              } 
            />
          </TouchableOpacity>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderTopWidth: 1,
  },
  actionButton: {
    padding: spacing.s,
    borderRadius: ui.borderRadius.m,
  }
});

export { KeyboardToolbar }; 