# Solvbox App

[![ESLint](https://github.com/yourusername/solvbox-app/actions/workflows/eslint.yml/badge.svg)](https://github.com/yourusername/solvbox-app/actions/workflows/eslint.yml)
[![Architecture Check](https://github.com/yourusername/solvbox-app/actions/workflows/architecture-check.yml/badge.svg)](https://github.com/yourusername/solvbox-app/actions/workflows/architecture-check.yml)
[![CI](https://github.com/yourusername/solvbox-app/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/solvbox-app/actions/workflows/ci.yml)

## Über das Projekt

Solvbox ist eine mobile Anwendung, die Unternehmern und Selbstständigen hilft, ihre Geschäftsprozesse zu optimieren und effizient zu gestalten.

## 📜 Architektur-Guide

**WICHTIG**: Alle Entwickler müssen den [Architektur-Guide](./docs/architecture-guide.md) lesen und seinen Richtlinien folgen. Der Guide definiert die grundlegenden Architekturprinzipien und Implementierungsrichtlinien für das Projekt.

```bash
# Öffne den Architektur-Guide
npm run docs:open
```

Der Guide umfasst:

- Code-Stil und Export-Konventionen
- Komponenten-Architektur
- Zustand-Management
- App-Modi und Services-Schicht
- TypeScript und Props
- Automatische Code-Qualitätssicherung

## Entwicklungsumgebung einrichten

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm start

# Auf iOS ausführen
npm run ios

# Auf Android ausführen
npm run android
```

## Projektstruktur

```
solvbox-app/
  ├── app/                    # Expo Router App (Routing)
  ├── assets/                 # Statische Assets (Bilder, Fonts)
  ├── config/                 # App-Konfiguration
  ├── contexts/               # React Contexts
  ├── docs/                   # Dokumentation
  ├── features/               # Feature-Module
  │   ├── home/
  │   │   ├── components/     # Feature-spezifische Komponenten
  │   │   ├── hooks/          # Feature-spezifische Hooks
  │   │   ├── screens/        # Hauptbildschirme
  │   │   └── utils/          # Helper-Funktionen
  │   └── profile/
  │       └── ...
  ├── hooks/                  # Globale Hooks
  ├── i18n/                   # Internationalisierung
  ├── lib/                    # Bibliotheks-Konfigurationen
  ├── services/               # Services (API, Auth, etc.)
  ├── shared-components/      # Wiederverwendbare Komponenten
  └── stores/                 # Zustand Stores
      ├── actions/            # Store-Aktionen
      ├── selectors/          # Store-Selektoren
      ├── constants/          # Store-Konstanten
      └── types/              # Store-Typen
```

## Qualitätssicherung

```bash
# Vollständige Qualitätsprüfung (Type-Check, Lint und Tests)
npm run verify

# Type-Check durchführen
npm run type-check

# Lint-Prüfung durchführen
npm run lint

# Lint-Fehler automatisch beheben
npm run lint:fix

# Alle Tests ausführen
npm run test:all

# Code formatieren
npm run format

# Architektur-Richtlinien prüfen
npm run check-architecture
```

## CI/CD und Entwicklungs-Workflows

### Continuous Integration

Das Projekt verfügt über mehrere GitHub Workflows für Continuous Integration:

- **ESLint**: Überprüft den Code auf Qualität und Formatierung
- **Architecture Check**: Stellt sicher, dass die Architektur-Richtlinien eingehalten werden
- **CI**: Baut die App und führt Tests nach jedem Push und bei Pull Requests aus

### Release-Prozess

Um eine neue Version zu erstellen und zu veröffentlichen:

```bash
npm run release
```

Dieses interaktive Skript führt dich durch den Release-Prozess:

1. Wähle die Art des Releases (patch, minor, major)
2. Aktualisiert die Versionsnummern in package.json und app.json
3. Erstellt einen Git-Tag
4. Pusht die Änderungen (optional)

Nach dem Push des Tags wird der GitHub Workflow `build-and-deploy.yml` automatisch ausgeführt, der ein Release erstellt und die App veröffentlicht.

### Für neue Entwickler

Neues Projekt-Setup:

```bash
npm run setup
```

Dieses Skript richtet automatisch die Entwicklungsumgebung ein und prüft, ob alle Voraussetzungen erfüllt sind.

## Verfügbare Skripte

- `npm start` - Startet die Expo-Entwicklungsumgebung
- `npm run ios` - Startet die App im iOS-Simulator
- `npm run android` - Startet die App im Android-Emulator
- `npm run web` - Startet die Web-Version der App
- `npm run verify` - Führt Type-Check, Lint und Tests aus (vollständige Qualitätsprüfung)
- `npm run test` - Führt Tests im Watch-Modus aus
- `npm run test:all` - Führt alle Tests einmalig aus
- `npm run type-check` - Prüft TypeScript-Typen
- `npm run lint` - Prüft den Code mit ESLint
- `npm run lint:fix` - Behebt automatisch ESLint-Probleme
- `npm run format` - Formatiert den Code mit Prettier
- `npm run check-architecture` - Prüft, ob die Architektur-Richtlinien eingehalten werden
- `npm run docs` - Startet einen lokalen Server für die Projekt-Dokumentation
- `npm run docs:open` - Öffnet die Projekt-Dokumentation im Browser
- `npm run setup` - Richtet die Entwicklungsumgebung ein
- `npm run release` - Erstellt eine neue Version

## Beitragen

Bitte lies den [Architektur-Guide](./docs/architecture-guide.md) und folge unserem [Beitrags-Leitfaden](./.github/CONTRIBUTING.md), bevor du Änderungen einreichst.

## Lizenz

MIT © Solvbox

# Solvbox App - Refactoring Zyklischer Abhängigkeiten

## Übersicht der Änderungen

Dieses Refactoring hat die zyklischen Abhängigkeiten zwischen `appModeStore` und `userStore` durch folgende Maßnahmen aufgelöst:

### 1. Einführung eines zentralen EventBus

- `services/EventBus.ts` implementiert ein Publisher-Subscriber-Pattern für die entkoppelte Kommunikation zwischen Stores
- Ermöglicht eine robuste Kommunikation ohne direkte Abhängigkeiten
- Definiert typsichere Events und Event-Handler

### 2. Überarbeitung des AppModeService

- `services/AppModeService.ts` nutzt jetzt den EventBus statt direkter Store-Aufrufe
- Event-basierte Kommunikation ersetzt die direkte Abhängigkeit
- Legacy-Support für alte Aufrufe durch Adapter-Methoden

### 3. Neuer ModeService als zentrale Schnittstelle

- `services/ModeService.ts` kapselt alle Funktionen zur Verwaltung des App-Modus
- Nutzt direkt die Konfigurationsvariablen aus `config/app/env.ts`
- Schnittstelle zur Verfügung, ohne auf den appModeStore zugreifen zu müssen

### 4. Refactoring des userStore

- `stores/actions/userActions.ts` nutzt nun den EventBus statt direkter Store-Aufrufe
- Keine direkte Abhängigkeit mehr von appModeStore
- Legacy-Funktionen durch Mock-Implementierungen ersetzt

## Grundprinzipien

Die wichtigsten Prinzipien, die bei diesem Refactoring umgesetzt wurden:

1. **Separation of Concerns**: Logik, State-Management und UI sind strikt getrennt
2. **Klare Verantwortlichkeiten**: Jedes Modul hat genau eine Aufgabe
3. **Single Source of Truth**: App-Modus-Konfiguration ist zentral in `config/app/env.ts` definiert
4. **Kein Duplikatcode**: Gemeinsame Funktionalität wurde in Services ausgelagert
5. **KISS**: Vereinfachte Implementierungen mit klaren Schnittstellen

## Nächste Schritte

- Vollständige Migration von App-Modus-Funktionalität zu `APP_ENV`
- Weitere Reduktion von Service-Abhängigkeiten
- Vervollständigung der Adapter-Pattern-Implementierung für Auth-Services
- Schrittweise Entfernung von veralteten Funktionen

## Migration

Die Änderungen wurden so implementiert, dass bestehender Code weiterhin funktioniert, während neue Komponenten die verbesserte Architektur nutzen können.

## ModeService-Architektur

Die Mode-Logik wurde komplett überarbeitet und folgt jetzt einer klar strukturierten Architektur:

### Zentrale Komponenten

1. **ModeService (services/ModeService.ts)**

   - Implementiert als Singleton-Pattern
   - Zentraler Zugriffspunkt für alle Mode-Operationen
   - Event-basierte Kommunikation für Mode-Änderungen
   - Nur im DevBuild wird die vollständige Mode-Logik implementiert

2. **modeStore (stores/modeStore.ts)**

   - Zustand-Layer über dem ModeService
   - Typsicheres API für React-Komponenten
   - Persistiert relevante Mode-Informationen

3. **Hooks (hooks/useMode.ts, hooks/useModeManager.ts)**
   - useMode: Einfacher Hook für basis Mode-Operationen
   - useModeManager: Erweiterter Hook für komplexe Mode-Verwaltung

### Entfernte Legacy-Implementierungen

Im Rahmen der Bereinigung wurden folgende veraltete Dateien entfernt:

- `stores/DEPRECATED_appModeStore.ts`
- `stores/appModeStore.ts`
- `services/AppModeService.ts`

### Wichtiger Hinweis zur Implementierung

Die Mode-Logik wird NUR im DevBuild implementiert. Dabei spiegelt der Demo-Mode den DemoBuild wider und der Live-Mode den LiveBuild.

## Mode-Feature Migration

Das Mode-Feature wurde im Rahmen einer Refaktorierung in die neue Feature-basierte Architektur migriert:

- **Hooks**: `hooks/useMode.ts` → `features/mode/hooks/useMode.ts`
- **Services**: `services/ModeService.ts` → `features/mode/services/ModeService.ts`
- **Stores**: `stores/modeStore.ts` → `features/mode/stores/modeStore.ts`
- **Komponenten**: `features/auth/components/AppModeToggle.tsx` → `features/mode/components/AppModeToggle.tsx`

Für die Abwärtskompatibilität wurden Wrapper erstellt:

- `hooks/useMode.ts` (leitet weiter an den neuen Hook)
- `services/ModeServiceCompat.ts`
- `stores/modeStoreCompat.ts`

Neue Komponenten sollten direkt die Implementierungen aus dem Feature-Verzeichnis verwenden:

```typescript
// Alt (nicht mehr verwenden)
import { useMode } from "@/hooks";
import { useModeStore } from "@/stores";

// Neu
import { useMode } from "@/features/mode/hooks";
import { useModeStore } from "@/features/mode/stores";
```

Weitere Details findest du in der Feature-Dokumentation unter `/features/mode/README.md`.

## Build-System

Diese App unterstützt verschiedene Build-Typen (DevBuild, DemoBuild, LiveBuild).

Für Details zur Verwendung und Implementierung des Build-Systems siehe:

- [BUILD-ANLEITUNG.md](features/build/docs/BUILD-ANLEITUNG.md) - Wie man die App mit verschiedenen Build-Typen startet
- [BUILD-FEATURE.md](features/build/docs/BUILD-FEATURE.md) - Dokumentation des Build-Features
- [Build-System.md](features/build/docs/Build-System.md) - Konzeptionelle Beschreibung des Build-Systems
- [Build-System-Vorbereitung.md](features/build/docs/Build-System-Vorbereitung.md) - Implementierungsrichtlinien
