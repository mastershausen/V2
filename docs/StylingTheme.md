# Solvbox App - Style Guide & Theme System

## 📖 Overview

This Style Guide documents the design system of the Solvbox App and provides new developers with a comprehensive overview of all used design tokens, colors, fonts, and UI components.

## 🎨 Color System

### Primary Colors
```typescript
primary: '#1E6B55'    // Petrol - Main app color
```

### Status Colors
```typescript
success: '#258E3E'    // Success/Confirmation
error: '#FF3B30'      // Error/Warning
warning: '#FFCC00'    // Notice/Attention
info: '#0A7EA4'       // Information
```

### Text Colors (Light/Dark)
```typescript
// Light Theme
textPrimary: '#333333'    // Main text
textSecondary: '#666666'  // Secondary text
textTertiary: '#999999'   // Tertiary text/Placeholder

// Dark Theme
textPrimary: '#ECEDEE'    // Main text
textSecondary: '#AEAEB2'  // Secondary text
textTertiary: '#8E8E93'   // Tertiary text/Placeholder
```

### Background Colors
```typescript
// Light Theme
backgroundPrimary: '#FFFFFF'     // Main background
backgroundSecondary: '#FFFFFF'   // Secondary background
backgroundTertiary: '#FFFFFF'    // Cards/Components

// Dark Theme
backgroundPrimary: '#151718'     // Main background
backgroundSecondary: '#1C1D1F'   // Secondary background
backgroundTertiary: '#2C2C2E'    // Cards/Components
```

### Pastel Variants
```typescript
pastel: {
  primary: 'rgba(30, 107, 85, 0.15)'    // For backgrounds
  primaryBorder: 'rgba(30, 107, 85, 0.5)' // For borders
  secondary: 'rgba(52, 199, 89, 0.15)'    // For accents
}
```

## ✍️ Typography

### Font
The app uses **San Francisco** on all platforms (iOS and Android):
```typescript
fontFamily: {
  default: undefined // System-Default leads to San Francisco
}
```

### Font Sizes
```typescript
fontSize: {
  xs: 10,         // Very small labels
  s: 12,          // Small labels/hints
  m: 14,          // Standard text
  l: 16,          // Important text
  xl: 18,         // Headings
  xxl: 20,        // Large headings
  title: 24,      // Page titles
  largeTitle: 32  // Large titles
}
```

### Font Weights
```typescript
fontWeight: {
  regular: '400',   // Normal
  medium: '500',    // Medium
  semiBold: '600',  // Semi-bold
  bold: '700'       // Bold
}
```

### Predefined Text Styles
```typescript
// Usage in components:
import { typography } from '@/config/theme/typography';

// Examples:
<Text style={typography.styles.title}>Title</Text>
<Text style={typography.styles.body}>Body text</Text>
<Text style={typography.styles.caption}>Caption</Text>
```

## 📐 Spacing System

Based on a **4-unit grid**:
```typescript
spacing: {
  xxs: 2,   // Very small spacing
  xs: 4,    // Small spacing
  s: 8,     // Standard small spacing
  m: 16,    // Standard spacing
  l: 24,    // Large spacing
  xl: 32,   // Very large spacing
  xxl: 48,  // Extra large spacing
  xxxl: 64  // Maximum spacing
}
```

### Usage
```typescript
import { spacing } from '@/config/theme/spacing';

const styles = StyleSheet.create({
  container: {
    padding: spacing.m,        // 16px
    marginBottom: spacing.l,   // 24px
  }
});
```

## 🎯 UI Components

### Border Radii
```typescript
borderRadius: {
  xs: 4,        // Small elements
  s: 8,         // Standard buttons
  m: 12,        // Cards/Inputs
  l: 16,        // Large components
  xl: 20,       // Round elements
  xxl: 30,      // Very round elements
  pill: 9999    // Completely round
}
```

### Icon Sizes
```typescript
icon: {
  tiny: 12,     // Very small icons
  small: 16,    // Small icons
  medium: 20,   // Standard icons
  large: 24,    // Large icons
  xlarge: 32,   // Very large icons
  xxlarge: 40   // Extra large icons
}
```

### Avatar Sizes
```typescript
avatar: {
  xs: 24,       // Small avatars
  s: 32,        // Standard small
  m: 48,        // Standard
  l: 64,        // Large avatars
  xl: 80        // Extra large avatars
}
```

## 🔧 Theme System Usage

### Hook for Colors
```typescript
import { useThemeColor } from '@/hooks/useThemeColor';

function MyComponent() {
  const colors = useThemeColor();
  
  return (
    <View style={{ backgroundColor: colors.backgroundPrimary }}>
      <Text style={{ color: colors.textPrimary }}>Text</Text>
    </View>
  );
}
```

### Direct Theme Imports
```typescript
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';

const styles = StyleSheet.create({
  button: {
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    fontSize: typography.fontSize.l,
  }
});
```

## 🎨 Special Components

### Search Bars
```typescript
// Gray background for better visibility
backgroundColor: '#F3F4F6'
borderColor: '#E5E7EB'
borderWidth: 1
```

### Chat Bubbles
```typescript
// User messages: Primary color
backgroundColor: colors.primary
color: 'white'

// Bot messages: Light background
backgroundColor: colors.divider + '30'
color: colors.textPrimary
```

### Gradient Backgrounds
```typescript
// For special areas (e.g. Olivia chat)
colors={['rgba(30, 107, 85, 0.2)', 'rgba(30, 107, 85, 0.05)']}
```

## 📱 Responsive Design

### Safe Area
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// For header positioning
const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top }}>
```

### Platform-specific Styles
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? spacing.m : spacing.xl,
  }
});
```

## 🎯 Best Practices

### 1. Consistent Colors
- Always use `useThemeColor()` hook
- No hardcoded hex values in components
- Use theme system for light/dark mode

### 2. Spacing Consistency
- Always use the 4-unit grid
- Use predefined `spacing` values
- No arbitrary pixel values

### 3. Typography
- Prefer predefined `typography.styles`
- Use consistent font weights
- San Francisco for all platforms

### 4. UI Components
- Use standard `borderRadius` values
- Use icon sizes from the system
- Consistent avatar sizes

### 5. Code Organization
```typescript
// ✅ Good: Theme-based
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundPrimary,
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
  }
});

// ❌ Bad: Hardcoded
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  }
});
```

## 🔍 Debugging & Tools

### Theme Viewer
```typescript
// For development: Show all available colors
console.log('Available colors:', colors);
```

### Style Consistency Check
- Use ESLint rules for theme consistency
- Regular code reviews for style adherence
- Update documentation when adding new design tokens

---

**💡 Tip:** If unsure about color choices or spacing, look at existing components or ask the design team.
