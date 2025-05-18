# Hooks

Diese Verzeichnis enthält alle React Hooks, die in der Anwendung verwendet werden.

## Struktur

- Jeder Hook sollte in einer eigenen Datei definiert sein.
- Der Export aller Hooks erfolgt zentral über die `index.ts`.
- Tests für Hooks sollten im `__tests__`-Ordner platziert werden.

## Hooks-Kategorien

### Basis-Hooks

- `useMode`: Grundlegender Hook für alle Modus-bezogenen Operationen
- `useAuth`: Authentifizierung und Benutzerverwaltung
- `useErrorHandler`: Zentralisierte Fehlerbehandlung

### Erweiterte Hooks

- `useModeManager`: Erweiterter Mode-Hook mit zusätzlichen Funktionen
- `useTheme`: Theming und Design-System-Integration
- `useFeatureFlag`: Feature-Flag-Management

## Migrationsstrategie

Die Anwendung durchläuft eine schrittweise Migration von veralteten zu neuen Hooks. Dabei wird folgende Strategie verwendet:

### Kompatibilitätsschicht

Um Breaking Changes zu vermeiden, bieten wir eine Kompatibilitätsschicht in `./compat/`:

- Legacy-Hooks werden durch neue Implementierungen ersetzt, die die alte Schnittstelle nachbilden
- Alte Schnittstellen werden weiterhin exportiert, verwenden aber intern die neuen Hooks
- Alte Hooks sind als `@deprecated` markiert und geben Warnungen aus

### Verwendungsrichtlinien

- **Für bestehenden Code**: Weiterhin die bekannten Hook-Importe verwenden
- **Für neuen Code**: Neue Hooks direkt importieren und verwenden
- **Migrationsreihenfolge**: Komponente für Komponente aktualisieren

### Migrationsplan

1. Kompatibilitätsschicht für kritische Hooks erstellen ✅
2. Neue Komponenten immer mit neuen Hooks entwickeln ✅
3. Bestehende Komponenten schrittweise migrieren
4. Nach vollständiger Migration: Kompatibilitätsschicht entfernen

## Hooks-Dokumentation

### Mode-Hooks

Die Anwendung verwendet ein spezialisiertes Mode-System, das nur im DevBuild implementiert ist:

- **useMode**: Basis-Hook für Mode-Operationen (State, Wechsel, Events)
- **useModeManager**: Erweiterter Hook für komplexe Use-Cases
- **useDemoModeStatus**: [Veraltet] Kompatibilitäts-Hook für Demo-Modus
- **useAppModeManager**: [Veraltet] Kompatibilitäts-Hook für erweitertes Mode-Management

### UI-Hooks

- **useTheme**: Zugriff auf das aktuelle Theme
- **useColorScheme**: System-Farbschema (hell/dunkel)
- **useThemeColor**: Dynamische Farbberechnungen

## Verfügbare Hooks

### Mode-Hooks

- `useMode` - Zentraler Hook für alle Mode-bezogenen Operationen, einschließlich Zustandsmanagement, Modus-Wechsel und Event-Handling.
- `useModeManager` - Erweiterter Hook für komplexe Mode-Szenarien mit zusätzlicher UI-Integration und Performance-Optimierungen.
- `useDemoModeStatus` - **(Legacy)** Bietet Funktionen zur Verwaltung des Demo-Modus. Nutze stattdessen `useMode`.

### UI-Hooks

- `useTheme` - Bietet Zugriff auf das aktuelle Farbschema der Anwendung.
- `useThemeColor` - Gibt die passende Farbe für das aktuelle Farbschema zurück.
- `useColorScheme` - Gibt das System-Farbschema (hell/dunkel) zurück.

### Utility-Hooks

- `useErrorHandler` - Zentralisiert die Fehlerbehandlung in der Anwendung.
- `useFeatureFlag` - Prüft, ob ein bestimmtes Feature aktiviert ist.
- `usePhotoSelection` - Vereinfacht die Auswahl von Fotos aus der Medienbibliothek oder Kamera.
- `useTabScreen` - Vereinfacht die Navigation zwischen verschiedenen Tab-Screens.
- `useAuth` - Bietet Funktionen für die Authentifizierung und Benutzerverwaltung.

## Hook-Hierarchie

