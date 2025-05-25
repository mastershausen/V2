import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, Animated, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { FilterTabItem } from '@/shared-components/navigation/FilterTabs';
import { TileGrid } from '@/shared-components/container/TileGrid';
import { FooterActionButton } from '@/shared-components/navigation/FooterActionButton';
import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tile data type
interface ExploreTile {
  id: number;
  title: string;
  category: string;
}

// All Explore-Tiles with shortened text starting with "..."
const EXPLORE_TILES: ExploreTile[] = [
  // 1. Taxes
  { id: 1, title: "...more net from gross", category: "taxes" },
  { id: 2, title: "...to halve my tax burden", category: "taxes" },
  { id: 3, title: "...to build tax-free reserves", category: "taxes" },
  { id: 4, title: "...to distribute profits tax-free", category: "taxes" },
  { id: 5, title: "...to sell my company tax-free", category: "taxes" },
  { id: 6, title: "...to establish a holding company", category: "taxes" },
  { id: 7, title: "...to avoid trade tax", category: "taxes" },
  { id: 8, title: "...to correctly remit VAT", category: "taxes" },
  { id: 9, title: "...to get refunds from tax office", category: "taxes" },
  { id: 10, title: "...to avoid disguised profit distributions", category: "taxes" },
  { id: 11, title: "...to correctly record my withdrawals", category: "taxes" },
  { id: 12, title: "...to cleanly deduct private expenses", category: "taxes" },
  { id: 13, title: "...to use tax-free salary extras", category: "taxes" },
  { id: 14, title: "...to understand my tax assessments", category: "taxes" },
  { id: 15, title: "...to optimize my balance sheet for taxes", category: "taxes" },
  { id: 16, title: "...to cleverly use investment deduction", category: "taxes" },
  { id: 17, title: "...to fully exploit depreciation", category: "taxes" },
  { id: 18, title: "...to donate with tax benefits", category: "taxes" },
  { id: 19, title: "...to reduce taxes through real estate", category: "taxes" },
  { id: 20, title: "...to optimize my taxes internationally", category: "taxes" },

  // 2. Real Estate
  { id: 21, title: "...to sell real estate tax-free", category: "real-estate" },
  { id: 22, title: "...to buy real estate through GmbH", category: "real-estate" },
  { id: 23, title: "...to hold real estate in business assets", category: "real-estate" },
  { id: 24, title: "...to find off-market real estate", category: "real-estate" },
  { id: 25, title: "...to rent real estate profitably", category: "real-estate" },
  { id: 26, title: "...to legally terminate a tenant", category: "real-estate" },
  { id: 27, title: "...to transfer real estate to my children", category: "real-estate" },
  { id: 28, title: "...to optimally depreciate real estate", category: "real-estate" },
  { id: 29, title: "...to digitalize my real estate portfolio", category: "real-estate" },
  { id: 30, title: "...to combine real estate with holding", category: "real-estate" },
  { id: 31, title: "...to finance real estate cheaply", category: "real-estate" },
  { id: 32, title: "...to simplify ownership structures", category: "real-estate" },
  { id: 33, title: "...to establish real estate companies", category: "real-estate" },
  { id: 34, title: "...to trade real estate internationally", category: "real-estate" },
  { id: 35, title: "...to profitably use foreclosures", category: "real-estate" },
  { id: 36, title: "...to scale my real estate business", category: "real-estate" },
  { id: 37, title: "...to develop real estate commercially", category: "real-estate" },
  { id: 38, title: "...to gift real estate tax-free", category: "real-estate" },
  { id: 39, title: "...to secure my real estate wealth", category: "real-estate" },
  { id: 40, title: "...to become liquid from real estate", category: "real-estate" },

  // 3. Employees
  { id: 41, title: "...to hire better employees", category: "employees" },
  { id: 42, title: "...to retain employees long-term", category: "employees" },
  { id: 43, title: "...to reduce my turnover rate", category: "employees" },
  { id: 44, title: "...to optimize salaries for taxes", category: "employees" },
  { id: 45, title: "...to build a strong team", category: "employees" },
  { id: 46, title: "...to establish a leadership culture", category: "employees" },
  { id: 47, title: "...to avoid labor law traps", category: "employees" },
  { id: 48, title: "...to efficiently onboard employees", category: "employees" },
  { id: 49, title: "...to fairly regulate performance bonuses", category: "employees" },
  { id: 50, title: "...to reduce illness-related absences", category: "employees" },
  { id: 51, title: "...to set up self-organized teams", category: "employees" },
  { id: 52, title: "...to systematically retain A-players", category: "employees" },
  { id: 53, title: "...to find good employees faster", category: "employees" },
  { id: 54, title: "...to manage turnover cost-neutral", category: "employees" },
  { id: 55, title: "...to relieve my team without layoffs", category: "employees" },
  { id: 56, title: "...to control labor costs strategically", category: "employees" },
  { id: 57, title: "...to reward employees tax-free", category: "employees" },
  { id: 58, title: "...to properly manage remote teams", category: "employees" },
  { id: 59, title: "...to conduct professional personnel talks", category: "employees" },
  { id: 60, title: "...growth without overload", category: "employees" },

  // 4. Customer Acquisition
  { id: 61, title: "...regular new customers", category: "customer-acquisition" },
  { id: 62, title: "...predictable leads per month", category: "customer-acquisition" },
  { id: 63, title: "...to sell independent of referrals", category: "customer-acquisition" },
  { id: 64, title: "...a funnel that sells", category: "customer-acquisition" },
  { id: 65, title: "...to digitalize my sales", category: "customer-acquisition" },
  { id: 66, title: "...sales that close deals", category: "customer-acquisition" },
  { id: 67, title: "...to automate customer retention", category: "customer-acquisition" },
  { id: 68, title: "...to replace cold calling", category: "customer-acquisition" },
  { id: 69, title: "...to reactivate existing customers", category: "customer-acquisition" },
  { id: 70, title: "...to strategically use references", category: "customer-acquisition" },
  { id: 71, title: "...to confidently handle price negotiations", category: "customer-acquisition" },
  { id: 72, title: "...never to give discounts again", category: "customer-acquisition" },
  { id: 73, title: "...to turn new customers into regulars", category: "customer-acquisition" },
  { id: 74, title: "...to perfect objection handling", category: "customer-acquisition" },
  { id: 75, title: "...to fill online appointments", category: "customer-acquisition" },
  { id: 76, title: "...to turn leads into real customers", category: "customer-acquisition" },
  { id: 77, title: "...less effort per deal", category: "customer-acquisition" },
  { id: 78, title: "...to use cross-selling strategically", category: "customer-acquisition" },
  { id: 79, title: "...no more dead leads", category: "customer-acquisition" },
  { id: 80, title: "...better margins with same revenue", category: "customer-acquisition" },

  // 5. Artificial Intelligence
  { id: 81, title: "...to automate tasks with AI", category: "ai" },
  { id: 82, title: "...to really save time with GPT", category: "ai" },
  { id: 83, title: "...to use AI in customer service", category: "ai" },
  { id: 84, title: "...to automatically write proposals", category: "ai" },
  { id: 85, title: "...to create content with AI", category: "ai" },
  { id: 86, title: "...to eliminate repetitive tasks", category: "ai" },
  { id: 87, title: "...to make my sales process AI-supported", category: "ai" },
  { id: 88, title: "...my own GPT agent system", category: "ai" },
  { id: 89, title: "...to summarize meetings with AI", category: "ai" },
  { id: 90, title: "...to automatically generate marketing texts", category: "ai" },
  { id: 91, title: "...to integrate AI into my tools", category: "ai" },
  { id: 92, title: "...to efficiently use chatbots", category: "ai" },
  { id: 93, title: "...no more manual follow-ups", category: "ai" },
  { id: 94, title: "...to automate invoicing", category: "ai" },
  { id: 95, title: "...to use AI for PR & social media", category: "ai" },
  { id: 96, title: "...to automatically pre-sort applicants", category: "ai" },
  { id: 97, title: "...AI support 24/7", category: "ai" },
  { id: 98, title: "...to map content planning with AI", category: "ai" },
  { id: 99, title: "...to automatically maintain product data", category: "ai" },
  { id: 100, title: "...to strategically combine AI tools", category: "ai" },

  // 6. Investments
  { id: 101, title: "...to invest in startups", category: "investments" },
  { id: 102, title: "...to use real estate as investment", category: "investments" },
  { id: 103, title: "...to invest my money tax-optimized", category: "investments" },
  { id: 104, title: "...to build equity stakes", category: "investments" },
  { id: 105, title: "...to understand alternative investments", category: "investments" },
  { id: 106, title: "...safe investments with high returns", category: "investments" },
  { id: 107, title: "...to invest without daily operations", category: "investments" },
  { id: 108, title: "...to minimize investment risks", category: "investments" },
  { id: 109, title: "...passive income with substance", category: "investments" },
  { id: 110, title: "...to structure equity stakes tax-correctly", category: "investments" },
  { id: 111, title: "...to diversify my portfolio", category: "investments" },
  { id: 112, title: "...to allocate capital strategically", category: "investments" },
  { id: 113, title: "...to invest in companies that fit me", category: "investments" },
  { id: 114, title: "...investment with influence", category: "investments" },
  { id: 115, title: "...to intelligently build tangible assets", category: "investments" },
  { id: 116, title: "...to legally secure my investments", category: "investments" },
  { id: 117, title: "...to become a business angel", category: "investments" },
  { id: 118, title: "...to make my wealth independent", category: "investments" },
  { id: 119, title: "...to invest without bank connection", category: "investments" },
  { id: 120, title: "...to professionally check investment projects", category: "investments" },

  // 7. Financing
  { id: 121, title: "...to improve my liquidity short-term", category: "financing" },
  { id: 122, title: "...to receive funding I'm entitled to", category: "financing" },
  { id: 123, title: "...to sustainably reduce my costs", category: "financing" },
  { id: 124, title: "...to outsource my accounting", category: "financing" },
  { id: 125, title: "...to become bankable for a loan", category: "financing" },
  { id: 126, title: "...to optimize my income", category: "financing" },
  { id: 127, title: "...to radically cut my fixed costs", category: "financing" },
  { id: 128, title: "...to strategically raise my pricing", category: "financing" },
  { id: 129, title: "...invoices paid faster", category: "financing" },
  { id: 130, title: "...to automate my reminders", category: "financing" },
  { id: 131, title: "...to make my balance sheet understandable", category: "financing" },
  { id: 132, title: "...to simplify my cash flow management", category: "financing" },
  { id: 133, title: "...to control my liquidity with tools", category: "financing" },
  { id: 134, title: "...to cleverly manage liabilities", category: "financing" },
  { id: 135, title: "...no more number crunching", category: "financing" },
  { id: 136, title: "...to actively use discount strategies", category: "financing" },
  { id: 137, title: "...less bureaucracy in accounting", category: "financing" },
  { id: 138, title: "...to prepare my company for investors", category: "financing" },
  { id: 139, title: "...to strategically build financing", category: "financing" },
  { id: 140, title: "...to be able to control my tax advisor", category: "financing" },

  // 8. Corporate Structure
  { id: 141, title: "...to establish a holding company", category: "corporate-structure" },
  { id: 142, title: "...to sell my company", category: "corporate-structure" },
  { id: 143, title: "...to run my company without me", category: "corporate-structure" },
  { id: 144, title: "...to arrange my succession", category: "corporate-structure" },
  { id: 145, title: "...to cleanly transfer shares", category: "corporate-structure" },
  { id: 146, title: "...to cleverly use silent partnerships", category: "corporate-structure" },
  { id: 147, title: "...to create clear conditions with partners", category: "corporate-structure" },
  { id: 148, title: "...to build an exit strategy", category: "corporate-structure" },
  { id: 149, title: "...to partially sell my company", category: "corporate-structure" },
  { id: 150, title: "...to streamline my corporate structure", category: "corporate-structure" },
  { id: 151, title: "...to establish subsidiaries", category: "corporate-structure" },
  { id: 152, title: "...to fairly include co-founders", category: "corporate-structure" },
  { id: 153, title: "...to internationalize my structure", category: "corporate-structure" },
  { id: 154, title: "...to realize hidden reserves tax-free", category: "corporate-structure" },
  { id: 155, title: "...to make my company attractive for investors", category: "corporate-structure" },
  { id: 156, title: "...restructuring without chaos", category: "corporate-structure" },
  { id: 157, title: "...the best legal form for my model", category: "corporate-structure" },
  { id: 158, title: "...to systematize my company", category: "corporate-structure" },
  { id: 159, title: "...structure without overhead", category: "corporate-structure" },
  { id: 160, title: "...to contractually secure my company shares", category: "corporate-structure" },

  // 9. Legal & Security
  { id: 161, title: "...to set up legally secure contracts", category: "legal-security" },
  { id: 162, title: "...to terminate employees legally", category: "legal-security" },
  { id: 163, title: "...not to be liable if something goes wrong", category: "legal-security" },
  { id: 164, title: "...to protect my data from attacks", category: "legal-security" },
  { id: 165, title: "...IT security with little effort", category: "legal-security" },
  { id: 166, title: "...to no longer risk warnings", category: "legal-security" },
  { id: 167, title: "...to make my online presence legally secure", category: "legal-security" },
  { id: 168, title: "...to act GDPR-compliant", category: "legal-security" },
  { id: 169, title: "...to close contract gaps", category: "legal-security" },
  { id: 170, title: "...to protect my company from lawsuits", category: "legal-security" },
  { id: 171, title: "...to go into expansion legally prepared", category: "legal-security" },
  { id: 172, title: "...to be secured in disputes with customers", category: "legal-security" },
  { id: 173, title: "...to make my terms watertight", category: "legal-security" },
  { id: 174, title: "...to legally secure my management", category: "legal-security" },
  { id: 175, title: "...to operate safely as GmbH", category: "legal-security" },
  { id: 176, title: "...to enforce my trademark rights", category: "legal-security" },
  { id: 177, title: "...never data protection trouble again", category: "legal-security" },
  { id: 178, title: "...no problems with invoicing", category: "legal-security" },
  { id: 179, title: "...fair but safe employment contracts", category: "legal-security" },
  { id: 180, title: "...to have my company legally reviewed", category: "legal-security" },

  // 10. Emigration
  { id: 181, title: "...to relocate my company abroad", category: "emigration" },
  { id: 182, title: "...to emigrate as an entrepreneur", category: "emigration" },
  { id: 183, title: "...to live tax-free abroad", category: "emigration" },
  { id: 184, title: "...to emigrate with family", category: "emigration" },
  { id: 185, title: "...to live without residence", category: "emigration" },
  { id: 186, title: "...to work freely worldwide", category: "emigration" },
  { id: 187, title: "...to deregister in Germany", category: "emigration" },
  { id: 188, title: "...to run a business from Dubai", category: "emigration" },
  { id: 189, title: "...to commute between multiple countries", category: "emigration" },
  { id: 190, title: "...to build my company location-independent", category: "emigration" },
  { id: 191, title: "...to use a tax-free second model", category: "emigration" },
  { id: 192, title: "...to emigrate without tax office trouble", category: "emigration" },
  { id: 193, title: "...a life without bureaucracy", category: "emigration" },
  { id: 194, title: "...to run my business on islands", category: "emigration" },
  { id: 195, title: "...to emigrate with remote team", category: "emigration" },
  { id: 196, title: "...to control my accounting from anywhere", category: "emigration" },
  { id: 197, title: "...not to need German passport anymore", category: "emigration" },
  { id: 198, title: "...to have my children cared for abroad", category: "emigration" },
  { id: 199, title: "...to operate my company globally", category: "emigration" },
  { id: 200, title: "...to optimize taxes in multiple countries", category: "emigration" },

  // 11. Sales & Exit
  { id: 201, title: "...to develop my business model further", category: "sales-exit" },
  { id: 202, title: "...to reposition my company", category: "sales-exit" },
  { id: 203, title: "...to sharpen my vision", category: "sales-exit" },
  { id: 204, title: "...to redefine my market", category: "sales-exit" },
  { id: 205, title: "...to decide more clearly", category: "sales-exit" },
  { id: 206, title: "...to think strategically instead of operationally", category: "sales-exit" },
  { id: 207, title: "...to differentiate from competition", category: "sales-exit" },
  { id: 208, title: "...to make my company crisis-proof", category: "sales-exit" },
  { id: 209, title: "...to radically focus as entrepreneur", category: "sales-exit" },
  { id: 210, title: "...to strategically plan my daily routine", category: "sales-exit" },
  { id: 211, title: "...to make better decisions", category: "sales-exit" },
  { id: 212, title: "...to plan from 12 to 24 months", category: "sales-exit" },
  { id: 213, title: "...to build strategic partnerships", category: "sales-exit" },
  { id: 214, title: "...to strategically manage my brand", category: "sales-exit" },
  { id: 215, title: "...to solve complex problems faster", category: "sales-exit" },
  { id: 216, title: "...to tap into a new target group", category: "sales-exit" },
  { id: 217, title: "...to bundle my offering smarter", category: "sales-exit" },
  { id: 218, title: "...to anticipate my market", category: "sales-exit" },
  { id: 219, title: "...to recognize opportunities before others", category: "sales-exit" },
  { id: 220, title: "...to grow strategically as entrepreneur", category: "sales-exit" },

  // 12. Personal Growth
  { id: 221, title: "...to communicate better", category: "personal-growth" },
  { id: 222, title: "...to think more clearly", category: "personal-growth" },
  { id: 223, title: "...to live happier as entrepreneur", category: "personal-growth" },
  { id: 224, title: "...more energy in daily life", category: "personal-growth" },
  { id: 225, title: "...to make decisions with calm", category: "personal-growth" },
  { id: 226, title: "...no fear of growth", category: "personal-growth" },
  { id: 227, title: "...to become personally more stable", category: "personal-growth" },
  { id: 228, title: "...clarity in my role", category: "personal-growth" },
  { id: 229, title: "...to handle stress better", category: "personal-growth" },
  { id: 230, title: "...to act more consistently", category: "personal-growth" },
  { id: 231, title: "...to professionalize my communication", category: "personal-growth" },
  { id: 232, title: "...to conduct negotiations confidently", category: "personal-growth" },
  { id: 233, title: "...to detach from opinions", category: "personal-growth" },
  { id: 234, title: "...to lead more relaxed", category: "personal-growth" },
  { id: 235, title: "...to strengthen my self-worth as entrepreneur", category: "personal-growth" },
  { id: 236, title: "...fewer inner conflicts", category: "personal-growth" },
  { id: 237, title: "...to align my thinking for success", category: "personal-growth" },
  { id: 238, title: "...to become emotionally more independent", category: "personal-growth" },
  { id: 239, title: "...to carry responsibility more easily", category: "personal-growth" },
  { id: 240, title: "...to be able to switch off better", category: "personal-growth" },
];

