import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, Animated, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

// All Explore-Tiles translated to English
const EXPLORE_TILES: ExploreTile[] = [
  // 1. Taxes
  { id: 1, title: "I want more net from gross", category: "taxes" },
  { id: 2, title: "I want to halve my tax burden", category: "taxes" },
  { id: 3, title: "I want to build tax-free reserves", category: "taxes" },
  { id: 4, title: "I want to distribute profits tax-free", category: "taxes" },
  { id: 5, title: "I want to sell my company tax-free", category: "taxes" },
  { id: 6, title: "I want to establish a holding company", category: "taxes" },
  { id: 7, title: "I want to avoid trade tax", category: "taxes" },
  { id: 8, title: "I want to correctly remit VAT", category: "taxes" },
  { id: 9, title: "I want to get refunds from tax office", category: "taxes" },
  { id: 10, title: "I want to avoid disguised profit distributions", category: "taxes" },
  { id: 11, title: "I want to correctly record my withdrawals", category: "taxes" },
  { id: 12, title: "I want to cleanly deduct private expenses", category: "taxes" },
  { id: 13, title: "I want to use tax-free salary extras", category: "taxes" },
  { id: 14, title: "I want to understand my tax assessments", category: "taxes" },
  { id: 15, title: "I want to optimize my balance sheet for taxes", category: "taxes" },
  { id: 16, title: "I want to cleverly use investment deduction", category: "taxes" },
  { id: 17, title: "I want to fully exploit depreciation", category: "taxes" },
  { id: 18, title: "I want to donate with tax benefits", category: "taxes" },
  { id: 19, title: "I want to reduce taxes through real estate", category: "taxes" },
  { id: 20, title: "I want to optimize my taxes internationally", category: "taxes" },

  // 2. Real Estate
  { id: 21, title: "I want to sell real estate tax-free", category: "real-estate" },
  { id: 22, title: "I want to buy real estate through GmbH", category: "real-estate" },
  { id: 23, title: "I want to hold real estate in business assets", category: "real-estate" },
  { id: 24, title: "I want to find off-market real estate", category: "real-estate" },
  { id: 25, title: "I want to rent real estate profitably", category: "real-estate" },
  { id: 26, title: "I want to legally terminate a tenant", category: "real-estate" },
  { id: 27, title: "I want to transfer real estate to my children", category: "real-estate" },
  { id: 28, title: "I want to optimally depreciate real estate", category: "real-estate" },
  { id: 29, title: "I want to digitalize my real estate portfolio", category: "real-estate" },
  { id: 30, title: "I want to combine real estate with holding", category: "real-estate" },
  { id: 31, title: "I want to finance real estate cheaply", category: "real-estate" },
  { id: 32, title: "I want to simplify ownership structures", category: "real-estate" },
  { id: 33, title: "I want to establish real estate companies", category: "real-estate" },
  { id: 34, title: "I want to trade real estate internationally", category: "real-estate" },
  { id: 35, title: "I want to profitably use foreclosures", category: "real-estate" },
  { id: 36, title: "I want to scale my real estate business", category: "real-estate" },
  { id: 37, title: "I want to develop real estate commercially", category: "real-estate" },
  { id: 38, title: "I want to gift real estate tax-free", category: "real-estate" },
  { id: 39, title: "I want to secure my real estate wealth", category: "real-estate" },
  { id: 40, title: "I want to become liquid from real estate", category: "real-estate" },

  // 3. Employees
  { id: 41, title: "I want to hire better employees", category: "employees" },
  { id: 42, title: "I want to retain employees long-term", category: "employees" },
  { id: 43, title: "I want to reduce my turnover rate", category: "employees" },
  { id: 44, title: "I want to optimize salaries for taxes", category: "employees" },
  { id: 45, title: "I want to build a strong team", category: "employees" },
  { id: 46, title: "I want to establish a leadership culture", category: "employees" },
  { id: 47, title: "I want to avoid labor law traps", category: "employees" },
  { id: 48, title: "I want to efficiently onboard employees", category: "employees" },
  { id: 49, title: "I want to fairly regulate performance bonuses", category: "employees" },
  { id: 50, title: "I want to reduce illness-related absences", category: "employees" },
  { id: 51, title: "I want to set up self-organized teams", category: "employees" },
  { id: 52, title: "I want to systematically retain A-players", category: "employees" },
  { id: 53, title: "I want to find good employees faster", category: "employees" },
  { id: 54, title: "I want to manage turnover cost-neutral", category: "employees" },
  { id: 55, title: "I want to relieve my team without layoffs", category: "employees" },
  { id: 56, title: "I want to control labor costs strategically", category: "employees" },
  { id: 57, title: "I want to reward employees tax-free", category: "employees" },
  { id: 58, title: "I want to properly manage remote teams", category: "employees" },
  { id: 59, title: "I want to conduct professional personnel talks", category: "employees" },
  { id: 60, title: "I want growth without overload", category: "employees" },

  // 4. Customer Acquisition
  { id: 61, title: "I want regular new customers", category: "customer-acquisition" },
  { id: 62, title: "I want predictable leads per month", category: "customer-acquisition" },
  { id: 63, title: "I want to sell independent of referrals", category: "customer-acquisition" },
  { id: 64, title: "I want a funnel that sells", category: "customer-acquisition" },
  { id: 65, title: "I want to digitalize my sales", category: "customer-acquisition" },
  { id: 66, title: "I want sales that close deals", category: "customer-acquisition" },
  { id: 67, title: "I want to automate customer retention", category: "customer-acquisition" },
  { id: 68, title: "I want to replace cold calling", category: "customer-acquisition" },
  { id: 69, title: "I want to reactivate existing customers", category: "customer-acquisition" },
  { id: 70, title: "I want to strategically use references", category: "customer-acquisition" },
  { id: 71, title: "I want to confidently handle price negotiations", category: "customer-acquisition" },
  { id: 72, title: "I never want to give discounts again", category: "customer-acquisition" },
  { id: 73, title: "I want to turn new customers into regulars", category: "customer-acquisition" },
  { id: 74, title: "I want to perfect objection handling", category: "customer-acquisition" },
  { id: 75, title: "I want to fill online appointments", category: "customer-acquisition" },
  { id: 76, title: "I want to turn leads into real customers", category: "customer-acquisition" },
  { id: 77, title: "I want less effort per deal", category: "customer-acquisition" },
  { id: 78, title: "I want to use cross-selling strategically", category: "customer-acquisition" },
  { id: 79, title: "I want no more dead leads", category: "customer-acquisition" },
  { id: 80, title: "I want better margins with same revenue", category: "customer-acquisition" },

  // 5. Artificial Intelligence
  { id: 81, title: "I want to automate tasks with AI", category: "ai" },
  { id: 82, title: "I want to really save time with GPT", category: "ai" },
  { id: 83, title: "I want to use AI in customer service", category: "ai" },
  { id: 84, title: "I want to automatically write proposals", category: "ai" },
  { id: 85, title: "I want to create content with AI", category: "ai" },
  { id: 86, title: "I want to eliminate repetitive tasks", category: "ai" },
  { id: 87, title: "I want to make my sales process AI-supported", category: "ai" },
  { id: 88, title: "I want my own GPT agent system", category: "ai" },
  { id: 89, title: "I want to summarize meetings with AI", category: "ai" },
  { id: 90, title: "I want to automatically generate marketing texts", category: "ai" },
  { id: 91, title: "I want to integrate AI into my tools", category: "ai" },
  { id: 92, title: "I want to efficiently use chatbots", category: "ai" },
  { id: 93, title: "I want no more manual follow-ups", category: "ai" },
  { id: 94, title: "I want to automate invoicing", category: "ai" },
  { id: 95, title: "I want to use AI for PR & social media", category: "ai" },
  { id: 96, title: "I want to automatically pre-sort applicants", category: "ai" },
  { id: 97, title: "I want AI support 24/7", category: "ai" },
  { id: 98, title: "I want to map content planning with AI", category: "ai" },
  { id: 99, title: "I want to automatically maintain product data", category: "ai" },
  { id: 100, title: "I want to strategically combine AI tools", category: "ai" },

  // 6. Investments
  { id: 101, title: "I want to invest in startups", category: "investments" },
  { id: 102, title: "I want to use real estate as investment", category: "investments" },
  { id: 103, title: "I want to invest my money tax-optimized", category: "investments" },
  { id: 104, title: "I want to build equity stakes", category: "investments" },
  { id: 105, title: "I want to understand alternative investments", category: "investments" },
  { id: 106, title: "I want safe investments with high returns", category: "investments" },
  { id: 107, title: "I want to invest without daily operations", category: "investments" },
  { id: 108, title: "I want to minimize investment risks", category: "investments" },
  { id: 109, title: "I want passive income with substance", category: "investments" },
  { id: 110, title: "I want to structure equity stakes tax-correctly", category: "investments" },
  { id: 111, title: "I want to diversify my portfolio", category: "investments" },
  { id: 112, title: "I want to allocate capital strategically", category: "investments" },
  { id: 113, title: "I want to invest in companies that fit me", category: "investments" },
  { id: 114, title: "I want investment with influence", category: "investments" },
  { id: 115, title: "I want to intelligently build tangible assets", category: "investments" },
  { id: 116, title: "I want to legally secure my investments", category: "investments" },
  { id: 117, title: "I want to become a business angel", category: "investments" },
  { id: 118, title: "I want to make my wealth independent", category: "investments" },
  { id: 119, title: "I want to invest without bank connection", category: "investments" },
  { id: 120, title: "I want to professionally check investment projects", category: "investments" },

  // 7. Financing
  { id: 121, title: "I want to improve my liquidity short-term", category: "financing" },
  { id: 122, title: "I want to receive funding I'm entitled to", category: "financing" },
  { id: 123, title: "I want to sustainably reduce my costs", category: "financing" },
  { id: 124, title: "I want to outsource my accounting", category: "financing" },
  { id: 125, title: "I want to become bankable for a loan", category: "financing" },
  { id: 126, title: "I want to optimize my income", category: "financing" },
  { id: 127, title: "I want to radically cut my fixed costs", category: "financing" },
  { id: 128, title: "I want to strategically raise my pricing", category: "financing" },
  { id: 129, title: "I want invoices paid faster", category: "financing" },
  { id: 130, title: "I want to automate my reminders", category: "financing" },
  { id: 131, title: "I want to make my balance sheet understandable", category: "financing" },
  { id: 132, title: "I want to simplify my cash flow management", category: "financing" },
  { id: 133, title: "I want to control my liquidity with tools", category: "financing" },
  { id: 134, title: "I want to cleverly manage liabilities", category: "financing" },
  { id: 135, title: "I want no more number crunching", category: "financing" },
  { id: 136, title: "I want to actively use discount strategies", category: "financing" },
  { id: 137, title: "I want less bureaucracy in accounting", category: "financing" },
  { id: 138, title: "I want to prepare my company for investors", category: "financing" },
  { id: 139, title: "I want to strategically build financing", category: "financing" },
  { id: 140, title: "I want to be able to control my tax advisor", category: "financing" },

  // 8. Corporate Structure
  { id: 141, title: "I want to establish a holding company", category: "corporate-structure" },
  { id: 142, title: "I want to sell my company", category: "corporate-structure" },
  { id: 143, title: "I want to run my company without me", category: "corporate-structure" },
  { id: 144, title: "I want to arrange my succession", category: "corporate-structure" },
  { id: 145, title: "I want to cleanly transfer shares", category: "corporate-structure" },
  { id: 146, title: "I want to cleverly use silent partnerships", category: "corporate-structure" },
  { id: 147, title: "I want to create clear conditions with partners", category: "corporate-structure" },
  { id: 148, title: "I want to build an exit strategy", category: "corporate-structure" },
  { id: 149, title: "I want to partially sell my company", category: "corporate-structure" },
  { id: 150, title: "I want to streamline my corporate structure", category: "corporate-structure" },
  { id: 151, title: "I want to establish subsidiaries", category: "corporate-structure" },
  { id: 152, title: "I want to fairly include co-founders", category: "corporate-structure" },
  { id: 153, title: "I want to internationalize my structure", category: "corporate-structure" },
  { id: 154, title: "I want to realize hidden reserves tax-free", category: "corporate-structure" },
  { id: 155, title: "I want to make my company attractive for investors", category: "corporate-structure" },
  { id: 156, title: "I want restructuring without chaos", category: "corporate-structure" },
  { id: 157, title: "I want the best legal form for my model", category: "corporate-structure" },
  { id: 158, title: "I want to systematize my company", category: "corporate-structure" },
  { id: 159, title: "I want structure without overhead", category: "corporate-structure" },
  { id: 160, title: "I want to contractually secure my company shares", category: "corporate-structure" },

  // 9. Legal & Security
  { id: 161, title: "I want to set up legally secure contracts", category: "legal-security" },
  { id: 162, title: "I want to terminate employees legally", category: "legal-security" },
  { id: 163, title: "I don't want to be liable if something goes wrong", category: "legal-security" },
  { id: 164, title: "I want to protect my data from attacks", category: "legal-security" },
  { id: 165, title: "I want IT security with little effort", category: "legal-security" },
  { id: 166, title: "I want to no longer risk warnings", category: "legal-security" },
  { id: 167, title: "I want to make my online presence legally secure", category: "legal-security" },
  { id: 168, title: "I want to act GDPR-compliant", category: "legal-security" },
  { id: 169, title: "I want to close contract gaps", category: "legal-security" },
  { id: 170, title: "I want to protect my company from lawsuits", category: "legal-security" },
  { id: 171, title: "I want to go into expansion legally prepared", category: "legal-security" },
  { id: 172, title: "I want to be secured in disputes with customers", category: "legal-security" },
  { id: 173, title: "I want to make my terms watertight", category: "legal-security" },
  { id: 174, title: "I want to legally secure my management", category: "legal-security" },
  { id: 175, title: "I want to operate safely as GmbH", category: "legal-security" },
  { id: 176, title: "I want to enforce my trademark rights", category: "legal-security" },
  { id: 177, title: "I never want data protection trouble again", category: "legal-security" },
  { id: 178, title: "I want no problems with invoicing", category: "legal-security" },
  { id: 179, title: "I want fair but safe employment contracts", category: "legal-security" },
  { id: 180, title: "I want to have my company legally reviewed", category: "legal-security" },

  // 10. Emigration
  { id: 181, title: "I want to relocate my company abroad", category: "emigration" },
  { id: 182, title: "I want to emigrate as an entrepreneur", category: "emigration" },
  { id: 183, title: "I want to live tax-free abroad", category: "emigration" },
  { id: 184, title: "I want to emigrate with family", category: "emigration" },
  { id: 185, title: "I want to live without residence", category: "emigration" },
  { id: 186, title: "I want to work freely worldwide", category: "emigration" },
  { id: 187, title: "I want to deregister in Germany", category: "emigration" },
  { id: 188, title: "I want to run a business from Dubai", category: "emigration" },
  { id: 189, title: "I want to commute between multiple countries", category: "emigration" },
  { id: 190, title: "I want to build my company location-independent", category: "emigration" },
  { id: 191, title: "I want to use a tax-free second model", category: "emigration" },
  { id: 192, title: "I want to emigrate without tax office trouble", category: "emigration" },
  { id: 193, title: "I want a life without bureaucracy", category: "emigration" },
  { id: 194, title: "I want to run my business on islands", category: "emigration" },
  { id: 195, title: "I want to emigrate with remote team", category: "emigration" },
  { id: 196, title: "I want to control my accounting from anywhere", category: "emigration" },
  { id: 197, title: "I don't want to need German passport anymore", category: "emigration" },
  { id: 198, title: "I want to have my children cared for abroad", category: "emigration" },
  { id: 199, title: "I want to operate my company globally", category: "emigration" },
  { id: 200, title: "I want to optimize taxes in multiple countries", category: "emigration" },

  // 11. Sales & Exit
  { id: 201, title: "I want to develop my business model further", category: "sales-exit" },
  { id: 202, title: "I want to reposition my company", category: "sales-exit" },
  { id: 203, title: "I want to sharpen my vision", category: "sales-exit" },
  { id: 204, title: "I want to redefine my market", category: "sales-exit" },
  { id: 205, title: "I want to decide more clearly", category: "sales-exit" },
  { id: 206, title: "I want to think strategically instead of operationally", category: "sales-exit" },
  { id: 207, title: "I want to differentiate from competition", category: "sales-exit" },
  { id: 208, title: "I want to make my company crisis-proof", category: "sales-exit" },
  { id: 209, title: "I want to radically focus as entrepreneur", category: "sales-exit" },
  { id: 210, title: "I want to strategically plan my daily routine", category: "sales-exit" },
  { id: 211, title: "I want to make better decisions", category: "sales-exit" },
  { id: 212, title: "I want to plan from 12 to 24 months", category: "sales-exit" },
  { id: 213, title: "I want to build strategic partnerships", category: "sales-exit" },
  { id: 214, title: "I want to strategically manage my brand", category: "sales-exit" },
  { id: 215, title: "I want to solve complex problems faster", category: "sales-exit" },
  { id: 216, title: "I want to tap into a new target group", category: "sales-exit" },
  { id: 217, title: "I want to bundle my offering smarter", category: "sales-exit" },
  { id: 218, title: "I want to anticipate my market", category: "sales-exit" },
  { id: 219, title: "I want to recognize opportunities before others", category: "sales-exit" },
  { id: 220, title: "I want to grow strategically as entrepreneur", category: "sales-exit" },

  // 12. Personal Growth
  { id: 221, title: "I want to communicate better", category: "personal-growth" },
  { id: 222, title: "I want to think more clearly", category: "personal-growth" },
  { id: 223, title: "I want to live happier as entrepreneur", category: "personal-growth" },
  { id: 224, title: "I want more energy in daily life", category: "personal-growth" },
  { id: 225, title: "I want to make decisions with calm", category: "personal-growth" },
  { id: 226, title: "I want no fear of growth", category: "personal-growth" },
  { id: 227, title: "I want to become personally more stable", category: "personal-growth" },
  { id: 228, title: "I want clarity in my role", category: "personal-growth" },
  { id: 229, title: "I want to handle stress better", category: "personal-growth" },
  { id: 230, title: "I want to act more consistently", category: "personal-growth" },
  { id: 231, title: "I want to professionalize my communication", category: "personal-growth" },
  { id: 232, title: "I want to conduct negotiations confidently", category: "personal-growth" },
  { id: 233, title: "I want to detach from opinions", category: "personal-growth" },
  { id: 234, title: "I want to lead more relaxed", category: "personal-growth" },
  { id: 235, title: "I want to strengthen my self-worth as entrepreneur", category: "personal-growth" },
  { id: 236, title: "I want fewer inner conflicts", category: "personal-growth" },
  { id: 237, title: "I want to align my thinking for success", category: "personal-growth" },
  { id: 238, title: "I want to become emotionally more independent", category: "personal-growth" },
  { id: 239, title: "I want to carry responsibility more easily", category: "personal-growth" },
  { id: 240, title: "I want to be able to switch off better", category: "personal-growth" },
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
      console.log('Tile clicked:', tile.title);
      // Navigation to Olivia with pre-filled text
      router.push({
        pathname: '/chats/olivia',
        params: { 
          prefillText: tile.title
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
      {/* Simple header text - no complex component */}
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
        backgroundColor={colors.primary}
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
    paddingVertical: spacing.m,
  },
  filterSection: {
    paddingVertical: spacing.m,
  },
  tilesSection: {
    flex: 1,
    paddingTop: spacing.s,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.m,
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
}); 