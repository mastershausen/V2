# Button Styles Specification for Flutter Implementation

This document provides a detailed specification for implementing the Solvbox button styles in Flutter. The goal is to achieve a 1:1 match with the React Native implementation.

## Global Button Properties

### Common Properties for All Buttons
- **Touch Feedback**: Use `opacity: 0.8` for pressed state
- **Border Radius**: 12px (equivalent to Flutter's `borderRadius: BorderRadius.circular(12)`)
- **Elevation/Shadow**:
  ```dart
  boxShadow: [
    BoxShadow(
      color: Color(0x33000000), // 20% opacity black
      offset: Offset(0, 2),
      blurRadius: 4,
      spreadRadius: 0,
    ),
  ],
  ```
- **Default Height**: 50px (for standard buttons)
- **Padding**: Horizontal: 32px, Vertical: 16px
- **Text Style**: 
  - Font Size: 16px
  - Font Weight: SemiBold (600)
  - Color: White (#FFFFFF)
- **Icon Position**: Left of text with 8px spacing
- **Icon Size**: 18px (default), 20px (large)

## Button Variants

### 1. Primary Button (Petrol)
- **Gradient**:
  ```dart
  gradient: LinearGradient(
    colors: [Color(0xFF1E6B55), Color(0xFF15503F)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  ),
  ```
- **Usage**: Main actions, primary navigation, confirmation actions
- **Text Color**: #FFFFFF
- **Example**:
  ```dart
  GradientButton(
    label: "Primary Action",
    variant: ButtonVariant.primary,
    onPressed: () {},
  )
  ```
- **Visual Reference**:
  ```
  ┌─────────────────────────────┐
  │                             │
  │     Primary Action          │
  │                             │
  └─────────────────────────────┘
  ```

### 2. Success Button (Green)
- **Gradient**:
  ```dart
  gradient: LinearGradient(
    colors: [Color(0xFF00A041), Color(0xFF008F39)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  ),
  ```
- **Usage**: Confirmations, verification actions, positive actions
- **Text Color**: #FFFFFF
- **Common Icon**: "checkmark-circle-outline"
- **Example**:
  ```dart
  GradientButton(
    label: "Verify Account",
    variant: ButtonVariant.success,
    icon: Icons.check_circle_outline,
    onPressed: () {},
  )
  ```
- **Visual Reference**:
  ```
  ┌─────────────────────────────┐
  │                             │
  │  ✓  Verify Account          │
  │                             │
  └─────────────────────────────┘
  ```

### 3. Attention Button (Gold/Orange)
- **Gradient**:
  ```dart
  gradient: LinearGradient(
    colors: [Color(0xFFFFD700), Color(0xFFFFA500)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  ),
  ```
- **Usage**: Call-to-action, highlighting important actions, verification requests
- **Text Color**: #FFFFFF
- **Example**:
  ```dart
  GradientButton(
    label: "Verify Now",
    variant: ButtonVariant.attention,
    icon: Icons.check_circle_outline,
    onPressed: () {},
  )
  ```
- **Visual Reference**:
  ```
  ┌─────────────────────────────┐
  │                             │
  │  ✓  Verify Now              │
  │                             │
  └─────────────────────────────┘
  ```

### 4. Danger Button (Red)
- **Gradient**:
  ```dart
  gradient: LinearGradient(
    colors: [Color(0xFFFF5252), Color(0xFFC62828)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  ),
  ```
- **Usage**: Delete actions, critical warnings, irreversible changes
- **Text Color**: #FFFFFF
- **Common Icon**: "trash-outline"
- **Example**:
  ```dart
  GradientButton(
    label: "Delete Account",
    variant: ButtonVariant.danger,
    icon: Icons.delete_outline,
    onPressed: () {},
  )
  ```
- **Visual Reference**:
  ```
  ┌─────────────────────────────┐
  │                             │
  │  🗑  Delete Account          │
  │                             │
  └─────────────────────────────┘
  ```

## Button States

### 1. Normal State
- **Opacity**: 1.0
- **Full gradient colors** as defined above

### 2. Pressed State
- **Opacity**: 0.8
- **Same gradient colors** as normal state

### 3. Disabled State
- **Opacity**: 0.5
- **Same gradient colors** as normal state

## Responsive Considerations

- **Width Behavior**: 
  - By default, buttons should adapt to their content with minimum padding
  - Use `width: double.infinity` for full-width buttons (e.g., in forms, footers)
  - Maintain consistent margin (16px) from screen edges on small devices
  
- **Height Adaptation**:
  - Standard height: 50px for primary buttons
  - Compact height: 40px for secondary actions or space-constrained UIs
  - Touch target height should never be less than 44px (iOS HIG recommendation)

- **Text Handling**:
  - Text should scale appropriately with system font size settings for accessibility
  - For buttons with limited width, truncate text with ellipsis when necessary
  - Maintain minimum 8px padding between text and button edges
  
- **Screen Size Adaptations**:
  - On phones (< 600dp width): Use full-width buttons in forms and at screen bottom
  - On tablets and larger screens: Use fixed-width buttons (240-320dp) centered in containers
  - Adapt padding: 32px horizontal on larger screens, 16px on very small screens

- **Multi-button Layouts**:
  - When displaying multiple buttons in a row:
    - Maintain 16px spacing between buttons
    - On small screens, stack buttons vertically with 12px spacing if horizontal space is limited
    - Primary action should always be rightmost (LTR) or bottommost (when stacked)

- **Device-Specific Adaptations**:
  - iOS: Use system blur effects for button background (optional)
  - Android: Respect Material Design touch feedback animations
  - Web: Add hover states with subtle brightness increase (brightness: 1.05)

## Flutter Implementation Guide

### Gradient Button Class

```dart
enum ButtonVariant {
  primary,
  success,
  attention,
  danger,
}

class GradientButton extends StatelessWidget {
  final String label;
  final ButtonVariant variant;
  final IconData? icon;
  final double iconSize;
  final VoidCallback onPressed;
  final bool isDisabled;
  final double? width;
  
  const GradientButton({
    Key? key,
    required this.label,
    this.variant = ButtonVariant.primary,
    this.icon,
    this.iconSize = 18.0,
    required this.onPressed,
    this.isDisabled = false,
    this.width,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    // Get gradient colors based on variant
    List<Color> gradientColors;
    switch (variant) {
      case ButtonVariant.primary:
        gradientColors = [Color(0xFF1E6B55), Color(0xFF15503F)];
        break;
      case ButtonVariant.success:
        gradientColors = [Color(0xFF00A041), Color(0xFF008F39)];
        break;
      case ButtonVariant.attention:
        gradientColors = [Color(0xFFFFD700), Color(0xFFFFA500)];
        break;
      case ButtonVariant.danger:
        gradientColors = [Color(0xFFFF5252), Color(0xFFC62828)];
        break;
    }
    
    // Adapt to screen size
    final isSmallScreen = MediaQuery.of(context).size.width < 360;
    final horizontalPadding = isSmallScreen ? 16.0 : 32.0;
    
    return Opacity(
      opacity: isDisabled ? 0.5 : 1.0,
      child: Container(
        width: width,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Color(0x33000000),
              offset: Offset(0, 2),
              blurRadius: 4,
              spreadRadius: 0,
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: isDisabled ? null : onPressed,
            child: Ink(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: gradientColors,
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Container(
                height: 50,
                padding: EdgeInsets.symmetric(
                  horizontal: horizontalPadding, 
                  vertical: 16
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      Icon(
                        icon,
                        size: iconSize,
                        color: Colors.white,
                      ),
                      SizedBox(width: 8),
                    ],
                    Flexible(
                      child: Text(
                        label,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

## Special Case: "I want this too!" Button

This button uses the primary variant with specific styling:

```dart
GradientButton(
  label: "I want this too!",
  variant: ButtonVariant.primary,
  onPressed: () {},
  width: double.infinity, // Full width
)
```

## Important Implementation Notes

1. **Material vs Cupertino**: This design follows Material Design principles. If your Flutter app uses Cupertino (iOS-style), you'll need to adapt accordingly while maintaining the visual appearance.

2. **Tap Feedback**: Flutter's `InkWell` provides a ripple effect on Android. For consistency across platforms, you may want to implement a custom splash effect or use a simple opacity change on tap.

3. **Text Styles**: Make sure to use the appropriate font family in your Flutter app that matches the React Native implementation.

4. **Icons**: React Native uses Ionicons. In Flutter, you should use equivalent icons from the Material Icons library or include the Ionicons package.

5. **Accessibility**: Ensure that your buttons have appropriate semantic labels for screen readers.

6. **Testing**: Test on both Android and iOS to ensure consistent appearance and behavior.

## Flutter-Specific Considerations

- Use Flutter's `ThemeData` to centralize color definitions
- For production apps, consider using a design system package to manage these styles
- Implement proper hit testing area (at least 44x44 pixels) for touch targets

## Responsive Layout Examples

### Full-Width Button (Form Submission)

```dart
Padding(
  padding: EdgeInsets.all(16.0),
  child: GradientButton(
    label: "Save Changes",
    variant: ButtonVariant.primary,
    width: double.infinity,
    onPressed: () => saveForm(),
  ),
)
```

### Button Row (Dialog Actions)

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.end,
  children: [
    GradientButton(
      label: "Cancel",
      variant: ButtonVariant.danger,
      onPressed: () => Navigator.pop(context),
    ),
    SizedBox(width: 16),
    GradientButton(
      label: "Confirm",
      variant: ButtonVariant.success,
      icon: Icons.check_circle_outline,
      onPressed: () => confirmAction(),
    ),
  ],
)
```

### Responsive Button Layout

```dart
LayoutBuilder(
  builder: (context, constraints) {
    // Stack buttons vertically on narrow screens
    final isNarrow = constraints.maxWidth < 400;
    
    return isNarrow
        ? Column(
            children: [
              GradientButton(
                label: "Cancel",
                variant: ButtonVariant.danger,
                width: double.infinity,
                onPressed: () => cancelAction(),
              ),
              SizedBox(height: 12),
              GradientButton(
                label: "Continue",
                variant: ButtonVariant.primary,
                width: double.infinity,
                onPressed: () => continueAction(),
              ),
            ],
          )
        : Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GradientButton(
                label: "Cancel",
                variant: ButtonVariant.danger,
                onPressed: () => cancelAction(),
              ),
              GradientButton(
                label: "Continue",
                variant: ButtonVariant.primary,
                onPressed: () => continueAction(),
              ),
            ],
          );
  },
)
