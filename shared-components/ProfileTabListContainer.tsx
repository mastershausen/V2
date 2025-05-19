import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProfileTabListContainerProps {
  children: React.ReactNode;
  style?: object;
}

export function ProfileTabListContainer({ children, style }: ProfileTabListContainerProps) {
  const childrenArray = React.Children.toArray(children);
  return (
    <View style={[styles.container, style]}>
      {childrenArray.map((child, idx) => (
        <View key={idx} style={[styles.childWrapper, idx < childrenArray.length - 1 ? styles.itemSpacing : undefined]}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  childWrapper: {
    width: '100%',
  },
  itemSpacing: {
    marginBottom: 12,
  },
}); 