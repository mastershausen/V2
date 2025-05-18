# Pull Request

## Beschreibung
<!-- Beschreibe die Änderungen, die in diesem Pull Request vorgenommen wurden -->

## Typ der Änderung
<!-- Bitte markiere die zutreffenden Optionen -->

- [ ] Bug-Fix (non-breaking change)
- [ ] Neue Funktion (non-breaking change)
- [ ] Breaking Change
- [ ] Dokumentation aktualisiert
- [ ] Andere: <!-- bitte spezifizieren -->

## Wie wurde getestet?
<!-- Beschreibe die Tests, die du durchgeführt hast -->

## Architektur-Guide Checkliste
<!-- Bitte überprüfe, ob deine Änderungen den Richtlinien im Architektur-Guide entsprechen -->

### Code-Stil
- [ ] Screens verwenden Default-Export mit Funktionsdeklaration
- [ ] Komponenten verwenden Named-Export mit Funktionsdeklaration
- [ ] Hooks und Utility-Funktionen verwenden Named-Export
- [ ] JSDoc-Kommentare für öffentliche Funktionen vorhanden
- [ ] Import-Reihenfolge entspricht den Richtlinien

### Komponenten
- [ ] Klare Trennung von Logik und Darstellung
- [ ] Business-Logik in Custom Hooks ausgelagert
- [ ] Styles am Ende der Komponentendatei definiert
- [ ] Komponenten greifen nicht direkt auf Stores zu

### Store
- [ ] Aktionen in `actions/`-Verzeichnis definiert
- [ ] Selektoren in `selectors/`-Verzeichnis definiert
- [ ] Typen in `types/`-Verzeichnis definiert
- [ ] Store-Zugriffslogik in Custom Hooks gekapselt

### App-Modi
- [ ] Verwendet Hilfsfunktionen statt direktem Zugriff auf Modi-Variablen
- [ ] Bei API-Anfragen wird `shouldUseMockData()` verwendet
- [ ] Mock-Funktionalität klar gekennzeichnet

### Sonstiges
- [ ] ESLint-Fehler behoben
- [ ] Alle Tests laufen erfolgreich
- [ ] `npm run check-architecture` gibt keine Fehler aus

## Screenshots/Aufnahmen
<!-- Falls relevant, füge Screenshots oder Aufnahmen hinzu -->

## Zusätzliche Kontext-Informationen
<!-- Füge weitere Kontext-Informationen hinzu, falls notwendig -->

## Reviewer-Checkliste
<!-- Für Reviewer: Bitte stellen Sie sicher, dass die folgenden Punkte überprüft wurden -->

- [ ] Der Code entspricht dem Architektur-Guide
- [ ] Der Code ist gut dokumentiert
- [ ] Die Änderungen sind verständlich und nachvollziehbar
- [ ] Die Tests decken die Änderungen ab 