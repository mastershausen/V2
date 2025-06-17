# Olivia Chat Style Guide

Dieses Dokument beschreibt detailliert alle Styling-Aspekte des Olivia-Chat-Screens in der Solvbox-App (Stand: Aktueller Code).

## Architektur & Container

### Sidebar-Integration
- **Container:** `SidebarContainer` umhüllt den gesamten Chat-Screen
- **Sidebar-Verhalten:** Kann über `sidebarVisible` State ein-/ausgeblendet werden
- **Schließen:** `onCloseSidebar={() => setSidebarVisible(false)}`

### Haupt-Container
- **Struktur:** `View` mit `flex: 1` als Basis-Container
- **StatusBar:** `barStyle="light-content"` für helle Icons auf dunklem Hintergrund

## Farbschema & Theme-System

### Light/Dark Mode Support
- **Theme-Detection:** `useColorScheme()` Hook für automatische Erkennung
- **Dynamische Farben:** `useThemeColor()` Hook für theme-abhängige Farben
- **Gradient-Anpassung:** Unterschiedliche Hintergrund-Gradienten je nach Theme

### Hintergrund-Gradient (Aktualisiert)
- **Dark Mode:**
  - Farben: `[petrolColor, colors.backgroundPrimary]`
  - Locations: `[0, 1.0]`
- **Light Mode:**
  - Farben: `[petrolColor, '#FFFFFF']`
  - Locations: `[0, 1.0]`
- **Petrol-Farbe:** Konstante Basis-Farbe für beide Modi
- **Implementierung:** 
  - Absolute Positionierung: `position: 'absolute', left: 0, right: 0, top: 0, height: '45%'`
  - Nur obere 45% des Bildschirms werden vom Gradient abgedeckt
- **Gradient-Richtung:** Von oben nach unten (`start: { x: 0, y: 0 }, end: { x: 0, y: 1 }`)

### Chat-Bubbles (Aktualisiert)
- **Benutzer-Bubbles:**
  - Hintergrundfarbe: `rgba(30, 107, 85, 0.1)` (semi-transparentes Petrol)
  - Form: Abgerundete Ecken (14px), unten rechts kantig (4px)
  - Ausrichtung: `alignSelf: 'flex-end'`
  - Maximale Breite: 80%
- **Olivia-Bubbles:**
  - Hintergrundfarbe: `rgba(30, 107, 85, 0.1)` (semi-transparentes Petrol)
  - Form: Abgerundete Ecken (14px), unten links kantig (4px)
  - Ausrichtung: `alignSelf: 'flex-start'`
  - Maximale Breite: 95%

### Primäre Farben
- **Petrol-Hauptfarbe:** `#1E6B55` (für Buttons, Akzente)
- **Türkis-Akzent:** `#7AEEFF` (nur für Solvbox-Header-Divider)
- **Text-Farben:**
  - Header-Titel: `#FFFFFF`
  - Header-Untertitel: `rgba(255, 255, 255, 0.8)`
  - Nachrichten-Text: Theme-abhängig über `useThemeColor()`

### Eingabefeld (Aktualisiert)
- **Container:** Transparenter Hintergrund
- **Input-Field:**
  - Hintergrund: `rgba(255, 255, 255, 0.9)` (fast weißer Hintergrund)
  - Rand: `rgba(30, 107, 85, 0.3)` (semi-transparentes Petrol)
  - Randbreite: 0.5px
  - Text-Farbe: `#1E293B` (dunkles Blaugrau)
  - Placeholder: `rgba(30, 41, 59, 0.6)`
- **Trennlinie oben:** `borderTopColor: 'rgba(30, 107, 85, 0.1)'`

### Buttons
- **Primäre Buttons:** `#1E6B55` (Petrol) Hintergrund
- **Button-Größe:** 36px × 36px, Radius 18px
- **Icon-Farbe:** `#FFFFFF`

## Header-Design (Aktualisiert)

### Header-Struktur
- **Höhe:** 60px
- **Layout:** Flexbox mit `flexDirection: 'row'`, `alignItems: 'center'`
- **Padding:** `paddingHorizontal: spacing.m` (16px)

