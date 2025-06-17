# CasestudyListCard Flutter Specification

## Overview
The `CasestudyListCard` is a simple card component for case studies with a characteristic green left border. It displays summary text and an info button.

## Screenshot Reference
This specification is based on the actual usage in OliviaChatScreen. The component shows:
- ✅ Summary text (multi-line, left)
- ✅ Info button (right, circular)
- ✅ Green left border (3px)

## Critical Measurements & Values

### Container
- **Background Color**: `#FAFBFC`
- **Border Radius**: `6.0` pixels
- **Left Border**: `3.0` pixels wide, color `#1E6B55`
- **Outer Border**: `0.5` pixels (hairline), color `rgba(0, 0, 0, 0.08)`
- **Padding**: `8.0` pixels (all sides)
- **Margin Bottom**: `4.0` pixels

### Shadow
- **Android Elevation**: `3.0`
- **iOS Shadow**:
  - Color: `#1E6B55`
  - Offset: `(0, 1)`
  - Opacity: `0.02`
  - Blur Radius: `1.0`
- **Fallback Shadow**:
  - Color: `#000000`
  - Offset: `(0, 2)`
  - Opacity: `0.08`
  - Blur Radius: `4.0`

### Layout
- **Structure**: Row with `MainAxisAlignment.spaceBetween`
- **Alignment**: `CrossAxisAlignment.center`
- **2 Elements**: Summary text (left, flex) + Info button (right, fixed)

### Summary Text
- **Font Size**: `14.0` pixels
- **Font Weight**: `FontWeight.w400` (regular)
- **Line Height**: `22.0` pixels
- **Color**: Theme Text Primary
- **Flex**: `1` (takes available space)
- **Multi-line**: Automatic line wrapping
- **Text Content**: Uses `summary` parameter

### Info Button
- **Size**: `20.0 x 20.0` pixels
- **Border Radius**: `10.0` pixels (circular)
- **Border**: `1.0` pixel, color `#1E6B55`
- **Background**: `#1E6B55` with `20%` opacity
- **Text**: `"i"`
- **Text Font Size**: `10.0` pixels
- **Text Font Weight**: `FontWeight.w700` (bold)
- **Text Color**: `#1E6B55`
- **Margin Left**: `8.0` pixels
- **Touch**: Ripple effect on touch

## Parameter Interface

### Required Parameters
- **summary** (String): The text to display - REQUIRED
- **onInfoPress** (VoidCallback): Callback for info button - Optional

### Optional Style Parameters
- **containerStyle** (BoxDecoration): Additional container styles
- **textStyle** (TextStyle): Additional text styles

## Functional Requirements

### Layout Behavior
- **Simple Row**: Text takes available space, info button is fixed
- **Responsive**: Text automatically wraps for long content
- **Alignment**: Text and button are vertically centered

### Touch Handling
- **Info Button**: Executes `onInfoPress` callback
- **Ripple Effect**: Material Design ripple on info button
- **Card itself**: No touch handling

### Theme Integration
- **Primary Color**: `#1E6B55` for border and info button
- **Text Color**: Theme Text Primary Color
- **Background**: Fixed `#FAFBFC`
- **Dark Mode**: Support via theme system

### Accessibility
- **Info Button**: Semantic label "More Information"
- **Summary Text**: Body text semantics
- **Touch Target**: Minimum 44x44px for info button

## Performance Requirements
- **List Performance**: Efficient for 50+ cards
- **Lazy Loading**: Support for large lists
- **Rebuilds**: Minimal rebuilds on theme changes

## Platform-specific Adjustments
- **iOS**: Use native iOS shadow properties
- **Android**: Use Material elevation
- **Font**: System default (San Francisco/Roboto)

## Color Constants
- **Primary Green**: `#1E6B55`
- **Card Background**: `#FAFBFC`
- **Border Color**: `rgba(0, 0, 0, 0.08)`
- **Info Button Background**: `#1E6B55` with 20% opacity

## Widget Structure Description

### Main Container
A **Container** widget with the following properties:
- Decoration with BoxDecoration for background, border and shadow
- Padding of 8 pixels on all sides
- Margin bottom of 4 pixels
- Border radius of 6 pixels
- Left border: 3 pixels wide in Primary Green
- All other borders: 0.5 pixels in Border Color

### Content Layout
A **Row** widget as child of the container:
- MainAxisAlignment: spaceBetween
- CrossAxisAlignment: center
- Two children: Text widget and info button

### Text Element
An **Expanded** widget wrapping a **Text** widget:
- Text displays the summary parameter
- TextStyle with 14px size, regular weight, 22px line height
- Automatic line wrapping for long texts
- Takes available space in the row

### Spacing between Text and Button
A **SizedBox** with 8 pixels width as spacing

### Info Button Element
A **GestureDetector** wrapping a **Container**:
- Container: 20x20 pixels, circular (10px border radius)
- Decoration: Primary Green border (1px), background with 20% opacity
- Child: **Center** widget with **Text** widget ("i")
- Text: 10px, bold, Primary Green color
- GestureDetector: onTap executes onInfoPress callback

### Shadow Implementation
- **Android**: Material elevation of 3.0
- **iOS**: BoxShadow with Primary Green color, offset (0,1), opacity 0.02, blur 1.0
- **Fallback**: BoxShadow with black color, offset (0,2), opacity 0.08, blur 4.0

## Usage Examples

### Simple Usage
```
CasestudyListCard(
  summary: "Engineer hiring time slashed from 8 to 3 weeks for a major Munich developer. 94% success rate, 75% cost reduction - from €3,500 to €850 per placement.",
  onInfoPress: () => showCaseStudyDetails(),
)
```

### In a List
```
ListView.builder with CasestudyListCard as itemBuilder
Each card gets the corresponding summary text
Info button callback shows details for respective case study
```

## Important Notes for Developers
1. **Simple component** - only text and info button
2. **Summary parameter** - displays the main text of the case study
3. **Fixed sizes** - maintain all pixel values exactly
4. **Green left border** - maintain characteristic feature
5. **Info button right** - always visible, even without callback 