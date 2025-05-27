import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GradientButton } from '@/shared-components/button';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';

/**
 * ButtonExample - Zeigt alle Varianten des GradientButton
 */
export function ButtonExample() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Einheitliche Button-Styles</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Primary Button</Text>
        <GradientButton
          label="Primary Action"
          variant="primary"
          onPress={() => console.log('Primary button pressed')}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Success Button</Text>
        <GradientButton
          label="Verify Account"
          variant="success"
          icon="checkmark-circle-outline"
          onPress={() => console.log('Success button pressed')}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attention Button</Text>
        <GradientButton
          label="Upgrade Now"
          variant="attention"
          icon="star-outline"
          onPress={() => console.log('Attention button pressed')}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger Button</Text>
        <GradientButton
          label="Delete Account"
          variant="danger"
          icon="trash-outline"
          onPress={() => console.log('Danger button pressed')}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled Button</Text>
        <GradientButton
          label="Disabled Button"
          variant="primary"
          disabled={true}
          onPress={() => console.log('This should not be called')}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Gradient</Text>
        <GradientButton
          label="Custom Gradient"
          gradientColors={['#9C27B0', '#673AB7']}
          icon="color-palette-outline"
          onPress={() => console.log('Custom gradient button pressed')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
    marginBottom: spacing.s,
  },
});

export default ButtonExample; 