### Header-Elemente
- **Zurück-Button:** 
  - Icon: `Ionicons "chevron-back"`, Größe 24px, Farbe `#FFFFFF`
  - Padding: `spacing.xs` (4px)
- **Avatar & Titel-Bereich:**
  - Container: `flex: 1` für zentrierte Positionierung
  - Avatar: `MaterialCommunityIcons "semantic-web"`, Größe 36px, Farbe `#FFFFFF`
  - Titel: "Olivia", `fontSize: typography.fontSize.l`, `fontWeight: '600'`
  - Untertitel: "powered by Solvbox", `fontSize: typography.fontSize.xs`
- **Action-Buttons:**
  - Upload-Button: `Ionicons "add-circle-outline"`, Größe 24px
  - Such-Button: `Ionicons "search-outline"`, Größe 24px
  - Beide mit `marginLeft: spacing.s` (8px)

### Avatar-System (Wichtige Änderung)
- **Kein Bild-Avatar mehr:** Verwendet `MaterialCommunityIcons "semantic-web"` statt Bild
- **Größe:** 36px × 36px
- **Farbe:** `#FFFFFF`
- **Container:** `marginRight: spacing.s` (8px)

## Solvbox-Header (Olivia-Einführungsbereich)

### Container-Struktur
- **Haupt-Container:** `solvboxHeaderContainer`
- **Gradient-Hintergrund:** Absolut positioniert mit erweiterter Breite
- **Content-Container:** `solvboxContentContainer` mit `zIndex: 1`

### Gradient-Hintergrund
- **Farben:** `['rgba(52, 199, 89, 0.25)', 'rgba(52, 199, 89, 0.15)', 'rgba(52, 199, 89, 0.05)', 'rgba(52, 199, 89, 0)']`
- **Locations:** `[0, 0.3, 0.6, 0.9]`
- **Positionierung:** 
  - `left: -spacing.m * 2` (erweitert nach links)
  - `right: -spacing.m * 2` (erweitert nach rechts)
  - `width: '150%'` (150% Bildschirmbreite)

### Content-Elemente
- **Logo:** 80px × 80px, `marginBottom: spacing.m`
- **Text-Container:** 
  - `alignItems: 'center'`
  - `paddingHorizontal: spacing.xl` (32px)
  - `maxWidth: '92%'`
- **Titel:** `fontSize: typography.fontSize.xl`, `fontWeight: typography.fontWeight.bold`
- **Untertitel:** `fontSize: typography.fontSize.s`, `lineHeight: 20`
- **Signatur:** `fontSize: typography.fontSize.s`, `fontWeight: typography.fontWeight.medium`, `fontStyle: 'italic'`
- **Divider:** 
  - Breite: 40px, Höhe: 3px
  - Farbe: `#7AEEFF` (einzige Verwendung dieser Türkis-Farbe)
  - Radius: 1.5px

### Abstände
- **Padding oben:** `spacing.xl * 0.8` (25.6px)
- **Padding unten:** `spacing.xl * 2` (64px)
- **Margin unten (ohne Chat):** `spacing.xl * 2` (64px)
- **Margin unten (mit Chat):** `spacing.m` (16px)

## Chat-Nachrichten

### Nachrichten-Container
- **Layout:** `FlatList` mit custom `ListHeaderComponent`
- **Content-Style:** `flexGrow: 1`, `paddingBottom: spacing.m`
- **Keyboard-Handling:** `keyboardShouldPersistTaps="handled"`

### Nachrichten-Styling
- **Container:** `marginBottom: spacing.s` (8px)
- **Bubble-Padding:** 10px
- **Text:** 
  - Größe: 16px
  - Zeilenhöhe: 22px
  - Gewicht: '400'
- **Zeitstempel:**
  - Größe: `typography.fontSize.xs`
  - Gewicht: '300'
  - Ausrichtung: `alignSelf: 'flex-end'`
  - Margin oben: `spacing.xs` (4px)

### Schatten-Effekte
- **Schatten-Farbe:** `#000`
- **Schatten-Offset:** `{ width: 0, height: 1 }`
- **Schatten-Opazität:** 0.1
- **Schatten-Radius:** 2
- **Elevation (Android):** 2

