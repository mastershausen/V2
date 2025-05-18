# Implementierungsplan für die Mode-System Neustrukturierung

Dieser Plan beschreibt detailliert die einzelnen Schritte zur Umstrukturierung des Mode-Systems, um Redundanzen zu beseitigen und eine klarere, wartbarere Architektur zu schaffen.

## Phase 1: Vorbereitung und Infrastruktur

### 1.1 Zentrale Typdefinitionen erstellen

- **Datei:** `features/mode/types.ts`
- **Aufgaben:**
  - Neue Typdefinitionen für `AppMode` und `UserStatus` erstellen
  - Fehlertypen und Event-Typen konsolidieren
  - Einheitliche Strukturen für Events und Responses definieren

### 1.2 Testinfrastruktur vorbereiten

- **Dateien:** `features/mode/__tests__/setup.ts`, `features/mode/__tests__/mocks.ts`
- **Aufgaben:**
  - Mock-Implementierungen für den Mode-Service erstellen
  - Test-Utilities für häufige Testszenarien implementieren
  - Grundlegende Test-Fixtures definieren

### 1.3 Migrationshilfen erstellen

- **Datei:** `features/mode/utils/migration.ts`
- **Aufgaben:**
  - Hilfsfunktionen zum Konvertieren alter Zustände in neue Struktur
  - Logging-Utilities für Kompatibilitätsprobleme
  - Temporäre Adapter für Übergangsphase

## Phase 2: Kernkomponenten implementieren

### 2.1 Vereinfachter Mode-Store

- **Datei:** `features/mode/stores/modeStore.ts`
- **Aufgaben:**
  - Minimale Store-Struktur mit nur `appMode` und `userStatus` implementieren
  - Alle redundanten Selektoren und Zustände entfernen
  - Event-Handling für Statusänderungen vereinfachen
  - Persist-Middleware für Zustandsspeicherung konfigurieren
  - Keine berechneten Werte im Store speichern

### 2.2 Zentraler App-Mode Hook

- **Datei:** `features/mode/hooks/useAppMode.ts`
- **Aufgaben:**
  - Einheitlichen Hook für alle Mode-bezogenen Operationen implementieren
  - Redundante Hooks (`useMode` und `useModeManager`) konsolidieren
  - Berechnete Werte im Hook statt im Store implementieren
  - Klare Trennung zwischen primitiven und abgeleiteten Werten
  - Einheitliche Schnittstelle für alle Mode-Operationen schaffen

### 2.3 Netzwerk- und Session-Integration

- **Datei:** `features/mode/hooks/useAppMode.ts`
- **Aufgaben:**
  - Integration von Netzwerk- und Session-Status in den Hook
  - Parametrisierte Funktion für Modus-Wechsel-Validierung
  - Verbesserte Fehlerbehandlung für Modus-Operationen

## Phase 3: Unterstützende Komponenten

### 3.1 Mode-Indikatoren und UI-Komponenten

- **Datei:** `features/mode/components/AppModeIndicator.tsx`
- **Aufgaben:**
  - Vereinfachte UI-Komponenten basierend auf dem neuen Hook
  - Verbesserte Theming-Integration
  - Bessere Barrierefreiheit

### 3.2 Mode-Hilfsfunktionen

- **Datei:** `features/mode/utils/modeHelpers.ts`
- **Aufgaben:**
  - Zentrale Hilfsfunktionen für häufige Mode-Operationen
  - Typsichere Utilities für Mode-Überprüfungen
  - Performance-optimierte Funktionen für Komponenten

## Phase 4: Migration und Integration

### 4.1 Kompatibilitätsschicht

- **Datei:** `features/mode/compat/legacyHooks.ts`
- **Aufgaben:**
  - Vorübergehende Hook-Implementierung für Legacy-Code
  - Ausgabe von Deprecation-Warnungen
  - Automatisches Mapping zwischen alten und neuen Strukturen

### 4.2 Beispiel-Migration

- **Datei:** `docs/examples/mode-migration.md`
- **Aufgaben:**
  - Detaillierte Beispiele für die Migration verschiedener Komponenten
  - Vorher/Nachher-Vergleiche für typische Anwendungsfälle
  - Best Practices für die Migration

### 4.3 Core-Komponenten anpassen

- **Aufgaben:**
  - Wichtigste Komponenten auf den neuen Hook umstellen
  - Komplexere Funktionalität wie Auth-Integration anpassen
  - Tests aktualisieren, um neue Struktur zu reflektieren

## Phase 5: Bereinigung und Dokumentation

### 5.1 Alte Dateien entfernen

- **Aufgaben:**
  - Veraltete Hooks und Stores entfernen
  - Überflüssige Kompatibilitätsschichten bereinigen
  - Unnötige Re-Exports löschen

### 5.2 Dokumentation vervollständigen

- **Dateien:** `features/mode/README.md`, `features/mode/docs/*.md`
- **Aufgaben:**
  - Aktuelle Architektur dokumentieren
  - API-Referenz erstellen
  - Beispiele für typische Anwendungsfälle hinzufügen

### 5.3 Finale Tests

- **Aufgaben:**
  - Umfassende Tests für alle Komponenten und ihre Interaktionen
  - Edge Cases und Fehlerbedingungen testen
  - Performance-Messungen durchführen

## Implementierungsreihenfolge

Um die Migration so reibungslos wie möglich zu gestalten, sollte die Implementierung in dieser Reihenfolge erfolgen:

1. Typdefinitionen und Testinfrastruktur
2. Vereinfachter Store ohne Änderung der öffentlichen API
3. Neuer Hook mit vollständiger Funktionalität
4. Kompatibilitätsschicht für bestehenden Code
5. Beispiel-Migration zur Validierung des Ansatzes
6. Schrittweise Migration wichtiger Komponenten
7. Dokumentation und Bereinigung

## Erfolgskriterien

Die Neustrukturierung gilt als erfolgreich, wenn:

1. **Redundanzen eliminiert** sind - keine doppelten Zustände oder Funktionen
2. **Leistung verbessert** ist - weniger Re-Renderings, optimierte Berechnungen
3. **Codebase reduziert** ist - weniger Zeilen Code für die gleiche Funktionalität
4. **Typsicherheit erhöht** ist - präzisere Typdeklarationen, weniger Cast-Operationen
5. **Wartbarkeit verbessert** ist - klarere Konzepte, konsistente Namensgebung
