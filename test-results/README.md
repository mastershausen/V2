# ProfileImage Komponente Tests

Dieses Verzeichnis enthält Tests und Testpläne für die Überprüfung der ProfileImage-Komponente, die als Ersatz für die alte Avatar-Komponente implementiert wurde.

## Testdateien

- **profile-image-test-plan.md**: Vollständiger Testplan mit manuellen Tests für alle Funktionen der ProfileImage-Komponente
- **profile-image-tests.js**: React-Komponente zur visuellen Überprüfung der ProfileImage-Darstellung
- **cache-update-test.js**: React-Komponente zur Überprüfung der Cache-Funktionalität

## Testanleitung

### 1. Manuelle Tests

Die Datei `profile-image-test-plan.md` enthält einen detaillierten Testplan mit verschiedenen Testfällen. Folge den dort beschriebenen Schritten, um die ProfileImage-Komponente zu testen, und dokumentiere die Ergebnisse.

### 2. Visuelle Tests

Um die visuellen Tests durchzuführen:

1. Kopiere den Inhalt von `profile-image-tests.js` in eine temporäre Komponente in der App
2. Importiere diese Komponente in einen Testbildschirm
3. Führe die App aus und überprüfe die Darstellung der ProfileImage-Komponente unter verschiedenen Bedingungen

### 3. Cache-Tests

Um die Cache-Funktionalität zu testen:

1. Kopiere den Inhalt von `cache-update-test.js` in eine temporäre Komponente in der App
2. Importiere diese Komponente in einen Testbildschirm
3. Führe die App aus und teste, ob der Cache wie erwartet funktioniert
4. Überprüfe, ob die Funktion `updateProfileImageCache` korrekt arbeitet

## Tipps für das Testen

- Teste die ProfileImage-Komponente auf verschiedenen Geräten/Simulatoren (iOS und Android)
- Überprüfe besonders die Interaktion zwischen verschiedenen Komponenten, die ProfileImage verwenden
- Achte auf Performanceprobleme, insbesondere bei der Cache-Funktionalität
- Überprüfe, ob Legacy-Code-Pfade korrekt funktionieren

## Vorgehen bei Problemen

Falls während der Tests Probleme auftreten:

1. Dokumentiere das Problem detailliert (inkl. Screenshots, Fehlermeldungen etc.)
2. Isoliere das Problem durch gezielte Tests
3. Überprüfe die Implementierung der ProfileImage-Komponente in `shared-components/media/ProfileImage.tsx`
4. Bei Cache-Problemen überprüfe die `updateProfileImageCache`-Funktion und den `ProfileImageCacheProvider` 