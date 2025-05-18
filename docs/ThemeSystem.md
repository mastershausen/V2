# Solvbox Theme System

Dieses Dokument beschreibt die optimierte Theme-System-Architektur der Solvbox App.

## Überblick

Das Theme-System wurde überarbeitet, um Redundanzen zu reduzieren, Konsistenz zu verbessern und die Wartbarkeit zu erhöhen. Die Hauptziele der Optimierung waren:

1. **Vereinheitlichung der Exportmuster**
2. **Reduzierung von Redundanzen zwischen Dateien**
3. **Konsistente Benennungskonventionen**
4. **Verbesserte Organisation der Theme-Hooks**

## Dateistruktur

```
config/theme/
├── index.ts       # Zentraler Export aller Theme-Module
├── colors.ts      # Farbdefinitionen für Light/Dark
├── spacing.ts     # Abstände und Dimensionen
├── sizes.ts       # Größen für UI-Elemente
├── typography.ts  # Schriftarten und -größen
├── ui.ts          # UI-Konstanten (Radien, etc.)
├── shadows.ts     # Schattendefinitionen
├── layout.ts      # Layout-Konstanten
├── borderRadius.ts # Border-Radien
└── styleUtils.ts  # Utility-Funktionen für Styling
```

## Schlüsselverbesserungen

### 1. Konsistente Exports

Alle Module verwenden jetzt sowohl benannte Exports als auch Default-Exports:

```typescript
export const colors = {
  /* ... */
};
export default colors;
```

### 2. Reduzierte Redundanz

- **Icons**: Die Definitionen für Icon-Größen wurden in `ui.ts` zentralisiert und werden von `sizes.ts` und `layout.ts` referenziert.
- **Schatten**: Schattendefinitionen wurden aus `ui.ts` in `shadows.ts` verschoben und werden über Referenz genutzt.

### 3. Konsistentes Naming

- Verwendung des `xs` bis `xxl` Schemas für Größen
- Komponenten-spezifische Werte folgen dem `component.property` Muster

### 4. Theme-Hooks

Die Theme-Hooks wurden in `useThemeColor.ts` zusammengefasst:

- `useThemeColor()`: Gibt alle Farben für das aktuelle Theme zurück
- `useElementColor()`: Gibt eine spezifische Farbe basierend auf Light/Dark zurück
- `useTextColor()`: Spezialisiert für Textfarben mit Fallbacks

## Verwendung

### Farben

```tsx
function MyComponent() {
  const colors = useThemeColor();

  return (
    <View style={{ backgroundColor: colors.backgroundPrimary }}>
      <Text style={{ color: colors.textPrimary }}>Hello World</Text>
    </View>
  );
}
```

### Abstände und Größen

```tsx
import { spacing, sizes } from "@/config/theme";

function MyComponent() {
  return (
    <View
      style={{
        padding: spacing.m,
        marginBottom: spacing.l,
        height: sizes.elementSize.buttonHeight,
      }}
    >
      {/* ... */}
    </View>
  );
}
```

### Style-Utilities

```tsx
import { withOpacity, createThemedStyles } from "@/config/theme";

// Farbe mit Transparenz
const backgroundColor = withOpacity(colors.primary, 0.5);

// Theme-basierte Styles
const useStyles = createThemedStyles(
  StyleSheet.create({
    container: { flex: 1 },
  }),
  (colors) => ({
    container: { backgroundColor: colors.backgroundPrimary },
  })
);

function MyComponent() {
  const colors = useThemeColor();
  const styles = useStyles(colors);

  return <View style={styles.container}>...</View>;
}
```

## Best Practices

1. **Verwende Theme-Hooks anstelle von hardcodierten Werten**
2. **Nutze die vordefinierten Größen und Abstände**
3. **Verwende die Style-Utilities für einheitliches Styling**
4. **Beachte die Namenskonventionen bei Erweiterungen**

## Migrationshinweise für Legacy-Code

Für Abwärtskompatibilität wurden einige Legacy-Eigenschaften beibehalten:

- `sizes.tabBarCompact` bleibt bestehen (wird aber intern als `sizes.tabBar.compact` neu definiert)
- Die alten Shadow-Definitionen bleiben in `shadows.ts` erhalten, werden aber um neue Strukturen ergänzt
