# Jira-Ticket: Test-Refactoring für Mode-Feature nach UserMode zu UserStatus Migration

## Titel

Test-Dateien des Mode-Features an neue UserStatus-Struktur anpassen

## Typ

Task (Refactoring)

## Priorität

Medium

## Story Points

5

## Beschreibung

Nach der erfolgreichen Migration von `UserMode` zu `UserStatus` und der Entfernung der Kompatibilitätsschicht müssen die verbliebenen Testdateien an die neue Struktur angepasst werden.

Die Hauptanwendung verwendet bereits durchgängig den neuen `modeStore` direkt, aber die Tests verwenden noch teilweise das alte `ModeService`-Muster und haben Probleme mit der Import-Pfad-Auflösung.

## Zu erledigende Aufgaben

- [ ] Überprüfen und korrigieren der Import-Pfade in folgenden Dateien:
  - `services/__tests__/ModeService.test.ts`
  - `services/__tests__/ModeService.integration.test.ts`
  - `stores/__tests__/modeStore.integration.test.ts`
  - `features/mode/__tests__/stores/modeStore.test.ts`
- [ ] Überarbeiten der Tests, um die neue API-Struktur zu verwenden
- [ ] Beheben von Linter-Warnungen
- [ ] Testen, ob alle Tests durchlaufen
- [ ] Dokumentation in `features/mode/README.md` aktualisieren, um den Abschluss der Migration zu notieren

## Abhängigkeiten

- Abgeschlossene Migration von UserMode zu UserStatus (bereits erledigt)

## Akzeptanzkriterien

- Alle Tests laufen erfolgreich durch
- Keine Linter-Warnungen in den Test-Dateien
- Tests verwenden die neue Store-Struktur direkt
- Keine Verweise mehr auf `ModeService` in den Tests
- Dokumentation aktualisiert

## Technische Details

Die Migration hat bereits folgende Änderungen vorgenommen:

- UserMode -> UserStatus
- userMode -> userStatus
- ModeService entfernt, direkter Zugriff auf modeStore
- Kompatibilitätsschicht entfernt

Die Tests müssen entsprechend angepasst werden. Bei der Import-Pfad-Auflösung ist besondere Sorgfalt geboten, da hier Probleme mit der ESLint-Konfiguration auftreten können.

## Dokumentation

Siehe auch:

- `docs/migration-usermode-to-userstatus.md`
- `features/mode/README.md`
