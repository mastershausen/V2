# Verify Now Button Styling

## Colors and Gradient
- **Gradient Colors**: 
  - Start Color: `#FFD700` (Gold yellow)
  - End Color: `#FFA500` (Orange)
- **Gradient Direction**: Diagonal from top left to bottom right
  - `start: { x: 0, y: 0 }`
  - `end: { x: 1, y: 1 }`

## Button Shape and Shadow
- **Radius**: 12px (ui.borderRadius.m)
- **Padding**: 
  - Vertical: 16px
  - Horizontal: 32px
- **Overflow**: hidden
- **Shadow**:
  - Color: `#008F39` (adjusted for orange buttons)
  - Offset: { width: 0, height: 4 }
  - Opacity: 0.3
  - Radius: 6px
  - Elevation (Android): 6

## Icon
- **Name**: `checkmark-circle-outline` (from Ionicons)
- **Size**: 17px
- **Color**: `#FFFFFF` (White)
- **Position**: Left of text with 8px margin to the text
- **Vertical Alignment**: Slightly offset upwards (marginTop: 1)

## Text
- **Color**: `#FFFFFF` (White)
- **Font Size**: 18px
- **Font Weight**: 600 (semibold)
- **Text Content**: "Verify now"

## Layout
- **Container**: Flex-Row with centered alignment
- **Content Alignment**: 
  - Horizontal: center
  - Vertical: center
- **Height**: 20px for the content container

## Responsive Behavior
- **Width**: Uses `width: '100%'` to adapt to container size
- **Flex Properties**: When applied with `flex: 1`, expands to available space
- **Typography**: Font sizes are based on the app's typography system
  - Typography scales consistently across different device sizes
  - Maintains readability on various screen dimensions
- **Spacing**: Uses the app's spacing system (`spacing.m`, `spacing.s`) which is based on a 4-unit grid
  - This ensures consistent proportions across different devices
- **Platform Adaptations**: Uses `Platform.OS` checks for iOS/Android specific adjustments
- **Dynamic Height**: Button height is proportionate to content while maintaining minimum touch target size
