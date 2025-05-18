# Identifizierte hardcodierte Werte im SolvboxAI-Feature

## Issue 1: Hardcodierte Dimensionen und Abstände in SolvboxAITabbarContainer

**Problem:**

- Die Tabbar verwendet hartkodierte Werte für Höhen, Breiten und Abstände, die in das sizes.ts-System migriert werden sollten.

**Betroffene Dateien:**

- `features/solvboxai/components/container/SolvboxAITabbarContainer.tsx`

**Zu ändernde Werte:**

```jsx
tabContainer: {
  height: 48, // Sollte sizes.component.tabBar verwenden
  paddingHorizontal: spacing.m,
},
tabItem: {
  paddingHorizontal: spacing.m,
  minWidth: 80, // Sollte standardisiert werden
},
indicatorContainer: {
  height: 3, // Sollte standardisiert werden
},
indicatorStrip: {
  height: 3, // Sollte standardisiert werden
  backgroundColor: colors.primary,
  borderRadius: 1.5, // Sollte borderRadius.xs verwenden
}
```

**Empfohlene Lösung:**

- Ersetze die hardcodierten Werte durch Referenzen aus dem `sizes` Objekt
- Definiere neue Größen in `sizes.ts` falls nötig
- Verwende `borderRadius` aus dem Theme statt hardcodierter Werte

## Issue 2: Hartkodierte Farbmanipulation in GigsTab und CaseStudiesTab

**Problem:**

- Opacity-Werte werden direkt als String-Suffix angehängt, was inkonsistent und schwer zu warten ist

**Betroffene Dateien:**

- `features/solvboxai/screens/GigsTab.tsx`
- `features/solvboxai/screens/CaseStudiesTab.tsx`

**Zu ändernde Werte:**

```jsx
errorBox: {
  backgroundColor: colors.error + '15', // 15% Opazität für den Hintergrund
  borderRadius: ui.borderRadius.s,
  padding: spacing.m,
},
```

**Empfohlene Lösung:**

- Erstelle eine Hilfsfunktion in `styleUtils.ts` für Farbtransparenz: `withOpacity(color, opacity)`
- Definiere Standard-Opacity-Werte im Theme-System
- Verwende diese Hilfsfunktion in allen Komponenten

## Issue 3: Fehlende Verwendung des Theme-Hooks in SolvboxAI-Komponenten

**Problem:**

- Komponenten verwenden statische Farben aus `themeColors.light` statt des dynamischen `useThemeColor`-Hooks

**Betroffene Dateien:**

- `features/solvboxai/components/container/SolvboxAITabbarContainer.tsx`
- `features/solvboxai/screens/GigsTab.tsx`
- `features/solvboxai/screens/CaseStudiesTab.tsx`

**Zu ändernde Werte:**

```jsx
// Aktuell:
const colors = themeColors.light;

// Sollte sein:
const colors = useThemeColor();
```

**Empfohlene Lösung:**

- Ersetze statische Theme-Importe durch den `useThemeColor`-Hook
- Stelle sicher, dass alle Farbwerte aus dem Theme kommen und Dark Mode unterstützen

## Issue 4: Hardcodierte typografische Werte in SolvboxAITabbarContainer

**Problem:**

- String-Literale werden für Schriftgewichte verwendet statt der standardisierten Werte

**Betroffene Dateien:**

- `features/solvboxai/components/container/SolvboxAITabbarContainer.tsx`

**Zu ändernde Werte:**

```jsx
tabLabel: {
  fontSize: typography.fontSize.m,
  fontWeight: '500', // Sollte typography.fontWeight.medium verwenden
  textAlign: 'center',
},
```

**Empfohlene Lösung:**

- Verwende `typography.fontWeight.medium` statt String-Literale
- Stelle sicher, dass alle typografischen Werte aus dem Theme-System kommen

## Issue 5: Direkte Console-Aufrufe in Hooks und Komponenten

**Problem:**

- Direkte Verwendung von `console.log` und `console.error` statt des zentralen Logger-Systems

**Betroffene Dateien:**

- `features/solvboxai/hooks/useSolvboxAI.ts`
- `features/solvboxai/screens/GigsTab.tsx`
- `features/solvboxai/screens/CaseStudiesTab.tsx`

**Zu ändernde Werte:**

```jsx
// In useSolvboxAI.ts
console.log('useSolvboxAI: activeTab =', activeTab, 'activeTabId =', activeTabId);
console.log('SolvboxAI Suche:', query);
.then(() => console.log(`Kachel ${id} wurde als verwendet markiert`))
.catch(err => console.error(`Fehler beim Markieren der Kachel ${id}:`, err));

// In GigsTab.tsx und CaseStudiesTab.tsx
console.error('Unerwarteter Fehler in GigsTab:', catchError);
```

**Empfohlene Lösung:**

- Importiere und verwende das `logger`-Modul aus `@/utils/logger`
- Entferne Debug-Logging oder kommentiere es aus
- Füge Präfixe für bessere Nachverfolgbarkeit hinzu

## Issue 6: Fehlende Typsicherheit bei Style-Objekten

**Problem:**

- Style-Props werden ohne klare Typisierung übergeben

**Betroffene Dateien:**

- `features/solvboxai/components/container/SolvboxAITabbarContainer.tsx`

**Zu ändernde Werte:**

```jsx
// Aktuell:
style,
tabItemStyle,
tabLabelStyle,

// Sollte klare Typ-Definitionen haben
```

**Empfohlene Lösung:**

- Verwende die neuen `styleUtils`-Funktionen für Typsicherheit
- Definiere explizite Prop-Interfaces mit korrekten Style-Typen
- Verbessere JSDoc-Dokumentation

## Issue 7: Layout-Definition mit festen Breiten

**Problem:**

- Verwendung von `width: '100%'` statt flexibler Layout-Definitionen

**Betroffene Dateien:**

- `features/solvboxai/screens/GigsTab.tsx`
- `features/solvboxai/screens/CaseStudiesTab.tsx`

**Zu ändernde Werte:**

```jsx
errorContainer: {
  padding: spacing.m,
  width: '100%', // Besser flex: 1 verwenden
},
```

**Empfohlene Lösung:**

- Verwende `flex: 1` für Container-Komponenten
- Stelle sicher, dass das Layout responsive ist
- Vermeide absolute Breiten wenn möglich

## Issue 8: Hintergrund mit fester Opazität im Error-Container

**Problem:**

- Fester Opazitätswert wird direkt für Fehleranzeige Hintergrund verwendet

**Betroffene Dateien:**

- `features/solvboxai/screens/GigsTab.tsx`
- `features/solvboxai/screens/CaseStudiesTab.tsx`

**Zu ändernde Werte:**

```jsx
errorBox: {
  backgroundColor: colors.error + '15', // 15% Opazität für den Hintergrund
  borderRadius: ui.borderRadius.s,
  padding: spacing.m,
},
```

**Empfohlene Lösung:**

- Definiere Opazitätswerte im Theme-System
- Erstelle eine wiederverwendbare Error-Box-Komponente
- Verwende konsistente Stile für Fehleranzeigen in der gesamten App
