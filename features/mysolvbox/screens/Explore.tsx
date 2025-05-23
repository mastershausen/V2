import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FilterTabItem } from '@/shared-components/navigation/FilterTabs';
import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * FilterDropdown - Elegantes Dropdown für FilterTabs
 */
interface FilterDropdownProps {
  tabs: FilterTabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

function FilterDropdown({ tabs, activeTabId, onTabChange }: FilterDropdownProps) {
  const colors = useThemeColor();
  const [isOpen, setIsOpen] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Finde das aktive Tab
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  const openDropdown = () => {
    setIsOpen(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const closeDropdown = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
    });
  };
  
  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    closeDropdown();
  };
  
  const renderDropdownItem = ({ item }: { item: FilterTabItem }) => {
    const isActive = item.id === activeTabId;
    
    return (
      <TouchableOpacity
        style={[
          dropdownStyles.item,
          { 
            backgroundColor: isActive ? colors.pastel.primary : 'transparent',
            borderColor: colors.divider,
          }
        ]}
        onPress={() => handleTabSelect(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[
          dropdownStyles.itemText,
          { 
            color: isActive ? colors.primary : colors.textPrimary,
            fontWeight: isActive ? '600' : 'normal',
          }
        ]}>
          {item.label}
        </Text>
        {isActive && (
          <Ionicons 
            name="checkmark" 
            size={20} 
            color={colors.primary} 
            style={dropdownStyles.checkmark}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={[
          dropdownStyles.button,
          { 
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
          }
        ]}
        onPress={openDropdown}
        activeOpacity={0.8}
      >
        <Text style={[
          dropdownStyles.buttonText,
          { color: colors.textPrimary }
        ]}>
          {activeTab?.label || 'Kategorie wählen'}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.textSecondary}
          style={dropdownStyles.chevron}
        />
      </TouchableOpacity>
      
      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={dropdownStyles.overlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <Animated.View 
            style={[
              dropdownStyles.dropdown,
              { 
                backgroundColor: colors.backgroundPrimary,
                borderColor: colors.divider,
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  })
                }]
              }
            ]}
          >
            <View style={[
              dropdownStyles.header,
              { borderBottomColor: colors.divider }
            ]}>
              <Text style={[
                dropdownStyles.headerText,
                { color: colors.textPrimary }
              ]}>
                Kategorie auswählen
              </Text>
              <TouchableOpacity
                onPress={closeDropdown}
                style={dropdownStyles.closeButton}
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={tabs}
              renderItem={renderDropdownItem}
              keyExtractor={(item) => item.id}
              style={dropdownStyles.list}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const dropdownStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.m,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    marginLeft: spacing.s,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  dropdown: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing.xs,
  },
  list: {
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    marginLeft: spacing.s,
  },
});

/**
 * Explore-Screen - Neuer, sauberer Screen ohne Header-Probleme
 *
 * Zeigt FilterDropdown für verschiedene Business-Kategorien an.
 * @returns {React.ReactElement} Die gerenderte Explore-Komponente
 */
export default function ExploreScreen(): React.ReactElement {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  
  // FilterTabs State
  const [activeFilter, setActiveFilter] = React.useState('alle');

  // Handler für FilterTabs
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  // FilterTabs-Konfiguration
  const FILTER_TABS: FilterTabItem[] = [
    { id: 'alle', label: 'Alle' },
    { id: 'steuern', label: 'Steuern' },
    { id: 'immobilien', label: 'Immobilien' },
    { id: 'mitarbeiter', label: 'Mitarbeiter' },
    { id: 'kundengewinnung', label: 'Kundengewinnung' },
    { id: 'ki', label: 'Künstliche Intelligenz' },
    { id: 'investments', label: 'Investments' },
    { id: 'finanzierung', label: 'Finanzierung' },
    { id: 'unternehmensstruktur', label: 'Unternehmensstruktur' },
    { id: 'recht-sicherheit', label: 'Recht & Sicherheit' },
    { id: 'auswandern', label: 'Auswandern' },
    { id: 'verkauf-exit', label: 'Verkauf & Exit' },
    { id: 'persoenliches-wachstum', label: 'Persönliches Wachstum' }
  ];
  
  return (
    <View style={[styles.container, { 
      backgroundColor: colors.backgroundPrimary,
      paddingTop: insets.top 
    }]}>
      {/* Einfacher Header Text - keine komplexe Komponente */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      
      {/* Filter Dropdown */}
      <View style={styles.filterSection}>
        <FilterDropdown 
          tabs={FILTER_TABS}
          activeTabId={activeFilter}
          onTabChange={handleFilterChange}
        />
      </View>
      
      {/* Content Area */}
      <View style={styles.contentSection}>
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
          Hier kommen später die gefilterten Inhalte für: {FILTER_TABS.find(tab => tab.id === activeFilter)?.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
  },
  filterSection: {
    paddingVertical: spacing.m,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 