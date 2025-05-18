# Authentifizierungs-Feature

## Übersicht

Das Auth-Feature ist verantwortlich für die Benutzerauthentifizierung, Session-Management und Zugriffskontrolle in der Anwendung. Es umfasst folgende Hauptfunktionen:

- **Login/Logout**: Authentifizierung von Benutzern
- **Registrierung**: Erstellung neuer Benutzerkonten
- **Session-Management**: Verwaltung von Benutzer-Sessions
- **Zugriffsrechte**: Kontrolle des Zugriffs auf geschützte Bereiche

## Architektur

Die Auth-Architektur folgt dem GOLDSTANDARD und verwendet ein modulares Design mit klarer Trennung der Verantwortlichkeiten:

```
features/auth/
├── components/     # Wiederverwendbare UI-Komponenten
├── config/         # Konfigurationen und Konstanten
├── contexts/       # Context Provider
├── docs/           # Dokumentation
├── hooks/          # React Hooks für Auth-State
├── services/       # Auth-bezogene Dienste
├── types/          # Typdefinitionen
└── utils/          # Hilfsutility-Funktionen
```

## Session-Management

### SessionService

Der SessionService wurde refaktoriert, um folgende Anforderungen zu erfüllen:

- **Verbesserte Testbarkeit**: Durch klare Abstraktion und Dependency Injection
- **Modusseparation**: Saubere Trennung von Demo- und Live-Modus-Operationen
- **Einheitliches Logging**: Konsistente Log-Strategien
- **Robuste Fehlerbehandlung**: Standardisierter Umgang mit Fehlern

#### Interfaces

```typescript
// Interface für Session-Operationen
export interface ISessionService {
  // Session-Management
  saveSession(user: User, authStatus: AuthStatus): Promise<boolean>;
  loadSession(): Promise<UserSessionData | null>;
  logout(): Promise<boolean>;

  // Sitzungsstatus-Flags
  hasValidLiveSession(): Promise<boolean>;
  updateValidLiveSessionStatus(isValid: boolean): Promise<void>;

  // Lebenszyklus-Management
  clearOnAppExit(): Promise<void>;
  restoreDefaultState(): Promise<UserSessionData>;
}

// Interface für Session-Speicheroperationen
export interface ISessionStorage {
  saveSession(sessionData: UserSessionData): Promise<boolean>;
  loadSession(): Promise<UserSessionData | null>;
  clearSession(): Promise<boolean>;
  isValidSession(session: UserSessionData | null): boolean;
}
```

#### Implementierungen

1. **DemoSessionStorage**: Eine vereinfachte Implementierung für Demo-Umgebungen
2. **LiveSessionStorage**: Eine robuste Implementierung für Produktiv-Umgebungen
3. **SessionService**: Die Hauptklasse, die ISessionService implementiert und die passende Speicherimplementierung basierend auf dem App-Modus auswählt

## Verwendung

```typescript
import { sessionService } from "@/services/SessionService";

// Session laden
const session = await sessionService.loadSession();

// Benutzer-Login
const user = {
  id: "123",
  name: "Max Mustermann",
  email: "max@example.com",
  role: "free",
};
const success = await sessionService.saveSession(user, "authenticated");

// Benutzer-Logout
await sessionService.logout();
```

## Tests

Die Testbarkeit wurde durch die Abstraktion der Storage-Implementierungen erheblich verbessert. Der Service kann jetzt mit Mock-Implementierungen leicht getestet werden:

```typescript
// Mock-Implementierung für Tests
class MockSessionStorage implements ISessionStorage {
  // ...Mock-Implementierung
}

// Im Test kann dann ein SessionService mit Mock-Storages erzeugt werden
const mockDemoStorage = new MockSessionStorage();
const mockLiveStorage = new MockSessionStorage();
const sessionService = new SessionService(mockDemoStorage, mockLiveStorage);
```
