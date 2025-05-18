# Build-Feature Dokumentation

## Überblick

Das Build-Feature ist ein zentrales System zur Verwaltung verschiedener Build-Typen in der Anwendung. Es stellt eine einheitliche Schnittstelle für den Zugriff auf Build-spezifische Konfigurationen und Verhaltensweisen bereit.

## Verfügbare Build-Typen

Die Anwendung unterstützt folgende Build-Typen:

| Build-Typ | Beschreibung | Verwendung |
|-----------|--------------|------------|
| **dev**   | Entwicklungs-Build | Für lokale Entwicklung und Testing |
| **demo**  | Demo-Build | Für Vorführungen ohne echtes Backend |
| **live**  | Live-Build | Für produktiven Einsatz mit Backend-Integration |
| **staging** | Staging-Build | Für Testen in einer produktionsnahen Umgebung |

## Architektur des Build-Features

Das Build-Feature besteht aus folgenden Hauptkomponenten:

```
features/build/
  ├── components/      # UI-Komponenten
  ├── config/          # Konfigurationen 
  ├── hooks/           # React Hooks
  ├── services/        # Dienste 
  ├── types/           # Typdefinitionen
  ├── utils/           # Hilfsfunktionen
  └── index.ts         # Hauptexport
```

### Wichtige Komponenten

#### Types

Die zentralen Typdefinitionen in `types/index.ts` definieren:

```typescript
export type BuildType = 'dev' | 'demo' | 'live' | 'staging';

export interface BuildConfig {
  name: string;
  description: string;
  defaultMode: AppMode;
  canSwitchMode: boolean;
  debugEnabled: boolean;
  useMockData: boolean;
  apiBase: string;
  persistData: boolean;
}

export interface EnvironmentInfo {
  buildType: BuildType;
  isDevelopment: boolean;
  apiBaseUrl: string;
  debugEnabled: boolean;
}
```

#### Konfiguration

Die Konfiguration in `config/buildConfigs.ts` enthält die Einstellungen für alle Build-Typen. Die Umgebungsvariablen werden in `config/environment.ts` geladen und verwaltet.

#### Services

Der `BuildService` in `services/BuildService.ts` bietet statische Methoden zum Zugriff auf Build-Informationen:

```typescript
BuildService.getCurrentBuildType()
BuildService.isDevBuild()
BuildService.isDemoBuild()
BuildService.isLiveBuild()
BuildService.canSwitchAppMode()
// ...
```

#### Hooks

Der `useBuildType` Hook in `hooks/useBuildType.ts` erlaubt React-Komponenten den Zugriff auf Build-Informationen.

Der `useBuildInfo` Hook und die `BuildInfoDisplay`-Komponente in `hooks/useBuildInfo.tsx` bieten Debug-Informationen in der UI.

#### Hilfskomponenten

Die `BuildIndicator`-Komponente zeigt einen Build-Typ-Indikator in der UI an.

#### Hilfsfunktionen

Die Build-Hilfsfunktionen in `utils/buildHelpers.ts` ermöglichen build-spezifisches Verhalten:

```typescript
executeInDevBuild(() => {
  // Code, der nur im Dev-Build ausgeführt wird
})

executeInLiveBuild(() => {
  // Code, der nur im Live-Build ausgeführt wird
})
```

## Verwendung des Build-Features

### Build-Typ-spezifisches Verhalten implementieren

```typescript
import { BuildService } from '@/features/build';

function doSomething() {
  if (BuildService.isDevBuild()) {
    // Dev-Build spezifische Logik
  } else if (BuildService.isDemoBuild()) {
    // Demo-Build spezifische Logik
  } else if (BuildService.isLiveBuild()) {
    // Live-Build spezifische Logik
  }
}
```

### Build-Informationen in React Komponenten verwenden

```tsx
import { useBuildType } from '@/features/build';

function MyComponent() {
  const { buildType, isDevBuild, isDemoBuild, isLiveBuild } = useBuildType();
  
  return (
    <View>
      <Text>Current Build: {buildType}</Text>
      {isDevBuild && <Text>Dev-Build spezifischer Inhalt</Text>}
    </View>
  );
}
```

### Build-Debug-Anzeige verwenden

```tsx
import { BuildInfoDisplay } from '@/features/build';

function App() {
  return (
    <>
      <BuildInfoDisplay />
      {/* Restliche App-Komponenten */}
    </>
  );
}
```

### Build-Typ anzeigen

```tsx
import { BuildIndicator } from '@/features/build';

function Header() {
  return (
    <View>
      <Text>App-Header</Text>
      <BuildIndicator />
    </View>
  );
}
```

## Konfiguration 

Der Build-Typ wird über die `BUILD_TYPE` Umgebungsvariable konfiguriert. Diese Variable wird aus den `.env`-Dateien geladen.

Alle Build-Konfigurationen können in `buildConfigs.ts` angepasst werden.

## Fehlerbehebung

Wenn `process.env.BUILD_TYPE` nicht korrekt gesetzt ist, wird die App standardmäßig auf den in `DEFAULT_BUILD_TYPE` definierten Wert zurückfallen, in der Regel 'dev'.

Die `BuildInfoDisplay`-Komponente kann genutzt werden, um den aktuellen Build-Typ und die zugehörigen Konfigurationen anzuzeigen.

## Beispiel: Starten verschiedener Build-Typen

```bash
# Development Build
npm run start:dev

# Demo Build
npm run start:demo

# Live Build
npm run start:live
``` 