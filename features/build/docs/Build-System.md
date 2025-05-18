# Build-System der Solvbox App

Dieses Dokument beschreibt die Build-Struktur der Solvbox App und definiert die verschiedenen Build-Varianten, ihre Zwecke und Konfigurationen.

## Übersicht

Die App verwendet ein dreistufiges Build-System, mit der Option, später einen vierten Staging-Build hinzuzufügen:

1. **DevBuild** - Entwicklungsumgebung
2. **DemoBuild** - Demo-Umgebung mit Mock-Daten
3. **LiveBuild** - Produktionsversion mit Backend-Integration
4. _(Optional zukünftig)_ **StagingBuild** - Test-Umgebung mit Staging-Backend

## Build-Varianten

### 1. DevBuild

**Zweck:** Primäre Entwicklungsumgebung für Entwickler

**Eigenschaften:**

- Debug-Tools und Developer-Menüs aktiviert
- Flexibles Wechseln zwischen Demo- und Live-Modus möglich
- Keine Datenpersistenz zwischen App-Neustarts
- Für lokale Entwicklung und interne Tests

**Konfiguration:**

- Debug-Logging aktiviert
- Development-Server als Backend oder Mock-Daten
- Hot-Reload und andere Entwicklertools aktiv

### 2. DemoBuild

**Zweck:** App-Demonstration und Testing ohne Backend-Abhängigkeit

**Eigenschaften:**

- Ausschließliche Verwendung von Mock-Daten
- Kein echtes Backend erforderlich
- Demo-Modus als Standard
- Geeignet für App Store Reviews

**Konfiguration:**

- Mock-Daten vorinstalliert
- Demo-Benutzerkonten vorkonfiguriert (z.B. Alexander Becker)
- Eingeschränkte Debug-Informationen
- Optimierte Performance für Demonstration

### 3. LiveBuild

**Zweck:** Produktionsversion für Endbenutzer

**Eigenschaften:**

- Vollständige Backend-Integration
- Live-Modus als Standard für registrierte Benutzer
- Optimierte Performance und Sicherheit
- Produktionsreife App-Version

**Konfiguration:**

- Produktions-API-Endpunkte
- Keine Debug-Informationen
- Vollständige Funktionalität
- Test-Benutzerkonten für App Store Reviews

### 4. StagingBuild (zukünftige Option)

**Zweck:** Testen von Backend-Integrationen in produktionsähnlicher Umgebung

**Eigenschaften:**

- Verbindung zum Staging-Backend (nicht Produktion)
- Für QA und Integrationstests
- Test von Backend-Änderungen vor dem Release
- Verhält sich wie LiveBuild, aber mit Test-Daten

**Konfiguration:**

- Staging-API-Endpunkte
- Minimale Debug-Informationen
- Test-Benutzerkonten im Staging-Backend

## App-Modi und Build-Typen

Der DevBuild unterstützt zwei Hauptmodi, die mit den Build-Typen interagieren:

1. **DemoMode:**

   - Verwendet Mock-Daten
   - Ist Standard im DemoBuild
   - Verfügbar in DevBuild
   - Optional in LiveBuild

2. **LiveMode:**
   - Verwendet echte Backend-Daten
   - Ist Standard im LiveBuild für registrierte Benutzer
   - Verfügbar in DevBuild
   - Nicht verfügbar im DemoBuild

## Implementierungsrichtlinien

- **DevBuild:** Soll maximale Flexibilität für Entwickler bieten
- **DemoBuild:** Soll konsistente Demo-Erfahrung ohne Backend bieten
- **LiveBuild:** Soll optimierte Benutzerfahrung mit vollständiger Funktionalität bieten
- **StagingBuild:** Soll LiveBuild-Erfahrung mit Testdaten bieten

## Zukünftige Erweiterungen

Die Build-Struktur ist für künftige Erweiterungen konzipiert:

1. **StagingBuild** kann bei Bedarf eingeführt werden
2. Weitere spezialisierte Builds können für bestimmte Test-Szenarien hinzugefügt werden
3. Feature-Flags können pro Build konfiguriert werden

## Technische Umsetzung

Die unterschiedlichen Builds werden durch Umgebungsvariablen und Build-Konfigurationen gesteuert:

```typescript
// Beispiel für Build-abhängige Konfiguration
const API_ENDPOINTS = {
  dev: "http://localhost:3000",
  demo: "mock://", // Mock-API für Demo
  live: "https://api.solvbox.com",
  // Zukünftig:
  // staging: 'https://staging-api.solvbox.com'
};

const currentBuild = process.env.BUILD_TYPE || "dev";
const apiEndpoint = API_ENDPOINTS[currentBuild];
```
