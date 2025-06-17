# 🎨 FallstudieDetail Modal - Design Spezifikation für Flutter

Diese Dokumentation beschreibt das exakte Design des FallstudieDetail Modals aus der React Native App für die 1:1 Umsetzung in Flutter.

## **1. Modal Container & Backdrop**
- **Backdrop**: `rgba(45, 45, 45, 0.85)` - Dunkler Overlay
- **Modal Größe**: 92% Bildschirmbreite × 85% Bildschirmhöhe
- **Border Radius**: 24px
- **Hintergrundfarbe**: `#FFFFFF`
- **Overflow**: hidden
- **Äußere Akzentlinie**: 1px, `rgba(255, 255, 255, 0.3)` - Dünne weiße Außenlinie
- **Innere Border**: 1px, `rgba(0, 160, 65, 0.2)` - Dezenter grüner Rand
- **Shadow**: 
  - Color: `#00A041`
  - Offset: 0,0
  - Opacity: 0.15
  - Radius: 8px
  - Elevation: 5

## **2. Subtiler Hintergrundverlauf**
- **Position**: absolute, gesamte Modal-Fläche
- **Gradient**: Linear von oben-links nach unten-rechts
- **Farben**: `['rgba(0, 160, 65, 0.05)', 'rgba(0, 143, 57, 0.07)', 'rgba(0, 107, 47, 0.1)']`

## **3. Header-Bereich**
- **Hintergrundfarbe**: `#1E6B55` (Grün)
- **Padding**: 20px top, 24px horizontal, 16px bottom
- **Layout**: Row mit space-between
- **Titel-Container**: flex: 1, paddingRight: 16px
- **Titel-Label**: 14px, `rgba(255, 255, 255, 0.7)`, marginBottom: 4px
- **Haupttitel**: 20px, bold (600), `#FFFFFF`, lineHeight: 26px

## **4. Close-Button (Header rechts)**
- **Größe**: 36×36px
- **Border Radius**: 18px (perfekt rund)
- **Hintergrund**: `rgba(255, 255, 255, 0.15)`
- **Icon**: "close", 22px, `#FFFFFF`
- **Position**: marginTop: 4px

## **5. Dezente Akzentlinie**
- **Breite**: 3px
- **Farbe**: `#1E6B55`
- **Border Radius**: 2px
- **Position**: Links neben der Kurzbeschreibung
- **Margin Right**: 12px

## **6. Content-Bereich**
- **Scroll Container**: flex: 1
- **Kurzbeschreibung Container**:
  - Padding: 24px (top 24px)
  - FlexDirection: row
  - Border Bottom: 1px, `rgba(0, 0, 0, 0.05)`
- **Hauptinhalt Container**:
  - Padding: 24px
  - ScrollContent paddingBottom: 24px

## **7. Footer mit Blur-Effekt** ⭐ WICHTIG
- **Position**: absolute, bottom: 0, left: 0, right: 0
- **Blur-Container**: overflow: hidden
- **Footer Hintergrund**: `rgba(255, 255, 255, 0.8)` ← **Halbtransparent!**
- **Padding**: 16px, paddingBottom: 24px
- **Layout**: Row, space-between, center aligned

## **8. Wichtige Maße & Abstände**
- **Modal Border Radius**: 24px
- **Header Padding**: 20px/24px/16px
- **Content Padding**: 24px
- **Footer Padding**: 16px/24px
- **Accent Line**: 3px Breite
- **Close Button**: 36×36px
- **Section Spacing**: 28px marginBottom

## **9. Farbpalette**
```css
Primary Green: #1E6B55
Success Green: #00A041 (für Schatten)
Text Primary: #333333
Text Secondary: #888888
White Overlay: rgba(255, 255, 255, 0.8) ← Footer Transparenz
White Accent: rgba(255, 255, 255, 0.3) ← Äußere Akzentlinie
Border Subtle: rgba(0, 0, 0, 0.05)
Border Accent: rgba(0, 160, 65, 0.2) ← Innere grüne Border
Backdrop: rgba(45, 45, 45, 0.85)
```

## **Besonderheiten für Flutter-Implementierung**

### **🔥 Kritische Design-Details:**
1. **Footer Transparenz**: Der Footer ist halbtransparent mit Blur-Effekt
2. **Akzentlinie**: Sehr dezent (nur 3px breit)
3. **Hintergrundverlauf**: Subtiler grüner Gradient über gesamte Modal-Fläche
4. **Doppelte Border**: Dünne weiße Außenlinie + grüne Innenlinie
5. **Grüner Schatten**: Subtiler grüner Glüheffekt um das Modal

### **Flutter-spezifische Umsetzungshinweise:**
- Verwende `BackdropFilter` für den Blur-Effekt im Footer
- `Container` mit `decoration: BoxDecoration` für Gradienten
- `ClipRRect` für die 24px Border Radius des Modals
- `Positioned` für absolute Positionierung des Footers
- `Flexible` und `Expanded` für das responsive Layout
- `BoxShadow` für den grünen Glüheffekt
- **Doppelte Border**: Verwende verschachtelte Container für weiße Außenlinie + grüne Innenlinie

### **Animations-Eigenschaften:**
- Modal-Einblendung: Fade-In Animation
- Kein Slide-In Effekt
- Smooth Backdrop-Übergang

---

*Diese Spezifikation basiert auf der React Native Implementierung in `/features/chats/components/FallstudieDetail.tsx`*
