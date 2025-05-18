# Solvbox App - Dokumentation

Willkommen zur Dokumentation der Solvbox App. In diesem Verzeichnis finden Sie alle wichtigen Dokumente zur Architektur, Entwicklung und Verwendung der App.

## Goldstandard

Die [Goldstandard-Dokumentation](./GOLDSTANDARD.md) ist das **verbindliche Referenzdokument** für die Entwicklung neuer Features und die Refaktorierung bestehender Code-Bereiche.

Der Goldstandard veranschaulicht anhand des **MySolvboxScreen-Beispiels** die folgenden Kernprinzipien der Solvbox-Architektur:

1. **Trennung von UI und Logik**: Reine UI-Komponenten ohne eigene Geschäftslogik
2. **Zentralisierung von Konfigurationen**: Konstanten und Konfigurationen in zentralen Dateien
3. **Typsicherheit durch TypeScript**: Stringente Typisierung ohne Verwendung von `any`
4. **Einheitliche Hook-Architektur**: Komposition von Basis-Hooks für Feature-Hooks
5. **Modularisierter Store-Aufbau**: Trennung von Zustand, Aktionen und Typen

## Ergänzende Dokumentation

Die folgenden Dokumente bieten zusätzliche Informationen zu spezifischen Aspekten der Architektur:

- [Code-Style-Guide](./code-style-guide.md) - Richtlinien für Code-Formatierung und -Stil
- [Store-Architektur](./store-architecture.md) - Detaillierte Beschreibung der Store-Architektur
- [Testing](./testing.md) - Teststrategie und Best Practices
- [Styling-Guidelines](./styling-guidelines.md) - Richtlinien für konsistentes Styling

## Integration in den Entwicklungsprozess

Die Goldstandard-Prinzipien sind auf mehreren Ebenen in den Entwicklungsprozess integriert:

1. **ESLint-Regeln**: Viele Richtlinien werden durch ESLint erzwungen
2. **VS Code-Snippets**: Vordefinierte Snippets für Komponenten, Hooks, etc.
3. **Pre-commit-Hooks**: Automatische Überprüfung der Richtlinien vor Commits
4. **Code Reviews**: Teil der Checkliste für Code-Reviews

## Einstieg für neue Entwickler

1. Lesen Sie die [Goldstandard-Dokumentation](./GOLDSTANDARD.md) vollständig durch
2. Analysieren Sie den `MySolvboxScreen` als Referenzimplementierung
3. Installieren Sie die empfohlenen VS Code-Erweiterungen
4. Machen Sie sich mit den ESLint-Regeln und VS Code-Snippets vertraut

## Aktualisierung der Dokumentation

Die Dokumentation sollte regelmäßig aktualisiert werden, um neue Erkenntnisse und Best Practices zu integrieren. Bei der Aktualisierung sollte der Fokus auf **Klarheit, Kürze und Relevanz** liegen.