## Tipp-Indikator (Typing Animation)

### Container
- **Layout:** `flexDirection: 'row'`, `alignItems: 'flex-end'`
- **Margin:** `marginBottom: spacing.s`, `paddingHorizontal: spacing.m`

### Bubble-Design
- **Größe:** 60px breit, 40px hoch
- **Hintergrund:** `rgba(30, 107, 85, 0.1)`
- **Form:** `borderRadius: 14`, `borderBottomLeftRadius: 4`
- **Schatten:** Gleiche Werte wie Chat-Bubbles

### Punkte-Animation
- **Punkt-Größe:** 8px × 8px, Radius 4px
- **Farbe:** `#1E6B55`
- **Animation:** 
  - Loop-Sequenz: Opazität 0 → 1 (600ms) → 0 (600ms)
  - `useNativeDriver: true`

## Eingabebereich (Aktualisiert)

### KeyboardAvoidingView
- **Verhalten (iOS):** 'padding'
- **Keyboard-Offset (iOS):** -35px
- **Verhalten (Android):** `undefined`
- **Style:** `width: '100%'`, `marginTop: 'auto'`

### Input-Container
- **Layout:** `flexDirection: 'row'`, `alignItems: 'center'`
- **Hintergrund:** `transparent`
- **Padding:** 
  - Vertikal: 8px
  - Horizontal: 12px
  - Unten: Dynamisch basierend auf Keyboard-Status und Safe Area

### Input-Field
- **Container:** 
  - `flex: 1`
  - `borderRadius: 18`
  - `marginHorizontal: 8`
  - `height: 36`
- **Styling:**
  - Hintergrund: `rgba(255, 255, 255, 0.9)`
  - Rand: `borderWidth: 0.5`, `borderColor: 'rgba(30, 107, 85, 0.3)'`
- **Text-Input:**
  - Farbe: `#1E293B`
  - Größe: 15px
  - Padding: `paddingHorizontal: 12`, `paddingVertical: 0`

### Action-Buttons
- **Attach-Button:** `Ionicons "add-outline"`, Größe 22px
- **Send-Button:** `Ionicons "send"`, Größe 16px
- **Voice-Button:** `Ionicons "mic"`, Größe 16px
- **Button-Styling:** 36px × 36px, Radius 18px, Hintergrund `#1E6B55`

## Modal-System & Bottom Sheets

### Attachment-Menu Modal
- **Overlay:** `flex: 1`, `backgroundColor: 'transparent'`, `justifyContent: 'flex-end'`
- **Scrim:** 
  - Absolute Positionierung über gesamten Bildschirm
  - Farbe: `rgba(0, 0, 0, 0.20)`
  - Animiert mit `overlayOpacity` Animated.Value
- **Container:**
  - `borderTopLeftRadius: 20`, `borderTopRightRadius: 20`
  - Padding: `spacing.m` (16px)
  - Animiert mit `bottomSheetTranslateY` Animated.Value

### Animation-System
- **Overlay-Animation:**
  - Fade-In: 250ms
  - Fade-Out: 200ms
  - Unabhängig von Bottom Sheet Animation
- **Bottom Sheet Animation:**
  - Spring-Animation mit `useNativeDriver: true`
  - Initial-Position: `translateY: 300`
  - End-Position: `translateY: 0`

### Attachment-Optionen
- **Option-Container:**
  - `flexDirection: 'row'`, `alignItems: 'center'`
  - Padding: `spacing.m`
  - Rand: `borderWidth: 1`, `borderColor: 'rgba(30, 107, 85, 0.3)'`
  - Radius: `ui.borderRadius.m`
- **Icon-Container:** 40px × 40px, Radius 20px
- **Text:** `fontSize: typography.fontSize.m`, `fontWeight: typography.fontWeight.semiBold`

## User Preferences Modal

### Modal-Struktur
- **Overlay:** `backgroundColor: 'rgba(0, 0, 0, 0.7)'`
- **KeyboardAvoidingView:** Für iOS/Android Keyboard-Handling
- **Hintergrund-Gradient:** Gleicher Gradient wie Haupt-Screen

