# Typsystem-Übersicht

Dieses Dokument bietet einen Überblick über das Typsystem der Anwendung und erklärt die Designprinzipien sowie die Implementierung.

## 🎯 Ziele des Typsystems

- **Typsicherheit** - Vermeidung von Laufzeitfehlern durch statische Typprüfung
- **Selbstdokumentation** - Typen dienen als Dokumentation für Entwickler
- **Wartbarkeit** - Einfache Erweiterung und Anpassung des Systems
- **Konsistenz** - Einheitliche Struktur und Benennungskonventionen
- **Validierung** - Laufzeitvalidierung durch Type Guards

## 📁 Struktur des Typsystems

Das Typsystem ist modular aufgebaut und in thematische Bereiche unterteilt:

```
types/
├── auth/                 # Authentifizierungstypen
│   ├── userTypes.ts      # Benutzertypen und -rollen
│   ├── statusTypes.ts    # Auth-Status als diskriminierte Unions
│   ├── sessionTypes.ts   # Session-Management-Typen
│   ├── authTypes.ts      # Haupttypen für Auth-Funktionalität
│   └── index.ts          # Zentraler Export
├── api/                  # API-bezogene Typen
├── ui/                   # UI-Komponenten-Typen
└── core/                 # Kerntypen der Anwendung
```

## 🛠️ Designprinzipien

### 1. Diskriminierte Unions

Wir verwenden diskriminierte Unions für komplexe Zustandstypen, um typsichere Verzweigungen zu ermöglichen:

```typescript
// Beispiel für Auth-Status
type AuthStatus =
  | {
      type: "authenticated";
      userId: string;
      timestamp: number;
      expiresAt?: number;
    }
  | { type: "unauthenticated"; timestamp: number; reason?: string }
  | { type: "loading"; timestamp: number; operation?: string }
  | { type: "error"; timestamp: number; code: string; message: string };
```

### 2. Literale Typen statt Enums

Wir bevorzugen literale Typen gegenüber Enums für bessere JavaScript-Integration:

```typescript
// Bevorzugt (literale Typen)
type UserRole = "free" | "premium" | "pro" | "admin";
const USER_ROLES = {
  FREE: "free" as UserRole,
  PREMIUM: "premium" as UserRole,
  PRO: "pro" as UserRole,
  ADMIN: "admin" as UserRole,
};

// Vermeiden (Enums)
enum UserRoleEnum {
  FREE = "free",
  PREMIUM = "premium",
  PRO = "pro",
  ADMIN = "admin",
}
```

### 3. Type Guards

Für jeden komplexen Typ definieren wir Type Guards zur Laufzeitvalidierung:

```typescript
// Type Guard für User
function isValidUser(user: unknown): user is User {
  return (
    typeof user === "object" &&
    user !== null &&
    "id" in user &&
    "email" in user &&
    "role" in user
  );
}
```

### 4. Modulare Exporte

Alle Typen werden modular exportiert und können über eine zentrale Datei importiert werden:

```typescript
// Zentrale Exports
export * from "./userTypes";
export * from "./statusTypes";
export * from "./sessionTypes";
```

## 📚 Best Practices

### Typen zuerst definieren

Beginnen Sie bei der Entwicklung neuer Funktionen zuerst mit der Definition der Typen:

1. Identifizieren Sie die Datenstrukturen
2. Definieren Sie Interfaces/Typen
3. Implementieren Sie Type Guards
4. Implementieren Sie die Funktionalität

### Vermeiden von `any`

Verwenden Sie niemals `any`, wenn möglich. Verwenden Sie stattdessen:

- `unknown` für untypisierte Eingaben (mit Type Guards)
- Generische Typen für flexible Funktionen
- Index-Typen für dynamische Objekte

### Testing von Type Guards

Testen Sie Ihre Type Guards mit verschiedenen Eingaben:

```typescript
// Jest-Beispiel
describe("isValidUser", () => {
  it("should return true for valid users", () => {
    const validUser = {
      id: "123",
      email: "test@example.com",
      role: "free",
    };
    expect(isValidUser(validUser)).toBe(true);
  });

  it("should return false for invalid users", () => {
    const invalidUser = {
      id: "123",
    };
    expect(isValidUser(invalidUser)).toBe(false);
  });
});
```

## 📝 Dokumentationsstandards

Jeder Typ sollte mit JSDoc dokumentiert werden:

```typescript
/**
 * Repräsentiert einen Benutzer des Systems
 * @property id - Eindeutige ID des Benutzers
 * @property email - E-Mail-Adresse des Benutzers
 * @property role - Rolle des Benutzers im System
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  // ...
}
```

## 🔄 Migration von Legacy-Code

Bei der Migration von nicht typisiertem Code oder JS-Code:

1. Beginnen Sie mit der Definition der Kerntypen
2. Implementieren Sie Type Guards für die Validierung
3. Fügen Sie Konvertierungsfunktionen hinzu
4. Migrieren Sie schrittweise auf die neuen Typen
