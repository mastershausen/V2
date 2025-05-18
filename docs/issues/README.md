# Dokumentierte Issues

Dieses Verzeichnis enthält Dokumentation zu identifizierten Issues in der Codebasis, die im Rahmen der Refactoring- und Verbesserungsarbeiten behoben werden sollten.

## Hardcodierte Werte

Als Teil der Styling-Optimierung wurden hardcodierte Werte in der Codebasis identifiziert, die in das zentrale Theme-System migriert werden sollten. Die folgenden Dateien dokumentieren diese Issues:

- [SolvboxAI Hardcodierte Werte](./solvboxai-hardcoded-values.md) - Dokumentiert hardcodierte Style-Werte im SolvboxAI-Feature

## Warum werden diese Issues dokumentiert?

Die Dokumentation dieser Issues dient mehreren Zwecken:

1. **Konsistenz**: Durch die Migration hardcodierter Werte in ein zentrales Theme-System wird die visuelle Konsistenz der Anwendung verbessert.
2. **Wartbarkeit**: Änderungen an Design-Tokens können zentral vorgenommen werden, statt verstreute Werte im Code zu suchen.
3. **Dark Mode**: Vorbereitung für Dark Mode-Unterstützung durch Verwendung dynamischer Theme-Werte.
4. **Responsivität**: Verbesserte Responsivität durch Verwendung relativer statt absoluter Werte.
5. **Typsicherheit**: Erhöhte Typsicherheit durch Verwendung von TypeScript und Style-Utilities.

## Wie man die Issues behebt

Für jedes dokumentierte Issue sollten folgende Schritte unternommen werden:

1. Identifiziere die betroffenen Dateien und Stellen im Code
2. Überprüfe, ob bereits passende Werte im Theme-System existieren
3. Erstelle neue Theme-Werte falls nötig (in `sizes.ts`, `typography.ts`, etc.)
4. Ersetze die hardcodierten Werte durch Referenzen auf das Theme-System
5. Verwende die Style-Utilities aus `styleUtils.ts` für verbesserte Typsicherheit
6. Teste die Änderungen auf visueller Konsistenz

Jedes behobene Issue sollte mit einem eigenen Commit abgeschlossen werden, der klar dokumentiert, welches Problem behoben wurde.
