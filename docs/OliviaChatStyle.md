# Olivia Chat Style Guide

Dieses Dokument beschreibt detailliert alle Styling-Aspekte des Olivia-Chat-Screens in der Solvbox-App.

## Farbschema

### Hintergrund
- **Gradient-Hintergrund:** Linearer Farbverlauf
  - Farben: `['#1E5B4E', '#1E4B5B', '#1E3B6B', '#0A1828']`
  - Verteilung: `[0, 0.3, 0.6, 1.0]`
  - Richtung: Von oben nach unten
  - **Implementierung:** Absolute Positionierung über den gesamten Screen mit `position: 'absolute', left: 0, right: 0, top: 0, bottom: 0`
  - **Rendering-Layer:** Liegt unter allen UI-Elementen durch frühe Platzierung im Component-Tree
  - **Z-Index-Verhalten:** Implizit unter anderen Elementen durch die Reihenfolge im JSX

### Farbverlauf-Integrationen

#### Haupt-Gradient
- **Zweck:** Bildet die Grundfarbe der gesamten Benutzeroberfläche
- **Dominanter Farbton:** Petrol-Grün bis tiefes Dunkelblau
- **Transition-Effekt:** Sanfter Übergang von oben nach unten, wobei obere Bereiche wärmer/grüner sind
- **Wahrnehmung:** Erzeugt Tiefe und vermittelt ein beruhigendes, professionelles Gefühl
- **Komposition:** Die Farben sind so gewählt, dass sie mit den Chat-Bubbles harmonieren und genügend Kontrast bieten

#### Olivia-Header-Gradient
- **Farben:** `['rgba(52, 199, 89, 0.25)', 'rgba(52, 199, 89, 0.15)', 'rgba(52, 199, 89, 0.05)', 'rgba(52, 199, 89, 0)']`
- **Verwendungszweck:** Subtile Hervorhebung des Einführungstextes von Olivia
- **Übergangseffekt:** Sanftes Auslaufen nach unten, um einen weichen Übergang zum Chat zu schaffen
- **Visuelles Gewicht:** Leicht, nicht dominant, unterstützend
- **Technische Umsetzung:** 
  - Positioniert mit `position: 'absolute', left: -spacing.m * 2, right: -spacing.m * 2, top: 0, bottom: 0, width: '150%'`
  - Erweiterte Breite (150%) um sicherzustellen, dass der Gradient auch bei größeren Bildschirmen die volle Breite abdeckt

### Chat-Bubbles
- **Benutzer-Bubbles:**
  - Hintergrundfarbe: `#2C5063` (wärmeres Blau)
  - Form: Abgerundete Ecken (14px), unten rechts kantig (4px)
- **Olivia-Bubbles:**
  - Hintergrundfarbe: `#1F3949` (dunkles Blaugrau)
  - Form: Abgerundete Ecken (14px), unten links kantig (4px)
- **Farbharmonie mit Hintergrund:** Die Bubble-Farben sind so gewählt, dass sie sich vom Hintergrund abheben, aber innerhalb des gleichen Farbspektrums bleiben, was eine harmonische visuelle Einheit schafft

### Text
- **Nachrichtentext:** `#F1F5F9` (Off-White)
- **Zeitstempel:** `rgba(241, 245, 249, 0.7)` (semi-transparentes Off-White)
- **Header-Titel:** `#FFFFFF`
- **Header-Untertitel:** `rgba(255, 255, 255, 0.8)`

### Akzente
- **Tipp-Indikator Punkte:** `#63C0C8` (Türkis)
- **Header-Divider:** `#63C0C8` (Türkis)
- **Links in Nachrichten:** `#63C0C8` (Türkis)

### Eingabefeld
- **Hintergrund:** `rgba(10, 24, 40, 0.4)` (semi-transparentes Dunkelblau)
- **Rand:** `rgba(255, 255, 255, 0.3)` (semi-transparentes Weiß)
- **Placeholder:** `rgba(255, 255, 255, 0.7)` (semi-transparentes Weiß)

### Header
- **Trennlinie:** `rgba(255, 255, 255, 0.2)` (leicht transparentes Weiß)

### Anhang-Menü
- **Bild-Icon-Container:** `#4CAF50` (Grün)
- **Link-Icon-Container:** `#9C27B0` (Violett)

### Aufnahme-Indikator
- **Aufnahme-Punkt:** `#E53935` (Rot)
- **Stopp-Button:** `#E53935` (Rot)

## Textfeld-Integration & Visueller Fluss

### Nahtlose Integration des Eingabefelds
- **Semi-transparenter Hintergrund:** `rgba(10, 24, 40, 0.4)` ermöglicht es dem Hintergrund-Gradient durchzuscheinen
- **Subtiler Rand:** Border mit `rgba(255, 255, 255, 0.3)` schafft Abgrenzung ohne visuellen Bruch
- **Design-Philosophie:** Das Eingabefeld wirkt wie ein natürlicher Teil des Hintergrunds, nicht als separates Element
- **Vermeidung optischer Trennung:**
  - Kein fester Hintergrund, der den Farbverlauf unterbricht
  - Kein harter Schatten oder Trennlinie
  - Der transparente Hintergrund erlaubt dem Hauptgradienten durchzuscheinen