Die Mode-bezogenen Hooks folgen einer Hierarchie:

1. **useMode** - Basis-Hook für grundlegende Mode-Operationen
2. **useModeManager** - Erweiterter Hook für komplexe Anwendungsfälle
3. **useDemoModeStatus** - Legacy-Hook (wird durch die oben genannten ersetzt)

## Grundlegende Prinzipien

Bei der Erstellung von Hooks sollten folgende Prinzipien beachtet werden:

1. **Einzelverantwortlichkeit**: Ein Hook sollte eine klar definierte Aufgabe haben.
2. **Wiederverwendbarkeit**: Hooks sollten so gestaltet sein, dass sie in verschiedenen Komponenten verwendet werden können.
3. **Lesbarkeit**: Hooks sollten leicht zu verstehen und zu verwenden sein.
4. **Konsistenz**: Hooks sollten einen konsistenten Namensstil verwenden (z.B. `useXXX`).
5. **Dokumentation**: Jeder Hook sollte dokumentiert sein, einschließlich Zweck, Parameter und Rückgabewerte.

## Best Practices

- Verwende die Hooks immer über die zentrale `index.ts` und nicht direkt über die Quelldateien.
- Füge neue Hooks immer zu `index.ts` hinzu, um sie zentral verfügbar zu machen.
- Komplexere Hooks sollten in eigene Dateien ausgelagert werden.
- Dokumentiere alle öffentlichen Hooks mit JSDoc-Kommentaren.
- Trenne UI-Logik und Geschäftslogik in separaten Hooks.
- Stelle aussagekräftige TypeScript-Typdefinitionen für alle Hook-Schnittstellen bereit.

## Migration von Legacy-Hooks

Einige Hooks sind als "Legacy" markiert und werden in zukünftigen Versionen durch neuere, besser strukturierte Hooks ersetzt. Insbesondere:

- `useDemoModeStatus` wird durch `useMode` ersetzt
- `useAppModeManager` wird durch `useModeManager` ersetzt

Bei der Verwendung von Hooks wird empfohlen, immer die neuesten nicht als "Legacy" markierten Hooks zu verwenden.

## Tests

Alle Hooks sollten mit Jest und React Testing Library getestet werden. Die Tests sollten in einem separaten Verzeichnis `__tests__` neben dem Hook platziert werden.

## Struktur

```
hooks/
  ├── ui/                  # UI-bezogene Hooks
  │   ├── useColorScheme.ts  # Hook für das Farbschema
  │   ├── useThemeColor.ts   # Hook für Theme-Farben
  │   └── ...               # Weitere UI-Hooks
  ├── index.ts             # Re-Export aller Hooks
  └── README.md            # Diese Datei
```

## Verwendung

```typescript
import { useMode, useModeManager } from "@/hooks";

function MyComponent() {
  // Basis-Mode-Hook für einfache Anwendungsfälle
  const { isDemoMode, toggleAppMode } = useMode();

  // Erweiterter Mode-Hook für komplexere Anwendungsfälle
  const { switchToLiveMode, canSwitchToLiveMode, isSessionValid } =
    useModeManager();

  return (
    <View>
      <Text>{isDemoMode ? "Demo-Modus aktiv" : "Live-Modus aktiv"}</Text>

      {/* Einfacher Modus-Wechsel mit Basis-Hook */}
      <Button title="Modus wechseln" onPress={() => toggleAppMode()} />

      {/* Komplexer Modus-Wechsel mit erweitertem Hook */}
      {canSwitchToLiveMode && (
        <Button
          title="Zu Live wechseln"
          onPress={async () => {
            const result = await switchToLiveMode();
            if (!result.success) {
              // Fehlerbehandlung...
            }
          }}
        />
      )}
    </View>
  );
}
```

## Regeln für das Erstellen neuer Hooks

1. **Einfache Verantwortlichkeit**: Jeder Hook sollte nur für eine Sache zuständig sein
2. **TypeScript**: Alle Hooks sollten typisiert sein
3. **Dokumentation**: Jeder Hook sollte mit JSDoc-Kommentaren dokumentiert sein
4. **Namenskonvention**: Hooks sollten mit `use` beginnen
5. **Testbarkeit**: Hooks sollten einfach zu testen sein
