# Migrationsleitfaden: Mode-System

Dieser Leitfaden hilft Entwicklern dabei, von der alten zur neuen Struktur des Mode-Systems zu migrieren. Er enthält konkrete Beispiele, wie Komponenten und Funktionen angepasst werden müssen.

## Übersicht der Änderungen

| Alt                  | Neu                                         | Aktion                                         |
| -------------------- | ------------------------------------------- | ---------------------------------------------- |
| `useMode()`          | `useAppMode()`                              | Hook importieren und ersetzen                  |
| `useModeManager()`   | `useAppMode()`                              | Hook importieren und Funktionsaufrufe anpassen |
| `ModeStore`          | `useModeStore()`                            | Store-Zugriff über neuen Hook                  |
| `isDemoMode()`       | `const { isDemoMode } = useAppMode()`       | Boolean über Hook beziehen                     |
| `isLiveMode()`       | `const { isLiveMode } = useAppMode()`       | Boolean über Hook beziehen                     |
| `setAppMode(mode)`   | `const { setMode } = useAppMode()`          | Funktion aus Hook verwenden                    |
| `switchToDemoMode()` | `const { switchToDemoMode } = useAppMode()` | Funktion aus Hook verwenden                    |
| `switchToLiveMode()` | `const { switchToLiveMode } = useAppMode()` | Funktion aus Hook verwenden                    |

## Beispiele für die Migration

### Beispiel 1: Einfacher Mode-Check

**Vorher:**

```tsx
import { isDemoMode } from "stores/modeStore";

function MyComponent() {
  // ...
  if (isDemoMode()) {
    return <DemoContent />;
  }
  return <LiveContent />;
}
```

**Nachher:**

```tsx
import { useAppMode } from "features/mode";

function MyComponent() {
  // Direkt den berechneten Wert aus dem Hook verwenden
  const { isDemoMode } = useAppMode();

  // ...
  if (isDemoMode) {
    return <DemoContent />;
  }
  return <LiveContent />;
}
```

### Beispiel 2: Mode-Wechsel

**Vorher:**

```tsx
import { toggleAppMode, isDemoMode } from "services/ModeService";

function ModeToggle() {
  const demoMode = isDemoMode();

  return (
    <Button
      onPress={() => toggleAppMode()}
      title={demoMode ? "Wechseln zu Live" : "Wechseln zu Demo"}
    />
  );
}
```

**Nachher:**

```tsx
import { useAppMode } from "features/mode";

function ModeToggle() {
  const { isDemoMode, setMode } = useAppMode();

  return (
    <Button
      onPress={() => setMode(isDemoMode ? "live" : "demo")}
      title={isDemoMode ? "Wechseln zu Live" : "Wechseln zu Demo"}
    />
  );
}
```

### Beispiel 3: Komplexere Mode-Logik

**Vorher:**

```tsx
import { useModeManager } from "features/mode/hooks";

function ModeSwitcher() {
  const {
    currentMode,
    isLoading,
    canSwitchToLiveMode,
    switchToLiveMode,
    error,
  } = useModeManager();

  return (
    <View>
      <Text>Aktueller Modus: {currentMode}</Text>
      {isLoading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        disabled={!canSwitchToLiveMode}
        onPress={switchToLiveMode}
        title="Zu Live wechseln"
      />
    </View>
  );
}
```

**Nachher:**

```tsx
import { useAppMode } from "features/mode";

function ModeSwitcher() {
  const {
    appMode,
    isTransitioning,
    canSwitchModes,
    switchToLiveMode,
    lastError,
  } = useAppMode();

  return (
    <View>
      <Text>Aktueller Modus: {appMode}</Text>
      {isTransitioning && <ActivityIndicator />}
      {lastError && <Text style={styles.error}>{lastError}</Text>}
      <Button
        disabled={!canSwitchModes}
        onPress={switchToLiveMode}
        title="Zu Live wechseln"
      />
    </View>
  );
}
```

## Anpassung von Typdeklarationen

**Vorher:**

```tsx
import { AppMode } from "services/ModeService";

interface Props {
  allowedModes: AppMode[];
  onModeChange: (mode: AppMode) => void;
}
```

**Nachher:**

```tsx
import { AppMode } from "features/mode";

interface Props {
  allowedModes: AppMode[];
  onModeChange: (mode: AppMode) => void;
}
```

## Häufige Migrationsprobleme und Lösungen

### Problem 1: Zugriff auf den Mode in nicht-React-Code

**Lösung:**

```ts
// Für nicht-React-Code, der Zugriff auf den Mode benötigt
import { getModeStore } from "features/mode/stores/modeStore";

function someUtilityFunction() {
  const { appMode } = getModeStore.getState();
  // ...
}
```

### Problem 2: Abhängigkeiten von isLiveAuth oder hasCompletedLiveAuth

**Lösung:**

```tsx
import { useAppMode } from "features/mode";

function AuthComponent() {
  const { userStatus, isAuthenticated } = useAppMode();

  // userStatus enthält nun die Information, die früher über
  // verschiedene Flags verteilt war
  const hasCompletedAuth = isAuthenticated && userStatus === "authenticated";

  // ...
}
```

### Problem 3: Nutzung des MODE_CHANGED Events

**Lösung:**

```tsx
import { MODE_EVENTS } from "features/mode/constants";
import { EventEmitter } from "services/EventEmitter";

// Lauschen auf Mode-Änderungen
EventEmitter.addListener(MODE_EVENTS.APP_MODE_CHANGED, (newMode) => {
  console.log("App-Modus wurde geändert zu:", newMode);
});
```

## Übergangsphase

Während der Übergangsphase stellen wir Kompatibilitäts-Hooks bereit, die die alten Interfaces implementieren, aber intern den neuen Hook verwenden:

```tsx
// features/mode/compat/legacyHooks.ts
import { useAppMode } from "../hooks/useAppMode";

// Legacy-Implementation für Abwärtskompatibilität
export function useMode() {
  const { appMode, isDemoMode, isLiveMode, setMode } = useAppMode();

  console.warn(
    "DEPRECATED: useMode() wird in einer zukünftigen Version entfernt. Bitte verwende useAppMode()."
  );

  return {
    currentMode: appMode,
    isDemoMode,
    isLiveMode,
    setMode: (mode) => setMode(mode),
  };
}
```

Diese Legacy-Hooks werden nach einer Übergangszeit entfernt.

## Zeitplan für die Migration

1. **Woche 1-2**: Migration der Core-Komponenten
2. **Woche 3-4**: Migration aller weiteren Komponenten
3. **Woche 5**: Entfernung der Kompatibilitätsschicht
4. **Woche 6**: Finale Bereinigung und Dokumentation
