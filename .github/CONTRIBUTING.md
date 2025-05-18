# Beitragsrichtlinien

Vielen Dank für dein Interesse, zur Solvbox App beizutragen! Dieses Dokument enthält wichtige Informationen, die dir helfen, deinen Beitrag effektiv zu gestalten.

## Architektur-Guide

**Wichtiger Hinweis:** Bevor du Änderungen vornimmst, lies unbedingt den [Architektur-Guide](../docs/architecture-guide.md). Dieser Guide definiert die Grundprinzipien und Richtlinien für die Entwicklung der Solvbox App.

Alle eingereichten Pull Requests werden auf Einhaltung dieser Richtlinien überprüft.

## Arbeitsablauf für Beiträge

1. **Fork das Repository** und klone es lokal.
2. **Erstelle einen Feature-Branch** basierend auf dem aktuellen `develop`-Branch.
3. **Implementiere deine Änderungen** gemäß dem Architektur-Guide.
4. **Führe Tests durch**, um sicherzustellen, dass deine Änderungen korrekt funktionieren.
5. **Führe Qualitätsprüfungen durch**:
   ```bash
   npm run lint
   npm run format
   npm run check-architecture
   ```
6. **Commit deine Änderungen** mit aussagekräftigen Commit-Nachrichten.
7. **Push deinen Branch** zum Fork-Repository.
8. **Erstelle einen Pull Request** gegen den `develop`-Branch des Haupt-Repositories.

## Pull Request Richtlinien

- Stelle sicher, dass dein PR nur eine Sache tut (z.B. eine Funktion hinzufügen oder einen Bug beheben).
- Verwende die PR-Vorlage und fülle alle relevanten Felder aus.
- Überprüfe die Checkliste in der PR-Vorlage, um sicherzustellen, dass dein Code den Richtlinien entspricht.
- Füge Tests für neue Funktionen hinzu oder aktualisiere bestehende Tests.
- PRs werden nur akzeptiert, wenn alle CI-Checks bestanden werden.

## Entwicklungsrichtlinien

### Codeformatierung

- Wir verwenden Prettier und ESLint, um eine einheitliche Codeformatierung zu gewährleisten.
- Du kannst die automatische Formatierung wie folgt ausführen:
  ```bash
  npm run format
  ```

### Tests

- Für alle neuen Funktionen sollten Tests hinzugefügt werden.
- Achte darauf, dass bestehende Tests nach deinen Änderungen weiterhin bestehen.
- Tests können wie folgt ausgeführt werden:
  ```bash
  npm test
  ```

### Komponentenrichtlinien

- Achte auf die korrekte Verzeichnisstruktur für deine Komponenten:
  - Bildschirme (Screens) in `features/*/screens/`
  - Wiederverwendbare Feature-Komponenten in `features/*/components/`
  - Globale wiederverwendbare Komponenten in `shared-components/`

- Verwende die richtige Export-Stil-Konvention:
  - Bildschirme: Default-Export mit Funktionsdeklaration
  - Komponenten: Named-Export mit Funktionsdeklaration
  - Hooks und Utility-Funktionen: Named-Export

### Store und Zustandsmanagement

- Neue Aktionen sollten in den entsprechenden Dateien in `stores/actions/` definiert werden.
- Selektoren sollten in `stores/selectors/` definiert werden.
- Typen sollten in `stores/types/` definiert werden.
- Vermeide direkte Store-Zugriffe in Komponenten, nutze stattdessen Custom Hooks.

## Feedback und Fragen

Wenn du Feedback oder Fragen hast, kannst du:
- Ein Issue im Repository erstellen
- Einen Kommentar in deinem Pull Request hinzufügen
- Dich an das Entwicklerteam wenden

Vielen Dank für deinen Beitrag! 🙏 