### Popup-Container
- **Hintergrund:** `transparent`
- **Border-Radius:** `borderTopLeftRadius: 24`, `borderTopRightRadius: 24`
- **Padding:** `paddingTop: spacing.l`, `paddingHorizontal: spacing.l`, `paddingBottom: spacing.xl`
- **Maximale Höhe:** 85%

### Header-Bereich
- **Layout:** `flexDirection: 'row'`, `justifyContent: 'space-between'`
- **Titel:** "Personal Preferences", `fontSize: typography.fontSize.l`, `fontWeight: '600'`
- **Close-Button:** 
  - `Ionicons "close"`, Größe 24px
  - Hintergrund: `rgba(255, 255, 255, 0.1)`
  - Radius: 20px

### Input-Bereich
- **TextInput:**
  - `borderWidth: 1`, `borderColor: 'rgba(30, 107, 85, 0.3)'`
  - `borderRadius: 16`
  - `padding: spacing.l` (24px)
  - `minHeight: 160`
  - Hintergrund: `rgba(255, 255, 255, 0.95)`
  - Schatten: `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.1`

### Save-Button
- **Container:** `width: '100%'`
- **Button:** `GradientButton` Komponente
- **Label:** "Save Preferences"
- **Icon:** `"checkmark-circle-outline"`, Größe 20px

## Recording-System

### Recording-Container
- **Layout:** `flexDirection: 'row'`, `alignItems: 'center'`
- **Hintergrund:** `rgba(229, 57, 53, 0.1)` (rötlicher Hintergrund)
- **Radius:** `ui.borderRadius.l`
- **Padding:** `spacing.s` (8px)
- **Margin:** `marginVertical: spacing.xs` (4px)

### Recording-Indikator
- **Punkt:** 12px × 12px, Radius 6px
- **Farbe:** `#E53935` (Rot)
- **Animation:** 
  - Loop: Opazität 1 → 0.3 (500ms) → 1 (500ms)
  - `useNativeDriver: true`

### Recording-Text
- **Farbe:** `#E53935`
- **Größe:** `typography.fontSize.s`
- **Layout:** `flex: 1`

### Stop-Button
- **Icon:** `Ionicons "square"`, Größe 18px
- **Padding:** `spacing.xs` (4px)

## Rating-System

### Rating-Container
- **Layout:** `flexDirection: 'row'`, `alignItems: 'center'`
- **Margin oben:** `spacing.m` (16px)
- **Padding oben:** `spacing.s` (8px)
- **Border oben:** `borderTopWidth: 1`, `borderTopColor: 'rgba(30, 107, 85, 0.1)'`
- **Hintergrund:** `rgba(30, 107, 85, 0.02)`
- **Radius:** 8px
- **Padding:** `spacing.s` (8px)

### Rating-Elemente
- **Label:** 
  - Größe: `typography.fontSize.s`
  - Gewicht: '600'
  - Margin rechts: `spacing.s`
- **Buttons:** 
  - Layout: `flexDirection: 'row'`
  - Padding: `spacing.xs` pro Button
  - Aktiv-State: `backgroundColor: 'rgba(255, 255, 255, 0.2)'`

## Attachment-System

### Attachment-Preview
- **Container:** `marginBottom: spacing.xs` (4px)
- **Item-Layout:** `flexDirection: 'row'`, `alignItems: 'center'`, `position: 'relative'`

### Bild-Attachments
- **Größe:** 60px × 60px
- **Radius:** `ui.borderRadius.s`
- **Remove-Button:** 
  - Absolute Position: `top: -5`, `right: -5`
  - Hintergrund: `rgba(0,0,0,0.7)`
  - Radius: 15px

### Link-Attachments
- **Container:** `flexDirection: 'row'`, `alignItems: 'center'`
- **Padding:** `spacing.xs` (4px)
- **Radius:** `ui.borderRadius.s`
- **Text:** 
  - `marginLeft: spacing.xs`
  - Größe: `typography.fontSize.s`
  - Dekoration: `textDecorationLine: 'underline'`
  - Maximale Breite: 90%

