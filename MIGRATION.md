# Migrationsleitfaden für das Mode-System

Diese Dokumentation beschreibt den Migrationsprozess vom alten Mode-System zum neuen, verbesserten Mode-System.

## Übersicht

Das neue Mode-System bietet:

- Verbesserte Typsicherheit
- Bessere Testbarkeit
- Reduzierte Abhängigkeiten
- Klarere API-Grenzen
- Verbesserte Performance

## Phasen der Migration

### Phase 1: Grundlagen ✅

- Neue Architektur definiert
- Zentrale Typen erstellt
- Mode-Service implementiert
- Basis-Stores konfiguriert

### Phase 2: Hooks-Implementierung ✅

- `useMode` als Basis-Hook implementiert
- `useModeManager` für erweiterte Funktionen implementiert
- Unit-Tests für die neue Implementierung geschrieben

### Phase 3: Kompatibilitätsschicht ✅

- Kompatibilitäts-Hooks für Legacy-Code erstellt:
  - `useDemoModeStatus` → `useMode`
  - `useAppModeManager` → `useModeManager`
- Nahtlose Integration mit bestehenden Komponenten

### Phase 4: Schrittweise Migration ✅

- Komponenten nach Priorität identifizieren
- Komponente für Komponente migrieren
- Neue Tests für migrierte Komponenten schreiben

### Phase 5: Bereinigung ✅

- Legacy-Code entfernt
- Kompatibilitätsschicht entfernt
- Finales Refactoring durchgeführt

## Migrationsleitfaden für Entwickler

### Vom alten zum neuen System

#### useDemoModeStatus → useMode

**Vor der Migration:**

```tsx
import { useDemoModeStatus } from "@/hooks";

function MyComponent() {
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoModeStatus();

  return (
    <Button
      onPress={isDemoMode ? disableDemoMode : enableDemoMode}
      title={`Wechseln zu ${isDemoMode ? "Live" : "Demo"}`}
    />
  );
}
```

**Nach der Migration:**

```tsx
import { useMode } from "@/features/mode";

function MyComponent() {
  const { isDemoMode, setAppMode } = useMode();

  const toggleMode = async () => {
    await setAppMode(isDemoMode ? "live" : "demo");
  };

  return (
    <Button
      onPress={toggleMode}
      title={`Wechseln zu ${isDemoMode ? "Live" : "Demo"}`}
    />
  );
}
```

#### useAppModeManager → useModeManager

**Vor der Migration:**

```tsx
import { useAppModeManager } from "@/hooks";

function MyComponent() {
  const { currentMode, hasValidLiveSession, switchToMode } =
    useAppModeManager();

  const handleModeChange = async () => {
    const targetMode = currentMode === "demo" ? "live" : "demo";
    const success = await switchToMode(targetMode);

    if (success) {
      console.log(`Modus gewechselt zu ${targetMode}`);
    }
  };

  return (
    <View>
      <Text>Aktueller Modus: {currentMode}</Text>
      <Text>Session gültig: {hasValidLiveSession ? "Ja" : "Nein"}</Text>
      <Button onPress={handleModeChange} title="Modus wechseln" />
    </View>
  );
}
```

**Nach der Migration:**

```tsx
import { useModeManager } from "@/features/mode";

function MyComponent() {
  const { currentAppMode, isSessionValid, switchToMode } = useModeManager();

  const handleModeChange = async () => {
    const targetMode = currentAppMode === "demo" ? "live" : "demo";
    const result = await switchToMode(targetMode);

    if (result.success) {
      console.log(`Modus gewechselt zu ${result.newMode}`);
    } else if (result.requiresAuth) {
      // Authentifizierung erforderlich
    }
  };

  return (
    <View>
      <Text>Aktueller Modus: {currentAppMode}</Text>
      <Text>Session gültig: {isSessionValid ? "Ja" : "Nein"}</Text>
      <Button onPress={handleModeChange} title="Modus wechseln" />
    </View>
  );
}
```

## Veraltete Dateien und Empfehlungen für die Migration

### Hooks

| Veraltete Datei                            | Neue Import-Empfehlung                              | Status                  |
| ------------------------------------------ | --------------------------------------------------- | ----------------------- |
| `/hooks/useMode.ts`                        | `import { useMode } from '@/features/mode';`        | Veraltet, wird entfernt |
| `/hooks/useModeManager.ts`                 | `import { useModeManager } from '@/features/mode';` | Veraltet, wird entfernt |
| `/hooks/compat/useDemoModeCompat.ts`       | `import { useMode } from '@/features/mode';`        | Veraltet, wird entfernt |
| `/hooks/compat/useAppModeManagerCompat.ts` | `import { useModeManager } from '@/features/mode';` | Veraltet, wird entfernt |

### Stores

| Veraltete Datei              | Neue Import-Empfehlung                            | Status                  |
| ---------------------------- | ------------------------------------------------- | ----------------------- |
| `/stores/modeStore.ts`       | `import { useModeStore } from '@/features/mode';` | Veraltet, wird entfernt |
| `/stores/modeStoreCompat.ts` | `import { useModeStore } from '@/features/mode';` | Veraltet, wird entfernt |

### Empfohlene Import-Struktur

Um die zukünftige Wartbarkeit zu verbessern und eine konsistente Codebase zu gewährleisten,
empfehlen wir folgenden Import-Ansatz für das Mode-Feature:

```tsx
// Bevorzugter Import-Stil
import { useMode, useModeManager, useModeStore } from "@/features/mode";

// Alternativ können spezifische Untermodule verwendet werden
import { useMode } from "@/features/mode/hooks";
import { useModeStore } from "@/features/mode/stores";
```

## FAQ

### Muss ich alle Komponenten sofort migrieren?

Nein, die Kompatibilitätsschicht ermöglicht eine schrittweise Migration. Bestehender Code funktioniert weiterhin.

### Wie soll ich mit neuen Komponenten verfahren?

Neue Komponenten sollten direkt die neuen Hooks verwenden.

### Was passiert mit den alten Hooks?

Die alten Hooks werden zunächst durch Kompatibilitäts-Implementierungen ersetzt und später vollständig entfernt.

### Zeitplan für die Entfernung von Legacy-Code

Die Legacy-Implementierungen (Kompatibilitätsschicht) werden in Version 2.0.0 vollständig entfernt.
Alle Komponenten sollten bis dahin auf die neuen Hooks umgestellt sein.
