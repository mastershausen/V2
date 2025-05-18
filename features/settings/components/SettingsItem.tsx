import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  Platform, 
  ViewStyle,
  TextStyle
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface SettingsItemProps {
  label: string;
  icon?: string;
  value?: string | number | boolean;
  onPress?: () => void;
  showArrow?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  testID?: string;
}

/**
 * Eine einzelne Einstellung in der Settings-Ansicht
 * @param root0
 * @param root0.label
 * @param root0.icon
 * @param root0.value
 * @param root0.onPress
 * @param root0.showArrow
 * @param root0.isSwitch
 * @param root0.switchValue
 * @param root0.onSwitchChange
 * @param root0.testID
 */
export function SettingsItem({
  label,
  icon,
  value,
  onPress,
  showArrow = false,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  testID
}: SettingsItemProps) {
  const colors = useThemeColor();
  
  // Icon festlegen
  const iconName = icon || 'ellipse';
  
  // Inhalt zusammen mit Icon erstellen
  const renderContent = () => (
    <>
      <View style={styles.leftContainer}>
        {icon && (
          <Ionicons 
            name={iconName as any} 
            size={22} 
            color={colors.textSecondary} 
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {label}
        </Text>
      </View>
      
      <View style={styles.rightContainer}>
        {value !== undefined && !isSwitch && (
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}
        
        {isSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ 
              false: Platform.OS === 'ios' ? '#e9e9ea' : '#d1d1d6', 
              true: colors.primary 
            }}
            thumbColor={Platform.OS === 'android' 
              ? (switchValue ? colors.primary : '#f4f3f4') 
              : '#ffffff'
            }
            ios_backgroundColor="#e9e9ea"
            testID={`${testID}-switch`}
          />
        )}
        
        {showArrow && (
          <Ionicons 
            name={Platform.OS === 'ios' ? 'chevron-forward' : 'chevron-forward-outline'} 
            size={20} 
            color={colors.textSecondary} 
            style={styles.arrowIcon}
          />
        )}
      </View>
    </>
  );
  
  return onPress ? (
    <TouchableOpacity 
      style={[
        styles.container, 
        { borderBottomColor: colors.divider }
      ]} 
      onPress={onPress}
      activeOpacity={0.6}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  ) : (
    <View 
      style={[
        styles.container, 
        { borderBottomColor: colors.divider }
      ]}
      testID={testID}
    >
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: spacing.s,
    width: 24,
  },
  label: {
    fontSize: typography.fontSize.m,
    fontWeight: '400',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: typography.fontSize.s,
    marginRight: spacing.s,
  },
  arrowIcon: {
    marginLeft: spacing.xs,
  },
}); 