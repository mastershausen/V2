# Issue: Zyklische Abhängigkeiten im ESLint-Resolver

## Problem

Bei der Ausführung von ESLint über Husky/lint-staged treten Fehler auf, die auf zyklische Abhängigkeiten im ESLint-Import-Resolver hinweisen. Diese Fehler blockieren die Commit-Prozesse und beeinträchtigen den normalen Entwicklungs-Workflow.

## Fehlermeldung

```
Resolve error: Error [ERR_REQUIRE_CYCLE_MODULE]: Cannot require() ES Module /Users/saschaschneiders/Documents/solvbox-app/Frontend9/node_modules/eslint-import-resolver-typescript/lib/index.js in a cycle. (from /Users/saschaschneiders/Documents/solvbox-app/Frontend9/node_modules/eslint-module-utils/resolve.js)
```

## Kontext

Das Problem trat beim Versuch auf, Code-Änderungen zu committen, die die AppMode-Typdefinitionen im Projekt vereinheitlichten. Die eigentlichen Code-Änderungen waren fehlerfrei, aber die ESLint-Konfiguration verhinderte den Commit aufgrund interner Resolver-Probleme.

## Betroffene Komponenten

- ESLint-Konfiguration
- eslint-import-resolver-typescript
- Husky Pre-Commit-Hook
- lint-staged-Konfiguration

## Mögliche Ursachen

1. Veraltete oder inkompatible Versionen von ESLint und seinen Plugins
2. Konflikte zwischen ESLint-Plugins und TypeScript-Konfiguration
3. Zyklische Abhängigkeiten in der Import-Struktur der Konfigurationsdateien
4. Fehlerhafte Konfiguration von Alias-Pfaden (@/-Präfixe)

## Reproduktion

1. Code-Änderungen an TypeScript-Dateien vornehmen
2. Git-Commit ausführen
3. Pre-Commit-Hook führt ESLint auf geänderte Dateien aus
4. Fehler mit zyklischen Abhängigkeiten werden angezeigt

## Temporäre Workarounds

Folgende temporäre Lösungen können angewendet werden:

1. Temporäres Deaktivieren der ESLint-Prüfung in der `.lintstagedrc.cjs`
2. Gezieltes Ignorieren bestimmter Import-Regeln für problematische Dateien

## Empfohlene Lösungsansätze

1. Update aller ESLint-Abhängigkeiten auf die neuesten kompatiblen Versionen
2. Überprüfung und Bereinigung der ESLint-Konfiguration
3. Überprüfung der tsconfig.json auf korrekte Pfad-Aliase
4. Ggf. Wechsel zu einem alternativen Import-Resolver

## Priorität

**Mittel** - Das Problem ist störend für den Entwicklungs-Workflow, blockiert aber nicht vollständig die Produktivität, da temporäre Workarounds existieren.

## Zugewiesen an

Noch nicht zugewiesen

## Status

Offen

## Erstellt am

`2023-12-18`
