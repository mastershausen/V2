/**
 * LinkManager-Komponente
 * 
 * Komponente zur Verwaltung von Links in Nuggets.
 * Unterstützt das Hinzufügen, Bearbeiten und Entfernen von Links.
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleProp, 
  ViewStyle, 
  Keyboard,
  Linking
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { logger } from '@/utils/logger';

interface LinkManagerProps {
  /**
   * Aktueller Link
   */
  link: string | null;
  
  /**
   * Callback zum Setzen des Links
   */
  onLinkChange: (link: string | null) => void;
  
  /**
   * Flag, ob gerade ein Link hinzugefügt wird
   */
  isAddingLink: boolean;
  
  /**
   * Callback zum Umschalten des isAddingLink-Status
   */
  onToggleAddingLink: (isAdding?: boolean) => void;
  
  /**
   * Aktueller Validierungsfehler
   */
  error?: string;
  
  /**
   * Ob die Komponente deaktiviert sein soll
   */
  disabled?: boolean;
  
  /**
   * Benutzerdefinierte Styles für den Container
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Hilfsfunktion zur Validierung von URLs
 * @param {string} url - Die zu prüfende URL
 * @returns {boolean} True wenn die URL gültig ist, sonst false
 */
const isValidUrl = (url: string): boolean => {
  try {
    // Einfache URL-Validierung
    const pattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
    if (!pattern.test(url)) return false;
    
    // Falls keine Protokoll-Angabe, "https://" hinzufügen und nochmal prüfen
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Komponente zur Verwaltung von Links in Nuggets
 * @param {object} props - Die Komponenten-Properties
 * @param {string|null} props.link - Aktueller Link
 * @param {Function} props.onLinkChange - Callback zum Setzen des Links
 * @param {boolean} props.isAddingLink - Flag, ob gerade ein Link hinzugefügt wird
 * @param {Function} props.onToggleAddingLink - Callback zum Umschalten des isAddingLink-Status
 * @param {string} props.error - Aktueller Validierungsfehler
 * @param {boolean} props.disabled - Ob die Komponente deaktiviert sein soll
 * @param {StyleProp<ViewStyle>} props.style - Benutzerdefinierte Styles für den Container
 * @returns {React.ReactElement|null} Die LinkManager-Komponente oder null wenn kein Link vorhanden und nicht im Hinzufügen-Modus
 */
function LinkManager({
  link,
  onLinkChange,
  isAddingLink,
  onToggleAddingLink,
  error,
  disabled = false,
  style
}: LinkManagerProps): React.ReactElement | null {
  const colors = useThemeColor();
  
  // Lokaler Zustand für die Eingabe
  const [inputValue, setInputValue] = useState<string>(link || '');
  
  /**
   * Formatieren eines Links zur Anzeige
   * @param {string} url - Die zu formatierende URL
   * @returns {string} Die formatierte URL
   */
  const formatLink = useCallback((url: string): string => {
    // Entferne Protokoll zur Anzeige
    return url.replace(/^https?:\/\//i, '');
  }, []);
  
  // Link-Eingabe speichern
  const handleSaveLink = useCallback(() => {
    if (!inputValue.trim()) {
      onLinkChange(null);
      onToggleAddingLink(false);
      return;
    }
    
    let processedLink = inputValue.trim();
    
    // Prüfe ob die URL valide ist
    if (!isValidUrl(processedLink)) {
      onLinkChange(null);
      setInputValue('');
      onToggleAddingLink(false);
      return;
    }
    
    // Füge HTTP-Protokoll hinzu, falls nicht vorhanden
    if (!/^https?:\/\//i.test(processedLink)) {
      processedLink = 'https://' + processedLink;
    }
    
    onLinkChange(processedLink);
    onToggleAddingLink(false);
    Keyboard.dismiss();
  }, [inputValue, onLinkChange, onToggleAddingLink]);
  
  // Link-Eingabe abbrechen
  const handleCancelLink = useCallback(() => {
    setInputValue(link || '');
    onToggleAddingLink(false);
    Keyboard.dismiss();
  }, [link, onToggleAddingLink]);
  
  // Link öffnen
  const handleOpenLink = useCallback(async () => {
    if (!link) return;
    
    try {
      const canOpen = await Linking.canOpenURL(link);
      if (canOpen) {
        await Linking.openURL(link);
      }
    } catch (error) {
      logger.error('Fehler beim Öffnen des Links:', error instanceof Error ? error.message : String(error));
    }
  }, [link]);
  
  // Wenn kein Link gesetzt ist und nicht im Hinzufügen-Modus, nichts rendern
  if (!isAddingLink && !link) return null;
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.backgroundSecondary,
          opacity: disabled ? 0.5 : 1
        },
        style
      ]}
    >
      {isAddingLink ? (
        <>
          <Ionicons name="link" size={20} color={colors.textSecondary} style={styles.linkIcon} />
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="https://..."
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={handleSaveLink}
            editable={!disabled}
          />
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCancelLink}
              disabled={disabled}
            >
              <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                Abbrechen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleSaveLink}
              disabled={!inputValue.trim() || disabled}
            >
              <Text 
                style={[
                  styles.actionButtonText, 
                  { color: inputValue.trim() ? colors.primary : colors.textTertiary }
                ]}
              >
                Speichern
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Ionicons name="link" size={20} color={colors.textSecondary} style={styles.linkIcon} />
          <TouchableOpacity 
            style={styles.linkTextContainer}
            onPress={handleOpenLink}
            disabled={disabled}
          >
            <Text 
              style={[styles.linkText, { color: colors.textPrimary }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {link ? formatLink(link) : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => onLinkChange(null)}
            disabled={disabled}
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </>
      )}
      
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
    borderRadius: ui.borderRadius.m,
    padding: spacing.s,
  },
  linkIcon: {
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.m,
    paddingVertical: spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: spacing.m,
  },
  actionButton: {
    marginLeft: spacing.s,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
  },
  actionButtonText: {
    fontSize: typography.fontSize.s,
    fontWeight: 'bold',
  },
  linkTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: typography.fontSize.m,
  },
  removeButton: {
    padding: spacing.xxs,
  },
  errorText: {
    fontSize: typography.fontSize.s,
    marginTop: spacing.xs,
    marginLeft: spacing.l,
  }
});

export { LinkManager }; 