### Visueller Fluss von oben nach unten
- **Header → Chat-Bereich → Eingabefeld:** Alle Elemente teilen die Farbpalette und Transparenz-Effekte
- **Konsistente Farbtöne:** Der Dunkelblau-Petrol-Ton wird beibehalten
- **Farbliche Kohärenz:** Eingabefeld ist farblich auf den unteren Teil des Gradienten abgestimmt

### Technische Umsetzung
- **KeyboardAvoidingView:** Stellt sicher, dass das Eingabefeld über der Tastatur bleibt
- **Flexbox-Positionierung:** `marginTop: 'auto'` platziert das Eingabefeld am unteren Bildschirmrand
- **Transparente Hintergründe:** Alle Container-Komponenten sind transparent oder teilen die Grundfarbe
- **Border statt Divider:** Verwendung eines subtilen Randes statt einer harten Trennlinie

## Chat-Header Design & Integration

### Header-Struktur
- **Höhe:** 60px - ausreichend für Inhalt, aber nicht dominant im Bildschirm
- **Anordnung:** Dreigeteilt mit Zurück-Button, Titel/Avatar und Menü-Button
- **Transparenz-Konzept:** Transparente Hintergrundfarbe, nur subtile Trennlinie zum Content-Bereich
- **Visuelle Verbindung:** Fließender Übergang zum Hintergrund-Gradienten ohne Unterbrechung

### Header-Elemente & Integration
- **Zurück-Button:** Links positioniert, visuell leicht, nur Icon ohne Container
- **Avatar & Titel-Bereich:** 
  - Zentriert mit Flex-Wachstum (`flex: 1`)
  - Avatar und Text horizontal angeordnet
  - Vertikale Textstaffelung (Name und Status)
- **Such-Button:** Rechts positioniert, visuell leicht, nur Icon
- **Abgrenzung zum Content:** 
  - Subtile Trennlinie mit `borderBottomWidth: 0.5, borderBottomColor: 'rgba(255, 255, 255, 0.2)'`
  - Minimale visuelle Trennung ohne den Farbverlauf zu stören

### Visuelle Hierarchie
- **Primäre Information:** Avatar und Name deutlich sichtbar
- **Sekundäre Information:** Online-Status mit geringerer Opazität
- **Tertiäre Elemente:** Navigation-Icons mit klarer Funktion aber visuell zurückhaltend

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

### Olivia-Header
- **Abstand oben:** 80% von 32px (`spacing.xl * 0.8`)
- **Abstand unten:** 64px (`spacing.xl * 2`)
- **Horizontaler Abstand im Text-Container:** 32px (`spacing.xl`)

### Eingabefeld
- **Vertikaler Abstand:** 8px
- **Horizontaler Abstand:** 12px
- **Höhe des Eingabefelds:** 36px
- **Rand-Radius:** 18px
- **Horizontaler Abstand im Eingabefeld:** 12px
- **Abstand zu Anhängen:** Attachment-Previews haben `marginVertical: spacing.xs` (4px)

### Buttons im Eingabebereich
- **Größe:** 28px × 28px
- **Radius:** 14px

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

## Schatten & Tiefe

### Chat-Bubbles
- **Schatten-Farbe:** `#000`
- **Schatten-Offset:** { width: 0, height: 2 }
- **Schatten-Deckkraft:** 0.15
- **Schatten-Radius:** 3
- **Elevation (Android):** 3

### Tipp-Indikator
- **Schatten-Farbe:** `#000`
- **Schatten-Offset:** { width: 0, height: 1 }
- **Schatten-Deckkraft:** 0.15
- **Schatten-Radius:** 2
- **Elevation (Android):** 2

### GigCards
- **Schatten-Farbe:** `#000`
- **Schatten-Offset:** { width: 0, height: 3 }
- **Schatten-Deckkraft:** 0.2
- **Schatten-Radius:** 8
- **Elevation (Android):** 8
- **Randfarbe:** `rgba(0, 0, 0, 0.1)`
- **Randbreite:** 0.5px

## Animationen

### Tipp-Indikator
- **Animation:** Endlosschleife mit Sequenz:
  - Übergang von Deckkraft 0 zu 1 in 600ms
  - Übergang von Deckkraft 1 zu 0 in 600ms

### Aufnahme-Indikator
- **Animation:** Endlosschleife mit Sequenz:
  - Übergang von Deckkraft 1 zu 0.3 in 500ms
  - Übergang von Deckkraft 0.3 zu 1 in 500ms

## Bilder & Icons

### Avatare
- **Olivia-Avatar:** `@/assets/small rounded Icon.png`
- **Avatar-Größe im Header:** 36px × 36px, Radius 18px
- **Avatar-Größe in Nachrichten:** 28px × 28px, Radius 14px
- **Avatar-Größe im Olivia-Header:** 80px × 80px

