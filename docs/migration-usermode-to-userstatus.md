# Migration von UserMode zu UserStatus

Dieses Dokument beschreibt die vollständige Migration von `UserMode` zu `UserStatus` im gesamten Codebase, einschließlich der Entfernung der Kompatibilitätsschicht.

## Überblick

Die Migration umfasste die folgenden Hauptziele:

1. Konsistente Terminologie im gesamten Code etablieren
2. Veraltete Kompatibilitätsschichten entfernen
3. Direkten Zugriff auf den Store anstelle von Service-Klassen fördern
4. Die Codebasis für zukünftige Entwicklungen bereinigen

## Abgeschlossene Migrationsschritte

### 1. Umbenennungen

- `UserMode` wurde zu `UserStatus` geändert
- `userMode` wurde zu `userStatus` geändert
- `getUserMode` wurde zu `getUserStatus` geändert
- `setUserMode` wurde zu `setUserStatus` geändert
- `savedRealSession` wurde zu `savedAuthenticatedSession` geändert

### 2. Entfernung der Kompatibilitätsschicht

Folgende Dateien wurden entfernt:

- `features/mode/compat/new/legacyHooks.ts`
- `services/EventBus.ts`
- `services/ModeService.ts` (ersetzt durch direkten Zugriff auf `modeStore`)

### 3. Anpassung der Hauptkomponenten

Die folgenden Komponenten und Funktionen wurden aktualisiert:

- `stores/utils/profileUtils.ts` - Aktualisierung aller Referenzen zu `userMode` zu `userStatus`
- `features/settings/screens/DebugSettingsScreen.tsx` - Aktualisierung der Referenzen
- `docs/store-architecture.md` - Aktualisierung der Dokumentation zur neuen Terminologie
- `jest.setup.ts` - Anpassung der Test-Mocks an die neue Struktur

## Offene Punkte

### 1. Test-Dateien

Die folgenden Testdateien erfordern noch weitere Anpassungen, um mit der neuen Struktur vollständig kompatibel zu sein:

- `services/__tests__/ModeService.test.ts`
- `services/__tests__/ModeService.integration.test.ts`
- `stores/__tests__/modeStore.integration.test.ts`
- `features/mode/__tests__/stores/modeStore.test.ts`

Diese Tests verursachen derzeit Linter-Fehler aufgrund von Problemen mit der Import-Pfad-Auflösung. Sie erfordern eine umfassendere Überarbeitung, da sie noch auf dem alten ModeService-Muster basieren. Diese Anpassung sollte als separates Refactoring-Ticket behandelt werden.

### 2. Pfadauflösung

Bei der Aktualisierung der Testdateien wurden Probleme mit der Auflösung von Import-Pfaden festgestellt. Die folgenden Importe konnten vom Linter nicht aufgelöst werden, obwohl sie korrekt funktionieren:

- `@/features/mode/stores/modeStore`
- `@/features/mode/types`
- `@/types/common/appMode`

Dies deutet auf ein tieferliegendes Problem mit der ESLint-Konfiguration hin, das ebenfalls in einem separaten Ticket behoben werden sollte.

## Neue Architektur

Die Migration verlagert die Verantwortung vom `ModeService` zum `modeStore`:

**Alt (vor der Migration):**

```
Components/Hooks -> ModeService -> modeStore
```

**Neu (nach der Migration):**

```
Components/Hooks -> modeStore (direkt)
```

## Vorteile der neuen Struktur

1. **Einfachheit**: Direkte Store-Zugriffe ohne zusätzliche Service-Layer
2. **Konsistenz**: Einheitliche Terminologie (`UserStatus`) im gesamten Code
3. **Wartbarkeit**: Weniger Code durch Entfernung der Kompatibilitätsschicht
4. **Leistung**: Weniger Wrapper und Indirektionen

## Zukünftige Arbeiten

Obwohl die Hauptmigration abgeschlossen ist, gibt es noch einige Bereiche für mögliche Verbesserungen:

1. **Test-Überarbeitung**: Vollständige Neufassung der Test-Dateien, um sie mit der neuen Struktur kompatibel zu machen
2. **Linter-Konfiguration**: Behebung der Probleme mit der Import-Pfad-Auflösung
3. **Weitere Dokumentation**: Weitere Verbesserung der Dokumentation, insbesondere bei neuen Features
4. **Performance-Monitoring**: Überwachung der Performance-Verbesserungen durch die vereinfachte Architektur

## Lessons Learned

1. **Kompatibilitätsschichten**: Die Einführung von Kompatibilitätsschichten ist nützlich für schrittweise Migrationen, sollte jedoch immer als temporäre Lösung betrachtet werden
2. **Konsistente Terminologie**: Eine konsistente Terminologie ist entscheidend für die langfristige Wartbarkeit des Codes
3. **Direkter Store-Zugriff**: Direkter Zugriff auf Stores reduziert die Komplexität und verbessert die Nachvollziehbarkeit des Codes
4. **Test-First-Ansatz**: Für umfangreiche Migrations-/Refactoring-Aufgaben sollten die Tests zuerst angepasst werden, um die neue Struktur zu validieren
5. **Linter-Konfiguration**: Eine korrekt konfigurierte Linter-Umgebung ist entscheidend für die Codequalität
