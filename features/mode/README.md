# Mode Management Feature

## Übersicht

Diese Feature-Komponente implementiert die Modus-Verwaltung der Anwendung nach dem Goldstandard-Pattern. Sie ermöglicht das Umschalten zwischen verschiedenen Anwendungsmodi wie Demo- und Live-Modus und bietet Hooks für die Verwaltung und Verwendung der Modi.

**WICHTIG:** Die Mode-Logik wird NUR im DevBuild implementiert. Dabei spiegelt der Demo-Mode den DemoBuild wider und der Live-Mode den LiveBuild.

## Migration von UserMode zu UserStatus

Die Anwendung verwendet eine einheitliche Terminologie mit `UserStatus` anstelle von `UserMode`, und `modeStore` anstelle von `ModeService`. Die Kompatibilitätsschicht wurde vollständig entfernt.

### Aktueller Stand

- Die Haupt-App-Komponenten verwenden durchgängig `UserStatus` und den direkten Store-Zugriff
- Veraltete Klassen und Dateien wurden entfernt
- Die Dokumentation wurde auf die neue Terminologie aktualisiert

### Weitere erforderliche Arbeiten

Die Migration ist in der Hauptanwendung abgeschlossen, aber einige Test-Dateien benötigen noch Anpassungen:

- `services/__tests__/ModeService.test.ts`
- `services/__tests__/ModeService.integration.test.ts`
- `stores/__tests__/modeStore.integration.test.ts`
- `features/mode/__tests__/stores/modeStore.test.ts`

Diese Anpassungen sollten in einem separaten Ticket behandelt werden.

## Verwendung

```tsx
import { useModeStore } from "@/features/mode/stores/modeStore";
import { USER_STATUS } from "@/types/common/appMode";

// Status-Abfrage
const { appMode, userStatus, isDemoAccount } = useModeStore();

// Status ändern
const { setAppMode, setUserStatus, setDemoAccount } = useModeStore();

// Modi umschalten
const { toggleAppMode } = useModeStore();

// Beispiel: Status prüfen
if (userStatus === USER_STATUS.AUTHENTICATED) {
  // Logik für authentifizierte Benutzer
}
```

## Architektur

Das Mode-Feature besteht aus folgenden Hauptkomponenten:

1. **Store**: `modeStore` in `features/mode/stores/modeStore.ts` - Speichert und verwaltet den aktuellen Modus-Zustand
2. **Types**: Typdefinitionen und Konstanten in `features/mode/types/index.ts` und `types/common/appMode.ts`
3. **Events**: Event-Handling über den modeEventEmitter in `modeStore.ts`

Die zentrale Schnittstelle ist der `useModeStore`-Hook, der direkten Zugriff auf alle relevanten Funktionen und Zustände bietet.

## Best Practices

- Verwenden Sie immer `userStatus` statt `userMode`
- Greifen Sie direkt auf den Store zu, nicht auf Hilfsklassen
- Vermeiden Sie das Erstellen neuer Abstraktionsschichten über dem Store
- Schreiben Sie Tests für neue Funktionalitäten mit der neuen API-Struktur

## Weitere Dokumentation

Weitere Informationen zur Migration finden Sie in:

- `docs/migration-usermode-to-userstatus.md` - Vollständige Migrationsdokumentation
- `docs/store-architecture.md` - Überblick über die Store-Architektur

## Dateistruktur

