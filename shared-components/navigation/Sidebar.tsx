import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  badge?: number;
}

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const colors = useThemeColor();
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const menuSections: MenuSection[] = [
    {
      title: '',
      items: [
        {
          id: 'explore',
          title: 'Explore',
          icon: 'search-outline',
          route: '/explore',
        },
        {
          id: 'chats',
          title: 'Chats',
          icon: 'chatbubbles-outline',
          route: '/chats',
        },
        {
          id: 'upload',
          title: 'Upload',
          icon: 'add-circle-outline',
          route: '/upload',
        },
        {
          id: 'tutorial',
          title: 'Tutorial',
          icon: 'play-circle-outline',
          route: '/settings/tutorial',
        },
        {
          id: 'saved',
          title: 'Saved',
          icon: 'bookmark-outline',
          route: '/saved',
        },
        {
          id: 'about',
          title: 'About Solvbox',
          icon: 'information-circle-outline',
          route: '/about',
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => item.route ? handleNavigation(item.route) : undefined}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <Ionicons 
          name={item.icon as any} 
          size={20} 
          style={styles.menuIcon}
        />
        <Text style={[styles.menuItemText, { color: '#1E6B55' }]}>
          {item.title}
        </Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: MenuSection) => (
    <View key={section.title} style={styles.section}>
      {section.title ? (
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {section.title}
        </Text>
      ) : null}
      {section.items.map(renderMenuItem)}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          backgroundColor: colors.backgroundPrimary,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header mit Solvbox Branding */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <MaterialCommunityIcons 
              name="semantic-web" 
              size={32} 
              style={styles.brandIcon}
            />
            <Text style={styles.brandText}>
              Solvbox
            </Text>
          </View>
        </View>

        {/* Menu Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {menuSections.map(renderSection)}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.userProfile}
            onPress={() => handleNavigation('/profile/chat-profile')}
          >
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={20} color="#fff" />
            </View>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              Max Weber
            </Text>
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => handleNavigation('/settings')}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#1E6B55" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    paddingVertical: spacing.l,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  brandIcon: {
    width: 32,
    color: '#1E6B55',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E6B55',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: spacing.s,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    marginHorizontal: spacing.s,
    marginVertical: 2,
    borderRadius: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    gap: spacing.m,
  },
  menuIcon: {
    width: 24,
    color: '#1E6B55',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: spacing.m,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E6B55',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    backgroundColor: '#1E6B55',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    padding: spacing.s,
  },
}); 