# Teststrategie

Diese Dokumentation beschreibt unsere Teststrategie und das Vorgehen beim Testen unserer Komponenten, Hooks und Services.

## Überblick

Unser Ziel ist es, die Kernfunktionalität unserer Anwendung mit Tests abzusichern, ohne uns in übermäßigen Tests für jede kleine Komponente zu verlieren. Wir folgen dem Prinzip "Test what is important" und konzentrieren uns auf:

1. **Kernselektoren und -hooks**: Diese kapseln zentrale Geschäftslogik und müssen korrekt funktionieren
2. **Services**: Diese enthalten wichtige Validierungslogik und Geschäftsregeln
3. **Grenzfälle**: Kritische Edge-Cases und Fehlerbehandlungen werden gezielt getestet

## Test-Schichten

Wir unterscheiden folgende Test-Schichten:

### 1. Unit-Tests

Unit-Tests prüfen isolierte Funktionalität und Komponenten:

- **Selektoren**: Tests für Selektoren prüfen Datenextraktion, Memoization und stabile Referenzen
- **Hooks**: Tests für Hooks prüfen korrekte Verarbeitung von Eingaben und Zustandsänderungen
- **Services**: Tests für Services prüfen die korrekte Implementierung von Geschäftsregeln

### 2. Integrationstests

Integrationstests prüfen das Zusammenspiel mehrerer Units:

- **Hook-Integration**: Tests für das Zusammenspiel von mehreren Hooks
- **Service-Integration**: Tests für das Zusammenspiel von Services und Stores

## Test-Werkzeuge

Wir verwenden folgende Werkzeuge für unsere Tests:

- **Jest**: Test-Runner und -Framework
- **React Testing Library**: Für Komponenten- und Hook-Tests
- **Mock-Funktionen**: Für die Isolation von Testeinheiten

## Test-Struktur

### Dateistruktur

Tests werden in der Nähe der zu testenden Code-Einheiten platziert:

```
features/
  feature-name/
    __tests__/            # Komponententests
      Component.test.tsx
    services/
      __tests__/          # Servicetests
        Service.test.ts
shared-hooks/
  __tests__/              # Hook-Tests
    useHook.test.tsx
stores/
  tests/                  # Store- und Selektortests
    storeSelectors.test.ts
```

### Namenskonventionen

- Unit-Tests: `*.test.ts` oder `*.test.tsx`
- Ordner für Tests: `__tests__/`

## Beispiele

### Testen von Selektoren

```typescript
// stores/tests/mysolvboxSelectors.test.ts
import { selectActiveTab, selectAllTiles } from '../selectors/mysolvboxSelectors';

describe('mysolvboxSelectors', () => {
  const baseState = { activeTab: 'save', tiles: [...] };

  test('selectActiveTab sollte den aktiven Tab zurückgeben', () => {
    expect(selectActiveTab(baseState)).toBe('save');
  });

  test('Selektoren sollten Ergebnisse memoizieren', () => {
    const firstResult = selectAllTiles(baseState);
    const secondResult = selectAllTiles(baseState);
    expect(firstResult).toBe(secondResult); // Gleiche Referenz
  });
});
```

### Testen von Hooks

```typescript
// shared-hooks/__tests__/useTabs.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useTabs } from "../useTabs";

describe("useTabs", () => {
  const mockSetActiveTab = jest.fn();
  const mockTabs = [{ id: "tab1", label: "Tab 1" }];

  test("sollte den aktiven Tab korrekt zurückgeben", () => {
    const { result } = renderHook(() =>
      useTabs({
        tabs: mockTabs,
        activeTab: "tab1",
        setActiveTab: mockSetActiveTab,
      })
    );

    expect(result.current.activeTabId).toBe("tab1");
  });
});
```

### Testen von Services

```typescript
// features/mysolvbox/services/__tests__/MySolvboxService.test.ts
import { MySolvboxService } from "../MySolvboxService";

describe("MySolvboxService", () => {
  const service = MySolvboxService.getInstance();

  test("sollte eine gültige Tab-ID validieren", () => {
    const tabs = [{ id: "save", label: "Save" }];
    expect(service.isValidTabId("save", tabs)).toBe(true);
  });

  test("sollte eine ungültige Tab-ID ablehnen", () => {
    const tabs = [{ id: "save", label: "Save" }];
    expect(service.isValidTabId("invalid", tabs)).toBe(false);
  });
});
```

## Best Practices

1. **Tests isolieren**: Jeder Test sollte unabhängig von anderen Tests sein
2. **Mocks für Abhängigkeiten**: Externe Abhängigkeiten sollten gemockt werden
3. **Fokus auf Verhalten**: Testen Sie das Verhalten, nicht die Implementierung
4. **Grenzfälle berücksichtigen**: Testen Sie leere Arrays, Null-Werte, Fehlerbehandlung usw.
5. **Bedeutungsvolle Beschreibungen**: Verwenden Sie klare Test- und Beschreibungsnamen, die das erwartete Verhalten dokumentieren

## Ausführen der Tests

Tests können mit folgenden Befehlen ausgeführt werden:

```bash
# Alle Tests ausführen
npm test

# Bestimmte Tests ausführen
npm test -- -t "mysolvboxSelectors"

# Service-Tests ausführen
node scripts/test-services.js

# Test-Coverage anzeigen
npm test -- --coverage
```

## Umgang mit Jest-Setup-Problemen

Bei Problemen mit dem Jest-Setup (insbesondere mit AsyncStorage-Mocks) kann die Konfiguration angepasst werden. Ein typisches Problem ist der Fehler bezüglich der Verwendung von Variablen außerhalb des Scopes in `jest.mock()`.

Folgendes Muster kann helfen:

```typescript
// Direkte Inline-Mocks verwenden
jest.mock("@/stores/someStore", () => ({
  __esModule: true,
  useStore: jest.fn(),
}));

// Oder bei AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));
```
