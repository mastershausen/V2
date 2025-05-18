# Jira-Ticket: ESLint-Konfiguration für Import-Pfad-Auflösung verbessern

## Titel

ESLint-Konfiguration für Import-Pfad-Auflösung verbessern

## Typ

Task (Technik-Schuld)

## Priorität

Hoch

## Story Points

3

## Beschreibung

Bei der Migration von `UserMode` zu `UserStatus` wurden Probleme mit der ESLint-Konfiguration für die Auflösung von Import-Pfaden festgestellt. Diese verhindern das erfolgreiche Durchführen der Linter-Prüfungen bei bestimmten Imports, obwohl die Imports selbst funktionsfähig sind.

Das Problem tritt hauptsächlich bei der Verwendung von Alias-Pfaden wie `@/features/...` auf und betrifft insbesondere die Test-Dateien.

## Zu erledigende Aufgaben

- [ ] Analysieren der aktuellen ESLint-Konfiguration in `.eslintrc.cjs` und `tsconfig.eslint.json`
- [ ] Überprüfen der TypeScript-Pfadkonfiguration in `tsconfig.json`
- [ ] Identifizieren und Beheben von Inkonsistenzen in den Konfigurationen
- [ ] Testen der Konfiguration mit problematischen Import-Pfaden, insbesondere:
  - `@/features/mode/stores/modeStore`
  - `@/features/mode/types`
  - `@/types/common/appMode`
- [ ] Dokumentieren der vorgenommenen Änderungen

## Abhängigkeiten

- Keine

## Akzeptanzkriterien

- ESLint erkennt alle Import-Pfade korrekt
- `npm run lint` läuft ohne Fehler aufgrund nicht aufgelöster Imports
- Import-Pfade mit `@/`-Aliases funktionieren in allen Dateitypen (TS, TSX, Tests)
- Die Änderungen beeinträchtigen keine bestehenden, funktionierenden Imports

## Technische Details

Die folgenden Dateien sind relevant:

- `.eslintrc.cjs` - ESLint-Hauptkonfiguration
- `tsconfig.json` - TypeScript-Konfiguration mit Pfad-Aliassen
- `tsconfig.eslint.json` - ESLint-spezifische TypeScript-Konfiguration

Mögliche Ursachen:

1. Pfade werden durch ESLint nicht korrekt aufgelöst, aber durch TypeScript
2. Plugin `eslint-import-resolver-typescript` ist nicht korrekt konfiguriert
3. Inkonsistenzen zwischen den verschiedenen Konfigurationsdateien

## Dokumentation

- Dokumentieren Sie alle vorgenommenen Änderungen
- Aktualisieren Sie bei Bedarf die Entwicklerdokumentation zur Verwendung von Import-Pfaden
