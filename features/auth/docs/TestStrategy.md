# Authentifizierungs-Test-Strategie

## ROI-basierter Testansatz

Gemäß dem Gold Standard 4.2 folgt unsere Teststrategie einem pragmatischen ROI-basierten Ansatz. Das bedeutet, dass wir uns auf die Bereiche konzentrieren, die den höchsten Wert bei möglichst geringem Aufwand bieten:

1. **Hohe Änderungsfrequenz**: Komponenten, die häufig geändert werden, müssen gut getestet sein, um Regressionen zu vermeiden.
2. **Komplexe Geschäftslogik**: Code mit komplexen Regeln oder Algorithmen erfordert umfangreiche Tests.
3. **Fehleranfälligkeit**: Bereiche, bei denen in der Vergangenheit viele Fehler aufgetreten sind, werden priorisiert.
4. **Kritische Nutzerflüsse**: Funktionen, die für das Kerngeschäft unerlässlich sind, werden besonders gründlich getestet.

Im Bereich der Authentifizierung konzentrieren wir uns auf:

- **Formular-Validierung**: Validiert Benutzereingaben für Anmeldung/Registrierung
- **Authentifizierungs-Hooks**: Stellen die UI-Logik und Zustandsverwaltung bereit
- **Sitzungsverwaltung**: Bearbeitet persistente Anmeldung und Token-Verwaltung
- **UI-Komponenten**: Stellen die Benutzeroberfläche für Auth-Workflows dar

## Implementierte Teststrategie

| Komponente | Testabdeckung | Priorität | Begründung |
|------------|---------------|-----------|------------|
| `formValidation.ts` | Hoch | 1 | Kritisch für Benutzereingaben, komplexe Validierungsregeln |
| `SessionService.ts` | Mittel | 1 | Zentral für App-Funktionalität, komplexe Zustandslogik |
| `useAuthForm` | Hoch | 2 | Wichtig für Benutzerinteraktion, Fehlerbehandlung |
| `useAuthNavigation` | Mittel | 2 | Essenziell für Benutzerfluss, aber einfachere Logik |
| `useAppModeManager` | Hoch | 1 | Kritisch für Demo/Live-Modus-Wechsel, komplex |

### Testkategorien und Schwerpunkte

#### Validierungstests
- Validierung von E-Mail-Formaten
- Passwort-Stärke und -Regeln
- Formularfelder-Validierung

#### Formular-Hook-Tests
- Initiales Formular-Setup
- Feldaktualisierung
- Formulareinreichung
- Fehlerbehandlung

#### Navigations-Tests
- Navigation zu Auth-Routen
- Geschützte Route-Navigation
- Weiterleitungen nach erfolgreicher Authentifizierung

#### Mode-Manager-Tests
- Modusänderungen von Demo zu Live
- Sitzungsvalidierung
- Event-Bus-Integration

## Mock-Strategien

Um konsistente und zuverlässige Tests zu gewährleisten, wurden folgende Mock-Strategien implementiert:

### Authentifizierungskontext-Mock

```typescript
// Beispiel für einen Auth-Kontext-Mock
const mockAuthContext = {
  user: { id: 'test-user', email: 'test@example.com' },
  isAuthenticated: true,
  login: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue(true)
};
```

### Service-Mocks

```typescript
// Beispiel für einen SessionService-Mock
const mockSessionService = {
  hasValidLiveSession: jest.fn().mockResolvedValue(true),
  updateValidLiveSessionStatus: jest.fn(),
  restoreDefaultState: jest.fn().mockResolvedValue({...})
};
```

## ROI-Optimierung durch isolierte Tests

Wir haben uns für isolierte Tests entschieden, anstatt für End-to-End-Tests, aus folgenden Gründen:

1. **Schnellere Ausführung**: Isolierte Tests sind deutlich schneller als Integration oder E2E-Tests
2. **Stabilität**: Weniger anfällig für Flakiness und externe Abhängigkeiten
3. **Bessere Fehlerlokalisierung**: Genaue Identifizierung der Fehlerursache
4. **Einfacheres Debugging**: Leichtere Reproduktion und Behebung von Fehlern

## Testumfang und Abdeckung

### Validierungstests

| Testfall | Beschreibung |
|----------|--------------|
| E-Mail-Validierung | Prüft leere, ungültige und gültige E-Mail-Formate |
| Passwort-Validierung | Testet Passwortlänge, Sonderzeichen, Zahlen und Großbuchstaben |
| Pflichtfeld-Validierung | Stellt sicher, dass Pflichtfelder nicht leer sein können |
| Login-Formular | Validiert das gesamte Login-Formular mit verschiedenen Eingaben |
| Registrierungs-Formular | Testet das Registrierungsformular mit verschiedenen Szenarien |

### Auth-Form-Hook-Tests

| Testfall | Beschreibung |
|----------|--------------|
| Formular-Initialisierung | Prüft korrekte Initialisierung der Formulardaten |
| Feldaktualisierung | Testet die korrekte Aktualisierung einzelner Felder |
| Validierungslogik | Stellt sicher, dass Validierungsfehler korrekt angezeigt werden |
| Formulareinreichung | Prüft erfolgreiche und fehlgeschlagene Einreichungen |
| Demo-Daten | Testet das Ausfüllen mit Demo-Daten-Funktion |

### Navigations-Tests

| Testfall | Beschreibung |
|----------|--------------|
| Navigations-Methoden | Prüft alle Navigations-Methoden-Definitionen |
| Login-Navigation | Testet Navigation zur Login-Seite |
| Geschützte Bereiche | Verifiziert Zugriff auf geschützte Bereiche basierend auf Auth-Status |
| Back-Navigation | Prüft korrekte Zurück-Navigation |
| Optionen-Handling | Testet Navigation mit benutzerdefinierten Optionen |

## Ausblick und Erweiterungen

Folgende Tests sind für zukünftige Erweiterungen geplant:

1. **Integrationstests**: Testen der Zusammenarbeit mehrerer Komponenten
2. **Visuelle Regressionstests**: Sicherstellen, dass UI-Komponenten korrekt dargestellt werden
3. **Snapshot-Tests**: Überprüfen der Konsistenz der Komponenten-Ausgabe
4. **Leistungstests**: Bewertung der Leistung der Authentifizierungsabläufe

## Anleitung zum Ausführen der Tests

```bash
# Alle Auth-Tests ausführen
npm test -- --testPathPattern=features/auth

# Spezifische Test-Datei ausführen
npm test -- --testPathPattern=features/auth/utils/__tests__/formValidation.test.ts

# Test-Coverage-Bericht erstellen
npm test -- --coverage --testPathPattern=features/auth
``` 