## Abstände

### Basis-Abstände
- Übernommen aus dem Spacing-System der App:
  - `xxs`: 2px
  - `xs`: 4px
  - `s`: 8px
  - `m`: 16px
  - `l`: 24px
  - `xl`: 32px
  - `xxl`: 48px
  - `xxxl`: 64px

### Chat-Bubbles
- **Zwischen einzelnen Nachrichten:** 8px (`spacing.s`)
- **Zwischen gruppierten Nachrichten:** 2px
- **Innerer Abstand der Bubbles:** 10px
- **Unterer Abstand der Bubble selbst:** 2px

### Header
- **Höhe:** 60px
- **Horizontaler Abstand:** 16px (`spacing.m`)
- **Abstand zwischen Zurück-Button und Titel:** 8px (`spacing.s`)
- **Abstand zwischen Avatar und Text:** 8px (`spacing.s`)

### Eingabefeld
- **Vertikaler Abstand:** 8px
- **Horizontaler Abstand:** 12px
- **Höhe des Eingabefelds:** 36px
- **Rand-Radius:** 18px
- **Horizontaler Abstand im Eingabefeld:** 12px
- **Abstand zu Anhängen:** Attachment-Previews haben `marginVertical: spacing.xs` (4px)

### Buttons im Eingabebereich
- **Größe:** 36px × 36px
- **Radius:** 18px

### Attachment-Vorschau
- **Bildgröße:** 60px × 60px
- **Radius des Bildes:** Entspricht `ui.borderRadius.s`

## Typografie

- **Header-Titel:** Größe `typography.fontSize.l`, Gewicht '600'
- **Header-Untertitel:** Größe `typography.fontSize.xs`
- **Nachrichtentext:** Größe 16px, Zeilenhöhe 22px, Gewicht '400'
- **Zeitstempel:** Größe `typography.fontSize.xs`, Gewicht '300'
- **Olivia-Header-Untertitel:** Größe `typography.fontSize.s`, Zeilenhöhe 20px
- **Olivia-Header-Signatur:** Größe `typography.fontSize.s`, Gewicht `typography.fontWeight.medium`, kursiv
- **Eingabefeld-Text:** Größe 15px

## Responsives Verhalten

### Safe Area Integration
- **SafeAreaView:** Umhüllt den Header-Bereich
- **Insets:** `useSafeAreaInsets()` für dynamische Anpassung
- **Bottom-Padding:** Dynamisch basierend auf Keyboard-Status und Safe Area

### Keyboard-Handling
- **iOS:** `behavior: 'padding'`, `keyboardVerticalOffset: -35`
- **Android:** `behavior: undefined`
- **State-Tracking:** `keyboardVisible` State für UI-Anpassungen

### Flexbox-Layout
- **Container:** `flex: 1` für Vollbild-Layout
- **Chat-List:** `flex: 1` für verfügbaren Platz
- **Input-Area:** `marginTop: 'auto'` für Bottom-Positionierung

## Performance-Optimierungen

### Memoization
- **useCallback:** Für alle Event-Handler und Render-Funktionen
- **useRef:** Für FlatList-Referenz und Animated.Values
- **Animated.Values:** 
  - `typingDots`: Für Typing-Animation
  - `recordingAnimation`: Für Recording-Indikator
  - `overlayOpacity`: Für Modal-Overlay
  - `bottomSheetTranslateY`: Für Bottom Sheet Animation

### Animation-Performance
- **useNativeDriver:** `true` für alle Animationen
- **Separate Animationen:** Overlay und Bottom Sheet unabhängig animiert

## Internationalisierung

### Text-Quellen
- **i18n-Integration:** `useTranslation()` Hook
- **Fallstudien-Daten:** Vollständig aus i18n-Dateien geladen
- **Service-Provider-Informationen:** Dynamisch aus Translation-Keys

### Layout-Unterstützung
- **RTL-Support:** Flexbox-Layout unterstützt automatisch RTL
- **Text-Ausrichtung:** Dynamisch basierend auf Sprach-Richtung

## Technische Implementation-Details