### Icons
- **Icon-Bibliothek:** Ionicons
- **Zurück-Button:** 'chevron-back', Größe 24px
- **Such-Button:** 'search', Größe 24px
- **Anhang-Button:** 'add-outline', Größe 20px
- **Senden-Button:** 'send', Größe 16px
- **Spracheingabe-Button:** 'mic', Größe 16px
- **Bild-Icon:** 'image-outline', Größe 24px
- **Link-Icon:** 'link-outline', Größe 24px
- **Schließen-Icon:** 'close-circle', Größe 22px
- **Stopp-Icon:** 'square', Größe 18px

## Komponenten-Details

### GigCards
- **Höhe:** 130px (min/max)
- **Randradius:** `ui.borderRadius.m`
- **Bild-Container:** 90px breit, 100% hoch
- **Bild-Ausrichtung:** `resizeMode="cover"`
- **Titel:** 1 Zeile, abgeschnitten mit Ellipsis
- **Beschreibung:** 3 Zeilen, abgeschnitten mit Ellipsis
- **Preis-Textfarbe:** `#0075B0` (Blau)

### Olivia-Header
- **Gradient-Hintergrund:**
  - Farben: `['rgba(52, 199, 89, 0.25)', 'rgba(52, 199, 89, 0.15)', 'rgba(52, 199, 89, 0.05)', 'rgba(52, 199, 89, 0)']`
  - Verteilung: `[0, 0.3, 0.6, 0.9]`
  - Richtung: Von oben nach unten
- **Divider:** 40px breit, 3px hoch, Radius 1.5px

### Modals
- **Overlay-Hintergrund:** `rgba(0,0,0,0.5)`
- **Container-Ecken:** 20px Radius oben links/rechts
- **Animations-Typ:** "slide"

## Responsives Verhalten

### Tastatur-Handling
- **Verhalten (iOS):** 'padding'
- **Vertikaler Offset (iOS):** 80px
- **Verhalten (Android):** `undefined`
- **Eingabefeld-Anpassung:** Bleibt immer sichtbar über der Tastatur ohne den Kontext zu verlieren

### Nachrichten
- **Maximale Breite:** 80% der Bildschirmbreite
- **Selbst-Ausrichtung:** Benutzer-Nachrichten rechts, Olivia-Nachrichten links

## Spezielle Effekte

### Text-Schatten (Olivia-Header)
- **Schatten-Farbe:** `rgba(0, 0, 0, 0.75)`
- **Schatten-Offset:** { width: 0, height: 1 }
- **Schatten-Radius:** 2px

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
- **Gradient-Hintergrund:** Positioniert als absolutes Element über den gesamten Bildschirm
- **Olivia-Header-Gradient:** Absolut positioniert mit erweiterter Breite und Überlauf
- **Entfernen-Button für Anhänge:** Absolut positioniert in der oberen rechten Ecke

## Visuelle Einheit & Komposition

### Nahtlose Übergänge
- **Header zu Content:** Subtile Trennlinie mit minimalem visuellen Gewicht
- **Content zu Eingabefeld:** Kein visueller Bruch, fließender Übergang durch transparenten Hintergrund
- **Farbverlauf-Kontinuität:** Der Hauptgradient fließt durch alle UI-Bereiche ohne Unterbrechung

### Tiefenwirkung durch Transparenz
- **Vordergrund-Elemente:** Chat-Bubbles und interaktive Elemente mit höherer Opazität
- **Hintergrund-Elemente:** Eingabefeld und UI-Container mit kontrollierter Transparenz
- **Schichten-Effekt:** Vermittelt ein Gefühl von Tiefe ohne explizite 3D-Effekte

### Farbliche Harmonie
- **Zentrale Farbpalette:** Petrol-Grün bis Dunkelblau als Basis
- **Akzentfarben:** Türkis (`#63C0C8`) für interaktive Elemente und Highlights
- **Konsistente Textfarben:** Off-White für optimale Lesbarkeit auf dunklen Hintergründen

## Performance-Optimierungen

### Memoization
- Verwendung von `useCallback` für alle Render- und Handler-Funktionen
- Verwendung von `useRef` für die FlatList und Animationswerte

### Verzögerungen
- 300ms Verzögerung beim Scrollen zur neuesten Nachricht für sanfteres Scrollen

## Zukunftssicherheit

### Design-Token-System
- Verwendung des App-weiten Spacing-Systems
- Verwendung des App-weiten Typografie-Systems
- Verwendung der App-weiten Farben über `useThemeColor()`
- Verwendung der App-weiten UI-Konstanten wie Borderradius

## Zugänglichkeit

### Interaktive Elemente
- Alle Buttons haben ausreichend große Tappable-Bereiche (mindestens 44x44pt)
- Verwendung von `activeOpacity` für besseres visuelles Feedback

## Internationalisierung

### Textausrichtung
- Layout unterstützt sowohl LTR als auch RTL durch Verwendung von Flexbox

---

Dieses Dokument dient als umfassende Referenz für alle Styling-Aspekte des Olivia-Chat-Screens und sollte bei Änderungen oder Erweiterungen der Funktionalität aktualisiert werden. 