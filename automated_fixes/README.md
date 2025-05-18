# Automatische Fehlerbehebung für die isDemoMode-Probleme

## Hintergrund des Problems

In unserem Codebase ist die `isDemoMode`-Funktion/Eigenschaft inkonsistent implementiert:

- In manchen Hooks ist sie eine Funktion: `isDemoMode()`
- In anderen Teilen ist sie ein boolescher Wert: `isDemoMode`

Diese Inkonsistenz führt zu einem häufigen Fehler:

```
TypeError: isDemoMode is not a function (it is undefined)
```

## Die Lösung: callIfFunction-Hilfsfunktionen

Wir haben die Datei `automated_fixes/callIfFunction.ts` erstellt, die eine flexible Lösung bietet. Sie enthält Funktionen, die automatisch erkennen, ob ein Wert eine Funktion ist, und ihn entsprechend behandeln.

### Funktionen

1. **`callIfFunction<T>(value: T | (() => T)): T`**

   - Allgemeine Funktion für jeden Typ
   - Ruft den Wert als Funktion auf, wenn es eine Funktion ist, oder gibt den Wert direkt zurück

2. **`callIfBooleanFunction(value: boolean | (() => boolean)): boolean`**

   - Spezialisierte Version für boolesche Werte
   - Konvertiert das Ergebnis explizit mit `Boolean()`

3. **`allTrue(...conditions: (boolean | (() => boolean))[]): boolean`**

   - Prüft, ob alle Bedingungen true sind (wie bei `&&`)
   - Funktioniert sowohl mit Funktionen als auch mit direkten Werten

4. **`anyTrue(...conditions: (boolean | (() => boolean))[]): boolean`**
   - Prüft, ob mindestens eine Bedingung true ist (wie bei `||`)
   - Funktioniert sowohl mit Funktionen als auch mit direkten Werten

## Verwendung

### Einfacher Aufruf

```typescript
import { callIfFunction } from '@/automated_fixes/callIfFunction';

// Statt:
const isDemo = isDemoMode ? true : false;
// Verwende:
const isDemo = callIfFunction(isDemoMode) ? true : false;

// Statt:
if (isDemoMode && someOtherCondition) { ... }
// Verwende:
if (callIfFunction(isDemoMode) && someOtherCondition) { ... }
```

### Komplexe Bedingungen

```typescript
import { allTrue, anyTrue } from '@/automated_fixes/callIfFunction';

// Statt:
if (isDemoMode && isLiveMode) { ... }
// Verwende:
if (allTrue(isDemoMode, isLiveMode)) { ... }

// Statt:
if (isDemoMode || isSpecialMode || hasCustomFlag) { ... }
// Verwende:
if (anyTrue(isDemoMode, isSpecialMode, hasCustomFlag)) { ... }
```

## Integration in bestehenden Code

Die Verwendung dieser Funktionen ist optional, aber empfohlen, um Probleme mit den Funktionstypen zu vermeiden. Langfristig planen wir, die API zu vereinheitlichen, aber bis dahin bieten diese Funktionen eine robuste Lösung.

## Weitere Maßnahmen

Wir arbeiten an einer ESLint-Regel, die automatisch warnt, wenn `isDemoMode` und ähnliche Funktionen ohne Absicherung verwendet werden.