### State-Management
- **Chat-State:** Lokaler State mit Mock-Daten
- **UI-States:** Separate States für verschiedene UI-Elemente
- **Animation-States:** Ref-basierte Animated.Values

### Component-Struktur
- **Haupt-Component:** `OliviaChatScreen`
- **Sub-Components:** 
  - `SidebarContainer` (Wrapper)
  - `FallstudieDetail` (Modal)
  - `GradientButton` (Button-Component)
  - `CasestudyListCard` (Card-Component)

### Event-Handling
- **Message-Sending:** `handleSendMessage`
- **Voice-Input:** `handleVoiceInput`
- **Attachment-Handling:** Separate Handler für Bilder und Links
- **Navigation:** Router-basierte Navigation

## Plattformspezifische Anpassungen

### StatusBar
- **Stil:** "light-content"
- **Integration mit Hintergrund:** Nahtloser Übergang zwischen StatusBar und App-Header

### SafeAreaView
- Verwendet für den gesamten Container, um sicherzustellen, dass der Inhalt innerhalb der sicheren Bereiche des Bildschirms angezeigt wird
- **Visueller Fluss:** Beibehaltung des Farbgradienten auch in SafeArea-Bereichen für ein konsistentes Erscheinungsbild

## Layout-System

### Flexbox-Verwendung
- **Container:** `flex: 1`
- **Header:** Zeilenausrichtung mit `flexDirection: 'row'`, `alignItems: 'center'`
- **Nachrichten-Container:** Zeilenausrichtung mit `flexDirection: 'row'`
- **Eingabebereich:** Zeilenausrichtung mit `flexDirection: 'row'`, `alignItems: 'center'`

### Absolute Positionierung
- **Gradient-Hintergrund:** Positioniert als absolutes Element über den oberen 45% des Bildschirms
- **Olivia-Header-Gradient:** Absolut positioniert mit erweiterter Breite und Überlauf
- **Entfernen-Button für Anhänge:** Absolut positioniert in der oberen rechten Ecke

## Visuelle Einheit & Komposition

### Nahtlose Übergänge
- **Header zu Content:** Subtile Trennlinie mit minimalem visuellen Gewicht
- **Content zu Eingabefeld:** Kein visueller Bruch, fließender Übergang durch transparenten Hintergrund
- **Farbverlauf-Kontinuität:** Der Hauptgradient fließt durch die oberen UI-Bereiche ohne Unterbrechung

### Tiefenwirkung durch Transparenz
- **Vordergrund-Elemente:** Chat-Bubbles und interaktive Elemente mit höherer Opazität
- **Hintergrund-Elemente:** Eingabefeld und UI-Container mit kontrollierter Transparenz
- **Schichten-Effekt:** Vermittelt ein Gefühl von Tiefe ohne explizite 3D-Effekte

### Farbliche Harmonie
- **Zentrale Farbpalette:** Petrol-Grün (`#1E6B55`) als Basis
- **Akzentfarben:** Türkis (`#7AEEFF`) nur für Solvbox-Header-Divider
- **Konsistente Textfarben:** Weiße und semi-transparente Farben für optimale Lesbarkeit

## Zukunftssicherheit

### Design-Token-System
- Verwendung des App-weiten Spacing-Systems
- Verwendung des App-weiten Typografie-Systems
- Verwendung der App-weiten Farben über `useThemeColor()`
- Verwendung der App-weiten UI-Konstanten wie Borderradius

## Zugänglichkeit

### Interaktive Elemente
- Alle Buttons haben ausreichend große Tappable-Bereiche (mindestens 36x36pt)
- Verwendung von `activeOpacity` für besseres visuelles Feedback

---

**Wichtiger Hinweis für Flutter-Entwickler:**
Diese Dokumentation basiert auf dem aktuellen React Native Code. Alle Farben, Abstände, Animationen und Layout-Eigenschaften sollten 1:1 in Flutter übertragen werden. Besondere Aufmerksamkeit sollte auf das Modal-System, die Animationen und das Theme-System gelegt werden.

**Letzte Aktualisierung:** Basierend auf aktuellem Code-Stand 