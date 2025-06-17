# TileCard Flutter Implementation Specification

## Objective
1:1 recreation of the React Native TileCard.tsx as Flutter Widget with **identical** appearance and behavior.

## Widget Requirements

### Required Properties
- `int id` - Unique tile identification
- `String title` - Text to display on tile
- `Function(int) onPressed` - Callback when tile is tapped
- `double? tileSpacing` - Spacing between tiles (optional, default: 16.0)
- `int? tilesPerRow` - Number of tiles per row (optional, default: 3)
- `double? horizontalPadding` - Horizontal screen padding (optional, default: 16.0)

### Optional Customization
- Custom decoration override
- Custom text styling override

## Size Calculation Specification

### Constants
- **Default tile spacing**: 16.0 pixels
- **Default tiles per row**: 3
- **Default horizontal padding**: 16.0 pixels

### Size Formula (CRITICAL - Must be exact)
```
screenWidth = MediaQuery screen width
availableWidth = screenWidth - (2 × horizontalPadding)
totalSpacingWidth = (tilesPerRow - 1) × tileSpacing
tileWidth = (availableWidth - totalSpacingWidth) ÷ tilesPerRow
finalTileWidth = floor(tileWidth)
```

**IMPORTANT**: Must use `floor()` function for final width calculation!

## Visual Specifications

### Shape & Dimensions
- **Aspect Ratio**: Perfect square (1:1)
- **Width**: Calculated using size formula
- **Height**: Identical to width

### Border & Corners
- **Border Radius**: 16.0 pixels (all corners)
- **Border Width**: 0.8 pixels
- **Border Color**: Black with 12% opacity (`rgba(0,0,0,0.12)`)

### Shadow (EXACT values required)
- **Shadow Color**: Black with 25% opacity
- **Shadow Offset**: X: 0, Y: 6
- **Shadow Blur Radius**: 8.0
- **Shadow Spread**: 0

### Float Effect
- **Transform**: Translate Y by -5 pixels (upward float)

### Background
- **Light Theme**: White or light card color
- **Dark Theme**: Dark card color (e.g., `#2C2C2E`)

## Text Specifications

### Font Size Calculation (CRITICAL)
```
baseFontSize = tileWidth × 0.12
minFontSize = 12.0
maxFontSize = 18.0
finalFontSize = clamp(baseFontSize, minFontSize, maxFontSize)
```

### Text Properties
- **Alignment**: Center
- **Maximum Lines**: 4
- **Overflow**: Ellipsis
- **Font Weight**: Medium (500)
- **Color**: Theme-dependent text color

### Text Shadow
- **Shadow Offset**: X: 0, Y: 1
- **Shadow Blur**: 2.0
- **Shadow Color**: Black with 10% opacity

### Padding Calculation
```
basePadding = tileWidth × 0.08
minPadding = 8.0
finalPadding = max(basePadding, minPadding)
```

## Interaction Specifications

### Touch Handling
- **Tap Area**: Entire tile surface
- **Callback**: Execute `onPressed(id)` with tile ID
- **Visual Feedback**: Standard platform touch feedback

### Accessibility
- **Role**: Button
- **Label**: Use tile title text
- **Screen Reader**: Fully accessible

## Grid Layout Requirements

### Layout Behavior
- **Default**: 3 tiles per row
- **Spacing**: Consistent spacing between tiles
- **Responsive**: Adapts to screen width changes
- **Wrapping**: Tiles wrap to new rows automatically

### Padding & Margins
- **Horizontal Screen Padding**: Applied to entire grid
- **Tile Spacing**: Applied between individual tiles
- **Vertical Spacing**: Same as horizontal tile spacing

## Theme Integration

### Color Adaptation
- **Background**: Must adapt to light/dark theme
- **Text**: Must adapt to theme text colors
- **Border**: Fixed opacity regardless of theme

### Theme Properties to Use
- Card background color
- Primary text color
- Theme-aware contrast

## Critical Measurements Checklist

### ✅ MUST be exact:
1. **Border Radius**: 16.0 pixels (not 15 or 17!)
2. **Shadow Y-Offset**: 6 pixels
3. **Shadow Blur**: 8.0 pixels
4. **Shadow Opacity**: 25%
5. **Float Transform**: -5 pixels Y
6. **Font Size Formula**: tileWidth × 0.12
7. **Padding Formula**: tileWidth × 0.08
8. **Border Width**: 0.8 pixels
9. **Border Opacity**: 12%
10. **Size Calculation**: Must use floor() function

## Performance Requirements

### Optimization Goals
- **Smooth Scrolling**: Must handle 100+ tiles
- **Memory Efficient**: No memory leaks in large lists
- **Fast Rendering**: Minimal rebuild overhead

### Implementation Notes
- Use stateless widget approach
- Avoid unnecessary rebuilds
- Optimize for grid layouts

## Testing Validation

### Visual Verification
- [ ] Tiles are perfectly square
- [ ] Exactly 3 tiles per row on standard phones
- [ ] Shadow visible and positioned correctly
- [ ] Float effect creates subtle elevation
- [ ] Text centered and properly sized
- [ ] Border subtle but visible

### Functional Verification
- [ ] Tap events fire with correct tile ID
- [ ] Responsive behavior on screen rotation
- [ ] Accessibility features work with screen readers
- [ ] Theme switching updates colors correctly

### Cross-Platform Verification
- [ ] Identical appearance on iOS and Android
- [ ] Consistent shadow rendering
- [ ] Same touch feedback behavior

## Common Implementation Pitfalls

### ❌ Avoid These Mistakes:
- Using different shadow values
- Forgetting the floor() function in size calculation
- Wrong aspect ratio (non-square tiles)
- Incorrect font size scaling
- Missing float transform effect
- Wrong border radius values
- Inconsistent spacing calculations

### ⚠️ Platform Considerations:
- Ensure shadows render identically on both platforms
- Use theme-aware colors, not hardcoded values
- Test on various screen sizes and orientations