/**
 * FilterDropdown - Elegant dropdown for FilterTabs
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
  
  // Find the active tab
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
          {activeTab?.label || 'Select category'}
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
                borderColor: '#10B981',
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
                Select category
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
 * Explore-Screen - With real tile data from ExploreTiles.md, translated to English
 *
 * Shows FilterDropdown and corresponding tiles for each category.
 * @returns {React.ReactElement} The rendered Explore component
 */
export default function ExploreScreen(): React.ReactElement {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // FilterTabs State
  const [activeFilter, setActiveFilter] = React.useState('all');

  // Handler for FilterTabs
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  // Handler for Tile-Clicks
  const handleTilePress = (id: number) => {
    const tile = EXPLORE_TILES.find(t => t.id === id);
    if (tile) {
      // Reconstruct the full "I want..." text for Olivia
      const fullText = `I want ${tile.title}`;
      console.log('Tile clicked:', fullText);
      // Navigation to Olivia with pre-filled text
      router.push({
        pathname: '/chats/olivia',
        params: { 
          prefillText: fullText
        }
      });
    }
  };

  // Handler for Olivia Chat
  const handleOliviaChat = () => {
    console.log('Navigation to Olivia Chat');
    router.navigate('/chats/olivia');
  };

  // FilterTabs-Configuration
  const FILTER_TABS: FilterTabItem[] = [
    { id: 'all', label: 'All' },
    { id: 'taxes', label: 'Taxes' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'employees', label: 'Employees' },
    { id: 'customer-acquisition', label: 'Customer Acquisition' },
    { id: 'ai', label: 'Artificial Intelligence' },
    { id: 'investments', label: 'Investments' },
    { id: 'financing', label: 'Financing' },
    { id: 'corporate-structure', label: 'Corporate Structure' },
    { id: 'legal-security', label: 'Legal & Security' },
    { id: 'emigration', label: 'Emigration' },
    { id: 'sales-exit', label: 'Sales & Exit' },
    { id: 'personal-growth', label: 'Personal Growth' }
  ];

  // Filter tiles based on selected category
  const filteredTiles = activeFilter === 'all' 
    ? EXPLORE_TILES 
    : EXPLORE_TILES.filter(tile => tile.category === activeFilter);
  
  return (
    <View style={[styles.container, { 
      backgroundColor: colors.backgroundPrimary,
      paddingTop: insets.top 
    }]}>
      {/* Compact header */}
      <View style={styles.headerSection}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Explore</Text>
      </View>
      
      {/* Filter Dropdown */}
      <View style={styles.filterSection}>
        <FilterDropdown 
          tabs={FILTER_TABS}
          activeTabId={activeFilter}
          onTabChange={handleFilterChange}
        />
      </View>
      
      {/* "I want..." Introduction Text */}
      <View style={styles.introTextSection}>
        <MaterialCommunityIcons 
          name="semantic-web" 
          size={24} 
          color={colors.textPrimary} 
          style={styles.introIcon}
        />
        <Text style={[styles.introText, { color: colors.textPrimary }]}>
          I want...
        </Text>
      </View>
      
      {/* Tiles Grid */}
      <View style={styles.tilesSection}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TileGrid 
            tiles={filteredTiles}
            onTilePress={handleTilePress}
            tilesPerRow={3}
          />
        </ScrollView>
      </View>
      
      {/* Text above button */}
      <View style={styles.preButtonTextSection}>
        <Text style={[styles.preButtonText, { color: colors.textSecondary }]}>
          Not quite what you're looking for?
        </Text>
      </View>
      
      {/* Footer Action Button */}
      <FooterActionButton
        label="Tell Olivia what you want!"
        onPress={handleOliviaChat}
        icon="semantic-web"
        iconLibrary="material-community"
        iconPosition="left"
        useGradient={true}
        gradientColors={[colors.primary, '#165A48']}
        textColor="#FFFFFF"
        style={{ borderTopWidth: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  filterSection: {
    paddingVertical: spacing.s,
  },
  tilesSection: {
    flex: 1,
    paddingTop: spacing.s,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  preButtonTextSection: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: 0,
    marginBottom: -spacing.xs,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  preButtonText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  introTextSection: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
  },
  introText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  introIcon: {
    marginRight: spacing.s,
  },
}); 