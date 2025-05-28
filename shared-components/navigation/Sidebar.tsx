import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85;

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
          icon: 'compass-outline',
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
          icon: 'cloud-upload-outline',
          route: '/upload',
        },
        {
          id: 'saved',
          title: 'Saved',
          icon: 'bookmark-outline',
          route: '/saved',
        },
        {
          id: 'settings',
          title: 'Settings',
          icon: 'settings-outline',
          route: '/settings',
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { borderBottomColor: colors.divider }]}
      onPress={() => item.route ? handleNavigation(item.route) : undefined}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <Ionicons 
          name={item.icon as any} 
          size={20} 
          color={colors.textSecondary} 
          style={styles.menuIcon}
        />
        <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>
          {item.title}
        </Text>
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
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
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
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
            {/* Header mit Suchleiste */}
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
              <View style={[styles.searchContainer, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name="search" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.textPrimary }]}
                  placeholder="Suche"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => handleNavigation('/upload')}>
                <Ionicons name="create-outline" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Menu Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {menuSections.map(renderSection)}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.divider }]}>
              <TouchableOpacity style={styles.userProfile}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>SS</Text>
                </View>
                <Text style={[styles.userName, { color: colors.textPrimary }]}>
                  Sascha Schneiders
                </Text>
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
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
    borderBottomWidth: 1,
    gap: spacing.s,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 8,
    gap: spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  editButton: {
    padding: spacing.s,
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
    borderBottomWidth: 0.5,
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
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
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
}); 