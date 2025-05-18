# Build System Dokumentation

Dieses Verzeichnis enthält die Dokumentation für das Build-System der App.

## Verfügbare Dokumentationen

- [BUILD-ANLEITUNG.md](./BUILD-ANLEITUNG.md) - Beschreibt, wie die App mit verschiedenen Build-Typen gestartet wird (für Benutzer).
- [BUILD-FEATURE.md](./BUILD-FEATURE.md) - Technische Dokumentation des Build-Features (für Entwickler).
- [Build-System.md](./Build-System.md) - Allgemeine Beschreibung des Build-Systems und seiner Varianten.
- [Build-System-Vorbereitung.md](./Build-System-Vorbereitung.md) - Richtlinien und Checkliste für die Implementierung des Build-Systems.

## Was sind Build-Typen?

Build-Typen sind verschiedene Konfigurationen, mit denen die App gebaut und ausgeführt werden kann. Sie bestimmen das Verhalten, die Funktionen und die Umgebung der App.

Die wichtigsten Build-Typen sind:

- **DevBuild** - Für Entwicklung und Testing, mit Debug-Tools
- **DemoBuild** - Für Demonstrationen ohne echtes Backend
- **LiveBuild** - Für produktiven Einsatz mit Backend-Integration
- **StagingBuild** - (optional) Für Tests in einer produktionsnahen Umgebung

## Dokumentationsstruktur

- **BUILD-ANLEITUNG.md** - *Benutzerorientiert:* Praktische Anleitung zum Starten der App mit verschiedenen Build-Typen
- **BUILD-FEATURE.md** - *Entwicklerorientiert:* Technische Dokumentation des Build-Features und seiner Implementierung
- **Build-System.md** - *Konzeptionell:* Beschreibt das Konzept und den Aufbau des gesamten Build-Systems
- **Build-System-Vorbereitung.md** - *Prozessorientiert:* Bietet eine Checkliste für die Implementierung

## Weitere Informationen

Weitere Informationen zum Build-System findest du in den oben verlinkten Dokumenten. 