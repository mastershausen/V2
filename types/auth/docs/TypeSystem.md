# Auth Typsystem

Diese Dokumentation beschreibt die Struktur und Organisation des Typsystems für die Authentifizierungsfunktionalität.

## Übersicht

Das Auth-Typsystem ist in mehrere Kategorien unterteilt:

1. **Benutzertypen** - Typen für Benutzerrollen und -profile
2. **Statustypen** - Diskriminierte Unions für Auth-Status
3. **Sessiontypen** - Typen für Benutzersitzungen und deren Verwaltung
4. **Auth-Haupttypen** - Typen für die Auth-Funktionalität und den useAuth Hook

## Benutzertypen (`userTypes.ts`)

### Haupttypen

- `UserRole` - Literal-Union für Benutzerrollen (free, premium, pro, admin)
- `USER_ROLES` - Konstante für konsistente Verwendung der Rollen
- `ROLE_HIERARCHY` - Definition der Berechtigungsebenen für jede Rolle
- `UserType` - Literal-Union für Benutzertypen (GUEST, DEMO_USER, REGISTERED_USER)
- `USER_TYPES` - Konstante für konsistente Verwendung der Benutzertypen
- `User` - Interface für den Benutzer mit allen Attributen
- `UserProfile` - Interface für das Benutzerprofil mit persönlichen Daten

### Type Guards

- `isValidUserRole` - Prüft, ob ein Wert eine gültige Benutzerrolle ist
- `isValidUserType` - Prüft, ob ein Wert ein gültiger Benutzertyp ist
- `isValidUser` - Prüft, ob ein Objekt ein gültiger Benutzer ist

## Statustypen (`statusTypes.ts`)

### Haupttypen

- `AuthStatusBase` - Basis-Interface für alle Auth-Status
- `AuthenticatedStatus` - Status für authentifizierte Benutzer
- `UnauthenticatedStatus` - Status für nicht authentifizierte Benutzer
- `LoadingStatus` - Status für laufende Auth-Prozesse
- `ErrorStatus` - Status für Auth-Fehler
- `AuthStatus` - Diskriminierte Union aller Status-Typen
- `AppMode` - Typ für verschiedene App-Modi
- `APP_MODES` - Konstante für konsistente Verwendung der App-Modi

### Type Guards

- `isAuthenticated` - Prüft, ob ein Status authentifiziert ist
- `isUnauthenticated` - Prüft, ob ein Status nicht authentifiziert ist
- `isLoading` - Prüft, ob ein Status am Laden ist
- `isError` - Prüft, ob ein Status einen Fehler darstellt
- `isValidAppMode` - Prüft, ob ein Wert ein gültiger App-Modus ist

### Hilfsfunktionen

- `createAuthStatus` - Konvertiert Legacy-Status in das neue Format
- `getAuthStatusType` - Extrahiert den Typ aus einem AuthStatus-Objekt

## Sessiontypen (`sessionTypes.ts`)

### Haupttypen

- `UserSessionData` - Interface für Benutzersitzungsdaten
- `SessionDeviceInfo` - Interface für Geräteinformationen einer Sitzung
- `AuthData` - Interface für Auth-Daten eines Benutzers
- `AuthResponse` - Interface für die Antwort auf Auth-Operationen
- `AuthRequiredAction` - Typ für erforderliche Aktionen nach Auth-Operationen
- `AUTH_REQUIRED_ACTIONS` - Konstanten für Auth-Aktionen

### Type Guards und Hilfsfunktionen

- `isValidAuthRequiredAction` - Prüft, ob eine Aktion eine gültige Auth-Aktion ist
- `isValidSession` - Prüft, ob eine Sitzung gültig ist
- `isSessionExpired` - Prüft, ob eine Sitzung abgelaufen ist

## Auth-Haupttypen (`authTypes.ts`)

### Haupttypen

- `AuthContextValue` - Interface für den Auth-Kontext und Hook
- `AuthResult` - Interface für das Ergebnis einer Auth-Operation
- `RegisterUserData` - Interface für Registrierungsdaten
- `AuthProviderOptions` - Interface für Auth-Provider-Optionen
- `DEFAULT_AUTH_PROVIDER_OPTIONS` - Standardoptionen für den Auth-Provider

### Type Guards

- `isValidAuthResult` - Prüft, ob ein Ergebnis ein gültiges Auth-Ergebnis ist

## Verwendung

Alle Typen werden zentral über die `index.ts` exportiert und können wie folgt importiert werden:

```typescript
import {
  User,
  AuthStatus,
  UserSessionData,
  AuthContextValue,
} from "@/types/auth";
```

## Best Practices

1. **Immer Type Guards verwenden** - Vor der Verwendung von Daten immer mit Type Guards validieren
2. **Diskriminierte Unions nutzen** - Für Status und Zustände diskriminierte Unions verwenden
3. **Literale Typen für Aufzählungen** - Für fest definierte Werte literale Typen statt Enums verwenden
4. **Konstanten für Literale** - Für Literalwerte Konstanten definieren und exportieren
5. **Typsichere Funktionen** - Immer Rückgabetypen und Parametertypen angeben
6. **Dokumentation hinzufügen** - Jedes Interface und jede Funktion kommentieren
