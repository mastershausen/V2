# Solvbox Styling Guide

Dieser Guide dokumentiert die Richtlinien und Best Practices für das Styling in der Solvbox App, basierend auf der Referenzimplementierung im SolvboxAI-Feature.

## Inhaltsverzeichnis

1. [Grundprinzipien](#grundprinzipien)
2. [Theme-System](#theme-system)
3. [Styling Best Practices](#styling-best-practices)
4. [API-Referenz](#api-referenz)
5. [SolvboxAI als Referenz](#solvboxai-als-referenz)
6. [Barrierefreiheit (Accessibility)](#barrierefreiheit-accessibility)
7. [Qualitätssicherung](#qualitätssicherung)

## Grundprinzipien

Unser Styling-Ansatz basiert auf folgenden Grundprinzipien:

- **Konsistenz**: Einheitliche Abstände, Farben und Typografie durch zentrale Theme-Definitionen
- **Dark Mode Support**: Alle visuellen Elemente unterstützen automatisch Dark Mode
- **Wartbarkeit**: Änderungen an Design-Tokens können zentral vorgenommen werden
- **Responsivität**: UI-Elemente passen sich an verschiedene Bildschirmgrößen an
- **Typsicherheit**: Alle Theme-Werte sind typisiert für bessere Entwicklererfahrung
- **Barrierefreiheit**: Alle Komponenten werden mit Accessibility-Attributen erstellt

## Theme-System

### Struktur

Das Theme-System ist in folgende Hauptkomponenten unterteilt:

```
config/theme/
├── colors.ts      # Farbdefinitionen für Light/Dark
├── spacing.ts     # Abstände und Dimensionen
├── sizes.ts       # Größen für UI-Elemente
├── typography.ts  # Schriftarten und -größen
├── ui.ts          # UI-Konstanten (Radien, Schatten)
└── styleUtils.ts  # Utility-Funktionen für Styling
```

### Hooks

Für den Zugriff auf Theme-Werte stehen diese Hooks zur Verfügung:

- `useThemeColor()`: Gibt alle Farben für das aktuelle Theme zurück
- `useElementColor()`: Gibt eine spezifische Farbe basierend auf Light/Dark zurück

## Styling Best Practices

### Verwende Theme-Hooks

```tsx
// ❌ Schlecht - Hardcodierte Farben
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
});

// ✅ Gut - Theme-System verwenden
function MyComponent() {
  const colors = useThemeColor();

  return <View style={{ backgroundColor: colors.backgroundPrimary }} />;
}
```

### Verwende Spacing-Konstanten

```tsx
// ❌ Schlecht - Hardcodierte Abstände
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 24,
  },
});

// ✅ Gut - Spacing-System verwenden
import { spacing } from "@/config/theme/spacing";

const styles = StyleSheet.create({
  container: {
    padding: spacing.m,
    marginBottom: spacing.l,
  },
});
```

### Nutze withOpacity für Transparenz

```tsx
// ❌ Schlecht - Direkte Manipulation von Farben
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#FF5500" + "80", // Achtung: Fehlerhaft!
  },
});

// ✅ Gut - withOpacity verwenden
import { withOpacity } from "@/config/theme/styleUtils";

function MyComponent() {
  const colors = useThemeColor();

  const styles = StyleSheet.create({
    overlay: {
      backgroundColor: withOpacity(colors.primary, 0.5),
    },
  });

  // ...
}
```

### Erstelle Theme-abhängige Styles

```tsx
// ✅ Gut - Theme-abhängige Styles mit useMemo
function MyComponent() {
  const colors = useThemeColor();

  // Styles werden bei Theme-Änderung aktualisiert
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.backgroundPrimary,
          padding: spacing.m,
        },
        text: {
          color: colors.textPrimary,
          fontSize: typography.fontSize.m,
        },
      }),
    [colors]
  );

  // ...
}
```

### Flexible Style-Props

```tsx
// ✅ Gut - Komponenten mit anpassbaren Styles
interface MyComponentProps {
  // Funktionale Props
  title: string;

  // Style-Props
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

function MyComponent({ title, style, titleStyle }: MyComponentProps) {
  // Kombiniere Styles
  const containerStyles = [styles.container, style];
  const titleStyles = [styles.title, titleStyle];

  return (
    <View style={containerStyles}>
      <Text style={titleStyles}>{title}</Text>
    </View>
  );
}
```

### Dynamische Styles

```tsx
// ✅ Gut - Berechne Styles basierend auf Props oder State
function MyButton({ disabled, active, backgroundColor }) {
  const colors = useThemeColor();

  // Berechne Styles basierend auf Zustand
  const getBgColor = () => {
    if (disabled) return colors.ui.disabledBackground;
    if (active) return colors.primary;
    return backgroundColor || colors.backgroundSecondary;
  };

  return (
    <TouchableOpacity style={{ backgroundColor: getBgColor() }}>
      {/* ... */}
    </TouchableOpacity>
  );
}
```

## API-Referenz

### Farben (colors.ts)

Der `themeColors` Export enthält Farben für Light und Dark Mode:

```tsx
// Zugriff über Hook (empfohlen)
const colors = useThemeColor();
colors.primary; // Primärfarbe
colors.error; // Fehlerfarbe

// Statischer Zugriff (nur für Konfigurationsdateien)
import { themeColors } from "@/config/theme/colors";
themeColors.light.primary;
themeColors.dark.primary;
```

### Abstände (spacing.ts)

Definiert einheitliche Abstände für die gesamte App:

```tsx
import { spacing } from "@/config/theme/spacing";

spacing.xs; // Extra small (8)
spacing.s; // Small (12)
spacing.m; // Medium (16)
spacing.l; // Large (24)
spacing.xl; // Extra large (32)
```

### Größen (sizes.ts)

Definiert Standardgrößen für UI-Elemente:

```tsx
import { sizes } from "@/config/theme/sizes";

// Allgemeine Größen
sizes.xs; // 8
sizes.m; // 16

// Spezifische Größen
sizes.tabBarCompact; // 48
sizes.elementSize.tabMinWidth; // 80
```

### Typografie (typography.ts)

Definiert Schriftarten und -größen:

```tsx
import { typography } from "@/config/theme/typography";

typography.fontSize.s; // Small
typography.fontSize.m; // Medium
typography.fontWeight.bold; // Bold
```

### Style Utilities (styleUtils.ts)

Hilfsfunktionen für Styling:

```tsx
import { withOpacity, combineStyles } from "@/config/theme/styleUtils";

// Farbe mit Transparenz
withOpacity("#FF5500", 0.5); // rgba(255, 85, 0, 0.5)

// Styles kombinieren
combineStyles(
  styles.base,
  isActive && styles.active,
  isDisabled && styles.disabled
);
```

## SolvboxAI als Referenz

Das SolvboxAI-Feature dient als Referenz-Implementierung für das Theme-System. Es zeigt:

1. **Konsistente Organisation**: Klare Trennung von Container-Komponenten und Presentational-Komponenten
2. **Theme-Hook-Nutzung**: Durchgängige Verwendung von `useThemeColor()` in allen Komponenten
3. **Dynamische Styles**: Styles werden abhängig vom aktuellen Theme generiert
4. **Error Handling**: Einheitliche Fehlerdarstellung mit Theme-Farben
5. **Responsive Layouts**: Anpassung an verschiedene Bildschirmgrößen

### Beispiel-Komponenten

- `SolvboxAITabbarContainer.tsx`: Referenz für Container-Komponenten
- `GigsTab.tsx`: Referenz für Theme-konforme Screens
- `useGigsTab.ts`: Referenz für Business-Logik mit Logger-Integration

## Barrierefreiheit (Accessibility)

Eine gute Benutzererfahrung umfasst auch Barrierefreiheit. Alle Komponenten sollten Accessibility-Attribute verwenden:

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`${title} Button`}
  accessibilityHint={`Öffnet den ${title} Bereich`}
  accessibilityState={{ disabled, selected }}
>
  {/* Inhalt */}
</TouchableOpacity>
```

### Accessibility Best Practices

- **Labels**: Jede interaktive Komponente sollte ein aussagekräftiges Label haben
- **Kontrast**: Farben müssen ausreichenden Kontrast bieten (über das Theme sichergestellt)
- **Fokusreihenfolge**: Stelle eine logische Tab-Reihenfolge sicher
- **Zustände**: Kommuniziere Komponentenzustände (aktiv, deaktiviert) über `accessibilityState`
- **Hinweise**: Nutze `accessibilityHint` um die Aktion hinter einem Element zu beschreiben

### Do's und Don'ts

✅ **Richtig**:

- Accessibility-Attribute konsistent anwenden
- Kontrastreiche Farbkombinationen aus dem Theme verwenden
- Touch-Targets mindestens 44x44 Pixel groß halten (über sizes-System)

❌ **Falsch**:

- Interaktive Elemente ohne Accessibility-Attribute
- Wichtige Informationen nur über Farbe vermitteln
- Zu kleine Touch-Targets verwenden

## Qualitätssicherung

### ESLint-Regel

Zur Sicherstellung der Theme-Einhaltung wurde die ESLint-Regel `solvbox/no-hardcoded-styles` eingeführt:

```bash
# Prüfung ausführen
npm run lint:styles

# Bericht erzeugen
npm run theme:report
```

Die Regel warnt bei:

- Hardcodierten Farbwerten (#RRGGBB, rgba)
- Hardcodierten numerischen Werten für Abstände und Größen

### Ausnahmen

Die Regel erlaubt:

- Werte 0, 1, 2 in allen Kontexten
- Numerische Werte für bestimmte Eigenschaften (opacity, flex, zIndex, etc.)

### Integration in den Workflow

1. **Während der Entwicklung**: Warnungen helfen, potentielle Probleme zu finden
2. **Code-Reviews**: Berichte zeigen die Theme-Compliance des Codes
3. **Continuous Integration**: Automatisierte Prüfung in der Pipeline

---

Bei Fragen oder Anregungen zum Styling-Guide wende dich an das Frontend-Team.