```
/features/mode/
  /components/              # UI-Komponenten für Modus-Interaktion
    AppModeToggle.tsx       # Komponente zum Umschalten zwischen Modi
    ModeBadge.tsx           # Indikator für den aktuellen Modus
    ModeSelector.tsx        # Erweiterter Modus-Auswähler
    index.ts                # Re-Export der Komponenten

  /hooks/                   # Spezialisierte Hooks für die Mode-Funktionalität
    useModeManager.ts       # Erweiterter Hook für UI-Komponenten
    index.ts                # Re-Export der Hooks

  /config/                  # Konfigurationsdateien
    modeConfig.ts           # Zentrale Konfiguration für alle Mode-Einstellungen

  /types/                   # Typendefinitionen
    index.ts                # Zentrale Typendefinitionen

  /utils/                   # Hilfsfunktionen
    modeKey.ts              # Funktionen zur Erstellung von Mode-spezifischen Keys

  /services/                # Core-Implementierung der Mode-Logik
    modeService.ts          # Hauptdienst für Mode-Operationen

  /stores/                  # Zustandsverwaltung
    modeStore.ts            # Zentraler Store für Mode-Status

  /__tests__/               # Tests
    /integration/           # Integration-Tests
      modeService.integration.test.ts
      modeStore.integration.test.ts
    /unit/                  # Unit-Tests
      modeConfig.test.ts
      modeKey.test.ts

  README.md                 # Diese Datei - Dokumentation
```

## Kernkonzepte

### Modi

Die App unterstützt drei verschiedene Modi:

- **Live-Modus**: Der Standardmodus für Produktionsumgebungen und normale Benutzerinteraktionen.
- **Demo-Modus**: Für Demonstrationen und das Testen mit Mock-Daten.
- **Development-Modus**: Speziell für Entwicklungszwecke mit zusätzlichen Debug-Funktionen.

### Layer-Struktur

Das Feature folgt einer klaren Schichtarchitektur:

1. **Core Layer** (Services, Store)

   - Implementiert die Kernlogik des Mode-Features
   - Handhabt die State-Verwaltung und -Persistenz
   - Kommuniziert mit anderen Systemteilen via Events

2. **API Layer** (Hooks)

   - Bietet eine saubere API für andere Features/Komponenten
   - Abstrahiert die Implementierungsdetails

3. **UI Layer** (Components)
   - Implementiert die Benutzeroberfläche für Mode-Operationen
   - Verwendet die Hooks für die Anbindung an die Logik

## Verwendung

### Als Entwickler, der den Mode in einer Komponente verwenden möchte:

```typescript
import { useMode } from "@/features/mode/hooks";

function MyComponent() {
  const { isDemoMode, isLiveMode } = useMode();

  return (
    <View>
      {isDemoMode && <Text>Du bist im Demo-Modus</Text>}
      {isLiveMode && <Text>Du bist im Live-Modus</Text>}
    </View>
  );
}
```

### Als UI-Entwickler, der Mode-Wechsel ermöglichen möchte:

```typescript
import { useModeManager } from "@/features/mode/hooks";

function ModeToggleButton() {
  const { isDemoMode, switchToLiveMode, switchToDemoMode } = useModeManager();

  const handlePress = async () => {
    if (isDemoMode) {
      await switchToLiveMode();
    } else {
      await switchToDemoMode();
    }
  };

  return (
    <Button
      title={isDemoMode ? "Zum Live-Modus wechseln" : "Zum Demo-Modus wechseln"}
      onPress={handlePress}
    />
  );
}
```

### Verwendung der UI-Komponenten:

```typescript
import { AppModeToggle } from "@/features/mode/components";

function SettingsScreen() {
  return (
    <View>
      <Text>App-Einstellungen</Text>
      <AppModeToggle
        label="App-Modus"
        onModeChanged={() => console.log("Modus geändert")}
      />
    </View>
  );
}
```

## Architektur-Entscheidungen

1. **Zentralisierte Konfiguration**: Alle Modi, Konstanten und Standardwerte sind in `modeConfig.ts` definiert.
2. **Klare Typendefinitionen**: Alle Typen sind in `types/index.ts` zentralisiert.
3. **Unabhängigkeit von UI-Framework**: Die Kernlogik ist von der UI-Schicht entkoppelt.
4. **Event-basierte Kommunikation**: Änderungen werden über Events kommuniziert für lose Kopplung.
5. **Testbarkeit**: Das Feature ist so strukturiert, dass es gut testbar ist.

## Hinweise

