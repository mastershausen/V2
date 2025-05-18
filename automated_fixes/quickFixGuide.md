# Schnellfix-Anleitung für isDemoMode/isLiveMode Fehler

## Problem

In der Anwendung tritt regelmäßig der folgende Fehler auf:

```
TypeError: isDemoMode is not a function (it is undefined)
```

Dieser Fehler entsteht durch Inkonsistenzen bei der Verwendung von Funktionen wie `isDemoMode`. Manchmal werden diese als Funktionen aufgerufen (z.B. `isDemoMode()`) und manchmal als Eigenschaften verwendet (z.B. `isDemoMode`).

## Sofortige Fehlerbehebung

Wenn dieser Fehler auftritt, können Sie ihn folgendermaßen beheben:

### 1. Komponenten, die useMode verwenden

Wenn eine Komponente den `useMode`-Hook verwendet und einen Fehler mit `isDemoMode is not a function` anzeigt:

```typescript
// Falsch
const { isDemoMode } = useMode();
const isDemo = isDemoMode; // Fehler: isDemoMode ist eine Funktion

// Richtig
const { isDemoMode } = useMode();
const isDemo = isDemoMode(); // Funktionsaufruf mit ()
```

Stellen Sie sicher, dass alle Verwendungen von `isDemoMode` und `isLiveMode` aus dem `useMode`-Hook mit einem Funktionsaufruf `()` erfolgen.

### 2. Im useMode-Hook

Die Implementierung in `features/mode/hooks/useMode.ts` sollte konsistent sein:

```typescript
// Falsch: Diese Implementierung ist inkonsistent
return {
  // ...
  isDemoMode: isDemoMode(), // gibt einen booleschen Wert zurück
  // ...
};

// Richtig: Diese Implementierung ist konsistent
return {
  // ...
  isDemoMode: function () {
    return isDemoMode();
  }, // gibt eine Funktion zurück
  // ... ODER
  isDemoMode, // exportiert die Funktion direkt
  // ...
};
```

### 3. In TypeScript-Interfaces

Die Typdefinitionen sollten ebenfalls konsistent sein:

```typescript
// Falsch: Unklare Erwartung
interface UseModeResult {
  isDemoMode: boolean; // ist es ein Wert oder eine Funktion?
}

// Richtig: Klare Erwartung
interface UseModeResult {
  isDemoMode: () => boolean; // es ist eine Funktion!
}
```

## Woran liegt das Problem?

- **Historisch gewachsene Codebase**: Ursprünglich waren einige dieser Funktionen vielleicht Eigenschaften, wurden aber später zu Funktionen.
- **Inkonsistente Implementierungen**: In einigen Teilen des Codes werden diese Funktionen als Werte zurückgegeben, in anderen als Funktionsreferenzen.

## Langfristige Lösung

Die beste langfristige Lösung ist:

1. **Konsistente Namensgebung**:

   - `is...` für Funktionen (müssen aufgerufen werden)
   - Adjektive wie `demo` für Eigenschaften (ohne Funktionsaufruf)

2. **ESLint-Regel implementieren**:

   - Siehe `automated_fixes/isFunction_boolean_fix.ts` für ein ESLint-Plugin, das diese Fehler automatisch erkennt und behebt.

3. **TypeScript strenger konfigurieren**:
   - `"noImplicitAny": true`
   - `"strictFunctionTypes": true`

## Vorsichtsmaßnahmen

Wenn Sie diese Fehler beheben, beachten Sie:

1. Die Änderung könnte umfassend sein - suchen Sie nach allen Verwendungen der betroffenen Funktionen
2. Stellen Sie sicher, dass Tests nach Ihren Änderungen noch funktionieren
3. Dokumentieren Sie Ihr Vorgehen, um zukünftige Verwechslungen zu vermeiden

Durch konsequente Anwendung dieser Richtlinien können die `isDemoMode is not a function`-Fehler dauerhaft vermieden werden.

# Schnelle Lösung für isDemoMode-Fehler

Wenn Sie auf einen Fehler stoßen, der besagt `TypeError: isDemoMode is not a function (it is undefined)`, liegt das Problem an einer Inkonsistenz in der Implementierung des `isDemoMode`-Wertes. Nach unserer Refaktorierung ist `isDemoMode` in Hooks wie `useMode` nun eine Funktion statt eines booleschen Wertes.

## Schnelle Lösungen

### Option 1: Aufruf als Funktion (empfohlen)

Ändern Sie Ihren Code so, dass `isDemoMode` als Funktion aufgerufen wird:

```typescript
// Vorher:
if (isDemoMode) {
  // ...
}

// Nachher:
if (isDemoMode()) {
  // ...
}
```

### Option 2: Typüberprüfung für flexible Nutzung

Wenn Sie Code haben, der mit beiden Versionen kompatibel sein muss, verwenden Sie die folgende Hilfsfunktion:

```typescript
function callIfFunction(value: boolean | Function): boolean {
  return typeof value === "function" ? (value as Function)() : Boolean(value);
}

// Verwendung:
if (callIfFunction(isDemoMode)) {
  // ...
}
```

### Option 3: Bei Legacy-Code - ModeService direkt verwenden

Wenn Sie Legacy-Code haben, der auf den alten Wert angewiesen ist, können Sie direkt den ModeService aufrufen:

```typescript
import { ModeService } from "@/services/ModeService";

// Sicherer Aufruf (überprüft ob ModeService initialisiert wurde)
try {
  const isDemoActive = ModeService.getInstance().helpers.isDemoMode();
  if (isDemoActive) {
    // ...
  }
} catch (error) {
  console.warn("ModeService nicht initialisiert, verwende Standardverhalten.");
  // Fallback-Verhalten hier
}
```

## Häufige Fehlerquellen

1. In `ProfileTabIcon.tsx` und ähnlichen Komponenten: Überprüfen Sie, dass `isDemoMode` als Funktion aufgerufen wird.
2. In `useModeManager` und `legacyHooks.ts`: Die Implementierung muss die `isDemoMode`-Funktion korrekt aufrufen.
3. In Hooks wie `useIsInDemoMode`: Stellen Sie sicher, dass die Rückgabe korrekt ist.

## Langfristige Lösung

Wir arbeiten an einer ESLint-Regel, die diese Probleme automatisch erkennt und korrigiert. Bis dahin verwenden Sie bitte eine der oben genannten schnellen Lösungen.
