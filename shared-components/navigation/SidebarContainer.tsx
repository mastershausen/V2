import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Sidebar from './Sidebar';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface SidebarContainerProps {
  children: React.ReactNode;
  sidebarVisible: boolean;
  onCloseSidebar: () => void;
}

export default function SidebarContainer({ 
  children, 
  sidebarVisible, 
  onCloseSidebar 
}: SidebarContainerProps) {
  const contentTranslateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (sidebarVisible) {
      Animated.timing(contentTranslateX, {
        toValue: SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(contentTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [sidebarVisible, contentTranslateX]);

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible}
        onClose={onCloseSidebar}
      />
      
      {/* Content Container */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateX: contentTranslateX }],
          },
        ]}
      >
        {children}
        
        {/* Overlay zum Schließen der Sidebar */}
        {sidebarVisible && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={onCloseSidebar}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
}); 