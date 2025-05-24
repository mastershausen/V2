# TileCard.tsx - Comprehensive Documentation

## Overview
The `TileCard` is a responsive tile component for grid layouts in the Solvbox app. It provides a unified, visually appealing tile that is primarily used in the Explore screen.

## Design Philosophy
- **Responsive Design**: Automatically adapts to different screen sizes
- **Consistency**: Uniform appearance across the entire app
- **Accessibility**: Full support for accessibility features
- **Performance**: Optimized for large lists with many tiles

## Props Interface

```typescript
interface TileCardProps {
  id: number;                           // Unique tile identification
  title: string;                        // Text to display
  onPress: (id: number) => void;        // Callback for tile tap
  tileSpacing?: number;                 // Spacing between tiles (default: spacing.m)
  tilesPerRow?: number;                 // Number of tiles per row (default: 3)
  horizontalPadding?: number;           // Horizontal padding (default: tileSpacing)
  style?: StyleProp<ViewStyle>;         // Additional container styles
  contentStyle?: StyleProp<ViewStyle>;  // Additional content styles
  textStyle?: StyleProp<TextStyle>;     // Additional text styles
}
```

## Responsive Behavior

### Size Calculation
The TileCard calculates its size dynamically based on:
- **Screen Width**: `Dimensions.get('window').width`
- **Tiles Per Row**: Default 3, configurable
- **Spacing**: Considers spacing between tiles
- **Horizontal Padding**: Considers lateral spacing

```typescript
const availableWidth = screenWidth - (2 * HORIZONTAL_PADDING);
const totalSpacingWidth = (tilesPerRow - 1) * TILE_SPACING;
const tileWidth = Math.floor((availableWidth - totalSpacingWidth) / tilesPerRow);
```

### Font Size Adaptation
Font size is dynamically adapted to tile size:
- **Base Calculation**: `tileWidth * 0.12`
- **Minimum**: `typography.fontSize.xs`
- **Maximum**: `typography.fontSize.l`
- **Result**: Automatic scaling for optimal readability

### Padding Adaptation
Content padding scales with tile size:
- **Base Calculation**: `tileWidth * 0.08`
- **Minimum**: `spacing.s`
- **Result**: Proportionally adjusted internal spacing

## Visual Design

### Basic Shape
- **Aspect Ratio**: 1:1 (perfect square)
- **Border Radius**: `ui.borderRadius.xl` (rounded corners)
- **Transform**: `translateY: -5` (subtle float effect)

### Shadow & Elevation
**Unified for iOS & Android:**
```typescript
shadowColor: '#000'
shadowOffset: { width: 0, height: 6 }
shadowOpacity: 0.25
shadowRadius: 8
elevation: 8  // Fallback for older Android versions
```

**Benefits of unified implementation:**
- Identical appearance on both platforms
- Easier maintenance and debugging
- Consistent user experience
- Less platform-specific code

### Colors & Contrasts
- **Background**: `colors.backgroundSecondary` (theme-dependent)
- **Border**: `rgba(0,0,0,0.12)` with 0.8px width
- **Text**: `colors.textPrimary` (theme-dependent)
- **Text Shadow**: Subtle shadow for better readability

## Accessibility Features

### Screen Reader Support
- **AccessibilityRole**: "button" 
- **AccessibilityLabel**: Uses the `title` prop
- **Accessible**: `true` for full support

### Text Handling
- **NumberOfLines**: Maximum 4 lines
- **AdjustsFontSizeToFit**: `false` (manual control)
- **TextAlign**: Centered for optimal readability

## Usage & Integration

### In TileGrid.tsx
The TileCard is mainly used through the `TileGrid` component:
- **3x3 Grid Layout**: Standard arrangement
- **Error Boundaries**: Automatic error handling
- **Empty States**: Graceful handling of empty states

### Typical Usage
```typescript
<TileCard
  id={tile.id}
  title="...more net from gross"
  onPress={handleTilePress}
  tilesPerRow={3}
  tileSpacing={spacing.m}
  horizontalPadding={spacing.m}
/>
```

## Performance Optimizations

### Memory Management
- **Memoization**: No automatic memoization (conscious decision)
- **Re-render Control**: Props changes trigger recalculation only when needed
- **Dimension Caching**: Screen width is retrieved fresh on each render

### Rendering Optimization
- **Flat Style Arrays**: Combined styles for better performance
- **Conditional Styling**: Platform-specific shadow implementation
- **Transform Optimization**: GPU-accelerated transforms through translateY

## Theme Integration

### Colors
- Full integration with `useThemeColor()`
- Automatic Dark/Light Mode support
- Consistent color usage app-wide

### Typography
- Uses central typography configuration
- Consistent font weights and sizes
- Scalable font sizes

### Spacing & UI
- Integration with central spacing configuration
- Uses UI constants for border radius
- Consistent spacing and proportions

## Technical Details

### State Management
- **Stateless Component**: No internal state variables
- **Props-driven**: All properties controllable via props
- **Callback Pattern**: onPress callback with id parameter

### Platform Differences
- **Cross-Platform Shadows**: Unified shadow implementation for both platforms
- **Consistent Appearance**: Identical visual appearance on iOS and Android
- **Simplified Maintenance**: Less platform-specific code through unified approach

### Error Handling
- **Graceful Degradation**: Fallback values for all props
- **Type Safety**: Full TypeScript integration
- **Runtime Stability**: Robust calculations with Math.floor/Math.max/Math.min

## Best Practices

### Do's
✅ Use meaningful titles (not longer than 4 lines)
✅ Ensure onPress handlers are defined
✅ Use consistent tilesPerRow values within a grid
✅ Use the component via TileGrid for optimal integration

### Don'ts
❌ Override the aspect ratio (breaks the design)
❌ Use extremely long texts (performance impact)
❌ Ignore accessibility labels
❌ Mix different tileSpacing values in one grid

## Debugging & Troubleshooting

### Common Issues
1. **Uneven tile sizes**: Check tileSpacing and horizontalPadding
2. **Text overflow**: Use shorter titles or adjustsFontSizeToFit
3. **Performance issues**: Check the number of tiles in large lists
4. **Missing shadows**: Ensure overflow: 'visible' is set

### Development Tools
- React DevTools for props inspection
- Layout Inspector for size calculations
- Performance Monitor for render times