- Die Mode-Funktionalität ist primär für Entwicklungs- und Demozwecke gedacht und nicht für Endbenutzer.
- In Production-Builds (LiveBuild) ist der Modus fest auf "live" eingestellt und nicht änderbar.
- In Demo-Builds ist der Modus fest auf "demo" eingestellt und nicht änderbar.
- Nur im DevBuild ist das Umschalten zwischen Modi möglich.

## Mode Feature: Überblick

Diese Feature-Komponente implementiert die Modus-Verwaltung der Anwendung nach dem Goldstandard-Pattern. Sie ermöglicht das Umschalten zwischen verschiedenen Anwendungsmodi wie Demo- und Live-Modus und bietet Hooks für die Verwaltung und Verwendung der Modi.

**WICHTIG:** Die Mode-Logik wird NUR im DevBuild implementiert. Dabei spiegelt der Demo-Mode den DemoBuild wider und der Live-Mode den LiveBuild.

### 🔧 Komponenten

- **AppModeToggle**: UI-Komponente zum Umschalten zwischen Demo- und Live-Modus

### 🪝 Hooks

- **useMode**: Basis-Hook für alle Mode-Operationen mit grundlegender Funktionalität
- **useModeManager**: Erweiterter Hook für komplexere Use-Cases mit zusätzlichen Funktionalitäten
- **useNetStatus**: Hook zur Überwachung des Netzwerkstatus
- **useAppState**: Hook zur Überwachung des App-Zustands (Vordergrund/Hintergrund)

### 🛠️ Services

- **ModeService**: Implementiert die Kernlogik für Mode-Verwaltung

### 📦 Stores

- **modeStore**: Zentraler Zustandsspeicher für alle Mode-relevanten Daten

### ⚙️ Konfiguration

- **modeConfig**: Enthält Default-Werte und Konstanten für die Mode-Funktionalität

### 🧰 Utilities

- **modeKey**: Hilfsfunktionen für das Arbeiten mit Mode-Keys und -Werten

### 📝 Verwendung

```tsx
// Mode-Hooks einbinden
import { useMode, useModeManager } from "@/features/mode/hooks";

// Basis-Hook für einfache Mode-Verwendung
function SimpleComponent() {
  const { isDemoMode, isLiveMode, toggleAppMode } = useMode();

  return (
    <Button
      onPress={toggleAppMode}
      title={`Im ${isDemoMode ? "Demo" : "Live"}-Modus`}
    />
  );
}

// Erweiterter Hook für komplexere Anforderungen
function AdvancedComponent() {
  const {
    isDemoMode,
    isLiveMode,
    switchToDemoMode,
    switchToLiveMode,
    isSessionValid,
    needsReauthentication,
  } = useModeManager();

  // Implementierung mit erweiterter Funktionalität
}
```

### 📊 Unterstützende Hooks

Spezielle Hooks für die Mode-Funktionalität:

```tsx
// Netzwerkstatus überwachen
import { useNetStatus } from "@/features/mode/hooks";

function NetworkAwareComponent() {
  const { isConnected, connectionType } = useNetStatus();

  return isConnected ? (
    <Text>Verbunden über {connectionType}</Text>
  ) : (
    <Text>Offline-Modus</Text>
  );
}

// App-Zustand überwachen
import { useAppState } from "@/features/mode/hooks";

function AppStateAwareComponent() {
  const { appState, isActive, onForeground, onBackground } = useAppState();

  useEffect(() => {
    // Wird ausgeführt, wenn die App in den Vordergrund kommt
    const cleanup = onForeground(() => {
      console.log("App kam in den Vordergrund");
    });

    return cleanup;
  }, [onForeground]);

  return <Text>App ist {isActive ? "aktiv" : "inaktiv"}</Text>;
}
```

### 📋 Hinweise

