# Build-System-Vorbereitung

> **Hinweis:** Diese Anleitung ist eine Ergänzung zu [Build-System.md](./Build-System.md) und soll als Richtlinie für die Entwicklung und Refaktorierung im Rahmen der Build-System-Implementierung dienen. Alle Aktivitäten sollen im Einklang mit dem [GOLDSTANDARD.md](/docs/GOLDSTANDARD.md) stehen.

## Grundlegende Prinzipien

Bei der Implementierung des dreistufigen Build-Systems (DevBuild, DemoBuild, LiveBuild) gelten folgende Grundprinzipien:

1. **Funktionalität hat Vorrang** vor architektonischer Perfektion
2. **Pragmatismus ist wichtiger** als akademische Reinheit
3. **Lesbarkeit und Wartbarkeit** sind entscheidend
4. **Inkrementelle Verbesserungen** sind besser als keine Verbesserungen

## Schrittweise Vorgehensweise

Entsprechend dem Goldstandard und dem festgelegten Build-System fokussieren wir uns auf eine schrittweise Implementierung:

1. **Zuerst DevBuild perfektionieren**
2. **Anschließend DemoBuild erstellen**
3. **Zuletzt LiveBuild implementieren**

## Checkliste für Entwicklung und Refaktorierung

### 1. Zentrale Konfiguration erstellen

- [ ] Konfigurationsdatei für BuildType und AppMode erstellen
- [ ] API-Endpunkte je Build-Typ definieren
- [ ] Feature-Flags nach Build-Typ strukturieren
- [ ] Umgebungsvariablen-Handling implementieren

```typescript
// Beispiel für Struktur (nicht implementieren)
const CONFIG = {
  buildTypes: {
    dev: {
      /* ... */
    },
    demo: {
      /* ... */
    },
    live: {
      /* ... */
    },
  },
};
```

### 2. Saubere Trennung von UI und Logik

- [ ] Hooks müssen build-unabhängig funktionieren
- [ ] Build-spezifische Logik in separaten Utilities isolieren
- [ ] Komponenten sollten keine direkten Build-Abhängigkeiten haben

### 3. Mode-System anpassen

- [ ] useAppMode Hook mit Build-Typ-Erkennung erweitern
- [ ] Wechsel zwischen Modi entsprechend Build-Typ einschränken
- [ ] Demo-Modus als Standard im DemoBuild konfigurieren
- [ ] Live-Modus als Standard für registrierte Benutzer im LiveBuild

### 4. Auth-System Integration

- [ ] SessionService mit Build-Typ-Bewusstsein erweitern
- [ ] Login-Logik für verschiedene Builds optimieren
- [ ] Session-Persistenz je nach Build-Typ steuern
- [ ] Mock-Benutzer zentral definieren

### 5. Feature-Flag-System

- [ ] System zur Steuerung von Features je nach Build-Typ
- [ ] Debug-Tools nur im DevBuild aktivieren
- [ ] Demo-Features in DemoBuild standardmäßig aktivieren
- [ ] Produktionsoptimierungen für LiveBuild

### 6. Testen

- [ ] Skripte zum Starten verschiedener Build-Typen
- [ ] Automatische Tests für build-spezifisches Verhalten
- [ ] Manuelles Testprotokoll für kritische Funktionen

## Best Practices im Einklang mit dem Goldstandard

### Typsicherheit

```typescript
// Beispiel (nicht implementieren)
export type BuildType = "dev" | "demo" | "live" | "staging";
export type AppMode = "demo" | "live";

// Typsichere Prüfung
export function isValidBuildType(type: string): type is BuildType {
  return ["dev", "demo", "live", "staging"].includes(type);
}
```

### Hook-Architektur

- Nutze Basis-Hooks wie im Goldstandard beschrieben
- Erweitere diese für build-spezifische Funktionalität
- Stelle eine einheitliche API für alle Komponenten bereit

### Konfigurationsmanagement

- Zentralisierte Konfigurationen nach Goldstandard-Prinzipien
- Build-Typ als Teil der Konfigurationsstruktur
- Klare Trennung zwischen Build-Konfiguration und Feature-Konfiguration

### Store-Integration

- Store-Aktionen mit build-spezifischer Logik erweitern
- Selektive Persistenz je nach Build-Typ konfigurieren
- Fehlerbehandlung entsprechend Build-Typ optimieren

## ROI-basierte Prioritäten

Im Einklang mit dem pragmatischen Ansatz des Goldstandards priorisieren wir:

1. **Hoher ROI (sofort umsetzen):**

   - Grundstruktur für Build-Typen
   - Mode-System-Integration
   - Auth-System-Anpassungen

2. **Mittlerer ROI (nach Kernfunktionen):**

   - Feature-Flags je Build-Typ
   - Build-spezifische UX-Optimierungen
   - Erweiterte Konfigurationsoptionen

3. **Niedriger ROI (später oder optional):**
   - Umfassende Automatisierungspipeline
   - Build-spezifische Animationen
   - Spezialfeatures für einzelne Builds

## Fazit

Die Build-System-Implementierung soll einen praktischen Mehrwert bieten und die Entwicklung beschleunigen, nicht verkomplizieren. Der Fokus liegt auf einem pragmatischen Ansatz, der Funktionalität über Perfektion stellt.

Bei allen Entwicklungs- und Refaktorierungsaktivitäten gilt:

> "Schätze deine Zeit und die deiner Kollegen – architektonische Entscheidungen sollten immer darauf abzielen, die Entwicklung zu beschleunigen und zu vereinfachen, nicht zu verkomplizieren."
