# Session-Storage Design

## Überblick

Das Session-Storage-System ist eine zentrale Komponente für das Auth-Feature und wurde mit folgenden Zielen refaktoriert:

1. **Bessere Testbarkeit**: Die Speicherlogik ist über Interfaces abstrahiert, um Tests mit Mock-Implementierungen zu ermöglichen
2. **Klare Trennung**: Separate Implementierungen für Demo- und Live-Umgebungen
3. **Einheitliche Schnittstelle**: Ein konsistentes Interface für alle Storage-Operationen
4. **Robuste Fehlerbehandlung**: Standardisierter Fehlerbehandlungsmechanismus

## Design-Prinzipien

Das Design folgt dem Dependency Inversion Principle und dem Interface Segregation Principle:

- Abstraktion über Interfaces
- Fokussierte Interfaces mit minimalen Anforderungen
- Trennung von Implementierungsdetails
- Gezielte Verantwortlichkeiten pro Klasse

## Interface-Definition

```typescript
export interface ISessionStorage {
  saveSession(sessionData: UserSessionData): Promise<boolean>;
  loadSession(): Promise<UserSessionData | null>;
  clearSession(): Promise<boolean>;
  isValidSession(session: UserSessionData | null): boolean;
}
```

Jede Methode hat einen klar definierten Zweck und Rückgabewert, was die Testbarkeit erhöht.

## Implementierungen

### DemoSessionStorage

Die Demo-Implementierung ist für Schulungs- und Vorführzwecke optimiert:

- Einfache Validierungsregeln
- Keine Ablaufprüfung für Sessions
- Speziell für die Verwendung mit Demo-Benutzern konzipiert

Wichtige Methoden:

- **saveSession**: Speichert die Sitzungsdaten im Demo-Speicher
- **loadSession**: Lädt die Sitzungsdaten aus dem Demo-Speicher
- **clearSession**: Entfernt die Demo-Sitzung und setzt Flags zurück
- **isValidSession**: Überprüft, ob eine Sitzung gültige Pflichtfelder hat

### LiveSessionStorage

Die Live-Implementierung ist für produktive Umgebungen mit echten Benutzern optimiert:

- Strenge Validierungsregeln
- Sitzungsablauf-Prüfung
- Verbesserte Sicherheitsmaßnahmen

Wichtige Methoden:

- **saveSession**: Speichert die Sitzungsdaten im Live-Speicher
- **loadSession**: Lädt die Sitzungsdaten aus dem Live-Speicher
- **clearSession**: Entfernt die Live-Sitzung und setzt Flags zurück
- **isValidSession**: Überprüft, ob eine Sitzung gültige Pflichtfelder hat und nicht abgelaufen ist

## Verwendung mit SessionService

Der SessionService agiert als Fassade für die verschiedenen Storage-Implementierungen:

```typescript
class SessionService implements ISessionService {
  private demoStorage: ISessionStorage;
  private liveStorage: ISessionStorage;

  constructor(
    demoStorage: ISessionStorage = new DemoSessionStorage(),
    liveStorage: ISessionStorage = new LiveSessionStorage()
  ) {
    this.demoStorage = demoStorage;
    this.liveStorage = liveStorage;
  }

  // Methoden verwenden den passenden Storage basierend auf dem App-Modus
  // ...
}
```

## Vorteile dieser Architektur

1. **Isolierte Tests**: Jede Storage-Implementierung kann isoliert getestet werden
2. **Einfache Erweiterbarkeit**: Neue Storage-Typen können hinzugefügt werden, ohne bestehenden Code zu ändern
3. **Verbesserte Fehlerdiagnose**: Klare Trennung macht es einfacher, Probleme zu isolieren
4. **Wiederverwendbarkeit**: Die Storage-Komponenten können für andere Zwecke wiederverwendet werden
5. **Verbesserte Logging-Konsistenz**: Standardisierte Logging-Strategie über alle Speicheroperationen

## Logging und Fehlerbehandlung

Jede Storage-Methode folgt einem konsistenten Muster für Logging und Fehlerbehandlung:

1. Versuche die Operation auszuführen
2. Bei Erfolg logge detaillierte Debug-Informationen
3. Bei Fehlern fange die Exception, logge den Fehler und gib einen entsprechenden Standardwert zurück

Beispiel:

```typescript
async saveSession(sessionData: UserSessionData): Promise<boolean> {
  try {
    const success = await saveObject(STORAGE_KEY, sessionData);
    if (success) {
      logger.debug('Session gespeichert', {
        userId: sessionData.user.id,
        type: sessionData.user.type,
      });
    }
    return success;
  } catch (error) {
    logger.error('Fehler beim Speichern der Session',
      error instanceof Error ? error.message : String(error));
    return false;
  }
}
```

## Migration von der alten zur neuen Struktur

Die Migration vom alten zum neuen System wurde so gestaltet, dass bestehende Code, der den SessionService verwendet, unverändert weiterarbeiten kann. Die Änderungen sind ausschließlich interne Refaktorierungen, die die öffentliche API nicht beeinflussen.