- Die Mode-Logik wird NUR im Development-Build implementiert
- Im Demo-Mode wird der Demo-Build nachgestellt
- Im Live-Mode wird der Live-Build nachgestellt
- Alle Mode-bezogenen Komponenten sind in diesem Feature-Modul zentralisiert
- In Demo-Builds ist der Modus fest auf "demo" eingestellt und nicht änderbar
- Nur im DevBuild ist das Umschalten zwischen Modi möglich

## Mode-Feature

Das Mode-Feature ist eine zentrale Komponente unserer Anwendung, die das Umschalten zwischen verschiedenen Modi (Live- und Demo-Modus) ermöglicht. Dies ist besonders im Entwicklungsbuild wichtig für das Testen und die Präsentation.

### Komponenten

- `AppModeToggle`: Eine UI-Komponente zum Umschalten zwischen Live- und Demo-Modus.

### Hooks

- `useMode`: Haupt-Hook für alle Mode-bezogenen Operationen (Status, Funktionen).
- `useModeManager`: Erweiterter Hook mit App-Status-Erkennung und Netzwerkstatus.
- `useNetStatus`: Hook zur Überwachung des Netzwerkstatus.
- `useAppState`: Hook zum Erfassen des Anwendungsstatus.

### Services

- `ModeService`: Verantwortlich für die Verwaltung des App-Modus.
- `ModeServiceCompat`: Kompatibilitätsschicht für Abwärtskompatibilität.

### Stores

- `modeStore`: Zustandsverwaltung für App-Modi und Benutzereinstellungen.
  - Implementiert Event-Handling und persistente Einstellungen
  - Bietet Selektoren und Aktionen für die Modussteuerung
  - Wird über `useModeStore` aus `@/features/mode/stores` aufgerufen

### Konfiguration

- `modeConfig`: Enthält Farbschemata und UI-Konfigurationen für verschiedene Modi.

### Utilities

- `modeKey`: Hilfsfunktionen zum Generieren von modus-spezifischen Schlüsseln.
- `modeKeyCompat`: Kompatibilitätsschicht für die Verwendung mit älterem Code.

### Verwendung

#### Einfache Komponente:

```tsx
import { useMode } from "@/features/mode/hooks";

function MyComponent() {
  const { isDemoMode, isLiveMode } = useMode();

  return (
    <View>
      <Text>Aktueller Modus: {isDemoMode ? "Demo" : "Live"}</Text>
    </View>
  );
}
```

#### Komponente mit Store-Integration:

```tsx
import { useModeStore } from "@/features/mode/stores/modeStore";

function ModeController() {
  const { currentAppMode, setAppMode } = useModeStore();

  return (
    <View>
      <Text>App-Modus: {currentAppMode}</Text>
      <Button title="Zu Demo wechseln" onPress={() => setAppMode("demo")} />
    </View>
  );
}
```

#### Advanced Component:

```tsx
import { useModeManager } from "@/features/mode/hooks";

function NetworkAwareComponent() {
  const { isDemoMode, isNetworkConnected, isSessionValid, switchToDemoMode } =
    useModeManager();

  return (
    <View>
      <Text>Status: {isNetworkConnected ? "Online" : "Offline"}</Text>
      <Button
        title="Demo-Modus aktivieren"
        onPress={switchToDemoMode}
        disabled={!isNetworkConnected}
      />
    </View>
  );
}
```

### Migration vom alten System

Das Mode-Feature wurde im Rahmen einer Refaktorierung aus dem monolithischen Ansatz herausgelöst. Für die Abwärtskompatibilität wurden Kompatibilitätsschichten erstellt:

1. `hooks/useMode.ts` → `features/mode/hooks/useMode.ts` (mit Wrapper in `hooks/useMode.ts`)
2. `services/ModeService.ts` → `features/mode/services/ModeService.ts` (mit `ModeServiceCompat`)
3. `stores/modeStore.ts` → `features/mode/stores/modeStore.ts` (mit `modeStoreCompat`)

Neue Komponenten sollten direkt die Implementierungen aus dem Feature-Verzeichnis verwenden:
