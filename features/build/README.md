# Build-Feature

Dieses Feature bietet ein System zur Verwaltung von Build-Typen in der App, was die Unterstützung von verschiedenen Ausführungsumgebungen (Entwicklung, Demo, Produktion) ermöglicht.

## Dokumentation

Detaillierte Dokumentation für dieses Feature findest du im [docs](./docs/) Verzeichnis:

- [BUILD-ANLEITUNG.md](./docs/BUILD-ANLEITUNG.md) - Wie die App mit verschiedenen Build-Typen gestartet wird
- [BUILD-FEATURE.md](./docs/BUILD-FEATURE.md) - Technische Dokumentation des Build-Features

## Hauptfunktionen

- Konfiguration und Management verschiedener Build-Typen (dev, demo, live)
- Umgebungsvariablen-Verwaltung
- UI-Komponenten zur Anzeige von Build-Informationen
- React Hooks für den Zugriff auf Build-Informationen
- Build-spezifische Hilfsfunktionen

## Verwendung

```typescript
// Build-Service verwenden
import { BuildService } from '@/features/build';

if (BuildService.isDevBuild()) {
  // Dev-spezifischer Code
}

// Build-Informationen in Komponenten verwenden
import { useBuildType } from '@/features/build';

function MyComponent() {
  const { buildType, isDevBuild } = useBuildType();
  
  return (
    <View>
      <Text>Current Build: {buildType}</Text>
      {isDevBuild && <Text>Dev-only content</Text>}
    </View>
  );
} 